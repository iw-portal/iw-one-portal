import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const Input = ({ label, value, editable = false, onChange }) => {
  return (
    <div className="flex flex-col text-left">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      {editable ? (
        <input
          value={value ?? ""}
          onChange={onChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f5b54]"
        />
      ) : (
        <div className="bg-gray-100 px-3 py-2 rounded-lg">{value || "-"}</div>
      )}
    </div>
  );
};

const PCSProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });

  const initials = `${form.first_name?.[0] || ""}${
    form.last_name?.[0] || ""
  }`.toUpperCase();

  const getColor = (name) => {
    const colors = ["bg-amber-500"];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColor("PCS");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchProfile = async () => {
    if (!user?.id) return;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error(userError);
      return;
    }

    let personData = null;

    if (userData.person_id) {
      const { data: p, error: pErr } = await supabase
        .from("people")
        .select("*")
        .eq("id", userData.person_id)
        .single();

      if (pErr) console.error(pErr);
      personData = p;
    }

    const combined = {
      ...userData,
      people: personData,
    };

    setProfile(combined);
    setUsername(userData?.username || "");

    setForm({
      first_name: personData?.fname || "",
      last_name: personData?.lname || "",
    });
  };

  const handleSave = async () => {
    if (!profile?.people?.id) return;

    const { error } = await supabase
      .from("people")
      .update({
        fname: form.first_name,
        lname: form.last_name,
      })
      .eq("id", profile.people.id);

    if (error) {
      console.error(error);
      alert("Update failed");
      return;
    }

    await fetchProfile();
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      first_name: profile?.people?.fname || "",
      last_name: profile?.people?.lname || "",
    });

    setEditing(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-[#0f5b54]">PCS Profile</h2>
          <div className="w-32 h-1 bg-[#0f5b54] mx-auto mt-3"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold ${bgColor}`}
            >
              {"PCS"}
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              {form.first_name} {form.last_name}
            </h2>

            <span className="text-sm text-gray-500 capitalize">
              {"PCS Team"}
            </span>
          </div>

          <div className="flex justify-end gap-3 mb-6">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-[#0f5b54] text-white rounded-lg hover:bg-[#0c4a45]"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Save
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={form.first_name}
              editable={editing}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />

            <Input
              label="Last Name"
              value={form.last_name}
              editable={editing}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />

            <div className="md:col-span-2">
              <Input label="Email" value={profile?.email} />
            </div>
            <div className="md:col-span-2">
              <Input label="Username" value={username} />
            </div>

            <Input label="Role" value={profile?.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCSProfile;
