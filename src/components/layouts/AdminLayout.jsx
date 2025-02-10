import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // 🔹 Hook để chuyển trang
  const location = useLocation(); // 🔹 Lấy đường dẫn hiện tại
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

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
          <div className="p-3 text-white text-center font-bold">
            Admin Panel
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]} // 🔹 Đánh dấu menu active theo URL
            onClick={({ key }) => navigate(key)} // 🔹 Chuyển hướng khi click
            items={[
              {
                key: "/admin/",
                icon: <PieChartOutlined />,
                label: "Dashboard",
              },
              {
                key: "/admin/users",
                icon: <UserOutlined />,
                label: "Users",
              },
              {
                key: "/admin/staff",
                icon: <TeamOutlined />,
                label: "Staffs",
              },
              {
                key: "/admin/donate",
                icon: <UploadOutlined />,
                label: "Donate",
              },
            ]}
            className="flex-1"
          />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="h-full">
        <Header className="bg-white shadow-md px-4 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-12 h-12"
          />
        </Header>
        <Content
          className="p-6 bg-gray-100 overflow-auto"
          style={{
            borderRadius: borderRadiusLG,
            height: "calc(100vh - 64px)", // Trừ header để tránh bị tràn
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
