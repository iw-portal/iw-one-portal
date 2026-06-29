import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";

export default function EnrollmentTransactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.person_id) {
      fetchTransactions();
    }
  }, [user?.person_id]);

  const fetchTransactions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("enrollment_orders")
      .select("*")
      .eq("person_id", user.person_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    setTransactions(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">Transactions</h1>

        <p className="text-gray-500 mt-3">Enrollment payment history.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold">No Transactions Found</h2>

            <p className="text-gray-500 mt-2">
              No payments have been recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">Date</th>

                  <th className="text-left p-4">Amount</th>

                  <th className="text-left p-4">Status</th>

                  <th className="text-left p-4">Payment Method</th>

                  <th className="text-left p-4">Transaction ID</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 font-medium">
                      ${Number(t.amount_received).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          t.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.payment_status}
                      </span>
                    </td>

                    <td className="p-4">{t.payment_method || "Stripe"}</td>

                    <td className="p-4 max-w-[250px] truncate">
                      {t.transaction_id ||
                        t.stripe_payment_intent_id ||
                        t.stripe_session_id ||
                        "-"}
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
