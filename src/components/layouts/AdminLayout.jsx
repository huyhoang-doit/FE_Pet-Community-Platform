import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaHouse, FaCircleUser, FaSuitcase, FaBars } from "react-icons/fa6";
import { FaMoneyBill, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Left Navigation */}
      <motion.nav
        initial={{ width: sidebarOpen ? 64 : 16 }}
        animate={{ width: sidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-800 text-white p-4 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className={`text-xl font-bold ${sidebarOpen ? "block" : "hidden"}`}
          >
            Admin Panel
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className=" p-2 text-white rounded-md transition-all duration-300"
          >
            {sidebarOpen ? <FaTimesCircle className="text-xl" /> : <FaBars />}
          </motion.button>
        </div>

        <ul>
          {[
            { path: "/admin/dashboard", icon: <FaHouse />, label: "Dashboard" },
            { path: "/admin/users", icon: <FaCircleUser />, label: "Users" },
            { path: "/admin/staff", icon: <FaSuitcase />, label: "Staff" },
            {
              path: "/admin/donate",
              icon: <FaMoneyBill />,
              label: "Donations",
            },
          ].map((item) => (
            <motion.li key={item.path} whileHover={{ scale: 1.05 }}>
              <Link
                to={item.path}
                className={`flex items-center my-1 ${
                  sidebarOpen ? "px-4" : "justify-center"
                } py-2 hover:bg-gray-700 rounded w-full ${
                  location.pathname === item.path
                    ? "bg-gray-700 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                {item.icon}
                <span className={`${sidebarOpen ? "block ml-3" : "hidden"}`}>
                  {item.label}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-6 bg-gray-100 overflow-y-auto"
      >
        <Outlet /> {/* This will render the child routes */}
      </motion.div>
    </div>
  );
};

export default AdminLayout;
