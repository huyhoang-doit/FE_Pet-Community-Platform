import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Left Navigation */}
      <nav className="bg-gray-800 text-white w-64 p-4">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className="block py-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block py-2 hover:bg-gray-700 rounded"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/donate"
              className="block py-2 hover:bg-gray-700 rounded"
            >
              Donations
            </Link>
          </li>
          <li>
            <Link
              to="/admin/staff"
              className="block py-2 hover:bg-gray-700 rounded"
            >
              Staff
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {" "}
        {/* Added overflow-y-auto */}
        <Outlet /> {/* This will render the child routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
