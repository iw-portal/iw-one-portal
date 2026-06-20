// import React, { useState } from "react";

// /* ---------------- CONFIG ---------------- */

// const days = [
//   { name: "Monday", type: "small" },
//   { name: "Tuesday", type: "small" },
//   { name: "Wednesday", type: "large" },
//   { name: "Thursday", type: "small" },
//   { name: "Friday", type: "small" },
//   { name: "Saturday", type: "large" },
//   { name: "Sunday", type: "large" },
// ];

// const schedule = [
//   {
//     day: "Wednesday",
//     start: "18:00",
//     end: "19:00",
//     title: "Conversational Skills",
//     type: "online",
//     where: "Webex",
//   },

//   {
//     day: "Saturday",
//     start: "10:30",
//     end: "12:00",
//     title: "Software Testing Level 2",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Saturday",
//     start: "14:00",
//     end: "15:00",
//     title: "Conversational Skills",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Saturday",
//     start: "15:15",
//     end: "16:45",
//     title: "Scratch / Robotics",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Saturday",
//     start: "17:00",
//     end: "18:30",
//     title: "Web Dev Basic",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },

//   {
//     day: "Saturday",
//     start: "10:00",
//     end: "11:30",
//     title: "Excel Basic",
//     type: "online",
//     where: "Webex",
//   },
//   {
//     day: "Saturday",
//     start: "11:30",
//     end: "13:00",
//     title: "Excel Intermediate",
//     type: "online",
//     where: "Webex",
//   },
//   {
//     day: "Saturday",
//     start: "13:30",
//     end: "15:00",
//     title: "Excel Intermediate",
//     type: "online",
//     where: "Webex",
//   },

//   {
//     day: "Sunday",
//     start: "10:00",
//     end: "11:30",
//     title: "Software Testing Level 1",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Sunday",
//     start: "11:45",
//     end: "12:45",
//     title: "Small Business Services",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Sunday",
//     start: "13:15",
//     end: "14:15",
//     title: "Business Products Class 1",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Sunday",
//     start: "14:15",
//     end: "15:15",
//     title: "Business Products Class 2",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Sunday",
//     start: "15:30",
//     end: "16:30",
//     title: "Conversational Skills",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },
//   {
//     day: "Sunday",
//     start: "16:45",
//     end: "18:15",
//     title: "Intro to AI",
//     type: "inperson",
//     where: "106 S Park Victoria Dr, Milpitas, CA 95035",
//   },

//   {
//     day: "Sunday",
//     start: "10:15",
//     end: "12:00",
//     title: "Python Programming",
//     type: "online",
//     where: "Webex",
//   },
//   {
//     day: "Sunday",
//     start: "18:00",
//     end: "19:30",
//     title: "Mobile App Dev Basic",
//     type: "online",
//     where: "Webex",
//   },
//   {
//     day: "Sunday",
//     start: "18:00",
//     end: "19:30",
//     title: "Mobile App Dev Intermediate",
//     type: "online",
//     where: "Webex",
//   },
// ];

// /* ---------------- HELPERS ---------------- */

// const timeToMinutes = (t) => {
//   const [h, m] = t.split(":").map(Number);
//   return h * 60 + m;
// };

// const getOverlappingGroups = (events) => {
//   const groups = [];

//   events.forEach((event) => {
//     const start = timeToMinutes(event.start);
//     const end = timeToMinutes(event.end);

//     let placed = false;

//     for (let group of groups) {
//       const overlaps = group.some((e) => {
//         const eStart = timeToMinutes(e.start);
//         const eEnd = timeToMinutes(e.end);
//         return start < eEnd && end > eStart;
//       });

//       if (overlaps) {
//         group.push(event);
//         placed = true;
//         break;
//       }
//     }

//     if (!placed) groups.push([event]);
//   });

//   return groups;
// };

// const START_HOUR = 9;
// const END_HOUR = 20;
// const ROW_HEIGHT = 64;

// /* ---------------- COMPONENT ---------------- */

// const ClassesSchedule = () => {
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const gridTemplate = "80px 60px 60px 1fr 60px 60px 1fr 1fr";

//   return (
//     <div className="bg-white rounded-2xl shadow p-6">
//       <h2 className="text-xl font-semibold text-[#0f5b54] mb-4">
//         Weekly Schedule (Pacific Time)
//       </h2>

//       {/* HEADER */}
//       <div
//         className="grid border rounded-t-xl bg-gray-100"
//         style={{ gridTemplateColumns: gridTemplate }}
//       >
//         <div className="text-center text-xs font-semibold py-2 border-r">
//           Time
//         </div>

//         {days.map((day) => (
//           <div
//             key={day.name}
//             className={`text-center py-2 font-semibold border-r ${
//               day.type === "small" ? "text-xs text-gray-400" : ""
//             }`}
//           >
//             {day.name.slice(0, 3)}
//           </div>
//         ))}
//       </div>

//       {/* GRID */}
//       <div
//         className="grid border border-t-0 rounded-b-xl overflow-hidden"
//         style={{ gridTemplateColumns: gridTemplate }}
//       >
//         {/* TIME COLUMN */}
//         <div className="bg-gray-50 border-r">
//           {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
//             <div
//               key={i}
//               className="h-16 flex items-center justify-center text-xs text-gray-500 border-b"
//             >
//               {START_HOUR + i}:00
//             </div>
//           ))}
//         </div>

//         {/* DAYS */}
//         {days.map((day) => {
//           const dayEvents = schedule.filter((e) => e.day === day.name);
//           const groups = getOverlappingGroups(dayEvents);

//           return (
//             <div
//               key={day.name}
//               className={`relative border-r h-[704px] ${
//                 day.type === "small" ? "bg-gray-50" : ""
//               }`}
//             >
//               {/* GRID LINES */}
//               {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
//                 <div key={i} className="h-16 border-b" />
//               ))}

//               {/* SMALL DAY LABEL */}
//               {day.type === "small" && (
//                 <div className="absolute top-2 w-full text-center text-[40px] text-gray-400">
//                   <p>
//                     <br />
//                   </p>
//                   <p>N</p>
//                   <p>O</p>
//                   <p>
//                     <br />
//                   </p>
//                   <p>C</p>
//                   <p>L</p>
//                   <p>A</p>
//                   <p>S</p>
//                   <p>S</p>
//                   <p>E</p>
//                   <p>S</p>
//                 </div>
//               )}

//               {/* EVENTS ONLY FOR LARGE DAYS */}
//               {day.type === "large" &&
//                 groups.map((group, gIdx) =>
//                   group.map((event, idx) => {
//                     const start = timeToMinutes(event.start);
//                     const end = timeToMinutes(event.end);

//                     const top = ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

//                     const height = ((end - start) / 60) * ROW_HEIGHT;

//                     const width = 100 / group.length;
//                     const left = idx * width;

//                     return (
//                       <div
//                         key={`${gIdx}-${idx}`}
//                         onClick={() => setSelectedEvent(event)}
//                         className={`absolute rounded-xl p-2 text-xs text-white shadow cursor-pointer transition hover:scale-[1.02]
//                           ${
//                             event.type === "online"
//                               ? "bg-blue-500"
//                               : "bg-[#0f5b54]"
//                           }
//                         `}
//                         style={{
//                           top: `${top}px`,
//                           height: `${height}px`,
//                           width: `${width - 2}%`,
//                           left: `${left + 1}%`,
//                         }}
//                       >
//                         <p className="font-semibold">{event.title}</p>
//                         <p className="text-[10px] opacity-90">
//                           {event.start} - {event.end}
//                         </p>
//                       </div>
//                     );
//                   }),
//                 )}
//             </div>
//           );
//         })}
//       </div>

//       {/* LEGEND */}
//       <div className="flex gap-6 mt-6 text-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-[#0f5b54] rounded"></div>
//           <span>In-Person Classes</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-blue-500 rounded"></div>
//           <span>Online Classes</span>
//         </div>
//       </div>

//       {/* MODAL */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
//             <button
//               onClick={() => setSelectedEvent(null)}
//               className="absolute top-3 right-3 text-gray-500"
//             >
//               ✕
//             </button>

//             <h3 className="text-lg font-semibold mb-2">
//               {selectedEvent.title}
//             </h3>

//             <p className="text-sm text-gray-600 mb-2">
//               {selectedEvent.start} - {selectedEvent.end}
//             </p>

//             <p className="text-sm mb-2">
//               <strong>Type:</strong>{" "}
//               {selectedEvent.type === "online" ? "Online" : "In-Person"}
//             </p>
//             <p className="text-sm">
//               <strong>Where:</strong>{" "}
//               {selectedEvent.where === "Webex" ? (
//                 "Webex"
//               ) : (
//                 <a
//                   href="https://www.google.com/maps/place/106+S+Park+Victoria+Dr,+Milpitas,+CA+95035"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   106 S Park Victoria Dr, Milpitas, CA 95035
//                 </a>
//               )}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassesSchedule;

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

/* ---------------- CONFIG ---------------- */

const days = [
  { name: "Monday", type: "small" },
  { name: "Tuesday", type: "small" },
  { name: "Wednesday", type: "large" },
  { name: "Thursday", type: "small" },
  { name: "Friday", type: "small" },
  { name: "Saturday", type: "large" },
  { name: "Sunday", type: "large" },
];

/* ---------------- HELPERS ---------------- */

const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const getOverlappingGroups = (events) => {
  const groups = [];

  events.forEach((event) => {
    const start = timeToMinutes(event.start);
    const end = timeToMinutes(event.end);

    let placed = false;

    for (let group of groups) {
      const overlaps = group.some((e) => {
        const eStart = timeToMinutes(e.start);
        const eEnd = timeToMinutes(e.end);
        return start < eEnd && end > eStart;
      });

      if (overlaps) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([event]);
  });

  return groups;
};

const START_HOUR = 9;
const END_HOUR = 20;
const ROW_HEIGHT = 64;

/* ---------------- COMPONENT ---------------- */

const ClassesSchedule = ({ user }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const [interestFormCompleted, setInterestFormCompleted] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [hasAssignedClasses, setHasAssignedClasses] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, [user, showAllClasses]);

  const fetchSchedule = async () => {
    try {
      setLoadingAssignments(true);
      let enrolledProgramIds = [];
      let paid = false;
      let assigned = false;

      if (user?.person_id) {
        const { data: application } = await supabase
          .from("volunteer_applications")
          .select("interest_form_completed")
          .eq("email", user.email)
          .maybeSingle();

        const formCompleted = application?.interest_form_completed === true;

        setInterestFormCompleted(formCompleted);

        // if (formCompleted) {
        //   // const { data: enrollments } = await supabase
        //   //   .from("enrollments")
        //   //   .select("program_id")
        //   //   .eq("student_id", user.person_id)
        //   //   .eq("enrollment_status", "active");

        //   // enrolledProgramIds = (enrollments || []).map((e) => e.program_id);
        //   const { data: assignedPrograms } = await supabase
        //     .from("person_programs")
        //     .select("program_id,status")
        //     .eq("person_id", user.person_id)
        //     .eq("status", "current");

        //   enrolledProgramIds = (assignedPrograms || []).map(
        //     (p) => p.program_id,
        //   );

        //   assigned = (assignedPrograms || []).length > 0;
        // }
        const { data: assignedPrograms } = await supabase
          .from("person_programs")
          .select("program_id,status")
          .eq("person_id", user.person_id)
          .eq("status", "current")
          .eq("role", "volunteer");

        enrolledProgramIds = (assignedPrograms || []).map((p) => p.program_id);

        assigned = (assignedPrograms || []).length > 0;
        setHasAssignedClasses(assigned);
      }

      const { data: programs } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true);

      const events = [];

      (programs || []).forEach((program) => {
        const isEnrolled = enrolledProgramIds.includes(program.id);

        if (assigned && !showAllClasses && !isEnrolled) {
          return;
        }

        (program.sections || []).forEach((section) => {
          events.push({
            day:
              section.day === "SUN"
                ? "Sunday"
                : section.day === "MON"
                  ? "Monday"
                  : section.day === "TUE"
                    ? "Tuesday"
                    : section.day === "WED"
                      ? "Wednesday"
                      : section.day === "THU"
                        ? "Thursday"
                        : section.day === "FRI"
                          ? "Friday"
                          : "Saturday",

            start: section.start_time,
            end: section.end_time,

            title: program.course_title,

            type: section.mode === "ONL" ? "online" : "inperson",

            where:
              section.mode === "ONL"
                ? section.meeting_link
                : section.meeting_location,

            enrolled: isEnrolled,
          });
        });
      });

      setSchedule(events);
      setLoadingAssignments(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const gridTemplate = "80px 60px 60px 1fr 60px 60px 1fr 1fr";

  if (loadingAssignments) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        Loading schedule...
      </div>
    );
  }

  // if (!interestFormCompleted) {
  //   return (
  //     <div className="bg-white rounded-2xl shadow p-10 text-center">
  //       <h2 className="text-2xl font-semibold text-[#0f5b54]">
  //         Complete Your Interest Form
  //       </h2>

  //       <p className="mt-3 text-gray-500 max-w-xl mx-auto">
  //         Please complete your volunteer interest form before viewing volunteer
  //         assignments.
  //       </p>
  //     </div>
  //   );
  // }
  if (!interestFormCompleted && !hasAssignedClasses) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <h2 className="text-2xl font-semibold text-[#0f5b54]">
          Complete Your Interest Form
        </h2>

        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Please complete your volunteer interest form so the team can review
          your preferences and assign classes.
        </p>
      </div>
    );
  }

  if (interestFormCompleted && !hasAssignedClasses) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <h2 className="text-2xl font-semibold text-[#0f5b54]">
          Volunteer Assignments Pending
        </h2>

        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Thank you for completing your volunteer interest form. Volunteer
          assignments are currently under review and will appear here once
          finalized by the Inclusive World team.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-[#0f5b54] mb-4">
        Weekly Schedule (Pacific Time)
      </h2>
      {/* {!interestFormCompleted && hasAssignedClasses && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Your class assignment is shown below. Please complete your volunteer
            interest form so Inclusive World has your latest preferences and
            support information.
          </p>
        </div>
      )} */}
      {hasAssignedClasses && (
        <div className="flex items-center gap-3 mb-4">
          <label className="font-medium text-sm">Show All Classes</label>

          <input
            type="checkbox"
            checked={showAllClasses}
            onChange={(e) => setShowAllClasses(e.target.checked)}
            className="w-4 h-4"
          />
        </div>
      )}
      {/* HEADER */}
      <div
        className="grid border rounded-t-xl bg-gray-100"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div className="text-center text-xs font-semibold py-2 border-r">
          Time
        </div>

        {days.map((day) => (
          <div
            key={day.name}
            className={`text-center py-2 font-semibold border-r ${
              day.type === "small" ? "text-xs text-gray-400" : ""
            }`}
          >
            {day.name.slice(0, 3)}
          </div>
        ))}
      </div>
      {/* GRID */}
      <div
        className="grid border border-t-0 rounded-b-xl overflow-hidden"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {/* TIME COLUMN */}
        <div className="bg-gray-50 border-r">
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
            <div
              key={i}
              className="h-16 flex items-center justify-center text-xs text-gray-500 border-b"
            >
              {START_HOUR + i}:00
            </div>
          ))}
        </div>

        {/* DAYS */}
        {days.map((day) => {
          const dayEvents = schedule.filter((e) => e.day === day.name);
          const groups = getOverlappingGroups(dayEvents);

          return (
            <div
              key={day.name}
              className={`relative border-r h-[704px] ${
                day.type === "small" ? "bg-gray-50" : ""
              }`}
            >
              {/* GRID LINES */}
              {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                <div key={i} className="h-16 border-b" />
              ))}

              {/* SMALL DAY LABEL */}
              {day.type === "small" && (
                <div className="absolute top-2 w-full text-center text-[40px] text-gray-400">
                  <p>
                    <br />
                  </p>
                  <p>N</p>
                  <p>O</p>
                  <p>
                    <br />
                  </p>
                  <p>C</p>
                  <p>L</p>
                  <p>A</p>
                  <p>S</p>
                  <p>S</p>
                  <p>E</p>
                  <p>S</p>
                </div>
              )}

              {/* EVENTS ONLY FOR LARGE DAYS */}
              {day.type === "large" &&
                groups.map((group, gIdx) =>
                  group.map((event, idx) => {
                    const start = timeToMinutes(event.start);
                    const end = timeToMinutes(event.end);

                    const top = ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

                    const height = ((end - start) / 60) * ROW_HEIGHT;

                    const width = 100 / group.length;
                    const left = idx * width;

                    return (
                      <div
                        key={`${gIdx}-${idx}`}
                        onClick={() => setSelectedEvent(event)}
                        className={`absolute rounded-xl p-2 text-xs text-white shadow cursor-pointer transition hover:scale-[1.02]
                          ${
                            event.enrolled
                              ? "bg-red-600"
                              : event.type === "online"
                                ? "bg-blue-500"
                                : "bg-[#0f5b54]"
                          }
                        `}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          width: `${width - 2}%`,
                          left: `${left + 1}%`,
                        }}
                      >
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-[10px] opacity-90">
                          {event.start} - {event.end}
                        </p>
                      </div>
                    );
                  }),
                )}
            </div>
          );
        })}
      </div>
      {/* LEGEND */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span>Enrolled Classes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#0f5b54] rounded"></div>
          <span>In-Person Classes</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Online Classes</span>
        </div>
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-2">
              {selectedEvent.title}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {selectedEvent.start} - {selectedEvent.end}
            </p>

            <p className="text-sm mb-2">
              <strong>Type:</strong>{" "}
              {selectedEvent.type === "online" ? "Online" : "In-Person"}
            </p>
            <p className="text-sm">
              <strong>Where:</strong>{" "}
              {selectedEvent.where === "Webex" ? (
                "Webex"
              ) : (
                <a
                  href="https://www.google.com/maps/place/106+S+Park+Victoria+Dr,+Milpitas,+CA+95035"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  106 S Park Victoria Dr, Milpitas, CA 95035
                </a>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesSchedule;
