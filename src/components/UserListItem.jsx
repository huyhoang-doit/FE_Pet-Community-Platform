/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import VerifiedBadge from "./VerifiedBadge";

const UserListItem = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setUserData(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userData) return null;
  const handleClick = () => {
    onClose(); // Close the modal before navigation
  };
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userData.profilePicture} alt={userData.username} />
          <AvatarFallback>{userData.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link
            to={`/profile/${userData._id}`}
            className="font-semibold text-sm hover:underline flex items-center gap-1"
            onClick={handleClick}
          >
            {userData.username}
            {userData.isVerified && <VerifiedBadge size={14}/>}
          </Link>
          <span className="text-gray-500 text-xs">
            {userData.bio?.slice(0, 30)}
          </span>
        </div>
      </div>
      {/* Add follow/unfollow button here if needed */}
    </div>
  );
};

export default UserListItem;
