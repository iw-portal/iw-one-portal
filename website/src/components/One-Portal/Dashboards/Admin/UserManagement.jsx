import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const UserManagement = () => {
  const [people, setPeople] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    const { data, error } = await supabase
      .from("people")
      .select("*")
      .in("role", ["member", "volunteer", "lead"])
      .order("fname");

    if (error) {
      console.error(error);
      return;
    }

    setPeople(data || []);
  };

  const openRoleModal = async (person) => {
    const { data: programs } = await supabase
      .from("programs")
      .select("id, course_title")
      .or(`lead_id.eq.${person.id},co_lead_id.eq.${person.id}`);

    setSelectedUser({
      ...person,
      assignedPrograms: programs || [],
    });

    setNewRole(person.role);
  };

  const updateRole = async () => {
    if (!selectedUser) return;

    // Prevent demoting lead still assigned to programs
    if (
      selectedUser.role === "lead" &&
      newRole !== "lead" &&
      selectedUser.assignedPrograms?.length > 0
    ) {
      alert(
        `This lead is still assigned to ${
          selectedUser.assignedPrograms.length
        } program(s).\n\nRemove them as lead/co-lead first.`,
      );
      return;
    }

    const { data, error } = await supabase
      .from("people")
      .update({
        role: newRole,
      })
      .eq("id", selectedUser.id)
      .select();

    console.log("UPDATE RESULT:", data);
    console.log("UPDATE ERROR:", error);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Role updated successfully");

    setSelectedUser(null);

    fetchPeople();
  };

  const filteredPeople = people.filter((person) => {
    const term = search.toLowerCase();

    const matchesSearch =
      person.fname?.toLowerCase().includes(term) ||
      person.lname?.toLowerCase().includes(term) ||
      person.email?.toLowerCase().includes(term);

    const matchesRole = roleFilter === "all" || person.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const badgeColor = (role) => {
    switch (role) {
      case "lead":
        return "bg-purple-100 text-purple-700";

      case "volunteer":
        return "bg-green-100 text-green-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-80"
        />
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "member", "volunteer", "lead"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-xl border transition ${
              roleFilter === role
                ? "bg-[#0f5b54] text-white border-[#0f5b54]"
                : "bg-white border-gray-300"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                {person.fname} {person.lname}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(
                  person.role,
                )}`}
              >
                {person.role}
              </span>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              <p>{person.email}</p>
              <p>{person.phone}</p>
            </div>

            <button
              onClick={() => openRoleModal(person)}
              className="mt-auto bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700"
            >
              Change Role
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Change Role</h2>

            <div className="mb-4">
              <p className="font-medium">
                {selectedUser.fname} {selectedUser.lname}
              </p>

              <p className="text-gray-500 text-sm">{selectedUser.email}</p>
            </div>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6"
            >
              <option value="member">Member</option>
              <option value="volunteer">Volunteer</option>
              <option value="lead">Lead</option>
            </select>

            {selectedUser.assignedPrograms?.length > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="font-medium mb-2">Lead Assignments</p>

                {selectedUser.assignedPrograms.map((p) => (
                  <p key={p.id}>• {p.course_title}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateRole}
                className="px-4 py-2 bg-[#0f5b54] text-white rounded-lg"
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

export default UserManagement;
