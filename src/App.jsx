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
import Admin from "./components/pages/AdminPages/Admin";
import Dashboard from "./components/pages/AdminPages/Dashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import User from "./components/pages/AdminPages/User";
import Donate from "./components/pages/AdminPages/Donate";
import Staff from "./components/pages/AdminPages/Staff";
import AdoptionPosts from "./components/features/adoptions/AdoptionPosts";
import { SubmitPet } from "./components/submitPet";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <LandingPage />
          </ProtectedRoutes>
        ),
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
            <AdoptionPosts />
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
      // <ProtectedRoutes> //thêm vào sau khi xác thực người dùng
      <AdminLayout>
        <Admin />
      </AdminLayout>
      // </ProtectedRoutes>
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
        element: <Staff />,
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
