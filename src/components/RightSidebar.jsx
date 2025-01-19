import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import TopDonate from "./TopDonate";
import ProcessDonate from "./ProcessDonate";
import VerifiedBadge from "./VerifiedBadge";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="my-10 pr-20">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            {user?.isVerified && <VerifiedBadge size={14} />}
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <ProcessDonate />
      <TopDonate />
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
