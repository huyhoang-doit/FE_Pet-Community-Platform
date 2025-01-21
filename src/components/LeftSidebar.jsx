import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { handleLogoutAPI } from "@/apis/auth";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("340px");

  useEffect(() => {
    if (location.pathname.includes("/chat")) {
      setSidebarWidth("80px");
    } else {
      setSidebarWidth("340px");
    }
  }, [location.pathname]);

  const logoutHandler = async () => {
    try {
      const res = await handleLogoutAPI();
      if (res.status === 200) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?.username}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Trang chủ", textType: "Home" },
    { icon: <Search />, text: "Tìm kiếm", textType: "Search" },
    { icon: <TrendingUp />, text: "Khám phá", textType: "Explore" },
    { icon: <MessageCircle />, text: "Tin nhắn", textType: "Messages" },
    { icon: <Heart />, text: "Thông báo", textType: "Notifications" },
    { icon: <PlusSquare />, text: "Tạo", textType: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6" style={{ border: "1px solid #e0e0e0" }}>
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Trang cá nhân",
      textType: "Profile",
    },
  ];

  return (
    <div
      className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 h-screen`}
      style={{
        width: sidebarWidth,
        transition: "width 0.3s ease",
      }}
    >
      <div className="flex flex-col h-full">
        <Link to="/" style={{height: "120px"}}>
          <h1 className="my-8 pl-3 font-bold text-xl">
            {sidebarWidth === "340px" ? (
              <img
                src="/assets/images/logo.png"
                alt="logo"
                className="w-[50%]"
              />
            ) : (
              <img
                src="/assets/images/favicon.png"
                alt="full logo"
                className="w-[50%]"
              />
            )}
          </h1>
        </Link>
        <div className="flex-grow">
          <div className="flex-grow">
            {sidebarItems.map((item, index) => {
              return (
                <div
                  onClick={() => sidebarHandler(item.textType)}
                  key={index}
                  className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                >
                  {item.icon}
                  {sidebarWidth === "340px" && <span>{item.text}</span>}
                  {item.text === "Notifications" &&
                    likeNotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                          >
                            {likeNotification.length}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {likeNotification.length === 0 ? (
                              <p>No new notification</p>
                            ) : (
                              likeNotification.map((notification) => {
                                return (
                                  <div
                                    key={notification.userId}
                                    className="flex items-center gap-2 my-2"
                                  >
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                      />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      liked your post
                                    </p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          onClick={() => sidebarHandler("Logout")}
          className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 mb-8"
        >
          <LogOut />
          {sidebarWidth === "340px" && <span>Đăng xuất</span>}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
