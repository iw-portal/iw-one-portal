// // import { useEffect, useState } from "react";
// // import Navbar from "../../Common/Navbar";
// // import Footer from "../../Common/Footer";
// // import { supabase } from "../../../lib/supabase";

// // const DAYS = [
// //   { key: "MON", label: "Mon" },
// //   { key: "TUE", label: "Tue" },
// //   { key: "WED", label: "Wed" },
// //   { key: "THU", label: "Thu" },
// //   { key: "FRI", label: "Fri" },
// //   { key: "SAT", label: "Sat" },
// //   { key: "SUN", label: "Sun" },
// // ];

// // const START_HOUR = 8;
// // const END_HOUR = 21;
// // const ROW_HEIGHT = 72;

// // const timeToMinutes = (time) => {
// //   if (!time) return START_HOUR * 60;
// //   const [h, m] = time.split(":").map(Number);
// //   return h * 60 + (m || 0);
// // };

// // const formatTime = (time) => {
// //   if (!time) return "";
// //   const [hour, minute] = time.split(":");
// //   const date = new Date();
// //   date.setHours(Number(hour), Number(minute || 0));

// //   return date.toLocaleTimeString([], {
// //     hour: "numeric",
// //     minute: "2-digit",
// //   });
// // };

// // const getModeLabel = (mode) => {
// //   if (mode === "ONL") return "Online";
// //   if (mode === "IP") return "In-Person";
// //   return "TBD";
// // };

// // const getOverlappingGroups = (events) => {
// //   const sorted = [...events].sort(
// //     (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
// //   );

// //   const groups = [];

// //   sorted.forEach((event) => {
// //     const start = timeToMinutes(event.start);
// //     const end = event.end ? timeToMinutes(event.end) : start + 60;

// //     let group = groups.find((g) =>
// //       g.some((e) => {
// //         const eStart = timeToMinutes(e.start);
// //         const eEnd = e.end ? timeToMinutes(e.end) : eStart + 60;
// //         return start < eEnd && end > eStart;
// //       }),
// //     );

// //     if (group) group.push(event);
// //     else groups.push([event]);
// //   });

// //   return groups;
// // };

// // const Schedule = () => {
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchSchedule();
// //   }, []);

// //   const fetchSchedule = async () => {
// //     setLoading(true);

// //     const { data, error } = await supabase
// //       .from("programs")
// //       .select("*")
// //       .eq("is_active", true)
// //       .eq("is_archived", false)
// //       .eq("category", "vocational")
// //       .order("course_title");

// //     if (error) {
// //       console.error(error);
// //       setLoading(false);
// //       return;
// //     }

// //     const nextEvents = [];

// //     (data || []).forEach((program) => {
// //       (program.sections || []).forEach((section) => {
// //         if (!section.day) return;

// //         nextEvents.push({
// //           id: `${program.id}-${section.section || section.day}`,
// //           day: section.day,
// //           title: program.course_title,
// //           category: program.category,
// //           level: program.level,
// //           mode: section.mode,
// //           location: section.meeting_location,
// //           link: section.meeting_link,
// //           start: section.start_time,
// //           end: section.end_time,
// //           timeText: section.time_text,
// //         });
// //       });
// //     });

// //     setEvents(nextEvents);
// //     setLoading(false);
// //   };

// //   const calendarHeight = (END_HOUR - START_HOUR) * ROW_HEIGHT;

// //   return (
// //     <div className="bg-white min-h-screen">
// //       <Navbar />

// //       <main className="px-4 md:px-10 py-10">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="mb-8">
// //             <h1 className="text-4xl font-bold text-[#0f5b54]">
// //               Weekly Class Schedule
// //             </h1>
// //             <p className="text-gray-500 mt-2">
// //               Current class timings shown in Pacific Time.
// //             </p>
// //           </div>

// //           {loading ? (
// //             <div className="text-center text-gray-500 py-20">
// //               Loading schedule...
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto border rounded-3xl bg-white shadow-sm">
// //               <div className="min-w-[1200px]">
// //                 <div className="grid grid-cols-[90px_repeat(7,minmax(150px,1fr))] border-b bg-white sticky top-0 z-20">
// //                   <div className="border-r bg-gray-50" />

// //                   {DAYS.map((day) => (
// //                     <div
// //                       key={day.key}
// //                       className="py-4 text-center border-r last:border-r-0"
// //                     >
// //                       <p className="text-sm font-semibold text-gray-700">
// //                         {day.label}
// //                       </p>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 <div
// //                   className="grid grid-cols-[80px_repeat(7,1fr)] relative"
// //                   style={{ height: calendarHeight }}
// //                 >
// //                   <div className="border-r bg-gray-50">
// //                     {Array.from({ length: END_HOUR - START_HOUR }).map(
// //                       (_, index) => (
// //                         <div
// //                           key={index}
// //                           className="border-b text-xs text-gray-400 flex justify-center pt-2"
// //                           style={{ height: ROW_HEIGHT }}
// //                         >
// //                           {formatTime(`${START_HOUR + index}:00`)}
// //                         </div>
// //                       ),
// //                     )}
// //                   </div>

// //                   {DAYS.map((day) => {
// //                     const dayEvents = events.filter(
// //                       (event) => event.day === day.key,
// //                     );

// //                     return (
// //                       <div
// //                         key={day.key}
// //                         className="relative border-r last:border-r-0 bg-white"
// //                       >
// //                         {Array.from({ length: END_HOUR - START_HOUR }).map(
// //                           (_, index) => (
// //                             <div
// //                               key={index}
// //                               className="border-b border-gray-100"
// //                               style={{ height: ROW_HEIGHT }}
// //                             />
// //                           ),
// //                         )}

// //                         {/* {dayEvents.map((event) => {
// //                           const start = timeToMinutes(event.start);
// //                           const end = event.end
// //                             ? timeToMinutes(event.end)
// //                             : start + 60;

// //                           const top =
// //                             ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

// //                           const height = Math.max(
// //                             ((end - start) / 60) * ROW_HEIGHT,
// //                             48,
// //                           );

// //                           return (
// //                             <div
// //                               key={event.id}
// //                               className="absolute left-1 right-1 rounded-xl bg-[#0f5b54] text-white px-3 py-2 shadow-sm overflow-hidden"
// //                               style={{
// //                                 top,
// //                                 height,
// //                               }}
// //                             >
// //                               <p className="text-xs font-semibold truncate">
// //                                 {event.title}
// //                               </p>

// //                               <p className="text-[11px] opacity-90 mt-1">
// //                                 {event.start && event.end
// //                                   ? `${formatTime(event.start)} - ${formatTime(
// //                                       event.end,
// //                                     )}`
// //                                   : event.timeText || "Time TBD"}
// //                               </p>

// //                               <p className="text-[11px] opacity-90 mt-1">
// //                                 {getModeLabel(event.mode)}
// //                               </p>
// //                             </div>
// //                           );
// //                         })} */}

// //                         {getOverlappingGroups(dayEvents).map(
// //                           (group, groupIndex) =>
// //                             group.map((event, eventIndex) => {
// //                               const start = timeToMinutes(event.start);
// //                               const end = event.end
// //                                 ? timeToMinutes(event.end)
// //                                 : start + 60;

// //                               const top =
// //                                 ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

// //                               const height = Math.max(
// //                                 ((end - start) / 60) * ROW_HEIGHT,
// //                                 56,
// //                               );

// //                               const width = 100 / group.length;
// //                               const left = eventIndex * width;

// //                               return (
// //                                 <div
// //                                   key={`${event.id}-${groupIndex}-${eventIndex}`}
// //                                   className="absolute rounded-xl bg-[#0f5b54] text-white px-3 py-2 shadow-md overflow-hidden"
// //                                   style={{
// //                                     top,
// //                                     height,
// //                                     width: `calc(${width}% - 6px)`,
// //                                     left: `calc(${left}% + 3px)`,
// //                                   }}
// //                                 >
// //                                   <p className="text-xs font-semibold leading-tight line-clamp-2">
// //                                     {event.title}
// //                                   </p>

// //                                   <p className="text-[11px] opacity-90 mt-1">
// //                                     {event.start && event.end
// //                                       ? `${formatTime(event.start)} - ${formatTime(event.end)}`
// //                                       : event.timeText || "Time TBD"}
// //                                   </p>

// //                                   <p className="text-[11px] opacity-90 mt-1">
// //                                     {getModeLabel(event.mode)}
// //                                   </p>
// //                                 </div>
// //                               );
// //                             }),
// //                         )}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Schedule;

// import { useEffect, useState } from "react";
// import Navbar from "../../Common/Navbar";
// import Footer from "../../Common/Footer";
// import { supabase } from "../../../lib/supabase";

// const DAYS = [
//   { key: "MON", label: "Mon" },
//   { key: "TUE", label: "Tue" },
//   { key: "WED", label: "Wed" },
//   { key: "THU", label: "Thu" },
//   { key: "FRI", label: "Fri" },
//   { key: "SAT", label: "Sat" },
//   { key: "SUN", label: "Sun" },
// ];

// const START_HOUR = 8;
// const END_HOUR = 21;
// const ROW_HEIGHT = 72;
// const GRID_COLUMNS = "90px repeat(7, minmax(220px, 1fr))";

// const timeToMinutes = (time) => {
//   if (!time) return START_HOUR * 60;
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + (m || 0);
// };

// const formatTime = (time) => {
//   if (!time) return "";
//   const [hour, minute] = time.split(":");
//   const date = new Date();
//   date.setHours(Number(hour), Number(minute || 0));

//   return date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// };

// const getModeLabel = (mode) => {
//   if (mode === "ONL") return "Online";
//   if (mode === "IP") return "In-Person";
//   return "TBD";
// };

// const formatCategory = (value) => {
//   if (!value) return "—";

//   return value
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// const getOverlappingGroups = (events) => {
//   const sorted = [...events].sort(
//     (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
//   );

//   const groups = [];

//   sorted.forEach((event) => {
//     const start = timeToMinutes(event.start);
//     const end = event.end ? timeToMinutes(event.end) : start + 60;

//     const group = groups.find((g) =>
//       g.some((e) => {
//         const eStart = timeToMinutes(e.start);
//         const eEnd = e.end ? timeToMinutes(e.end) : eStart + 60;
//         return start < eEnd && end > eStart;
//       }),
//     );

//     if (group) group.push(event);
//     else groups.push([event]);
//   });

//   return groups;
// };

// const getEventColorClass = (mode) => {
//   if (mode === "ONL") {
//     return "bg-blue-600 hover:bg-blue-700";
//   }

//   if (mode === "IP") {
//     return "bg-orange-600 hover:bg-orange-700";
//   }

//   return "bg-[#0f5b54] hover:bg-[#0b4a45]";
// };

// const Schedule = () => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSchedule();
//   }, []);

//   const fetchSchedule = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("programs")
//       .select("*")
//       .eq("is_active", true)
//       .eq("is_archived", false)
//       .eq("category", "vocational")
//       .order("course_title");

//     if (error) {
//       console.error(error);
//       setLoading(false);
//       return;
//     }

//     const nextEvents = [];

//     (data || []).forEach((program) => {
//       (program.sections || []).forEach((section) => {
//         if (!section.day) return;

//         nextEvents.push({
//           id: `${program.id}-${section.section || section.day}`,
//           day: section.day,
//           title: program.course_title,
//           description: program.description,
//           category: program.category,
//           level: program.level,
//           duration: program.duration,
//           tracks: program.tracks || [],
//           mode: section.mode,
//           location: section.meeting_location,
//           link: section.meeting_link,
//           start: section.start_time,
//           end: section.end_time,
//           timeText: section.time_text,
//         });
//       });
//     });

//     setEvents(nextEvents);
//     setLoading(false);
//   };

//   const calendarHeight = (END_HOUR - START_HOUR) * ROW_HEIGHT;

//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />

//       <main className="px-4 md:px-10 py-10">
//         <div className="w-full max-w-[1700px] mx-auto">
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-[#0f5b54]">
//               Weekly Class Schedule
//             </h1>
//             <p className="text-gray-500 mt-2">
//               Current class timings shown in Pacific Time.
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center text-gray-500 py-20">
//               Loading schedule...
//             </div>
//           ) : (
//             <div className="overflow-x-auto border rounded-3xl bg-white shadow-sm">
//               <div className="min-w-[1650px]">
//                 <div
//                   className="grid border-b bg-white sticky top-0 z-20"
//                   style={{ gridTemplateColumns: GRID_COLUMNS }}
//                 >
//                   <div className="border-r bg-gray-50" />

//                   {DAYS.map((day) => (
//                     <div
//                       key={day.key}
//                       className="py-4 text-center border-r last:border-r-0"
//                     >
//                       <p className="text-sm font-semibold text-gray-700">
//                         {day.label}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <div
//                   className="grid relative"
//                   style={{
//                     height: calendarHeight,
//                     gridTemplateColumns: GRID_COLUMNS,
//                   }}
//                 >
//                   <div className="border-r bg-gray-50">
//                     {Array.from({ length: END_HOUR - START_HOUR }).map(
//                       (_, index) => (
//                         <div
//                           key={index}
//                           className="border-b text-xs text-gray-400 flex justify-center pt-2"
//                           style={{ height: ROW_HEIGHT }}
//                         >
//                           {formatTime(`${START_HOUR + index}:00`)}
//                         </div>
//                       ),
//                     )}
//                   </div>

//                   {DAYS.map((day) => {
//                     const dayEvents = events.filter(
//                       (event) => event.day === day.key,
//                     );

//                     return (
//                       <div
//                         key={day.key}
//                         className="relative border-r last:border-r-0 bg-white"
//                       >
//                         {Array.from({ length: END_HOUR - START_HOUR }).map(
//                           (_, index) => (
//                             <div
//                               key={index}
//                               className="border-b border-gray-100"
//                               style={{ height: ROW_HEIGHT }}
//                             />
//                           ),
//                         )}

//                         {getOverlappingGroups(dayEvents).map(
//                           (group, groupIndex) =>
//                             group.map((event, eventIndex) => {
//                               const start = timeToMinutes(event.start);
//                               const end = event.end
//                                 ? timeToMinutes(event.end)
//                                 : start + 60;

//                               const top =
//                                 ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

//                               const height = Math.max(
//                                 ((end - start) / 60) * ROW_HEIGHT,
//                                 64,
//                               );

//                               const width = 100 / group.length;
//                               const left = eventIndex * width;

//                               return (
//                                 <button
//                                   type="button"
//                                   key={`${event.id}-${groupIndex}-${eventIndex}`}
//                                   onClick={() => setSelectedEvent(event)}
//                                   className={`absolute rounded-xl text-white px-3 py-2 shadow-md overflow-hidden text-left hover:scale-[1.01] transition ${getEventColorClass(
//                                     event.mode,
//                                   )}`}
//                                   style={{
//                                     top,
//                                     height,
//                                     width: `calc(${width}% - 8px)`,
//                                     left: `calc(${left}% + 4px)`,
//                                   }}
//                                 >
//                                   <p className="text-xs font-semibold leading-tight line-clamp-2">
//                                     {event.title}
//                                   </p>

//                                   <p className="text-[11px] opacity-90 mt-1">
//                                     {event.start && event.end
//                                       ? `${formatTime(event.start)} - ${formatTime(event.end)}`
//                                       : event.timeText || "Time TBD"}
//                                   </p>

//                                   <p className="text-[11px] opacity-90 mt-1">
//                                     {getModeLabel(event.mode)}
//                                   </p>
//                                 </button>
//                               );
//                             }),
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}
//           {!loading && (
//             <div className="mt-6 flex justify-center">
//               <div className="inline-flex flex-wrap items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-sm">
//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-blue-600" />
//                   <span>Online</span>
//                 </div>

//                 <div className="h-5 w-px bg-gray-200" />

//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-orange-600" />
//                   <span>In-Person</span>
//                 </div>

//                 <div className="h-5 w-px bg-gray-200" />

//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-[#0f5b54]" />
//                   <span>Format TBD</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {selectedEvent && (
//         <div
//           className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
//           onClick={() => setSelectedEvent(null)}
//         >
//           <div
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-[#0f5b54]">
//                   {selectedEvent.title}
//                 </h2>

//                 <p className="text-sm text-gray-500 mt-1">
//                   {selectedEvent.start && selectedEvent.end
//                     ? `${formatTime(selectedEvent.start)} - ${formatTime(
//                         selectedEvent.end,
//                       )} PT`
//                     : selectedEvent.timeText || "Time TBD"}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedEvent(null)}
//                 className="text-gray-400 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <Info
//                 label="Category"
//                 value={formatCategory(selectedEvent.category)}
//               />
//               <Info label="Level" value={selectedEvent.level || "—"} />
//               <Info label="Duration" value={selectedEvent.duration || "—"} />
//               <Info label="Format" value={getModeLabel(selectedEvent.mode)} />
//             </div>

//             {(selectedEvent.location || selectedEvent.link) && (
//               <div className="mt-5 rounded-2xl bg-gray-50 border p-4">
//                 <p className="text-xs uppercase text-gray-500 font-semibold">
//                   Location
//                 </p>

//                 {selectedEvent.mode === "ONL" && selectedEvent.link ? (
//                   <a
//                     href={selectedEvent.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline break-words"
//                   >
//                     {selectedEvent.link}
//                   </a>
//                 ) : (
//                   <p className="text-gray-700 mt-1">
//                     {selectedEvent.location || "Online"}
//                   </p>
//                 )}
//               </div>
//             )}

//             {selectedEvent.tracks?.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-5">
//                 {selectedEvent.tracks.map((track) => (
//                   <span
//                     key={track}
//                     className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
//                   >
//                     {track}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {selectedEvent.description && (
//               <p className="text-gray-600 leading-relaxed mt-5 whitespace-pre-line">
//                 {selectedEvent.description}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div className="rounded-2xl bg-gray-50 border p-4">
//     <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
//     <p className="text-gray-800 font-medium mt-1 capitalize">{value}</p>
//   </div>
// );

// export default Schedule;

// import { useEffect, useState } from "react";
// import Navbar from "../../Common/Navbar";
// import Footer from "../../Common/Footer";
// import { supabase } from "../../../lib/supabase";

// const DAYS = [
//   { key: "MON", label: "Mon", fullLabel: "Monday" },
//   { key: "TUE", label: "Tue", fullLabel: "Tuesday" },
//   { key: "WED", label: "Wed", fullLabel: "Wednesday" },
//   { key: "THU", label: "Thu", fullLabel: "Thursday" },
//   { key: "FRI", label: "Fri", fullLabel: "Friday" },
//   { key: "SAT", label: "Sat", fullLabel: "Saturday" },
//   { key: "SUN", label: "Sun", fullLabel: "Sunday" },
// ];

// const START_HOUR = 8;
// const END_HOUR = 21;
// const ROW_HEIGHT = 72;
// const GRID_COLUMNS = "90px repeat(7, minmax(220px, 1fr))";

// const timeToMinutes = (time) => {
//   if (!time) return START_HOUR * 60;

//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + (m || 0);
// };

// const formatTime = (time) => {
//   if (!time) return "";

//   const [hour, minute] = time.split(":");
//   const date = new Date();
//   date.setHours(Number(hour), Number(minute || 0));

//   return date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// };

// const getModeLabel = (mode) => {
//   if (mode === "ONL") return "Online";
//   if (mode === "IP") return "In-Person";
//   return "TBD";
// };

// const formatCategory = (value) => {
//   if (!value) return "—";

//   return value
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// const getOverlappingGroups = (events) => {
//   const sorted = [...events].sort(
//     (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
//   );

//   const groups = [];

//   sorted.forEach((event) => {
//     const start = timeToMinutes(event.start);
//     const end = event.end ? timeToMinutes(event.end) : start + 60;

//     const group = groups.find((g) =>
//       g.some((existingEvent) => {
//         const existingStart = timeToMinutes(existingEvent.start);
//         const existingEnd = existingEvent.end
//           ? timeToMinutes(existingEvent.end)
//           : existingStart + 60;

//         return start < existingEnd && end > existingStart;
//       }),
//     );

//     if (group) {
//       group.push(event);
//     } else {
//       groups.push([event]);
//     }
//   });

//   return groups;
// };

// const getEventColorClass = (mode) => {
//   if (mode === "ONL") {
//     return "bg-blue-600 hover:bg-blue-700";
//   }

//   if (mode === "IP") {
//     return "bg-orange-600 hover:bg-orange-700";
//   }

//   return "bg-[#0f5b54] hover:bg-[#0b4a45]";
// };

// const Schedule = () => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSchedule();
//   }, []);

//   const fetchSchedule = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("programs")
//       .select("*")
//       .eq("is_active", true)
//       .eq("is_archived", false)
//       .order("course_title");

//     if (error) {
//       console.error(error);
//       setLoading(false);
//       return;
//     }

//     const nextEvents = [];

//     (data || []).forEach((program) => {
//       (program.sections || []).forEach((section, index) => {
//         if (!section.day) return;

//         nextEvents.push({
//           id: `${program.id}-${section.section || section.day}-${index}`,
//           day: section.day,
//           title: program.course_title,
//           description: program.description,
//           category: program.category,
//           level: program.level,
//           duration: program.duration,
//           tracks: program.tracks || [],
//           mode: section.mode,
//           location: section.meeting_location,
//           link: section.meeting_link,
//           start: section.start_time,
//           end: section.end_time,
//           timeText: section.time_text,
//         });
//       });
//     });

//     setEvents(nextEvents);
//     setLoading(false);
//   };

//   const calendarHeight = (END_HOUR - START_HOUR) * ROW_HEIGHT;

//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />

//       <main className="px-4 md:px-10 py-10">
//         <div className="w-full max-w-[1700px] mx-auto">
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-[#0f5b54]">
//               Weekly Class Schedule
//             </h1>

//             <p className="text-gray-500 mt-2">
//               Current class timings shown in Pacific Time.
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center text-gray-500 py-20">
//               Loading schedule...
//             </div>
//           ) : (
//             <div className="overflow-x-auto border rounded-3xl bg-white shadow-sm">
//               <div className="min-w-[1650px]">
//                 <div
//                   className="grid border-b bg-white sticky top-0 z-20"
//                   style={{ gridTemplateColumns: GRID_COLUMNS }}
//                 >
//                   <div className="border-r bg-gray-50" />

//                   {DAYS.map((day) => (
//                     <div
//                       key={day.key}
//                       className="py-4 text-center border-r last:border-r-0"
//                     >
//                       <p className="text-sm font-semibold text-gray-700">
//                         {day.label}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         {day.fullLabel}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <div
//                   className="grid relative"
//                   style={{
//                     height: calendarHeight,
//                     gridTemplateColumns: GRID_COLUMNS,
//                   }}
//                 >
//                   <div className="border-r bg-gray-50">
//                     {Array.from({ length: END_HOUR - START_HOUR }).map(
//                       (_, index) => (
//                         <div
//                           key={index}
//                           className="border-b text-xs text-gray-400 flex justify-center pt-2"
//                           style={{ height: ROW_HEIGHT }}
//                         >
//                           {formatTime(`${START_HOUR + index}:00`)}
//                         </div>
//                       ),
//                     )}
//                   </div>

//                   {DAYS.map((day) => {
//                     const dayEvents = events.filter(
//                       (event) => event.day === day.key,
//                     );

//                     const hasClasses = dayEvents.length > 0;
//                     const overlappingGroups = getOverlappingGroups(dayEvents);

//                     return (
//                       <div
//                         key={day.key}
//                         className="relative border-r last:border-r-0 bg-white"
//                       >
//                         {Array.from({ length: END_HOUR - START_HOUR }).map(
//                           (_, index) => (
//                             <div
//                               key={index}
//                               className="border-b border-gray-100"
//                               style={{ height: ROW_HEIGHT }}
//                             />
//                           ),
//                         )}

//                         {!hasClasses && (
//                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                             <div className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-gray-400">
//                               NO CLASSES
//                             </div>
//                           </div>
//                         )}

//                         {overlappingGroups.map((group, groupIndex) =>
//                           group.map((event, eventIndex) => {
//                             const start = timeToMinutes(event.start);
//                             const end = event.end
//                               ? timeToMinutes(event.end)
//                               : start + 60;

//                             const top =
//                               ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

//                             const height = Math.max(
//                               ((end - start) / 60) * ROW_HEIGHT,
//                               64,
//                             );

//                             const width = 100 / group.length;
//                             const left = eventIndex * width;

//                             return (
//                               <button
//                                 type="button"
//                                 key={`${event.id}-${groupIndex}-${eventIndex}`}
//                                 onClick={() => setSelectedEvent(event)}
//                                 className={`absolute rounded-xl text-white px-3 py-2 shadow-md overflow-hidden text-left hover:scale-[1.01] transition ${getEventColorClass(
//                                   event.mode,
//                                 )}`}
//                                 style={{
//                                   top,
//                                   height,
//                                   width: `calc(${width}% - 8px)`,
//                                   left: `calc(${left}% + 4px)`,
//                                 }}
//                               >
//                                 <p className="text-xs font-semibold leading-tight line-clamp-2">
//                                   {event.title}
//                                 </p>

//                                 <p className="text-[11px] opacity-90 mt-1">
//                                   {event.start && event.end
//                                     ? `${formatTime(event.start)} - ${formatTime(
//                                         event.end,
//                                       )}`
//                                     : event.timeText || "Time TBD"}
//                                 </p>

//                                 <p className="text-[11px] opacity-90 mt-1">
//                                   {getModeLabel(event.mode)}
//                                 </p>
//                               </button>
//                             );
//                           }),
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}

//           {!loading && (
//             <div className="mt-6 flex justify-center">
//               <div className="inline-flex flex-wrap items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-sm">
//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-blue-600" />
//                   <span>Online</span>
//                 </div>

//                 <div className="h-5 w-px bg-gray-200" />

//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-orange-600" />
//                   <span>In-Person</span>
//                 </div>

//                 <div className="h-5 w-px bg-gray-200" />

//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <span className="h-3 w-3 rounded-full bg-[#0f5b54]" />
//                   <span>Format TBD</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {selectedEvent && (
//         <div
//           className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
//           onClick={() => setSelectedEvent(null)}
//         >
//           <div
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-[#0f5b54]">
//                   {selectedEvent.title}
//                 </h2>

//                 <p className="text-sm text-gray-500 mt-1">
//                   {selectedEvent.start && selectedEvent.end
//                     ? `${formatTime(selectedEvent.start)} - ${formatTime(
//                         selectedEvent.end,
//                       )} PT`
//                     : selectedEvent.timeText || "Time TBD"}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedEvent(null)}
//                 className="text-gray-400 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <Info
//                 label="Category"
//                 value={formatCategory(selectedEvent.category)}
//               />
//               <Info label="Level" value={selectedEvent.level || "—"} />
//               <Info label="Duration" value={selectedEvent.duration || "—"} />
//               <Info label="Format" value={getModeLabel(selectedEvent.mode)} />
//             </div>

//             {(selectedEvent.location || selectedEvent.link) && (
//               <div className="mt-5 rounded-2xl bg-gray-50 border p-4">
//                 <p className="text-xs uppercase text-gray-500 font-semibold">
//                   Location
//                 </p>

//                 {selectedEvent.mode === "ONL" && selectedEvent.link ? (
//                   <a
//                     href={selectedEvent.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline break-words"
//                   >
//                     {selectedEvent.link}
//                   </a>
//                 ) : (
//                   <p className="text-gray-700 mt-1">
//                     {selectedEvent.location || "Location TBD"}
//                   </p>
//                 )}
//               </div>
//             )}

//             {selectedEvent.tracks?.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-5">
//                 {selectedEvent.tracks.map((track) => (
//                   <span
//                     key={track}
//                     className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
//                   >
//                     {track}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {selectedEvent.description && (
//               <p className="text-gray-600 leading-relaxed mt-5 whitespace-pre-line">
//                 {selectedEvent.description}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div className="rounded-2xl bg-gray-50 border p-4">
//     <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
//     <p className="text-gray-800 font-medium mt-1 capitalize">{value}</p>
//   </div>
// );

// export default Schedule;

import { useEffect, useState } from "react";
import Navbar from "../../Common/Navbar";
import Footer from "../../Common/Footer";
import { supabase } from "../../../lib/supabase";

const DAYS = [
  { key: "MON", label: "Mon", fullLabel: "Monday" },
  { key: "TUE", label: "Tue", fullLabel: "Tuesday" },
  { key: "WED", label: "Wed", fullLabel: "Wednesday" },
  { key: "THU", label: "Thu", fullLabel: "Thursday" },
  { key: "FRI", label: "Fri", fullLabel: "Friday" },
  { key: "SAT", label: "Sat", fullLabel: "Saturday" },
  { key: "SUN", label: "Sun", fullLabel: "Sunday" },
];

const START_HOUR = 8;
const END_HOUR = 21;
const ROW_HEIGHT = 72;

const timeToMinutes = (time) => {
  if (!time) return START_HOUR * 60;

  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute || 0));

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getModeLabel = (mode) => {
  if (mode === "ONL") return "Online";
  if (mode === "IP") return "In-Person";
  return "TBD";
};

const formatCategory = (value) => {
  if (!value) return "—";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getOverlappingGroups = (events) => {
  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
  );

  const groups = [];

  sorted.forEach((event) => {
    const start = timeToMinutes(event.start);
    const end = event.end ? timeToMinutes(event.end) : start + 60;

    const group = groups.find((g) =>
      g.some((existingEvent) => {
        const existingStart = timeToMinutes(existingEvent.start);
        const existingEnd = existingEvent.end
          ? timeToMinutes(existingEvent.end)
          : existingStart + 60;

        return start < existingEnd && end > existingStart;
      }),
    );

    if (group) group.push(event);
    else groups.push([event]);
  });

  return groups;
};

const getEventColorClass = (mode) => {
  if (mode === "ONL") return "bg-blue-600 hover:bg-blue-700";
  if (mode === "IP") return "bg-orange-600 hover:bg-orange-700";
  return "bg-[#0f5b54] hover:bg-[#0b4a45]";
};

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .eq("is_archived", false)
      .order("course_title");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const nextEvents = [];

    (data || []).forEach((program) => {
      (program.sections || []).forEach((section, index) => {
        if (!section.day) return;

        nextEvents.push({
          id: `${program.id}-${section.section || section.day}-${index}`,
          day: section.day,
          title: program.course_title,
          description: program.description,
          category: program.category,
          level: program.level,
          duration: program.duration,
          tracks: program.tracks || [],
          mode: section.mode,
          location: section.meeting_location,
          link: section.meeting_link,
          start: section.start_time,
          end: section.end_time,
          timeText: section.time_text,
        });
      });
    });

    setEvents(nextEvents);
    setLoading(false);
  };

  const calendarHeight = (END_HOUR - START_HOUR) * ROW_HEIGHT;

  const dayEventMap = DAYS.reduce((acc, day) => {
    acc[day.key] = events.filter((event) => event.day === day.key);
    return acc;
  }, {});

  const gridTemplateColumns = [
    "90px",
    ...DAYS.map((day) =>
      dayEventMap[day.key]?.length > 0
        ? "minmax(280px, 1.5fr)"
        : "minmax(90px, 0.45fr)",
    ),
  ].join(" ");

  const minGridWidth =
    90 +
    DAYS.reduce(
      (total, day) => total + (dayEventMap[day.key]?.length > 0 ? 300 : 95),
      0,
    );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="px-4 md:px-10 py-10">
        <div className="w-full max-w-[1700px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0f5b54]">
              Weekly Class Schedule
            </h1>

            <p className="text-gray-500 mt-2">
              Current class timings shown in Pacific Time.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-20">
              Loading schedule...
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-3xl bg-white shadow-sm">
              <div style={{ minWidth: `${minGridWidth}px` }}>
                <div
                  className="grid border-b bg-white sticky top-0 z-20"
                  style={{ gridTemplateColumns }}
                >
                  <div className="border-r border-gray-100 bg-gray-50" />

                  {DAYS.map((day) => {
                    const hasClasses = dayEventMap[day.key]?.length > 0;

                    return (
                      <div
                        key={day.key}
                        className={`py-4 text-center border-r border-gray-100 last:border-r-0 ${
                          hasClasses ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-700">
                          {day.label}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {day.fullLabel}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="grid relative"
                  style={{
                    height: calendarHeight,
                    gridTemplateColumns,
                  }}
                >
                  <div className="border-r border-gray-100 bg-gray-50">
                    {Array.from({ length: END_HOUR - START_HOUR }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 text-xs text-gray-400 flex justify-center pt-2"
                          style={{ height: ROW_HEIGHT }}
                        >
                          {formatTime(`${START_HOUR + index}:00`)}
                        </div>
                      ),
                    )}
                  </div>

                  {DAYS.map((day) => {
                    const dayEvents = dayEventMap[day.key] || [];
                    const hasClasses = dayEvents.length > 0;
                    const overlappingGroups = getOverlappingGroups(dayEvents);

                    return (
                      <div
                        key={day.key}
                        className={`relative border-r border-gray-100 last:border-r-0 ${
                          hasClasses ? "bg-white" : "bg-gray-50/70"
                        }`}
                      >
                        {Array.from({ length: END_HOUR - START_HOUR }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-100"
                              style={{ height: ROW_HEIGHT }}
                            />
                          ),
                        )}

                        {!hasClasses && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="rotate-[-90deg] whitespace-nowrap text-2xl font-bold tracking-[0.35em] text-gray-300">
                              NO CLASSES
                            </div>
                          </div>
                        )}

                        {overlappingGroups.map((group, groupIndex) =>
                          group.map((event, eventIndex) => {
                            const start = timeToMinutes(event.start);
                            const end = event.end
                              ? timeToMinutes(event.end)
                              : start + 60;

                            const top =
                              ((start - START_HOUR * 60) / 60) * ROW_HEIGHT;

                            const height = Math.max(
                              ((end - start) / 60) * ROW_HEIGHT,
                              64,
                            );

                            const width = 100 / group.length;
                            const left = eventIndex * width;

                            return (
                              <button
                                type="button"
                                key={`${event.id}-${groupIndex}-${eventIndex}`}
                                onClick={() => setSelectedEvent(event)}
                                className={`absolute rounded-2xl text-white px-3 py-2 shadow-md overflow-hidden text-left hover:scale-[1.01] transition ${getEventColorClass(
                                  event.mode,
                                )}`}
                                style={{
                                  top,
                                  height,
                                  width: `calc(${width}% - 10px)`,
                                  left: `calc(${left}% + 5px)`,
                                }}
                              >
                                <p className="text-xs font-semibold leading-tight line-clamp-2">
                                  {event.title}
                                </p>

                                <p className="text-[11px] opacity-90 mt-1">
                                  {event.start && event.end
                                    ? `${formatTime(event.start)} - ${formatTime(
                                        event.end,
                                      )}`
                                    : event.timeText || "Time TBD"}
                                </p>

                                <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                                  {getModeLabel(event.mode)}
                                </span>
                              </button>
                            );
                          }),
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="mt-6 flex justify-center">
              <div className="inline-flex flex-wrap items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span>Online</span>
                </div>

                <div className="h-5 w-px bg-gray-200" />

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="h-3 w-3 rounded-full bg-orange-600" />
                  <span>In-Person</span>
                </div>

                <div className="h-5 w-px bg-gray-200" />

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="h-3 w-3 rounded-full bg-[#0f5b54]" />
                  <span>Format TBD</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0f5b54]">
                  {selectedEvent.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedEvent.start && selectedEvent.end
                    ? `${formatTime(selectedEvent.start)} - ${formatTime(
                        selectedEvent.end,
                      )} PT`
                    : selectedEvent.timeText || "Time TBD"}
                </p>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Info
                label="Category"
                value={formatCategory(selectedEvent.category)}
              />
              <Info label="Level" value={selectedEvent.level || "—"} />
              <Info label="Duration" value={selectedEvent.duration || "—"} />
              <Info label="Format" value={getModeLabel(selectedEvent.mode)} />
            </div>

            {(selectedEvent.location || selectedEvent.link) && (
              <div className="mt-5 rounded-2xl bg-gray-50 border p-4">
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Location
                </p>

                {selectedEvent.mode === "ONL" && selectedEvent.link ? (
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-words"
                  >
                    {selectedEvent.link}
                  </a>
                ) : (
                  <p className="text-gray-700 mt-1">
                    {selectedEvent.location || "Location TBD"}
                  </p>
                )}
              </div>
            )}

            {selectedEvent.tracks?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {selectedEvent.tracks.map((track) => (
                  <span
                    key={track}
                    className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
                  >
                    {track}
                  </span>
                ))}
              </div>
            )}

            {selectedEvent.description && (
              <p className="text-gray-600 leading-relaxed mt-5 whitespace-pre-line">
                {selectedEvent.description}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-2xl bg-gray-50 border p-4">
    <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
    <p className="text-gray-800 font-medium mt-1 capitalize">{value}</p>
  </div>
);

export default Schedule;
