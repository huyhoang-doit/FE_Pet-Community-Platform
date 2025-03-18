/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const Messages = ({ selectedUser, sendMessageHandler }) => {
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

  const handleAnswerClick = (caption, msgId) => {
    const lastAiMessageWithButtons = messages
      .filter((msg) => msg.senderId === "ai-support" && msg.suggestionButtons)
      .slice(-1)[0];

    if (lastAiMessageWithButtons && msgId === lastAiMessageWithButtons._id) {
      sendMessageHandler(selectedUser.id, caption);
    }
  };

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
    const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
    const showAvatar =
      msg.senderId !== user?.id && (!nextMsg || nextMsg.senderId !== msg.senderId);
    const isLastAiMessageWithButtons =
      msg.senderId === "ai-support" &&
      msg.suggestionButtons &&
      msg._id ===
        messages
          .filter((m) => m.senderId === "ai-support" && m.suggestionButtons)
          .slice(-1)[0]?._id;

    // Xử lý loading message
    if (msg._id === "loading") {
      return (
        <div key={msg._id} className="flex items-center gap-2 text-gray-500">
          <div className="w-8 h-8" />
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{msg.message}</span>
          </div>
        </div>
      );
    }

    return (
      <div key={msg._id} className="flex flex-col">
        <div
          className={`flex items-end gap-2 ${
            msg.senderId === user?.id ? "justify-end" : "justify-start"
          }`}
        >
          {msg.senderId !== user?.id && (
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
            className={`p-3 rounded-lg max-w-[70%] break-words ${
              msg.senderId === user?.id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            <div className="markdown-content prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  strong: ({ node, ...props }) => (
                    <span className="font-bold text-red-500" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-1 last:mb-0" {...props} />
                  ),
                }}
              >
                {msg.message}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Render post link nếu có */}
        {renderPostLink(
          msg.metadata,
          msg.senderId === user?.id
        )}

        {/* Hiển thị nút gợi ý */}
        {msg.senderId === "ai-support" && msg.suggestionButtons && (
          <div className="mt-2 ml-10 flex flex-wrap gap-2">
            {msg.suggestionButtons.map((btn) => (
              <Button
                key={btn.index}
                onClick={() =>
                  btn.url
                    ? window.open(btn.url, "_blank")
                    : handleAnswerClick(btn.caption, msg._id)
                }
                variant="secondary"
                size="sm"
                className={`
                  text-sm hover:bg-gray-200 
                  ${!isLastAiMessageWithButtons 
                    ? "opacity-50 cursor-not-allowed" 
                    : ""}
                `}
                disabled={!isLastAiMessageWithButtons}
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

      <div className="flex flex-col gap-3">
        {messages && messages.map((msg, index) => renderMessage(msg, index, messages))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
