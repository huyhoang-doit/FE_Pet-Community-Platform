import { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/apis/blog";
import BlogCreate from "./BlogCreate";
import { Button, Card, Spin, Pagination } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../../../public/assets/images/logo.png";

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

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-primary mb-2">
            <span>
              <img src={Logo} alt="logo" className="w-30 h-20 inline-block" />
            </span>{" "}
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

            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              NEWEST POSTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.slice(1).map((blog) => (
                <Link key={blog._id} to={`/blog/${blog._id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={blog.title}
                        src={blog.thumbnail}
                        className="h-60 w-full object-cover"
                      />
                    }
                  >
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-zinc-600 line-clamp-2">{blog.content}</p>
                    <Link to={`/blog/${blog._id}`}>Read More</Link>
                  </Card>
                </Link>
              ))}
            </div>
          </>
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
