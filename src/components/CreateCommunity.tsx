import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { supabase } from "../supabase-client"
import { useNavigate } from "react-router"

interface CommunityInput{
    name:string,
    description:string
}

const createCommunity = async (community:CommunityInput)=>{
    const {data,error} = await supabase.from('communities').insert(community);
    if (error) throw new Error(error.message);
    return data;
}
const CreateCommunity = () => {
  const [name,setName]= useState('')  
  const [description,setDescritpion]= useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const {mutate,isPending,isError} = useMutation({
    mutationFn:(community:CommunityInput)=>{
       return createCommunity(community)
    },
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["communities"]})
        navigate('/communities')
    }
  });
   
  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    mutate({name,description})
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-2">
        <div>
            <label className="block mb-2 font-medium">Community Name</label>
            <input type="text" id="name" required onChange={(e)=>setName(e.target.value)} className="w-full border border-white/10 bg-transparent p-2 rounded" />
        </div>
        <div>
            <label className="block mb-2 font-medium"> Description</label>
            <textarea id="description" required rows={5} onChange={(e)=>setDescritpion(e.target.value)} className="w-full border border-white/10 bg-transparent p-2 rounded"/>
        </div>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">{isPending?"Creating...":"Create Community"}</button>
        {isError&&<p className="text-red-500">Error Creating Community .</p>}
    </form>
  )
}

export default CreateCommunity