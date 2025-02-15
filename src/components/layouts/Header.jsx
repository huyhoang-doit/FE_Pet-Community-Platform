import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";
import { Avatar, Button, Dropdown, Menu } from "antd";
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

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to={`/profile/${user?.username}`}>Profile</NavLink>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="flex justify-between items-center h-20 bg-white px-10">
      <div id="logo" className="w-16">
        <Link to="/">
          <img src="/assets/images/favicon.png" alt="logo" />
        </Link>
      </div>
      <div className="flex gap-12 h-full">
        <Navbar />
      </div>
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
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar size="large" icon={<FaUser />} className="cursor-pointer" />
          </Dropdown>
        )}

        <div className="relative">
          <Link to="/wishlist">
            <FaHeart className="cursor-pointer text-xl" />
            <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
              0
            </p>
          </Link>
        </div>
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
