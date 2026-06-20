// import { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabase";
// import { LuInfo } from "react-icons/lu";

// const MetricCard = ({ title, value }) => (
//   <div className="bg-white rounded-xl shadow p-6">
//     <p className="text-gray-500 text-sm mb-2">{title}</p>

//     <p className="text-3xl font-bold text-[#0f5b54]">{value}</p>
//   </div>
// );

// const ProgramLeadDashboard = ({ user }) => {
//   const [notifications, setNotifications] = useState([]);

//   const [metrics, setMetrics] = useState({
//     currentPrograms: 0,
//     completedPrograms: 0,
//     totalStudents: 0,
//     totalVolunteers: 0,
//     attendanceAverage: 0,
//     pendingBuddyAssignments: 0,
//     activeNotifications: 0,
//   });

//   const role = user?.role;

//   useEffect(() => {
//     if (role) {
//       fetchNotifications();
//     }

//     if (user?.person_id) {
//       fetchMetrics();
//     }
//   }, [role, user?.person_id]);

//   const fetchNotifications = async () => {
//     const nowPT = new Date(
//       new Date().toLocaleString("en-US", {
//         timeZone: "America/Los_Angeles",
//       }),
//     );

//     const { data, error } = await supabase
//       .from("notifications")
//       .select("*")
//       .in("role_target", ["all", role])
//       .order("created_at", {
//         ascending: false,
//       });

//     if (error) {
//       console.error(error);
//       return;
//     }

//     const filtered = (data || []).filter((n) => {
//       const expiry = new Date(`${n.expires_at}`);

//       return nowPT < expiry;
//     });

//     setNotifications(filtered);

//     setMetrics((prev) => ({
//       ...prev,
//       activeNotifications: filtered.length,
//     }));
//   };

//   const fetchMetrics = async () => {
//     try {
//       /*
//         TODO:
//         Replace these queries once lead-program
//         assignment tables are finalized.

//         For now this follows the same pattern
//         as Member Dashboard.
//       */

//       const currentPrograms = 2;
//       const completedPrograms = 1;
//       const totalStudents = 18;
//       const totalVolunteers = 5;
//       const attendanceAverage = 94;
//       const pendingBuddyAssignments = 3;

//       setMetrics((prev) => ({
//         ...prev,
//         currentPrograms,
//         completedPrograms,
//         totalStudents,
//         totalVolunteers,
//         attendanceAverage,
//         pendingBuddyAssignments,
//       }));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <h1 className="text-3xl font-semibold mb-6">My Dashboard</h1>

//       {/* Notifications */}

//       <h2 className="text-xl font-semibold mb-4">Notifications</h2>

//       <div className="space-y-4 mb-10">
//         {notifications.length === 0 ? (
//           <p className="text-gray-500 text-sm">No notifications available</p>
//         ) : (
//           notifications.map((n) => (
//             <div
//               key={n.id}
//               className="bg-[#0f5b54] text-white p-4 rounded-lg shadow flex gap-3 items-start"
//             >
//               <LuInfo className="text-xl mt-1 shrink-0" />

//               <div>
//                 <p className="font-semibold mb-1">{n.title}</p>

//                 <p className="text-sm text-white/90">{n.message}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Metrics */}

//       <h2 className="text-xl font-semibold mb-4">Program Statistics</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <MetricCard title="Current Programs" value={metrics.currentPrograms} />

//         <MetricCard
//           title="Completed Programs"
//           value={metrics.completedPrograms}
//         />

//         <MetricCard title="Students" value={metrics.totalStudents} />

//         <MetricCard title="Volunteers" value={metrics.totalVolunteers} />

//         <MetricCard
//           title="Attendance Avg"
//           value={`${metrics.attendanceAverage}%`}
//         />

//         <MetricCard
//           title="Buddy Assignments"
//           value={metrics.pendingBuddyAssignments}
//         />

//         <MetricCard title="Notifications" value={metrics.activeNotifications} />

//         <MetricCard
//           title="Lead Since"
//           value={
//             user?.created_at ? new Date(user.created_at).getFullYear() : "-"
//           }
//         />
//       </div>
//     </>
//   );
// };

// export default ProgramLeadDashboard;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../../lib/supabase";
import { LuInfo, LuBookOpen, LuCalendarCheck, LuUser } from "react-icons/lu";

const MetricCard = ({ title, value, helper }) => (
  <div className="bg-white rounded-3xl border p-6 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-4xl font-bold text-[#0f5b54] mt-3">{value}</h2>
    {helper && <p className="text-xs text-gray-400 mt-2">{helper}</p>}
  </div>
);

const QuickLink = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="bg-white rounded-3xl border p-5 shadow-sm hover:shadow-md transition flex gap-4 items-start"
  >
    <div className="w-11 h-11 rounded-2xl bg-[#0f5b54]/10 text-[#0f5b54] flex items-center justify-center text-xl">
      {icon}
    </div>

    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </Link>
);

const ProgramLeadDashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    currentPrograms: 0,
    completedPrograms: 0,
    totalStudents: 0,
    totalVolunteers: 0,
    attendanceAverage: 0,
    pendingBuddyAssignments: 0,
    activeNotifications: 0,
  });

  const role = user?.role;
  const personId = user?.person_id;

  useEffect(() => {
    if (!role && !personId) return;

    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchMetrics()]);
      setLoading(false);
    };

    loadDashboard();
  }, [role, personId]);

  const fetchNotifications = async () => {
    if (!role) return;

    const nowPT = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      }),
    );

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .in("role_target", ["all", role])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    const active = (data || []).filter((n) => {
      if (!n.expires_at) return true;
      return nowPT < new Date(n.expires_at);
    });

    setNotifications(active);

    setMetrics((prev) => ({
      ...prev,
      activeNotifications: active.length,
    }));
  };

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const fetchMetrics = async () => {
    if (!personId) return;

    try {
      const { data: leadPrograms, error: programError } = await supabase
        .from("programs")
        .select("id, is_active, is_archived")
        .or(`lead_id.eq.${personId},co_lead_id.eq.${personId}`);

      if (programError) throw programError;

      const programs = (leadPrograms || []).filter((p) => !p.is_archived);
      const programIds = programs.map((p) => p.id);

      if (programIds.length === 0) {
        setMetrics((prev) => ({
          ...prev,
          currentPrograms: 0,
          completedPrograms: 0,
          totalStudents: 0,
          totalVolunteers: 0,
          attendanceAverage: 0,
          pendingBuddyAssignments: 0,
        }));
        return;
      }

      const currentPrograms = programs.filter((p) => p.is_active).length;
      const completedPrograms = programs.filter((p) => !p.is_active).length;

      const { data: rosterRows, error: rosterError } = await supabase
        .from("person_programs")
        .select("person_id, program_id, role, status")
        .in("program_id", programIds);

      if (rosterError) throw rosterError;

      const activeRosterRows = (rosterRows || []).filter((row) => {
        const role = normalize(row.role);
        const status = normalize(row.status);

        return (
          status === "current" && (role === "member" || role === "volunteer")
        );
      });

      const memberRows = activeRosterRows.filter(
        (row) => normalize(row.role) === "member",
      );

      const volunteerRows = activeRosterRows.filter(
        (row) => normalize(row.role) === "volunteer",
      );

      const uniqueMembers = new Set(memberRows.map((row) => row.person_id));
      const uniqueVolunteers = new Set(
        volunteerRows.map((row) => row.person_id),
      );

      const totalStudents = uniqueMembers.size;
      const totalVolunteers = uniqueVolunteers.size;

      const { data: enrollmentRows, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id, student_id, program_id")
        .in("program_id", programIds);

      if (enrollmentError) throw enrollmentError;

      const enrollmentByMemberProgram = new Map(
        (enrollmentRows || []).map((row) => [
          `${row.student_id}-${row.program_id}`,
          row,
        ]),
      );

      const memberEnrollmentIds = memberRows
        .map((member) => {
          const enrollment = enrollmentByMemberProgram.get(
            `${member.person_id}-${member.program_id}`,
          );

          return enrollment?.id;
        })
        .filter(Boolean);

      let assignedBuddyEnrollmentIds = new Set();

      if (memberEnrollmentIds.length > 0) {
        const { data: buddyRows, error: buddyError } = await supabase
          .from("program_member_buddies")
          .select("enrollment_id")
          .in("enrollment_id", memberEnrollmentIds);

        if (buddyError) throw buddyError;

        assignedBuddyEnrollmentIds = new Set(
          (buddyRows || []).map((row) => row.enrollment_id),
        );
      }

      const pendingBuddyAssignments = memberRows.filter((member) => {
        const enrollment = enrollmentByMemberProgram.get(
          `${member.person_id}-${member.program_id}`,
        );

        if (!enrollment?.id) return true;

        return !assignedBuddyEnrollmentIds.has(enrollment.id);
      }).length;

      const { data: attendanceRows, error: attendanceError } = await supabase
        .from("attendance")
        .select("attendance_status")
        .in("program_id", programIds);

      if (attendanceError) throw attendanceError;

      const totalAttendance = attendanceRows?.length || 0;
      const presentCount =
        attendanceRows?.filter(
          (row) => normalize(row.attendance_status) === "present",
        ).length || 0;

      const attendanceAverage =
        totalAttendance > 0
          ? Math.round((presentCount / totalAttendance) * 100)
          : 0;

      setMetrics((prev) => ({
        ...prev,
        currentPrograms,
        completedPrograms,
        totalStudents,
        totalVolunteers,
        attendanceAverage,
        pendingBuddyAssignments,
      }));
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
    }
  };

  const greetingName = useMemo(() => {
    return user?.fname || user?.first_name || "Program Lead";
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <p className="text-sm text-gray-500">Welcome back</p>

        <h1 className="text-4xl font-bold text-[#0f5b54] mt-1">
          {greetingName}
        </h1>

        <p className="text-gray-500 mt-2">
          Here is a quick overview of your programs, attendance, students, and
          pending items.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <QuickLink
            to="/one-portal/program-lead/programs"
            icon={<LuBookOpen />}
            title="Programs"
            description="View programs, students, buddy assignments, and notes."
          />

          <QuickLink
            to="/one-portal/program-lead/attendance"
            icon={<LuCalendarCheck />}
            title="Attendance"
            description="Review and update attendance for your programs."
          />

          <QuickLink
            to="/one-portal/program-lead/profile"
            icon={<LuUser />}
            title="Profile"
            description="View and update your profile information."
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Program Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* <MetricCard
            title="Current Programs"
            value={loading ? "..." : metrics.currentPrograms}
          /> */}
          <MetricCard
            title="Current Lead Programs"
            value={loading ? "..." : metrics.currentPrograms}
          />

          {/* <MetricCard
            title="Past Programs"
            value={loading ? "..." : metrics.completedPrograms}
          /> */}
          <MetricCard
            title="Past Lead Programs"
            value={loading ? "..." : metrics.completedPrograms}
          />

          <MetricCard
            title="Students"
            value={loading ? "..." : metrics.totalStudents}
          />

          <MetricCard
            title="Volunteers"
            value={loading ? "..." : metrics.totalVolunteers}
            helper="From assigned program volunteers"
          />

          <MetricCard
            title="Attendance Average"
            value={loading ? "..." : `${metrics.attendanceAverage}%`}
            helper="Present divided by all attendance records"
          />

          <MetricCard
            title="Needs Buddy Assignment"
            value={loading ? "..." : metrics.pendingBuddyAssignments}
          />

          <MetricCard
            title="Active Notifications"
            value={loading ? "..." : metrics.activeNotifications}
          />

          <MetricCard
            title="Lead Since"
            value={
              user?.created_at ? new Date(user.created_at).getFullYear() : "-"
            }
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white border rounded-3xl p-6 text-gray-500">
              No notifications available.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="bg-[#0f5b54] text-white p-5 rounded-3xl shadow-sm flex gap-3 items-start"
              >
                <LuInfo className="text-xl mt-1 shrink-0" />

                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-white/90 mt-1">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProgramLeadDashboard;
