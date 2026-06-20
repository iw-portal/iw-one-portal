import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
// import VolunteerSidebar from "./Sidebars/Volunteer";
import { LuInfo } from "react-icons/lu";

const VolunteerDashboard = ({ user, setUser }) => {
  const [notifications, setNotifications] = useState([]);

  const role = user?.role;
  console.log(role);

  useEffect(() => {
    if (role) fetchNotifications();
  }, [role]);

  const fetchNotifications = async () => {
    const nowPT = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      }),
    );

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .in("audience", ["all", role])
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    // 🔥 Filter based on Pacific time window
    const filtered = data.filter((n) => {
      const expiry = new Date(
        `${n.available_until_date}T${n.available_until_time}`,
      );

      return nowPT < expiry;
    });

    setNotifications(filtered);
  };
  setUser(user);

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      {/* <VolunteerSidebar setUser={setUser} /> */}

      {/* MAIN */}
      <div className="flex-1 p-10">
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
                {/* ICON */}
                <LuInfo className="text-xl mt-4 shrink-0" />

                {/* CONTENT */}
                <div>
                  <p className="font-semibold mb-1">{n.title}</p>
                  <p className="text-sm text-white/90">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* METRICS */}
        <h2 className="text-xl font-semibold mb-4">Metrics</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 mb-2">
              Number of Current Programs Enrolled
            </p>
            <p className="text-3xl font-bold">2</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 mb-2">
              Number of Past Programs Enrolled
            </p>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
