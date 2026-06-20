// import { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabase";

// const Attendance = () => {
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [statusFilter, setStatusFilter] = useState("active");

//   /* ---------------- FETCH PROGRAMS ---------------- */
//   // useEffect(() => {
//   //   const fetchPrograms = async () => {
//   //     const { data } = await supabase.from("programs").select("*");
//   //     setPrograms(data || []);
//   //   };

//   //   fetchPrograms();
//   // }, []);
//   useEffect(() => {
//     const fetchPrograms = async () => {
//       let query = supabase.from("programs").select("*");

//       if (statusFilter === "active") {
//         query = query.eq("is_active", true).eq("is_archived", false);
//       }

//       if (statusFilter === "archived") {
//         query = query.eq("is_archived", true).eq("is_active", false);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) {
//         console.error(error);
//         return;
//       }

//       setPrograms(data || []);
//     };

//     fetchPrograms();
//   }, [statusFilter]);

//   /* ---------------- FETCH STUDENTS + ATTENDANCE ---------------- */
//   useEffect(() => {
//     if (!selectedProgram) return;

//     const fetchData = async () => {
//       // get enrolled students
//       const { data: enrollments } = await supabase
//         .from("enrollments")
//         .select("student_id, people(fname, lname)")
//         .eq("program_id", selectedProgram.id);

//       const studentList = enrollments.map((e) => ({
//         id: e.student_id,
//         name: `${e.people.fname} ${e.people.lname}`,
//       }));

//       setStudents(studentList);

//       // get attendance for selected date
//       const { data: attendanceData } = await supabase
//         .from("attendance")
//         .select("*")
//         .eq("program_id", selectedProgram.id)
//         .eq("date", date);

//       const map = {};
//       attendanceData?.forEach((a) => {
//         map[a.student_id] = a.attendance_status;
//       });

//       setAttendance(map);
//     };

//     fetchData();
//   }, [selectedProgram, date]);

//   /* ---------------- MARK ATTENDANCE ---------------- */
//   const toggleAttendance = async (studentId) => {
//     const current = attendance[studentId] || "absent";
//     const newStatus = current === "present" ? "absent" : "present";

//     await supabase.from("attendance").upsert([
//       {
//         program_id: selectedProgram.id,
//         student_id: studentId,
//         date,
//         status: newStatus,
//       },
//     ]);

//     setAttendance((prev) => ({
//       ...prev,
//       [studentId]: newStatus,
//     }));
//   };

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <h1 className="text-3xl font-bold mb-6">Attendance</h1>

//       <div className="flex gap-3 mb-6">
//         {["active", "archived"].map((filter) => (
//           <button
//             key={filter}
//             onClick={() => setStatusFilter(filter)}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//               statusFilter === filter
//                 ? "bg-teal-800 text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             {filter === "active"
//               ? "Active"
//               : filter === "archived"
//                 ? "Archived"
//                 : "All"}
//           </button>
//         ))}
//       </div>

//       {/* PROGRAM SELECTION */}
//       {!selectedProgram && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {programs.map((p) => (
//             <div
//               key={p.id}
//               onClick={() => setSelectedProgram(p)}
//               className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-4"
//             >
//               {p.image_url && (
//                 <div className="h-40 flex items-center justify-center mb-3">
//                   <img src={p.image_url} className="h-full object-contain" />
//                 </div>
//               )}

//               <h2 className="text-lg font-semibold">{p.course_title}</h2>
//               <p className="text-sm text-gray-500">{p.course_code}</p>

//               <button className="mt-3 w-full bg-teal-800 text-white py-2 rounded-lg">
//                 View Attendance
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ATTENDANCE VIEW */}
//       {selectedProgram && (
//         <div className="bg-white p-6 rounded-2xl shadow">
//           {/* BACK */}
//           <button
//             onClick={() => setSelectedProgram(null)}
//             className="mb-4 text-sm text-gray-500 hover:underline"
//           >
//             ← Back to Programs
//           </button>

//           {/* PROGRAM INFO */}
//           <h2 className="text-2xl font-semibold">
//             {selectedProgram.course_title}
//           </h2>
//           <p className="text-gray-500 mb-4">{selectedProgram.course_code}</p>

//           {/* DATE PICKER */}
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border p-2 rounded mb-4"
//           />

//           {/* TABLE */}
//           <div className="border rounded-xl overflow-hidden">
//             <div className="grid grid-cols-2 bg-gray-100 p-3 font-semibold">
//               <div>Student</div>
//               <div>Status</div>
//             </div>

//             {students.map((s) => (
//               <div
//                 key={s.id}
//                 className="grid grid-cols-2 p-3 border-t items-center"
//               >
//                 <div>{s.name}</div>

//                 <button
//                   onClick={() => toggleAttendance(s.id)}
//                   className={`px-3 py-1 rounded-lg text-white w-28 ${
//                     attendance[s.id] === "present"
//                       ? "bg-green-600"
//                       : "bg-red-500"
//                   }`}
//                 >
//                   {attendance[s.id] === "present" ? "Present" : "Absent"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Attendance;

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const statusColors = {
  present: "bg-green-100 text-green-700 border-green-200",
  absent: "bg-red-100 text-red-700 border-red-200",
  excused: "bg-blue-100 text-blue-700 border-blue-200",
  holiday: "bg-purple-100 text-purple-700 border-purple-200",
};

const getPacificDate = (date = new Date()) => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getDayNumber = (dateString) => {
  return Number(dateString.split("-")[2]);
};

const Attendance = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(getPacificDate());

  const [statusFilter, setStatusFilter] = useState("active");
  const [viewMode, setViewMode] = useState("calendar");

  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportType, setExportType] = useState("full");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchPrograms();
  }, [statusFilter]);

  useEffect(() => {
    if (!selectedProgram) return;
    fetchStudentsAndAttendance();
  }, [selectedProgram, date]);

  const fetchPrograms = async () => {
    let query = supabase.from("programs").select("*");

    if (statusFilter === "active") {
      query = query.eq("is_active", true).eq("is_archived", false);
    }

    if (statusFilter === "archived") {
      query = query.eq("is_archived", true).eq("is_active", false);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(data || []);
  };

  const fetchStudentsAndAttendance = async () => {
    // const { data: enrollments, error: enrollmentError } = await supabase
    //   .from("enrollments")
    //   .select("student_id, people(fname, lname, role)")
    //   .eq("program_id", selectedProgram.id)
    //   .eq("enrollment_status", "active");
    const { data: assignedPeople, error: enrollmentError } = await supabase
      .from("person_programs")
      .select(
        `
    person_id,
    role,
    status,
    people:person_id (
      fname,
      lname,
      email,
      role
    )
  `,
      )
      .eq("program_id", selectedProgram.id)
      .eq("status", "current")
      .in("role", ["member", "volunteer"]);

    if (enrollmentError) {
      console.error(enrollmentError);
      return;
    }

    // const studentList = (enrollments || []).map((e) => ({
    //   id: e.student_id,
    //   name: `${e.people?.fname || ""} ${e.people?.lname || ""}`.trim(),
    //   role: e.people?.role || "member",
    // }));
    const studentList = (assignedPeople || []).map((e) => ({
      id: e.person_id,
      name: `${e.people?.fname || ""} ${e.people?.lname || ""}`.trim(),
      email: e.people?.email || "",
      role: e.role || e.people?.role || "member",
    }));

    setStudents(studentList);

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("program_id", selectedProgram.id)
      .eq("attendance_date", date);

    if (attendanceError) {
      console.error(attendanceError);
      return;
    }

    const map = {};
    attendanceData?.forEach((a) => {
      map[a.student_id] = a.attendance_status;
    });

    setAttendance(map);
  };

  const setAttendanceStatus = async (studentId, status) => {
    const { error } = await supabase.from("attendance").upsert(
      [
        {
          program_id: selectedProgram.id,
          student_id: studentId,
          attendance_date: date,
          attendance_status: status,
        },
      ],
      {
        onConflict: "program_id,student_id,attendance_date",
      },
    );

    if (error) {
      alert(error.message);
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const monthDays = useMemo(() => {
    const current = new Date(date);
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const day = new Date(year, month, d);
      days.push(getPacificDate(day));
    }

    return days;
  }, [date]);

  const downloadCSV = (filename, rows) => {
    if (!rows.length) {
      alert("No data found for this export.");
      return;
    }

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? "";
            return `"${String(value).replaceAll('"', '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  // const fetchAttendanceExportData = async () => {
  //   let query = supabase.from("attendance").select(`
  //     *,
  //     people (
  //       fname,
  //       lname,
  //       role,
  //       email
  //     ),
  //     programs (
  //       course_title,
  //       course_code,
  //       category
  //     )
  //   `);

  //   if (exportStartDate) {
  //     query = query.gte("date", exportStartDate);
  //   }

  //   if (exportEndDate) {
  //     query = query.lte("date", exportEndDate);
  //   }

  //   const { data, error } = await query.order("date", { ascending: true });

  //   if (error) {
  //     alert(error.message);
  //     return [];
  //   }

  //   return data || [];
  // };

  const fetchAttendanceExportData = async () => {
    // let query = supabase.from("attendance").select(`
    //   id,
    //   student_id,
    //   program_id,
    //   attendance_date,
    //   attendance_status,
    //   notes,
    //   people:student_id (
    //     fname,
    //     lname,
    //     role,
    //     email
    //   ),
    //   programs:program_id (
    //     course_title,
    //     course_code,
    //     category
    //   )
    // `);
    let query = supabase.from("attendance").select(`
    id,
    student_id,
    program_id,
    attendance_date,
    attendance_status,
    notes,
    people:student_id (
      fname,
      lname,
      email,
      role
    ),
    programs:program_id (
      course_title,
      course_code,
      category
    )
  `);

    if (exportStartDate) {
      query = query.gte("attendance_date", exportStartDate);
    }

    if (exportEndDate) {
      query = query.lte("attendance_date", exportEndDate);
    }

    const { data, error } = await query.order("attendance_date", {
      ascending: true,
    });

    if (error) {
      console.error("Export error:", error);
      alert(error.message);
      return [];
    }

    return data || [];
  };

  const exportAttendance = async () => {
    const data = await fetchAttendanceExportData();

    if (exportType === "full") {
      const rows = data.map((a) => ({
        Date: a.attendance_date,
        Program: a.programs?.course_title,
        CourseCode: a.programs?.course_code,
        Category: a.programs?.category,
        Person: `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim(),
        Email: a.people?.email,
        Role: a.people?.role,
        Status: a.attendance_status,
      }));

      downloadCSV("attendance-full-report.csv", rows);
      return;
    }

    if (exportType === "attendance_matrix") {
      const uniqueDates = [
        ...new Set(data.map((a) => a.attendance_date).filter(Boolean)),
      ].sort();

      const grouped = {};

      data.forEach((a) => {
        const personName =
          `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim();

        const key = `${a.student_id}-${a.program_id}`;

        if (!grouped[key]) {
          grouped[key] = {
            Name: personName,
            Email: a.people?.email || "",
            Role: a.people?.role || a.notes || "",
            Program: a.programs?.course_title || "",
            CourseCode: a.programs?.course_code || "",
            Category: a.programs?.category || "",
          };

          uniqueDates.forEach((date) => {
            grouped[key][date] = "";
          });
        }

        grouped[key][a.attendance_date] = a.attendance_status || "";
      });

      downloadCSV("attendance-by-date.csv", Object.values(grouped));
      return;
    }

    if (exportType === "per_class") {
      const rows = data.map((a) => ({
        Program: a.programs?.course_title,
        CourseCode: a.programs?.course_code,
        Date: a.attendance_date,
        Person: `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim(),
        Status: a.attendance_status,
      }));

      downloadCSV("attendance-per-class.csv", rows);
      return;
    }

    if (exportType === "per_role") {
      const rows = data.map((a) => ({
        Role: a.people?.role,
        Person: `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim(),
        Program: a.programs?.course_title,
        Date: a.attendance_date,
        Status: a.attendance_status,
      }));

      downloadCSV("attendance-per-role.csv", rows);
      return;
    }

    if (exportType === "summary") {
      const grouped = {};

      data.forEach((a) => {
        const key = `${a.student_id}-${a.program_id}`;

        if (!grouped[key]) {
          grouped[key] = {
            Person: `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim(),
            Role: a.people?.role,
            Program: a.programs?.course_title,
            Present: 0,
            Absent: 0,
            Excused: 0,
            Total: 0,
          };
        }

        grouped[key].Total += 1;

        if (a.attendance_status === "present") grouped[key].Present += 1;
        if (a.attendance_status === "absent") grouped[key].Absent += 1;
        if (a.attendance_status === "excused") grouped[key].Excused += 1;
      });

      downloadCSV("attendance-summary.csv", Object.values(grouped));
      return;
    }

    if (exportType === "danger_zone") {
      const grouped = {};

      data.forEach((a) => {
        if (a.attendance_status !== "absent") return;

        const key = a.student_id;

        if (!grouped[key]) {
          grouped[key] = {
            Person: `${a.people?.fname || ""} ${a.people?.lname || ""}`.trim(),
            Email: a.people?.email,
            Role: a.people?.role,
            Absences: 0,
          };
        }

        grouped[key].Absences += 1;
      });

      const dangerRows = Object.values(grouped).filter(
        (row) => row.Absences > 3,
      );

      downloadCSV("attendance-danger-zone.csv", dangerRows);
    }
  };

  const filteredStudents = useMemo(() => {
    if (roleFilter === "all") return students;

    return students.filter(
      (student) => student.role?.toLowerCase() === roleFilter,
    );
  }, [students, roleFilter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-gray-500 mt-1">
            Track attendance by program, date, and export admin reports.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-full ${
              viewMode === "calendar" ? "bg-teal-800 text-white" : "bg-gray-100"
            }`}
          >
            Calendar View
          </button>

          <button
            onClick={() => setViewMode("programs")}
            className={`px-4 py-2 rounded-full ${
              viewMode === "programs" ? "bg-teal-800 text-white" : "bg-gray-100"
            }`}
          >
            Program View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-lg">Export Attendance</h2>
        <p className="text-sm text-gray-500">
          Choose a date range and download attendance as CSV.
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="full">Full Report</option>
            <option value="attendance_matrix">Attendance Sheet by Date</option>
            <option value="per_class">Per Class</option>
            <option value="per_role">Per Role</option>
            <option value="summary">Summary</option>
            <option value="danger_zone">Danger Zone: 3+ Absences</option>
          </select>

          <input
            type="date"
            value={exportStartDate}
            onChange={(e) => setExportStartDate(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="date"
            value={exportEndDate}
            onChange={(e) => setExportEndDate(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <button
            onClick={exportAttendance}
            className="bg-[#0f5b54] text-white rounded-xl px-4"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {["active", "archived"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter);
              setSelectedProgram(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusFilter === filter
                ? "bg-teal-800 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {filter === "active" ? "Active" : "Archived"}
          </button>
        ))}
      </div>

      {!selectedProgram && viewMode === "calendar" && (
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">
              {new Date(`${date.slice(0, 7)}-01T12:00:00`).toLocaleString(
                "default",
                {
                  month: "long",
                  year: "numeric",
                },
              )}
            </h2>

            <input
              type="month"
              value={date.slice(0, 7)}
              onChange={(e) => setDate(`${e.target.value}-01`)}
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => (
              <button
                key={index}
                disabled={!day}
                onClick={() => {
                  if (day) setDate(day);
                  setViewMode("programs");
                }}
                className={`min-h-[90px] rounded-xl border p-2 text-left ${
                  day === date
                    ? "border-teal-700 bg-teal-50"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {day && (
                  <>
                    <p className="font-semibold">{getDayNumber(day)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Select programs
                    </p>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {!selectedProgram && viewMode === "programs" && (
        <div>
          <div className="bg-white rounded-2xl border p-4 mb-5 flex items-center gap-4">
            <label className="font-medium">Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProgram(p)}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-4"
              >
                {p.image_url && (
                  <div className="h-40 flex items-center justify-center mb-3">
                    <img
                      src={p.image_url}
                      alt={p.course_title}
                      className="h-full object-contain"
                    />
                  </div>
                )}

                <h2 className="text-lg font-semibold">{p.course_title}</h2>
                <p className="text-sm text-gray-500">{p.course_code}</p>

                <button className="mt-3 w-full bg-teal-800 text-white py-2 rounded-lg">
                  View Attendance
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProgram && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <button
            onClick={() => setSelectedProgram(null)}
            className="mb-4 text-sm text-gray-500 hover:underline"
          >
            ← Back to Programs
          </button>

          <h2 className="text-2xl font-semibold">
            {selectedProgram.course_title}
          </h2>

          <p className="text-gray-500 mb-4">{selectedProgram.course_code}</p>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded mb-4"
          />

          <div className="flex gap-2 mb-4">
            {["all", "member", "volunteer"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  roleFilter === role
                    ? "bg-teal-800 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {role === "all" ? "All" : `${role}s`}
              </button>
            ))}
          </div>

          <div className="border rounded-xl overflow-hidden">
            {/* <div className="grid grid-cols-3 bg-gray-100 p-3 font-semibold">
              <div>Student</div>
              <div>Role</div>
              <div>Status</div>
            </div> */}
            <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No enrolled students found.
              </div>
            ) : (
              filteredStudents.map((s) => {
                const currentStatus = attendance[s.id] || "absent";

                return (
                  <div
                    key={s.id}
                    className="grid grid-cols-4 p-3 border-t items-center"
                  >
                    <div>{s.name}</div>
                    <div className="text-gray-500">{s.email || "-"}</div>
                    <div className="capitalize text-gray-500">{s.role}</div>

                    <div className="flex gap-2 flex-wrap">
                      {["present", "absent", "excused", "holiday"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => setAttendanceStatus(s.id, status)}
                            className={`px-3 py-1 rounded-full border text-sm capitalize ${
                              currentStatus === status
                                ? statusColors[status]
                                : "bg-white text-gray-500 border-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
