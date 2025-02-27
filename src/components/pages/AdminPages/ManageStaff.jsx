import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message } from "antd";
import { getAllStaffAPI } from "@/apis/admin";
import Search from "antd/es/input/Search";
import { editProfileAPI } from "@/apis/user";

const ManageStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const getAllStaff = async (page = 1, search = "") => {
    try {
      const response = await getAllStaffAPI(
        page,
        search ? 1000 : limit,
        search
      );
      if (response.data?.data) {
        setTotalResults(
          search ? response.data.data.length : response.data.data.totalResults
        );
      }
      const staffData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setStaffMembers(staffData);
    } catch (error) {
      setStaffMembers([]); // Ensure it stays an array even if API fails
      setTotalResults(0);
    }
  };

  useEffect(() => {
    getAllStaff(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBan = async (id) => {
    try {
      const response = await editProfileAPI({ id, isDeleted: true });
      if (response.data?.status === 200) {
        message.success(`User with ID ${id} has been banned!`);
        getAllStaff(currentPage);
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
            onSearch={(value) => getAllStaff(1, value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "username",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "isActived",
      key: "status",
      render: (isActived) => (
        <Tag color={isActived ? "red" : "green"}>
          {isActived ? "Banned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status !== "banned" ? (
          <Popconfirm
            title="Are you sure to ban this staff member?"
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
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      <Table
        columns={columns}
        dataSource={staffMembers}
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
};

export default ManageStaff;
