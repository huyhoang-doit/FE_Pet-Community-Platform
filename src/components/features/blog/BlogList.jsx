
import { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/apis/blog";
import BlogCreate from "./BlogCreate";
import { Button, Card, Spin, Pagination } from "antd";
import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header";

const POST_CATEGORIES = [
  { name: "All Posts", color: "bg-secondary text-secondary-foreground" },
  { name: "Dogs", color: "bg-blue-500 text-white" },
  { name: "Cats", color: "bg-green-500 text-white" },
];

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalPages: 1,
    totalResults: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);


  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        sortBy: "-createdAt",
        ...(selectedCategory !== "All Posts"
          ? { category: selectedCategory }
          : {}),
      };
      const res = await getAllBlogsAPI(params);
      if (res.data.success || res.data.status === 200) {
        setBlogs(res.data.data.results);
        setPagination({
          page: res.data.data.page,
          limit: res.data.data.limit,
          totalPages: res.data.data.totalPages,
          totalResults: res.data.data.totalResults,
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };


    const handleOnClickDetails = (id, title) => {
        const slug = title.toLowerCase().replace(/\s+/g, "-"); // Chuyển thành chữ thường và thay thế khoảng trắng bằng "-"
        console.log(slug); // Kiểm tra slug
        navigate(`/blog/${slug}`, {
            state: {
                blogId: id,
            },
        });
    };

  return (
    <div className="container-fluid mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-primary mb-2">
            <span>PET BLOG</span>
          </h1>
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            Create New Blog
          </Button>
        </div>
        <div className="flex flex-wrap justify-left gap-4 mb-6">
          {POST_CATEGORIES.map((category) => (
            <Button
              key={category.name}
              type={selectedCategory === category.name ? "primary" : "default"}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            {/* Hero Section for Featured Blog */}
            <div className="relative w-full mb-10">
              <Link
                to={`/blog/${blogs[0]._id}`}
                className="text-blue-300 font-semibold"
              >
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <img
                      alt={blogs[0].title}
                      src={blogs[0].thumbnail}
                      className="w-full h-[500px] object-cover"
                    />
                  }
                  bodyStyle={{ padding: 0 }} // Removes extra padding from the Card body
                >
                  <div className="absolute bottom-0 left-0 right-0  p-6 text-white">
                    <h2 className="text-3xl font-bold">{blogs[0].title}</h2>
                    <p className="text-lg mt-2 line-clamp-2">
                      {blogs[0].content}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <img
                                src={blogs[0].thumbnail}
                                alt={blogs[0].title}
                                className="w-full md:w-1/2 rounded-lg object-cover h-[300px]"
                            />
                            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-primary">{blogs[0].title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                                    {blogs[0].content}
                                </p>
                                <button
                                    onClick={() => handleOnClickDetails(blogs[0]._id, blogs[0].title)}
                                    className="mt-4 inline-block bg-accent text-accent-foreground px-5 py-2 rounded-full transition-all duration-300 hover:bg-accent-dark"
                                >
                                    READ MORE
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">NEWEST POSTS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {blogs.slice(1).map((blog) => (
                                    <div key={blog._id} className={cardClasses}>
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className={imageClasses}
                                        />
                                        <div className="p-4">
                                            <h3 className={textClasses}>{blog.title}</h3>
                                            <p className="text-zinc-600 dark:text-zinc-300 line-clamp-2">
                                                {blog.content}
                                            </p>
                                            <button onClick={() => handleOnClickDetails(blog._id, blog.title)}
                                                className={linkClasses}>
                                                Read More
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        Không có bài viết nào trong danh mục này
                    </div>
                )}

        <Pagination
          current={pagination.page}
          total={pagination.totalResults}
          pageSize={pagination.limit}
          onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          className="mt-6 flex justify-center"
        />
        <BlogCreate
          open={openCreate}
          setOpen={setOpenCreate}
          onSuccess={() => fetchBlogs()}
        />
      </div>
    </div>
  );
};

export default BlogList;
