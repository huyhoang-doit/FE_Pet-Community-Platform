import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setChatUsers, setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { setMessages } from "@/redux/chatSlice";
import { useParams } from "react-router-dom";
import { getProfileByIdAPI } from "@/apis/user";
import { sendMessageAPI } from "@/apis/message";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";

const ChatPage = () => {
  const { id } = useParams();
  const [textMessage, setTextMessage] = useState("");
  const { user, selectedUser, chatUsers } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const getProfileChat = async () => {
        const { data } = await getProfileByIdAPI(id);
        dispatch(setSelectedUser(data.data));
      };
      getProfileChat();
    }
  }, [id]);

  const sendMessageHandler = async (receiverId) => {
    try {
      const { data } = await sendMessageAPI(receiverId, textMessage);
      if (data.success) {
        dispatch(setMessages([...messages, data.newMessage]));
        setTextMessage("");

        const isExistingChat = chatUsers.some(
          (user) => user._id === receiverId
        );
        if (!isExistingChat) {
          dispatch(setChatUsers([selectedUser, ...chatUsers]));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[5%] h-screen">
      <section className="w-full md:w-1/5 border-r border-r-gray-300">
        <h1 className="font-bold my-8 text-xl">{user?.username}</h1>
        <div className="flex items-center justify-between mb-4 pr-4">
          <span className="text-md font-bold">Tin nhắn</span>
          <span className="text-sm font-bold text-gray-500">
            Tin nhắn đang chờ
          </span>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          {chatUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser.id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center hover:bg-gray-50 cursor-pointer pb-4"
              >
                <div className="relative">
                  <Avatar
                    className="w-14 h-14"
                    style={{ border: "1px solid #e0e0e0" }}
                  >
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col">
                  {suggestedUser.firstName && suggestedUser.lastName ? (
                    <span className="text-sm">
                      {suggestedUser?.lastName} {suggestedUser?.firstName}
                    </span>
                  ) : (
                    <span className="text-sm">{suggestedUser?.username}</span>
                  )}
                  {isOnline ? (
                    <span className="text-xs text-gray-500">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className={`text-xs text-gray-500 `}>
                      {suggestedUser?.lastMessage.from === user?._id
                        ? "Bạn: "
                        : ""}
                      {suggestedUser?.lastMessage.content} •{" "}
                      {calculateTimeAgo(suggestedUser?.lastMessage.time)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar style={{ border: "1px solid #e0e0e0" }}>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {selectedUser.firstName && selectedUser.lastName ? (
                  <span className="text-sm">
                    {selectedUser?.lastName} {selectedUser?.firstName}
                  </span>
                ) : (
                  <span className="text-sm">{selectedUser?.username}</span>
                )}
              </span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              onChange={(e) => setTextMessage(e.target.value)}
              value={textMessage}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Nhắn tin..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
