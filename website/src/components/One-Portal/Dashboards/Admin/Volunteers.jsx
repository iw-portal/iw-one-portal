import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { Pencil } from "lucide-react";

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-5">
    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">
      {value === null || value === undefined || value === ""
        ? "-"
        : typeof value === "boolean"
          ? value
            ? "Yes"
            : "No"
          : value}
    </p>
  </div>
);

const Volunteers = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProgram, setEditingProgram] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [newStatus, setNewStatus] = useState("current");
  const [allPrograms, setAllPrograms] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Volunteers
        const { data: peopleData, error: peopleError } = await supabase
          .from("people")
          .select(
            `
        *,
        person_programs (
          id,
          status,
          program_id,
          programs (
            id,
            course_title,
            course_code
          )
        )
      `,
          )
          .eq("role", "volunteer");

        if (peopleError) throw peopleError;

        // Volunteer applications
        const { data: applications, error: applicationsError } = await supabase
          .from("volunteer_applications")
          .select("*");

        if (applicationsError) throw applicationsError;

        // Merge by email
        const merged = (peopleData || []).map((person) => ({
          ...person,
          volunteerApplication: applications?.find(
            (a) => a.email?.toLowerCase() === person.email?.toLowerCase(),
          ),
        }));

        setMembers(merged);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMembers();
    const fetchPrograms = async () => {
      const { data, error } = await supabase.from("programs").select(`
                              id,
                              course_title,
                              course_code,
                              volunteer_enrolled
                            `);

      if (!error) setAllPrograms(data);
      else console.error(error);
    };

    fetchPrograms();
  }, []);

  const val = (v) => {
    if (v === null || v === undefined || v === "") return "-";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return v;
  };

  const Field = ({ label, value }) => (
    <p>
      <strong>{label}:</strong> {val(value)}
    </p>
  );

  const assignProgramFromPreference = async (programId) => {
    const currentPrograms = selectedMember.person_programs || [];

    if (currentPrograms.length >= 3) {
      alert("A volunteer can only be assigned up to 3 programs.");
      return;
    }

    const alreadyExists = currentPrograms.some(
      (p) => p.program_id === programId,
    );

    if (alreadyExists) {
      alert("This program is already assigned.");
      return;
    }

    const { error } = await supabase.from("person_programs").insert([
      {
        person_id: selectedMember.id,
        program_id: programId,
        status: "current",
        role: "volunteer",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to assign program");
      return;
    }

    const selectedProgram = allPrograms.find((p) => p.id === programId);

    if (selectedProgram) {
      await supabase
        .from("programs")
        .update({
          volunteer_enrolled: (selectedProgram.volunteer_enrolled || 0) + 1,
        })
        .eq("id", programId);
    }

    await refreshAssignedPrograms();
  };

  const refreshAssignedPrograms = async () => {
    const { data } = await supabase
      .from("people")
      .select(
        `
      *,
      person_programs (
        id,
        status,
        program_id,
        programs (
          id,
          course_title,
          course_code
        )
      )
    `,
      )
      .eq("id", selectedMember.id)
      .single();

    // setSelectedMember(data);
    setSelectedMember((prev) => ({
      ...prev,
      ...data,
    }));

    setMembers((prev) =>
      prev.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              ...data,
            }
          : member,
      ),
    );
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold">Volunteers</h1>

        <input
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members
          .filter((m) => {
            const term = search.toLowerCase();
            return (
              m.fname?.toLowerCase().includes(term) ||
              m.lname?.toLowerCase().includes(term) ||
              m.email?.toLowerCase().includes(term)
            );
          })
          .map((m) => {
            const programs = m.person_programs || [];

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border p-5 flex flex-col"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {m.fname
                      ? m.fname.charAt(0).toUpperCase() + m.fname.slice(1)
                      : ""}{" "}
                    {m.lname
                      ? m.lname.charAt(0).toUpperCase() + m.lname.slice(1)
                      : ""}
                  </h2>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      const { error } = await supabase
                        .from("people")
                        .update({ is_active: !m.is_active })
                        .eq("id", m.id);

                      if (!error) {
                        setMembers((prev) =>
                          prev.map((x) =>
                            x.id === m.id
                              ? { ...x, is_active: !x.is_active }
                              : x,
                          ),
                        );
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs ${
                      m.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {m.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* PROGRAM */}
                <p className="text-sm text-gray-500 mb-3">
                  {programs.length > 0
                    ? programs
                        .map((program) => program.programs?.course_title)
                        .filter(Boolean)
                        .join(", ")
                    : "No Program Assigned"}
                </p>

                {/* CONTACT */}
                <div className="text-sm text-gray-500 mb-4">
                  <p>{m.email}</p>
                  <p>{m.phone}</p>
                </div>

                <button
                  onClick={() => setSelectedMember(m)}
                  className="mt-auto bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700"
                >
                  View Profile
                </button>
              </div>
            );
          })}
      </div>

      {/* MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            {/* HEADER */}
            <h2 className="text-2xl font-bold mb-4">
              {selectedMember.fname.charAt(0).toUpperCase()}
              {selectedMember.fname.slice(1)}{" "}
              {selectedMember.lname.charAt(0).toUpperCase()}
              {selectedMember.lname.slice(1)}
            </h2>

            {/* BASIC */}
            {/* <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p>
                  <span className="font-bold">Age:</span> {selectedMember.age}
                </p>
                <p>
                  <span className="font-bold">Email:</span>{" "}
                  {selectedMember.email}
                </p>
                <p>
                  <span className="font-bold">Phone:</span>{" "}
                  {selectedMember.phone}
                </p>
              </div>
            </div> */}
            <div className="space-y-6 mb-6">
              <Section title="Basic Information">
                <Grid>
                  <Field
                    label="First Name"
                    value={
                      selectedMember?.fname
                        ? selectedMember.fname.charAt(0).toUpperCase() +
                          selectedMember.fname.slice(1)
                        : "-"
                    }
                  />
                  <Field
                    label="Last Name"
                    value={
                      selectedMember?.lname
                        ? selectedMember.lname.charAt(0).toUpperCase() +
                          selectedMember.lname.slice(1)
                        : "-"
                    }
                  />
                  <Field label="Email" value={selectedMember.email} />
                  <Field label="Phone" value={selectedMember.phone} />
                  <Field label="Address" value={selectedMember.address} />
                  <Field label="Date of Birth" value={selectedMember.dob} />
                  <Field label="Age" value={selectedMember.age} />
                  <Field label="Grade" value={selectedMember.grade} />
                  <Field label="Client ID" value={selectedMember.client_id} />
                  <Field
                    label="Role"
                    value={
                      selectedMember?.role
                        ? selectedMember.role.charAt(0).toUpperCase() +
                          selectedMember.role.slice(1)
                        : "-"
                    }
                  />
                  <Field label="Active" value={selectedMember.is_active} />
                  <Field
                    label="Profile Type"
                    value={
                      selectedMember?.profile_type
                        ? selectedMember.profile_type.charAt(0).toUpperCase() +
                          selectedMember.profile_type.slice(1)
                        : "-"
                    }
                  />
                </Grid>
              </Section>

              <Section title="Education & Background">
                <Grid>
                  <Field
                    label="GED / High School"
                    value={selectedMember.ged_high_school_diploma}
                  />
                  <Field
                    label="Training Courses"
                    value={selectedMember.training_courses}
                  />
                  <Field
                    label="Years Associated"
                    value={selectedMember.years_associated}
                  />
                  <Field
                    label="Hear About Us"
                    value={selectedMember.hear_about_us}
                  />
                </Grid>
              </Section>

              <Section title="Work & Experience">
                <Grid>
                  <Field
                    label="Prior Work Experience"
                    value={selectedMember.prior_work_experience}
                  />
                  <Field
                    label="Work Description"
                    value={selectedMember.describe_prior_work}
                  />
                  <Field
                    label="Placement Experience"
                    value={selectedMember.placement_experience}
                  />
                  <Field
                    label="Available Work Areas"
                    value={selectedMember.available_to_work_on}
                  />
                  <Field
                    label="Hours Per Week"
                    value={selectedMember.hours_per_week_working}
                  />
                  <Field label="Dream Job" value={selectedMember.dream_job} />
                  <Field
                    label="Transportation"
                    value={selectedMember.reliable_transportation}
                  />
                </Grid>
              </Section>

              <Section title="Technical Skills">
                <Grid>
                  <Field
                    label="Web Development"
                    value={selectedMember.experience_web_dev}
                  />
                  <Field
                    label="Scratch"
                    value={selectedMember.experience_scratch}
                  />
                  <Field
                    label="Excel"
                    value={selectedMember.experience_excel}
                  />
                  <Field
                    label="Software Testing"
                    value={selectedMember.experience_software_testing}
                  />
                  <Field
                    label="Mobile Apps"
                    value={selectedMember.experience_mobile_app}
                  />
                  <Field
                    label="Python"
                    value={selectedMember.experience_python}
                  />
                  <Field label="AI" value={selectedMember.experience_ai} />
                </Grid>
              </Section>

              <Section title="Program History">
                <div className="space-y-3">
                  <Field
                    label="Previous Programs"
                    value={selectedMember.prev_enrolled_programs}
                  />
                  <Field
                    label="Current Programs"
                    value={selectedMember.curr_enrolled_programs}
                  />
                  <Field
                    label="Previous Clients"
                    value={selectedMember.prev_clients}
                  />
                  <Field
                    label="Services Used"
                    value={selectedMember.iw_services}
                  />
                </div>
              </Section>

              <Section title="Engagement & Preferences">
                <div className="space-y-3">
                  <Field
                    label="Volunteer Experience"
                    value={selectedMember.vol_experience}
                  />
                  <Field
                    label="Interested Roles"
                    value={selectedMember.which_jobs}
                  />
                  <Field
                    label="Learning Style"
                    value={selectedMember.how_learn}
                  />
                  <Field
                    label="Commitments"
                    value={selectedMember.commitments}
                  />
                  <Field
                    label="Expectations"
                    value={selectedMember.expectations}
                  />
                  <Field label="Ranking" value={selectedMember.ranking} />
                  <Field
                    label="Skills Ranking"
                    value={selectedMember.skillsdev_ranking}
                  />
                </div>
              </Section>

              <Section title="Parent / Guardian 1">
                <Grid>
                  <Field
                    label="First Name"
                    value={selectedMember.parent1_fname}
                  />
                  <Field
                    label="Last Name"
                    value={selectedMember.parent1_lname}
                  />
                  <Field
                    label="Relationship"
                    value={selectedMember.parent1_relationship}
                  />
                  <Field
                    label="Phone 1"
                    value={selectedMember.parent1_phone1}
                  />
                  <Field
                    label="Phone 2"
                    value={selectedMember.parent1_phone2}
                  />
                  <Field label="Email" value={selectedMember.parent1_email} />
                  <Field
                    label="Employer"
                    value={selectedMember.parent1_employer}
                  />
                </Grid>
              </Section>

              <Section title="Parent / Guardian 2">
                <Grid>
                  <Field
                    label="First Name"
                    value={selectedMember.parent2_fname}
                  />
                  <Field
                    label="Last Name"
                    value={selectedMember.parent2_lname}
                  />
                  <Field
                    label="Relationship"
                    value={selectedMember.parent2_relationship}
                  />
                  <Field
                    label="Phone 1"
                    value={selectedMember.parent2_phone1}
                  />
                  <Field
                    label="Phone 2"
                    value={selectedMember.parent2_phone2}
                  />
                  <Field label="Email" value={selectedMember.parent2_email} />
                  <Field
                    label="Employer"
                    value={selectedMember.parent2_employer}
                  />
                </Grid>
              </Section>

              <Section title="Emergency Contact">
                <Grid>
                  <Field
                    label="First Name"
                    value={selectedMember.emergency_fname}
                  />
                  <Field
                    label="Last Name"
                    value={selectedMember.emergency_lname}
                  />
                  <Field
                    label="Relationship"
                    value={selectedMember.emergency_relationship}
                  />
                  <Field
                    label="Phone 1"
                    value={selectedMember.emergency_phone1}
                  />
                  <Field
                    label="Phone 2"
                    value={selectedMember.emergency_phone2}
                  />
                  <Field label="Email" value={selectedMember.emergency_email} />
                </Grid>
              </Section>
            </div>

            <Section title="Volunteer Program Preferences">
              {selectedMember?.volunteerApplication?.selected_programs ? (
                <div className="space-y-3">
                  {Object.entries(
                    selectedMember.volunteerApplication.selected_programs,
                  )
                    .filter(
                      ([key, value]) =>
                        typeof value === "number" && key.includes("-"),
                    )
                    .sort((a, b) => a[1] - b[1])
                    .map(([programId, rank]) => {
                      const program = allPrograms.find(
                        (p) => p.id === programId,
                      );

                      return (
                        <div
                          key={programId}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                        >
                          <span>
                            {program?.course_title || "Unknown Program"}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className="bg-[#0f5b54] text-white px-2 py-1 rounded-full text-xs">
                              Rank #{rank}
                            </span>

                            {selectedMember.is_active && (
                              <button
                                onClick={() =>
                                  assignProgramFromPreference(programId)
                                }
                                className="bg-teal-700 text-white px-3 py-1 rounded text-xs hover:bg-teal-800"
                              >
                                Assign
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-400">No preferences submitted</p>
              )}
            </Section>

            <br />

            {/* PROGRAMS */}
            <div className="mb-6">
              <Section title="Assigned Programs">
                <div className="space-y-3">
                  {selectedMember.person_programs?.length > 0 ? (
                    selectedMember.person_programs.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                      >
                        {/* LEFT */}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {p.programs?.course_title}
                          </p>

                          <p className="text-xs text-gray-500">
                            {p.programs?.course_code}
                          </p>

                          <span
                            className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                              p.status === "current"
                                ? "bg-green-100 text-green-700"
                                : p.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        {/* RIGHT */}
                        {/* RIGHT */}
                        {selectedMember.is_active && (
                          <button
                            onClick={async () => {
                              const confirmed = window.confirm(
                                `Remove ${p.programs?.course_title} from this volunteer?`,
                              );

                              if (!confirmed) return;

                              const selectedProgram = allPrograms.find(
                                (prog) => prog.id === p.program_id,
                              );

                              const { error } = await supabase
                                .from("person_programs")
                                .delete()
                                .eq("id", p.id);

                              if (error) {
                                console.error(error);
                                alert("Failed to remove program");
                                return;
                              }

                              await supabase
                                .from("programs")
                                .update({
                                  volunteer_enrolled: Math.max(
                                    0,
                                    (selectedProgram.volunteer_enrolled || 0) -
                                      1,
                                  ),
                                })
                                .eq("id", p.program_id);

                              // Refresh selected member
                              await refreshAssignedPrograms();
                            }}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      No programs assigned
                    </p>
                  )}
                </div>
              </Section>

              {/* ADD PROGRAM */}
              {selectedMember.is_active && (
                <div className="mt-4 flex gap-2">
                  <select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Program</option>
                    {/* {allPrograms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.course_title} ({p.course_code})
                      </option>
                    ))} */}
                    {allPrograms
                      .filter(
                        (prog) =>
                          !selectedMember.person_programs?.some(
                            (p) => p.program_id === prog.id,
                          ),
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.course_title} ({p.course_code})
                        </option>
                      ))}
                  </select>

                  <button
                    // onClick={async () => {
                    //   if (!selectedProgramId) return;

                    //   await supabase.from("person_programs").insert([
                    //     {
                    //       person_id: selectedMember.id,
                    //       program_id: selectedProgramId,
                    //       status: "current",
                    //     },
                    //   ]);

                    //   setSelectedMember(null);
                    // }}
                    onClick={async () => {
                      if (!selectedProgramId) return;

                      const currentPrograms =
                        selectedMember.person_programs || [];

                      // 🚫 BLOCK if already 3
                      if (currentPrograms.length >= 3) {
                        alert(
                          "A volunteer can only be assigned up to 3 programs.",
                        );
                        return;
                      }

                      // 🚫 BLOCK duplicate program
                      const alreadyExists = currentPrograms.some(
                        (p) => p.program_id === selectedProgramId,
                      );

                      if (alreadyExists) {
                        alert("This program is already assigned.");
                        return;
                      }

                      const selectedProgram = allPrograms.find(
                        (p) => p.id === selectedProgramId,
                      );

                      const { error } = await supabase
                        .from("person_programs")
                        .insert([
                          {
                            person_id: selectedMember.id,
                            program_id: selectedProgramId,
                            status: "current",
                            role: "volunteer",
                          },
                        ]);

                      if (error) {
                        console.error(error);
                        alert("Failed to add program");
                        return;
                      }

                      await supabase
                        .from("programs")
                        .update({
                          volunteer_enrolled:
                            (selectedProgram.volunteer_enrolled || 0) + 1,
                        })
                        .eq("id", selectedProgramId);

                      // ✅ Refresh member instead of closing modal blindly
                      await refreshAssignedPrograms();
                      setSelectedProgramId("");
                    }}
                    className="bg-teal-800 text-white px-3 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROGRAM */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="mb-4 font-semibold">Update Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="current">Current</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingProgram(null)}>Cancel</button>

              <button
                onClick={async () => {
                  await supabase
                    .from("person_programs")
                    .update({ status: newStatus })
                    .eq("id", editingProgram.id);

                  setEditingProgram(null);
                  setSelectedMember(null);
                }}
                className="bg-teal-800 text-white px-3 py-2 rounded"
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

export default Volunteers;
