import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";

const TabNotification = () => {
    const { likeNotification } = useSelector(
      (store) => store.realTimeNotification
    );
  return (
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
                Khi có người thích hoặc bình luận về một trong những bài viết
                của bạn, bạn sẽ nhìn thấy nó ở đây.
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

export default TabNotification;
