import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Avatar } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";
import { PiPawPrintLight } from "react-icons/pi";
import { GoNote } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const StaffSideBarLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/adopt",
      icon: <IoHomeOutline className="w-4 h-4" />,
      label: "Home",
      roles: ["services_staff"],
    },
    {
      key: "/forum",
      icon: <IoHomeOutline className="w-4 h-4" />,
      label: "Home",
      roles: ["forum_staff"],
    },
    {
      key: "/staff-services/approvePet",
      icon: <PiPawPrintLight className="w-4 h-4" />,
      label: "Approve Pet",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/managePet",
      icon: <MdOutlineManageAccounts className="w-4 h-4" />,
      label: "Manage Pet",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/manageAdoptionPost",
      icon: <MdOutlineManageAccounts className="w-4 h-4" />,
      label: "Manage Post",
      roles: ["services_staff"],
    },
    {
      key: "/staff-forum/manageBlog",
      icon: <GoNote className="w-4 h-4" />,
      label: "Manage Blog",
      roles: ["forum_staff"],
    },
    {
      key: "/staff-forum/managePost",
      icon: <GoNote className="w-4 h-4" />,
      label: "Manage Post",
      roles: ["forum_staff"],
    },
    {
      key: "/staff-forum/ApprovePost",
      icon: <GoNote className="w-4 h-4" />,
      label: "Approve Post",
      roles: ["forum_staff"],
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span className="text-red-500">Logout</span>,
    },
  ];

  const userRole = user.role;
  const filteredItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

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
          <div className="p-3 text-white text-center font-bold">
            {userRole === "services_staff"
              ? "Staff Services Panel"
              : "Staff Forum Panel"}
          </div>
          {/* Menu chính */}
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
            items={filteredItems}
            className="flex-1"
          />
          ;
        </div>
      </Sider>

      <Layout className="h-full">
        <Header className="bg-white shadow-md px-4 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-12 h-12"
          />

          <Search
            placeholder="Search..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
            className="ml-4"
          />

          {/* Avatar */}
          <div className="ml-auto">
            <Avatar size="large" src={user.profilePicture} />
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

export default StaffSideBarLayout;
