import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Avatar } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-full"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-3 text-white text-center font-bold">
            Admin Panel
          </div>

          {/* Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              if (key === "logout") {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: "/admin/",
                icon: <PieChartOutlined />,
                label: "Dashboard",
              },
              { key: "/admin/users", icon: <UserOutlined />, label: "Users" },
              { key: "/admin/staff", icon: <TeamOutlined />, label: "Staffs" },
              {
                key: "/admin/donate",
                icon: <UploadOutlined />,
                label: "Donate",
              },
              { type: "divider" }, // Dòng phân cách
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span className="text-red-500">Logout</span>,
              },
            ]}
            className="flex-1"
          />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="h-full">
        {/* Header */}
        <Header className="bg-white shadow-md px-4 flex items-center">
          {/* Nút thu gọn/mở rộng Sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-12 h-12"
          />

          {/* Ô tìm kiếm */}
          <Search
            placeholder="Search..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
            className="ml-4"
          />

          {/* Avatar */}
          <div className="ml-auto">
            <Avatar size="large" src="https://i.pravatar.cc/150" />
          </div>
        </Header>

        {/* Content */}
        <Content
          className="p-6 bg-gray-100 overflow-auto"
          style={{
            borderRadius: borderRadiusLG,
            height: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
