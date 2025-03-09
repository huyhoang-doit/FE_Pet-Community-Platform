import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";
import { Avatar, Button, Dropdown } from "antd";
import Navbar from "./Navbar";

function Header() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await handleLogoutAPI();
      if (res.status === 200) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const menuItems = [
    {
      key: "profile",
      label: <NavLink to={`/profile/${user?.username}`}>Hồ sơ</NavLink>,
    },
    user?.role.includes("services_staff") && {
      key: "approvePet",
      label: "Services Staff",
      onClick: () => navigate("/staff-services/approvePet"),
    },
    user?.role.includes("forum_staff") && {
      key: "manageBlog",
      label: "Forum Staff",
      onClick: () => navigate("/staff-forum/managePost"),
    },
    user?.role.includes("admin") && {
      key: "dashboard",
      label: "DashBoard",
      onClick: () => navigate("/admin/"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ].filter(Boolean);

  return (
    <header className="flex justify-between items-center h-20 bg-white px-10">
      {/* Logo */}
      <div id="logo" className="w-16">
        <Link to="/">
          <img src="/assets/images/favicon.png" alt="logo" />
        </Link>
      </div>

      {/* Navbar */}
      <div className="flex gap-12 h-full">
        <Navbar />
      </div>

      {/* User Actions */}
      <div className="flex gap-10 items-center">
        {!user ? (
          <div className="relative group py-7">
            <Button type="link">
              <NavLink to="/login">Đăng nhập</NavLink>
            </Button>
            {" / "}
            <Button type="link">
              <NavLink to="/signup">Đăng ký</NavLink>
            </Button>
          </div>
        ) : (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Avatar
              size="large"
              icon={<img src={user.profilePicture} />}
              className="cursor-pointer"
            />
          </Dropdown>
        )}
      </div>
    </header>
  );
}

export default Header;
