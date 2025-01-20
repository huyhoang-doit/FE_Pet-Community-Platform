/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { addPostsAPI } from "@/apis/post";
import EmojiPicker from "emoji-picker-react";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState([]);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFile(files);
      const filePreviews = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await readFileAsDataURL(files[i]);
        filePreviews.push(dataUrl);
      }
      setImagePreview(filePreviews);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (file && file.length > 0) {
      Array.from(file).forEach((fileItem) => {
        formData.append("media", fileItem);
      });
    }
    try {
      setLoading(true);
      const { data } = await addPostsAPI(formData);
      if (data.status === 201) {
        dispatch(setPosts([data.data, ...posts]));
        setCaption("");
        setImagePreview([]);
        toast.success(data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />
        <EmojiPicker open={false} />
        {imagePreview && imagePreview.length > 0 && (
          <div className="w-full h-64 flex flex-wrap items-center justify-center space-x-4">
            {imagePreview.map((preview, index) => (
              <div
                key={index}
                className="w-32 h-32 flex items-center justify-center"
              >
                <img
                  src={preview}
                  alt={`preview_img_${index}`}
                  className="object-cover h-full w-full rounded-md"
                />
              </div>
            ))}
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          multiple
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
