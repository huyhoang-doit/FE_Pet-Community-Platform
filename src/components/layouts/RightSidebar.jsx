import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import VerifiedBadge from "../core/VerifiedBadge";
import ProcessDonate from "../features/donate/ProcessDonate";
import TopDonate from "../features/donate/TopDonate";
import SuggestedUsers from "../features/users/SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { campaign } = useSelector((store) => store.campaign);
  const { topDonate } = useSelector((store) => store.donate);

  return (
    <div className="my-10 pr-6">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?.username}`}>
          <Avatar style={{ border: "1px solid #e0e0e0" }}>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm flex items-center gap-2">
            <Link to={`/profile/${user?.username}`}>{user?.username}</Link>
            {user?.isVerified && <VerifiedBadge size={14} />}
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      {campaign && <ProcessDonate campaign={campaign} />}
      {topDonate.length > 0 && <TopDonate topDonate={topDonate} />}
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
