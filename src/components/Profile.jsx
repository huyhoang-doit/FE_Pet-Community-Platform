import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import UserListItem from "./UserListItem";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import VerifiedBadge from "./VerifiedBadge";
import { setSelectedPost } from "@/redux/postSlice";
import CommentDialog from "./CommentDialog";

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
  const [modalType, setModalType] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setNumberFollowers(userProfile?.followers.length);
    setNumberFollowing(userProfile?.following.length);
    setIsFollowing(userProfile?.followers.includes(user?._id));
  }, [userProfile, user]);

  const followOrUnfollowHandler = async () => {
    try {
      const { data } = await authorizedAxiosInstance.post(
        `http://localhost:3000/api/v1/user/followorunfollow/${userId}`
      );
      
      if (data.status === 200) {
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
        toast.success(data.message);
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

  const handlePostClick = async (post) => {
    try {
      const res = await authorizedAxiosInstance.get(
        `http://localhost:3000/api/v1/post/${post._id}/getpostbyid`
      );
      console.log(res);

      dispatch(setSelectedPost(res.data.post));
      setShowPostModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

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
                {userProfile?.isVerified && <VerifiedBadge size={18} />}
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
                  onClick={() => {
                    handlePostClick(post);
                  }}
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm w-full aspect-square object-cover"
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

      <CommentDialog open={showPostModal} setOpen={setShowPostModal} />

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
