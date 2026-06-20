import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { LuInfo } from "react-icons/lu";

const VolunteerDashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    currentPrograms: 0,
    completedPrograms: 0,
    attendanceRate: 0,
    assignedMembers: 0,
  });

  const role = user?.role;

  useEffect(() => {
    if (role && user?.id) {
      fetchNotifications();
      fetchStats();
    }
  }, [role, user]);

  const fetchNotifications = async () => {
    const nowPT = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      }),
    );

    // const { data, error } = await supabase
    //   .from("notifications")
    //   .select("*")
    //   .in("role_target", ["all", role])
    //   .order("created_at", { ascending: false });
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(
        `role_target.eq.all,role_target.eq.${role},person_id.eq.${user.person_id}`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    // const filtered = data.filter((n) => {
    //   const expiry = new Date(`${n.expires_at}`);
    //   return nowPT < expiry;
    // });
    const filtered = (data || []).filter((n) => {
      if (!n.expires_at) return true;

      const expiry = new Date(n.expires_at);
      return nowPT < expiry;
    });

    setNotifications(filtered);
  };

  const fetchStats = async () => {
    try {
      // Current Programs
      const { count: currentPrograms } = await supabase
        .from("person_programs")
        .select("*", { count: "exact", head: true })
        // .eq("person_id", user.id)
        .eq("person_id", user.person_id)
        .eq("status", "current");

      // Completed Programs
      const { count: completedPrograms } = await supabase
        .from("person_programs")
        .select("*", { count: "exact", head: true })
        // .eq("person_id", user.id)
        .eq("person_id", user.person_id)
        .eq("status", "completed");

      // Assigned Members
      const { count: assignedMembers } = await supabase
        // .from("program_member_support")
        // .select("*", { count: "exact", head: true })
        // .eq("buddy_id", user.id);
        .from("program_member_buddies")
        .select("*", { count: "exact", head: true })
        .eq("buddy_id", user.person_id);

      // Attendance
      // Attendance
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance")
        .select("attendance_status")
        .eq("student_id", user.person_id);

      if (attendanceError) {
        console.error("Error loading attendance:", attendanceError);
      }

      const present =
        attendance?.filter(
          (a) => a.attendance_status?.toLowerCase() === "present",
        ).length || 0;

      const absent =
        attendance?.filter(
          (a) => a.attendance_status?.toLowerCase() === "absent",
        ).length || 0;

      const attendanceRate =
        present + absent === 0
          ? 0
          : Math.round((present / (present + absent)) * 100);

      setStats({
        currentPrograms: currentPrograms || 0,
        completedPrograms: completedPrograms || 0,
        assignedMembers: assignedMembers || 0,
        attendanceRate,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6">My Dashboard</h1>

      {/* NOTIFICATIONS */}
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <div className="space-y-4 mb-10">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications available</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-[#0f5b54] text-white p-4 rounded-lg shadow flex gap-3 items-start"
            >
              <LuInfo className="text-xl mt-1 shrink-0" />

              <div>
                <p className="font-semibold mb-1">{n.title}</p>
                <p className="text-sm text-white/90">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* METRICS */}
      <h2 className="text-xl font-semibold mb-4">My Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 mb-2">Current Assigned Programs</p>
          <p className="text-3xl font-bold">{stats.currentPrograms}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 mb-2">Past Programs</p>
          <p className="text-3xl font-bold">{stats.completedPrograms}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 mb-2">Attendance Rate</p>
          <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 mb-2">Assigned Members</p>
          <p className="text-3xl font-bold">{stats.assignedMembers}</p>
        </div>
      </div>
    </>
  );
};

export default VolunteerDashboard;
