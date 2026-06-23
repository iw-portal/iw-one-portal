import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Pencil } from "lucide-react";
import Papa from "papaparse";

const BUCKET = "images";
const FOLDER = "programs";

const supabaseUrl = "https://rvcronfsjghrpskywlwh.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_SECRET_KEY;
const supabase2 = createClient(supabaseUrl, supabaseKey);

// const CATEGORY_OPTIONS = [
//   { value: "vocational", label: "Vocational" },
//   { value: "non_vocational", label: "Non-Vocational" },
//   { value: "employment_services", label: "Employment Services" },
//   { value: "academic_counseling", label: "Academic Counseling" },
//   { value: "person_centered_services", label: "Person Centered Services" },
// ];

// const FORMAT_OPTIONS = [
//   { value: "ONL", label: "Online" },
//   { value: "IP", label: "In-Person" },
// ];

// const Programs = () => {
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [leads, setLeads] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [mode, setMode] = useState("add");

//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageMode, setImageMode] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("active");
//   const [programRoster, setProgramRoster] = useState({
//     lead: null,
//     coLead: null,
//     members: [],
//     volunteers: [],
//   });

//   const [newProgram, setNewProgram] = useState({
//     course_title: "",
//     description: "",
//     level: "",
//     duration: "",
//     academic_year: "",
//     category: "",
//     prerequisites: "",
//     review: "",
//     system_requirement: "",
//     day: "",
//     section: "",
//     mode: "",
//     is_active: true,
//     is_archived: false,
//     image_url: "",
//     member_capacity: 6,
//     volunteer_capacity: 8,
//     lead_id: "",
//     co_lead_id: "",
//   });

//   /* ---------------- HELPERS ---------------- */

//   const generateCourseCode = ({
//     title = "",
//     category,
//     academic_year,
//     day,
//     section,
//     mode,
//     level,
//   } = {}) => {
//     if (!title) return ""; // 🛑 prevent crash

//     const org = "IW";
//     const track = title
//       .replace(/[^a-zA-Z ]/g, "")
//       .split(" ")
//       .map((w) => w.slice(0, 1))
//       .join("")
//       .toUpperCase()
//       .slice(0, 10);

//     const levelMap = {
//       beginner: "I",
//       intermediate: "II",
//       advanced: "III",
//     };

//     const levelCode = levelMap[level] || null;

//     const year = academic_year || "2025";
//     const dayCode = day?.toUpperCase();

//     let code = `${org}-${year}-${dayCode}`;
//     code += `-${track}`;
//     // ✅ ONLY add level if not "none"
//     if (levelCode) code += `-${levelCode}`;
//     if (section) code += `-${section}`;
//     if (mode) code += `-${mode.toUpperCase()}`;

//     return code;
//   };

//   /* ---------------- IMAGE LOGIC ---------------- */

//   const fetchImages = async () => {
//     const { data, error } = await supabase.storage
//       .from(BUCKET)
//       .list(FOLDER, { limit: 100 });

//     if (error) return console.error(error);

//     const urls = data.map((file) => {
//       const { data: publicUrl } = supabase.storage
//         .from(BUCKET)
//         .getPublicUrl(`${FOLDER}/${file.name}`);

//       return publicUrl.publicUrl;
//     });

//     setImages(urls);
//   };

//   const handleUploadImage = async (file) => {
//     if (!file) return;

//     setUploading(true);

//     const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
//     const filePath = `${FOLDER}/${fileName}`;

//     const { error } = await supabase.storage
//       .from(BUCKET)
//       .upload(filePath, file);

//     if (error) {
//       console.error(error);
//       alert("Upload failed");
//       setUploading(false);
//       return;
//     }

//     const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

//     setNewProgram((prev) => ({
//       ...prev,
//       image_url: data.publicUrl,
//     }));

//     setUploading(false);
//     fetchImages(); // refresh list
//   };

//   /* ---------------- DATA FETCH ---------------- */

//   // const fetchPrograms = async () => {
//   //   setLoading(true);
//   //   const { data, error } = await supabase.from("programs").select("*");

//   //   if (error) {
//   //     console.error(error);
//   //     return setLoading(false);
//   //   }

//   //   setPrograms(data);
//   //   setLoading(false);
//   // };

//   const fetchPrograms = async () => {
//     setLoading(true);

//     let query = supabase.from("programs").select("*");

//     if (statusFilter === "active") {
//       query = query.eq("is_active", true).eq("is_archived", false);
//     }

//     if (statusFilter === "archived") {
//       query = query.eq("is_archived", true).eq("is_active", false);
//     }

//     const { data, error } = await query.order("created_at", {
//       ascending: false,
//     });

//     if (error) {
//       console.error(error);
//       setLoading(false);
//       return;
//     }

//     setPrograms(data || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPrograms();
//   }, [statusFilter]);

//   useEffect(() => {
//     if (showForm) fetchImages();
//   }, [showForm]);

//   useEffect(() => {
//     if (images.length > 0) setImageMode("select");
//     else setImageMode("upload");
//   }, [images]);

//   useEffect(() => {
//     const fetchLeads = async () => {
//       const { data, error } = await supabase
//         .from("people")
//         .select("id, fname, lname")
//         .in("role", ["lead"]);

//       if (error) {
//         console.error(error);
//         return;
//       }

//       setLeads(data || []);
//     };

//     fetchLeads();
//   }, []);

//   const fetchProgramRoster = async (programId) => {
//     try {
//       // Lead + Co-Lead
//       const { data: program } = await supabase
//         .from("programs")
//         .select(
//           `
//         lead_id,
//         co_lead_id,
//         member_enrolled,
//         volunteer_enrolled
//       `,
//         )
//         .eq("id", programId)
//         .single();

//       let lead = null;
//       let coLead = null;

//       if (program?.lead_id) {
//         const { data } = await supabase
//           .from("people")
//           .select("id,fname,lname,email")
//           .eq("id", program.lead_id)
//           .single();

//         lead = data;
//       }

//       if (program?.co_lead_id) {
//         const { data } = await supabase
//           .from("people")
//           .select("id,fname,lname,email")
//           .eq("id", program.co_lead_id)
//           .single();

//         coLead = data;
//       }

//       // Members + Volunteers
//       const { data: enrollments } = await supabase
//         .from("person_programs")
//         .select(
//           `
//         role,
//         people (
//           id,
//           fname,
//           lname,
//           email
//         )
//       `,
//         )
//         .eq("program_id", programId)
//         .eq("status", "current");

//       const members =
//         enrollments?.filter((e) => e.role === "member").map((e) => e.people) ||
//         [];

//       const volunteers =
//         enrollments
//           ?.filter((e) => e.role === "volunteer")
//           .map((e) => e.people) || [];

//       setProgramRoster({
//         lead,
//         coLead,
//         members,
//         volunteers,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ---------------- CRUD ---------------- */

//   // const handleAddProgram = async () => {
//   //   if (!newProgram.course_title) return alert("Title required");
//   //   if (!newProgram.image_url) return alert("Please select an image");

//   //   const { error } = await supabase.from("programs").insert([
//   //     {
//   //       ...newProgram,
//   //       course_code: generateCourseCode({
//   //         title: newProgram.course_title,
//   //         category: newProgram.category,
//   //         academic_year: newProgram.academic_year,
//   //         day: newProgram.day,
//   //         section: newProgram.section,
//   //         mode: newProgram.mode,
//   //       }),
//   //     },
//   //   ]);

//   //   if (error) return alert("Error adding program");

//   //   resetForm();
//   // };

//   // const handleAddProgram = async () => {
//   //   const { day, mode, section, ...dbData } = newProgram;

//   //   const { error } = await supabase.from("programs").insert([
//   //     {
//   //       ...dbData,
//   //       course_code: generateCourseCode({
//   //         title: newProgram.course_title,
//   //         academic_year: newProgram.academic_year,
//   //         day: newProgram.day,
//   //         section: newProgram.section,
//   //         mode: newProgram.mode,
//   //         level: newProgram.level,
//   //       }),
//   //     },
//   //   ]);

//   //   if (error) {
//   //     console.error(error);
//   //     return alert("Error adding program");
//   //   }

//   //   resetForm();
//   // };

//   const handleAddProgram = async () => {
//     for (const sec of newProgram.sections) {
//       if (sec.start_time && sec.end_time && sec.start_time >= sec.end_time) {
//         return alert(
//           `Section ${sec.section}: start time must be before end time.`,
//         );
//       }

//       if (sec.mode === "IP" && !sec.meeting_location?.trim()) {
//         return alert(
//           `Section ${sec.section}: meeting location/address is required for in-person classes.`,
//         );
//       }
//     }
//     if (!newProgram.course_title) return alert("Title required");
//     if (!newProgram.image_url) return alert("Select image");

//     if (!newProgram.sections || newProgram.sections.length === 0) {
//       return alert("Add at least one section");
//     }

//     // 🔥 CREATE MULTIPLE ROWS
//     // const rows = newProgram.sections.map((sec, idx) => ({
//     //   course_title: newProgram.course_title,
//     //   description: newProgram.description || "",
//     //   level: newProgram.level || "",
//     //   duration: newProgram.duration || "",
//     //   academic_year: newProgram.academic_year || "",
//     //   category: newProgram.category || "",
//     //   prerequisites: newProgram.prerequisites || "",
//     //   review: newProgram.review || "",
//     //   system_requirement: newProgram.system_requirement || "",
//     //   image_url: newProgram.image_url,
//     //   is_active: true,
//     //   is_archived: false,

//     //   // ✅ each row gets UNIQUE code
//     //   course_code: generateCourseCode({
//     //     title: newProgram.course_title,
//     //     academic_year: newProgram.academic_year,
//     //     day: sec.day,
//     //     section: idx + 1,
//     //     mode: sec.mode,
//     //     level: newProgram.level,
//     //   }),
//     // }));

//     const rows = newProgram.sections.map((sec, idx) => ({
//       course_title: newProgram.course_title,
//       description: newProgram.description || "",
//       level: newProgram.level || "",
//       duration: newProgram.duration || "",
//       academic_year: newProgram.academic_year || "",
//       category: newProgram.category || "",
//       prerequisites: newProgram.prerequisites || "",
//       review: newProgram.review || "",
//       system_requirement: newProgram.system_requirement || "",
//       image_url: newProgram.image_url,
//       is_active: true,
//       is_archived: false,

//       day: sec.day,
//       mode: sec.mode,

//       // 🔥 ADD THESE
//       lead_id: sec.lead_id,
//       co_lead_id: sec.co_lead_id || null,

//       course_code: generateCourseCode({
//         title: newProgram.course_title,
//         academic_year: newProgram.academic_year,
//         day: sec.day,
//         section: idx + 1,
//         mode: sec.mode,
//         level: newProgram.level,
//       }),
//       member_capacity: newProgram.member_capacity,
//       volunteer_capacity: newProgram.volunteer_capacity,
//     }));

//     const { error } = await supabase.from("programs").insert([
//       {
//         course_title: newProgram.course_title,
//         description: newProgram.description || "",
//         level: newProgram.level || "",
//         duration: newProgram.duration || "",
//         academic_year: newProgram.academic_year || "",
//         category: newProgram.category || "",
//         prerequisites: newProgram.prerequisites || "",
//         review: newProgram.review || "",
//         system_requirement: newProgram.system_requirement || "",
//         image_url: newProgram.image_url,
//         is_active: true,
//         is_archived: false,

//         sections: newProgram.sections,

//         course_code: generateCourseCode({
//           title: newProgram.course_title,
//           academic_year: newProgram.academic_year,
//           level: newProgram.level,
//         }),
//         member_capacity: newProgram.member_capacity,
//         volunteer_capacity: newProgram.volunteer_capacity,
//         lead_id: newProgram.sections?.[0]?.lead_id || null,
//         co_lead_id: newProgram.sections?.[0]?.co_lead_id || null,
//       },
//     ]);

//     if (error) {
//       console.error(error);
//       return alert("Error adding program");
//     }

//     resetForm();
//   };

//   const handleUpdateProgram = async () => {
//     const { id, day, mode, section, ...dbData } = newProgram;

//     for (const sec of newProgram.sections || []) {
//       if (sec.start_time && sec.end_time && sec.start_time >= sec.end_time) {
//         return alert(
//           `Section ${sec.section}: start time must be before end time.`,
//         );
//       }

//       if (sec.mode === "IP" && !sec.meeting_location?.trim()) {
//         return alert(
//           `Section ${sec.section}: meeting location/address is required for in-person classes.`,
//         );
//       }
//     }

//     const { error } = await supabase
//       .from("programs")
//       .update({
//         ...dbData,
//         course_code: generateCourseCode({
//           title: newProgram.course_title,
//           academic_year: newProgram.academic_year,
//           day: newProgram.day,
//           section: newProgram.section,
//           mode: newProgram.mode,
//           level: newProgram.level,
//         }),
//         lead_id: newProgram.sections?.[0]?.lead_id || null,
//         co_lead_id: newProgram.sections?.[0]?.co_lead_id || null,
//       })
//       .eq("id", selectedProgram.id);

//     if (error) {
//       console.error(error);
//       return alert("Update failed");
//     }

//     resetForm();
//   };

//   // const handleUpdateProgram = async () => {
//   //   const { id, ...updatedData } = newProgram;

//   //   const { error } = await supabase
//   //     .from("programs")
//   //     .update(updatedData)
//   //     .eq("id", selectedProgram.id);

//   //   if (error) {
//   //     console.error(error);
//   //     return alert("Update failed");
//   //   }

//   //   resetForm();
//   // };

//   const handleDeleteProgram = async () => {
//     const { error } = await supabase
//       .from("programs")
//       .delete()
//       .eq("id", selectedProgram.id);

//     if (error) return alert("Delete failed");

//     resetForm();
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setSelectedProgram(null);
//     setSelectedFile(null);

//     setNewProgram({
//       course_title: "",
//       description: "",
//       level: "",
//       duration: "",
//       academic_year: "",
//       category: "",
//       prerequisites: "",
//       review: "",
//       system_requirement: "",
//       day: "",
//       sections: [""],
//       mode: "",
//       is_active: true,
//       is_archived: false,
//       image_url: "",
//       member_capacity: 6,
//       volunteer_capacity: 8,
//     });

//     fetchPrograms();
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-bold">Programs</h1>
//         <button
//           onClick={() => {
//             setMode("add");
//             resetForm();
//             setShowForm(true);
//           }}
//           className="bg-teal-800 text-white px-4 py-2 rounded"
//         >
//           + Add Program
//         </button>
//       </div>

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

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {programs.map((p) => (
//             <div
//               key={p.id}
//               onClick={() => {
//                 setSelectedProgram(p);
//                 fetchProgramRoster(p.id);
//               }}
//               className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
//             >
//               {/* IMAGE */}
//               {p.image_url && (
//                 <div className="h-50 flex items-center justify-center overflow-hidden">
//                   <img
//                     src={p.image_url}
//                     alt={p.course_title}
//                     className="h-full w-full object-contain p-3 transition"
//                   />
//                 </div>
//               )}

//               {/* CONTENT */}
//               <div className="p-4 flex flex-col gap-2">
//                 {/* Title */}
//                 <h2 className="text-xl font-semibold text-gray-800 leading-tight line-clamp-2">
//                   {p.course_title}
//                 </h2>

//                 {/* Code */}
//                 {p.course_code && (
//                   <p className="text-sm text-gray-600 tracking-wide">
//                     {p.course_code}
//                   </p>
//                 )}

//                 {/* Meta row */}
//                 <div className="flex justify-between text-md text-gray-500">
//                   <span>
//                     {p.level
//                       ? p.level.charAt(0).toUpperCase() + p.level.slice(1)
//                       : "No Level"}
//                   </span>
//                   <span>{p.mode || "—"}</span>
//                 </div>

//                 {/* Action */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // 🛑 prevents card click
//                     setSelectedProgram(p);
//                     // setNewProgram(p);
//                     setNewProgram({
//                       ...p,
//                       sections: p.sections?.map((s, idx) => ({
//                         ...s,
//                         lead_id: idx === 0 ? p.lead_id : s.lead_id,
//                         co_lead_id: idx === 0 ? p.co_lead_id : s.co_lead_id,
//                       })),
//                     });
//                     setMode("edit");
//                     setShowForm(true);
//                   }}
//                   className="mt-3 w-full bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700 transition"
//                 >
//                   Manage
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedProgram && !showForm && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={() => setSelectedProgram(null)}
//         >
//           <div
//             className="bg-white rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* HEADER */}
//             <div className="flex justify-between items-start mb-4">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {selectedProgram.course_title}
//               </h2>

//               <button
//                 onClick={() => setSelectedProgram(null)}
//                 className="text-gray-400 hover:text-gray-700 text-lg"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* IMAGE */}
//             {selectedProgram.image_url && (
//               <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
//                 <img
//                   src={selectedProgram.image_url}
//                   className="h-full object-contain"
//                 />
//               </div>
//             )}

//             {/* DETAILS */}
//             <div className="space-y-3 text-sm text-gray-600">
//               <p>
//                 <b>Code:</b> {selectedProgram.course_code}
//               </p>
//               <p>
//                 <b>Level:</b> {selectedProgram.level || "None"}
//               </p>
//               <p>
//                 <b>Duration:</b> {selectedProgram.duration}
//               </p>
//               <p>
//                 <b>Category:</b>{" "}
//                 {(() => {
//                   try {
//                     const categories = JSON.parse(selectedProgram.category);
//                     return categories.join(", ");
//                   } catch {
//                     return selectedProgram.category || "—";
//                   }
//                 })()}
//               </p>
//               <p>
//                 <b>Academic Year:</b> {selectedProgram.academic_year}
//               </p>
//               <p>
//                 <b>Day:</b> {selectedProgram.day}
//               </p>
//               <p>
//                 <b>Mode:</b> {selectedProgram.mode}
//               </p>

//               <p>
//                 <b>Description:</b>
//                 <br /> {selectedProgram.description}
//               </p>

//               <div className="border rounded-xl p-4 bg-gray-50 space-y-4">
//                 <h3 className="font-semibold text-gray-800">
//                   Enrollment Capacity
//                 </h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Member Seats
//                     </label>

//                     <p>{selectedProgram.member_capacity ?? 6}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Volunteer Seats
//                     </label>

//                     <p>{selectedProgram.volunteer_capacity ?? 8}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
//                 <div className="px-5 py-4 border-b bg-slate-50">
//                   <h3 className="font-semibold text-lg text-slate-800">
//                     Program Team & Enrollment
//                   </h3>
//                 </div>

//                 <div className="p-5 space-y-6">
//                   {/* Leadership */}
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div className="bg-slate-50 rounded-xl p-4">
//                       <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
//                         Lead
//                       </p>

//                       <p className="font-medium text-slate-800">
//                         {programRoster.lead
//                           ? `${programRoster.lead.fname} ${programRoster.lead.lname}`
//                           : "Not Assigned"}
//                       </p>
//                     </div>

//                     <div className="bg-slate-50 rounded-xl p-4">
//                       <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
//                         Co-Lead
//                       </p>

//                       <p className="font-medium text-slate-800">
//                         {programRoster.coLead
//                           ? `${programRoster.coLead.fname} ${programRoster.coLead.lname}`
//                           : "Not Assigned"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Enrollment Stats */}
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <div className="flex justify-between mb-2">
//                         <span className="font-medium">Members</span>
//                         <span className="font-medium text-slate-600 tabular-nums">
//                           {programRoster.members.length}/
//                           {selectedProgram.member_capacity}
//                         </span>
//                       </div>

//                       <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-blue-500"
//                           style={{
//                             width: `${
//                               (programRoster.members.length /
//                                 selectedProgram.member_capacity) *
//                               100
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <div className="flex justify-between mb-2">
//                         <span className="font-medium">Volunteers</span>
//                         <span className="font-medium text-slate-600 tabular-nums">
//                           {programRoster.volunteers.length}/
//                           {selectedProgram.volunteer_capacity}
//                         </span>
//                       </div>

//                       <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-emerald-500"
//                           style={{
//                             width: `${
//                               (programRoster.volunteers.length /
//                                 selectedProgram.volunteer_capacity) *
//                               100
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Members */}
//                   <div>
//                     <h4 className="font-semibold mb-3">
//                       Members ({programRoster.members.length})
//                     </h4>

//                     <div className="flex flex-wrap gap-2">
//                       {programRoster.members.length ? (
//                         programRoster.members.map((m) => (
//                           <span
//                             key={m.id}
//                             className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
//                           >
//                             {m.fname} {m.lname}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-slate-500 text-sm">
//                           No members enrolled
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Volunteers */}
//                   <div>
//                     <h4 className="font-semibold mb-3">
//                       Volunteers ({programRoster.volunteers.length})
//                     </h4>

//                     <div className="flex flex-wrap gap-2">
//                       {programRoster.volunteers.length ? (
//                         programRoster.volunteers.map((v) => (
//                           <span
//                             key={v.id}
//                             className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm"
//                           >
//                             {v.fname} {v.lname}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-slate-500 text-sm">
//                           No volunteers assigned
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {selectedProgram.prerequisites && (
//                 <p>
//                   <b>Prerequisites:</b>
//                   <br /> {selectedProgram.prerequisites}
//                 </p>
//               )}

//               {selectedProgram.system_requirement && (
//                 <p>
//                   <b>System Requirements:</b>
//                   <br /> {selectedProgram.system_requirement}
//                 </p>
//               )}

//               {selectedProgram.review && (
//                 <p>
//                   <b>Notes:</b> {selectedProgram.review}
//                 </p>
//               )}
//             </div>

//             {/* ACTION */}
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => {
//                   setNewProgram(selectedProgram);
//                   setMode("edit");
//                   setShowForm(true);
//                 }}
//                 className="bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
//               >
//                 Edit Program
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-[750px] max-h-[90vh] flex flex-col shadow-lg">
//             {/* HEADER */}
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold">
//                 {mode === "edit" ? "Edit Program" : "Add Program"}
//               </h2>

//               <button
//                 onClick={resetForm}
//                 className="text-gray-400 hover:text-gray-700 text-lg font-semibold"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* SCROLLABLE */}
//             <div className="p-6 overflow-y-auto flex-1 space-y-6">
//               {/* BASIC INFO */}
//               <div className="space-y-3">
//                 <input
//                   placeholder="Course Title"
//                   value={newProgram.course_title || ""}
//                   onChange={(e) =>
//                     setNewProgram({
//                       ...newProgram,
//                       course_title: e.target.value,
//                     })
//                   }
//                   className="border p-3 rounded w-full"
//                 />

//                 <textarea
//                   placeholder="Description"
//                   value={newProgram.description || ""}
//                   onChange={(e) =>
//                     setNewProgram({
//                       ...newProgram,
//                       description: e.target.value,
//                     })
//                   }
//                   className="border p-3 rounded w-full"
//                 />
//               </div>

//               {/* DETAILS */}
//               <div className="grid grid-cols-2 gap-3">
//                 <select
//                   value={newProgram.level || ""}
//                   onChange={(e) =>
//                     setNewProgram({ ...newProgram, level: e.target.value })
//                   }
//                   className="border p-3 rounded"
//                 >
//                   <option value="">Level</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="advanced">Advanced</option>
//                 </select>

//                 <input
//                   placeholder="Duration"
//                   value={newProgram.duration || ""}
//                   onChange={(e) =>
//                     setNewProgram({ ...newProgram, duration: e.target.value })
//                   }
//                   className="border p-3 rounded"
//                 />

//                 <input
//                   placeholder="Academic Year"
//                   value={newProgram.academic_year || ""}
//                   onChange={(e) =>
//                     setNewProgram({
//                       ...newProgram,
//                       academic_year: e.target.value,
//                     })
//                   }
//                   className="border p-3 rounded"
//                 />

//                 <select
//                   value={newProgram.category || ""}
//                   onChange={(e) =>
//                     setNewProgram({ ...newProgram, category: e.target.value })
//                   }
//                   className="border p-3 rounded"
//                 >
//                   <option value="">Category</option>

//                   {CATEGORY_OPTIONS.map((cat) => (
//                     <option key={cat.value} value={cat.value}>
//                       {cat.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Member Capacity
//                   </label>

//                   <input
//                     type="number"
//                     min="0"
//                     value={newProgram.member_capacity ?? 6}
//                     onChange={(e) =>
//                       setNewProgram({
//                         ...newProgram,
//                         member_capacity: Number(e.target.value),
//                       })
//                     }
//                     className="border p-3 rounded w-full"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Volunteer Capacity
//                   </label>

//                   <input
//                     type="number"
//                     min="0"
//                     value={newProgram.volunteer_capacity ?? 8}
//                     onChange={(e) =>
//                       setNewProgram({
//                         ...newProgram,
//                         volunteer_capacity: Number(e.target.value),
//                       })
//                     }
//                     className="border p-3 rounded w-full"
//                   />
//                 </div>
//               </div>

//               {/* ADVANCED */}
//               <div className="space-y-3">
//                 <textarea
//                   placeholder="Prerequisites"
//                   value={newProgram.prerequisites || ""}
//                   onChange={(e) =>
//                     setNewProgram({
//                       ...newProgram,
//                       prerequisites: e.target.value,
//                     })
//                   }
//                   className="border p-3 rounded w-full"
//                 />

//                 <textarea
//                   placeholder="System Requirements"
//                   value={newProgram.system_requirement || ""}
//                   onChange={(e) =>
//                     setNewProgram({
//                       ...newProgram,
//                       system_requirement: e.target.value,
//                     })
//                   }
//                   className="border p-3 rounded w-full"
//                 />

//                 <textarea
//                   placeholder="Review / Notes"
//                   value={newProgram.review || ""}
//                   onChange={(e) =>
//                     setNewProgram({ ...newProgram, review: e.target.value })
//                   }
//                   className="border p-3 rounded w-full"
//                 />
//               </div>

//               {/* 🔥 SECTION COUNT */}
//               <div className="space-y-2">
//                 <p className="text-sm font-semibold text-gray-700">
//                   Number of Sections
//                 </p>

//                 <input
//                   type="number"
//                   min={1}
//                   value={newProgram.sectionsCount || 1}
//                   onChange={(e) => {
//                     const count = Math.max(1, parseInt(e.target.value) || 1);

//                     // const sections = Array.from({ length: count }, (_, i) => ({
//                     //   section: i + 1,
//                     //   day: "",
//                     //   mode: "",
//                     // }));
//                     const sections = Array.from({ length: count }, (_, i) => ({
//                       section: i + 1,
//                       day: "",
//                       mode: "",

//                       start_time: "",
//                       end_time: "",

//                       meeting_location: "",
//                       meeting_link: "",

//                       lead_id: "",
//                       co_lead_id: "",
//                     }));

//                     setNewProgram({
//                       ...newProgram,
//                       sectionsCount: count,
//                       sections,
//                     });
//                   }}
//                   className="border p-3 rounded w-full"
//                 />
//               </div>

//               {/* 🔥 DYNAMIC SECTIONS */}
//               {newProgram.sections?.length > 0 && (
//                 <div className="space-y-4">
//                   <p className="text-sm font-semibold text-gray-700">
//                     Configure Sections
//                   </p>

//                   {newProgram.sections.map((sec, idx) => (
//                     <div
//                       key={idx}
//                       className="border rounded-xl p-4 bg-gray-50 space-y-3"
//                     >
//                       <p className="text-sm font-medium text-gray-700">
//                         Section {idx + 1}
//                       </p>

//                       <select
//                         value={sec.day}
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].day = e.target.value;
//                           setNewProgram({ ...newProgram, sections: updated });
//                         }}
//                         className="border p-3 rounded w-full"
//                       >
//                         <option value="">Select Day</option>
//                         <option value="SUN">Sunday</option>
//                         <option value="MON">Monday</option>
//                         <option value="TUE">Tuesday</option>
//                         <option value="WED">Wednesday</option>
//                         <option value="THU">Thursday</option>
//                         <option value="FRI">Friday</option>
//                         <option value="SAT">Saturday</option>
//                       </select>

//                       <select
//                         value={sec.mode}
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].mode = e.target.value;
//                           setNewProgram({ ...newProgram, sections: updated });
//                         }}
//                         className="border p-3 rounded w-full"
//                       >
//                         <option value="">Class Format</option>
//                         <option value="ONL">Online</option>
//                         <option value="IP">In-Person</option>
//                       </select>

//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="time"
//                           value={sec.start_time || ""}
//                           onChange={(e) => {
//                             const updated = [...newProgram.sections];
//                             updated[idx].start_time = e.target.value;
//                             setNewProgram({
//                               ...newProgram,
//                               sections: updated,
//                             });
//                           }}
//                           className="border p-3 rounded"
//                         />

//                         <input
//                           type="time"
//                           value={sec.end_time || ""}
//                           onChange={(e) => {
//                             const updated = [...newProgram.sections];
//                             updated[idx].end_time = e.target.value;
//                             setNewProgram({
//                               ...newProgram,
//                               sections: updated,
//                             });
//                           }}
//                           className="border p-3 rounded"
//                         />
//                       </div>

//                       <input
//                         placeholder="Meeting Location / Address"
//                         value={sec.meeting_location || ""}
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].meeting_location = e.target.value;
//                           setNewProgram({
//                             ...newProgram,
//                             sections: updated,
//                           });
//                         }}
//                         className="border p-3 rounded w-full"
//                       />

//                       <input
//                         placeholder="Meeting Link (Optional)"
//                         value={
//                           sec.meeting_link ||
//                           "Will be shared by the class lead as we get closer to the start date"
//                         }
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].meeting_link = e.target.value;
//                           setNewProgram({
//                             ...newProgram,
//                             sections: updated,
//                           });
//                         }}
//                         className="border p-3 rounded w-full"
//                       />

//                       <select
//                         value={sec.lead_id || ""}
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].lead_id = e.target.value;
//                           setNewProgram({ ...newProgram, sections: updated });
//                         }}
//                         className="border p-3 rounded w-full"
//                       >
//                         <option value="">Select Lead</option>
//                         {leads.map((l) => (
//                           <option key={l.id} value={l.id}>
//                             {l.fname} {l.lname}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         value={sec.co_lead_id || ""}
//                         onChange={(e) => {
//                           const updated = [...newProgram.sections];
//                           updated[idx].co_lead_id = e.target.value;
//                           setNewProgram({ ...newProgram, sections: updated });
//                         }}
//                         className="border p-3 rounded w-full"
//                       >
//                         <option value="">Select Co-Lead (optional)</option>
//                         {leads.map((l) => (
//                           <option key={l.id} value={l.id}>
//                             {l.fname} {l.lname}
//                           </option>
//                         ))}
//                       </select>

//                       <p className="text-xs text-gray-500">
//                         Code:{" "}
//                         {generateCourseCode({
//                           title: newProgram.course_title,
//                           academic_year: newProgram.academic_year,
//                           day: sec.day,
//                           section: idx + 1,
//                           mode: sec.mode,
//                           level: newProgram.level,
//                         })}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* FLAGS */}
//               <div className="flex gap-6">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="radio"
//                     name="status"
//                     checked={newProgram.is_active === true}
//                     onChange={() =>
//                       setNewProgram({
//                         ...newProgram,
//                         is_active: true,
//                         is_archived: false,
//                       })
//                     }
//                   />
//                   Active
//                 </label>

//                 <label className="flex items-center gap-2 text-sm">
//                   <input
//                     type="radio"
//                     name="status"
//                     checked={newProgram.is_archived === true}
//                     onChange={() =>
//                       setNewProgram({
//                         ...newProgram,
//                         is_active: false,
//                         is_archived: true,
//                       })
//                     }
//                   />
//                   Archived
//                 </label>
//               </div>

//               {/* IMAGE SECTION — unchanged (kept exactly as your logic) */}
//               <div className="mt-6">
//                 <p className="text-sm font-semibold text-gray-700 mb-3">
//                   Program Image
//                 </p>

//                 {/* MODE BUTTONS */}
//                 {!newProgram.image_url && (
//                   <div className="flex gap-3 mb-4">
//                     {images.length > 0 && (
//                       <button
//                         onClick={() => setImageMode("select")}
//                         className={`px-4 py-2 rounded-lg text-sm ${
//                           imageMode === "select"
//                             ? "bg-teal-800 text-white"
//                             : "bg-gray-200"
//                         }`}
//                       >
//                         Select Existing
//                       </button>
//                     )}

//                     <button
//                       onClick={() => {
//                         setImageMode("upload");
//                         setSelectedFile(null);
//                       }}
//                       className={`px-4 py-2 rounded-lg text-sm ${
//                         imageMode === "upload"
//                           ? "bg-teal-800 text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       Upload New
//                     </button>
//                   </div>
//                 )}

//                 {/* SELECT EXISTING */}
//                 {!newProgram.image_url && imageMode === "select" && (
//                   <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto border p-3 rounded-xl">
//                     {images.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img}
//                         alt="option"
//                         onClick={() =>
//                           setNewProgram((prev) => ({
//                             ...prev,
//                             image_url: img,
//                           }))
//                         }
//                         className={`h-24 object-cover rounded-lg cursor-pointer border-2 ${
//                           newProgram.image_url === img
//                             ? "border-teal-800"
//                             : "border-transparent"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {/* UPLOAD */}
//                 {!newProgram.image_url && imageMode === "upload" && (
//                   <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer">
//                     <span className="bg-teal-800 text-white px-3 py-1 rounded-md text-sm">
//                       Choose File
//                     </span>

//                     <span className="text-gray-500 text-sm truncate max-w-[150px]">
//                       {selectedFile ? selectedFile.name : "No file chosen"}
//                     </span>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         setSelectedFile(file);
//                         handleUploadImage(file);
//                       }}
//                       className="hidden"
//                     />
//                   </label>
//                 )}

//                 {/* PREVIEW */}
//                 {newProgram.image_url && (
//                   <div className="relative mt-3 border rounded-xl p-3 bg-gray-50 flex justify-center">
//                     <img
//                       src={newProgram.image_url}
//                       className="h-40 object-contain rounded-lg"
//                     />

//                     {/* EDIT BUTTON */}
//                     <button
//                       onClick={() => {
//                         setNewProgram((prev) => ({
//                           ...prev,
//                           image_url: "",
//                         }));
//                         setImageMode(null);
//                       }}
//                       className="absolute top-2 right-2 bg-teal-800 text-white p-2 rounded-full"
//                     >
//                       <Pencil className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="p-6 border-t flex justify-between">
//               <button
//                 onClick={resetForm}
//                 className="border px-4 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={
//                   mode === "edit" ? handleUpdateProgram : handleAddProgram
//                 }
//                 className="bg-teal-800 text-white px-5 py-2 rounded-lg"
//               >
//                 {mode === "edit" ? "Update" : "Add"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Programs;

const CATEGORY_OPTIONS = [
  { value: "vocational", label: "Vocational" },
  { value: "non_vocational", label: "Non-Vocational" },
  { value: "employment_services", label: "Employment Services" },
  { value: "academic_counseling", label: "Academic Counseling" },
  { value: "person_centered_services", label: "Person Centered Services" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const levelMap = {
  beginner: "L1",
  intermediate: "L2",
  advanced: "L3",
};

const FORMAT_OPTIONS = [
  { value: "ONL", label: "Online" },
  { value: "IP", label: "In-Person" },
];

const DAYS = [
  { value: "SUN", label: "Sunday" },
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
];

const createBlankSection = (section = 1) => ({
  section,
  day: "",
  mode: "",
  start_time: "",
  end_time: "",
  meeting_location: "",
  meeting_link: "",
  member_capacity: 6,
  volunteer_capacity: 8,
  lead_id: "",
  co_lead_id: "",
});

const getDefaultProgram = () => ({
  course_title: "",
  description: "",
  level: "",
  duration: "",
  academic_year: "",
  category: "",
  prerequisites: "",
  review: "",
  system_requirement: "",
  is_active: true,
  is_archived: false,
  image_url: "",
  member_capacity: 6,
  volunteer_capacity: 8,
  sectionsCount: 1,
  sections: [createBlankSection(1)],
  tracks: [],
});

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add");
  const [trackOptions, setTrackOptions] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageMode, setImageMode] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [customTrack, setCustomTrack] = useState("");

  const [programRoster, setProgramRoster] = useState({
    lead: null,
    coLead: null,
    members: [],
    volunteers: [],
  });

  const [newProgram, setNewProgram] = useState(getDefaultProgram());

  const normalizeMode = (value) => {
    const v = String(value || "").toLowerCase();

    if (v.includes("online")) return "ONL";
    if (v.includes("person")) return "IP";

    return "";
  };

  // const parseDayAndTime = (value) => {
  //   const text = String(value || "").trim();

  //   const dayMatch = text.match(
  //     /\b(mon|tue|wed|thu|fri|sat|sun|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
  //   );

  //   const dayMap = {
  //     monday: "MON",
  //     mon: "MON",
  //     tuesday: "TUE",
  //     tue: "TUE",
  //     wednesday: "WED",
  //     wed: "WED",
  //     thursday: "THU",
  //     thu: "THU",
  //     friday: "FRI",
  //     fri: "FRI",
  //     saturday: "SAT",
  //     sat: "SAT",
  //     sunday: "SUN",
  //     sun: "SUN",
  //   };

  //   const day = dayMatch ? dayMap[dayMatch[0].toLowerCase()] : "";

  //   return {
  //     day,
  //     timeText: text,
  //   };
  // };

  const parseDayAndTime = (value) => {
    const text = cleanText(value);

    const dayMap = {
      monday: "MON",
      mon: "MON",
      tuesday: "TUE",
      tue: "TUE",
      wednesday: "WED",
      wed: "WED",
      thursday: "THU",
      thu: "THU",
      friday: "FRI",
      fri: "FRI",
      saturday: "SAT",
      sat: "SAT",
      sunday: "SUN",
      sun: "SUN",
    };

    const dayMatch = text.match(
      /\b(mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday)\b/i,
    );

    const day = dayMatch ? dayMap[dayMatch[0].toLowerCase()] : "";

    const timeText = text;

    const timePart = text.replace(dayMatch?.[0] || "", "").trim();

    const rangeMatch = timePart.match(
      /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–—to]+\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
    );

    if (!rangeMatch) {
      return {
        day,
        start_time: "",
        end_time: "",
        timeText,
      };
    }

    let [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] =
      rangeMatch;

    startMinute = startMinute || "00";
    endMinute = endMinute || "00";

    startPeriod = startPeriod?.toLowerCase();
    endPeriod = endPeriod?.toLowerCase();

    if (!startPeriod && endPeriod) {
      startPeriod = endPeriod;
    }

    const to24Hour = (hour, minute, period) => {
      let h = Number(hour);

      if (period === "pm" && h !== 12) h += 12;
      if (period === "am" && h === 12) h = 0;

      return `${String(h).padStart(2, "0")}:${minute}`;
    };

    return {
      day,
      start_time: to24Hour(startHour, startMinute, startPeriod),
      end_time: to24Hour(endHour, endMinute, endPeriod),
      timeText,
    };
  };

  const cleanText = (value) => {
    return String(value || "")
      .replaceAll("\\n", "\n")
      .trim();
  };

  const handleBulkImportCSV = async (file) => {
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,

      complete: async (results) => {
        try {
          const rows = results.data || [];

          const validRows = rows.filter(
            (row) => cleanText(row["New Name"]).length > 0,
          );

          if (validRows.length === 0) {
            alert("No valid programs found in CSV.");
            setLoading(false);
            return;
          }

          const rowsToInsert = validRows.map((row, index) => {
            const courseTitle = cleanText(row["New Name"]);
            const description = cleanText(row["New Description"]);
            const category = cleanText(row["Category"]);
            const level = cleanText(row["Level"]).toLowerCase();
            const duration = cleanText(row["Duration"]);
            const classFormat = cleanText(row["Class Format"]);

            const tracks = cleanText(row["Tracks "])
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            const { day, start_time, end_time, timeText } = parseDayAndTime(
              row["Time "],
            );
            const mode = normalizeMode(classFormat);

            const memberCapacity = Number(row["Member Capacity"] || 0);
            const volunteerCapacity = Number(row["Volunteer Capacity"] || 0);

            // const section = {
            //   section: 1,
            //   day,
            //   mode,
            //   start_time: "",
            //   end_time: "",
            //   meeting_location: "",
            //   meeting_link: "",
            //   member_capacity: memberCapacity,
            //   volunteer_capacity: volunteerCapacity,
            //   time_text: timeText,
            //   lead_id: "",
            //   co_lead_id: "",
            // };
            const section = {
              section: 1,
              day,
              mode,
              start_time,
              end_time,
              meeting_location: "",
              meeting_link: "",
              member_capacity: memberCapacity,
              volunteer_capacity: volunteerCapacity,
              time_text: timeText,
              lead_id: "",
              co_lead_id: "",
            };

            return {
              course_title: courseTitle,
              description,
              category,
              level,
              duration,
              academic_year: "2026-2027",
              tracks,
              prerequisites: "",
              review: "",
              system_requirement: "",
              image_url: null,
              is_active: true,
              is_archived: false,
              sections: [section],
              member_capacity: memberCapacity,
              volunteer_capacity: volunteerCapacity,
              lead_id: null,
              co_lead_id: null,
              course_code: generateCourseCode({
                title: courseTitle,
                academic_year: "2026-2027",
                day,
                section: index + 1,
                mode,
                level,
              }),
            };
          });

          const allTracks = [
            ...new Set(rowsToInsert.flatMap((program) => program.tracks || [])),
          ];

          if (allTracks.length > 0) {
            const { error: trackError } = await supabase.from("tracks").upsert(
              allTracks.map((name) => ({ name })),
              { onConflict: "name" },
            );

            if (trackError) throw trackError;
          }

          const batchSize = 25;

          for (let i = 0; i < rowsToInsert.length; i += batchSize) {
            const batch = rowsToInsert.slice(i, i + batchSize);

            const { error } = await supabase.from("programs").insert(batch);

            if (error) throw error;
          }

          alert(`${rowsToInsert.length} programs imported successfully.`);

          await fetchPrograms();
          await fetchTracks();
        } catch (err) {
          console.error(err);
          alert(err.message || "Bulk import failed.");
        } finally {
          setLoading(false);
        }
      },

      error: (error) => {
        console.error(error);
        alert("Failed to read CSV.");
        setLoading(false);
      },
    });
    await fetchProgramCounts();
  };

  const normalizeSections = (program) => {
    const existingSections = Array.isArray(program.sections)
      ? program.sections
      : [];

    if (existingSections.length > 0) {
      return existingSections.map((sec, idx) => ({
        ...createBlankSection(idx + 1),
        ...sec,
        section: sec.section || idx + 1,
        member_capacity: sec.member_capacity ?? program.member_capacity ?? 6,
        volunteer_capacity:
          sec.volunteer_capacity ?? program.volunteer_capacity ?? 8,
      }));
    }

    return [
      {
        ...createBlankSection(1),
        day: program.day || "",
        mode: program.mode || "",
        member_capacity: program.member_capacity ?? 6,
        volunteer_capacity: program.volunteer_capacity ?? 8,
        lead_id: program.lead_id || "",
        co_lead_id: program.co_lead_id || "",
      },
    ];
  };

  const toggleTrack = (track) => {
    setNewProgram((prev) => {
      const current = prev.tracks || [];

      return {
        ...prev,
        tracks: current.includes(track)
          ? current.filter((t) => t !== track)
          : [...current, track],
      };
    });
  };

  // const addCustomTrack = (track) => {
  //   const cleaned = track.trim();
  //   if (!cleaned) return;

  //   setNewProgram((prev) => ({
  //     ...prev,
  //     tracks: [...new Set([...(prev.tracks || []), cleaned])],
  //   }));
  // };
  const addCustomTrack = async (track) => {
    const cleaned = track.trim();
    if (!cleaned) return;

    const { error } = await supabase.from("tracks").insert({ name: cleaned });

    if (error && !error.message.includes("duplicate")) {
      alert(error.message);
      return;
    }

    setNewProgram((prev) => ({
      ...prev,
      tracks: [...new Set([...(prev.tracks || []), cleaned])],
    }));

    await fetchTracks();
  };

  const resizeSections = (count) => {
    const safeCount = Math.max(1, parseInt(count, 10) || 1);

    setNewProgram((prev) => {
      const existing = Array.isArray(prev.sections) ? prev.sections : [];

      const sections = Array.from({ length: safeCount }, (_, idx) => {
        return {
          ...createBlankSection(idx + 1),
          ...(existing[idx] || {}),
          section: idx + 1,
        };
      });

      return {
        ...prev,
        sectionsCount: safeCount,
        sections,
      };
    });
  };

  const updateSection = (idx, key, value) => {
    setNewProgram((prev) => {
      const sections = [...(prev.sections || [])];
      sections[idx] = {
        ...sections[idx],
        [key]: value,
      };

      return {
        ...prev,
        sections,
      };
    });
  };

  // const formatAcademicYearForCode = (year) => {
  //   if (!year) return "2026";

  //   const cleaned = year.trim();

  //   const match = cleaned.match(/^(\d{4})\s*-\s*(\d{4})$/);

  //   if (match) {
  //     return `${match[1]}-${match[2].slice(2)}`;
  //   }

  //   return cleaned.replace(/\s+/g, "");
  // };

  // const formatAcademicYearForCode = (academicYear) => {
  //   const match = academicYear?.match(/^(\d{4})-(\d{4})$/);

  //   if (!match) return "AY26_27";

  //   return `AY${match[1].slice(2)}_${match[2].slice(2)}`;
  // };

  // const generateCourseCode = ({
  //   title = "",
  //   academic_year,
  //   day,
  //   section,
  //   mode,
  //   level,
  // } = {}) => {
  //   if (!title) return "";

  //   const org = "IW";
  //   const track = title
  //     .replace(/[^a-zA-Z ]/g, "")
  //     .split(" ")
  //     .filter(Boolean)
  //     .map((word) => word.slice(0, 1))
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 10);

  //   const levelMap = {
  //     beginner: "I",
  //     intermediate: "II",
  //     advanced: "III",
  //   };

  //   const levelCode = levelMap[level] || null;
  //   const year = formatAcademicYearForCode(academic_year);
  //   const dayCode = day || "TBD";

  //   let code = `${org}-${year}-${dayCode}-${track || "PROGRAM"}`;

  //   if (levelCode) code += `-${levelCode}`;
  //   if (section) code += `-${section}`;
  //   if (mode) code += `-${mode.toUpperCase()}`;

  //   return code;
  // };
  const formatAcademicYearForCode = (academicYear) => {
    const cleaned = String(academicYear || "").trim();

    const match = cleaned.match(/^(\d{4})\s*-\s*(\d{4})$/);

    if (match) {
      return `AY${match[1].slice(2)}_${match[2].slice(2)}`;
    }

    return cleaned ? cleaned.toUpperCase().replace(/\s+/g, "_") : "AY";
  };

  const getProgramAbbreviation = (title = "") => {
    const words = title
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean);

    if (words.length === 0) return "PROGRAM";

    if (words.length === 1) {
      return words[0].toUpperCase().slice(0, 6);
    }

    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 6);
  };

  // const generateCourseCode = ({
  //   title = "",
  //   academic_year,
  //   day,
  //   section,
  //   mode,
  //   level,
  // } = {}) => {
  //   if (!title?.trim()) return "";

  //   const programCode = getProgramAbbreviation(title);
  //   const yearCode = formatAcademicYearForCode(academic_year);
  //   const dayCode = day || "TBD";
  //   const modeCode = mode || "TBD";
  //   const sectionCode = String(section || 1);

  //   return `${programCode}-${yearCode}-${dayCode}-${modeCode}-${sectionCode}`;
  // };

  const generateCourseCode = ({
    title = "",
    academic_year,
    day,
    section,
    mode,
    level,
  } = {}) => {
    if (!title?.trim()) return "";

    const programCode = getProgramAbbreviation(title);
    const yearCode = formatAcademicYearForCode(academic_year);
    const dayCode = day || "TBD";
    const modeCode = mode || "TBD";
    const levelCode = levelMap[level] || "L0";
    const sectionCode = `S${section || 1}`;

    return [
      "IW",
      yearCode,
      programCode,
      dayCode,
      modeCode,
      levelCode,
      sectionCode,
    ].join("-");
  };

  const getTotalCapacity = (sections, key) => {
    return (sections || []).reduce(
      (sum, sec) => sum + Number(sec[key] || 0),
      0,
    );
  };

  // const validateProgram = () => {
  //   if (!newProgram.course_title?.trim()) return "Title required";
  //   if (!newProgram.image_url) return "Select image";
  //   if (!newProgram.sections || newProgram.sections.length === 0) {
  //     return "Add at least one section";
  //   }

  //   for (const sec of newProgram.sections) {
  //     if (!sec.day) return `Section ${sec.section}: select a day.`;
  //     if (!sec.mode) return `Section ${sec.section}: select class format.`;

  //     if (sec.start_time && sec.end_time && sec.start_time >= sec.end_time) {
  //       return `Section ${sec.section}: start time must be before end time.`;
  //     }

  //     if (sec.mode === "IP" && !sec.meeting_location?.trim()) {
  //       return `Section ${sec.section}: class address is required for in-person classes.`;
  //     }

  //     if (Number(sec.member_capacity) < 0) {
  //       return `Section ${sec.section}: member capacity cannot be negative.`;
  //     }

  //     if (Number(sec.volunteer_capacity) < 0) {
  //       return `Section ${sec.section}: volunteer capacity cannot be negative.`;
  //     }
  //   }

  //   return null;
  // };

  const validateProgram = () => {
    if (!newProgram.course_title?.trim()) return "Title required";
    if (!newProgram.image_url) return "Select image";

    for (const sec of newProgram.sections || []) {
      if (sec.start_time && sec.end_time && sec.start_time >= sec.end_time) {
        return `Section ${sec.section}: start time must be before end time.`;
      }

      if (Number(sec.member_capacity) < 0) {
        return `Section ${sec.section}: member capacity cannot be negative.`;
      }

      if (Number(sec.volunteer_capacity) < 0) {
        return `Section ${sec.section}: volunteer capacity cannot be negative.`;
      }
    }

    return null;
  };

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setTrackOptions(data || []);
  };

  const fetchImages = async () => {
    const { data, error } = await supabase2.storage
      .from(BUCKET)
      .list(FOLDER, { limit: 100 });

    if (error) {
      console.error(error);
      return;
    }

    const urls = (data || []).map((file) => {
      const { data: publicUrl } = supabase2.storage
        .from(BUCKET)
        .getPublicUrl(`${FOLDER}/${file.name}`);

      return publicUrl.publicUrl;
    });

    setImages(urls);
  };

  const handleUploadImage = async (file) => {
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const filePath = `${FOLDER}/${fileName}`;

    const { error } = await supabase2.storage
      .from(BUCKET)
      .upload(filePath, file);

    if (error) {
      console.error(error);
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const { data } = supabase2.storage.from(BUCKET).getPublicUrl(filePath);

    setNewProgram((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));

    setUploading(false);
    fetchImages();
  };

  const fetchProgramCounts = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("is_active,is_archived");

    if (error) {
      console.error(error);
      return;
    }

    setActiveCount(data.filter((p) => p.is_active && !p.is_archived).length);

    setArchivedCount(data.filter((p) => p.is_archived && !p.is_active).length);
  };

  const fetchPrograms = async () => {
    setLoading(true);

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
      setLoading(false);
      return;
    }

    setPrograms(data || []);
    setLoading(false);
  };

  const fetchProgramRoster = async (programId) => {
    try {
      const { data: program } = await supabase
        .from("programs")
        .select("lead_id, co_lead_id")
        .eq("id", programId)
        .single();

      let lead = null;
      let coLead = null;

      if (program?.lead_id) {
        const { data } = await supabase
          .from("people")
          .select("id,fname,lname,email")
          .eq("id", program.lead_id)
          .maybeSingle();

        lead = data;
      }

      if (program?.co_lead_id) {
        const { data } = await supabase
          .from("people")
          .select("id,fname,lname,email")
          .eq("id", program.co_lead_id)
          .maybeSingle();

        coLead = data;
      }

      const { data: enrollments } = await supabase
        .from("person_programs")
        .select(
          `
          role,
          status,
          people (
            id,
            fname,
            lname,
            email
          )
        `,
        )
        .eq("program_id", programId)
        .eq("status", "current");

      const members =
        enrollments
          ?.filter((row) => row.role === "member")
          .map((row) => row.people)
          .filter(Boolean) || [];

      const volunteers =
        enrollments
          ?.filter((row) => row.role === "volunteer")
          .map((row) => row.people)
          .filter(Boolean) || [];

      setProgramRoster({
        lead,
        coLead,
        members,
        volunteers,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchProgramCounts();
  }, [statusFilter]);

  useEffect(() => {
    if (showForm) fetchImages();
  }, [showForm]);

  useEffect(() => {
    if (images.length > 0) setImageMode("select");
    else setImageMode("upload");
  }, [images]);

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from("people")
        .select("id, fname, lname")
        .in("role", ["lead"]);

      if (error) {
        console.error(error);
        return;
      }

      setLeads(data || []);
    };

    fetchLeads();
  }, []);

  // const handleAddProgram = async () => {
  //   const validationError = validateProgram();
  //   if (validationError) return alert(validationError);

  //   const sections = (newProgram.sections || []).map((sec, idx) => ({
  //     ...sec,
  //     section: idx + 1,
  //     member_capacity: Number(sec.member_capacity || 0),
  //     volunteer_capacity: Number(sec.volunteer_capacity || 0),
  //   }));

  //   const memberCapacity = getTotalCapacity(sections, "member_capacity");
  //   const volunteerCapacity = getTotalCapacity(sections, "volunteer_capacity");

  //   const firstSection = sections[0];

  //   const { error } = await supabase.from("programs").insert([
  //     {
  //       course_title: newProgram.course_title,
  //       description: newProgram.description || "",
  //       level: newProgram.level || "",
  //       duration: newProgram.duration || "",
  //       academic_year: newProgram.academic_year || "",
  //       category: newProgram.category || "",
  //       tracks: newProgram.tracks || [],
  //       prerequisites: newProgram.prerequisites || "",
  //       review: newProgram.review || "",
  //       system_requirement: newProgram.system_requirement || "",
  //       image_url: newProgram.image_url,
  //       is_active: newProgram.is_active,
  //       is_archived: newProgram.is_archived,

  //       sections,

  //       member_capacity: memberCapacity,
  //       volunteer_capacity: volunteerCapacity,

  //       lead_id: firstSection?.lead_id || null,
  //       co_lead_id: firstSection?.co_lead_id || null,

  //       course_code: generateCourseCode({
  //         title: newProgram.course_title,
  //         academic_year: newProgram.academic_year,
  //         day: firstSection?.day,
  //         section: firstSection?.section,
  //         mode: firstSection?.mode,
  //         level: newProgram.level,
  //       }),
  //     },
  //   ]);

  //   if (error) {
  //     console.error(error);
  //     return alert("Error adding program");
  //   }

  //   resetForm();
  // };

  const handleAddProgram = async () => {
    const validationError = validateProgram();
    if (validationError) return alert(validationError);

    const sections = newProgram.sections || [];

    const rowsToInsert = sections.map((sec, idx) => {
      const sectionNumber = sec.section || idx + 1;

      const singleSection = {
        ...sec,
        section: sectionNumber,
        member_capacity: Number(sec.member_capacity || 0),
        volunteer_capacity: Number(sec.volunteer_capacity || 0),
      };

      return {
        course_title: newProgram.course_title,
        description: newProgram.description || "",
        level: newProgram.level || "",
        duration: newProgram.duration || "",
        academic_year: newProgram.academic_year || "",
        category: newProgram.category || "",
        tracks: newProgram.tracks || [],
        prerequisites: newProgram.prerequisites || "",
        review: newProgram.review || "",
        system_requirement: newProgram.system_requirement || "",
        image_url: newProgram.image_url,
        is_active: newProgram.is_active,
        is_archived: newProgram.is_archived,

        sections: [singleSection],

        member_capacity: singleSection.member_capacity,
        volunteer_capacity: singleSection.volunteer_capacity,

        lead_id: singleSection.lead_id || null,
        co_lead_id: singleSection.co_lead_id || null,

        course_code: generateCourseCode({
          title: newProgram.course_title,
          academic_year: newProgram.academic_year,
          day: singleSection.day,
          section: sectionNumber,
          mode: singleSection.mode,
          level: newProgram.level,
        }),
      };
    });

    const { error } = await supabase.from("programs").insert(rowsToInsert);

    if (error) {
      console.error(error);
      return alert(error.message || "Error adding program");
    }

    await fetchProgramCounts();

    resetForm();
  };

  const handleUpdateProgram = async () => {
    const validationError = validateProgram();
    if (validationError) return alert(validationError);

    const sections = (newProgram.sections || []).map((sec, idx) => ({
      ...sec,
      section: idx + 1,
      member_capacity: Number(sec.member_capacity || 0),
      volunteer_capacity: Number(sec.volunteer_capacity || 0),
    }));

    const memberCapacity = getTotalCapacity(sections, "member_capacity");
    const volunteerCapacity = getTotalCapacity(sections, "volunteer_capacity");

    const firstSection = sections[0];

    // const { id, created_at, updated_at, ...dbData } = newProgram;
    const {
      id,
      created_at,
      updated_at,
      sectionsCount,
      member_enrolled,
      volunteer_enrolled,
      ...dbData
    } = newProgram;

    // const { error } = await supabase
    //   .from("programs")
    //   .update({
    //     ...dbData,
    //     sections,

    //     member_capacity: memberCapacity,
    //     volunteer_capacity: volunteerCapacity,

    //     lead_id: firstSection?.lead_id || null,
    //     co_lead_id: firstSection?.co_lead_id || null,

    //     course_code: generateCourseCode({
    //       title: newProgram.course_title,
    //       academic_year: newProgram.academic_year,
    //       day: firstSection?.day,
    //       section: firstSection?.section,
    //       mode: firstSection?.mode,
    //       level: newProgram.level,
    //     }),
    //   })
    //   .eq("id", selectedProgram.id);

    const { error } = await supabase
      .from("programs")
      .update({
        ...dbData,
        sections,
        member_capacity: memberCapacity,
        volunteer_capacity: volunteerCapacity,
        lead_id: firstSection?.lead_id || null,
        co_lead_id: firstSection?.co_lead_id || null,
        course_code: generateCourseCode({
          title: newProgram.course_title,
          academic_year: newProgram.academic_year,
          day: firstSection?.day,
          section: firstSection?.section,
          mode: firstSection?.mode,
          level: newProgram.level,
        }),
      })
      .eq("id", selectedProgram.id);

    if (error) {
      console.error(error);
      return alert("Update failed");
    }
    await fetchProgramCounts();
    resetForm();
  };

  const handleDeleteProgram = async () => {
    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", selectedProgram.id);

    if (error) return alert("Delete failed");

    await fetchProgramCounts();
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedProgram(null);
    setSelectedFile(null);
    setNewProgram(getDefaultProgram());
    fetchPrograms();
  };

  const openAddForm = () => {
    setMode("add");
    setSelectedProgram(null);
    setSelectedFile(null);
    setNewProgram(getDefaultProgram());
    setShowForm(true);
  };

  const openEditForm = (program) => {
    const sections = normalizeSections(program);

    setSelectedProgram(program);
    setNewProgram({
      ...getDefaultProgram(),
      ...program,
      sections,
      sectionsCount: sections.length,
    });
    setMode("edit");
    setShowForm(true);
  };

  const openDetails = (program) => {
    setSelectedProgram(program);
    fetchProgramRoster(program.id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Programs</h1>

        <div className="flex gap-3">
          <label className="bg-slate-700 text-white px-4 py-2 rounded cursor-pointer flex items-center">
            {loading ? "Importing..." : "Bulk Import CSV"}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleBulkImportCSV(e.target.files?.[0])}
            />
          </label>

          <button
            onClick={openAddForm}
            className="bg-teal-800 text-white px-4 py-2 rounded"
          >
            + Add Program
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {["active", "archived"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === filter
                ? "bg-teal-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter === "active"
              ? `Active (${activeCount})`
              : `Archived (${archivedCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => openDetails(program)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {program.image_url && (
                <div className="h-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={program.image_url}
                    alt={program.course_title}
                    className="h-full w-full object-contain p-3 transition"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-800 leading-tight line-clamp-2">
                  {program.course_title}
                </h2>

                {program.course_code && (
                  <p className="text-sm text-gray-600 tracking-wide">
                    {program.course_code}
                  </p>
                )}

                <div className="flex justify-between text-md text-gray-500">
                  <span>
                    {program.level
                      ? program.level.charAt(0).toUpperCase() +
                        program.level.slice(1)
                      : "No Level"}
                  </span>

                  <span>{program.mode || "—"}</span>
                </div>

                {program.tracks?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {program.tracks.map((track) => (
                      <span
                        key={track}
                        className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-medium"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetails(program);
                  }}
                  className="mt-3 w-full border border-teal-800 text-teal-800 py-2 rounded-lg text-sm hover:bg-teal-50 transition"
                >
                  View Details
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditForm(program);
                  }}
                  className=" w-full bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700 transition"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProgram && !showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-2xl w-[650px] max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedProgram.course_title}
              </h2>

              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {selectedProgram.image_url && (
              <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src={selectedProgram.image_url}
                  className="h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <b>Code:</b> {selectedProgram.course_code}
              </p>

              <p>
                <b>Level:</b> {selectedProgram.level || "None"}
              </p>

              <p>
                <b>Duration:</b> {selectedProgram.duration}
              </p>

              <p>
                <b>Category:</b> {selectedProgram.category || "—"}
              </p>

              <p>
                <b>Academic Year:</b> {selectedProgram.academic_year}
              </p>

              <p>
                <b>Description:</b>
                <br /> {selectedProgram.description}
              </p>

              <div className="border rounded-xl p-4 bg-gray-50 space-y-4">
                <h3 className="font-semibold text-gray-800">Sections</h3>

                {(normalizeSections(selectedProgram) || []).map((sec, idx) => (
                  <div key={idx} className="border rounded-lg bg-white p-3">
                    <p className="font-semibold mb-2">
                      Section {sec.section || idx + 1}
                    </p>
                    <p>
                      <b>Day:</b> {sec.day || "—"}
                    </p>
                    <p>
                      <b>Format:</b>{" "}
                      {FORMAT_OPTIONS.find((f) => f.value === sec.mode)
                        ?.label || "—"}
                    </p>
                    <p>
                      <b>Time:</b>{" "}
                      {sec.start_time && sec.end_time
                        ? `${sec.start_time} - ${sec.end_time}`
                        : "—"}
                    </p>
                    <p>
                      <b>Member Seats:</b> {sec.member_capacity ?? 0}
                    </p>
                    <p>
                      <b>Volunteer Seats:</b> {sec.volunteer_capacity ?? 0}
                    </p>
                    {sec.mode === "IP" && (
                      <p>
                        <b>Address:</b> {sec.meeting_location || "—"}
                      </p>
                    )}
                    {sec.mode === "ONL" && (
                      <p>
                        <b>Meeting Link:</b> {sec.meeting_link || "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                  <h3 className="font-semibold text-lg text-slate-800">
                    Program Team & Enrollment
                  </h3>
                </div>

                <div className="p-5 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Lead
                      </p>
                      <p className="font-medium text-slate-800">
                        {programRoster.lead
                          ? `${programRoster.lead.fname} ${programRoster.lead.lname}`
                          : "Not Assigned"}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                        Co-Lead
                      </p>
                      <p className="font-medium text-slate-800">
                        {programRoster.coLead
                          ? `${programRoster.coLead.fname} ${programRoster.coLead.lname}`
                          : "Not Assigned"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">
                      Members ({programRoster.members.length})
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {programRoster.members.length ? (
                        programRoster.members.map((member) => (
                          <span
                            key={member.id}
                            className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
                          >
                            {member.fname} {member.lname}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">
                          No members enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">
                      Volunteers ({programRoster.volunteers.length})
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {programRoster.volunteers.length ? (
                        programRoster.volunteers.map((volunteer) => (
                          <span
                            key={volunteer.id}
                            className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm"
                          >
                            {volunteer.fname} {volunteer.lname}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">
                          No volunteers assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedProgram.prerequisites && (
                <p>
                  <b>Prerequisites:</b>
                  <br /> {selectedProgram.prerequisites}
                </p>
              )}

              {selectedProgram.system_requirement && (
                <p>
                  <b>System Requirements:</b>
                  <br /> {selectedProgram.system_requirement}
                </p>
              )}

              {selectedProgram.review && (
                <p>
                  <b>Notes:</b> {selectedProgram.review}
                </p>
              )}
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Program Tracks
                </h4>

                {selectedProgram.tracks?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.tracks.map((track) => (
                      <span
                        key={track}
                        className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No tracks assigned</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDeleteProgram}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={() => openEditForm(selectedProgram)}
                className="bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
              >
                Edit Program
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-[800px] max-h-[90vh] flex flex-col shadow-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {mode === "edit" ? "Edit Program" : "Add Program"}
              </h2>

              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-700 text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-3">
                <input
                  placeholder="Course Title"
                  value={newProgram.course_title || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      course_title: e.target.value,
                    })
                  }
                  className="border p-3 rounded w-full"
                />

                <textarea
                  placeholder="Description"
                  value={newProgram.description || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      description: e.target.value,
                    })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newProgram.level || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, level: e.target.value })
                  }
                  className="border p-3 rounded"
                >
                  <option value="">Levels</option>
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="e.g. 24 weeks"
                  value={newProgram.duration || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, duration: e.target.value })
                  }
                  className="border p-3 rounded"
                />

                <input
                  type="text"
                  placeholder="Academic Year, e.g. 2026-2027"
                  value={newProgram.academic_year || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      academic_year: e.target.value,
                    })
                  }
                  className="border p-3 rounded"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <select
                    value={newProgram.category || ""}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        category: e.target.value,
                      })
                    }
                    className="border p-3 rounded w-full"
                  >
                    <option value="">Category</option>

                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-gray-500 mt-1">
                    Used for registration, pricing, filtering, and grouping.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Program Tracks
                </label>

                <div className="flex flex-wrap gap-2">
                  {trackOptions.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => toggleTrack(track.name)}
                      type="button"
                      className={`px-4 py-2 rounded-full text-sm border ${
                        newProgram.tracks?.includes(track.name)
                          ? "bg-teal-800 text-white border-teal-800"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {track.name}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={customTrack}
                    onChange={(e) => setCustomTrack(e.target.value)}
                    placeholder="Add custom track"
                    className="border p-3 rounded w-full"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      await addCustomTrack(customTrack);
                      setCustomTrack("");
                    }}
                    className="bg-teal-800 text-white px-4 rounded"
                  >
                    Add
                  </button>
                </div>

                {newProgram.tracks?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newProgram.tracks.map((track) => (
                      <span
                        key={track}
                        className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-sm"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <textarea
                  placeholder="Prerequisites"
                  value={newProgram.prerequisites || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      prerequisites: e.target.value,
                    })
                  }
                  className="border p-3 rounded w-full"
                />

                <textarea
                  placeholder="System Requirements"
                  value={newProgram.system_requirement || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      system_requirement: e.target.value,
                    })
                  }
                  className="border p-3 rounded w-full"
                />

                <textarea
                  placeholder="Review / Notes"
                  value={newProgram.review || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, review: e.target.value })
                  }
                  className="border p-3 rounded w-full"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Number of Sections
                </p>

                <input
                  type="number"
                  min={1}
                  value={newProgram.sectionsCount || 1}
                  onChange={(e) => resizeSections(e.target.value)}
                  className="border p-3 rounded w-full"
                />

                <p className="text-xs text-gray-500">
                  Increasing the number keeps details already entered for
                  existing sections.
                </p>
              </div>

              {newProgram.sections?.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Configure Sections
                  </p>

                  {newProgram.sections.map((sec, idx) => {
                    const invalidTime =
                      sec.start_time &&
                      sec.end_time &&
                      sec.start_time >= sec.end_time;

                    return (
                      <div
                        key={idx}
                        className="border rounded-xl p-4 bg-gray-50 space-y-3"
                      >
                        <p className="text-sm font-medium text-gray-700">
                          Section {idx + 1}
                        </p>

                        <select
                          value={sec.day || ""}
                          onChange={(e) =>
                            updateSection(idx, "day", e.target.value)
                          }
                          className="border p-3 rounded w-full"
                        >
                          <option value="">Select Day (Optional)</option>
                          {DAYS.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={sec.mode || ""}
                          onChange={(e) =>
                            updateSection(idx, "mode", e.target.value)
                          }
                          className="border p-3 rounded w-full"
                        >
                          <option value="">Class Format (Optional)</option>
                          {FORMAT_OPTIONS.map((format) => (
                            <option key={format.value} value={format.value}>
                              {format.label}
                            </option>
                          ))}
                        </select>

                        {/* <div className="grid grid-cols-2 gap-3">
                          <label className="text-sm text-gray-600">
                            Start Time (Optional)
                          </label>
                          <input
                            type="time"
                            value={sec.start_time || ""}
                            onChange={(e) =>
                              updateSection(idx, "start_time", e.target.value)
                            }
                            className="border p-3 rounded"
                          />

                          <label className="text-sm text-gray-600">
                            End Time (Optional)
                          </label>
                          <input
                            type="time"
                            value={sec.end_time || ""}
                            onChange={(e) =>
                              updateSection(idx, "end_time", e.target.value)
                            }
                            className="border p-3 rounded"
                          />
                        </div> */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Start Time{" "}
                              <span className="text-gray-400">(Optional)</span>
                            </label>

                            <input
                              type="time"
                              value={sec.start_time || ""}
                              onChange={(e) =>
                                updateSection(idx, "start_time", e.target.value)
                              }
                              className="border p-3 rounded w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              End Time{" "}
                              <span className="text-gray-400">(Optional)</span>
                            </label>

                            <input
                              type="time"
                              value={sec.end_time || ""}
                              onChange={(e) =>
                                updateSection(idx, "end_time", e.target.value)
                              }
                              className="border p-3 rounded w-full"
                            />
                          </div>
                        </div>

                        {invalidTime && (
                          <p className="text-sm text-red-600">
                            End time must be later than start time.
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Member Capacity
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={sec.member_capacity ?? 6}
                              onChange={(e) =>
                                updateSection(
                                  idx,
                                  "member_capacity",
                                  Number(e.target.value),
                                )
                              }
                              className="border p-3 rounded w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Volunteer Capacity
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={sec.volunteer_capacity ?? 8}
                              onChange={(e) =>
                                updateSection(
                                  idx,
                                  "volunteer_capacity",
                                  Number(e.target.value),
                                )
                              }
                              className="border p-3 rounded w-full"
                            />
                          </div>
                        </div>

                        {sec.mode === "IP" && (
                          <input
                            placeholder="Class Address (Optional)"
                            value={sec.meeting_location || ""}
                            onChange={(e) =>
                              updateSection(
                                idx,
                                "meeting_location",
                                e.target.value,
                              )
                            }
                            className="border p-3 rounded w-full"
                          />
                        )}

                        {sec.mode === "ONL" && (
                          <input
                            placeholder="Meeting Link (Optional)"
                            value={sec.meeting_link || ""}
                            onChange={(e) =>
                              updateSection(idx, "meeting_link", e.target.value)
                            }
                            className="border p-3 rounded w-full"
                          />
                        )}

                        <select
                          value={sec.lead_id || ""}
                          onChange={(e) =>
                            updateSection(idx, "lead_id", e.target.value)
                          }
                          className="border p-3 rounded w-full"
                        >
                          <option value="">Select Lead (Optional)</option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>
                              {lead.fname} {lead.lname}
                            </option>
                          ))}
                        </select>

                        <select
                          value={sec.co_lead_id || ""}
                          onChange={(e) =>
                            updateSection(idx, "co_lead_id", e.target.value)
                          }
                          className="border p-3 rounded w-full"
                        >
                          <option value="">Select Co-Lead (Optional)</option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>
                              {lead.fname} {lead.lname}
                            </option>
                          ))}
                        </select>

                        <p className="text-xs text-gray-500">
                          Code:{" "}
                          {generateCourseCode({
                            title: newProgram.course_title,
                            academic_year: newProgram.academic_year,
                            day: sec.day,
                            section: idx + 1,
                            mode: sec.mode,
                            level: newProgram.level,
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    checked={newProgram.is_active === true}
                    onChange={() =>
                      setNewProgram({
                        ...newProgram,
                        is_active: true,
                        is_archived: false,
                      })
                    }
                  />
                  Active
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    checked={newProgram.is_archived === true}
                    onChange={() =>
                      setNewProgram({
                        ...newProgram,
                        is_active: false,
                        is_archived: true,
                      })
                    }
                  />
                  Archived
                </label>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Program Image
                </p>

                {!newProgram.image_url && (
                  <div className="flex gap-3 mb-4">
                    {images.length > 0 && (
                      <button
                        onClick={() => setImageMode("select")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          imageMode === "select"
                            ? "bg-teal-800 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        Select Existing
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setImageMode("upload");
                        setSelectedFile(null);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        imageMode === "upload"
                          ? "bg-teal-800 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Upload New
                    </button>
                  </div>
                )}

                {!newProgram.image_url && imageMode === "select" && (
                  <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto border p-3 rounded-xl">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="option"
                        onClick={() =>
                          setNewProgram((prev) => ({
                            ...prev,
                            image_url: img,
                          }))
                        }
                        className="h-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-teal-800"
                      />
                    ))}
                  </div>
                )}

                {!newProgram.image_url && imageMode === "upload" && (
                  <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer">
                    <span className="bg-teal-800 text-white px-3 py-1 rounded-md text-sm">
                      {uploading ? "Uploading..." : "Choose File"}
                    </span>

                    <span className="text-gray-500 text-sm truncate max-w-[180px]">
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        handleUploadImage(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}

                {newProgram.image_url && (
                  <div className="relative mt-3 border rounded-xl p-3 bg-gray-50 flex justify-center">
                    <img
                      src={newProgram.image_url}
                      className="h-40 object-contain rounded-lg"
                    />

                    <button
                      onClick={() => {
                        setNewProgram((prev) => ({
                          ...prev,
                          image_url: "",
                        }));
                        setImageMode(images.length > 0 ? "select" : "upload");
                      }}
                      className="absolute top-2 right-2 bg-teal-800 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-between">
              <button
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={
                  mode === "edit" ? handleUpdateProgram : handleAddProgram
                }
                className="bg-teal-800 text-white px-5 py-2 rounded-lg"
              >
                {mode === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
