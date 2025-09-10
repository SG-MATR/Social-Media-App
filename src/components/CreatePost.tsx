import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { supabase } from "../supabase-client"
import { useAuth } from "../context/AuthContext"
import { getAllCommunities, type Community } from "./CommunitiesList"

interface PostInput{
    title:string,
    content:string,
    avatar_url:string|null,
    community_id:number|null
}

const createPost = async (post:PostInput,imageFile:File)=>{
    // create a unique path to know the storage of all images
    const filePath = `${post.title}-${post.content}-${imageFile.name}`;
    // upload the image to the storage 
    const {error:uploadError} = await supabase.storage.from("post-images").upload(filePath,imageFile)
    // get image_url from the storage to connect it to the post table 
    const {data:urlData}  = await supabase.storage.from("post-images").getPublicUrl(filePath)
    // add post data + image_url 
    const {data,error} = await supabase.from('posts').insert({...post,image_url:urlData.publicUrl});
    if (uploadError) throw new Error(uploadError.message);
    if (error) throw new Error(error.message);
    return data;
}

const CreatePost = () => {
  const [title,setTitle]= useState('')  
  const [content,setContent]= useState('');
  const [file,setFile]= useState<File|null>(null);
  const [communityState,setCommunityState] = useState<number|null>(null)
  const {user}= useAuth();

  // get all communities
   const {data:communities}= useQuery<Community[],Error>({
    queryKey:["communities"],
    queryFn: getAllCommunities
    });

  const {mutate,isPending,isError} = useMutation({
    mutationFn:(data:{post:PostInput,imageFile:File})=>{
       return createPost(data.post,data.imageFile)
    }
  });
  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files&&e.target.files[0]){
        setFile(e.target.files[0])
    }
  }   
  const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
    // e.target.value always string so you should cast it to number before you save in the database because communiyt_id is number
    const value = e.target.value
    setCommunityState(value?Number(value):null);
   
  }
  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    if(!file)return;
    mutate({post:{title,content,avatar_url:user?.user_metadata.avatar_url||null,community_id:communityState},imageFile:file})
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-2">
        <div>
            <label className="block mb-2 font-medium"> Title</label>
            <input type="text" id="title" required onChange={(e)=>setTitle(e.target.value)} className="w-full border border-white/10 bg-transparent p-2 rounded" />
        </div>
        <div>
            <label className="block mb-2 font-medium"> Content</label>
            <textarea id="content" required rows={5} onChange={(e)=>setContent(e.target.value)} className="w-full border border-white/10 bg-transparent p-2 rounded"/>
        </div>
        <div>
          <label>Select Community</label>
          <select onChange={handleSelectChange}>
            <option value={""}>-- Choose Community --</option>
            {communities?.map((community)=>(
              <option key={community.id} value={community.id}>{community.name}</option>
            ))}
          </select>
        </div>
        <div>
            <label className="block mb-2 font-medium"> Upload Image</label>
            <input type="file" id="image" accept="image/*" required onChange={handleFileChange} className="w-full text-gray-200"/>
        </div>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">{isPending?"Creating...":"Create Post"}</button>
        {isError&&<p className="text-red-500">Error Creating Post .</p>}
    </form>
  )
}

export default CreatePost