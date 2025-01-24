import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";

const TabSearch = () => {
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  return (
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
                <AvatarImage src={notification.userDetails?.profilePicture} />
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
  );
};

export default TabSearch;
