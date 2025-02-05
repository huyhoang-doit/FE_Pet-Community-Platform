import ForumFeeds from "./ForumFeeds";
import { Outlet, useLocation } from "react-router-dom";
import RightSidebar from "../layouts/RightSidebar";
import useFetchData from "@/hooks/useFetchData";
import AdoptFeeds from "./AdoptFeeds";

const Home = () => {
  useFetchData();
  const location = useLocation();
  return (
    <div className="flex">
      <div className="flex-grow">
        {location.pathname.includes("/forum") && <ForumFeeds />}
        {location.pathname.includes("/adopt") && <AdoptFeeds />}
        <Outlet />
      </div>
      <aside className="w-[350px] hidden lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default Home;
