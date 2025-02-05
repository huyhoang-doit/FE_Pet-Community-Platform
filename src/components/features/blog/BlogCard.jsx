import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { calculateTimeAgo } from '@/utils/calculateTimeAgo'
import { useSelector } from 'react-redux'
import { deleteBlogAPI } from '@/apis/blog'
import { toast } from 'sonner'
import VerifiedBadge from '../../core/VerifiedBadge'

const BlogCard = ({ blog, onBlogDeleted }) => {
    const { user } = useSelector((state) => state.auth)
    const isAuthor = user?.id === blog.author._id

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const res = await deleteBlogAPI(blog._id)
                if (res.data.success) {
                    toast.success(res.data.message)
                    onBlogDeleted()
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={blog.author.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{blog.author.username}</span>
                            {blog.author.isVerified && <VerifiedBadge size={14} />}
                        </div>
                        <span className="text-xs text-gray-500">
                            {calculateTimeAgo(blog.createdAt)}
                        </span>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.content}</p>

                <div className="flex items-center justify-between">
                    <Link
                        to={`/blog/${blog._id}`}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Read more
                    </Link>
                    {isAuthor && (
                        <div className="flex gap-2">
                            <Link
                                to={`/blog/${blog._id}/edit`}
                                className="text-gray-500 hover:text-gray-600"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

BlogCard.propTypes = {
    blog: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            profilePicture: PropTypes.string,
            isVerified: PropTypes.bool
        }).isRequired
    }).isRequired,
    onBlogDeleted: PropTypes.func.isRequired
}

export default BlogCard 