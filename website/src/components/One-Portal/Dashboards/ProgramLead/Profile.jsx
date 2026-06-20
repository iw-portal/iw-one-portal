// import { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabase";

// const TABS = ["profile", "emergency"];

// export default function Profile({ user }) {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [editing, setEditing] = useState(false);

//   const [person, setPerson] = useState(null);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (user?.person_id) {
//       fetchPerson();
//     }
//   }, [user?.person_id]);

//   const fetchPerson = async () => {
//     const { data: personData, error: personError } = await supabase
//       .from("people")
//       .select("*")
//       .eq("id", user.person_id)
//       .single();

//     if (personError) {
//       console.error(personError);
//       return;
//     }

//     const { data: leadData, error: leadError } = await supabase
//       .from("lead_profiles")
//       .select("*")
//       .eq("person_id", user.person_id)
//       .single();

//     if (leadError) {
//       console.error(leadError);
//     }

//     const combined = {
//       ...personData,
//       ...(leadData || {}),
//     };

//     setPerson(combined);
//     setFormData(combined);
//   };

//   const updateField = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const saveProfile = async () => {
//     try {
//       const { error: peopleError } = await supabase
//         .from("people")
//         .update({
//           phone: formData.phone,
//           address: formData.address,
//         })
//         .eq("id", user.person_id);

//       if (peopleError) throw peopleError;

//       const { error: leadError } = await supabase
//         .from("lead_profiles")
//         .update({
//           emergency_first_name: formData.emergency_first_name,

//           emergency_last_name: formData.emergency_last_name,

//           emergency_relationship: formData.emergency_relationship,

//           emergency_phone_1: formData.emergency_phone_1,

//           emergency_phone_2: formData.emergency_phone_2,

//           emergency_email: formData.emergency_email,

//           leadership_experience: formData.leadership_experience,

//           mentoring_experience: formData.mentoring_experience,

//           volunteer_experience: formData.volunteer_experience,

//           leadership_notes: formData.leadership_notes,
//         })
//         .eq("person_id", user.person_id);

//       if (leadError) throw leadError;

//       setEditing(false);
//       fetchPerson();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save profile");
//     }
//   };

//   const Field = ({ label, value }) => (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//         {label}
//       </p>

//       <p className="font-medium text-gray-900">{value || "-"}</p>
//     </div>
//   );

//   const EditableField = ({ label, field, value }) => (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//         {label}
//       </p>

//       {editing ? (
//         <input
//           value={value || ""}
//           onChange={(e) => updateField(field, e.target.value)}
//           className="w-full border rounded-lg px-3 py-2"
//         />
//       ) : (
//         <p className="font-medium text-gray-900">{value || "-"}</p>
//       )}
//     </div>
//   );

//   if (!person) {
//     return <div className="p-8">Loading profile...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}

//       <div className="bg-white rounded-3xl border shadow-sm p-8">
//         <h1 className="text-4xl font-bold text-[#0f5b54]">
//           Program Lead Profile
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Manage your personal and emergency contact information.
//         </p>
//       </div>

//       {/* Summary Card */}

//       <div className="bg-white rounded-3xl border shadow-sm p-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-[#0f5b54]">
//               {person.fname} {person.lname}
//             </h2>

//             <p className="text-gray-500">Program Lead</p>
//           </div>

//           <div className="text-sm text-gray-600">
//             <p>{person.email}</p>
//             <p>{person.phone || "-"}</p>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}

//       <div className="flex gap-3">
//         <button
//           onClick={() => setEditing(!editing)}
//           className="bg-[#0f5b54] text-white px-5 py-2 rounded-xl"
//         >
//           {editing ? "Cancel" : "Edit Profile"}
//         </button>

//         {editing && (
//           <button
//             onClick={saveProfile}
//             className="bg-green-600 text-white px-5 py-2 rounded-xl"
//           >
//             Save Changes
//           </button>
//         )}
//       </div>

//       {/* Tabs */}

//       <div className="flex gap-3 flex-wrap">
//         {TABS.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
//               activeTab === tab ? "bg-[#0f5b54] text-white" : "bg-white border"
//             }`}
//           >
//             {tab === "profile" ? "Profile" : "Emergency Contact"}
//           </button>
//         ))}
//       </div>

//       {/* Profile Tab */}

//       {activeTab === "profile" && (
//         <div className="space-y-6">
//           {/* Personal Information */}

//           <div className="bg-white rounded-3xl border shadow-sm p-8">
//             <h3 className="text-xl font-semibold text-[#0f5b54] mb-6">
//               Personal Information
//             </h3>

//             <div className="grid md:grid-cols-2 gap-8">
//               <Field label="First Name" value={person.fname} />

//               <Field label="Last Name" value={person.lname} />

//               <Field label="Email" value={person.email} />

//               <EditableField
//                 label="Phone"
//                 field="phone"
//                 value={formData.phone}
//               />

//               <EditableField
//                 label="Address"
//                 field="address"
//                 value={formData.address}
//               />

//               <Field label="Date of Birth" value={person.dob} />
//             </div>
//           </div>

//           {/* Leadership Information */}

//           <div className="bg-white rounded-3xl border shadow-sm p-8">
//             <h3 className="text-xl font-semibold text-[#0f5b54] mb-6">
//               Leadership Information
//             </h3>

//             <div className="grid md:grid-cols-2 gap-8">
//               <EditableField
//                 label="Leadership Experience"
//                 field="leadership_experience"
//                 value={formData.leadership_experience}
//               />

//               <EditableField
//                 label="Mentoring Experience"
//                 field="mentoring_experience"
//                 value={formData.mentoring_experience}
//               />

//               <EditableField
//                 label="Volunteer Experience"
//                 field="volunteer_experience"
//                 value={formData.volunteer_experience}
//               />

//               <EditableField
//                 label="Leadership Notes"
//                 field="leadership_notes"
//                 value={formData.leadership_notes}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Emergency Tab */}

//       {activeTab === "emergency" && (
//         <div className="bg-white rounded-3xl border shadow-sm p-8">
//           <h3 className="text-xl font-semibold text-[#0f5b54] mb-6">
//             Emergency Contact
//           </h3>

//           <div className="grid md:grid-cols-2 gap-8">
//             <Field
//               label="Name"
//               value={`${person.emergency_first_name || ""} ${person.emergency_last_name || ""}`}
//             />

//             <Field label="Relationship" value={person.emergency_relationship} />

//             <EditableField
//               label="Primary Phone"
//               field="emergency_phone1"
//               value={formData.emergency_phone_1}
//             />

//             <EditableField
//               label="Secondary Phone"
//               field="emergency_phone2"
//               value={formData.emergency_phone_2}
//             />

//             <EditableField
//               label="Email"
//               field="emergency_email"
//               value={formData.emergency_email}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const TABS = ["profile", "emergency", "leadership"];

const Field = ({ label, value }) => (
  <div className="rounded-2xl bg-gray-50 border p-4">
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

// const EditableField = ({
//   label,
//   field,
//   value,
//   editing,
//   updateField,
//   type = "text",
//   textarea = false,
// }) => (
//   <div className="rounded-2xl bg-gray-50 border p-4">
//     <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
//       {label}
//     </p>

//     {editing ? (
//       textarea ? (
//         <textarea
//           rows={4}
//           value={value || ""}
//           onChange={(e) => updateField(field, e.target.value)}
//           className="w-full border rounded-xl px-3 py-2 min-h-[110px]"
//         />
//       ) : (
//         <input
//           type={type}
//           value={value || ""}
//           onChange={(e) => updateField(field, e.target.value)}
//           className="w-full border rounded-xl px-3 py-2"
//         />
//       )
//     ) : (
//       <p className="font-semibold text-gray-900 whitespace-pre-wrap">
//         {value || "-"}
//       </p>
//     )}
//   </div>
// );

const EditableField = ({
  label,
  field,
  value,
  editing,
  updateField,
  multiline = false,
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;

    // Restrict phone fields to 10 digits
    if (field?.toLowerCase().includes("phone")) {
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    }

    updateField(field, newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
        {label}
      </label>

      {editing ? (
        multiline ? (
          <textarea
            rows={4}
            value={value || ""}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0f5b54] focus:border-[#0f5b54]"
          />
        ) : (
          <input
            type={field?.toLowerCase().includes("phone") ? "tel" : "text"}
            value={value || ""}
            onChange={handleChange}
            maxLength={field?.toLowerCase().includes("phone") ? 10 : undefined}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0f5b54] focus:border-[#0f5b54]"
          />
        )
      ) : (
        <p className="text-gray-900">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      )}
    </div>
  );
};

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [person, setPerson] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user?.person_id) fetchPerson();
  }, [user?.person_id]);

  const fetchPerson = async () => {
    const { data: personData, error: personError } = await supabase
      .from("people")
      .select("*")
      .eq("id", user.person_id)
      .single();

    if (personError) {
      console.error("Error fetching person:", personError);
      return;
    }

    const { data: leadData, error: leadError } = await supabase
      .from("lead_profiles")
      .select("*")
      .eq("person_id", user.person_id)
      .maybeSingle();

    if (leadError) {
      console.error("Error fetching lead profile:", leadError);
    }

    const combined = {
      ...personData,
      ...(leadData || {}),
    };

    setPerson(combined);
    setFormData(combined);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const { error: peopleError } = await supabase
        .from("people")
        .update({
          phone: formData.phone || null,
          address: formData.address || null,
        })
        .eq("id", user.person_id);

      if (peopleError) throw peopleError;

      const { error: leadError } = await supabase.from("lead_profiles").upsert(
        {
          person_id: user.person_id,
          emergency_first_name: formData.emergency_first_name || null,
          emergency_last_name: formData.emergency_last_name || null,
          emergency_relationship: formData.emergency_relationship || null,
          emergency_phone_1: formData.emergency_phone_1 || null,
          emergency_phone_2: formData.emergency_phone_2 || null,
          emergency_email: formData.emergency_email || null,
          leadership_experience: formData.leadership_experience || null,
          mentoring_experience: formData.mentoring_experience || null,
          volunteer_experience: formData.volunteer_experience || null,
          leadership_notes: formData.leadership_notes || null,
        },
        { onConflict: "person_id" },
      );

      if (leadError) throw leadError;

      setEditing(false);
      await fetchPerson();
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setFormData(person);
    setEditing(false);
  };

  if (!person) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0f5b54] to-[#063a35] rounded-3xl shadow-sm p-8 text-white">
        <p className="text-sm text-white/70">Program Lead Workspace</p>
        <h1 className="text-4xl font-bold mt-2">Profile</h1>
        <p className="text-white/80 mt-3">
          View and update your profile, emergency contact, and leadership
          information.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0f5b54]">
              {person.fname} {person.lname}
            </h2>
            <p className="text-gray-500 mt-1">Program Lead</p>
          </div>

          <div className="text-sm text-gray-600 md:text-right">
            <p>{person.email || "-"}</p>
            <p>{person.phone || "-"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={editing ? cancelEditing : () => setEditing(true)}
          className="bg-[#0f5b54] text-white px-5 py-3 rounded-xl"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

        {editing && (
          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-green-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-xl text-sm font-semibold capitalize transition ${
              activeTab === tab ? "bg-[#0f5b54] text-white" : "bg-white border"
            }`}
          >
            {tab === "profile"
              ? "Personal Profile"
              : tab === "emergency"
                ? "Emergency Contact"
                : "Leadership Info"}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h3 className="text-xl font-bold text-[#0f5b54] mb-6">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="First Name" value={person.fname} />
            <Field label="Last Name" value={person.lname} />
            <Field label="Email" value={person.email} />
            <Field label="Date of Birth" value={person.dob} />

            <EditableField
              label="Phone"
              field="phone"
              value={formData.phone}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Address"
              field="address"
              value={formData.address}
              editing={editing}
              updateField={updateField}
            />
          </div>
        </div>
      )}

      {activeTab === "emergency" && (
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h3 className="text-xl font-bold text-[#0f5b54] mb-6">
            Emergency Contact
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <EditableField
              label="First Name"
              field="emergency_first_name"
              value={formData.emergency_first_name}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Last Name"
              field="emergency_last_name"
              value={formData.emergency_last_name}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Relationship"
              field="emergency_relationship"
              value={formData.emergency_relationship}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Primary Phone"
              field="emergency_phone_1"
              value={formData.emergency_phone_1}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Secondary Phone"
              field="emergency_phone_2"
              value={formData.emergency_phone_2}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Email"
              field="emergency_email"
              value={formData.emergency_email}
              editing={editing}
              updateField={updateField}
              type="email"
            />
          </div>
        </div>
      )}

      {activeTab === "leadership" && (
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h3 className="text-xl font-bold text-[#0f5b54] mb-6">
            Leadership Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <EditableField
              label="Leadership Experience"
              field="leadership_experience"
              value={formData.leadership_experience}
              textarea
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Mentoring Experience"
              field="mentoring_experience"
              value={formData.mentoring_experience}
              textarea
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Volunteer Experience"
              field="volunteer_experience"
              value={formData.volunteer_experience}
              textarea
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Leadership Notes"
              field="leadership_notes"
              value={formData.leadership_notes}
              textarea
              editing={editing}
              updateField={updateField}
            />
          </div>
        </div>
      )}
    </div>
  );
}
