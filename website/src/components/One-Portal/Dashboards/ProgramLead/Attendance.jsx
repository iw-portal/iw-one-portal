// import { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabase";

// export default function Attendance({ user }) {
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState("");

//   const [attendanceDate, setAttendanceDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );

//   const [students, setStudents] = useState([]);

//   const [saving, setSaving] = useState(false);

//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (user?.person_id) {
//       loadPrograms();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (selectedProgram) {
//       loadRoster();
//       loadHistory();
//     }
//   }, [selectedProgram, attendanceDate]);

//   const loadPrograms = async () => {
//     const { data } = await supabase
//       .from("programs")
//       .select("*")
//       .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
//       .order("course_title");

//     setPrograms(data || []);

//     if (data?.length) {
//       setSelectedProgram(data[0].id);
//     }
//   };

//   const loadRoster = async () => {
//     const { data } = await supabase
//       .from("enrollments")
//       .select(
//         `
//         id,
//         student_id,
//         people:student_id(
//           id,
//           fname,
//           lname,
//           email
//         )
//       `,
//       )
//       .eq("program_id", selectedProgram);

//     const { data: existingAttendance } = await supabase
//       .from("attendance")
//       .select("*")
//       .eq("program_id", selectedProgram)
//       .eq("attendance_date", attendanceDate);

//     const attendanceMap = {};

//     existingAttendance?.forEach((a) => {
//       attendanceMap[a.student_id] = a;
//     });

//     const roster =
//       data?.map((student) => ({
//         ...student,
//         status:
//           attendanceMap[student.student_id]?.attendance_status || "present",
//       })) || [];

//     setStudents(roster);
//   };

//   const loadHistory = async () => {
//     const { data } = await supabase
//       .from("attendance")
//       .select("*")
//       .eq("program_id", selectedProgram)
//       .order("attendance_date", {
//         ascending: false,
//       });

//     setHistory(data || []);
//   };

//   const updateStatus = (studentId, status) => {
//     setStudents((prev) =>
//       prev.map((s) => (s.student_id === studentId ? { ...s, status } : s)),
//     );
//   };

//   const bulkUpdate = (status) => {
//     setStudents((prev) =>
//       prev.map((s) => ({
//         ...s,
//         status,
//       })),
//     );
//   };

//   const saveAttendance = async () => {
//     try {
//       setSaving(true);

//       for (const student of students) {
//         const { data: existing } = await supabase
//           .from("attendance")
//           .select("id")
//           .eq("student_id", student.student_id)
//           .eq("program_id", selectedProgram)
//           .eq("attendance_date", attendanceDate)
//           .maybeSingle();

//         if (existing) {
//           await supabase
//             .from("attendance")
//             .update({
//               attendance_status: student.status,
//               marked_by: user.person_id,
//               updated_at: new Date(),
//             })
//             .eq("id", existing.id);
//         } else {
//           await supabase.from("attendance").insert({
//             enrollment_id: student.id,
//             student_id: student.student_id,
//             program_id: selectedProgram,
//             attendance_date: attendanceDate,
//             attendance_status: student.status,
//             marked_by: user.person_id,
//           });
//         }
//       }

//       alert("Attendance saved successfully");

//       loadHistory();
//     } finally {
//       setSaving(false);
//     }
//   };

//   const summary = {
//     present: students.filter((s) => s.status === "present").length,

//     absent: students.filter((s) => s.status === "absent").length,

//     excused: students.filter((s) => s.status === "excused").length,

//     holiday: students.filter((s) => s.status === "holiday").length,
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-3xl border shadow-sm p-8">
//         <h1 className="text-4xl font-bold text-[#0f5b54]">Attendance</h1>

//         <p className="text-gray-500 mt-2">
//           Track student and volunteer attendance.
//         </p>
//       </div>

//       <div className="bg-white rounded-3xl border shadow-sm p-6">
//         <div className="grid md:grid-cols-2 gap-4">
//           <select
//             value={selectedProgram}
//             onChange={(e) => setSelectedProgram(e.target.value)}
//             className="border rounded-xl p-3"
//           >
//             {programs.map((program) => (
//               <option key={program.id} value={program.id}>
//                 <option key={program.id} value={program.id}>
//                   {program.course_title}
//                   {program.level
//                     ? ` • ${program.level.charAt(0).toUpperCase()}${program.level.slice(1)}`
//                     : ""}
//                 </option>
//               </option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={attendanceDate}
//             onChange={(e) => setAttendanceDate(e.target.value)}
//             className="border rounded-xl p-3"
//           />
//         </div>
//       </div>

//       <div className="grid md:grid-cols-4 gap-4">
//         <Card title="Present" value={summary.present} color="text-green-600" />

//         <Card title="Absent" value={summary.absent} color="text-red-600" />

//         <Card title="Excused" value={summary.excused} color="text-yellow-600" />

//         <Card title="Holiday" value={summary.holiday} color="text-blue-600" />
//       </div>

//       <div className="bg-white rounded-3xl border shadow-sm p-6">
//         <div className="flex flex-wrap gap-3 mb-6">
//           <button
//             onClick={() => bulkUpdate("present")}
//             className="bg-green-600 text-white px-4 py-2 rounded-xl"
//           >
//             Mark All Present
//           </button>

//           <button
//             onClick={() => bulkUpdate("absent")}
//             className="bg-red-600 text-white px-4 py-2 rounded-xl"
//           >
//             Mark All Absent
//           </button>

//           <button
//             onClick={() => bulkUpdate("excused")}
//             className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
//           >
//             Mark All Excused
//           </button>

//           <button
//             onClick={() => bulkUpdate("holiday")}
//             className="bg-blue-600 text-white px-4 py-2 rounded-xl"
//           >
//             Holiday
//           </button>
//         </div>

//         <table className="w-full">
//           <thead>
//             <tr className="border-b bg-gray-50">
//               <th className="text-left p-4">Name</th>

//               <th className="text-left p-4">Email</th>

//               <th className="text-left p-4">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {students.map((student) => (
//               <tr key={student.student_id} className="border-b">
//                 <td className="p-4">
//                   {student.people?.fname} {student.people?.lname}
//                 </td>

//                 <td className="p-4">{student.people?.email}</td>

//                 <td className="p-4">
//                   <select
//                     value={student.status}
//                     onChange={(e) =>
//                       updateStatus(student.student_id, e.target.value)
//                     }
//                     className="border rounded-lg px-3 py-2"
//                   >
//                     <option value="present">Present</option>

//                     <option value="absent">Absent</option>

//                     <option value="excused">Excused</option>

//                     <option value="holiday">Holiday</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button
//           onClick={saveAttendance}
//           disabled={saving}
//           className="mt-6 bg-[#0f5b54] text-white px-6 py-3 rounded-xl"
//         >
//           {saving ? "Saving..." : "Save Attendance"}
//         </button>
//       </div>

//       <div className="bg-white rounded-3xl border shadow-sm p-8">
//         <h2 className="text-2xl font-bold mb-6">Attendance History</h2>

//         <div className="max-h-[400px] overflow-y-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="text-left p-4">Date</th>

//                 <th className="text-left p-4">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {history.map((row) => (
//                 <tr key={row.id} className="border-b">
//                   <td className="p-4">{row.attendance_date}</td>

//                   <td className="p-4 capitalize">{row.attendance_status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Card({ title, value, color }) {
//   return (
//     <div className="bg-white rounded-3xl border shadow-sm p-6">
//       <div className="text-sm text-gray-500">{title}</div>

//       <div className={`text-4xl font-bold mt-2 ${color}`}>{value}</div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const STATUS_OPTIONS = ["present", "absent", "excused", "holiday"];

const DAY_MAP = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export default function Attendance({ user }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [students, setStudents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.person_id) loadPrograms();
  }, [user?.person_id]);

  useEffect(() => {
    if (selectedProgram) {
      loadRoster();
      loadVolunteers();
      loadHistory();
    }
  }, [selectedProgram, attendanceDate]);

  const selectedProgramDetails = useMemo(
    () => programs.find((p) => p.id === selectedProgram),
    [programs, selectedProgram],
  );

  const selectedSection = useMemo(() => {
    const sections = selectedProgramDetails?.sections || [];
    const day = new Date(`${attendanceDate}T00:00:00`).getDay();

    return (
      sections.find((section) => DAY_MAP[section.day] === day) || sections[0]
    );
  }, [selectedProgramDetails, attendanceDate]);

  const classHours = useMemo(() => {
    if (!selectedSection?.start_time || !selectedSection?.end_time) return 0;

    const start = new Date(`${attendanceDate}T${selectedSection.start_time}`);
    const end = new Date(`${attendanceDate}T${selectedSection.end_time}`);

    return Math.max((end - start) / 1000 / 60 / 60, 0);
  }, [selectedSection, attendanceDate]);

  const loadPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
      .eq("is_archived", false)
      .order("course_title");

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(data || []);
    if (data?.length) setSelectedProgram(data[0].id);
  };

  // const loadRoster = async () => {
  //   const { data: enrollmentData, error } = await supabase
  //     .from("enrollments")
  //     .select(
  //       `
  //       id,
  //       student_id,
  //       enrollment_status,
  //       people:student_id(
  //         id,
  //         fname,
  //         lname,
  //         email
  //       )
  //     `,
  //     )
  //     .eq("program_id", selectedProgram);

  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   const { data: attendanceData } = await supabase
  //     .from("attendance")
  //     .select("*")
  //     .eq("program_id", selectedProgram)
  //     .eq("attendance_date", attendanceDate);

  //   const map = {};
  //   attendanceData?.forEach((row) => {
  //     map[row.student_id] = row;
  //   });

  //   setStudents(
  //     (enrollmentData || []).map((student) => ({
  //       ...student,
  //       status: map[student.student_id]?.attendance_status || "present",
  //       notes: map[student.student_id]?.notes || "",
  //     })),
  //   );
  // };

  const loadRoster = async () => {
    const { data: memberData, error } = await supabase
      .from("person_programs")
      .select(
        `
      id,
      person_id,
      role,
      status,
      people:person_id(
        id,
        fname,
        lname,
        email
      )
    `,
      )
      .eq("program_id", selectedProgram)
      .eq("status", "current")
      .eq("role", "member");

    if (error) {
      console.error("Error loading members:", error);
      return;
    }

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("program_id", selectedProgram)
      .eq("attendance_date", attendanceDate)
      .neq("notes", "Volunteer");

    if (attendanceError) {
      console.error("Error loading member attendance:", attendanceError);
    }

    const attendanceMap = {};
    attendanceData?.forEach((row) => {
      attendanceMap[row.student_id] = row;
    });

    setStudents(
      (memberData || []).map((row) => ({
        person_program_id: row.id,
        student_id: row.person_id,
        people: row.people,
        status: attendanceMap[row.person_id]?.attendance_status || "absent",
        notes: "Member",
      })),
    );
  };

  // const loadVolunteers = async () => {
  //   const { data, error } = await supabase
  //     .from("person_programs")
  //     .select(
  //       `
  //       id,
  //       person_id,
  //       role,
  //       status,
  //       people:person_id(
  //         id,
  //         fname,
  //         lname,
  //         email
  //       )
  //     `,
  //     )
  //     .eq("program_id", selectedProgram)
  //     .eq("status", "current")
  //     .eq("role", "volunteer");

  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   const volunteerIds = (data || []).map((v) => v.person_id);

  //   const { data: entries } = await supabase
  //     .from("time_entries")
  //     .select("*")
  //     .eq("program_id", selectedProgram)
  //     .eq("work_date", attendanceDate)
  //     .eq("notes", "Class")
  //     .in(
  //       "person_id",
  //       volunteerIds.length
  //         ? volunteerIds
  //         : ["00000000-0000-0000-0000-000000000000"],
  //     );

  //   const entryMap = {};
  //   entries?.forEach((entry) => {
  //     entryMap[entry.person_id] = entry;
  //   });

  //   setVolunteers(
  //     (data || []).map((row) => ({
  //       person_id: row.person_id,
  //       people: row.people,
  //       status: entryMap[row.person_id] ? "present" : "absent",
  //     })),
  //   );
  // };

  const loadVolunteers = async () => {
    const { data, error } = await supabase
      .from("person_programs")
      .select(
        `
      id,
      person_id,
      role,
      status,
      people:person_id(
        id,
        fname,
        lname,
        email
      )
      `,
      )
      .eq("program_id", selectedProgram)
      .eq("status", "current")
      .eq("role", "volunteer");

    if (error) {
      console.error("Error loading volunteers:", error);
      return;
    }

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("program_id", selectedProgram)
      .eq("attendance_date", attendanceDate)
      .eq("notes", "Volunteer");

    if (attendanceError) {
      console.error("Error loading volunteer attendance:", attendanceError);
    }

    const attendanceMap = {};
    attendanceData?.forEach((row) => {
      attendanceMap[row.student_id] = row;
    });

    setVolunteers(
      (data || []).map((row) => ({
        person_id: row.person_id,
        people: row.people,
        status: attendanceMap[row.person_id]?.attendance_status || "absent",
      })),
    );
  };

  const loadHistory = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("attendance_date, attendance_status")
      .eq("program_id", selectedProgram)
      .order("attendance_date", { ascending: false });

    setHistory(data || []);
  };

  const updateStudentStatus = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s)),
    );
  };

  const updateVolunteerStatus = (personId, status) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.person_id === personId ? { ...v, status } : v)),
    );
  };

  const bulkStudents = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const bulkVolunteers = (status) => {
    setVolunteers((prev) => prev.map((v) => ({ ...v, status })));
  };

  // const saveAttendance = async () => {
  //   try {
  //     setSaving(true);

  //     const studentRows = students.map((student) => ({
  //       enrollment_id: student.id,
  //       student_id: student.student_id,
  //       program_id: selectedProgram,
  //       attendance_date: attendanceDate,
  //       attendance_status: student.status,
  //       notes: student.notes || null,
  //       marked_by: user.person_id,
  //       updated_at: new Date().toISOString(),
  //     }));

  //     const { error: attendanceError } = await supabase
  //       .from("attendance")
  //       .upsert(studentRows, {
  //         onConflict: "student_id,program_id,attendance_date",
  //       });

  //     if (attendanceError) throw attendanceError;

  //     for (const volunteer of volunteers) {
  //       await supabase
  //         .from("time_entries")
  //         .delete()
  //         .eq("person_id", volunteer.person_id)
  //         .eq("program_id", selectedProgram)
  //         .eq("work_date", attendanceDate)
  //         .eq("notes", "Class");

  //       if (volunteer.status === "present") {
  //         const startTime = new Date(
  //           `${attendanceDate}T${selectedSection?.start_time || "00:00"}`,
  //         ).toISOString();

  //         const endTime = new Date(
  //           `${attendanceDate}T${selectedSection?.end_time || "00:00"}`,
  //         ).toISOString();

  //         console.log("Creating time entry for volunteer:", volunteer);

  //         const { error: timeError } = await supabase
  //           .from("time_entries")
  //           .insert({
  //             person_id: volunteer.person_id,
  //             manager_id: user.person_id,
  //             work_date: attendanceDate,
  //             entry_type: "direct",
  //             start_time: startTime,
  //             end_time: endTime,
  //             hours: classHours,
  //             notes: "Class",
  //             status: "pending",
  //             program_id: selectedProgram,
  //           });

  //         if (timeError) throw timeError;
  //       }
  //     }

  //     alert("Attendance and volunteer hours saved successfully");
  //     await loadRoster();
  //     await loadVolunteers();
  //     await loadHistory();
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to save attendance");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const saveAttendance = async () => {
    try {
      setSaving(true);

      const studentRows = students.map((student) => ({
        student_id: student.student_id,
        program_id: selectedProgram,
        attendance_date: attendanceDate,
        attendance_status: student.status,
        notes: student.notes || "Member",
        marked_by: user.person_id,
        updated_at: new Date().toISOString(),
      }));

      const volunteerRows = volunteers.map((volunteer) => ({
        student_id: volunteer.person_id,
        program_id: selectedProgram,
        attendance_date: attendanceDate,
        attendance_status: volunteer.status,
        notes: "Volunteer",
        marked_by: user.person_id,
        updated_at: new Date().toISOString(),
      }));

      const { error: attendanceError } = await supabase
        .from("attendance")
        .upsert([...studentRows, ...volunteerRows], {
          onConflict: "student_id,program_id,attendance_date",
        });

      if (attendanceError) throw attendanceError;

      for (const volunteer of volunteers) {
        const { error: deleteError } = await supabase
          .from("time_entries")
          .delete()
          .eq("person_id", volunteer.person_id)
          .eq("program_id", selectedProgram)
          .eq("work_date", attendanceDate)
          .eq("notes", "Class");

        if (deleteError) throw deleteError;

        if (volunteer.status === "present") {
          const startTime = new Date(
            `${attendanceDate}T${selectedSection?.start_time || "00:00"}`,
          ).toISOString();

          const endTime = new Date(
            `${attendanceDate}T${selectedSection?.end_time || "00:00"}`,
          ).toISOString();

          const { error: timeError } = await supabase
            .from("time_entries")
            .insert({
              person_id: volunteer.person_id,
              manager_id: user.person_id,
              work_date: attendanceDate,
              entry_type: "direct",
              start_time: startTime,
              end_time: endTime,
              hours: classHours,
              notes: "Class",
              status: "approved",
              program_id: selectedProgram,
            });

          if (timeError) throw timeError;
        }
      }

      alert("Attendance and volunteer hours saved successfully");

      await loadRoster();
      await loadVolunteers();
      await loadHistory();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(error.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const monthDays = useMemo(() => {
    const date = new Date(`${attendanceDate}T00:00:00`);
    const year = date.getFullYear();
    const month = date.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    return Array.from({ length: last.getDate() }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return d.toISOString().split("T")[0];
    });
  }, [attendanceDate]);

  const historyByDate = useMemo(() => {
    const map = {};
    history.forEach((row) => {
      if (!map[row.attendance_date]) map[row.attendance_date] = 0;
      if (row.attendance_status === "present") map[row.attendance_date] += 1;
    });
    return map;
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0f5b54] to-[#063a35] rounded-3xl p-8 text-white">
        <p className="text-sm text-white/70">Program Lead Workspace</p>
        <h1 className="text-4xl font-bold mt-2">Attendance</h1>
        <p className="text-white/80 mt-3">
          Mark student attendance and automatically log volunteer class hours.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="border rounded-2xl px-4 py-3 lg:col-span-2"
        >
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.course_title} {program.level ? `• ${program.level}` : ""}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
          className="border rounded-2xl px-4 py-3"
        />
      </div>

      {selectedProgramDetails && (
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#0f5b54]">
            {selectedProgramDetails.course_title}
          </h2>
          <p className="text-gray-500 mt-1">
            {selectedSection?.day || "-"} • {selectedSection?.start_time || "-"}{" "}
            to {selectedSection?.end_time || "-"} • {classHours} volunteer hours
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Monthly Calendar</h2>

        <div className="grid grid-cols-7 gap-3">
          {monthDays.map((day) => (
            <button
              key={day}
              onClick={() => setAttendanceDate(day)}
              className={`min-h-[90px] rounded-2xl border p-3 text-left ${
                day === attendanceDate
                  ? "bg-[#0f5b54] text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="font-bold">
                {new Date(`${day}T00:00:00`).getDate()}
              </div>
              <div className="text-xs mt-2">
                Present: {historyByDate[day] || 0}
              </div>
            </button>
          ))}
        </div>
      </div>

      <RosterSection
        title="Students"
        rows={students}
        idKey="student_id"
        updateStatus={updateStudentStatus}
        bulkUpdate={bulkStudents}
      />

      <RosterSection
        title="Volunteers"
        rows={volunteers}
        idKey="person_id"
        updateStatus={updateVolunteerStatus}
        bulkUpdate={bulkVolunteers}
        helper={`Present volunteers will get ${classHours} hours added to time entries.`}
      />

      <button
        onClick={saveAttendance}
        disabled={saving}
        className="bg-[#0f5b54] text-white px-6 py-3 rounded-xl disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}

function RosterSection({
  title,
  rows,
  idKey,
  updateStatus,
  bulkUpdate,
  helper,
}) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6">
      <div className="flex justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {helper && <p className="text-sm text-gray-500 mt-1">{helper}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => bulkUpdate(status)}
              className="border px-3 py-2 rounded-xl capitalize"
            >
              All {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-3xl">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-gray-500">
                  No {title.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row[idKey]} className="border-t">
                  <td className="p-4 font-semibold">
                    {row.people?.fname} {row.people?.lname}
                  </td>
                  <td className="p-4 text-gray-500">
                    {row.people?.email || "-"}
                  </td>
                  <td className="p-4">
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row[idKey], e.target.value)}
                      className="border rounded-xl px-3 py-2 capitalize"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
