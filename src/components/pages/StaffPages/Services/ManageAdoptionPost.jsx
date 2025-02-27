import { Button, Modal, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { fetchAllAdoptionPostsAPI } from "@/apis/post";

const ManageAdoptionPost = () => {
  const [posts, setPosts] = useState([]);
  const { Option } = Select;
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllAdoptionPostsAPI(currentPage);
        console.log("🚀 API Response:", response.data);
        setPosts(response.data.data.results);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleSortCategory = (value) => {
    if (value === "asc") {
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) =>
          (a.createdAt || "").localeCompare(b.createdAt || "")
        )
      );
    } else if (value === "desc") {
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || "")
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300">
          Manage Adoption Post
        </h1>
        <Select
          defaultValue=""
          onChange={handleSortCategory}
          style={{ width: "200px" }}
        >
          <Option value="">No Sort</Option>
          <Option value="asc">Sort by Date (ASC)</Option>
          <Option value="desc">Sort by Date (DESC)</Option>
        </Select>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No adoption post here</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <thead>
              <tr>
                {[
                  "#",
                  "PostID",
                  "Caption",
                  "Image",
                  "Status",
                  "Author",
                  "Created At",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
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
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.caption}
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
                        <span className="text-gray-400">No Image</span>
                      )}
                    </LightGallery>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <span
                      className={`font-bold ${
                        post.adopt_status === "Healthy"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {post.adopt_status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.author.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                      : "Unknown"}
                  </td>
                  <td className="flex gap-4 px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 border-r">
                    <Button
                      onClick={() => console.log("klo")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Edit
                    </Button>
                    <Button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                      Delete
                    </Button>
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
          total={posts.length}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageAdoptionPost;
