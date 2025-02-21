import { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, message, Spin } from "antd";
import { getAllStaffAPI } from "@/apis/admin";
import { editProfileAPI } from "@/apis/user";

const ManageStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStaffMembers = async (page = 1, search = "") => {
    try {
      const response = await getAllStaffAPI(
        page,
        search ? 1000 : limit,
        search
      );
      console.log(response);
      if (response.data?.data) {
        setStaffMembers(response.data.data);
        setTotalResults(
          search ? response.data.data.length : response.data.data.totalResults
        );
      } else {
        setStaffMembers([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
      message.error("Failed to fetch staff members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers(currentPage);
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
      title: "Name",
      dataIndex: "username",
      key: "username",
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
          {isBlocked ? "Banned" : "Active"}
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
      <Spin spinning={loading}>
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
      </Spin>
    </div>
  );
};
export default ManageStaff;
