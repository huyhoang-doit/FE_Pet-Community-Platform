import { Button, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { addAdoptionForm, fetchAllAdoptionPostsAPI } from "@/apis/post";
import EditAdoptPostModal from "./EditAdoptPostModal";
import CreateAdoptionFormModal from "./CreateAdoptionFormModal";
import { toast } from "sonner";

const { Option } = Select;

const ManageAdoptionPost = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetchAllAdoptionPostsAPI(
        currentPage,
        itemsPerPage,
        sortBy,
        statusSort
      );
      const { results, totalResults } = response.data.data;
      setPosts(results);
      setTotalResults(totalResults);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [currentPage, statusSort, sortBy]);

  const handleSortCategory = (value) => {
    switch (value) {
      case "createdAt_asc":
        setSortBy("createdAt:asc");
        break;
      case "createdAt_desc":
        setSortBy("createdAt:desc");
        break;
      case "status_available":
        setStatusSort("Available");
        break;
      case "status_pending":
        setStatusSort("Pending");
        break;
      case "status_adopted":
        setStatusSort("Adopted");
        break;
      default:
        setSortBy("createdAt:desc");
        setStatusSort(null);
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleFormClick = (post) => {
    setSelectedPost(post);
    setFormModalOpen(true);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setEditModalOpen(false);
  };

  const handleFormSubmitted = async () => {
    try {
      await fetchData()
        setFormModalOpen(false);
      }
     catch (error) {
      toast.error(error.response?.data?.message || "Error creating form!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300">
          Quản lý bài đăng nhận nuôi
        </h1>
        <Select
          defaultValue=""
          onChange={handleSortCategory}
          style={{ width: "250px" }}
        >
          <Option value="">Không sắp xếp</Option>
          <Option value="createdAt_asc">Ngày tạo (Tăng dần)</Option>
          <Option value="createdAt_desc">Ngày tạo (Giảm dần)</Option>
          <Option value="status_available">Chỉ hiện Chưa nhận nuôi</Option>
          <Option value="status_pending">Chỉ hiện Đã liên hệ</Option>
          <Option value="status_adopted">Chỉ hiện Đã nhận nuôi</Option>
        </Select>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">Không có bài đăng nhận nuôi nào</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <thead>
              <tr>
                {[
                  "#",
                  "Post ID",
                  "Caption",
                  "Image",
                  "Status",
                  "Author",
                  "Location",
                  "Created At",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr
                  key={post._id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r"></td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <div className="line-clamp-2 overflow-hidden">
                      {post.caption}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                      {post.image?.length ? (
                        <img
                          src={post.image[0]}
                          alt="Post"
                          className="h-12 w-12 object-cover rounded-md cursor-pointer"
                        />
                      ) : (
                        <span className="text-gray-400">Không có ảnh</span>
                      )}
                    </LightGallery>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <span
                      className={`font-bold ${
                        post.adopt_status === "Available"
                          ? "text-green-500"
                          : post.adopt_status === "Pending"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    >
                      {post.adopt_status === "Available"
                        ? "Chưa nhận nuôi"
                        : post.adopt_status === "Pending"
                        ? "Đã liên hệ"
                        : "Đã nhận nuôi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.author?.username || "Không rõ"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.location || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </td>
                  <td className="flex gap-2 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 border-r">
                    <Button
                      onClick={() => handleEditClick(post)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Sửa
                    </Button>
                    {post.adopt_status === "Available" && (
                      <Button
                        onClick={() => handleFormClick(post)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Tạo form nhận nuôi
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalResults}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {editModalOpen && (
        <EditAdoptPostModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          post={selectedPost}
          onUpdate={handleUpdatePost}
        />
      )}
      {formModalOpen && (
        <CreateAdoptionFormModal
          open={formModalOpen}
          setOpen={setFormModalOpen}
          post={selectedPost}
          onSubmit={handleFormSubmitted}
        />
      )}
    </div>
  );
};

export default ManageAdoptionPost;
