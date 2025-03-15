/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { Button } from "@/components/ui/button";

const Messages = ({ selectedUser }) => {
  // Hook kết nối realtime message và load tất cả tin nhắn
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* Header: Avatar, tên và thông tin người dùng */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20" style={{ border: "1px solid #e0e0e0" }}>
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {(selectedUser.firstName && selectedUser.lastName) ? (
            <>
              <span className="font-bold">
                {selectedUser?.lastName} {selectedUser?.firstName}
              </span>
              <span className="text-sm text-gray-500">
                {selectedUser?.username} · Outstagram
              </span>
            </>
          ) : (
            <>
              <span className="font-bold">{selectedUser?.username}</span>
              <span className="text-sm text-gray-500">
                {selectedUser.id === "ai-support" ? "AI Assistant" : "Outstagram"}
              </span>
            </>
          )}
          {selectedUser.id !== "ai-support" && (
            <Link to={`/profile/${selectedUser?.username}`}>
              <Button className="h-8 my-2" variant="secondary">
                Xem trang cá nhân
              </Button>
            </Link>
          )}
        </div>
      </div>

      {selectedUser.id === "ai-support" && messages.length === 0 && (
        <div className="text-center text-gray-500 my-4">
          Xin chào! Tôi là AI Support. Hãy cho tôi biết bạn muốn tìm thú cưng như thế nào (giống, vị trí, tình trạng, v.v.)!
        </div>
      )}

      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg, index) => {
            const nextMsg =
              index < messages.length - 1 ? messages[index + 1] : null;
            const showAvatar =
              msg.senderId !== user?.id &&
              (!nextMsg || nextMsg.senderId !== msg.senderId);

            return (
              <div key={msg._id} className="flex flex-col">
              <div
                className={`flex items-center gap-2 ${
                msg.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                {showAvatar ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={msg.senderId === user?.id ? user?.profilePicture : selectedUser?.profilePicture}
                  alt="profile"
                  style={{ border: "1px solid #e0e0e0" }}
                />
                ) : (
                <div className="w-8 h-8" /> // Placeholder giữ khoảng cách
                )}
                <div
                dangerouslySetInnerHTML={{ __html: msg.message }}
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.senderId === user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
                }`}
                >
                </div>
              </div>
              {msg.senderId === "ai-support" && msg.suggestionButtons && (
                <div className="mt-2 flex flex-wrap gap-2">
                {msg.suggestionButtons.map((btn) => (
                  <Button
                  key={btn.index}
                  onClick={() => window.open(btn.url, '_blank')}
                  variant="secondary"
                  className="text-sm hover:bg-gray-200"
                  >
                  {btn.index}. {btn.caption}
                  </Button>
                ))}
                </div>
              )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
