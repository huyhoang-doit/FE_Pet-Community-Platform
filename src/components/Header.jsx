import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

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
    <header className="flex justify-between items-center h-20 bg-white px-10">
      <div id="logo" className="w-16">
        <Link to="/">
          <img src="/assets/images/favicon.png" alt="" />
        </Link>
      </div>
      <div className="flex gap-12 h-full">
        <Navbar />
      </div>
      <div className="flex gap-10 items-center">
        {!user || user === null ? (
          <div className="relative group py-7">
            <NavLink to="/login">Signin</NavLink>
            {" / "}
            <NavLink to="/signup">Signup</NavLink>
          </div>
        ) : (
          <div className="relative group py-7">
            <FaUser className="cursor-pointer text-xl" />
            <div className="absolute top-[4.85rem] border right-[-2.5rem] bg-white p-2  opacity-0 invisible transform translate-y-4 transition-all duration-150 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <NavLink
                to={`/profile/${user.username}`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </NavLink>
              <NavLink
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </div>
          </div>
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
