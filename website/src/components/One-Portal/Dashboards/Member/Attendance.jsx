import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function Attendance({ user }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProgram, setSelectedProgram] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user?.person_id) {
      fetchAttendance();
    }
  }, [user?.person_id]);

  //   async function fetchAttendance() {
  //     setLoading(true);

  //     const { data, error } = await supabase
  //       .from("attendance")
  //       .select(
  //         `
  //     *,
  //     programs (
  //       id,
  //       course_title
  //     ),
  //     marker:people!attendance_marked_by_fkey (
  //       id,
  //       fname,
  //       lname
  //     )
  //   `,
  //       )
  //       .eq("student_id", user.person_id)
  //       .order("attendance_date", {
  //         ascending: false,
  //       });

  //     if (error) {
  //       console.error(error);
  //     }

  //     setAttendance(data || []);
  //     setLoading(false);
  //   }

  // async function fetchAttendance() {
  //   setLoading(true);

  //   try {
  //     /* ---------------------------------- */
  //     /* GET ACTIVE ENROLLMENTS            */
  //     /* ---------------------------------- */

  //     const { data: enrollments, error: enrollmentError } = await supabase
  //       .from("enrollments")
  //       .select(
  //         `
  //         id,
  //         program_id,
  //         enrollment_status
  //       `,
  //       )
  //       .eq("student_id", user.person_id)
  //       .eq("enrollment_status", "active");

  //     if (enrollmentError) {
  //       console.error(enrollmentError);
  //       setAttendance([]);
  //       setLoading(false);
  //       return;
  //     }

  //     const validEnrollmentIds = new Set((enrollments || []).map((e) => e.id));

  //     const validProgramIds = new Set(
  //       (enrollments || []).map((e) => e.program_id),
  //     );

  //     /* ---------------------------------- */
  //     /* GET ATTENDANCE                    */
  //     /* ---------------------------------- */

  //     const { data: attendanceData, error } = await supabase
  //       .from("attendance")
  //       .select(
  //         `
  //         *,
  //         programs (
  //           id,
  //           course_title
  //         ),
  //         marker:people!attendance_marked_by_fkey (
  //           id,
  //           fname,
  //           lname
  //         )
  //       `,
  //       )
  //       .eq("student_id", user.person_id)
  //       .order("attendance_date", {
  //         ascending: false,
  //       });

  //     if (error) {
  //       console.error(error);
  //       setAttendance([]);
  //       setLoading(false);
  //       return;
  //     }

  //     /* ---------------------------------- */
  //     /* SAFETY FILTER                     */
  //     /* ---------------------------------- */

  //     const safeAttendance = (attendanceData || []).filter(
  //       (record) =>
  //         validEnrollmentIds.has(record.enrollment_id) &&
  //         validProgramIds.has(record.program_id),
  //     );

  //     setAttendance(safeAttendance);
  //   } catch (err) {
  //     console.error(err);
  //     setAttendance([]);
  //   }

  //   setLoading(false);
  // }

  async function fetchAttendance() {
    setLoading(true);

    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
      *,
      programs (
        id,
        course_title
      ),
      marker:people!attendance_marked_by_fkey (
        id,
        fname,
        lname
      )
    `,
      )
      .eq("student_id", user.person_id)
      .order("attendance_date", { ascending: false });

    if (error) {
      console.error(error);
      setAttendance([]);
      setLoading(false);
      return;
    }

    setAttendance(data || []);
    setLoading(false);
  }

  const programs = useMemo(() => {
    const unique = new Map();

    attendance.forEach((item) => {
      if (item.programs) {
        unique.set(item.programs.id, item.programs);
      }
    });

    return [...unique.values()];
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    if (selectedProgram === "all") {
      return attendance;
    }

    return attendance.filter((a) => a.program_id === selectedProgram);
  }, [attendance, selectedProgram]);

  const presentCount = filteredAttendance.filter(
    (a) => a.attendance_status === "present",
  ).length;

  const excusedCount = filteredAttendance.filter(
    (a) => a.attendance_status === "excused",
  ).length;

  const absentCount = filteredAttendance.filter(
    (a) => a.attendance_status === "absent",
  ).length;

  const totalDays = presentCount + excusedCount + absentCount;

  const attendancePercentage =
    totalDays === 0
      ? 0
      : (((presentCount + excusedCount) / totalDays) * 100).toFixed(1);

  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );

  const daysInMonth = monthEnd.getDate();

  const firstDay = monthStart.getDay();

  const attendanceMap = {};

  filteredAttendance.forEach((a) => {
    attendanceMap[a.attendance_date] = a.attendance_status;
  });

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  if (loading) {
    return <div className="p-6">Loading attendance...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}

      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">Attendance</h1>

        <p className="text-gray-500 mt-2">
          Attendance history across all enrolled programs.
        </p>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Present" value={presentCount} />

        <MetricCard title="Excused" value={excusedCount} />

        <MetricCard title="Absent" value={absentCount} />

        <MetricCard title="Attendance %" value={`${attendancePercentage}%`} />
      </div>

      {/* FILTER */}

      <div className="bg-white rounded-3xl shadow-sm border p-6">
        <label className="text-sm font-medium text-gray-600">Program</label>

        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="mt-2 w-full border rounded-xl p-3"
        >
          <option value="all">All Programs</option>

          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.course_title}
            </option>
          ))}
        </select>
      </div>

      {/* CALENDAR */}

      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={previousMonth}
            className="px-4 py-2 border rounded-xl"
          >
            Previous
          </button>

          <h2 className="text-2xl font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button onClick={nextMonth} className="px-4 py-2 border rounded-xl">
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 font-semibold text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[...Array(firstDay)].map((_, idx) => (
            <div key={`blank-${idx}`} className="h-16" />
          ))}

          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;

            const dateString = `${currentMonth.getFullYear()}-${String(
              currentMonth.getMonth() + 1,
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const status = attendanceMap[dateString];

            let bg = "bg-gray-50 border";

            if (status === "present") {
              bg = "bg-green-100 border-green-300";
            }

            if (status === "excused") {
              bg = "bg-blue-100 border-blue-300";
            }

            if (status === "absent") {
              bg = "bg-red-100 border-red-300";
            }

            return (
              <div
                key={dateString}
                className={`h-16 rounded-xl border flex items-center justify-center font-semibold ${bg}`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex gap-6 mt-6 text-sm">
          <Legend color="bg-green-500" label="Present" />

          <Legend color="bg-blue-500" label="Excused" />

          <Legend color="bg-red-500" label="Absent" />
        </div>
      </div>

      {/* HISTORY */}

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Attendance History</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4">Date</th>

              <th className="text-left p-4">Program</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Marked By</th>
            </tr>
          </thead>

          {/* <tbody>
            {filteredAttendance.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-4">{a.attendance_date}</td>

                <td className="p-4">{a.programs?.course_title}</td>

                <td className="p-4 capitalize">{a.attendance_status}</td>

                <td className="p-4">
                  {a.marker
                    ? `${a.marker.fname ?? ""} ${a.marker.lname ?? ""}`.trim()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-4">{a.attendance_date}</td>
                  <td className="p-4">{a.programs?.course_title || "-"}</td>
                  <td className="p-4 capitalize">{a.attendance_status}</td>
                  <td className="p-4">
                    {a.marker
                      ? `${a.marker.fname ?? ""} ${a.marker.lname ?? ""}`.trim()
                      : "-"}
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

function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6">
      <p className="text-gray-500 text-sm">{title}</p>

      <p className="text-4xl font-bold text-[#0f5b54] mt-2">{value}</p>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`} />

      <span>{label}</span>
    </div>
  );
}
