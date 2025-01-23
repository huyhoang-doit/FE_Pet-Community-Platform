import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";

  return (
    <div>
      {!isRootRoute && <LeftSidebar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
