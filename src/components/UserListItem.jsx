/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

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
            {userData.isVerified && (
              <svg
                aria-label="Verified"
                className="inline-block"
                fill="rgb(0, 149, 246)"
                height="18"
                role="img"
                viewBox="0 0 40 40"
                width="18"
              >
                <title>Verified</title>
                <path
                  d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            )}
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
