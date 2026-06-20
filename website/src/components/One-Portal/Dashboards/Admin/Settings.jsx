import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const tabs = [
  "Profile Settings",
  "Role Permissions",
  "Interface Customization",
];

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    phone: "",
  });

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    if (!user?.id) return;

    // USER + PEOPLE
    const { data: u } = await supabase
      .from("users")
      .select("*, people(*)")
      .eq("id", user.id)
      .single();

    setProfile(u);

    setForm({
      fname: u?.people?.fname || "",
      lname: u?.people?.lname || "",
      phone: u?.people?.phone || "",
    });

    // SETTINGS
    const { data: s } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setSettings(s);
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const saveProfile = async () => {
    await supabase
      .from("people")
      .update({
        fname: form.fname,
        lname: form.lname,
        phone: form.phone,
      })
      .eq("id", profile.people.id);

    fetchAll();
  };

  /* ---------------- SAVE SETTINGS ---------------- */
  const updateSetting = async (field, value) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);

    await supabase.from("user_settings").upsert({
      user_id: user.id,
      ...updated,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow">
        {/* HEADER */}
        <div className="border-b p-4 flex gap-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 ${
                activeTab === t
                  ? "bg-[#7a4b52] text-white rounded"
                  : "text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex">
          {/* LEFT PROFILE PANEL */}
          <div className="w-1/4 bg-gradient-to-b from-[#0f5b54] to-[#0a3f3b] text-white p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-3" />
              <p className="font-semibold">
                {form.fname} {form.lname}
              </p>
              <p className="text-sm">{profile?.email}</p>
            </div>

            <div className="mt-6 text-sm">
              <p>Primary Contact</p>
              <p>{form.phone || "-"}</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-6">
            {/* PROFILE TAB */}
            {activeTab === "Profile Settings" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Profile</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={form.fname}
                    onChange={(v) => setForm({ ...form, fname: v })}
                  />
                  <Input
                    label="Last Name"
                    value={form.lname}
                    onChange={(v) => setForm({ ...form, lname: v })}
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />
                </div>

                <button
                  onClick={saveProfile}
                  className="bg-[#0f5b54] text-white px-5 py-2 rounded"
                >
                  Save
                </button>
              </div>
            )}

            {/* ROLE TAB */}
            {activeTab === "Role Permissions" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>

                <select
                  value={profile?.role}
                  onChange={async (e) => {
                    const role = e.target.value;

                    await supabase
                      .from("users")
                      .update({ role })
                      .eq("id", user.id);

                    fetchAll();
                  }}
                  className="border p-2 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="member">Member</option>
                </select>
              </div>
            )}

            {/* UI TAB */}
            {activeTab === "Interface Customization" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Interface Customization
                </h2>

                <Toggle
                  label="Light Mode"
                  checked={settings?.theme === "light"}
                  onChange={() =>
                    updateSetting(
                      "theme",
                      settings?.theme === "light" ? "dark" : "light",
                    )
                  }
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <ToggleCard
                    label="Bigger Text"
                    active={settings?.bigger_text}
                    onClick={() =>
                      updateSetting("bigger_text", !settings?.bigger_text)
                    }
                  />

                  <ToggleCard
                    label="Bigger Cursor"
                    active={settings?.bigger_cursor}
                    onClick={() =>
                      updateSetting("bigger_cursor", !settings?.bigger_cursor)
                    }
                  />

                  <ToggleCard
                    label="Grayscale"
                    active={settings?.grayscale}
                    onClick={() =>
                      updateSetting("grayscale", !settings?.grayscale)
                    }
                  />

                  <ToggleCard
                    label="Letter Spacing"
                    active={settings?.letter_spacing}
                    onClick={() =>
                      updateSetting("letter_spacing", !settings?.letter_spacing)
                    }
                  />

                  <ToggleCard
                    label="Line Height"
                    active={settings?.line_height}
                    onClick={() =>
                      updateSetting("line_height", !settings?.line_height)
                    }
                  />

                  <ToggleCard
                    label="Invert Color"
                    active={settings?.invert_color}
                    onClick={() =>
                      updateSetting("invert_color", !settings?.invert_color)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- UI COMPONENTS ---------------- */

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded mt-1"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3">
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);

const ToggleCard = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border rounded cursor-pointer ${
      active ? "bg-[#7a4b52] text-white" : "bg-white"
    }`}
  >
    {label}
  </div>
);

export default Settings;
