import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const isBlogRoute = location.pathname.includes("/blog");

  return (
    <div className="min-h-screen">
      {!isRootRoute && !isBlogRoute && (
        <div className="grid grid-cols-[auto,1fr]">
          <LeftSidebar />
          <main className="min-h-screen w-full">
            <Outlet />
          </main>
        </div>
      )}
      {(isRootRoute || isBlogRoute) && (
        <main className="min-h-screen w-full">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default MainLayout;
