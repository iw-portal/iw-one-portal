import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const DONATION_ADMIN_USERNAMES = ["pranmaga", "rohipanc87", "madhkris93"];

export default function DonationsAdminView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const canViewDonations =
    currentUser?.role === "admin" &&
    DONATION_ADMIN_USERNAMES.includes(currentUser?.username);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("iw_user") || "{}");
      setCurrentUser(storedUser);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    if (!canViewDonations) {
      setLoading(false);
      return;
    }

    fetchDonations();
  }, [currentUser]);

  const fetchDonations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("donation_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Could not load donations.");
      setLoading(false);
      return;
    }

    setDonations(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-6">Loading donations...</div>;
  }

  if (!canViewDonations) {
    return (
      <div className="p-8 bg-white rounded-3xl border">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          You do not have permission to view donations.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">Donations</h1>
        <p className="text-gray-500 mt-3">
          View donation records received through Stripe.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        {donations.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold">No Donations Found</h2>
            <p className="text-gray-500 mt-2">
              No donation records have been created yet.
            </p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Donor</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Payment Status</th>
                  <th className="text-left p-4">Stripe Session</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {d.created_at
                        ? new Date(d.created_at).toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }) + " PT"
                        : "-"}
                    </td>

                    <td className="p-4 font-medium">{d.donor_name || "-"}</td>

                    <td className="p-4">{d.donor_email || "-"}</td>

                    <td className="p-4 font-semibold">
                      ${Number(d.amount || 0).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          d.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.payment_status || "pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-xs break-all whitespace-normal">
                        {d.stripe_session_id || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
