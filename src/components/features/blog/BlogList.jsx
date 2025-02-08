import { useEffect, useState } from 'react'
import { getAllBlogsAPI, deleteBlogAPI } from '@/apis/blog'
import BlogCard from './BlogCard'
import BlogCreate from './BlogCreate'
import { Button } from '../../ui/button'

const CATEGORIES = ['All Posts', 'Dogs', 'Cats']

const BlogList = () => {
    const [blogs, setBlogs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All Posts')
    const [loading, setLoading] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)

    useEffect(() => {
        fetchBlogs()
    }, [selectedCategory])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const params = selectedCategory !== 'All Posts' ? { category: selectedCategory } : {}
            const res = await getAllBlogsAPI(params) // Lấy tất cả blog
            if (res.data.success) {
                setBlogs(res.data.data.docs)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Thêm hàm để tạo blog
    const handleCreateBlog = async (formData) => {
        try {
            await createBlogAPI(formData) // Tạo blog mới
            fetchBlogs() // Cập nhật danh sách blog
        } catch (error) {
            console.log(error)
        }
    }

    // Thêm hàm để xóa blog
    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlogAPI(id) // Xóa blog theo ID
            fetchBlogs() // Cập nhật danh sách blog
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600">PET BLOG</h1>
                <Button onClick={() => setOpenCreate(true)}>Create New Blog</Button>
            </div>

            <div className="flex space-x-4 mb-6 overflow-x-auto">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded ${selectedCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} onBlogDeleted={fetchBlogs} />
                    ))}
                </div>
            )}

            <BlogCreate open={openCreate} setOpen={setOpenCreate} />
        </div>
    )
}

export default BlogList 