import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message } from "antd";
import { getAllStaffAPI } from "@/apis/admin";

const ManageStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);

  const getAllStaff = async () => {
    try {
      const response = await getAllStaffAPI();
      console.log("");
      const staffData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setStaffMembers(staffData);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      setStaffMembers([]); // Ensure it stays an array even if API fails
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleBan = (id) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, status: "banned" } : staff
      )
    );
    message.success("Staff member has been banned!");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
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
      <Table columns={columns} dataSource={staffMembers} rowKey="id" />
    </div>
  );
};

export default ManageStaff;
