import { Link } from "react-router"
import type { Post } from "./PostList"

const PostItem = ({post}:{post:Post}) => {
  return (
  <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          <div className="flex items-center space-x-2">
          {/* Header: Avatar and Title */}
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2">
                {post.title}
              </div>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto"
            />
          </div>
        <div className="flex items-center justify-around">
          <div>
            <span>❤</span>
            <span>{post.like_count??0}</span>
          </div>
          {/* <span>💭</span> */}
          <div className="flex items-center gap-1">
          <img src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f4ac.svg" alt="Google (Noto Color Emoji 16.0)" width="17" height="17"></img>
          <span>{post.comment_count??0}</span>
          </div>
        </div>
        </div>
      </Link>
    </div>
     )
}

export default PostItem