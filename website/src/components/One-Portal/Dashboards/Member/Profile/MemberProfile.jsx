import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";

const TABS = ["profile", "programs", "experience", "family"];

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);

const EditableField = ({
  label,
  field,
  value,
  editing,
  updateField,
  readOnly = false,
  multiline = true,
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>

    {editing && !readOnly ? (
      multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="border rounded-lg p-2 mt-1"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="border rounded-lg p-2 mt-1"
        />
      )
    ) : (
      <span className="font-medium">{value || "-"}</span>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow space-y-4">
    <h3 className="font-semibold text-[#0f5b54]">{title}</h3>
    {children}
  </div>
);

const MemberProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [person, setPerson] = useState(null);
  const [application, setApplication] = useState(null);
  const [profile, setProfile] = useState(null);

  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [programs, setPrograms] = useState([]);

  const [editingPrograms, setEditingPrograms] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user?.person_id) return;

    fetchPerson();
    fetchApplication();
    fetchEnrollmentProfile();
    fetchEnrollments();
    fetchOrders();
    fetchPrograms();
    fetchAvailablePrograms();
  }, [user?.person_id]);

  /* ---------------- FETCH PROFILE ---------------- */
  // const fetchPerson = async () => {
  //   const { data, error } = await supabase
  //     .from("people")
  //     .select("*")
  //     .eq("id", user.person_id)
  //     .single();

  //   if (!error) setPerson(data);
  // };
  const fetchPerson = async () => {
    const [
      { data: personData, error: personError },
      { data: userData, error: userError },
    ] = await Promise.all([
      supabase.from("people").select("*").eq("id", user.person_id).single(),

      supabase
        .from("users")
        .select("username")
        .eq("person_id", user.person_id)
        .maybeSingle(),
    ]);

    if (!personError) setPerson(personData);

    if (!userError) {
      setUsername(userData?.username || "");
    }
  };

  const fetchApplication = async () => {
    const email = user?.email;

    if (!email) return;

    const { data, error } = await supabase
      .from("member_applications")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) setApplication(data);
  };

  const fetchEnrollmentProfile = async () => {
    const { data, error } = await supabase
      .from("member_enrollment_profiles")
      .select("*")
      .eq("person_id", user.person_id)
      .maybeSingle();

    if (!error) setProfile(data);
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
      *,
      programs (*)
    `,
      )
      .eq("student_id", user.person_id);

    if (error) {
      console.error(error);
      return;
    }

    setEnrollments(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("enrollment_orders")
      .select("*")
      .eq("person_id", user.person_id)
      .order("created_at", {
        ascending: false,
      });

    if (!error) setOrders(data || []);
  };

  /* ---------------- FETCH PROGRAMS ---------------- */
  // const fetchPrograms = async () => {
  //   if (!user?.person_id) return;

  //   const { data, error } = await supabase
  //     .from("person_programs")
  //     .select(
  //       `
  //       *,
  //       programs (name, course_code)
  //     `,
  //     )
  //     .eq("person_id", user.person_id);

  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   setPrograms(data || []);
  // };
  const fetchPrograms = async () => {
    if (!user?.person_id) return;

    const { data, error } = await supabase
      .from("person_programs")
      .select(
        `
    *,
    program_id,
    programs (
      id,
      course_title,
      course_code,
      category
    )
  `,
      )
      .eq("person_id", user.person_id);

    console.log("PROGRAMS DATA", data);
    console.log("PROGRAMS ERROR", error);

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(data || []);
  };

  const fetchAvailablePrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("course_title");

    if (error) {
      console.error(error);
      return;
    }

    setAvailablePrograms(data || []);
  };

  useEffect(() => {
    if (application || profile) {
      setFormData({
        ...application,
        ...profile,
      });
    }
  }, [application, profile]);

  useEffect(() => {
    setSelectedPrograms(enrollments.map((e) => e.program_id));
  }, [enrollments]);

  const vocationalCount = availablePrograms.filter(
    (p) =>
      selectedPrograms.includes(p.id) &&
      p.category?.toLowerCase() === "vocational",
  ).length;

  const vocationalEnrollments = enrollments.filter(
    (e) => e.programs?.category?.toLowerCase() === "vocational",
  );

  const nonVocationalEnrollments = enrollments.filter(
    (e) => e.programs?.category?.toLowerCase() !== "vocational",
  );

  const assignedProgramIds = programs
    .filter((p) => p.status === "current")
    .map((p) => p.program_id);

  const assignedVocationalCount = programs.filter(
    (p) =>
      p.status === "current" &&
      p.programs?.category?.toLowerCase() === "vocational",
  ).length;

  const toggleProgram = (program) => {
    const isSelected = selectedPrograms.includes(program.id);
    const isAssigned = assignedProgramIds.includes(program.id);
    const isVocational = program.category?.toLowerCase() === "vocational";

    if (isSelected) {
      if (isAssigned) {
        alert(
          "You cannot remove an assigned program. Please contact admin first.",
        );
        return;
      }

      setSelectedPrograms((prev) => prev.filter((id) => id !== program.id));
      return;
    }

    if (isVocational) {
      const selectedVocationalCount = availablePrograms.filter(
        (p) =>
          selectedPrograms.includes(p.id) &&
          p.category?.toLowerCase() === "vocational",
      ).length;

      if (assignedVocationalCount >= 3 || selectedVocationalCount >= 3) {
        alert("Maximum of 3 vocational programs allowed.");
        return;
      }
    }

    setSelectedPrograms((prev) => [...prev, program.id]);
  };

  // const existingIds = enrollments.map((e) => e.program_id);

  // const toRemove = existingIds.filter((id) => !selectedPrograms.includes(id));

  // const toAdd = selectedPrograms.filter((id) => !existingIds.includes(id));

  const savePrograms = async () => {
    try {
      const existingIds = enrollments.map((e) => e.program_id);

      const toRemove = existingIds.filter(
        (id) => !selectedPrograms.includes(id),
      );

      const toAdd = selectedPrograms.filter((id) => !existingIds.includes(id));

      const blockedRemovals = toRemove.filter((id) =>
        assignedProgramIds.includes(id),
      );

      if (blockedRemovals.length > 0) {
        alert(
          "Assigned programs cannot be removed. Please contact admin first.",
        );
        return;
      }

      // SWAP EXISTING ENTRIES
      const swapCount = Math.min(toRemove.length, toAdd.length);

      for (let i = 0; i < swapCount; i++) {
        const oldProgramId = toRemove[i];
        const newProgramId = toAdd[i];

        const enrollmentRow = enrollments.find(
          (e) => e.program_id === oldProgramId,
        );

        if (!enrollmentRow) continue;

        const { error } = await supabase
          .from("enrollments")
          .update({
            program_id: newProgramId,
          })
          .eq("id", enrollmentRow.id);

        if (error) throw error;
      }

      // REMAINING REMOVALS
      for (let i = swapCount; i < toRemove.length; i++) {
        const { error } = await supabase
          .from("enrollments")
          .delete()
          .eq("student_id", user.person_id)
          .eq("program_id", toRemove[i]);

        if (error) throw error;
      }

      // REMAINING ADDITIONS
      for (let i = swapCount; i < toAdd.length; i++) {
        const { error } = await supabase.from("enrollments").insert({
          student_id: user.person_id,
          program_id: toAdd[i],
          enrollment_status: "preferred",
        });

        if (error) throw error;
      }

      await fetchEnrollments();

      setEditingPrograms(false);

      alert("Program preferences updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update program preferences.");
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!person) {
    return <div className="p-10">Loading...</div>;
  }

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length < 4) {
      return digits;
    }

    if (digits.length < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const saveProfile = async () => {
    try {
      const memberEmail = application?.email?.trim().toLowerCase();

      const parent1Email = formData.p1_email?.trim().toLowerCase();
      const parent2Email = formData.p2_email?.trim().toLowerCase();
      const emergencyEmail = formData.e_email?.trim().toLowerCase();

      if (
        emergencyEmail &&
        [memberEmail, parent1Email, parent2Email].includes(emergencyEmail)
      ) {
        alert(
          "Emergency contact email must be different from the member and parents.",
        );
        return;
      }

      const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");

      const memberPhone = normalizePhone(formData.phone);
      const parent1Phone = normalizePhone(formData.p1_phone1);
      const parent2Phone = normalizePhone(formData.p2_phone1);
      const emergencyPhone = normalizePhone(formData.e_phone1);

      if (
        emergencyPhone &&
        [memberPhone, parent1Phone, parent2Phone].includes(emergencyPhone)
      ) {
        alert(
          "Emergency contact phone must be different from the member and parents.",
        );
        return;
      }

      const { error: appError } = await supabase
        .from("member_applications")
        .update({
          phone: formatPhoneNumber(formData.phone),
          address: formData.address,
          age: formData.age,
          grade: formData.grade,
          ged: formData.ged,
          training_courses: formData.training_courses,

          p1_phone1: formatPhoneNumber(formData.p1_phone1),
          p1_email: formData.p1_email,

          p2_phone1: formatPhoneNumber(formData.p2_phone1),
          p2_email: formData.p2_email,

          e_phone1: formatPhoneNumber(formData.e_phone1),
          e_email: formData.e_email,
        })
        .eq("id", application.id);

      if (appError) throw appError;

      const { error: enrollError } = await supabase
        .from("member_enrollment_profiles")
        .update({
          desired_skills: formData.desired_skills,
          prior_jobs: formData.prior_jobs,
          jobs_interested: formData.jobs_interested,
          hours_per_week: formData.hours_per_week,

          dream_job: formData.dream_job,
          desired_growth_areas: formData.desired_growth_areas,

          goals_expectations: formData.goals_expectations,

          why_interested_iw: formData.why_interested_iw,

          hopes_dreams: formData.hopes_dreams,

          perfect_day: formData.perfect_day,

          important_to: formData.important_to,

          important_for: formData.important_for,

          favorite_food: formData.favorite_food,

          activities: formData.activities,

          entertainment: formData.entertainment,

          favorite_outings: formData.favorite_outings,
        })
        .eq("person_id", user.person_id);

      if (enrollError) throw enrollError;

      setEditing(false);

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  // const Field = ({ label, value }) => (
  //   <div className="flex flex-col">
  //     <span className="text-xs text-gray-500">{label}</span>
  //     <span className="font-medium">{value || "-"}</span>
  //   </div>
  // );

  // const EditableField = ({ label, field, value, readOnly = false }) => (
  //   <div className="flex flex-col">
  //     <span className="text-xs text-gray-500">{label}</span>

  //     {editing && !readOnly ? (
  //       <textarea
  //         value={value || ""}
  //         onChange={(e) => updateField(field, e.target.value)}
  //         className="border rounded-lg p-2 mt-1"
  //         rows={3}
  //       />
  //     ) : (
  //       <span className="font-medium">{value || "-"}</span>
  //     )}
  //   </div>
  // );
  // const EditableField = ({
  //   label,
  //   field,
  //   value,
  //   readOnly = false,
  //   multiline = true,
  // }) => (
  //   <div className="flex flex-col">
  //     <span className="text-xs text-gray-500">{label}</span>

  //     {editing && !readOnly ? (
  //       multiline ? (
  //         <textarea
  //           value={value || ""}
  //           onChange={(e) => updateField(field, e.target.value)}
  //           className="border rounded-lg p-2 mt-1"
  //           rows={3}
  //         />
  //       ) : (
  //         <input
  //           type="text"
  //           value={value || ""}
  //           onChange={(e) => updateField(field, e.target.value)}
  //           className="border rounded-lg p-2 mt-1"
  //         />
  //       )
  //     ) : (
  //       <span className="font-medium">{value || "-"}</span>
  //     )}
  //   </div>
  // );

  // const Section = ({ title, children }) => (
  //   <div className="bg-white rounded-xl p-6 shadow space-y-4">
  //     <h3 className="font-semibold text-[#0f5b54]">{title}</h3>
  //     {children}
  //   </div>
  // );

  const hasAssignedPrograms = programs.some((p) => p.status === "current");

  const hasPaidEnrollment = orders.some(
    (o) => o.payment_status === "paid" && o.status === "completed",
  );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-[#0f5b54]">Profile</h1>

      <button
        onClick={() => setEditing(!editing)}
        className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
      >
        {editing ? "Cancel" : "Edit Profile"}
      </button>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab ? "bg-[#0f5b54] text-white" : "bg-white border"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "profile" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={application?.fname} />

              <Field label="Last Name" value={application?.lname} />

              <Field label="Email" value={application?.email} />
              <EditableField
                label="Username"
                value={username}
                readOnly
                multiline={false}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Phone"
                field="phone"
                value={formData.phone}
              />

              <EditableField
                label="Address"
                field="address"
                value={formData.address}
                editing={editing}
                updateField={updateField}
              />
            </div>
          </Section>

          <Section title="Education">
            <div className="grid grid-cols-2 gap-4">
              <EditableField
                label="Grade"
                field="grade"
                value={formData.grade}
                multiline={false}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="GED"
                field="ged"
                value={formData.ged}
                multiline={false}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Training"
                field="training_courses"
                value={formData.training_courses}
                editing={editing}
                updateField={updateField}
              />
            </div>
          </Section>
        </div>
      )}

      {activeTab === "programs" && (
        <div className="space-y-6">
          {/* {!hasAssignedPrograms && hasPaidEnrollment && (
            <button
              onClick={() => setEditingPrograms(!editingPrograms)}
              className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
            >
              {editingPrograms ? "Cancel" : "Edit Programs"}
            </button>
          )}
           */}
          {hasPaidEnrollment && !hasAssignedPrograms && (
            <button
              onClick={() => setEditingPrograms(!editingPrograms)}
              className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
            >
              {editingPrograms ? "Cancel Program Editing" : "Edit Programs"}
            </button>
          )}
          {hasAssignedPrograms && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
              Programs have already been assigned. Please contact an
              administrator to make changes.
            </div>
          )}
          {/* {hasAssignedPrograms && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
              Programs have already been assigned. Please contact an
              administrator to make changes.
            </div>
          )} */}
          <Section title="Assigned Programs">
            {programs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No assigned programs.
              </div>
            ) : (
              <div className="grid gap-4">
                {programs.map((p) => (
                  <div
                    key={p.id}
                    className="
            bg-white
            border
            rounded-lg
            p-5
            flex
            items-center
            justify-between
            hover:shadow-md
            transition
          "
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-[#0f5b54]">
                        {p.programs?.course_title}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        {p.programs?.course_code}
                      </p>
                    </div>

                    <span
                      className={`
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
              ${
                p.status === "current"
                  ? "bg-green-100 text-green-700"
                  : p.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
              }
            `}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div className="mb-4 text-sm text-gray-600">
            Vocational Selected: {vocationalCount}/3
          </div>

          {editingPrograms && (
            <Section title="Edit Program Preferences">
              <div className="grid md:grid-cols-2 gap-4">
                {availablePrograms.map((program) => {
                  const selected = selectedPrograms.includes(program.id);

                  return (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() => toggleProgram(program)}
                      className={`border rounded-lg p-4 text-left ${
                        selected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      {/* <div className="flex justify-between items-center"> */}
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-semibold">
                          {program.course_title}
                        </h4>

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            program.category?.toLowerCase() === "vocational"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {program.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={savePrograms}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                  Save Program Preferences
                </button>
              </div>
            </Section>
          )}

          <Section title="Preferred Vocational Programs">
            {vocationalEnrollments.length === 0 ? (
              <p>No preferred programs found.</p>
            ) : (
              vocationalEnrollments.map((e) => (
                <div key={e.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{e.programs?.course_title}</h4>

                  <p className="text-sm text-gray-500">
                    {e.programs?.course_code}
                  </p>
                </div>
              ))
            )}
          </Section>
          <Section title="Preferred Non-Vocational Programs">
            {nonVocationalEnrollments.length === 0 ? (
              <p>No preferred programs found.</p>
            ) : (
              nonVocationalEnrollments.map((e) => (
                <div key={e.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{e.programs?.course_title}</h4>

                  <p className="text-sm text-gray-500">
                    {e.programs?.course_code}
                  </p>
                </div>
              ))
            )}
          </Section>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Section title="Skills & Experience">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Learning Styles</p>

                  <div className="flex flex-wrap gap-2">
                    {profile?.learning_styles?.length ? (
                      profile.learning_styles.map((style) => (
                        <span
                          key={style}
                          className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
                        >
                          {style}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        No learning styles recorded
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Technical Experience
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {profile?.exp_web && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        Web Development
                      </span>
                    )}

                    {profile?.exp_scratch && (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                        Scratch
                      </span>
                    )}

                    {profile?.exp_excel && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        Microsoft Excel
                      </span>
                    )}

                    {profile?.exp_testing && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                        Software Testing
                      </span>
                    )}

                    {profile?.exp_mobile && (
                      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                        Mobile Development
                      </span>
                    )}

                    {profile?.exp_python && (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                        Python
                      </span>
                    )}

                    {profile?.exp_ai && (
                      <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
                        Artificial Intelligence
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <EditableField
                    label="Desired Skills"
                    field="desired_skills"
                    value={formData.desired_skills}
                    editing={editing}
                    updateField={updateField}
                  />

                  <EditableField
                    label="Prior Jobs"
                    field="prior_jobs"
                    value={formData.prior_jobs}
                    editing={editing}
                    updateField={updateField}
                  />

                  <EditableField
                    label="Jobs Interested In"
                    field="jobs_interested"
                    value={formData.jobs_interested}
                    editing={editing}
                    updateField={updateField}
                  />

                  <EditableField
                    label="Hours Per Week"
                    field="hours_per_week"
                    value={formData.hours_per_week}
                    editing={editing}
                    updateField={updateField}
                  />
                </div>
              </div>
            </Section>

            <Section title="Goals & Aspirations">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#0f5b54] to-[#14746f] text-white rounded-xl p-5">
                  <h4 className="font-semibold text-lg">Dreams & Goals</h4>

                  <p className="mt-2">
                    {profile?.dreams_goals?.join(", ") || "-"}
                  </p>
                </div>

                <EditableField
                  label="Dream Job"
                  field="dream_job"
                  value={formData.dream_job}
                  editing={editing}
                  updateField={updateField}
                />

                <EditableField
                  label="Desired Growth Areas"
                  field="desired_growth_areas"
                  value={formData.desired_growth_areas}
                  editing={editing}
                  updateField={updateField}
                />

                <EditableField
                  label="Goals & Expectations"
                  field="goals_expectations"
                  value={formData.goals_expectations}
                  editing={editing}
                  updateField={updateField}
                />

                <EditableField
                  label="Why Interested in Inclusive World"
                  field="why_interested_iw"
                  value={formData.why_interested_iw}
                  editing={editing}
                  updateField={updateField}
                />
              </div>
            </Section>
          </div>

          <Section title="Personal Insights">
            <div className="grid md:grid-cols-2 gap-6">
              <EditableField
                label="Hopes & Dreams"
                field="hopes_dreams"
                value={formData.hopes_dreams}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Perfect Day"
                field="perfect_day"
                value={formData.perfect_day}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Important To Me"
                field="important_to"
                value={formData.important_to}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Important For Me"
                field="important_for"
                value={formData.important_for}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Favorite Food"
                field="favorite_food"
                value={formData.favorite_food}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Favorite Activities"
                field="activities"
                value={formData.activities}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Favorite Entertainment"
                field="entertainment"
                value={formData.entertainment}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Favorite Outings"
                field="favorite_outings"
                value={formData.favorite_outings}
                editing={editing}
                updateField={updateField}
              />
            </div>
          </Section>
        </div>
      )}

      {activeTab === "family" && (
        <Section title="Family & Emergency">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Parent 1"
              value={`${application?.p1_fname || ""} ${application?.p1_lname || ""}`}
            />

            <EditableField
              label="Parent 1 Email"
              field="p1_email"
              value={formData.p1_email}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Parent 1 Phone"
              field="p1_phone1"
              value={formData.p1_phone1}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Parent 2"
              value={`${application?.p2_fname || ""} ${application?.p2_lname || ""}`}
            />

            <EditableField
              label="Parent 2 Email"
              field="p2_email"
              value={formData.p2_email}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Parent 2 Phone"
              field="p2_phone1"
              value={formData.p2_phone1}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Emergency First Name"
              field="e_fname"
              value={formData.e_fname}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Emergency Last Name"
              field="e_lname"
              value={formData.e_lname}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Emergency Phone"
              field="e_phone1"
              value={formData.e_phone1}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />

            <EditableField
              label="Emergency Email"
              field="e_email"
              value={formData.e_email}
              multiline={false}
              editing={editing}
              updateField={updateField}
            />
          </div>
        </Section>
      )}

      {editing && activeTab !== "programs" && (
        <div className="flex justify-end">
          <button
            onClick={saveProfile}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* {activeTab === "system" && (
        <Section title="System Info">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Created At" value={person?.created_at} />
            <Field label="Updated At" value={person?.updated_at} />
            <Field label="Application Status" value={application?.status} />
            <Field label="Payment Status" value={application?.payment_status} />
          </div>
        </Section>
      )} */}
    </div>
  );
};

export default MemberProfile;
