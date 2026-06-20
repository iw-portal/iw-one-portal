export default function NotificationPanel() {
  const notifications = [
    "Registration closes in 4 days",
    "2 students need buddy assignments",
    "5 attendance records require review",
    "3 pending enrollments",
  ];

  return (
    <div className="bg-white rounded-3xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="divide-y">
        {notifications.map((item, index) => (
          <div key={index} className="p-5">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
