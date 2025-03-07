import { fetchAllPostsAPI, updatePostAPI } from "@/apis/post";
import { Table, Switch } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ManagePost() {
  const [posts, setPosts] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetchAllPostsAPI(page, limit);
      setPosts(response.data.data.results);
      setTotalResults(response.data.data.totalResults);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleBlockToggle = async (postId, data) => {
    try {
      await updatePostAPI(postId, data);
      await fetchPosts(currentPage);
      toast.success("Post blocked successfully");
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image && image.length > 0 ? (
          <img
            src={image[0]}
            alt="Post"
            width={50}
            height={50}
            className="rounded object-cover"
            onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      render: (caption) => (
        <p className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px]">
          {caption}
        </p>
      ),
    },
    {
      title: "Author",
      dataIndex: ["author", "username"],
      key: "author",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Approved",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved, record) =>
        record.isRejected ? (
          "Rejected"
        ) : (
          <Switch
            checked={isApproved}
            onChange={(checked) =>
              handleBlockToggle(record._id, {
                isApproved: checked,
                isRejected: false,
              })
            }
          />
        ),
    },
    {
      title: "Rejected",
      dataIndex: "isRejected",
      key: "isRejected",
      render: (isRejected, record) =>
        record.isApproved ? (
          "Approved"
        ) : (
          <Switch
            checked={isRejected}
            onChange={(checked) =>
              handleBlockToggle(record._id, {
                isRejected: checked,
                isApproved: false,
              })
            }
          />
        ),
    },

    {
      title: "Blocked",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked, { _id }) => (
        <Switch
          checked={isBlocked}
          onChange={(checked) => handleBlockToggle(_id, { isBlocked: checked })}
        />
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Post Management</h1>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: totalResults,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}

export default ManagePost;
