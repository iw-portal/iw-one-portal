import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuUser,
  LuClipboardList,
  LuBookOpen,
  LuUsers,
  LuCalendarCheck,
  LuMail,
  LuMenu,
} from "react-icons/lu";

import { HiClipboardCheck } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";

import { HiOutlineChartBar, HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { LogOut, X } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LuLayoutDashboard />,
    path: "/one-portal/program-lead",
  },
  {
    label: "Profile",
    icon: <LuUser />,
    path: "/one-portal/program-lead/profile",
  },
  {
    label: "Programs",
    icon: <LuBookOpen />,
    path: "/one-portal/program-lead/programs",
  },
  {
    label: "Attendance",
    icon: <LuCalendarCheck />,
    path: "/one-portal/program-lead/attendance",
  },
  {
    label: "Timesheet Approval",
    icon: <HiClipboardCheck />,
    path: "/one-portal/program-lead/timesheet-approval",
  },
  {
    label: "OPD Directory",
    path: "/one-portal/program-lead/opds",
    icon: <HiOutlineDocumentDuplicate />,
  },
];

export default function ProgramLeadSidebar({ setUser }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-[#0f5b54]">Program Lead</h1>

        <p className="text-sm text-gray-500 mt-1">Lead Dashboard</p>
      </div>

      <nav className="p-4 flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/one-portal/program-lead"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-[#0f5b54] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
        {/* 
        <button
          onClick={() => {
            localStorage.removeItem("iw_user");

            if (setUser) {
              setUser(null);
            }

            navigate("/one-portal/login");
          }}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-xl mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button> */}

        <button
          onClick={() => {
            localStorage.removeItem("iw_user");

            if (setUser) {
              setUser(null);
            }

            navigate("/one-portal/login");
          }}
          className="w-full flex gap-4 text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100"
        >
          <span className="text-lg">
            <BiLogOut />
          </span>
          Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Header */}

      <div className="lg:hidden sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-[#0f5b54] text-lg">Program Lead</h1>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <LuMenu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-bold text-lg">Menu</h2>

              <button onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}

      <aside className="hidden lg:flex lg:w-72 bg-white border-r min-h-screen flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
