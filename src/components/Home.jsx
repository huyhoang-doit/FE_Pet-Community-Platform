import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetCampaign from "@/hooks/useGetCampaign";
import useGetTopDonate from "@/hooks/useGetTopDonate";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  useGetCampaign();
  useGetTopDonate();

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <div className="w-[350px]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
