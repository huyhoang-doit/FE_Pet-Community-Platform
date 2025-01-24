import {
  Heart,
  Home,
  LogOut,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPostPage, setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { handleLogoutAPI } from "@/apis/auth";
import { RiMessengerLine, RiMessengerFill } from "react-icons/ri";
import { FaHeart, FaSearch } from "react-icons/fa";

const getInitialActiveTab = () => {
  const pathname = window.location.pathname;
  if (pathname === "/") return "Home";
  if (pathname.includes("/profile")) return "Profile";
  if (pathname.includes("/forum")) return "Forum";
  if (pathname.includes("/chat")) return "Messages";
  return "Home"; // fallback
};

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
  const [isDisplayText, setIsDisplayText] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());

  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const logoutHandler = async () => {
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

  const isActiveTab = (path) => {
    if (path === "Home") return location.pathname === "/";
    return activeTab === path;
  };

  const handleClickOutside = (event) => {
    // Kiểm tra click trong notification area
    const notificationArea = document.querySelector(".notification-area");
    const searchArea = document.querySelector(".search-area");
    if (
      (notificationArea && notificationArea.contains(event.target)) ||
      (searchArea && searchArea.contains(event.target))
    )
      return;

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
      if (isActiveTab("Messages")) setActiveTab("Messages");
      else if (isActiveTab("Forum")) setActiveTab("Forum");
      else if (isActiveTab("Profile")) setActiveTab("Profile");
      else if (isActiveTab("Notifications")) setActiveTab("Notifications");
      else if (isActiveTab("Search")) setActiveTab("Search");
    }

    // Xử lý click outside cho search
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
      if (isActiveTab("Messages")) setActiveTab("Messages");
      else if (isActiveTab("Forum")) setActiveTab("Forum");
      else if (isActiveTab("Profile")) setActiveTab("Profile");
      else if (isActiveTab("Notifications")) setActiveTab("Notifications");
      else if (isActiveTab("Search")) setActiveTab("Search");
    }
    const shouldDisplayText = !["Messages", "Notifications", "Search"].includes(
      activeTab
    );
    setIsDisplayText(shouldDisplayText);
  };

  const updateSidebarState = () => {
    const isChatPage = location.pathname.includes("/chat");
    setSidebarWidth(isChatPage ? "80px" : "340px");
    setIsDisplayText(!isChatPage);
    setShowNotifications(false);
  };

  const sidebarHandler = (textType) => {
    setActiveTab(textType);
    setShowNotifications(false);
    setShowSearch(false);

    const actions = {
      Logout: logoutHandler,
      Create: () => setOpen(true),
      Profile: () => navigate(`/profile/${user?.username}`),
      Forum: () => navigate("/forum"),
      Messages: () => navigate("/chat"),
      Home: () => navigate("/"),
      Notifications: () => {
        setShowNotifications(true);
        setIsDisplayText(false);
      },
      Search: () => {
        setShowSearch(true);
        setIsDisplayText(false);
      },
    };

    actions[textType]?.();
  };

  useEffect(updateSidebarState, [location.pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [location.pathname]);

  const sidebarItems = [
    { icon: <Home />, text: "Trang chủ", textType: "Home" },
    {
      icon: isActiveTab("Forum") ? (
        <MdForum size={24} />
      ) : (
        <MdOutlineForum size={24} />
      ),
      text: "Diễn đàn",
      textType: "Forum",
    },
    {
      icon: isActiveTab("Search") ? <FaSearch size={24} /> : <Search />,
      text: "Tìm kiếm",
      textType: "Search",
    },
    { icon: <TrendingUp />, text: "Khám phá", textType: "Explore" },
    {
      icon: isActiveTab("Messages") ? (
        <RiMessengerFill size={24} />
      ) : (
        <RiMessengerLine size={24} />
      ),
      text: "Tin nhắn",
      textType: "Messages",
    },
    {
      icon: showNotifications ? <FaHeart size={24} /> : <Heart />,
      text: "Thông báo",
      textType: "Notifications",
    },
    { icon: <PlusSquare />, text: "Tạo", textType: "Create" },
    {
      icon: isActiveTab("Profile") ? (
        <Avatar className="w-6 h-6" style={{ border: "2px solid black" }}>
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ) : (
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
        <Link to="/" style={{ height: "120px" }}>
          <h1 className="my-8 pl-3 font-bold text-xl">
            {sidebarWidth === "340px" && isDisplayText ? (
              <img
                src="/assets/images/logo.png"
                alt="logo"
                className="w-[50%]"
              />
            ) : (
              <img
                src="/assets/images/favicon.png"
                alt="full logo"
                className="w-[24px]"
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
                  className={`flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3`}
                >
                  {item.icon}
                  {isDisplayText && (
                    <span
                      className={`${
                        isActiveTab(item.textType) ? "font-bold" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                  )}
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
          {isDisplayText && <span>Đăng xuất</span>}
        </div>
      </div>
      <div
        ref={notificationRef}
        className={`notification-area fixed top-0 left-[80px] h-screen border-l-gray-300 bg-white z-20 overflow-y-auto transition-width duration-300 ease-in-out ${
          showNotifications ? "w-[370px] border-x" : "w-0"
        }`}
      >
        <div className="h-full w-full">
          {showNotifications && (
            <>
              <h1 className="font-bold my-8 text-xl pl-[20px]">Thông báo</h1>
              <div style={{ borderRadius: "4px" }}>
                <div
                  style={{
                    alignItems: "stretch",
                    border: "0",
                    boxSizing: "border-box",
                    display: "block",
                    flexDirection: "column",
                    flexShrink: "0",
                    font: "inherit",
                    fontSize: "100%",
                    margin: "0",
                    padding: "0",
                    position: "relative",
                    verticalAlign: "baseline",
                  }}
                >
                  <div className="px-8 d-flex flex-column align-items-center justify-items-center">
                    <div>
                      <svg
                        aria-label="Hoạt động trên bài viết của bạn"
                        className="x1lliihq x1n2onr6 x5n08af"
                        fill="currentColor"
                        height="62"
                        role="img"
                        viewBox="0 0 96 96"
                        width="62"
                      >
                        <title>Hoạt động trên bài viết của bạn</title>
                        <circle
                          cx="48"
                          cy="48"
                          fill="none"
                          r="47"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></circle>
                        <path
                          d="M48 34.4A13.185 13.185 0 0 0 37.473 29a12.717 12.717 0 0 0-6.72 1.939c-6.46 3.995-8.669 12.844-4.942 19.766 3.037 5.642 16.115 15.6 20.813 19.07a2.312 2.312 0 0 0 2.75 0c4.7-3.47 17.778-13.428 20.815-19.07 3.728-6.922 1.517-15.771-4.943-19.766A12.704 12.704 0 0 0 58.527 29 13.193 13.193 0 0 0 48 34.4Z"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                    </div>
                    <div className="mt-2">
                      <span style={{ textAlign: "center", fontSize: "14px" }}>
                        Hoạt động trên bài viết của bạn
                      </span>
                    </div>
                    <div className="mt-2 mb-8 flex">
                      <span style={{ textAlign: "center", fontSize: "14px" }}>
                        Khi có người thích hoặc bình luận về một trong những bài
                        viết của bạn, bạn sẽ nhìn thấy nó ở đây.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-[20px] flex items-center justify-between mb-4 pr-4">
                <span className="text-md font-bold">Gợi ý cho bạn</span>
              </div>
              <div className="overflow-y-auto h-[80vh]">
                {likeNotification.map((notification) => (
                  <div
                    key={notification.userId}
                    className="pl-[20px] flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-50"
                  >
                    <div className="relative">
                      <Avatar
                        className="w-14 h-14"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        <AvatarImage
                          src={notification.userDetails?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {notification.userDetails?.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        đã thích bài viết của bạn
                      </span>
                      <span className="text-xs text-gray-400">
                        {/* {calculateTimeAgo(notification.createdAt)} */}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        ref={searchRef}
        className={`search-area fixed top-0 left-[80px] h-screen border-l-gray-300 bg-white z-20 overflow-y-auto transition-width duration-300 ease-in-out ${
          showSearch ? "w-[370px] border-x" : "w-0"
        }`}
      >
        <div className="h-full w-full">
          {showSearch && (
            <>
              <h1 className="font-bold my-8 text-xl pl-[20px]">Tìm kiếm</h1>
              <div className="pl-[20px] pr-[20px] mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 px-4 pl-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 15l5.5 5.5M10 18a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>
              </div>
              <div className="pl-[20px] flex items-center justify-between mb-4 pr-4 border-t">
                <span className="text-md font-bold mt-6">Mới đây</span>
              </div>
              <div className="overflow-y-auto h-[80vh]">
                {likeNotification.map((notification) => (
                  <div
                    key={notification.userId}
                    className="pl-[20px] flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-50"
                  >
                    <div className="relative">
                      <Avatar
                        className="w-14 h-14"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        <AvatarImage
                          src={notification.userDetails?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {notification.userDetails?.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        đã thích bài viết của bạn
                      </span>
                      <span className="text-xs text-gray-400">
                        {/* {calculateTimeAgo(notification.createdAt)} */}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
