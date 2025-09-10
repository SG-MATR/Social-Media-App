import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";

interface Props{
  postId:number
}
export interface NewComment {
  content:string,
  parent_comment_id: number|null
}
export interface Comment{
  id:number,
  post_id:number,
  user_id:string,
  content:string,
  parent_comment_id:number,
  author:string,
  created_at:string
}



const addComment = async(newComment:NewComment,postId:number,userId:string,author:string)=>{
  if(!userId||!author) throw new Error('You must be log in');
  const {error} = await supabase.from("comments").insert({content:newComment.content,parent_comment_id:newComment.parent_comment_id||null,post_id:postId,user_id:userId,author:author});
  if(error) throw new Error(error.message)
}

const getAllCommments = async (postId:number):Promise<Comment[]> =>{
  const {data,error} = await supabase.from("comments").select("*").eq("post_id",postId).order("created_at",{ascending:true});
  if(error) throw new Error(error.message);
  return data as Comment[]
}

const CommentSection = ({postId}:Props) => {
  const {user} = useAuth();
  const [newComment,setNewComment] = useState('');
  const queryClient = useQueryClient()
  // add comments
 const { mutate, isPending, isError } = useMutation({
  mutationFn: (newComment: NewComment) => {
    if (!user) throw new Error("You must be logged in");
    return addComment(
      newComment,
      postId,
      user.id,
      user.user_metadata.user_name
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  },
});
  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    if(!newComment) return;
    mutate({content:newComment,parent_comment_id:null});
    setNewComment("")
  }
  // get all comments
  const {data:comments,isLoading,error} = useQuery<Comment[],Error>({
    queryKey:["comments", postId],
    queryFn:()=>{
      if(!user) throw new Error('Your must log in')
      return getAllCommments(postId)
    },
    enabled: !!user, // only run the query if user exists
  });
  // (Comment&{children:Comment[]})[] : means if the comment not have children return the comment and if the comment has children return the comment with it's children
  // it is return arr[comment] if not have children 
  // it is return arr[comment[arr[childrenComment]]] if the comment has childrens
  // to can achieve this logic you use Map() 
  const buildCommentsTree = (flatsComments:Comment[]):(Comment&{children?:Comment[]})[]=>{
    const map = new Map<number, Comment&{children?:Comment[]}>();
    // roots comment : the main comments which the top level of comments | the comments that haven't a parent
    const roots:(Comment&{children?:Comment[]})[]= [];
    /* the return of this foreach will be >> 
    {
      1:{comment,[]},
      2:{comment,[]},
    }
    */
   flatsComments.forEach((comment)=>{
     map.set(comment.id,{...comment,children:[]})
    })
    // this loop is for to get the comments that have parent and go to parent and get into chidren array and push this chidren
    flatsComments.forEach((comment)=>{
      // check if the child has parent id
      if(comment.parent_comment_id){
        const parent = map.get(comment.parent_comment_id);
        // if the parent exist
        if(parent){
          // push the child with it is data to the children array which in the parent
          parent.children!.push(map.get(comment.id)!)
        }
        // else ,if this is comment not have parent it is means it is a root comment ,so push it in the root comments
        
      }
      else{
        // push the all commit object to the array to can use it
        roots.push(map.get(comment.id)!)
      }
    })
    return roots
  }

  const commentTree = comments ? buildCommentsTree(comments):[];
  console.log(commentTree)
  if (isLoading) return <div>Loading Comments ...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {/* Create Comments Section */}
      {
        user ? 
        (
          <form onSubmit={handleSubmit} className="mb-4">
            <textarea rows={3} placeholder="write a comment" onChange={(e)=>setNewComment(e.target.value)} value={newComment} className="w-full border border-white/10 bg-transparent p-2 rounded"/>
            <button type="submit" disabled={!newComment} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer ">{isPending?"Posting...":"Post Comment"}</button>
            {isError&&<p className="text-red-500 mt-2">Error Posting Comment ...</p>}
          </form>
        )
        :(<p className="mb-4 text-gray-600">You must logged in to like a post or to post a comment</p>)
      }
      {/* Display All Comments */}
      <div className="space-y-4">
        {commentTree.map((comment)=>(
          <CommentItem comment={comment} postId={postId}/>
        ))}
      </div>
    </div>
  )
}

export default CommentSection