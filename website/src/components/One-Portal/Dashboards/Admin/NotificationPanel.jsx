// NotificationsPanel.jsx
const NotificationsPanel = ({ notifications }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-80">
      <h3 className="font-semibold text-lg mb-4">Notifications</h3>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-[#7a3e48] text-white p-4 rounded-xl">
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm opacity-90">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
