import AdminSidebar from "./AdminSidebar";
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

const AdminProfile = ({ user, setUser }) => {
  console.log("AdminProfile mounted");
  console.log("USER PROP:", user);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });

  /* ---------- AVATAR ---------- */
  const initials = `${form.first_name?.[0] || ""}${
    form.last_name?.[0] || ""
  }`.toUpperCase();

  const getColor = (name) => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-indigo-400",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColor(form.first_name + form.last_name);

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
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

    fetchProfile();
    setEditing(false);
  };

  // const handleCancel = () => {
  //   setForm({
  //     first_name: profile?.people?.fname || "",
  //     last_name: user?.last_name || "",
  //   });
  //   setEditing(false);
  // };

  useEffect(() => {
    if (profile?.people) {
      setForm({
        first_name: profile.people.fname || "",
        last_name: profile.people.lname || "",
      });
    }
  }, [profile]);

  const handleCancel = () => {
    setForm({
      first_name: profile?.people?.fname || "",
      last_name: profile?.people?.lname || "",
    });
    setEditing(false);
  };

  // useEffect(() => {
  //   fetchProfile();
  // }, []);
  useEffect(() => {
    if (user?.id) {
      console.log("Calling fetchProfile with user:", user);
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    console.log("fetchProfile triggered");
    if (!user?.id) return;

    /* 1. GET USER */
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error(userError);
      return;
    }

    /* 2. GET PERSON */
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

    /* 3. COMBINE */
    const combined = {
      ...userData,
      people: personData,
    };

    console.log("USER DATA:", userData);
    console.log("PERSON DATA:", personData);
    console.log("COMBINED:", combined);

    setProfile(combined);

    setForm({
      first_name: personData?.fname || "",
      last_name: personData?.lname || "",
    });
  };

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      {/* <AdminSidebar setUser={setUser} /> */}

      <div className="flex-1 p-4 md:p-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-[#0f5b54]">
            Admin Profile
          </h2>
          <div className="w-32 h-1 bg-[#0f5b54] mx-auto mt-3"></div>
        </div>

        {/* CARD */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold ${bgColor}`}
            >
              {initials}
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              {form.first_name} {form.last_name}
            </h2>

            <span className="text-sm text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>

          {/* ACTION BUTTONS */}
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

          {/* FORM */}
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

            <Input label="Role" value={profile?.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
