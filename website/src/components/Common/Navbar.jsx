import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      {/* 🔹 Top Header */}
      <div className="bg-gray-800 py-2 px-4 flex flex-col items-center gap-2 md:flex-row md:justify-between md:px-10">
        <a
          href="mailto:info@inclusiveworld.org"
          className="text-white text-sm md:text-lg"
        >
          info@inclusiveworld.org
        </a>

        <div className="flex gap-4 text-white text-lg md:text-2xl">
          <Link to="http://facebook.com/InclusiveWorld">
            <FaFacebookF />
          </Link>
          <Link to="https://www.youtube.com/channel/UC7i-6R26DrnbgQd__xdREDQ">
            <FaYoutube />
          </Link>
          <Link to="http://instagram.com/_inclusiveworld">
            <FaInstagram />
          </Link>
          <Link to="https://www.linkedin.com/company/inclusive-world/">
            <FaLinkedinIn />
          </Link>
        </div>
      </div>

      {/* 🔹 Logo */}
      {/* <div className="border-b">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
            alt="Inclusive World"
            className="mx-auto w-full max-h-[120px] object-contain py-2"
          />
        </Link>
      </div> */}
      <div className="border-b bg-white flex justify-center">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781407035/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6.png"
            alt="Inclusive World"
            className="max-h-[110px] object-contain py-2"
          />
        </Link>
      </div>

      {/* 🔹 NAV */}
      <nav className="bg-gray-100 border-b sticky top-0 z-50">
        <div className="max-w-[1381px] mx-auto px-4 md:px-8 py-3">
          {/* 🔸 MOBILE HEADER */}
          <div className="flex items-center justify-between lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-2xl">
              <FaBars />
            </button>
            {menuOpen ? (
              <span className="font-semibold">Menu</span>
            ) : (
              <span className="font-semibold"></span>
            )}
          </div>

          {/* 🔸 MOBILE MENU */}
          {/* 🔸 MOBILE MENU */}
          {menuOpen && (
            <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
              {/* Top bar */}
              <div className="flex justify-between items-center px-5 py-4 border-b">
                <button onClick={() => setMenuOpen(false)}>
                  <FaTimes className="text-2xl" />
                </button>
                <span className="font-semibold">Menu</span>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 text-lg">
                {/* About */}
                <div>
                  <button
                    onClick={() => toggleSection("about")}
                    className="w-full text-left font-medium"
                  >
                    About ▾
                  </button>
                  {openSection === "about" && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-600">
                      <Link to="/about/mission">Mission & Vision</Link>
                      <Link to="/about/team">Team</Link>
                      <Link to="/about/accomplishments">Accomplishments</Link>
                      <Link to="/about/contact">Contact</Link>
                    </div>
                  )}
                </div>

                {/* Programs */}
                <div>
                  <button
                    onClick={() => toggleSection("programs")}
                    className="w-full text-left font-medium"
                  >
                    Programs ▾
                  </button>
                  {openSection === "programs" && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-600">
                      <Link to="/programs/skills-development">
                        Skills Development
                      </Link>
                      <Link to="/programs/vocational-skills-weekday-program">
                        Vocational Skills Weekday Program
                      </Link>
                      <Link to="/programs/small-business-skills">
                        Small Business
                      </Link>
                      <Link to="/programs/employment-services">Employment</Link>
                      <Link to="/programs/academic-and-vocational-counseling">
                        Academic & Vocational Counseling
                      </Link>
                    </div>
                  )}
                </div>

                {/* Person Centered */}
                <div>
                  <button
                    onClick={() => toggleSection("person")}
                    className="w-full text-left font-medium"
                  >
                    Person Centered Approach ▾
                  </button>
                  {openSection === "person" && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-600">
                      <Link to="/person-centered-approach/thinking">
                        Person Centered Thinking
                      </Link>
                      <Link to="/person-centered-approach/services">
                        Person Centered Services
                      </Link>
                    </div>
                  )}
                </div>

                {/* Community */}
                <div>
                  <button
                    onClick={() => toggleSection("community")}
                    className="w-full text-left font-medium"
                  >
                    Community ▾
                  </button>
                  {openSection === "community" && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-600">
                      <Link to="/skills/partners">Partners</Link>
                      <Link to="/community/supporters">Supporters</Link>
                    </div>
                  )}
                </div>

                {/* News & Events */}
                <div>
                  <button
                    onClick={() => toggleSection("news")}
                    className="w-full text-left font-medium"
                  >
                    News & Events ▾
                  </button>
                  {openSection === "news" && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-600">
                      <Link to="/news-and-events/events-and-news-updates">
                        Events & News Updates
                      </Link>
                      <Link to="/calendar/events">Calendar</Link>
                      <Link to="/news-and-events/newsletters">Newsletters</Link>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="pt-6 flex flex-col gap-4">
                  {/* <Link
                    to="/one-portal/login"
                    className="bg-[#e16a5b] text-white py-3 rounded text-center"
                  >
                    Donate
                  </Link> */}
                  <a
                    href="https://shop-inclusiveworld.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#e16a5b] text-white px-5 py-2 rounded text-center"
                  >
                    Shop
                  </a>
                  <Link
                    to="/programs/small-business-skills/photoscan"
                    className="bg-[#e16a5b] text-white py-3 rounded text-center"
                  >
                    Scan Photos
                  </Link>
                  <Link
                    to="/one-portal/login"
                    className="bg-[#e16a5b] text-white py-3 rounded text-center"
                  >
                    Login
                  </Link>
                  {/* <Link
                    to="/one-portal/signup"
                    className="bg-[#e16a5b] text-white py-3 rounded text-center"
                  >
                    Sign Up
                  </Link> */}
                </div>
              </div>
            </div>
          )}

          {/* 🔸 DESKTOP NAV */}
          {/* <div className="hidden lg:flex justify-between items-center"> */}
          <div className="hidden lg:flex items-center w-full">
            {/* Menu */}
            {/* <ul className="flex gap-8 text-lg font-medium"> */}
            <ul className="flex gap-8 text-lg font-medium max-w-[800px]">
              {/* About */}
              <li className="relative group">
                <button>About ▾</button>
                <div className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/about/mission"
                  >
                    Mission & Vision
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/about/team"
                  >
                    Team
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/about/accomplishments"
                  >
                    Accomplishments
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/about/contact"
                  >
                    Contact
                  </Link>
                </div>
              </li>
              {/* Programs */}
              <li className="relative group">
                <button>Programs ▾</button>
                <div className="absolute left-0 top-full pt-2 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/programs/skills-development"
                  >
                    Skills Development
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/programs/vocational-skills-weekday-program"
                  >
                    Vocational Skills Weekday Program
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/programs/small-business-skills"
                  >
                    Small Business
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/programs/employment-services"
                  >
                    Employment
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/programs/academic-and-vocational-counseling"
                  >
                    Academic & Vocational Counseling
                  </Link>
                </div>
              </li>
              {/* Person Centered Approach */}
              <li className="relative group">
                <button>Person Centered Approach ▾</button>
                <div className="absolute left-0 top-full pt-2 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/person-centered-approach/thinking"
                  >
                    Person Centered Thinking
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/person-centered-approach/services"
                  >
                    Person Centered Services
                  </Link>
                </div>
              </li>
              {/* Community */}
              <li className="relative group">
                <button>Community ▾</button>
                <div className="absolute left-0 top-full pt-2 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/skills/partners"
                  >
                    Partners
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/community/supporters"
                  >
                    Supporters
                  </Link>
                </div>
              </li>

              {/* News & Events */}
              <li className="relative group">
                <button>News & Events ▾</button>
                <div className="absolute left-0 top-full pt-2 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/news-and-events/events-and-news-updates"
                  >
                    Events & News Updates
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/calendar/events"
                  >
                    Calendar
                  </Link>
                  <Link
                    className="block px-5 py-3 hover:bg-gray-100"
                    to="/news-and-events/newsletters"
                  >
                    Newsletters
                  </Link>
                </div>
              </li>
            </ul>

            <div className="flex-grow"></div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* <Link
                to="/one-portal/login"
                className="bg-[#e16a5b] text-white px-5 py-2 rounded"
              >
                Donate
              </Link> */}
              <a
                href="https://shop-inclusiveworld.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#e16a5b] text-white px-5 py-2 rounded text-center"
              >
                Shop
              </a>
              <Link
                to="/programs/small-business-skills/photoscan"
                className="bg-[#e16a5b] text-white px-5 py-2 rounded"
              >
                Scan Photos
              </Link>
              <Link
                to="/one-portal/login"
                className="bg-[#e16a5b] text-white px-5 py-2 rounded"
              >
                Login
              </Link>
              {/* <Link
                to="/one-portal/signup"
                className="bg-[#e16a5b] text-white px-5 py-2 rounded"
              >
                Sign Up
              </Link> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// {/* Get Involved
// <li className="relative group">
//   <button>Person Centered Approach ▾</button>
//   <div className="absolute left-0 top-full pt-2 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible">
//     {/* <Link
//       className="block px-5 py-3 hover:bg-gray-100"
//       to="/get-involved/volunteer"
//     >
//       Volunteer
//     </Link> */}
//     <Link
//       className="block px-5 py-3 hover:bg-gray-100"
//       to="/get-involved/donate"
//     >
//       Person Centered Services
//     </Link>
//   </div>
// </li> */}
