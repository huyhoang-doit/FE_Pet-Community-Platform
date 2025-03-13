import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton
} from "react-share";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram, FaEnvelope } from "react-icons/fa";
import { Send } from "lucide-react";

const ShareButton = ({ post }) => {
  const postUrl = `${window.location.origin}/post/${post._id}`;
  const postTitle = post.title;

  return (
    <div className="relative inline-block">
      <Send
        size={22}
        className="cursor-pointer hover:text-gray-600"
        onClick={() => document.getElementById(`share-${post._id}`).classList.toggle("hidden")}
      />

      {/* Dropdown Menu */}
      <div
        id={`share-${post._id}`}
        className="hidden absolute bg-white border rounded-md shadow-md p-2 right-0 mt-1 z-10"
      >
        <FacebookShareButton url={postUrl} quote={postTitle}>
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaFacebook className="text-blue-600" /> Facebook
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={postUrl} title={postTitle}>
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaTwitter className="text-blue-400" /> Twitter
          </div>
        </TwitterShareButton>

        <LinkedinShareButton url={postUrl} title={postTitle}>
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaLinkedin className="text-blue-700" /> LinkedIn
          </div>
        </LinkedinShareButton>

        <WhatsappShareButton url={postUrl} title={postTitle} separator=" - ">
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaWhatsapp className="text-green-500" /> WhatsApp
          </div>
        </WhatsappShareButton>

        <TelegramShareButton url={postUrl} title={postTitle}>
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaTelegram className="text-blue-500" /> Telegram
          </div>
        </TelegramShareButton>

        <EmailShareButton url={postUrl} subject={postTitle} body={`Check out this post: ${postUrl}`}>
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer">
            <FaEnvelope className="text-red-500" /> Email
          </div>
        </EmailShareButton>
      </div>
    </div>
  );
};

export default ShareButton;
