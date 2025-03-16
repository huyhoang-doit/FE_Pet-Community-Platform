/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

const Messages = ({ selectedUser }) => {
  // Hook kết nối realtime message và load tất cả tin nhắn
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const renderPostLink = (metadata, isSender) => {
    if (metadata?.type === "adoption_post") {
      return (
        <div className={`mt-2 w-[50%] flex ${isSender ? "ml-auto" : ""}`}>
          <div
            className="bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 text-sm w-full"
            onClick={() =>
              window.open(`/adoptDetail/${metadata.postId}`, "_blank")
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Bài viết nhận nuôi</h4>
                {metadata.postTitle && (
                  <p className="text-gray-600">{metadata.postTitle}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {metadata.petName && `Thú cưng: ${metadata.petName}`}
                  {metadata.petName && metadata.location && " - "}
                  {metadata.location && `Vị trí: ${metadata.location}`}
                </p>
              </div>
              {metadata.postId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/adoptDetail/${metadata.postId}`, "_blank");
                  }}
                >
                  Xem chi tiết
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMessage = (msg, index, messages) => {
    let messageContent;
    let metadata;
    let imageUrl;
    let messageType;
    let loadingText;

    try {
      let parsedMessage = JSON.parse(msg.message);
      if (typeof parsedMessage === "number") {
        parsedMessage = { text: parsedMessage };
      }
      messageContent = parsedMessage.text;
      metadata = parsedMessage.metadata;
      imageUrl = parsedMessage.image;
      messageType = parsedMessage.type;
      loadingText = parsedMessage.loadingText;
    } catch (e) {
      messageContent = msg.message;
    }

    const isSender = msg.senderId === user?.id;
    const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
    const showAvatar =
      !isSender && (!nextMsg || nextMsg.senderId !== msg.senderId);

    return (
      <div key={msg._id} className="flex flex-col mb-2">
        <div
          className={`flex items-end gap-2 ${
            isSender ? "justify-end" : "justify-start"
          }`}
        >
          {!isSender && (
            <div className="w-8 h-8 flex-shrink-0">
              {showAvatar ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={selectedUser?.profilePicture}
                  alt="profile"
                  style={{ border: "1px solid #e0e0e0" }}
                />
              ) : (
                <div className="w-8" />
              )}
            </div>
          )}
          <div
            className={`p-2 rounded-lg max-w-[50%] break-words ${
              isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            } ${messageType === "image" ? "p-1" : ""}`}
          >
            {messageType === "loading" ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingText}</span>
              </div>
            ) : messageType === "image" ? (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Sent image"
                  className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90"
                  onClick={() => window.open(imageUrl, "_blank")}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage(imageUrl);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <span
                dangerouslySetInnerHTML={{ __html: messageContent }}
                className="inline-block"
              ></span>
            )}
          </div>
          {/* {isSender && (
            <div className="w-8 h-8 flex-shrink-0">
              {showAvatar ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.profilePicture}
                  alt="profile"
                  style={{ border: "1px solid #e0e0e0" }}
                />
              ) : (
                <div className="w-8" />
              )}
            </div>
          )} */}
        </div>
        {metadata && renderPostLink(metadata, isSender)}
        {msg.senderId === "ai-support" && msg.suggestionButtons && (
          <div className="mt-2 flex flex-wrap gap-2">
            {msg.suggestionButtons.map((btn) => (
              <Button
                key={btn.index}
                onClick={() => window.open(btn.url, "_blank")}
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
  };

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* Header: Avatar, tên và thông tin người dùng */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20" style={{ border: "1px solid #e0e0e0" }}>
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {selectedUser.firstName && selectedUser.lastName ? (
            <>
              <span className="font-bold mt-2">
                {selectedUser?.lastName} {selectedUser?.firstName}
              </span>
              <span className="text-sm text-gray-500">
                {selectedUser?.username} · Outstagram
              </span>
            </>
          ) : (
            <>
              <span className="font-bold mt-2">{selectedUser?.username}</span>
              <span className="text-sm text-gray-500">
                {selectedUser.id === "ai-support"
                  ? "AI Assistant"
                  : "Outstagram"}
              </span>
            </>
          )}
          {selectedUser.id !== "ai-support" && (
            <Link to={`/profile/${selectedUser?.username}`}>
              <Button className="h-8 mt-2" variant="secondary">
                Xem trang cá nhân
              </Button>
            </Link>
          )}
        </div>
      </div>

      {selectedUser.id === "ai-support" && messages.length === 0 && (
        <div className="text-center text-gray-500 my-4">
          Xin chào! Tôi là AI Support. Hãy cho tôi biết bạn muốn tìm thú cưng
          như thế nào (giống, vị trí, tình trạng, v.v.)!
        </div>
      )}

      <div className="flex flex-col gap-1">
        {messages &&
          messages.map((msg, index) => renderMessage(msg, index, messages))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
