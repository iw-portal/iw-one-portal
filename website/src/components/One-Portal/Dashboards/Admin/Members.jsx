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

const Members = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProgram, setEditingProgram] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [newStatus, setNewStatus] = useState("current");
  const [allPrograms, setAllPrograms] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data: peopleData, error: peopleError } = await supabase
        .from("people")
        .select("*")
        .eq("role", "member");

      const { data: enrollmentsData, error: enrollmentsError } =
        await supabase.from("enrollments").select(`
      *,
      programs (
        id,
        course_title,
        course_code
      )
    `);

      const { data: assignedProgramsData } = await supabase
        .from("person_programs")
        .select(
          `
      *,
      programs(
        id,
        course_title,
        course_code
      )
    `,
        )
        .eq("role", "member");

      const merged = (peopleData || []).map((person) => ({
        ...person,

        enrollments:
          enrollmentsData?.filter((e) => e.student_id === person.id) || [],

        assignedPrograms:
          assignedProgramsData?.filter((p) => p.person_id === person.id) || [],
      }));

      setMembers(merged);
    };

    fetchMembers();
    const fetchPrograms = async () => {
      const { data, error } = await supabase.from("programs").select(`
    id,
    course_title,
    course_code,
    member_capacity,
    volunteer_capacity,
    member_enrolled,
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

  const assignProgramFromPreference = async (enrollment) => {
    const programId = enrollment.program_id;

    const alreadyAssigned = selectedMember.assignedPrograms?.some(
      (p) => p.program_id === programId,
    );

    if (alreadyAssigned) {
      alert("This program is already assigned.");
      return;
    }

    if ((selectedMember.assignedPrograms?.length || 0) >= 3) {
      alert("A member can only be assigned up to 3 programs.");
      return;
    }

    const { error } = await supabase.from("person_programs").insert([
      {
        person_id: selectedMember.id,
        program_id: programId,
        status: "current",
        role: "member",
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
          member_enrolled: (selectedProgram.member_enrolled || 0) + 1,
        })
        .eq("id", programId);

      setAllPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? {
                ...p,
                member_enrolled: (p.member_enrolled || 0) + 1,
              }
            : p,
        ),
      );
    }

    await refreshAssignedPrograms();
  };

  // return (
  //   <div className="p-4 sm:p-6 w-full">
  //     {/* HEADER */}
  //     <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
  //       <h1 className="text-2xl sm:text-3xl font-bold">Members</h1>

  //       <input
  //         type="text"
  //         placeholder="Search by name, email, or ID..."
  //         value={search}
  //         onChange={(e) => setSearch(e.target.value)}
  //         className="border px-4 py-2 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-teal-600"
  //       />
  //     </div>

  //     {/* GRID */}
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  //       {members
  //         .filter((m) => {
  //           const term = search.toLowerCase();
  //           return (
  //             m.fname?.toLowerCase().includes(term) ||
  //             m.lname?.toLowerCase().includes(term) ||
  //             m.email?.toLowerCase().includes(term) ||
  //             m.client_id?.toString().includes(term)
  //           );
  //         })
  //         .map((m) => {
  //           const program = m.member_programs?.[0];

  //           return (
  //             <div
  //               key={m.id}
  //               className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-5 flex flex-col"
  //             >
  //               {/* NAME + STATUS */}
  //               <div className="flex justify-between items-center mb-3">
  //                 <h2 className="text-lg font-semibold text-gray-800">
  //                   {m.fname} {m.lname}
  //                 </h2>

  //                 <span
  //                   className={`px-3 py-1 rounded-full text-xs font-medium ${
  //                     program?.status === "current"
  //                       ? "bg-green-100 text-green-700"
  //                       : "bg-red-100 text-red-600"
  //                   }`}
  //                 >
  //                   {program?.status || "Unknown"}
  //                 </span>
  //               </div>

  //               {/* PROGRAM */}
  //               <p className="text-sm text-gray-500 mb-3">
  //                 {program?.program_name || "No Program Assigned"}
  //               </p>

  //               {/* QUICK INFO */}
  //               <div className="flex flex-wrap gap-2 mb-4">
  //                 <span className="bg-gray-100 px-2 py-1 rounded text-xs">
  //                   Age: {m.age}
  //                 </span>
  //                 <span className="bg-gray-100 px-2 py-1 rounded text-xs">
  //                   Grade: {m.grade}
  //                 </span>
  //                 <span className="bg-gray-100 px-2 py-1 rounded text-xs">
  //                   ID: {m.client_id}
  //                 </span>
  //               </div>

  //               {/* CONTACT */}
  //               <div className="text-sm text-gray-500 space-y-1 mb-4">
  //                 <p>{m.email}</p>
  //                 <p>{m.phone}</p>
  //               </div>

  //               {/* BUTTON */}
  //               <button
  //                 onClick={() => setSelectedMember(m)}
  //                 className="mt-auto bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700 transition"
  //               >
  //                 View Profile
  //               </button>
  //             </div>
  //           );
  //         })}
  //     </div>

  //     {editingProgram && (
  //       <div className="mt-4 bg-white border rounded-xl p-4">
  //         <h4 className="font-medium mb-3">Update Program</h4>

  //         <input
  //           className="border p-2 rounded w-full mb-3"
  //           value={newProgramName}
  //           onChange={(e) => setNewProgramName(e.target.value)}
  //           placeholder="Program Name"
  //         />

  //         <select
  //           className="border p-2 rounded w-full mb-3"
  //           value={newStatus}
  //           onChange={(e) => setNewStatus(e.target.value)}
  //         >
  //           <option value="current">Current</option>
  //           <option value="completed">Completed</option>
  //           <option value="dropped">Dropped</option>
  //         </select>

  //         <div className="flex justify-end gap-2">
  //           <button
  //             onClick={() => setEditingProgram(null)}
  //             className="px-3 py-2 border rounded"
  //           >
  //             Cancel
  //           </button>

  //           <button
  //             onClick={async () => {
  //               const { error } = await supabase
  //                 .from("member_programs")
  //                 .update({
  //                   program_name: newProgramName,
  //                   status: newStatus,
  //                 })
  //                 .eq("id", editingProgram.id);

  //               if (error) {
  //                 alert("Update failed");
  //               } else {
  //                 alert("Updated!");
  //                 setEditingProgram(null);
  //                 setSelectedMember(null);
  //                 // refetch
  //                 const { data } = await supabase
  //                   .from("members")
  //                   .select(`*, member_programs(*)`);
  //                 setMembers(data);
  //               }
  //             }}
  //             className="bg-teal-800 text-white px-3 py-2 rounded"
  //           >
  //             Save
  //           </button>
  //         </div>
  //       </div>
  //     )}

  //     {/* MODAL */}
  //     {selectedMember && (
  //       <div
  //         className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
  //         onClick={() => setSelectedMember(null)}
  //       >
  //         <div
  //           className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg relative max-h-[85vh] overflow-y-auto"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           {/* CLOSE */}
  //           <button
  //             onClick={() => setSelectedMember(null)}
  //             className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
  //           >
  //             ✕
  //           </button>

  //           {/* HEADER */}
  //           <h2 className="text-2xl font-bold mb-4">
  //             {selectedMember.fname} {selectedMember.lname}
  //           </h2>

  //           {/* INFO GRID */}
  //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  //             <div className="bg-gray-50 p-4 rounded-xl">
  //               <h3 className="font-semibold mb-2">Basic Info</h3>
  //               <p>Age: {selectedMember.age}</p>
  //               <p>Grade: {selectedMember.grade}</p>
  //               <p>ID: {selectedMember.client_id}</p>
  //               <p>DOB: {selectedMember.dob || "N/A"}</p>
  //             </div>

  //             <div className="bg-gray-50 p-4 rounded-xl">
  //               <h3 className="font-semibold mb-2">Contact</h3>
  //               <p>{selectedMember.email}</p>
  //               <p>{selectedMember.phone}</p>
  //               <p>{selectedMember.mailaddr || "N/A"}</p>
  //             </div>
  //           </div>

  //           {/* PROGRAMS */}
  //           <div className="mb-6">
  //             {/* Header */}
  //             <div className="flex justify-between items-center mb-3">
  //               <h3 className="font-semibold text-gray-800">Programs</h3>
  //             </div>

  //             {/* Content */}
  //             <div className="bg-gray-50 p-4 rounded-xl space-y-3">
  //               {selectedMember.member_programs?.length > 0 ? (
  //                 selectedMember.member_programs.map((p) => (
  //                   <div
  //                     key={p.id}
  //                     className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100"
  //                   >
  //                     {/* LEFT: Program Info */}
  //                     <div>
  //                       <p className="text-sm font-medium text-gray-800">
  //                         {p.program_name}
  //                       </p>

  //                       <span
  //                         className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
  //                           p.status === "current"
  //                             ? "bg-green-100 text-green-700"
  //                             : p.status === "completed"
  //                               ? "bg-blue-100 text-blue-700"
  //                               : "bg-red-100 text-red-600"
  //                         }`}
  //                       >
  //                         {p.status}
  //                       </span>
  //                     </div>

  //                     {/* RIGHT: Edit Button */}
  //                     <button
  //                       title="Edit Program"
  //                       onClick={() => {
  //                         setEditingProgram(p);
  //                         setNewStatus(p.status);
  //                         setNewProgramName(p.program_name);
  //                       }}
  //                       className="p-2 rounded-lg hover:bg-gray-100 transition"
  //                     >
  //                       <Pencil className="w-4 h-4 text-gray-500 hover:text-teal-700 transition" />
  //                     </button>
  //                   </div>
  //                 ))
  //               ) : (
  //                 <p className="text-sm text-gray-400">No program data</p>
  //               )}
  //             </div>
  //           </div>

  //           {/* PARENT */}
  //           <div className="mb-6">
  //             <h3 className="font-semibold mb-2">Parent</h3>
  //             <div className="bg-gray-50 p-4 rounded-xl text-sm">
  //               <p>
  //                 {selectedMember.parent1_fname} {selectedMember.parent1_lname}
  //               </p>
  //               <p>{selectedMember.parent1_relationship}</p>
  //               <p>{selectedMember.parent1_phone1}</p>
  //               <p>{selectedMember.parent1_email}</p>
  //             </div>
  //           </div>

  //           {/* SKILLS */}
  //           <div>
  //             <h3 className="font-semibold mb-2">Skills</h3>
  //             <div className="grid grid-cols-2 gap-2">
  //               {[
  //                 ["Python", selectedMember.experience_python],
  //                 ["Web Dev", selectedMember.experience_web_dev],
  //                 ["Mobile App", selectedMember.experience_mobile_app],
  //                 ["AI", selectedMember.experience_ai],
  //               ].map(([label, val]) => (
  //                 <span
  //                   key={label}
  //                   className={`px-3 py-1 rounded-full text-xs ${
  //                     val
  //                       ? "bg-green-100 text-green-700"
  //                       : "bg-gray-100 text-gray-400"
  //                   }`}
  //                 >
  //                   {label}
  //                 </span>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  const refreshAssignedPrograms = async () => {
    const { data: enrollmentsData } = await supabase
      .from("enrollments")
      .select(
        `
      *,
      programs (
        id,
        course_title,
        course_code
      )
    `,
      )
      .eq("student_id", selectedMember.id);

    const { data: assignedProgramsData } = await supabase
      .from("person_programs")
      .select(
        `
      *,
      programs (
        id,
        course_title,
        course_code
      )
    `,
      )
      .eq("person_id", selectedMember.id)
      .eq("role", "member");

    setSelectedMember((prev) => ({
      ...prev,
      enrollments: enrollmentsData || [],
      assignedPrograms: assignedProgramsData || [],
    }));

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              assignedPrograms: assignedProgramsData || [],
            }
          : m,
      ),
    );
  };

  const removeProgram = async (personProgramId, programId) => {
    // Get current program
    const program = allPrograms.find((p) => p.id === programId);

    // Delete enrollment
    const { error } = await supabase
      .from("person_programs")
      .delete()
      .eq("id", personProgramId);

    if (error) {
      console.error(error);
      return alert("Failed to remove program");
    }

    // Decrement enrolled count
    await supabase
      .from("programs")
      .update({
        member_enrolled: Math.max(0, (program.member_enrolled || 0) - 1),
      })
      .eq("id", programId);

    // Refresh modal data
    await refreshAssignedPrograms();

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              assignedPrograms:
                selectedMember.assignedPrograms?.filter(
                  (p) => p.id !== personProgramId,
                ) || [],
            }
          : m,
      ),
    );

    // setSelectedMember((prev) => ({
    //   ...prev,
    //   enrollments: enrollmentsData || [],
    // }));

    // Refresh program capacities
    const { data: refreshedPrograms } = await supabase.from("programs").select(`
      id,
      course_title,
      course_code,
      member_capacity,
      volunteer_capacity,
      member_enrolled,
      volunteer_enrolled
    `);

    setAllPrograms(refreshedPrograms || []);
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold">Members</h1>

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
            const programs = m.enrollments || [];

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
                  <Field label="First Name" value={selectedMember.fname} />
                  <Field label="Last Name" value={selectedMember.lname} />
                  <Field label="Email" value={selectedMember.email} />
                  <Field label="Phone" value={selectedMember.phone} />
                  <Field label="Address" value={selectedMember.address} />
                  <Field label="Date of Birth" value={selectedMember.dob} />
                  <Field label="Age" value={selectedMember.age} />
                  <Field label="Grade" value={selectedMember.grade} />
                  <Field label="Client ID" value={selectedMember.client_id} />
                  <Field label="Role" value={selectedMember.role} />
                  <Field label="Active" value={selectedMember.is_active} />
                  <Field
                    label="Profile Type"
                    value={selectedMember.profile_type}
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

              <Section title="System Details">
                <Grid>
                  <Field label="Created At" value={selectedMember.created_at} />
                  <Field label="Updated At" value={selectedMember.updated_at} />
                  <Field label="Archived" value={selectedMember.is_archived} />
                  <Field
                    label="Payment Plan"
                    value={selectedMember.payment_plan}
                  />
                  <Field
                    label="Payment Date"
                    value={selectedMember.payment_date}
                  />
                  <Field label="New to IW" value={selectedMember.new_to_iw} />
                  <Field label="Terms Accepted" value={selectedMember.terms} />
                  <Field label="Submitted" value={selectedMember.submit} />
                </Grid>
              </Section>
            </div>

            {/* PROGRAMS */}
            {/* <div className="space-y-3">
              {selectedMember.enrollments?.length > 0 ? (
                selectedMember.enrollments.map((e) => (
                  <div
                    key={e.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {e.programs?.course_title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {e.programs?.course_code}
                      </p>

                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                          e.enrollment_status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {e.enrollment_status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No programs assigned</p>
              )}
            </div> */}

            <Section title="Program Preferences Submitted During Enrollment">
              {selectedMember.enrollments?.length > 0 ? (
                <div className="space-y-3">
                  {selectedMember.enrollments
                    .sort(
                      (a, b) => new Date(a.created_at) - new Date(b.created_at),
                    )
                    .map((e, index) => (
                      <div
                        key={e.id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {e.programs?.course_title}
                          </p>

                          <p className="text-xs text-gray-500">
                            {e.programs?.course_code}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-[#0f5b54] text-white px-3 py-1 rounded-full text-xs">
                            Choice #{index + 1}
                          </span>

                          {selectedMember.is_active && (
                            <button
                              onClick={() => assignProgramFromPreference(e)}
                              className="bg-teal-700 text-white px-3 py-1 rounded text-xs hover:bg-teal-800"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No program preferences submitted
                </p>
              )}
            </Section>

            <br />

            <Section title="Assigned Programs">
              {selectedMember.assignedPrograms?.length > 0 ? (
                <div className="space-y-3">
                  {selectedMember.assignedPrograms.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">
                          {p.programs?.course_title}
                        </p>

                        <p className="text-xs text-gray-500">
                          {p.programs?.course_code}
                        </p>

                        <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          {p.status}
                        </span>
                      </div>

                      <button
                        onClick={() => removeProgram(p.id, p.program_id)}
                        className="text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No assigned programs</p>
              )}
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
                        !selectedMember.assignedPrograms?.some(
                          (p) => p.program_id === prog.id,
                        ),
                    )
                    .map((p) => (
                      // <option key={p.id} value={p.id}>
                      //   {p.course_title} ({p.course_code})
                      // </option>
                      <option key={p.id} value={p.id}>
                        {p.course_title} ({p.course_code}) •
                        {(p.member_capacity || 0) - (p.member_enrolled || 0)}{" "}
                        remaining
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

                    const currentPrograms = selectedMember.enrollments || [];

                    // 🚫 BLOCK if already 3
                    if (selectedMember.assignedPrograms?.length >= 3) {
                      alert("A member can only be assigned up to 3 programs.");
                      return;
                    }

                    // 🚫 BLOCK duplicate program
                    const alreadyExists = selectedMember.assignedPrograms?.some(
                      (p) => p.program_id === selectedProgramId,
                    );

                    if (alreadyExists) {
                      alert("This program is already assigned.");
                      return;
                    }

                    const selectedProgram = allPrograms.find(
                      (p) => p.id === selectedProgramId,
                    );

                    // const { count: currentMembers } = await supabase
                    //   .from("person_programs")
                    //   .select("*", {
                    //     count: "exact",
                    //     head: true,
                    //   })
                    //   .eq("program_id", selectedProgramId)
                    //   .eq("role", "member");

                    const remainingSeats =
                      (selectedProgram.member_capacity || 0) -
                      (selectedProgram.member_enrolled || 0);

                    if (remainingSeats <= 0) {
                      const override = window.confirm(
                        `${selectedProgram.course_title} is already full.\n\n` +
                          `Capacity: ${selectedProgram.member_capacity}\n` +
                          `Assigned: ${selectedProgram.member_enrolled || 0}\n\n` +
                          `Press OK to override and continue.`,
                      );

                      if (!override) return;
                    }

                    const { error } = await supabase
                      .from("person_programs")
                      .insert([
                        {
                          person_id: selectedMember.id,
                          program_id: selectedProgramId,
                          status: "current",
                          role: "member",
                        },
                      ]);

                    if (!error) {
                      await supabase
                        .from("programs")
                        .update({
                          member_enrolled:
                            (selectedProgram.member_enrolled || 0) + 1,
                        })
                        .eq("id", selectedProgramId);
                    }
                    setAllPrograms((prev) =>
                      prev.map((p) =>
                        p.id === selectedProgramId
                          ? {
                              ...p,
                              member_enrolled: (p.member_enrolled || 0) + 1,
                            }
                          : p,
                      ),
                    );

                    if (error) {
                      console.error(error);
                      alert("Failed to add program");
                      return;
                    }

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

export default Members;
