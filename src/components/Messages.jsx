/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20"  style={{ border: "1px solid #e0e0e0" }}>
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {(selectedUser.firstName && selectedUser.lastName) ? (
            <>
              <span className="font-bold">{selectedUser?.lastName} {selectedUser?.firstName}</span>
              <span className="text-sm text-gray-500">{selectedUser?.username} · Outstagram</span>
            </>
          ) : (
            <>
              <span className="font-bold">{selectedUser?.username}</span>
              <span className="text-sm text-gray-500">Outstagram</span>
            </>
          )}
          <Link to={`/profile/${selectedUser?.username}`}>
            <Button className="h-8 my-2" variant="secondary">
              Xem trang cá nhân
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg, index) => {
            const nextMsg =
              index < messages.length - 1 ? messages[index + 1] : null;
            const showAvatar =
              msg.senderId !== user?.id &&
              (!nextMsg || nextMsg.senderId !== msg.senderId);

            return (
              <div
                key={msg._id}
                className={`flex items-center gap-2 ${
                  msg.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                {showAvatar ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={selectedUser?.profilePicture}
                    alt="profile"
                    style={{ border: "1px solid #e0e0e0" }}
                  />
                ) : (
                  <div className="w-8 h-8" /> // Placeholder to maintain spacing
                )}
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderId === user?.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
