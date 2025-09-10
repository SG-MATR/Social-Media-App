import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  // check if the current use give a like or not
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();
  // if the current user give a like and press (like button) again ,then delete this like from database
  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase.from("votes").delete().eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } 
    // if the current user had liked the post and then press the (dislike) button ,so it will update the value from like to dislike (from 1 to -1)
    else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  }
  // if the current first time to like or dislike the post ,then add it to the database
  else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);  
  }
};

const getVotesForASpecificPost = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId); // ✅ fixed bug

  if (error) throw new Error(error.message);
  return data as Vote[];
};

const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate,error:createError } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must log in");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vote", postId] });
    },
  });

  const { data: votes, isLoading, error } = useQuery<Vote[], Error>({
    queryKey: ["vote", postId],
    queryFn: () => getVotesForASpecificPost(postId),
  });

  if (isLoading) return <div>Loading votes ...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // get all post likes from different users and count them
  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  // get all post dislikes from different users and count them
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  // any insert or update check secuirty of the user
  const userVote = votes?.find((v)=>v.user_id===user?.id)?.vote;// return the value of the vote (1,-1)
  return (
    <div className="flex items-center space-x-4 my-4">
      <button className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${userVote===1?"bg-green-500 text-white":"bg-gray-200 text-black"}`} onClick={() => mutate(1)}>👍 {likes}</button>
      <button className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${userVote===-1?"bg-green-500 text-white":"bg-gray-200 text-black"}`} onClick={() => mutate(-1)}>👎 {dislikes}</button>
      {createError&&<p className="text-red-500 mt-2">You must logged in.</p>}
    </div>
  );
};

export default LikeButton;
