import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const isBlogRoute = location.pathname.includes("/blog");

  return (
    <div>
      {!isRootRoute && !isBlogRoute && <LeftSidebar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
