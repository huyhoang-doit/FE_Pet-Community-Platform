import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatVND } from "@/utils/formatVND";

const TopDonate = () => {
  const topDonate = [
    {
      username: "John Doe",
      profilePicture: "https://via.placeholder.com/150",
      amount: 1000000,
    },
    {
      username: "Nguyen Van A",
      profilePicture: "https://via.placeholder.com/150",
      amount: 1000000,
    },
    {
      username: "Nguyen Van B",
      profilePicture: "https://via.placeholder.com/150",
      amount: 1000000,
    },
    {
      username: "Nguyen Van C",
      profilePicture: "https://via.placeholder.com/150",
      amount: 1000000,
    },
    {
      username: "John Doe",
      profilePicture: "https://via.placeholder.com/150",
      amount: 1000000,
    },
  ];
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-bold text-gray-600">Top ủng hộ</h1>
      </div>
      {topDonate.map((user, index) => {
        return (
          <div key={index} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link
                    to={`/profile/${user?._id}`}
                    className={`
                                                ${
                                                  index === 0 &&
                                                  "username--style1"
                                                } 
                                                ${
                                                  index === 1 &&
                                                  "username--style2"
                                                } 
                                                ${
                                                  index === 2 &&
                                                  "username--style3"
                                                }
                                            `}
                  >
                    {user?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {formatVND(user?.amount)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopDonate;
