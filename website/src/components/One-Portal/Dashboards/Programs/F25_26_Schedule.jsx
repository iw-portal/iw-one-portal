import schedule from "/f25_26_schedule.png";
import VolunteerSidebar from "../Sidebars/Volunteer";

const Schedule = ({ user, setUser }) => {
  return (
    <div className="md:flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <VolunteerSidebar setUser={setUser} />

      {/* MAIN */}
      <div className="flex-1 flex justify-center md:block p-4 md:p-10">
        <div className="w-full md:max-w-6xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6">
          <img
            src={schedule}
            alt="Academic Year 2025 - 2026 Class Schedule"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
