import { useState } from "react";
import { Table, Tag, Button, Popconfirm, message } from "antd";

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: "Staff Member 1", role: "Admin", status: "active" },
    { id: 2, name: "Staff Member 2", role: "Editor", status: "active" },
    { id: 3, name: "Staff Member 3", role: "Viewer", status: "offline" },
  ]);

  const getAllStaff = async () => {
    try {
      const response = await getAllStaffAPI();
      if (response.data?.data) {
        setStaffMembers(response.data.data);
      } else {
        setStaffMembers([]);
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "active"
            ? "green"
            : status === "offline"
            ? "orange"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
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

export default Staff;
