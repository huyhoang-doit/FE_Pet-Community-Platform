import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBlogByIdAPI, likeBlogAPI, dislikeBlogAPI, commentBlogAPI } from '@/apis/blog'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { calculateTimeAgo } from '@/utils/calculateTimeAgo'
import VerifiedBadge from '../../core/VerifiedBadge'
import { useSelector } from 'react-redux'
import { FaHeart, FaRegHeart, FaBookmark } from 'react-icons/fa'
import { LuBookmark } from 'react-icons/lu'
import { MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'

const BlogDetail = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const { user } = useSelector((store) => store.auth)

    useEffect(() => {
        fetchBlog()
    }, [id])

    const fetchBlog = async () => {
        try {
            const res = await getBlogByIdAPI(id)
            if (res.data.success) {
                setBlog(res.data.data)
                setLiked(res.data.data.likes.includes(user?.id))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        try {
            const api = liked ? dislikeBlogAPI : likeBlogAPI
            const res = await api(id)
            if (res.data.success) {
                setLiked(!liked)
                fetchBlog() // Refresh blog data
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    const handleComment = async () => {
        if (!comment.trim()) return
        try {
            const res = await commentBlogAPI(id, comment)
            if (res.data.success) {
                setComment('')
                fetchBlog() // Refresh blog data
                toast.success('Comment added successfully')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    if (loading) return <div>Loading...</div>
    if (!blog) return <div>Blog not found</div>

    return (
        <div className="my-8 w-full max-w-[850px] mx-auto border">
            <div className="flex h-[600px] bg-white">
                {/* Left side - Image */}
                <div className="w-[60%] bg-black">
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Right side - Details */}
                <div className="w-[40%] flex flex-col border-l">
                    {/* Header */}
                    <div className="flex items-center p-4 border-b">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={blog.author.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{blog.author.username}</span>
                                {blog.author.isVerified && <VerifiedBadge size={14} />}
                            </div>
                            <span className="text-sm text-gray-500">
                                {calculateTimeAgo(blog.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-y-auto p-4">
                        <h1 className="text-xl font-bold mb-2">{blog.title}</h1>
                        <p className="text-gray-800">{blog.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4">
                        <div className="flex justify-between mb-4">
                            <div className="flex space-x-4">
                                {liked ? (
                                    <FaHeart
                                        onClick={handleLike}
                                        className="w-6 h-6 text-red-500 cursor-pointer"
                                    />
                                ) : (
                                    <FaRegHeart
                                        onClick={handleLike}
                                        className="w-6 h-6 cursor-pointer"
                                    />
                                )}
                                <MessageCircle className="w-6 h-6 cursor-pointer" />
                                <Send className="w-6 h-6 cursor-pointer" />
                            </div>
                            {bookmarked ? (
                                <FaBookmark className="w-6 h-6 cursor-pointer" />
                            ) : (
                                <LuBookmark className="w-6 h-6 cursor-pointer" />
                            )}
                        </div>

                        <div className="mb-4">
                            <span className="font-semibold">{blog.likes?.length || 0} likes</span>
                        </div>

                        {/* Comments */}
                        <div className="max-h-40 overflow-y-auto mb-4">
                            {blog.comments?.map((comment) => (
                                <div key={comment._id} className="flex items-start mb-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={comment.author.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                        <span className="font-medium text-sm">{comment.author.username}</span>
                                        <span className="text-sm ml-2">{comment.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment input */}
                        <div className="flex items-center mt-4">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-grow text-sm focus:outline-none"
                            />
                            {comment && (
                                <button
                                    onClick={handleComment}
                                    className="text-blue-500 font-semibold ml-2"
                                >
                                    Post
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetail 