import { useEffect, useState } from 'react'
import { getAllBlogsAPI } from '@/apis/blog'
import BlogCard from './BlogCard'
import BlogCreate from './BlogCreate'
import { Button } from '../../ui/button'

const CATEGORIES = ['All Posts', 'Dogs', 'Cats']

const BlogList = () => {
    const [blogs, setBlogs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All Posts')
    const [loading, setLoading] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalPages: 1,
        totalResults: 0
    })

    useEffect(() => {
        fetchBlogs()
    }, [selectedCategory])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const params = selectedCategory !== 'All Posts' ? { category: selectedCategory } : {}
            const res = await getAllBlogsAPI(params)
            if (res.data.success || res.data.status === 200) {
                setBlogs(res.data.data.results)
                setPagination({
                    page: res.data.data.page,
                    limit: res.data.data.limit,
                    totalPages: res.data.data.totalPages,
                    totalResults: res.data.data.totalResults
                })
            }
        } catch (error) {
            console.error('Error fetching blogs:', error)
            setError('Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.')
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
    }

    const handleCreateSuccess = () => {
        setOpenCreate(false)
        fetchBlogs()
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600">PET BLOG</h1>
                        <p className="text-gray-600 mt-1">
                            Tổng số bài viết: {pagination.totalResults}
                        </p>
                    </div>
                    <Button onClick={() => setOpenCreate(true)}>Create New Blog</Button>
                </div>

                <div className="flex space-x-4 mb-6 overflow-x-auto">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded transition-colors duration-200 ${selectedCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : blogs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    onBlogDeleted={fetchBlogs}
                                />
                            ))}
                        </div>
                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                {/* Có thể thêm phân trang ở đây nếu cần */}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        Không có bài viết nào trong danh mục này
                    </div>
                )}

                <BlogCreate
                    open={openCreate}
                    setOpen={setOpenCreate}
                    onSuccess={handleCreateSuccess}
                />
            </div>
        </div>
    )
}

export default BlogList 