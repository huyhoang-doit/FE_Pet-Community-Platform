import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "../ui/input";
import { MessageCircleCode } from "lucide-react";
import { setMessages } from "@/redux/chatSlice";
import { useParams } from "react-router-dom";
import { getChatUserAPI, getProfileByIdAPI } from "@/apis/user";
import { sendMessageAPI } from "@/apis/message";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { Button } from "../ui/button";
import Messages from "../features/messages/Messages";
import { fetchAllAdoptionPostsByBreedAPI, getUserBehaviorAPI } from "@/apis/post";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBreedsAPI, getBreedsByIdAPI } from "@/apis/pet";

const ChatPage = () => {
  const { id } = useParams();
  const [textMessage, setTextMessage] = useState("");
  const { user, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [chatUsers, setChatUsers] = useState([]);
  const [userBehavior, setUserBehavior] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const aiUser = {
    id: "ai-support",
    username: "AI Support",
    profilePicture: "https://imgcdn.stablediffusionweb.com/2024/4/3/34eb3fd4-4f5e-4359-be90-19f0366c0c33.jpg",
    lastMessage: {
      content: "Xin chào! Tôi có thể giúp bạn tìm thú cưng để nhận nuôi.",
      time: new Date().toISOString(),
      from: "ai-support",
    },
  };

  useEffect(() => {
    const fetchChatUsers = async () => {
      const { data } = await getChatUserAPI();
      setChatUsers(data.data);
    };
    fetchChatUsers();
  }, []);

  useEffect(() => {
    if (id) {
      const getProfileChat = async () => {
        const { data } = await getProfileByIdAPI(id);
        dispatch(setSelectedUser(data.data));
      };
      getProfileChat();
    }
  }, [id]);

  useEffect(() => {
    if (selectedUser?.id === "ai-support") {
      const fetchUserBehavior = async () => {
        try {
          const res = await getUserBehaviorAPI();
          setUserBehavior(res.data.data);
  
          const welcomeMessage = {
            _id: Date.now().toString(),
            senderId: "ai-support",
            message: "Xin chào! Tôi là AI Support. Bạn muốn tìm thú cưng như thế nào? (Ví dụ: giống, vị trí, tình trạng). Tôi sẽ dựa vào sở thích của bạn để gợi ý!",
            createdAt: new Date().toISOString(),
          };
          dispatch(setMessages([welcomeMessage]));
        } catch (error) {
          console.error("Error fetching user behavior:", error);
          setUserBehavior([]);
        }
      };
      fetchUserBehavior();
    }
  }, [selectedUser, dispatch]);

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }
  
    try {
      if (receiverId === "ai-support") {
        const newMessage = {
          _id: Date.now().toString() + "-user",
          senderId: user?.id,
          message: textMessage,
          createdAt: new Date().toISOString(),
        };
        dispatch(setMessages([...messages, newMessage]));
  
        const userInput = textMessage.trim();
        const selectedIndex = parseInt(userInput) || -1;
  
        const lastAiMessage = messages.findLast(msg => msg.senderId === "ai-support" && msg.suggestionButtons);
        if (lastAiMessage && lastAiMessage.suggestionButtons && selectedIndex > 0 && selectedIndex <= lastAiMessage.suggestionButtons.length) {
          const selectedPet = lastAiMessage.suggestionButtons[selectedIndex - 1];
  
          let breedName = "không xác định";
          try {
            const breedRes = await getBreedsByIdAPI(selectedPet.petBreed);
            breedName = breedRes.data.data.name;
          } catch (error) {
            console.error("Lỗi lấy giống thú cưng:", error);
          }
  
          setIsLoadingAI(true);
          dispatch(setMessages([
            ...messages,
            newMessage,
            { _id: "loading", senderId: "ai-support", message: "🔄 AI đang tìm kiếm thông tin chăm sóc..." }
          ]));
  
          const prompt = `Hãy cung cấp hướng dẫn chăm sóc chi tiết cho giống thú cưng "${breedName}".`;
          let careInstructions;
  
          try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            careInstructions = result.response.text();
          } catch (geminiError) {
            console.error("Gemini API error:", geminiError);
            careInstructions = `
              Hiện tại không thể lấy thông tin chăm sóc từ Gemini. Dưới đây là hướng dẫn cơ bản mặc định:\n
              - **Dinh dưỡng**: Cho ăn thức ăn chất lượng cao, phù hợp với kích thước và độ tuổi.\n
              - **Vệ sinh**: Tắm 1-2 lần/tháng, chải lông thường xuyên.\n
              - **Vận động**: Dắt đi dạo 20-30 phút/ngày.\n
              - **Sức khỏe**: Khám thú y định kỳ.\n
              - **Môi trường**: Chuẩn bị chỗ nghỉ sạch sẽ, thoáng mát.
            `;
          }
  
          setIsLoadingAI(false);
          dispatch(setMessages([
            ...messages.filter(msg => msg._id !== "loading"), 
            newMessage,
            {
              _id: Date.now().toString(),
              senderId: "ai-support",
              message: `
                Bạn đã chọn **${selectedPet.petName}** tại ${selectedPet.location} (${selectedPet.adopt_status}). 
                Đây là hướng dẫn chăm sóc cho giống **${breedName}**:\n${careInstructions}\n
                Bạn muốn hỏi chi tiết hơn về phần nào không?
              `,
              createdAt: new Date().toISOString(),
            }
          ]));
          return;
        }
  
        const requiredKeywords = ["gợi ý", "thú cưng", "nhận nuôi", "loại pet"];
        const lowerText = textMessage.toLowerCase();
        const isValidPrompt = requiredKeywords.some(keyword => lowerText.includes(keyword));
  
        if (!isValidPrompt) {
          const aiResponse = {
            _id: Date.now().toString(),
            senderId: "ai-support",
            message: "Vui lòng nhập prompt liên quan đến gợi ý thú cưng nhận nuôi hoặc số thứ tự của thú cưng bạn muốn biết thêm!",
            createdAt: new Date().toISOString(),
          };
          dispatch(setMessages([...messages, newMessage, aiResponse]));
          setTextMessage("");
          return;
        }
  
        const breedIds = [...new Set(userBehavior.map(behavior => behavior?.postId?.pet?.breed))];
        console.log("Breed IDs:", breedIds);
        if (breedIds.length === 0) {
          throw new Error("Không có dữ liệu hành vi để gợi ý thú cưng.");
        }
  
        const allPosts = [];
        for (const breedId of breedIds) {
          const postsData = await fetchAllAdoptionPostsByBreedAPI(1, breedId);
          allPosts.push(...(postsData?.results || []));
        }
  
        console.log("Post list:", allPosts);
  
        const aiResponseText = allPosts.length > 0
          ? "Dựa trên sở thích của bạn, đây là những thú cưng có thể phù hợp:\n"
          : "Hiện tại tôi không tìm thấy thú cưng nào phù hợp. Bạn có thể thử tìm kiếm giống khác.";
  
        const suggestionButtons = allPosts.map((post, index) => ({
          index: index + 1,
          caption: post.caption || 'Không có tiêu đề',
          location: post.location || 'Không rõ vị trí',
          adopt_status: post.adopt_status || 'Không rõ trạng thái',
          petName: post.pet?.name || 'Không xác định',
          url: `${window.location.origin}/adoptDetail/${post._id}`,
          petBreed: post.pet?.breed || 'Không xác định',
        }));
  
        const petListText = suggestionButtons.map(btn =>
          `${btn.index}. ${btn.petName} - ${btn.location} (${btn.adopt_status})`
        ).join("\n");
  
        const finalMessage = aiResponseText + petListText + "\n\nBạn muốn biết thêm về thú cưng nào? Hãy nhập số thứ tự!";
  
        const aiResponse = {
          _id: Date.now().toString(),
          senderId: "ai-support",
          message: finalMessage,
          createdAt: new Date().toISOString(),
          suggestionButtons,
        };
  
        dispatch(setMessages([...messages, newMessage, aiResponse]));
      } else {
        const { data } = await sendMessageAPI(receiverId, textMessage);
        if (!data?.success) {
          throw new Error("Message send failed");
        }
        dispatch(setMessages([...messages, data.newMessage]));
      }
      setTextMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      const errorMessage = {
        _id: Date.now().toString(),
        senderId: "ai-support",
        message: "Có lỗi xảy ra. Vui lòng thử lại!",
        createdAt: new Date().toISOString(),
      };
      dispatch(setMessages([...messages, errorMessage]));
      setTextMessage("");
    }
  };
  
  

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);


  return (
    <div className="flex ml-[20px] h-screen">
      <section className="w-full md:w-1/5 border-r border-r-gray-300">
        <h1 className="font-bold my-8 text-xl">{user?.username}</h1>
        <div className="flex items-center justify-between mb-4 pr-4">
          <span className="text-md font-bold">Tin nhắn</span>
          <span className="text-sm font-bold text-gray-500">
            Tin nhắn đang chờ
          </span>
        </div>
        <div className="overflow-y-auto h-[80vh]">
        <div
          key={aiUser.id}
          onClick={() => dispatch(setSelectedUser(aiUser))}
          className={`flex gap-3 items-center cursor-pointer py-2 ${
            selectedUser?.id === aiUser.id ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="relative">
            <Avatar
              className="w-14 h-14"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <AvatarImage src={aiUser.profilePicture} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{aiUser.username}</span>
            <span className="text-xs text-gray-500">Đang hoạt động</span>
          </div>
        </div>
          {chatUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?.id);
            const isSelected = selectedUser?.id === suggestedUser?.id;
            return (
              <div
                key={suggestedUser.id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex gap-3 items-center cursor-pointer py-2 ${
                  isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
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
                      {suggestedUser?.lastMessage?.from === user?.id
                        ? "Bạn: "
                        : ""}
                      {suggestedUser?.lastMessage?.content} •{" "}
                      {calculateTimeAgo(suggestedUser?.lastMessage?.time)}
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
            <Button onClick={() => sendMessageHandler(selectedUser?.id)}>
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
