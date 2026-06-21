import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  FaLaptopCode,
  FaDesktop,
  FaTabletAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import ScrollToTop from "./components/Common/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Common/Home";
import "flowbite/dist/flowbite.js";
import Login from "./components/One-Portal/Users/Login";
import Signup from "./components/One-Portal/Users/Signup";
import OurMission from "./components/About/OurMission";
import Team from "./components/About/Team";
import VolunteerApplication from "./components/Applications/VolunteerApplication";
import Accomplishments from "./components/About/Accomplishments";
import Contact from "./components/About/Contact";
import Skills from "./components/Programs/Skills/Skills";
import VocationalSkills from "./components/Programs/VocationalSkills";
import SkillsDevPartners from "./components/Community/SkillsDevPartners";
import Schedule from "./components/Programs/Skills/F25_26_Schedule";
import Calendar from "./components/News-and-Events/Calendar";
import PublicLayout from "./components/Applications/PublicLayout";
import SmallBusiness from "./components/Programs/SmallBusiness";
import PhotoScanPage from "./components/Get-Involved/PhotoScans";
import EmploymentServices from "./components/Programs/EmploymentServices";
import EmploymentPartners from "./sections/Employment/Partners";
import AcademicVocationalCounseling from "./components/Programs/AcademicVocationalCounseling";
import PersonCenteredThinking from "./components/Person-Centered-Approach/PersonCenteredThinking";
import PersonCenteredServices from "./components/Person-Centered-Approach/PersonCenteredServices";
import Supporters from "./components/Community/Supporters";
import News from "./components/News-and-Events/Events-and-News-Updates/News";
import NewsDetail from "./components/News-and-Events/Events-and-News-Updates/NewsDetail";
import Newsletters from "./components/News-and-Events/Newsletters";
import VolunteerDashboard from "./components/One-Portal/Dashboards/Volunteer/Volunteer";
import VolunteerProfile from "./components/One-Portal/Dashboards/Volunteer/Profile";
import SkillsDevCatalog from "./components/One-Portal/Dashboards/Programs/SkillsDevCatalog";
import ClassesSchedule from "./components/One-Portal/Dashboards/Volunteer/ClassesSchedule";
import AdminLayout from "./components/One-Portal/Dashboards/Admin/AdminLayout";
import VolunteerLayout from "./components/One-Portal/Dashboards/Volunteer/VolunteerLayout";
import Dashboard from "./components/One-Portal/Dashboards/Admin/Admin";
import Members from "./components/One-Portal/Dashboards/Admin/Members";
import SendNotification from "./components/One-Portal/Dashboards/Admin/SendNotification";
import Programs from "./components/One-Portal/Dashboards/Admin/Programs";
import AdminAttendance from "./components/One-Portal/Dashboards/Admin/Attendance";
import AdminApplications from "./components/One-Portal/Dashboards/Admin/Applications";
import AdminRegistrations from "./components/One-Portal/Dashboards/Admin/Registration";
import MemberApplication from "./components/Applications/MemberApplication";
import Volunteers from "./components/One-Portal/Dashboards/Admin/Volunteers";
import AdminProfile from "./components/One-Portal/Dashboards/Admin/Profile";
import Settings from "./components/One-Portal/Dashboards/Admin/Settings";
import Fees from "./components/One-Portal/Dashboards/Admin/AdminFees";
import AdminFees from "./components/One-Portal/Dashboards/Admin/AdminFees";
import Timesheet from "./components/One-Portal/Dashboards/Volunteer/Timesheets";
import ForgotPassword from "./components/One-Portal/Users/ForgotPassword";
import ForgotUsername from "./components/One-Portal/Users/ForgotUsername";
import AdminPostsManager from "./components/One-Portal/Dashboards/Admin/AdminPostsManager";
import MemberLayout from "./components/One-Portal/Dashboards/Member/MemberLayout";
import MemberDashboard from "./components/One-Portal/Dashboards/Member/Member";
import MemberProfile from "./components/One-Portal/Dashboards/Member/Profile/MemberProfile";
import MemberEnrollmentDashboard from "./components/One-Portal/Dashboards/Member/Enrollments/EnrollmentDashboard";
import MemberClasses from "./components/One-Portal/Dashboards/Member/ClassesSchedule";
import EnrollmentTransactions from "./components/One-Portal/Dashboards/Member/Enrollments/EnrollmentTransactions";
import MemberAttendance from "./components/One-Portal/Dashboards/Member/Attendance";
import ProgramLeadLayout from "./components/One-Portal/Dashboards/ProgramLead/ProgramLeadLayout";
import LeadDashboard from "./components/One-Portal/Dashboards/ProgramLead/ProgramLead";
import LeadProfile from "./components/One-Portal/Dashboards/ProgramLead/Profile";
// import LeadRegistration from "./components/One-Portal/Dashboards/ProgramLead/Registration";
import LeadPrograms from "./components/One-Portal/Dashboards/ProgramLead/Programs";
// import LeadStudents from "./components/One-Portal/Dashboards/ProgramLead/Students";
import LeadAttendance from "./components/One-Portal/Dashboards/ProgramLead/Attendance";
// import LeadCommunication from "./components/One-Portal/Dashboards/ProgramLead/Communication";
// import LeadReports from "./components/One-Portal/Dashboards/ProgramLead/Reports";
import VolunteerInterestForm from "./components/One-Portal/Dashboards/Volunteer/InterestForm";
import UserManagement from "./components/One-Portal/Dashboards/Admin/UserManagement";
import ReportBugButton from "./components/Common/ReportBugButton";
import AdminBugReports from "./components/One-Portal/Dashboards/Admin/AdminBugReports";
import { User } from "lucide-react";
import TimesheetApprovals from "./components/One-Portal/Dashboards/ProgramLead/TimesheetApprovals";
import PeopleManagement from "./components/One-Portal/Dashboards/Admin/PeopleManagement";
import PCSLayout from "./components/One-Portal/Dashboards/PCS/PCSLayout";
import PCSDashboard from "./components/One-Portal/Dashboards/PCS/PCSDashboard";
import OPDDashboard from "./components/One-Portal/Dashboards/PCS/OPDDashboard";
import OPDPage from "./components/One-Portal/Dashboards/PCS/OPDPage";
import OPDReviewPage from "./components/One-Portal/Dashboards/PCS/OPDReviewPage";
import OPDDirectory from "./components/One-Portal/Dashboards/PCS/OPDDirectory";

const USER_STORAGE_KEY = "iw_user";
const CHECKOUT_USER_STORAGE_KEY = "iw_checkout_user";

function readStoredUser() {
  const storedUser =
    localStorage.getItem(USER_STORAGE_KEY) ||
    sessionStorage.getItem(CHECKOUT_USER_STORAGE_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Could not restore stored user", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(CHECKOUT_USER_STORAGE_KEY);
    return null;
  }
}

// function DeviceBlocker() {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-teal-50/40 to-cyan-50 flex items-center justify-center px-6 py-10">
//       <div className="absolute inset-0 opacity-70">
//         <div className="absolute -left-32 top-1/2 h-80 w-[120%] -rotate-12 bg-teal-100/40 blur-3xl" />
//         <div className="absolute right-[-120px] top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
//         <div className="absolute left-[-120px] bottom-16 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
//       </div>

//       <div className="relative max-w-xl w-full rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-teal-100 overflow-hidden text-center">
//         <div className="px-8 pt-10 pb-6 border-b border-slate-100">
//           <img
//             src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1782008560/iw-logo-final_urkutm.png"
//             alt="Inclusive World"
//             className="mx-auto h-24 w-auto object-contain mb-4"
//           />

//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border border-teal-100 shadow-sm">
//             <FaLaptopCode className="text-4xl text-teal-700" />
//           </div>
//         </div>

//         <div className="px-8 py-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 leading-tight mb-4">
//             Laptop or Desktop Required
//           </h1>

//           <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-teal-700" />

//           <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto mb-8">
//             The Inclusive World Portal is optimized for larger screens. Please
//             access the portal from a laptop or desktop computer for the best
//             experience.
//           </p>

//           <div className="grid grid-cols-3 gap-0 border-y border-slate-100 py-6 mb-6">
//             <div className="flex flex-col items-center gap-2">
//               <FaLaptopCode className="text-4xl text-teal-700" />
//               <span className="text-sm font-semibold text-slate-800">
//                 Laptop
//               </span>
//             </div>

//             <div className="flex flex-col items-center gap-2 border-x border-slate-100">
//               <FaDesktop className="text-4xl text-teal-700" />
//               <span className="text-sm font-semibold text-slate-800">
//                 Desktop
//               </span>
//             </div>

//             <div className="flex flex-col items-center gap-2 opacity-45">
//               <FaTabletAlt className="text-4xl text-slate-500" />
//               <span className="text-sm font-semibold text-slate-500">
//                 Tablet
//               </span>
//             </div>
//           </div>

//           <div className="rounded-2xl bg-teal-50 border border-teal-100 px-5 py-4 flex items-center gap-4 text-left">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
//               <FaShieldAlt className="text-xl" />
//             </div>

//             <div>
//               <p className="text-sm font-bold text-teal-800">
//                 Your experience. Our priority.
//               </p>
//               <p className="text-sm text-slate-600">
//                 Thank you for helping us create the best experience for
//                 everyone.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
function DeviceBlocker() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-white via-teal-50/40 to-cyan-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -left-32 top-1/2 h-64 sm:h-80 w-[120%] -rotate-12 bg-teal-100/40 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute left-[-120px] bottom-12 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-cyan-100/60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-xl rounded-2xl sm:rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-xl sm:shadow-2xl border border-teal-100 overflow-hidden text-center">
        <div className="px-5 sm:px-8 pt-6 sm:pt-10 pb-5 sm:pb-6 border-b border-slate-100">
          <img
            src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1782008560/iw-logo-final_urkutm.png"
            alt="Inclusive World"
            className="mx-auto h-16 sm:h-20 md:h-24 w-auto object-contain mb-4 sm:mb-5"
          />

          <div className="mx-auto flex h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 items-center justify-center rounded-full bg-teal-50 border border-teal-100 shadow-sm">
            <FaLaptopCode className="text-3xl sm:text-4xl text-teal-700" />
          </div>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-950 leading-tight mb-3 sm:mb-4">
            Laptop or Desktop Required
          </h1>

          <div className="mx-auto mb-4 sm:mb-6 h-1 w-9 sm:w-10 rounded-full bg-teal-700" />

          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mb-6 sm:mb-8">
            The Inclusive World Portal is optimized for larger screens. Please
            access the portal from a laptop or desktop computer for the best
            experience.
          </p>

          <div className="grid grid-cols-3 border-y border-slate-100 py-4 sm:py-6 mb-5 sm:mb-6">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <FaLaptopCode className="text-2xl sm:text-3xl md:text-4xl text-teal-700" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Laptop
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:gap-2 border-x border-slate-100">
              <FaDesktop className="text-2xl sm:text-3xl md:text-4xl text-teal-700" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Desktop
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:gap-2 opacity-45">
              <FaTabletAlt className="text-2xl sm:text-3xl md:text-4xl text-slate-500" />
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Tablet
              </span>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-teal-50 border border-teal-100 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 text-left">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <FaShieldAlt className="text-lg sm:text-xl" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-teal-800">
                Your experience. Our priority.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                Thank you for helping us create the best experience for
                everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  const [user, setUser] = useState(readStoredUser);
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 1024);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(CHECKOUT_USER_STORAGE_KEY);
    }
  }, [user]);

  // if (isSmallDevice) {
  //   return <DeviceBlocker />;
  // }

  const isOnePortalRoute = window.location.pathname.startsWith("/one-portal");

  if (isSmallDevice && isOnePortalRoute) {
    return <DeviceBlocker />;
  }

  return (
    <Router>
      <div className="overflow-x-hidden bg-violet-200 text-neutral-900 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen">
        <div className="fixed inset-0 -z-10 bg-white/50 backdrop-blur-lg"></div>

        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/one-portal/login"
            element={<Login setUser={setUser} />}
          />
          <Route path="/one-portal/signup" element={<Signup />} />
          <Route path="/about/mission" element={<OurMission />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/about/accomplishments" element={<Accomplishments />} />
          <Route element={<PublicLayout />}>
            <Route path="/apply/volunteer" element={<VolunteerApplication />} />
            <Route path="/apply/member" element={<MemberApplication />} />
          </Route>
          <Route
            path="/about/contact"
            element={
              <div className="bg-white min-h-screen">
                <Contact />
              </div>
            }
          />
          <Route path="/programs/skills-development" element={<Skills />} />
          <Route path="/skills/partners" element={<SkillsDevPartners />} />
          <Route path="/skills/ay25_26_calendar" element={<Schedule />} />
          <Route path="/calendar/events" element={<Calendar />} />
          <Route
            path="/programs/vocational-skills-weekday-program"
            element={<VocationalSkills />}
          />
          <Route
            path="/programs/small-business-skills"
            element={<SmallBusiness />}
          />
          <Route
            path="/programs/small-business-skills/photoscan"
            element={<PhotoScanPage />}
          />
          <Route
            path="/programs/employment-services"
            element={<EmploymentServices />}
          />
          <Route
            path="/programs/employment-services/esp_partners"
            element={<EmploymentPartners />}
          />
          <Route
            path="/programs/academic-and-vocational-counseling"
            element={<AcademicVocationalCounseling />}
          />
          <Route
            path="/person-centered-approach/thinking"
            element={<PersonCenteredThinking />}
          />
          <Route
            path="/person-centered-approach/services"
            element={<PersonCenteredServices />}
          />
          <Route path="/community/supporters" element={<Supporters />} />
          <Route
            path="/news-and-events/events-and-news-updates"
            element={<News />}
          />
          <Route
            path="/news-and-events/events-and-news-updates/:slug"
            element={<NewsDetail />}
          />
          <Route
            path="/news-and-events/newsletters"
            element={<Newsletters />}
          />
          <Route
            path="/one-portal/volunteer"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <VolunteerDashboard user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/one-portal/forgot-username"
            element={<ForgotUsername />}
          />
          <Route
            path="/one-portal/volunteer/profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <VolunteerProfile user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/volunteer/f25_26_schedule"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <ClassesSchedule user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/volunteer/timesheet"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <Timesheet user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/one-portal/volunteer/interest-form"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <VolunteerInterestForm user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/one-portal/volunteer/profile"
            element={<VolunteerProfile user={user} setUser={setUser} />}
          /> */}
          {/* <Route
            path="/one-portal/volunteer/programs"
            element={<SkillsDevCatalog user={user} setUser={setUser} />}
          /> */}
          {/* <Route
            path="/one-portal/volunteer/programs/f25_26_schedule"
            element={<F25_26 user={user} setUser={setUser} />}
          /> */}
          <Route
            path="/one-portal/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/one-portal/admin/users"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/one-portal/admin/bugs"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminBugReports />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/people"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <PeopleManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/news-management"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminPostsManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/one-portal/admin/volunteers"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <Volunteers />
                </AdminLayout>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/one-portal/admin/profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminProfile user={user} setUser={setUser} />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/notifications"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <SendNotification />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/programs"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <Programs />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/attendance"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminAttendance />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/registration"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminRegistrations />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/applications"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <AdminApplications />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* MEMBER */}
          <Route
            path="/one-portal/member"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <MemberDashboard user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <MemberProfile user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/one-portal/member/enrollment"
            element={
              <MemberLayout setUser={setUser}>
                <MemberProfile user={user} />
              </MemberLayout>
            }
          /> */}
          <Route
            path="/one-portal/member/enrollment"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <MemberEnrollmentDashboard user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/classes"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <MemberClasses user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/transactions"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <EnrollmentTransactions user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/attendance"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <MemberAttendance user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          {/* PROGRAM LEAD */}
          <Route
            path="/one-portal/program-lead"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <LeadDashboard user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/program-lead/profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <LeadProfile user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/program-lead/programs"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <LeadPrograms user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/program-lead/attendance"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <LeadAttendance user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/one-portal/program-lead/timesheet-approval"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <TimesheetApprovals user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />
          {/* 
          <Route
            path="/one-portal/program-lead/registration"
            element={
              <ProgramLeadLayout setUser={setUser}>
                <LeadRegistration user={user} />
              </ProgramLeadLayout>
            }
          />



          <Route
            path="/one-portal/program-lead/students"
            element={
              <ProgramLeadLayout setUser={setUser}>
                <LeadStudents user={user} />
              </ProgramLeadLayout>
            }
          />


          <Route
            path="/one-portal/program-lead/communication"
            element={
              <ProgramLeadLayout setUser={setUser}>
                <LeadCommunication user={user} />
              </ProgramLeadLayout>
            }
          />

          <Route
            path="/one-portal/program-lead/reports"
            element={
              <ProgramLeadLayout setUser={setUser}>
                <LeadReports user={user} />
              </ProgramLeadLayout>
            }
          /> */}

          <Route
            path="/one-portal/pcs"
            element={
              <ProtectedRoute user={user} allowedRoles={["pcs"]}>
                <PCSLayout setUser={setUser}>
                  <PCSDashboard user={user} />
                </PCSLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/pcs/opd"
            element={
              <ProtectedRoute user={user} allowedRoles={["pcs"]}>
                <PCSLayout setUser={setUser}>
                  <OPDDashboard />
                </PCSLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/pcs/opd/:token"
            element={
              <ProtectedRoute user={user} allowedRoles={["pcs"]}>
                <PCSLayout setUser={setUser}>
                  <OPDPage user={user} />
                </PCSLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/opd-review"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <OPDReviewPage user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/volunteer/opd-review"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <OPDReviewPage user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/program-lead/opds"
            element={
              <ProtectedRoute user={user} allowedRoles={["lead"]}>
                <ProgramLeadLayout setUser={setUser}>
                  <OPDDirectory user={user} />
                </ProgramLeadLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/admin/opds"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout setUser={setUser}>
                  <OPDDirectory user={user} />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/member/opds"
            element={
              <ProtectedRoute user={user} allowedRoles={["member"]}>
                <MemberLayout setUser={setUser}>
                  <OPDDirectory user={user} />
                </MemberLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/one-portal/volunteer/opds"
            element={
              <ProtectedRoute user={user} allowedRoles={["volunteer"]}>
                <VolunteerLayout setUser={setUser}>
                  <OPDDirectory user={user} />
                </VolunteerLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        {user && <ReportBugButton user={user} />}
      </div>
    </Router>
  );
};

export default App;
