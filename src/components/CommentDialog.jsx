/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import VerifiedBadge from "./VerifiedBadge";
import Carousel from "./ui/carousel";
import { addCommentAPI } from "@/apis/comment";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await addCommentAPI(selectedPost._id, text);
      console.log(res);

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[1700px] h-[100vh]">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 flex justify-center items-center">
            {selectedPost &&
            (selectedPost.image?.length || 0) +
              (selectedPost.video?.length || 0) ===
              1 ? (
              selectedPost.image?.length === 1 ? (
                <img
                  src={selectedPost.image[0]}
                  alt="post_img"
                  className="w-auto h-full object-cover rounded-md"
                />
              ) : (
                <video
                  src={selectedPost.video[0]}
                  className="w-auto h-full object-cover rounded-md"
                  autoPlay
                  muted
                  loop
                />
              )
            ) : (
              <Carousel
                autoSlide={false}
                containerClass="carousel-container"
                itemClass="carousel-item"
              >
                {[
                  ...(selectedPost?.image || []).map((image, index) => (
                    <img
                      key={`img-${index}`}
                      src={image}
                      alt={`post_img_${index}`}
                    />
                  )),
                  ...(selectedPost?.video || []).map((video, index) => (
                    <video
                      key={`vid-${index}`}
                      src={video}
                      className="object-cover rounded-md"
                      autoPlay
                      muted
                      loop
                    />
                  )),
                ]}
              </Carousel>
            )}
          </div>

          {/* Right side - Details */}
          <div className="w-[400px] flex flex-col border-l">
            {/* Post header */}
            <div className="flex justify-between items-center gap-2 p-4 border-b">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar
                    className="h-8 w-8"
                    style={{ border: "1px solid #e0e0e0" }}
                  >
                    <AvatarImage src={selectedPost?.author.profilePicture} />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <div className="flex text-sm items-center gap-2">
                    <span className="font-semibold">
                      {selectedPost?.author.username}
                    </span>
                    {selectedPost?.author.isVerified && (
                      <VerifiedBadge size={14} />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Hồ Chí Minh</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Post details */}
            <div className="flex-1 overflow-y-auto">
              {/* Post caption */}
              <div className="flex gap-3 px-4 pt-5">
                <Avatar
                  className="h-8 w-8"
                  style={{ border: "1px solid #e0e0e0" }}
                >
                  <AvatarImage src={selectedPost?.author.profilePicture} />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <span className="text-sm flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {selectedPost?.author.username}
                    </span>
                    {selectedPost?.author.isVerified && (
                      <VerifiedBadge size={14} />
                    )}
                  </div>
                  <span className="text-sm whitespace-normal break-words">
                    {selectedPost?.caption}
                  </span>
                </span>
              </div>
              <div className="px-4 py-5 space-y-5">
                {comment.length > 0 &&
                  comment.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <Avatar
                        className="h-8 w-8"
                        style={{ border: "1px solid #e0e0e0" }}
                      >
                        <AvatarImage src={comment.author.profilePicture} />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {comment.author.username}
                          </span>
                          {comment.author.isVerified && (
                            <VerifiedBadge size={14} />
                          )}
                        </div>
                        <span className="text-sm whitespace-normal break-all overflow-wrap-anywhere max-w-full">
                          {comment.text}
                        </span>
                      </span>
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
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="outline"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
