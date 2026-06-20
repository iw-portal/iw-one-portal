import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const AdminBugReports = () => {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    const { data, error } = await supabase
      .from("bug_reports")
      .select(
        `
        *,
        people:reported_by (
          fname,
          lname,
          email
        )
      `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setBugs(data || []);
  };

  const openBug = (bug) => {
    setSelectedBug(bug);
    setStatus(bug.status);
    setPriority(bug.priority);
  };

  const saveChanges = async () => {
    const { error } = await supabase
      .from("bug_reports")
      .update({
        status,
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedBug.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Bug updated.");

    setSelectedBug(null);

    loadBugs();
  };

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title?.toLowerCase().includes(search.toLowerCase()) ||
      bug.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || bug.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || bug.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const priorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";

      case "in_progress":
        return "bg-blue-100 text-blue-700";

      case "closed":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bug Reports</h1>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search bugs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">Title</th>

              <th className="text-left px-4 py-3">Reporter</th>

              <th className="text-left px-4 py-3">Priority</th>

              <th className="text-left px-4 py-3">Status</th>

              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBugs.map((bug) => (
              <tr
                key={bug.id}
                onClick={() => openBug(bug)}
                className="
                  border-b
                  hover:bg-gray-50
                  cursor-pointer
                "
              >
                <td className="px-4 py-3">{bug.title}</td>

                <td className="px-4 py-3">
                  {bug.people
                    ? `${bug.people.fname} ${bug.people.lname}`
                    : "Unknown"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${priorityColor(
                      bug.priority,
                    )}`}
                  >
                    {bug.priority}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusColor(
                      bug.status,
                    )}`}
                  >
                    {bug.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {new Date(bug.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}

      {selectedBug && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
          "
          onClick={() => setSelectedBug(null)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-6
              max-w-2xl
              w-full
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedBug.title}</h2>

            <div className="space-y-3">
              <p>
                <strong>Description:</strong>
              </p>

              <p className="whitespace-pre-wrap">{selectedBug.description}</p>

              <p>
                <strong>Page:</strong> {selectedBug.page_url}
              </p>

              <p>
                <strong>Browser:</strong> {selectedBug.browser_info}
              </p>

              <p>
                <strong>Reported By:</strong>{" "}
                {selectedBug.people
                  ? `${selectedBug.people.fname} ${selectedBug.people.lname}`
                  : "Unknown"}
              </p>

              <div>
                <label className="font-medium">Priority</label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border rounded-lg p-2 w-full mt-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Status</label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border rounded-lg p-2 w-full mt-1"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedBug(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                className="
                  bg-[#0f5b54]
                  text-white
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBugReports;
