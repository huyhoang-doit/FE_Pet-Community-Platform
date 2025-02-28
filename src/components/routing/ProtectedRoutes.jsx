/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/login");
      // logoutHandler();
      return;
    }
    const decoded = jwtDecode(accessToken);

    try {
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logoutHandler();
      }
    } catch (error) {
      logoutHandler();
    }

    if (
      user &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(decoded.role)
    ) {
      toast.error("You are not authorized to access this page");
      navigate("/");
    }
  }, [user]);

  const logoutHandler = async () => {
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

  return user ? children : null;
};

export default ProtectedRoutes;
