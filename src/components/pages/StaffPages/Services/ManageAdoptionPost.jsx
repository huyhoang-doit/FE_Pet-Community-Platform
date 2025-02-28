import { Button, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { fetchAllAdoptionPostsAPI } from "@/apis/post";

const { Option } = Select;

const ManageAdoptionPost = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4; // Matches API's limit

  // Fetch posts when page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllAdoptionPostsAPI(
          currentPage,
          itemsPerPage
        );
        const { results, totalResults } = response.data.data;
        setPosts(results);
        setTotalResults(totalResults);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [currentPage]);

  // Handle sorting by creation date
  const handleSortCategory = (value) => {
    setPosts((prevPosts) => {
      const sortedPosts = [...prevPosts];
      if (value === "asc") {
        sortedPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (value === "desc") {
        sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      return sortedPosts;
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300">
          Manage Adoption Posts
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
        <p className="text-gray-500">No adoption posts available</p>
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
                        post.adopt_status === "Available"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {post.adopt_status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.author?.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.location || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                      : "Unknown"}
                  </td>
                  <td className="flex gap-4 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <Button
                      onClick={() => console.log(`Edit post: ${post._id}`)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Edit
                    </Button>
                    {/* Uncomment and implement delete functionality if needed */}
                    {/* <Button
                      onClick={() => console.log(`Delete post: ${post._id}`)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </Button> */}
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
          total={totalResults} // Use totalResults from API
          onChange={handlePageChange}
          showSizeChanger={false} // Disable page size changer since it's fixed
        />
      </div>
    </div>
  );
};

export default ManageAdoptionPost;
