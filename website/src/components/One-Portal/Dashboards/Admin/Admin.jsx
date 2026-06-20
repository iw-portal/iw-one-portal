import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import StatsCard from "./StatsCard";
import NotificationsPanel from "./NotificationPanel";

const Dashboard = () => {
  const [stats, setStats] = useState({
    members: 0,
    volunteers: 0,
    programs: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("active");
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // const fetchStats = async () => {
    //   const { count: members } = await supabase
    //     .from("members")
    //     .select("*", { count: "exact", head: true });

    //   const { count: volunteers } = await supabase
    //     .from("volunteers")
    //     .select("*", { count: "exact", head: true });

    //   const { count: programs } = await supabase
    //     .from("classes")
    //     .select("*", { count: "exact", head: true });

    //   setStats({
    //     members: members || 0,
    //     volunteers: volunteers || 0,
    //     programs: programs || 0,
    //   });
    // };
    const fetchStats = async () => {
      // MEMBERS (from users table)
      const { count: members } = await supabase
        .from("people")
        .select("*", { count: "exact", head: true })
        .eq("role", "member");

      // VOLUNTEERS
      const { count: volunteers } = await supabase
        .from("people")
        .select("*", { count: "exact", head: true })
        .eq("role", "volunteer");

      // PROGRAMS (FIX THIS TABLE NAME IF NEEDED)
      const { count: programs } = await supabase
        .from("programs") // ⚠️ change if your table name is different
        .select("*", { count: "exact", head: true });

      setStats({
        members: members || 0,
        volunteers: volunteers || 0,
        programs: programs || 0,
      });
    };

    // const fetchNotifications = async () => {
    //   const { data } = await supabase
    //     .from("notifications")
    //     .select("*")
    //     .order("created_at", { ascending: false });

    //   setNotifications(data || []);
    // };
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setNotifications(data || []);
    };

    fetchStats();
    fetchNotifications();
  }, []);

  const now = new Date();

  const filteredNotifications = notifications.filter((n) => {
    const expiresAt = n.expires_at ? new Date(n.expires_at) : null;
    const isExpired = expiresAt && expiresAt <= now;

    if (notificationFilter === "active") return !isExpired;
    if (notificationFilter === "expired") return isExpired;

    return true;
  });

  // return (
  //   <div className="p-6 w-full">
  //     <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>

  //     <div className="grid grid-cols-3 gap-4 mb-6">
  //       <StatsCard title="Total Programs" value={stats.programs} />
  //       <StatsCard title="Current Members" value={stats.members} />
  //       <StatsCard title="Current Volunteers" value={stats.volunteers} />
  //     </div>

  //     <NotificationsPanel notifications={notifications} />
  //   </div>
  // );
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back. Here’s what’s happening today.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* <StatsCard title="Total Programs" value={stats.programs} /> */}
        <StatsCard title="Program Catalog" value={stats.programs} />
        <StatsCard title="Current Members" value={stats.members} />
        <StatsCard title="Current Volunteers" value={stats.volunteers} />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Content (Future expansion area) */}
        <div className="lg:col-span-2 col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Overview
            </h2>

            <div className="text-gray-500 text-sm">
              You can use this space for:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Programs summary</li>
                <li>Recent activity</li>
                <li>Charts / analytics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Notifications
            </h2>

            <div className="flex gap-2 mb-4">
              {[
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "all", label: "All" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setNotificationFilter(filter.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    notificationFilter === filter.value
                      ? "bg-[#7a3e48] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[50vh] sm:max-h-[400px] overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <p className="text-sm text-gray-400">No active notifications</p>
              ) : (
                filteredNotifications.map((n) => (
                  // <div
                  //   key={n.id}
                  //   className="bg-[#7a3e48] text-white p-4 rounded-xl shadow-sm hover:scale-[1.01] transition-all"
                  // >
                  //   <p className="font-semibold">{n.title}</p>
                  //   <p className="text-sm opacity-90">{n.message}</p>
                  // </div>
                  <div
                    key={n.id}
                    onClick={() => setSelectedNotification(n)}
                    className="group rounded-2xl border border-[#ead7da] bg-gradient-to-br from-[#fff8f9] to-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#7a3e48]/10 text-[#7a3e48] flex items-center justify-center font-bold">
                        !
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {n.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-[#7a3e48]/10 text-[#7a3e48] font-medium">
                            {n.role_target || "all"}
                          </span>

                          {n.expires_at && (
                            <span className="text-gray-400">
                              Visible until{" "}
                              {new Date(n.expires_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {selectedNotification && (
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedNotification(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-[#7a3e48] to-[#4f252d] text-white p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/70">
                      Notification
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      {selectedNotification.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 border p-4">
                    <p className="text-xs text-gray-500 mb-1">Audience</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {selectedNotification.role_target || "All"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 border p-4">
                    <p className="text-xs text-gray-500 mb-1">Visible Until</p>
                    <p className="font-semibold text-gray-800">
                      {selectedNotification.expires_at
                        ? new Date(
                            selectedNotification.expires_at,
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "No expiration"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-5 py-2.5 rounded-xl bg-[#7a3e48] text-white font-medium hover:bg-[#65323b] transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
