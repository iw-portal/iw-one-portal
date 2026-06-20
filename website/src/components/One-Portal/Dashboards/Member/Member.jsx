import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { LuInfo } from "react-icons/lu";

const MetricCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 text-sm mb-2">{title}</p>

    <p className="text-3xl font-bold text-[#0f5b54]">{value}</p>
  </div>
);

const MemberDashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [metrics, setMetrics] = useState({
    currentlyAssignedPrograms: 0,
    completedPrograms: 0,
    totalAssignedPrograms: 0,
    totalTransactions: 0,
    totalPaid: 0,
    activeNotifications: 0,
    profileComplete: 0,
  });

  const role = user?.role;

  useEffect(() => {
    if (role) {
      fetchNotifications();
    }

    if (user?.person_id) {
      fetchMetrics();
    }
  }, [role, user?.person_id]);

  const fetchNotifications = async () => {
    const nowPT = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      }),
    );

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(
        `role_target.eq.all,role_target.eq.${role},person_id.eq.${user.person_id}`,
      )
      .order("created_at", { ascending: false });

    console.log(role);

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
    setMetrics((prev) => ({
      ...prev,
      activeNotifications: filtered.length,
    }));
  };

  const fetchMetrics = async () => {
    try {
      const [enrollmentsRes, ordersRes, profileRes] = await Promise.all([
        // supabase
        //   .from("enrollments")
        //   .select("*")
        //   .eq("student_id", user.person_id),
        supabase
          .from("person_programs")
          .select("*")
          .eq("person_id", user.person_id)
          .eq("role", "member"),

        supabase
          .from("enrollment_orders")
          .select("*")
          .eq("person_id", user.person_id)
          .eq("payment_status", "paid"),

        supabase
          .from("member_enrollment_profiles")
          .select("*")
          .eq("person_id", user.person_id)
          .maybeSingle(),
      ]);

      const enrollments = enrollmentsRes.data || [];
      const orders = ordersRes.data || [];
      const profile = profileRes.data;

      // const currentPrograms = enrollments.filter(
      //   (e) => e.enrollment_status === "active",
      // ).length;

      // const completedPrograms = enrollments.filter(
      //   (e) => e.enrollment_status === "completed",
      // ).length;
      const currentlyAssignedPrograms = enrollments.filter(
        (e) => e.status === "current",
      ).length;

      const completedPrograms = enrollments.filter(
        (e) => e.status === "completed",
      ).length;

      const totalAssignedPrograms = enrollments.filter(
        (e) => e.status === "current" || e.status === "completed",
      ).length;

      const totalTransactions = orders.length;

      const totalPaid = orders.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0,
      );

      let profileComplete = 0;

      if (profile) {
        const fields = Object.values(profile).filter(
          (v) =>
            v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
        );

        profileComplete = Math.round(
          (fields.length / Object.keys(profile).length) * 100,
        );
      }

      setMetrics({
        currentlyAssignedPrograms,
        completedPrograms,
        totalAssignedPrograms,
        totalTransactions,
        totalPaid,
        activeNotifications: notifications.length,
        profileComplete,
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Currently Assigned Programs"
          value={metrics.currentlyAssignedPrograms}
        />

        <MetricCard
          title="Completed Programs"
          value={metrics.completedPrograms}
        />

        <MetricCard
          title="Total Assigned Programs"
          value={metrics.totalAssignedPrograms}
        />

        <MetricCard title="Transactions" value={metrics.totalTransactions} />

        <MetricCard
          title="Amount Paid"
          value={`$${metrics.totalPaid.toFixed(2)}`}
        />

        <MetricCard
          title="Profile Completion"
          value={`${metrics.profileComplete}%`}
        />

        <MetricCard title="Notifications" value={metrics.activeNotifications} />

        <MetricCard
          title="Member Since"
          value={
            user?.created_at ? new Date(user.created_at).getFullYear() : "-"
          }
        />
      </div>
    </>
  );
};

export default MemberDashboard;
