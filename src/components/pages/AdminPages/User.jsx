import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message, Input, Spin } from "antd";
import { editProfileAPI, getAllUsersAPI } from "@/apis/user";

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const { Search } = Input;

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getAllUsersAPI(
        page,
        search ? 1000 : limit,
        search
      );

      console.log(response);
      if (response.data?.data?.results) {
        setUsers(response.data.data.results);
        setTotalResults(
          search
            ? response.data.data.results.length
            : response.data.data.totalResults
        );
      } else {
        setUsers([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBan = async (id) => {
    try {
      const response = await editProfileAPI({ id, isDeleted: true });
      if (response.data?.status === 200) {
        message.success(`User with ID ${id} has been banned!`);
      } else {
        message.error("Failed to ban the user. Please try again.");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("An error occurred. Please try again later.");
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-10">
          Name
          <Search
            placeholder="Search users..."
            onSearch={(value) => fetchUsers(1, value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "username",
      key: "username",
      render: (username) => <a>{username}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "status",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Banned" : "Đang hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        !record.isBlocked ? (
          <Popconfirm
            title="Are you sure to ban this user?"
            onConfirm={() => handleBan(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Ban
            </Button>
          </Popconfirm>
        ) : (
          <Tag color="red">Banned</Tag>
        ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: totalResults,
            onChange: handlePageChange,
          }}
        />
      </Spin>
    </div>
  );
};

export default User;
