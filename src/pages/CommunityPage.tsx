// import { useParams } from "react-router";
import CommunityDisplayPosts from "../components/CommunityDisplayPosts";

const CommunityPage = () => {
//   const {id} = useParams<{id:string}>();

  return (
    <div className="pt-20">
        <CommunityDisplayPosts/>
    </div>
  )
}

export default CommunityPage