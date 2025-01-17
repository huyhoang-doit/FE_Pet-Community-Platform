import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import UserListItem from "./UserListItem";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(
    userProfile?.followers.includes(user?._id)
  );
  const [numberFollowers, setNumberFollowers] = useState(
    userProfile?.followers.length
  );
  const [numberFollowing, setNumberFollowing] = useState(
    userProfile?.following.length
  );
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "followers" or "following"
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [comments, setComments] = useState([]);

  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setNumberFollowers(userProfile?.followers.length);
    setNumberFollowing(userProfile?.following.length);
  }, [userProfile]);

  const followOrUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setIsFollowing(!isFollowing);
        setNumberFollowers(
          isFollowing ? numberFollowers - 1 : numberFollowers + 1
        );

        dispatch(
          setUserProfile({
            ...userProfile,
            followers: isFollowing
              ? userProfile.followers.filter((id) => id !== user._id)
              : [...userProfile.followers, user._id],
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowClick = (type) => {
    setModalType(type);
    setShowFollowModal(true);
  };

  const getModalUsers = () => {
    if (!userProfile) return [];
    return modalType === "followers"
      ? userProfile.followers
      : userProfile.following;
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handlePostClick = async (post) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment/all`, {}, { withCredentials: true });
      if (res.data.success) {
        setComments(res.data.comments);
        console.log('res.data.comments', res.data.comments)
        setSelectedPost(post);
        setShowPostModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-40 w-40">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">
                  {userProfile?.username}
                </span>
                {userProfile?.isVerified && (
                  <svg aria-label="Đã xác minh" className="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="18" role="img" viewBox="0 0 40 40" width="18"><title>Đã xác minh</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                )}
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Chỉnh sửa trang cá nhân
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Cài đặt
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={followOrUnfollowHandler}
                    >
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                    onClick={followOrUnfollowHandler}
                  >
                    Theo dõi
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => handleFollowClick("followers")}
                >
                  <span className="font-semibold">{numberFollowers} </span>
                  followers
                </p>
                <p
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => handleFollowClick("following")}
                >
                  <span className="font-semibold">{numberFollowing} </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
                <span>🤯Learn code with patel mernstack style</span>
                <span>🤯Turing code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              BÀI VIẾT
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              ĐÃ LƯU
            </span>
            <span className="py-3 cursor-pointer">ĐƯỢC GẮN THẺ</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="max-w-7xl h-[80vh]">
          <div className="flex h-full">
            {/* Left side - Image */}
            <div className="flex-1">
              <img
                src={selectedPost?.image}
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side - Details */}
            <div className="w-[350px] flex flex-col border-l">
              {/* Post header */}
              <div className="flex items-center gap-2 p-4 border-b">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile?.profilePicture} />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{userProfile?.username}</span>
                  <span className="text-sm text-gray-500">Hồ Chí Minh</span>
                </div>
              </div>

              {/* Post details */}
              <div className="flex-1 overflow-y-auto">
                {/* Post caption */}
                <div className="flex gap-3 p-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.profilePicture} />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold mr-2 text-sm">
                      {userProfile?.username}
                    </span>
                    <span>{selectedPost?.caption}</span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.profilePicture} />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium mr-2">
                          {comment.author.username}
                        </span>
                        <span>{comment.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post actions */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 cursor-pointer" />
                  <MessageCircle className="w-6 h-6 cursor-pointer" />
                </div>
                <p className="font-semibold mt-2">
                  {selectedPost?.likes?.length} likes
                </p>
              </div>

              <div className="p-4 border-t flex items-center gap-3">
                <textarea
                  placeholder="Add a comment..."
                  className="flex-1 resize-none outline-none h-[18px] max-h-[80px] text-sm"
                  rows={1}
                  style={{ height: "18px" }}
                  value={text}
                  onChange={changeEventHandler}
                />
                <button onClick={commentHandler} className="text-blue-500 font-semibold hover:text-blue-700">
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFollowModal} onOpenChange={setShowFollowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {getModalUsers().map((userId) => (
              <UserListItem
                key={userId}
                userId={userId}
                onClose={() => setShowFollowModal(false)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
