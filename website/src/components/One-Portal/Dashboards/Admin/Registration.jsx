import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const AdminRegistrations = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "volunteer",
    title: "",
    year: "",
    duration_type: "full_year",
    start_date: "",
    end_date: "",
    registration_fee: 50,
    vocational_1_price: 250,
    vocational_2_price: 450,
    vocational_3_price: 600,

    employment_services_price: 100,
    person_centered_services_price: 100,

    counseling_intake_price: 120,
    counseling_session_price: 30,
    is_open: true,
  });

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registration_settings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    setCycles(data || []);
    setLoading(false);
  };

  /* ---------------- CREATE ---------------- */
  const createCycle = async () => {
    if (
      !form.title ||
      !form.start_date ||
      !form.end_date ||
      form.vocational_1_price === "" ||
      form.vocational_2_price === "" ||
      form.vocational_3_price === "" ||
      form.employment_services_price === "" ||
      form.person_centered_services_price === "" ||
      form.counseling_intake_price === "" ||
      form.counseling_session_price === ""
    ) {
      return alert("Fill all required fields");
    }

    const { error } = await supabase
      .from("registration_settings")
      .insert([form]);

    if (error) {
      console.error(error);
      return alert("Error creating registration");
    }

    fetchCycles();

    setForm({
      type: "volunteer",
      title: "",
      year: "",
      duration_type: "full_year",
      start_date: "",
      end_date: "",

      registration_fee: 50,

      vocational_1_price: 250,
      vocational_2_price: 450,
      vocational_3_price: 600,

      employment_services_price: 100,
      person_centered_services_price: 100,

      counseling_intake_price: 120,
      counseling_session_price: 30,

      is_open: true,
    });
  };

  /* ---------------- TOGGLE ---------------- */
  const toggleStatus = async (id, current) => {
    const { error } = await supabase
      .from("registration_settings")
      .update({ is_open: !current })
      .eq("id", id);

    if (error) {
      console.error("TOGGLE ERROR:", error);
      alert(error.message);
      return;
    }

    fetchCycles();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Registrations</h1>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Create New Application</h2>

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-3 rounded w-full"
        >
          <option value="volunteer">Volunteer</option>
          <option value="member">Member</option>
        </select>

        {/* TITLE */}
        <input
          placeholder="Title (e.g. Fall 2025 Volunteer Applications)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-3 rounded w-full"
        />

        {/* TERM + YEAR */}
        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="Year (e.g. 2025)"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="border p-3 rounded"
          />

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">
              Application Type
            </label>

            <select
              value={form.environment}
              onChange={(e) =>
                setForm({ ...form, environment: e.target.value })
              }
              className="border p-3 rounded w-full mb-2"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
            </select>

            <select
              value={form.duration_type}
              onChange={(e) =>
                setForm({ ...form, duration_type: e.target.value })
              }
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-800/40"
            >
              <option value="full_year">Full Year</option>
              <option value="summer_only">Summer Only</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">
              Registration Fee ($)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.registration_fee}
              onChange={(e) =>
                setForm({
                  ...form,
                  registration_fee: Number(e.target.value),
                })
              }
              className="border p-3 rounded"
            />
          </div>
        </div>
        <div className="bg-gray-50 border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-lg">Program Pricing</h3>

          {/* Vocational */}

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Vocational Programs
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  1 Program
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="1 Course"
                  value={form.vocational_1_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vocational_1_price: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  2 Programs
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="2 Courses"
                  value={form.vocational_2_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vocational_2_price: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  3 Programs
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="3 Courses"
                  value={form.vocational_3_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vocational_3_price: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>
            </div>
          </div>

          {/* Non Vocational */}

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Non-Vocational Programs
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Employment Services
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Employment Services"
                  value={form.employment_services_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      employment_services_price: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Person Centered Services
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Person Centered Services"
                  value={form.person_centered_services_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      person_centered_services_price: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>
            </div>
          </div>

          {/* Counseling */}

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Counseling</h4>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                placeholder="Intake Fee"
                value={form.counseling_intake_price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    counseling_intake_price: Number(e.target.value),
                  })
                }
                className="border p-3 rounded"
              />

              <input
                type="number"
                min="0"
                placeholder="Session Fee"
                value={form.counseling_session_price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    counseling_session_price: Number(e.target.value),
                  })
                }
                className="border p-3 rounded"
              />
            </div>
          </div>
        </div>

        {/* DATE RANGE */}
        {/* <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="border p-3 rounded"
          />
        </div> */}
        {/* DATE RANGE */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">
            Application Window (visible to users only during this period)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                Start Date (Applications Open)
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="border p-3 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">
                End Date (Applications Close)
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="border p-3 rounded"
              />
            </div>
          </div>
        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={createCycle}
          className="bg-teal-800 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
        >
          Create Application
        </button>
      </div>

      {/* ACTIVE APPLICATIONS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Active Applications</h2>

        {cycles.length === 0 ? (
          <p className="text-gray-400 text-sm">No applications created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cycles.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border shadow"
              >
                {/* TITLE */}
                <h3 className="text-lg font-semibold">{c.title}</h3>

                {/* META */}
                <p className="text-sm text-gray-500 mt-1">
                  {c.type} • {c.year} •{" "}
                  {c.duration_type === "full_year"
                    ? "Full Year"
                    : "Summer Only"}
                </p>

                <p className="text-sm text-teal-700 font-medium mt-2">
                  Registration Fee: ${c.registration_fee ?? 50}
                </p>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>
                    Vocational: ${c.vocational_1_price} / $
                    {c.vocational_2_price} / ${c.vocational_3_price}
                  </p>

                  <p>Employment Services: ${c.employment_services_price}</p>

                  <p>
                    Person Centered Services: $
                    {c.person_centered_services_price}
                  </p>

                  <p>Counseling Intake: ${c.counseling_intake_price}</p>

                  <p>Counseling Session: ${c.counseling_session_price}</p>
                </div>

                {/* DATES */}
                <p className="text-xs text-gray-400 mt-2">
                  {c.start_date || "—"} → {c.end_date || "—"}
                </p>

                {/* STATUS */}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${
                      c.is_open ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {c.is_open ? "OPEN" : "CLOSED"}
                  </span>

                  {/* TOGGLE BUTTON */}
                  <button
                    onClick={() => toggleStatus(c.id, c.is_open)}
                    className={`px-4 py-1 rounded text-white text-sm ${
                      c.is_open
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-teal-800 hover:bg-teal-700"
                    }`}
                  >
                    {c.is_open ? "Close" : "Open"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegistrations;
