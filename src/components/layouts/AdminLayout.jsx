import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import {
  AlertOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
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
  const handleLogout = async () => {
    try {
      const res = await handleLogoutAPI();
      if (res.status === 200) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setChatUsers([]));
        dispatch(setPostPage(1));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
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
          <div className="flex justify-center items-center h-16"> 
            <Link to="/">
              <img src='/assets/images/logo.png' alt="logo" className="w-100 h-10" />
            </Link>
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
                label: "Bảng điều khiển",
              },
              { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
              { key: "/admin/staff", icon: <TeamOutlined />, label: "Nhân viên" },
              {
                key: "/admin/donate",
                icon: <UploadOutlined />,
                label: "Quyên góp",
              },{
                key: "/admin/campaign",
                icon: <AlertOutlined />,
                label: "Chiến dịch",
              },
              { type: "divider" }, // Dòng phân cách
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span className="text-red-500">Đăng xuất</span>,
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

          {/* Avatar */}
          <div className="ml-auto">
            <Avatar style={{border: '1px solid gray'}} size="large" src={user.profilePicture} />
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
