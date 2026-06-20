import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

/* ---------------- COMPONENT ---------------- */

const Timesheet = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [pendingHours, setPendingHours] = useState(0);

  const [manual, setManual] = useState({
    program_id: "",
    hours: "",
    notes: "",
    date: "",
  });

  const [totalHours, setTotalHours] = useState(0);

  /* ---------------- LOAD ---------------- */
  const loadEntries = async () => {
    const { data, error } = await supabase
      .from("time_entries")
      .select(
        `
        *,
        programs (
          course_title
        )
      `,
      )
      .eq("person_id", user.person_id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);

    setEntries(data || []);
  };

  const exportApprovedHoursCSV = async () => {
    const { data, error } = await supabase
      .from("time_entries")
      .select(
        `
      work_date,
      hours,
      notes,
      status,
      programs (
        course_title
      )
    `,
      )
      .eq("person_id", user.person_id)
      .eq("status", "approved")
      .order("work_date", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("No approved hours found to export");
      return;
    }

    const headers = ["Date", "Program", "Hours", "Notes", "Status"];

    const rows = data.map((entry) => [
      entry.work_date || "",
      entry.programs?.course_title || "",
      entry.hours || 0,
      entry.notes || "",
      entry.status || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `approved-hours-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const loadPendingHours = async () => {
    const { data } = await supabase
      .from("time_entries")
      .select("hours")
      .eq("person_id", user.person_id)
      .eq("status", "pending");

    const total = data?.reduce((sum, e) => sum + (e.hours || 0), 0) || 0;

    setPendingHours(total.toFixed(2));
  };

  const loadTotalHours = async () => {
    const { data, error } = await supabase
      .from("time_entries")
      .select("hours")
      .eq("person_id", user.person_id)
      .eq("status", "approved");

    if (error) {
      console.error(error);
      return;
    }

    const total = data?.reduce((sum, e) => sum + (e.hours || 0), 0) || 0;

    setTotalHours(total.toFixed(2));
  };

  /* ---------------- MANUAL ENTRY ---------------- */

  // const handleManualEntry = async () => {
  //   if (!manual.hours || !manual.notes) return alert("All fields required");

  //   const date = manual.date || new Date().toISOString().slice(0, 10);

  //   const { error } = await supabase.from("time_entries").insert({
  //     person_id: user.person_id,
  //     manager_id: user.manager_id,
  //     work_date: date,
  //     entry_type: "direct",
  //     hours: Number(manual.hours),
  //     notes: manual.notes,
  //     status: "pending",
  //   });

  //   if (error) return alert(error.message);

  //   setManual({ hours: "", notes: "", date: "" });
  //   loadEntries();
  // };

  const handleManualEntry = async () => {
    if (!manual.program_id || !manual.hours || !manual.notes) {
      return alert("All fields are required");
    }

    const date = manual.date || new Date().toISOString().slice(0, 10);

    const selectedProgram = programs.find(
      (p) => p.programs.id === manual.program_id,
    );

    if (!selectedProgram?.programs?.lead_id) {
      return alert(
        `No lead assigned for ${selectedProgram?.programs?.course_title}`,
      );
    }

    const { error } = await supabase.from("time_entries").insert({
      person_id: user.person_id,
      program_id: manual.program_id,
      manager_id: selectedProgram?.programs?.lead_id,
      work_date: date,
      entry_type: "direct",
      hours: Number(manual.hours),
      notes: manual.notes,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setManual({
      program_id: "",
      hours: "",
      notes: "",
      date: "",
    });

    loadEntries();
    loadTotalHours();
    loadPendingHours();
  };

  const loadPrograms = async () => {
    const { data, error } = await supabase
      .from("person_programs")
      .select(
        `
      program_id,
      programs (
        id,
        course_title,
        lead_id
      )
    `,
      )
      .eq("person_id", user.person_id)
      .eq("status", "current");

    const { data: specialPrograms, error: specialError } = await supabase
      .from("programs")
      .select(
        `
      id,
      course_title,
      lead_id
    `,
      )
      .in("course_title", ["Outreach", "Other"]);

    if (error) {
      console.error(error);
      return;
    }

    if (specialError) {
      console.error(specialError);
      return;
    }

    const combinedPrograms = [
      ...(data || []),
      ...(specialPrograms || []).map((p) => ({
        program_id: p.id,
        programs: p,
      })),
    ];

    const uniquePrograms = Array.from(
      new Map(combinedPrograms.map((p) => [p.programs.id, p])).values(),
    );

    setPrograms(uniquePrograms);
  };

  useEffect(() => {
    loadEntries();
    loadPrograms();
    loadTotalHours();
    loadPendingHours();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 mb-1">Approved Hours</p>
          <p className="text-3xl font-bold text-green-600">
            {Number(totalHours).toFixed(2)} hrs
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 mb-1">Pending Hours</p>
          <p className="text-3xl font-bold text-yellow-600">
            {Number(pendingHours).toFixed(2)} hrs
          </p>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold text-lg">Submit Volunteer Hours</h2>

        <select
          value={manual.program_id}
          required
          onChange={(e) =>
            setManual({
              ...manual,
              program_id: e.target.value,
            })
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Select Program</option>

          {programs.map((p) => (
            <option key={p.programs.id} value={p.programs.id}>
              {p.programs.course_title}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={manual.date}
          required
          onChange={(e) =>
            setManual({
              ...manual,
              date: e.target.value,
            })
          }
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          step="0.25"
          min="0"
          placeholder="Hours Worked"
          value={manual.hours}
          required
          onChange={(e) =>
            setManual({
              ...manual,
              hours: e.target.value,
            })
          }
          className="border p-2 rounded w-full"
        />

        <textarea
          placeholder="Describe the work completed"
          value={manual.notes}
          required
          onChange={(e) =>
            setManual({
              ...manual,
              notes: e.target.value,
            })
          }
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleManualEntry}
          className="bg-[#0f5b54] text-white px-4 py-2 rounded"
        >
          Submit Hours
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Entries</h2>

          <button
            onClick={exportApprovedHoursCSV}
            className="bg-[#0f5b54] text-white px-4 py-2 rounded text-sm"
          >
            Export Approved CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Date</th>
                <th>Program</th>
                <th>Hours</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No entries yet
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{e.work_date}</td>

                    <td>{e.programs?.course_title || "-"}</td>

                    <td>
                      {e.hours
                        ? `${e.hours} hr`
                        : e.start_time && e.end_time
                          ? (
                              (new Date(e.end_time) - new Date(e.start_time)) /
                              (1000 * 60 * 60)
                            ).toFixed(2) + " hr"
                          : "-"}
                    </td>

                    <td className="max-w-[200px] truncate">{e.notes || "-"}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          e.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : e.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
