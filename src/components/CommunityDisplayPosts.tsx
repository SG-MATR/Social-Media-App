import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";
import type { Post } from "./PostList";

interface PostWithCommunity extends Post{
  community_name:string
}

const getCommunityPosts = async(id:number):Promise<PostWithCommunity[]>=>{
    // const {data,error}= await supabase.from("posts").select("*,communities(name)").eq("community_id",id);
    const {data,error} = await supabase.rpc("get_posts_with_counts_community",{community_id :id})
    if(error) throw new Error(error.message);
    
    return data as PostWithCommunity[]
}
const CommunityDisplayPosts = () => {
  const {id} = useParams<{id:string}>()
  const {data,isLoading,error} = useQuery<PostWithCommunity[],Error>({
    queryKey:["community",id],
    queryFn:()=>getCommunityPosts(Number(id))
  });
  console.log(data)
   if(isLoading) {
        return <div className="text-center py-4">Loading Communities...</div>
    }
    if(error){
        return <div className="text-center text-red-500 py-4">Error:{error.message}</div>
    }
  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{data&&data[0]?.community_name}:Community Posts</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {
        data&&data.length>0?
        (data?.map((post)=>(
          <PostItem post={post} key={post.id}/>
        ))):(<p>No posts in this community yet.</p>)

        
        }
        
      </div>
    </div>
  )
}

export default CommunityDisplayPosts