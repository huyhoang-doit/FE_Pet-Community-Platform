import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "../layouts/RightSidebar";
import useFetchData from "@/hooks/useFetchData";

const Home = () => {
  useFetchData()

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
