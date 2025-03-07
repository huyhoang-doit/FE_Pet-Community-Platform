import { Outlet, useLocation } from "react-router-dom";
import RightSidebar from "../layouts/RightSidebar";
import ForumFeeds from "./ForumFeeds";
import AdoptFeeds from "./AdoptFeeds";
import useFetchData from "@/hooks/useFetchData";
import { useSelector } from "react-redux";
const Home = () => {
  useFetchData();

  const location = useLocation();
  const { adoptPosts } = useSelector((store) => store.adopt);
  console.log('adoptPosts',adoptPosts)

  const renderFeed = () => {
    if (location.pathname.includes("/forum")) {
      return <ForumFeeds />;
    }
    if (location.pathname.includes("/adopt")) {
      return <AdoptFeeds />;
    }
    return <Outlet />;
  };

  return (
    <div className="flex">
      <div className="flex-grow">{renderFeed()}</div>
      <aside className="w-[350px] hidden lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default Home;
