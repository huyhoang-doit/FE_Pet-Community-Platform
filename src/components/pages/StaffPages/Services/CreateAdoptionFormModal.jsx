/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CreateAdoptionFormModal = ({ open, setOpen, post, onSubmit }) => {
  const [adopterName, setAdopterName] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adopterPhone, setAdopterPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      postId: post._id,
      petId: post.pet._id,
      adopter: {
        name: adopterName,
        email: adopterEmail,
        phone: adopterPhone,
      },
      message,
    };

    try {
      setLoading(true);
      // Placeholder for API call (replace with your actual API)
      console.log("Submitting adoption form:", formData);
      // Example: await submitAdoptionFormAPI(formData);
      onSubmit(formData);
      toast.success("Form đã được gửi thành công!");
      setOpen(false);
      setAdopterName("");
      setAdopterEmail("");
      setAdopterPhone("");
      setMessage("");
    } catch (error) {
      toast.error(error.message || "Lỗi khi gửi form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-xl">
        <DialogHeader className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Tạo form gửi người nhận nuôi
          </h2>
          <p className="text-sm text-gray-500">Bài đăng: {post.caption}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adopter Name */}
          <div>
            <Label
              htmlFor="adopterName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên người nhận nuôi
            </Label>
            <Input
              id="adopterName"
              value={adopterName}
              onChange={(e) => setAdopterName(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập tên người nhận nuôi"
              required
            />
          </div>

          {/* Adopter Email */}
          <div>
            <Label
              htmlFor="adopterEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </Label>
            <Input
              id="adopterEmail"
              type="email"
              value={adopterEmail}
              onChange={(e) => setAdopterEmail(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập email"
              required
            />
          </div>

          {/* Adopter Phone */}
          <div>
            <Label
              htmlFor="adopterPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </Label>
            <Input
              id="adopterPhone"
              type="tel"
              value={adopterPhone}
              onChange={(e) => setAdopterPhone(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/* Message */}
          <div>
            <Label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tin nhắn
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400"
              placeholder="Nhập tin nhắn hoặc điều khoản nhận nuôi"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi form"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdoptionFormModal;
