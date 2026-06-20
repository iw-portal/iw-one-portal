import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTimes, FaRegNewspaper } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { cloneElement } from "react";
import { MdAppRegistration } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { IoBug } from "react-icons/io5";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

const AdminSidebar = ({ setUser, open, setOpen }) => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/one-portal/admin", icon: <Home /> },
    {
      name: "Programs",
      path: "/one-portal/admin/programs",
      icon: <FileText />,
    },
    {
      name: "Attendance",
      path: "/one-portal/admin/attendance",
      icon: <Calendar />,
    },
    {
      name: "Registration",
      path: "/one-portal/admin/registration",
      icon: <MdAppRegistration />,
    },
    {
      name: "Applications",
      path: "/one-portal/admin/applications",
      icon: <VscPreview />,
    },
    // {
    //   name: "User Management",
    //   path: "/one-portal/admin/users",
    //   icon: <Users />,
    // },
    {
      name: "People Management",
      path: "/one-portal/admin/people",
      icon: <Users />,
    },
    {
      name: "OPD Directory",
      path: "/one-portal/admin/opds",
      icon: <HiOutlineDocumentDuplicate />,
    },
    // {
    //   name: "Volunteer Management",
    //   path: "/one-portal/admin/volunteers",
    //   icon: <Users />,
    // },
    {
      name: "News & Events Management",
      path: "/one-portal/admin/news-management",
      icon: <FaRegNewspaper />,
    },
    // { name: "Surveys", path: "/one-portal/admin/surveys", icon: <FileText /> },
    // { name: "Reports", path: "/one-portal/admin/reports", icon: <FileText /> },
    {
      name: "Notifications Send",
      path: "/one-portal/admin/notifications",
      icon: <Bell />,
    },
    { name: "Profile", path: "/one-portal/admin/profile", icon: <Users /> },
    { name: "Bugs Reported", path: "/one-portal/admin/bugs", icon: <IoBug /> },
  ];

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      isActive ? "bg-teal-800 text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* 🔹 MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar Panel */}
          <div className="w-[80%] max-w-xs bg-white h-full shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h2 className="font-bold text-lg">Menu</h2>
              <FaTimes
                onClick={() => setOpen(false)}
                className="text-xl cursor-pointer"
              />
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-2 px-4 py-4 flex-1 overflow-y-auto">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/one-portal/admin"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl ${
                      isActive
                        ? "bg-teal-800 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-4 pb-6">
              <button
                onClick={() => {
                  setUser(null);
                  localStorage.removeItem("iw_user");
                  navigate("/one-portal/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-xl"
              >
                <LogOut />
                Logout
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* 🔹 DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-5 min-h-screen">
        <img
          src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
          alt="logo"
          className="h-20 object-contain"
        />

        <nav className="space-y-2 mt-5">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/one-portal/admin"}
              className={linkStyle}
            >
              {/* {item.icon} */}
              {cloneElement(item.icon, {
                className: item.name === "Fees" ? "w-6 h-6" : "w-5 h-5",
              })}
              {item.name}
            </NavLink>
          ))}

          <button
            onClick={() => {
              setUser(null);
              navigate("/one-portal/login");
            }}
            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg w-full mt-4"
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
