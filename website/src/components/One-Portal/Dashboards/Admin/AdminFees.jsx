import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const tabs = ["Packages", "Transactions", "Payout Settings"];

const AdminFees = () => {
  const [activeTab, setActiveTab] = useState("Packages");
  const [paidByFor, setPaidByFor] = useState([]);

  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stripe_price_id: "",
  });

  useEffect(() => {
    fetchPackages();
    fetchTransactions();
  }, []);

  /* ---------------- FETCH ---------------- */

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*");
    setPackages(data || []);
  };

  // const fetchTransactions = async () => {
  //   const { data } = await supabase
  //     .from("transactions")
  //     .select("*")
  //     .order("created_at", { ascending: false });

  //   setTransactions(data || []);

  //   const { user } = await supabase
  //     .from("people")
  //     .select("fname, lname")
  //     .eq("id", data?.id);

  //   setTransactions(data || []);
  //   const paidFor = user?.fname + " " + user?.lname;
  //   setPaidByFor(paidFor);
  // };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
      *,
      people (fname, lname)
    `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    console.log("Transactions:", data);

    setTransactions(data || []);
  };

  /* ---------------- CREATE PACKAGE ---------------- */

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const createPackage = async () => {
    if (!form.name || !form.price || !form.stripe_price_id) {
      return alert("Fill required fields");
    }

    const { error } = await supabase.from("packages").insert([
      {
        ...form,
        price: Math.round(parseFloat(form.price) * 100),
      },
    ]);

    if (error) {
      console.error(error);
      return alert("Error creating package");
    }

    setForm({
      name: "",
      description: "",
      price: "",
      stripe_price_id: "",
    });

    fetchPackages();
  };

  /* ---------------- DELETE ---------------- */

  const deletePackage = async (id) => {
    await supabase.from("packages").delete().eq("id", id);
    fetchPackages();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "failed":
        return "bg-red-100 text-red-600 border border-red-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow">
        {/* HEADER */}
        <div className="border-b flex gap-4 p-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 ${
                activeTab === t
                  ? "bg-[#0f5b54] text-white rounded"
                  : "text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ================= PACKAGES ================= */}
          {activeTab === "Packages" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Create Package</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-3 rounded"
                />

                <input
                  placeholder="Price (USD)"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border p-3 rounded"
                />

                <input
                  placeholder="Stripe Price ID"
                  value={form.stripe_price_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe_price_id: e.target.value,
                    })
                  }
                  className="border p-3 rounded col-span-2"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="border p-3 rounded col-span-2"
                />
              </div>

              <button
                onClick={createPackage}
                className="bg-[#0f5b54] text-white px-6 py-2 rounded"
              >
                Create Package
              </button>

              {/* LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((p) => (
                  <div
                    key={p.id}
                    className="border p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <div>
                        <h3 className="font-semibold text-lg">{p.name}</h3>

                        <p className="text-sm font-medium">
                          ${(p.price / 100).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Stripe: {p.stripe_price_id}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deletePackage(p.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TRANSACTIONS ================= */}
          {activeTab === "Transactions" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Transactions</h2>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <div
                      key={t.id}
                      className="border p-4 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          ${(t.amount / 100).toFixed(2)}
                        </p>

                        <p className="text-sm text-gray-600">
                          User:{" "}
                          {t.people
                            ? `${capitalize(t.people.fname) || ""} ${capitalize(t.people.lname) || ""}`.trim()
                            : "Unknown"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Date(t.created_at).toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short",
                          })}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                          t.status,
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No transactions found</p>
                )}
              </div>
            </div>
          )}

          {/* ================= PAYOUT SETTINGS ================= */}
          {activeTab === "Payout Settings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payout Settings</h2>

              <p className="text-gray-500 text-sm">
                Bank account and routing details are securely managed by Stripe.
              </p>

              <a
                href="https://dashboard.stripe.com/settings/payouts"
                target="_blank"
                className="bg-[#0f5b54] text-white px-6 py-2 rounded inline-block"
              >
                Open Stripe Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFees;
