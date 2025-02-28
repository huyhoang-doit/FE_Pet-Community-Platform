import ChatPage from "./components/pages/ChatPage";
import EditProfile from "./components/pages/EditProfile";
import Profile from "./components/pages/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/routing/ProtectedRoutes";
import "./App.css";
import DonateCancel from "./components/features/donate/DonateCancel";
import LoadingSpinner from "./components/core/LoadingSpinner";
import MainLayout from "./components/layouts/MainLayout";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Home from "./components/pages/Home";
import { SocketProvider } from "./contexts/SocketProvider";
import PostDetail from "./components/features/posts/PostDetail";
import BlogList from "./components/features/blog/BlogList";
import BlogDetail from "./components/features/blog/BlogDetail";
import BlogCreate from "./components/features/blog/BlogCreate";
import BlogEdit from "./components/features/blog/BlogEdit";
import Dashboard from "./components/pages/AdminPages/Dashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import User from "./components/pages/AdminPages/User";
import Donate from "./components/pages/AdminPages/Donate";
import ManageStaff from "./components/pages/AdminPages/ManageStaff";
import { SubmitPet } from "./components/submitPet";
import { ApprovePet, ManagePet } from "./components/pages/StaffPages";
import StaffSideBarLayout from "./components/layouts/StaffSideBarLayout";
import ManageAdoptionPost from "./components/pages/StaffPages/Services/ManageAdoptionPost";
import ManageSendPets from "./components/pages/StaffPages/Services/ManageSendPet";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/forum",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/adopt",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/p/:id",
        element: (
          <ProtectedRoutes>
            <PostDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat/:id",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/donate/cancel",
        element: (
          <ProtectedRoutes>
            <DonateCancel>
              <Home />
            </DonateCancel>
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog",
        element: (
          <ProtectedRoutes>
            <BlogList />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog/:id",
        element: (
          <ProtectedRoutes>
            <BlogDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog/create",
        element: (
          <ProtectedRoutes>
            <BlogCreate />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/blog/:id/edit",
        element: (
          <ProtectedRoutes>
            <BlogEdit />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/submitPet",
        element: (
          <ProtectedRoutes>
            <SubmitPet />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <User />,
      },
      {
        path: "donate",
        element: <Donate />,
      },
      {
        path: "staff",
        element: <ManageStaff />,
      },
    ],
  },
  {
    path: "/staff-forum",
    element: (
      <ProtectedRoutes allowedRoles={["forum_staff"]}>
        <StaffSideBarLayout>
          <ManageStaff />
        </StaffSideBarLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "managePost",
        element: <ApprovePet />,
      },
      {
        path: "manageBlog",
        element: <ManagePet />,
      },
      {
        path: "approvePost",
        element: <ManagePet />,
      },
    ],
  },
  {
    path: "/staff-services",
    element: (
      <ProtectedRoutes allowedRoles={["services_staff"]}>
        <StaffSideBarLayout>
          <ManageStaff />
        </StaffSideBarLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "approvePet",
        element: <ApprovePet />,
      },
      {
        path: "managePet",
        element: <ManagePet />,
      },
      {
        path: "manageAdoptionPost",
        element: <ManageAdoptionPost />,
      },
      {
        path: "manageSendPets",
        element: <ManageSendPets />,
      },
    ],
  },
]);

function App() {
  return (
    <SocketProvider>
      <LoadingSpinner />
      <RouterProvider router={browserRouter} />
    </SocketProvider>
  );
}

export default App;
