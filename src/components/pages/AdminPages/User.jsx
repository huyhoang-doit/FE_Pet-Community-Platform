import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message } from "antd";
import { getAllUsersAPI } from "@/apis/user";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await getAllUsersAPI();
        console.log("response", response.data.data);
        setUsers(response.data.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    getAllUsers();
  }, []);

  const handleBan = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "banned" } : user
      )
    );
    message.success(`User with ID ${id} has been banned!`);
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
      <Table columns={columns} dataSource={users} rowKey="id" />
    </div>
  );
};

export default User;
