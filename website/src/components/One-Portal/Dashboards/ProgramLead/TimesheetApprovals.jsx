import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function TimesheetApprovals({ user }) {
  const [programs, setPrograms] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.person_id) loadData();
  }, [user?.person_id]);

  const loadData = async () => {
    setLoading(true);

    const { data: leadPrograms, error: programError } = await supabase
      .from("programs")
      .select("id, course_title, course_code")
      .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
      .eq("is_archived", false)
      .order("course_title");

    if (programError) {
      console.error("Error loading programs:", programError);
      setLoading(false);
      return;
    }

    setPrograms(leadPrograms || []);

    const programIds = (leadPrograms || []).map((p) => p.id);

    if (programIds.length === 0) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // const { data: timeEntries, error: entryError } = await supabase
    //   .from("time_entries")
    //   .select(
    //     `
    //     id,
    //     person_id,
    //     manager_id,
    //     work_date,
    //     entry_type,
    //     start_time,
    //     end_time,
    //     hours,
    //     notes,
    //     status,
    //     approved_by,
    //     approved_at,
    //     created_at,
    //     program_id,
    //     people:person_id(
    //       id,
    //       fname,
    //       lname,
    //       email
    //     ),
    //     programs:program_id(
    //       id,
    //       course_title,
    //       course_code
    //     )
    //     `,
    //   )
    //   .in("program_id", programIds)
    //   .order("work_date", { ascending: false })
    //   .order("created_at", { ascending: false });

    const { data: timeEntries, error: entryError } = await supabase
      .from("time_entries")
      .select("*")
      .in("program_id", programIds)
      .order("work_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (entryError) {
      console.error("Error loading time entries:", entryError);
      setLoading(false);
      return;
    }

    const personIds = [
      ...new Set(
        (timeEntries || []).map((entry) => entry.person_id).filter(Boolean),
      ),
    ];

    let peopleData = [];

    if (personIds.length > 0) {
      const { data, error } = await supabase
        .from("people")
        .select("id, fname, lname, email")
        .in("id", personIds);

      if (error) {
        console.error("Error loading people:", error);
      }

      peopleData = data || [];
    }

    const peopleMap = {};
    peopleData.forEach((person) => {
      peopleMap[person.id] = person;
    });

    const programMap = {};
    (leadPrograms || []).forEach((program) => {
      programMap[program.id] = program;
    });

    const hydratedEntries = (timeEntries || []).map((entry) => ({
      ...entry,
      people: peopleMap[entry.person_id] || null,
      programs: programMap[entry.program_id] || null,
    }));

    setEntries(hydratedEntries);
    setLoading(false);
  };

  const updateEntryStatus = async (entryId, status) => {
    setSavingId(entryId);

    const updatePayload =
      status === "approved"
        ? {
            status: "approved",
            approved_by: user.person_id,
            approved_at: new Date().toISOString(),
          }
        : {
            status: "rejected",
            approved_by: user.person_id,
            approved_at: new Date().toISOString(),
          };

    const { error } = await supabase
      .from("time_entries")
      .update(updatePayload)
      .eq("id", entryId);

    if (error) {
      console.error("Error updating time entry:", error);
      alert("Failed to update timesheet entry");
      setSavingId(null);
      return;
    }

    await loadData();
    setSavingId(null);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const fullName = `${entry.people?.fname || ""} ${
        entry.people?.lname || ""
      }`.toLowerCase();

      const email = entry.people?.email?.toLowerCase() || "";
      const program = entry.programs?.course_title?.toLowerCase() || "";
      const query = search.toLowerCase();

      const matchesSearch =
        fullName.includes(query) ||
        email.includes(query) ||
        program.includes(query);

      const matchesProgram =
        programFilter === "all" || entry.program_id === programFilter;

      const matchesStatus =
        statusFilter === "all" || entry.status === statusFilter;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [entries, search, programFilter, statusFilter]);

  const summary = useMemo(() => {
    return {
      pending: entries.filter((e) => e.status === "pending").length,
      approved: entries.filter((e) => e.status === "approved").length,
      rejected: entries.filter((e) => e.status === "rejected").length,
      hours: entries
        .filter((e) => e.status === "approved")
        .reduce((sum, e) => sum + Number(e.hours || 0), 0),
    };
  }, [entries]);

  const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0f5b54] to-[#063a35] rounded-3xl p-8 text-white">
        <p className="text-sm text-white/70">Program Lead Workspace</p>

        <h1 className="text-4xl font-bold mt-2">Timesheet Approvals</h1>

        <p className="text-white/80 mt-3 max-w-3xl">
          Review, approve, or reject volunteer time entries for your assigned
          programs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Pending" value={summary.pending} />
        <SummaryCard title="Approved" value={summary.approved} />
        <SummaryCard title="Rejected" value={summary.rejected} />
        <SummaryCard title="Approved Hours" value={summary.hours.toFixed(1)} />
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search
            </label>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search volunteer, email, or program..."
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Program
            </label>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            >
              <option value="all">All Programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.course_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Volunteer Time Entries
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredEntries.length} entry
            {filteredEntries.length === 1 ? "" : "s"}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left p-4">Volunteer</th>
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Date</th>
                {/* <th className="text-left p-4">Time</th> */}
                <th className="text-left p-4">Hours</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Notes</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-gray-500">
                    Loading timesheets...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-gray-500">
                    No timesheet entries found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {entry.people?.fname} {entry.people?.lname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.people?.email || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium">
                        {entry.programs?.course_title || "-"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {entry.programs?.course_code || ""}
                      </p>
                    </td>

                    <td className="p-4">{entry.work_date || "-"}</td>
                    {/* 
                    <td className="p-4">
                      {formatTime(entry.start_time)} -{" "}
                      {formatTime(entry.end_time)}
                    </td> */}

                    <td className="p-4 font-semibold">
                      {Number(entry.hours || 0).toFixed(2)}
                    </td>

                    <td className="p-4 capitalize">
                      {entry.entry_type || "-"}
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="truncate">{entry.notes || "-"}</p>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={entry.status} />
                    </td>

                    <td className="p-4">
                      {entry.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={savingId === entry.id}
                            onClick={() =>
                              updateEntryStatus(entry.id, "approved")
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={savingId === entry.id}
                            onClick={() =>
                              updateEntryStatus(entry.id, "rejected")
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Already {entry.status}
                        </span>
                      )}
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
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white border rounded-3xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-[#0f5b54] mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "pending"}
    </span>
  );
}
