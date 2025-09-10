import { useState } from 'react';
import type {Comment, NewComment} from './CommentSection'
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
interface Props{
  comment: Comment & {children?: Comment[];}
  postId:number
}
const addComment = async(newReplay:NewComment,postId:number,userId:string,author:string)=>{
  if(!userId||!author) throw new Error('You must be log in');
  const {error} = await supabase.from("comments").insert({content:newReplay.content,parent_comment_id:newReplay.parent_comment_id||null,post_id:postId,user_id:userId,author:author});
  if(error) throw new Error(error.message)
}
const CommentItem = ({comment,postId}:Props) => {
  const [showReplay,setShowReplay] = useState<Boolean>(false);
  const [replayText,setReplayText] = useState<string>('');
  const [isCollapsed,setIsCollapsed] = useState<Boolean>(false)
  const {user} = useAuth();
  const queryClient = useQueryClient()
  const { mutate, isPending, isError } = useMutation({
  mutationFn: (newReplay: NewComment) => {
    if (!user) throw new Error("You must be logged in");
    return addComment(
      newReplay,
      postId,
      user.id,
      user.user_metadata.user_name
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  },
});
  const handleReplaySubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    if(!replayText) return;
    mutate({content:replayText,parent_comment_id:comment.id});
    setReplayText("");
    setShowReplay(false)
  }
  return (
  <div className='pl-4 border-l border-white/10'>
    <div className='mb-2'>
      <div className='flex items-center space-x-2'>
        {/* diplay the commenters username */}
        <span className='text-sm font-bold text-blue-400'>{comment.author}</span>
        <span className='text-xs text-gray-500'>{new Date(comment.created_at).toLocaleString()}</span>
      </div>
      <p className='text-gray-300'>{comment.content}</p>
      <button className='text-blue-500 text-sm mt-1' onClick={()=>setShowReplay((prev)=>!prev)}>{showReplay?"Cancel":"Replay"}</button>
    </div>
    {showReplay&&user&&(
      <form onSubmit={handleReplaySubmit} className="mb-2">
        <textarea rows={2} placeholder="write a replay" onChange={(e)=>setReplayText(e.target.value)} value={replayText} className="w-full border border-white/10 bg-transparent p-2 rounded"/>
        <button type="submit" disabled={!replayText} className="mt-1 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer ">{isPending?"Replaying...":"Replay Comment"}</button>
        {isError&&<p className="text-red-500">Error Posting Replay ...</p>}
      </form>
    )}
    {
      comment.children&&comment.children.length>0&&(
       <div>
        <button onClick={()=>setIsCollapsed((prev)=>!prev)} title={isCollapsed?"Hide Replies":"Show Replies"}>


       {!isCollapsed ? (
         <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
        </button>
        {
          !isCollapsed&&(
            <div className='space-y-2'>
              {
                comment.children.map((child)=>(
                  <CommentItem key={child.id} comment={child} postId={postId}/>
                ))
              }
            </div>
          )
        }
       </div>
      )
    }
  </div>
  )
}

export default CommentItem