import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { createBlogAPI } from "@/apis/blog";
import { Button } from "@/components/ui/button";

const CATEGORIES = ['Dogs', 'Cats', 'Diet', 'Lifestyle', 'Vet']

const BlogCreate = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createBlogHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            setLoading(true);
            const res = await createBlogAPI(formData);
            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false);
                setTitle("");
                setContent("");
                setThumbnail(null);
                setImagePreview(null);
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
                    Create New Blog
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

                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Blog title..."
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        placeholder="Write your blog content..."
                    />
                </div>

                {imagePreview && (
                    <div className="w-full h-64 flex items-center justify-center">
                        <img
                            src={imagePreview}
                            alt="preview"
                            className="object-cover h-full w-full rounded-md"
                        />
                    </div>
                )}

                <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={fileChangeHandler}
                />

                <Button
                    onClick={() => imageRef.current.click()}
                    className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
                >
                    Select thumbnail
                </Button>

                {loading ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button
                        onClick={createBlogHandler}
                        type="submit"
                        className="w-full"
                        disabled={!title || !content || !thumbnail}
                    >
                        Post Blog
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BlogCreate; 