import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaBars } from "react-icons/fa";

const AdminLayout = ({ children, setUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (handles both mobile + desktop internally) */}
      <AdminSidebar open={open} setOpen={setOpen} setUser={setUser} />

      {/* Main Area */}
      <div className="flex-1 w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center px-3 py-3 bg-white border-b shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="text-xl" />
          </button>

          <div className="flex-1 flex justify-center">
            <div className="w-[75%] max-w-xs bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center justify-center shadow">
              <img
                src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
                className="h-6"
              />
            </div>
          </div>

          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
