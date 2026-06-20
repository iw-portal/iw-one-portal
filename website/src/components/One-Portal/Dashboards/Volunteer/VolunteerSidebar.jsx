import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GoPencil } from "react-icons/go";
import { TbFolders } from "react-icons/tb";
import { GrSchedules } from "react-icons/gr";
import { LuMapPinCheckInside } from "react-icons/lu";
import { FcSurvey } from "react-icons/fc";
import { BiLogOut } from "react-icons/bi";
import { TiPointOfInterestOutline } from "react-icons/ti";
import { HiDocumentText, HiOutlineDocumentDuplicate } from "react-icons/hi2";

const VolunteerSidebar = ({ setUser }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("iw_user");
    navigate("/");
  };

  const baseStyle = "block px-3 py-2 rounded-lg transition";
  const activeStyle = "bg-teal-50 text-teal-700 font-semibold";
  const inactiveStyle = "text-gray-600 hover:bg-gray-100";

  const links = [
    {
      to: "/one-portal/volunteer",
      label: "Dashboard",
      end: true,
      icon: <MdHome />,
    },
    {
      to: "/one-portal/volunteer/profile",
      label: "Profile",
      icon: <CgProfile />,
    },
    // {
    //   to: "/one-portal/volunteer/registration",
    //   label: "Registration",
    //   icon: <GoPencil />,
    // },
    // {
    //   to: "/one-portal/volunteer/programs",
    //   label: "Programs",
    //   end: true,
    //   icon: <TbFolders />,
    // },
    {
      to: "/one-portal/volunteer/interest-form",
      label: "Interest Form",
      icon: <TiPointOfInterestOutline />,
    },
    {
      to: "/one-portal/volunteer/f25_26_schedule",
      label: "Classes Schedule",
      icon: <GrSchedules />,
    },
    {
      to: "/one-portal/volunteer/timesheet",
      label: "Timesheet",
      icon: <LuMapPinCheckInside />,
    },
    {
      to: "/one-portal/volunteer/opd-review",
      label: "My OPD",
      icon: <HiDocumentText />,
    },
    {
      label: "OPD Directory",
      to: "/one-portal/volunteer/opds",
      icon: <HiOutlineDocumentDuplicate />,
    },
    // {
    //   to: "/one-portal/volunteer/surveys",
    //   label: "Surveys",
    //   icon: <FcSurvey />,
    // },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <img
          src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
          alt="banner-logo"
          className="h-10 object-contain"
        />
        <button onClick={() => setOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[80%] bg-white p-5 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Menu</h2>
              <FaTimes
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <nav className="space-y-3 mt-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex gap-4 pt-10 ${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                  }
                >
                  <p className="flex items-center gap-3 text-gray-600">
                    <span className="text-md">{link.icon}</span>
                    <span className="pt-10">{link.label}</span>
                  </p>
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex gap-4 text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100"
              >
                <span className="text-lg">
                  <BiLogOut />
                </span>
                Logout
              </button>
            </nav>
          </div>

          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-white shadow-md p-5 min-h-screen">
        <img
          src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
          alt="banner-logo"
        />

        <nav className="space-y-3 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex gap-4 pt-1${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <span className="pt-1 text-xl">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex gap-4 text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100"
          >
            <span className="text-xl pt-1">
              <BiLogOut />
            </span>
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default VolunteerSidebar;
