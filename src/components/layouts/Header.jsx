import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
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

  const menuItems = [
    {
      key: "profile",
      label: <NavLink to={`/profile/${user?.username}`}>Profile</NavLink>,
    },
    user?.role === "services_staff" && {
      key: "approvePet",
      label: "Approve Pet",
      onClick: () => navigate("/staff/approvePet"),
    },
    user?.role === "admin" && {
      key: "dashboard",
      label: "DashBoard",
      onClick: () => navigate("/admin/"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ].filter(Boolean); // Lọc bỏ giá trị `false` để tránh lỗi khi user không có role phù hợp

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
              <NavLink to="/login">Signin</NavLink>
            </Button>
            {" / "}
            <Button type="link">
              <NavLink to="/signup">Signup</NavLink>
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

        {/* Wishlist */}
        <div className="relative">
          <Link to="/wishlist">
            <FaHeart className="cursor-pointer text-xl" />
            <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
              0
            </p>
          </Link>
        </div>

        {/* Cart */}
        <div className="relative">
          <Link to="/cart">
            <FaCartShopping className="cursor-pointer text-xl" />
            <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
              0
            </p>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
