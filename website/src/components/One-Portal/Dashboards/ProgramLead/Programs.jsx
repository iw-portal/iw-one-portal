// // import { useEffect, useState } from "react";
// // import { supabase } from "../../../../lib/supabase";

// // export default function Programs({ user }) {
// //   const [programs, setPrograms] = useState([]);
// //   const [selectedProgram, setSelectedProgram] = useState(null);
// //   const [students, setStudents] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [showEmailModal, setShowEmailModal] = useState(false);

// //   const [selectedTemplate, setSelectedTemplate] = useState("inclusive");

// //   const [emailSubject, setEmailSubject] = useState("");

// //   const [emailBody, setEmailBody] = useState("");
// //   const [canvasLink, setCanvasLink] = useState("");

// //   const [meetingLink, setMeetingLink] = useState("");

// //   const [meetingLocation, setMeetingLocation] = useState("");

// //   const [meetingTime, setMeetingTime] = useState("");

// //   const [leadName, setLeadName] = useState("");
// //   const [coLeadName, setCoLeadName] = useState("");
// //   const [signedBy, setSignedBy] = useState("");

// //   const [meetingDate, setMeetingDate] = useState("");
// //   const [additionalNotes, setAdditionalNotes] = useState("");

// //   useEffect(() => {
// //     if (user?.person_id) {
// //       fetchPrograms();
// //     }
// //   }, [user?.person_id]);

// //   const fetchPrograms = async () => {
// //     const { data, error } = await supabase
// //       .from("programs")
// //       .select("*")
// //       .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
// //       .order("course_title");

// //     if (error) {
// //       console.error(error);
// //       return;
// //     }

// //     setPrograms(data || []);
// //   };

// //   const fetchStudents = async (programId) => {
// //     const { data, error } = await supabase
// //       .from("enrollments")
// //       .select(
// //         `
// //         *,
// //         people:student_id(
// //           id,
// //           fname,
// //           lname,
// //           email
// //         ),
// //         program_member_support(
// //           id,
// //           buddy_id,
// //           support_notes
// //         )
// //       `,
// //       )
// //       .eq("program_id", programId);

// //     if (error) {
// //       console.error(error);
// //       return;
// //     }

// //     setStudents(data || []);
// //   };

// //   const loadProgramLeads = async (program) => {
// //     let lead = "";
// //     let coLead = "";

// //     if (program.lead_id) {
// //       const { data } = await supabase
// //         .from("people")
// //         .select("fname,lname")
// //         .eq("id", program.lead_id)
// //         .maybeSingle();

// //       if (data) {
// //         lead = `${data.fname} ${data.lname}`;
// //       }
// //     }

// //     if (program.co_lead_id) {
// //       const { data } = await supabase
// //         .from("people")
// //         .select("fname,lname")
// //         .eq("id", program.co_lead_id)
// //         .maybeSingle();

// //       if (data) {
// //         coLead = `${data.fname} ${data.lname}`;
// //       }
// //     }

// //     setLeadName(lead);
// //     setCoLeadName(coLead);
// //     setSignedBy(lead);
// //   };

// //   const introSection = ({ programName, leadName, coLeadName }) => {
// //     if (coLeadName) {
// //       return `
// //       Welcome to the <strong>${programName}</strong> class!

// //       <br/><br/>

// //       My name is <strong>${leadName}</strong>, and I am one of the instructors.

// //       Along with me, <strong>${coLeadName}</strong> will also be supporting this program.
// //     `;
// //     }

// //     return `
// //     Welcome to the <strong>${programName}</strong> class!

// //     <br/><br/>

// //     My name is <strong>${leadName}</strong>, and I will be your instructor for this program.
// //   `;
// //   };

// //   const meetingSection = ({
// //     meetingDate,
// //     meetingTime,
// //     meetingLocation,
// //     meetingLink,
// //   }) => {
// //     let html = "";

// //     if (meetingDate) {
// //       html += `
// //       <strong>Meeting Date:</strong>
// //       ${meetingDate}<br/>
// //     `;
// //     }

// //     if (meetingTime) {
// //       html += `
// //       <strong>Meeting Time:</strong>
// //       ${meetingTime}<br/>
// //     `;
// //     }

// //     if (meetingLocation) {
// //       html += `
// //       <strong>Location:</strong>
// //       ${meetingLocation}<br/>
// //     `;
// //     }

// //     if (meetingLink) {
// //       html += `
// //       <strong>Meeting Link:</strong>
// //       <a href="${meetingLink}">
// //         ${meetingLink}
// //       </a><br/>
// //     `;
// //     }

// //     return html;
// //   };

// //   const canvasSection = ({ canvasLink }) => {
// //     if (!canvasLink) {
// //       return "";
// //     }

// //     return `
// //     <div
// //       style="
// //         margin-top:32px;
// //         color:#0c4f49;
// //         font-size:18px;
// //         font-weight:bold;
// //       "
// //     >
// //       Canvas Course
// //     </div>

// //     <div
// //       style="
// //         color:#5d6c69;
// //         font-size:15px;
// //         line-height:30px;
// //         margin-top:10px;
// //       "
// //     >
// //       All coursework information
// //       will be available on Canvas.

// //       <br/><br/>

// //       <a href="${canvasLink}">
// //         ${canvasLink}
// //       </a>
// //     </div>
// //   `;
// //   };

// //   const materialsSection = () => `
// // <div
// //   style="
// //     margin-top:32px;
// //     color:#0c4f49;
// //     font-size:18px;
// //     font-weight:bold;
// //   "
// // >
// // Materials Needed
// // </div>

// // <div
// //   style="
// //     color:#5d6c69;
// //     font-size:15px;
// //     line-height:30px;
// //     margin-top:10px;
// //   "
// // >
// // • Laptop (Windows or Mac)<br/>
// // • External Mouse<br/>
// // • Power Charging Cables
// // </div>
// // `;

// //   const notesSection = ({ additionalNotes }) => {
// //     if (!additionalNotes) {
// //       return "";
// //     }

// //     return `
// //     <div
// //       style="
// //         margin-top:32px;
// //         color:#0c4f49;
// //         font-size:18px;
// //         font-weight:bold;
// //       "
// //     >
// //       Additional Notes
// //     </div>

// //     <div
// //       style="
// //         margin-top:12px;
// //         color:#5d6c69;
// //         line-height:30px;
// //       "
// //     >
// //       ${additionalNotes}
// //     </div>
// //   `;
// //   };

// //   const signatureSection = ({ signedBy, instructorEmail }) => `
// // <div
// //   style="
// //     margin-top:42px;
// //     color:#667572;
// //     font-size:15px;
// //     line-height:28px;
// //   "
// // >
// // Thanks,
// // <br/><br/>

// // <strong>${signedBy}</strong>

// // ${instructorEmail ? `<br/>Email: ${instructorEmail}` : ""}
// // </div>
// // `;

// //   const templateConfig = {
// //     welcome: {
// //       banner: "CLASS WELCOME EMAIL",
// //       title: (programName) => `Welcome to ${programName}`,
// //       showMeetingInfo: true,
// //       showMaterials: true,
// //       showCanvas: true,
// //       showNotes: true,
// //       closing:
// //         "We are very excited for our journey together and look forward to meeting everyone soon.",
// //     },

// //     inclusive: {
// //       banner: "INCLUSIVE WORLD COMMUNICATION",
// //       title: () => emailSubject || "Inclusive World Update",
// //       showMeetingInfo: false,
// //       showMaterials: false,
// //       showCanvas: false,
// //       showNotes: true,
// //       closing: "Thank you for being part of the Inclusive World community.",
// //     },

// //     reminder: {
// //       banner: "CLASS REMINDER",
// //       title: (programName) => `${programName} Reminder`,
// //       showMeetingInfo: true,
// //       showMaterials: false,
// //       showCanvas: false,
// //       showNotes: true,
// //       closing: "Please reach out if you have any questions before class.",
// //     },
// //   };

// //   const generatePreview = () => {
// //     const config = templateConfig[selectedTemplate];

// //     const introHtml =
// //       selectedTemplate === "welcome"
// //         ? coLeadName
// //           ? `
// //         Welcome to the <strong>${selectedProgram?.course_title}</strong> class!

// //         <br/><br/>

// //         My name is <strong>${leadName}</strong>, and I am one of the instructors.

// //         Along with me,
// //         <strong>${coLeadName}</strong>
// //         will also be supporting this program.
// //       `
// //           : `
// //         Welcome to the <strong>${selectedProgram?.course_title}</strong> class!

// //         <br/><br/>

// //         My name is <strong>${leadName}</strong>, and I will be your instructor for this program.
// //       `
// //         : `
// //         Hello Everyone,
// //       `;

// //     return `
// //   <table
// //     role="presentation"
// //     width="100%"
// //     cellpadding="0"
// //     cellspacing="0"
// //     border="0"
// //     bgcolor="#f4f8f7"
// //   >
// //     <tr>
// //       <td align="center" style="padding:40px 16px;">

// //         <table
// //   role="presentation"
// //   width="100%"
// //   style="
// //     max-width:620px;
// //     width:100%;
// //     border-radius:24px;
// //     overflow:hidden;
// //     border:1px solid #e4ece9;
// //     font-family:Arial,Helvetica,sans-serif;
// //     table-layout:fixed;
// //   "
// //         >

// //           <tr>
// //             <td
// //               bgcolor="#0c4f49"
// //               align="center"
// //               style="padding:50px 36px;"
// //             >

// //               <img
// //                 src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
// //                 width="72"
// //                 style="display:block;margin-bottom:24px;"
// //               />

// //               <div
// //                 style="
// //                   color:#d7efeb;
// //                   font-size:12px;
// //                   font-weight:bold;
// //                   letter-spacing:1.6px;
// //                   margin-bottom:18px;
// //                 "
// //               >
// //                 ${config.banner}
// //               </div>

// //               <div
// //                 style="
// //                   color:#ffffff;
// //                   font-size:36px;
// //                   line-height:44px;
// //                   font-weight:bold;
// //                 "
// //               >
// //                 ${config.title(selectedProgram?.course_title)}
// //               </div>

// //             </td>
// //           </tr>

// //           <tr>
// //             <td style="padding:42px 36px;">

// //               <div
// //                 style="
// //                   color:#5d6c69;
// //                   font-size:16px;
// //                   line-height:30px;
// //                 "
// //               >
// //                 ${introHtml}
// //               </div>

// //                             ${
// //                               emailBody
// //                                 ? `
// //                 <div
// //   style="
// //     color:#5d6c69;
// //     font-size:15px;
// //     line-height:20px;
// //     white-space:pre-wrap;
// //     overflow-wrap:break-word;
// //     word-break:break-word;
// //   "
// // >
// //   ${emailBody}
// // </div>
// //               `
// //                                 : ""
// //                             }

// //               ${
// //                 config.showMeetingInfo
// //                   ? `
// //                 <table
// //                   role="presentation"
// //                   width="100%"
// //                   cellpadding="0"
// //                   cellspacing="0"
// //                   border="0"
// //                   bgcolor="#f8fbfa"
// //                   style="
// //                     margin-top:34px;
// //                     border-radius:18px;
// //                     border:1px solid #e5efec;
// //                   "
// //                 >
// //                   <tr>
// //                     <td style="padding:28px;">

// //                       <div
// //                         style="
// //                           color:#0c4f49;
// //                           font-size:20px;
// //                           font-weight:bold;
// //                           margin-bottom:12px;
// //                         "
// //                       >
// //                         Class Information
// //                       </div>

// //                       <div
// //                         style="
// //                           color:#61706d;
// //                           font-size:15px;
// //                           line-height:30px;
// //                         "
// //                       >
// //                         ${
// //                           meetingDate
// //                             ? `<strong>Date:</strong> ${meetingDate}<br/>`
// //                             : ""
// //                         }

// //                         ${
// //                           meetingTime
// //                             ? `<strong>Time:</strong> ${meetingTime}<br/>`
// //                             : ""
// //                         }

// //                         ${
// //                           meetingLocation
// //                             ? `<strong>Location:</strong> ${meetingLocation}<br/>`
// //                             : ""
// //                         }

// //                         ${
// //                           meetingLink
// //                             ? `<strong>Meeting Link:</strong>
// //                                <a href="${meetingLink}">
// //                                  ${meetingLink}
// //                                </a><br/>`
// //                             : ""
// //                         }
// //                       </div>

// //                     </td>
// //                   </tr>
// //                 </table>
// //               `
// //                   : ""
// //               }

// //               ${
// //                 config.showMaterials
// //                   ? `
// //                 <div
// //                   style="
// //                     margin-top:32px;
// //                     color:#0c4f49;
// //                     font-size:18px;
// //                     font-weight:bold;
// //                   "
// //                 >
// //                   Materials Needed
// //                 </div>

// //                 <div
// //                   style="
// //                     color:#5d6c69;
// //                     font-size:15px;
// //                     line-height:30px;
// //                     margin-top:10px;
// //                   "
// //                 >
// //                   • Laptop (Windows or Mac)<br/>
// //                   • External Mouse<br/>
// //                   • Power Charging Cables
// //                 </div>
// //               `
// //                   : ""
// //               }

// //               ${
// //                 config.showCanvas && canvasLink
// //                   ? `
// //                 <div
// //                   style="
// //                     margin-top:32px;
// //                     color:#0c4f49;
// //                     font-size:18px;
// //                     font-weight:bold;
// //                   "
// //                 >
// //                   Canvas Course
// //                 </div>

// //                 <div
// //                   style="
// //                     color:#5d6c69;
// //                     font-size:15px;
// //                     line-height:30px;
// //                     margin-top:10px;
// //                   "
// //                 >
// //                   <a href="${canvasLink}">
// //                     ${canvasLink}
// //                   </a>
// //                 </div>
// //               `
// //                   : ""
// //               }

// //               ${
// //                 config.showNotes && additionalNotes
// //                   ? `
// //                 <div
// //                   style="
// //                     margin-top:32px;
// //                     color:#0c4f49;
// //                     font-size:18px;
// //                     font-weight:bold;
// //                   "
// //                 >
// //                   Additional Notes
// //                 </div>

// //                 <div
// //                   style="
// //                     margin-top:12px;
// //                     color:#5d6c69;
// //                     line-height:30px;
// //                   "
// //                 >
// //                   ${additionalNotes}
// //                 </div>
// //               `
// //                   : ""
// //               }

// //               <div
// //                 style="
// //                   margin-top:42px;
// //                   color:#667572;
// //                   font-size:15px;
// //                   line-height:28px;
// //                 "
// //               >
// //                 ${config.closing}
// //               </div>

// //               <div
// //                 style="
// //                   margin-top:42px;
// //                   color:#667572;
// //                   font-size:15px;
// //                   line-height:28px;
// //                 "
// //               >
// //                 Thanks,
// //                 <br/><br/>

// //                 <strong>${signedBy}</strong>

// //                 ${user?.email ? `<br/>Email: ${user.email}` : ""}
// //               </div>

// //             </td>
// //           </tr>

// //         </table>

// //       </td>
// //     </tr>
// //   </table>
// //   `;
// //   };

// //   const sendEmail = async () => {
// //     try {
// //       const recipients = students
// //         .filter((s) => s.people?.email)
// //         .map((s) => ({
// //           email: s.people.email,
// //           name: `${s.people.fname} ${s.people.lname}`,
// //         }));
// //       const senderName = `Inclusive World - ${selectedProgram.course_title} (${selectedProgram.level.charAt(0).toUpperCase()}${selectedProgram.level.slice(1)}) Leads`;
// //       const receiverName = `Inclusive World - ${selectedProgram.course_title} (${selectedProgram.level.charAt(0).toUpperCase()}${selectedProgram.level.slice(1)})`;

// //       const response = await fetch("/api/program_email", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           recipients,
// //           subject: emailSubject,
// //           htmlContent: generatePreview(),
// //           senderName: senderName,
// //           receiverName: receiverName,
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to send email");
// //       }

// //       alert("Email sent successfully");
// //       setShowEmailModal(false);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to send email");
// //     }
// //   };

// //   const updateSupport = async (enrollmentId, buddyId, notes) => {
// //     const existing = students.find((s) => s.id === enrollmentId)
// //       ?.program_member_support?.[0];

// //     if (existing) {
// //       await supabase
// //         .from("program_member_support")
// //         .update({
// //           buddy_id: buddyId,
// //           support_notes: notes,
// //           updated_at: new Date(),
// //         })
// //         .eq("id", existing.id);
// //     } else {
// //       await supabase.from("program_member_support").insert({
// //         enrollment_id: enrollmentId,
// //         buddy_id: buddyId,
// //         support_notes: notes,
// //       });
// //     }

// //     fetchStudents(selectedProgram.id);
// //   };

// //   const filteredPrograms = programs.filter(
// //     (p) =>
// //       p.course_title?.toLowerCase().includes(search.toLowerCase()) ||
// //       p.description?.toLowerCase().includes(search.toLowerCase()),
// //   );

// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white rounded-3xl border shadow-sm p-8">
// //         <h1 className="text-4xl font-bold text-[#0f5b54]">Programs</h1>

// //         <p className="text-gray-500 mt-2">
// //           Manage enrolled students, buddy assignments, support needs, and
// //           communication.
// //         </p>
// //       </div>

// //       <div className="bg-white rounded-3xl border shadow-sm p-6">
// //         <input
// //           placeholder="Search programs..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="w-full border rounded-xl px-4 py-3"
// //         />
// //       </div>

// //       <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="text-left p-4">Program</th>
// //               <th className="text-left p-4">Academic Year</th>
// //               <th className="text-left p-4">Duration</th>
// //               <th className="text-left p-4">Status</th>
// //               <th className="text-left p-4">Actions</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {filteredPrograms.map((program) => (
// //               <tr key={program.id} className="border-t">
// //                 <td className="p-4">{program.course_title}</td>

// //                 <td className="p-4">{program.academic_year}</td>

// //                 <td className="p-4">{program.duration}</td>

// //                 <td className="p-4">
// //                   {program.is_active ? "Current" : "Completed"}
// //                 </td>

// //                 <td className="p-4">
// //                   <button
// //                     onClick={() => {
// //                       setSelectedProgram(program);
// //                       fetchStudents(program.id);
// //                       loadProgramLeads(program);
// //                     }}
// //                     className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
// //                   >
// //                     View Students
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {selectedProgram && (
// //         <div className="bg-white rounded-3xl border shadow-sm p-8">
// //           <div className="flex justify-between items-center mb-6">
// //             <div>
// //               <h2 className="text-2xl font-bold">
// //                 {selectedProgram.course_title}
// //               </h2>

// //               <p className="text-gray-500">Student Roster</p>
// //             </div>

// //             <button
// //               onClick={() => setShowEmailModal(true)}
// //               className="bg-blue-600 text-white px-5 py-2 rounded-lg"
// //             >
// //               Email Entire Class
// //             </button>
// //           </div>

// //           <div className="space-y-4">
// //             {students.map((student) => {
// //               const support = student.program_member_support?.[0];

// //               return (
// //                 <div key={student.id} className="border rounded-xl p-4">
// //                   <h3 className="font-semibold">
// //                     {student.people?.fname} {student.people?.lname}
// //                   </h3>

// //                   <p className="text-sm text-gray-500">
// //                     {student.people?.email}
// //                   </p>

// //                   <textarea
// //                     defaultValue={support?.support_notes || ""}
// //                     placeholder="Support notes..."
// //                     className="w-full border rounded-lg p-3 mt-3"
// //                     onBlur={(e) =>
// //                       updateSupport(
// //                         student.id,
// //                         support?.buddy_id,
// //                         e.target.value,
// //                       )
// //                     }
// //                   />
// //                 </div>
// //               );
// //             })}
// //             {showEmailModal && (
// //               <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
// //                 <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl">
// //                   {/* LEFT PANEL */}

// //                   <div className="w-[420px] border-r bg-gray-50 p-6 overflow-y-auto">
// //                     <h2 className="text-2xl font-bold text-[#0f5b54] mb-2">
// //                       Email Designer
// //                     </h2>

// //                     <p className="text-sm text-gray-500 mb-6">
// //                       Select a template and customize the email before sending.
// //                     </p>

// //                     <div className="space-y-4">
// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Template
// //                         </label>

// //                         <select
// //                           value={selectedTemplate}
// //                           onChange={(e) => setSelectedTemplate(e.target.value)}
// //                           className="w-full border rounded-xl p-3"
// //                         >
// //                           <option value="inclusive">
// //                             Inclusive World Template
// //                           </option>

// //                           <option value="welcome">Welcome Email</option>
// //                         </select>
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Subject
// //                         </label>

// //                         <input
// //                           value={emailSubject}
// //                           onChange={(e) => setEmailSubject(e.target.value)}
// //                           className="w-full border rounded-xl p-3"
// //                           placeholder="Email Subject"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Program
// //                         </label>

// //                         <input
// //                           value={selectedProgram?.course_title || ""}
// //                           disabled
// //                           className="w-full border rounded-xl p-3 bg-gray-100"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Lead Name
// //                         </label>

// //                         <input
// //                           value={leadName}
// //                           onChange={(e) => setLeadName(e.target.value)}
// //                           className="w-full border rounded-xl p-3"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Co-Lead Name
// //                         </label>

// //                         <input
// //                           value={coLeadName}
// //                           onChange={(e) => setCoLeadName(e.target.value)}
// //                           className="w-full border rounded-xl p-3"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Message
// //                         </label>

// //                         <textarea
// //                           rows={8}
// //                           value={emailBody}
// //                           onChange={(e) => setEmailBody(e.target.value)}
// //                           className="
// //     w-full
// //     border
// //     rounded-xl
// //     p-3
// //     resize-y
// //     break-words
// //   "
// //                         />
// //                       </div>

// //                       {selectedTemplate === "welcome" && (
// //                         <>
// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               Meeting Date
// //                             </label>

// //                             <input
// //                               type="date"
// //                               value={meetingDate}
// //                               onChange={(e) => setMeetingDate(e.target.value)}
// //                               className="w-full border rounded-xl p-3"
// //                             />
// //                           </div>

// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               Meeting Time
// //                             </label>

// //                             <input
// //                               value={meetingTime}
// //                               onChange={(e) => setMeetingTime(e.target.value)}
// //                               className="w-full border rounded-xl p-3"
// //                               placeholder="6:00 PM PST"
// //                             />
// //                           </div>

// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               Meeting Location
// //                             </label>

// //                             <input
// //                               value={meetingLocation}
// //                               onChange={(e) =>
// //                                 setMeetingLocation(e.target.value)
// //                               }
// //                               className="w-full border rounded-xl p-3"
// //                             />
// //                           </div>

// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               Meeting Link
// //                             </label>

// //                             <input
// //                               value={meetingLink}
// //                               onChange={(e) => setMeetingLink(e.target.value)}
// //                               className="w-full border rounded-xl p-3 mb-2"
// //                             />
// //                           </div>

// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               LMS Course Link (Optional)
// //                             </label>

// //                             <input
// //                               placeholder="LMS Course Link (Optional)"
// //                               value={canvasLink}
// //                               onChange={(e) => setCanvasLink(e.target.value)}
// //                               className="w-full border rounded-xl p-3"
// //                             />
// //                           </div>

// //                           <div>
// //                             <label className="block text-sm font-medium mb-2">
// //                               Additional Notes
// //                             </label>

// //                             <textarea
// //                               rows={4}
// //                               value={additionalNotes}
// //                               onChange={(e) =>
// //                                 setAdditionalNotes(e.target.value)
// //                               }
// //                               className="w-full border rounded-xl p-3"
// //                             />
// //                           </div>
// //                         </>
// //                       )}

// //                       <div>
// //                         <label className="block text-sm font-medium mb-2">
// //                           Signed By
// //                         </label>

// //                         <input
// //                           value={signedBy}
// //                           onChange={(e) => setSignedBy(e.target.value)}
// //                           className="w-full border rounded-xl p-3"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* RIGHT PANEL */}

// //                   <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
// //                     <h2 className="text-2xl font-bold text-[#0f5b54] mb-6">
// //                       Live Preview
// //                     </h2>

// //                     <div
// //                       className="
// //     bg-white
// //     rounded-2xl
// //     shadow-xl
// //     max-w-4xl
// //     w-full
// //     mx-auto
// //     p-10
// //     overflow-hidden
// //   "
// //                     >
// //                       <div
// //                         className="overflow-x-auto"
// //                         dangerouslySetInnerHTML={{
// //                           __html: generatePreview(),
// //                         }}
// //                       />
// //                     </div>
// //                   </div>

// //                   {/* ACTIONS */}

// //                   <div className="absolute bottom-8 right-8 flex gap-3">
// //                     <button
// //                       onClick={() => setShowEmailModal(false)}
// //                       className="px-6 py-3 border rounded-xl"
// //                     >
// //                       Cancel
// //                     </button>

// //                     <button
// //                       onClick={sendEmail}
// //                       className="px-6 py-3 bg-[#0f5b54] text-white rounded-xl"
// //                     >
// //                       Send Email
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { supabase } from "../../../../lib/supabase";

// export default function Programs({ user }) {
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [buddyOptions, setBuddyOptions] = useState([]);
//   const [attendanceRows, setAttendanceRows] = useState([]);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [yearFilter, setYearFilter] = useState("all");

//   const [loadingPrograms, setLoadingPrograms] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [savingId, setSavingId] = useState(null);

//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState("inclusive");
//   const [emailSubject, setEmailSubject] = useState("");
//   const [emailBody, setEmailBody] = useState("");
//   const [canvasLink, setCanvasLink] = useState("");
//   const [meetingLink, setMeetingLink] = useState("");
//   const [meetingLocation, setMeetingLocation] = useState("");
//   const [meetingTime, setMeetingTime] = useState("");
//   const [leadName, setLeadName] = useState("");
//   const [coLeadName, setCoLeadName] = useState("");
//   const [signedBy, setSignedBy] = useState("");
//   const [meetingDate, setMeetingDate] = useState("");
//   const [additionalNotes, setAdditionalNotes] = useState("");

//   useEffect(() => {
//     if (user?.person_id) {
//       fetchPrograms();
//       // fetchBuddyOptions();
//     }
//   }, [user?.person_id]);

//   useEffect(() => {
//     if (selectedProgram?.id) {
//       fetchBuddyOptions(selectedProgram.id);
//     }
//   }, [selectedProgram?.id]);

//   const fetchPrograms = async () => {
//     setLoadingPrograms(true);

//     const { data, error } = await supabase
//       .from("programs")
//       .select("*")
//       .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
//       .eq("is_archived", false)
//       .order("academic_year", { ascending: false })
//       .order("course_title", { ascending: true });

//     if (error) {
//       console.error("Error fetching programs:", error);
//       setLoadingPrograms(false);
//       return;
//     }

//     const programList = data || [];
//     const programIds = programList.map((p) => p.id);

//     if (programIds.length > 0) {
//       const { data: attendanceData, error: attendanceError } = await supabase
//         .from("attendance")
//         .select("program_id, attendance_status")
//         .in("program_id", programIds);

//       if (attendanceError) {
//         console.error("Error fetching attendance:", attendanceError);
//       } else {
//         setAttendanceRows(attendanceData || []);
//       }
//     }

//     setPrograms(programList);
//     setLoadingPrograms(false);
//   };

//   // const fetchBuddyOptions = async () => {
//   //   const { data, error } = await supabase
//   //     .from("people")
//   //     .select("id, fname, lname, email")
//   //     .order("fname", { ascending: true });

//   //   if (error) {
//   //     console.error("Error fetching buddy options:", error);
//   //     return;
//   //   }

//   //   setBuddyOptions(data || []);
//   // };

//   const fetchBuddyOptions = async (programId) => {
//     console.log(
//       "Fetching assigned volunteers from person_programs:",
//       programId,
//     );

//     setBuddyOptions([]);

//     const { data, error } = await supabase
//       .from("person_programs")
//       .select(
//         `
//       id,
//       person_id,
//       program_id,
//       role,
//       status,
//       people:person_id(
//         id,
//         fname,
//         lname,
//         email
//       )
//       `,
//       )
//       .eq("program_id", programId)
//       .eq("status", "current")
//       .eq("role", "volunteer");

//     console.log("Assigned volunteers:", data);
//     console.log("Assigned volunteers error:", error);

//     if (error) {
//       console.error("Error fetching assigned volunteers:", error);
//       return;
//     }

//     const volunteers = (data || []).map((row) => row.people).filter(Boolean);

//     setBuddyOptions(volunteers);
//   };

//   const fetchStudents = async (programId) => {
//     setLoadingStudents(true);

//     const { data, error } = await supabase
//       .from("enrollments")
//       .select(
//         `
//         *,
//         people:student_id(
//           id,
//           fname,
//           lname,
//           email
//         ),
//         program_member_support(
//           id,
//           buddy_id,
//           support_notes,
//           updated_at
//         )
//       `,
//       )
//       .eq("program_id", programId)
//       .order("enrolled_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching students:", error);
//       setLoadingStudents(false);
//       return;
//     }

//     setStudents(data || []);
//     setLoadingStudents(false);
//   };

//   const loadProgramLeads = async (program) => {
//     let lead = "";
//     let coLead = "";

//     if (program.lead_id) {
//       const { data } = await supabase
//         .from("people")
//         .select("fname,lname")
//         .eq("id", program.lead_id)
//         .maybeSingle();

//       if (data) lead = `${data.fname || ""} ${data.lname || ""}`.trim();
//     }

//     if (program.co_lead_id) {
//       const { data } = await supabase
//         .from("people")
//         .select("fname,lname")
//         .eq("id", program.co_lead_id)
//         .maybeSingle();

//       if (data) coLead = `${data.fname || ""} ${data.lname || ""}`.trim();
//     }

//     setLeadName(lead);
//     setCoLeadName(coLead);
//     setSignedBy(lead);
//   };

//   // const openProgram = async (program) => {
//   //   setSelectedProgram(program);
//   //   setEmailSubject(`${program.course_title} Update`);
//   //   await fetchStudents(program.id);
//   //   await loadProgramLeads(program);
//   // };

//   const openProgram = async (program) => {
//     setSelectedProgram(program);
//     setEmailSubject(`${program.course_title} Update`);

//     await Promise.all([
//       fetchStudents(program.id),
//       fetchBuddyOptions(program.id),
//       loadProgramLeads(program),
//     ]);
//   };

//   const getAttendanceAverage = (programId) => {
//     const rows = attendanceRows.filter((row) => row.program_id === programId);
//     if (rows.length === 0) return "0%";

//     const present = rows.filter(
//       (row) => row.attendance_status === "present",
//     ).length;

//     return `${Math.round((present / rows.length) * 100)}%`;
//   };

//   const updateSupport = async (enrollmentId, buddyId, notes) => {
//     setSavingId(enrollmentId);

//     const existing = students.find((s) => s.id === enrollmentId)
//       ?.program_member_support?.[0];

//     if (existing) {
//       const { error } = await supabase
//         .from("program_member_support")
//         .update({
//           buddy_id: buddyId || null,
//           support_notes: notes || "",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", existing.id);

//       if (error) console.error("Error updating support:", error);
//     } else {
//       const { error } = await supabase.from("program_member_support").insert({
//         enrollment_id: enrollmentId,
//         buddy_id: buddyId || null,
//         support_notes: notes || "",
//       });

//       if (error) console.error("Error creating support:", error);
//     }

//     if (selectedProgram?.id) {
//       await fetchStudents(selectedProgram.id);
//     }

//     setSavingId(null);
//   };

//   const templateConfig = {
//     welcome: {
//       banner: "CLASS WELCOME EMAIL",
//       title: (programName) => `Welcome to ${programName}`,
//       showMeetingInfo: true,
//       showMaterials: true,
//       showCanvas: true,
//       showNotes: true,
//       closing:
//         "We are very excited for our journey together and look forward to meeting everyone soon.",
//     },
//     inclusive: {
//       banner: "INCLUSIVE WORLD COMMUNICATION",
//       title: () => emailSubject || "Inclusive World Update",
//       showMeetingInfo: false,
//       showMaterials: false,
//       showCanvas: false,
//       showNotes: true,
//       closing: "Thank you for being part of the Inclusive World community.",
//     },
//     reminder: {
//       banner: "CLASS REMINDER",
//       title: (programName) => `${programName} Reminder`,
//       showMeetingInfo: true,
//       showMaterials: false,
//       showCanvas: false,
//       showNotes: true,
//       closing: "Please reach out if you have any questions before class.",
//     },
//   };

//   const generatePreview = () => {
//     const config = templateConfig[selectedTemplate];

//     const introHtml =
//       selectedTemplate === "welcome"
//         ? coLeadName
//           ? `
//             Welcome to the <strong>${selectedProgram?.course_title}</strong> class!
//             <br/><br/>
//             My name is <strong>${leadName}</strong>, and I am one of the instructors.
//             Along with me, <strong>${coLeadName}</strong> will also be supporting this program.
//           `
//           : `
//             Welcome to the <strong>${selectedProgram?.course_title}</strong> class!
//             <br/><br/>
//             My name is <strong>${leadName}</strong>, and I will be your instructor for this program.
//           `
//         : `Hello Everyone,`;

//     return `
//       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f8f7">
//         <tr>
//           <td align="center" style="padding:40px 16px;">
//             <table role="presentation" width="100%" style="max-width:620px;width:100%;border-radius:24px;overflow:hidden;border:1px solid #e4ece9;font-family:Arial,Helvetica,sans-serif;table-layout:fixed;">
//               <tr>
//                 <td bgcolor="#0c4f49" align="center" style="padding:50px 36px;">
//                   <img src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png" width="72" style="display:block;margin-bottom:24px;" />
//                   <div style="color:#d7efeb;font-size:12px;font-weight:bold;letter-spacing:1.6px;margin-bottom:18px;">
//                     ${config.banner}
//                   </div>
//                   <div style="color:#ffffff;font-size:36px;line-height:44px;font-weight:bold;">
//                     ${config.title(selectedProgram?.course_title || "Program")}
//                   </div>
//                 </td>
//               </tr>

//               <tr>
//                 <td style="padding:42px 36px;">
//                   <div style="color:#5d6c69;font-size:16px;line-height:30px;">
//                     ${introHtml}
//                   </div>

//                   ${
//                     emailBody
//                       ? `
//                         <div style="color:#5d6c69;font-size:15px;line-height:24px;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin-top:24px;">
//                           ${emailBody}
//                         </div>
//                       `
//                       : ""
//                   }

//                   ${
//                     config.showMeetingInfo
//                       ? `
//                         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fbfa" style="margin-top:34px;border-radius:18px;border:1px solid #e5efec;">
//                           <tr>
//                             <td style="padding:28px;">
//                               <div style="color:#0c4f49;font-size:20px;font-weight:bold;margin-bottom:12px;">
//                                 Class Information
//                               </div>
//                               <div style="color:#61706d;font-size:15px;line-height:30px;">
//                                 ${meetingDate ? `<strong>Date:</strong> ${meetingDate}<br/>` : ""}
//                                 ${meetingTime ? `<strong>Time:</strong> ${meetingTime}<br/>` : ""}
//                                 ${meetingLocation ? `<strong>Location:</strong> ${meetingLocation}<br/>` : ""}
//                                 ${
//                                   meetingLink
//                                     ? `<strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a><br/>`
//                                     : ""
//                                 }
//                               </div>
//                             </td>
//                           </tr>
//                         </table>
//                       `
//                       : ""
//                   }

//                   ${
//                     config.showMaterials
//                       ? `
//                         <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Materials Needed</div>
//                         <div style="color:#5d6c69;font-size:15px;line-height:30px;margin-top:10px;">
//                           • Laptop (Windows or Mac)<br/>
//                           • External Mouse<br/>
//                           • Power Charging Cables
//                         </div>
//                       `
//                       : ""
//                   }

//                   ${
//                     config.showCanvas && canvasLink
//                       ? `
//                         <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Canvas Course</div>
//                         <div style="color:#5d6c69;font-size:15px;line-height:30px;margin-top:10px;">
//                           <a href="${canvasLink}">${canvasLink}</a>
//                         </div>
//                       `
//                       : ""
//                   }

//                   ${
//                     config.showNotes && additionalNotes
//                       ? `
//                         <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Additional Notes</div>
//                         <div style="margin-top:12px;color:#5d6c69;line-height:30px;">
//                           ${additionalNotes}
//                         </div>
//                       `
//                       : ""
//                   }

//                   <div style="margin-top:42px;color:#667572;font-size:15px;line-height:28px;">
//                     ${config.closing}
//                   </div>

//                   <div style="margin-top:42px;color:#667572;font-size:15px;line-height:28px;">
//                     Thanks,<br/><br/>
//                     <strong>${signedBy || leadName || "Inclusive World Team"}</strong>
//                     ${user?.email ? `<br/>Email: ${user.email}` : ""}
//                   </div>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     `;
//   };

//   const sendEmail = async () => {
//     try {
//       const recipients = students
//         .filter((s) => s.people?.email)
//         .map((s) => ({
//           email: s.people.email,
//           name: `${s.people.fname || ""} ${s.people.lname || ""}`.trim(),
//         }));

//       if (recipients.length === 0) {
//         alert("No student emails found for this class.");
//         return;
//       }

//       if (!emailSubject.trim()) {
//         alert("Please enter an email subject.");
//         return;
//       }

//       const levelLabel = selectedProgram?.level
//         ? `${selectedProgram.level.charAt(0).toUpperCase()}${selectedProgram.level.slice(1)}`
//         : "Program";

//       const senderName = `Inclusive World - ${selectedProgram.course_title} (${levelLabel}) Leads`;
//       const receiverName = `Inclusive World - ${selectedProgram.course_title} (${levelLabel})`;

//       const response = await fetch("/api/program_email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           recipients,
//           subject: emailSubject,
//           htmlContent: generatePreview(),
//           senderName,
//           receiverName,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send email");
//       }

//       alert("Email sent successfully");
//       setShowEmailModal(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     }
//   };

//   const years = useMemo(() => {
//     return [...new Set(programs.map((p) => p.academic_year).filter(Boolean))];
//   }, [programs]);

//   const filteredPrograms = useMemo(() => {
//     return programs.filter((p) => {
//       const query = search.toLowerCase();

//       const matchesSearch =
//         p.course_title?.toLowerCase().includes(query) ||
//         p.description?.toLowerCase().includes(query) ||
//         p.course_code?.toLowerCase().includes(query) ||
//         p.academic_year?.toLowerCase().includes(query);

//       const matchesStatus =
//         statusFilter === "all" ||
//         (statusFilter === "current" && p.is_active) ||
//         (statusFilter === "completed" && !p.is_active);

//       const matchesYear =
//         yearFilter === "all" || p.academic_year === yearFilter;

//       return matchesSearch && matchesStatus && matchesYear;
//     });
//   }, [programs, search, statusFilter, yearFilter]);

//   // const selectedStats = useMemo(() => {
//   //   if (!selectedProgram) return null;

//   //   return {
//   //     students: students.length,
//   //     // volunteers: selectedProgram.volunteer_enrolled || 0,
//   //     volunteers: buddyOptions.length,
//   //     attendance: getAttendanceAverage(selectedProgram.id),
//   //   };
//   // }, [selectedProgram, students, attendanceRows]);

//   const selectedStats = useMemo(() => {
//     if (!selectedProgram) return null;

//     return {
//       students: students.length,
//       volunteers: buddyOptions.length,
//       attendance: getAttendanceAverage(selectedProgram.id),
//     };
//   }, [selectedProgram, students, attendanceRows, buddyOptions]);

//   return (
//     <div className="space-y-6">
//       <div className="bg-gradient-to-br from-[#0f5b54] to-[#063a35] rounded-3xl shadow-sm p-8 text-white">
//         <p className="text-sm text-white/70">Program Lead Workspace</p>

//         <h1 className="text-4xl font-bold mt-2">Programs</h1>

//         <p className="text-white/80 mt-3 max-w-3xl">
//           Manage your assigned programs, view enrolled members, assign buddies,
//           update support notes, and send class emails.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white border rounded-3xl p-5 shadow-sm">
//           <p className="text-sm text-gray-500">Programs</p>
//           <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
//             {programs.length}
//           </h2>
//         </div>

//         <div className="bg-white border rounded-3xl p-5 shadow-sm">
//           <p className="text-sm text-gray-500">Current</p>
//           <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
//             {programs.filter((p) => p.is_active).length}
//           </h2>
//         </div>

//         <div className="bg-white border rounded-3xl p-5 shadow-sm">
//           <p className="text-sm text-gray-500">Completed</p>
//           <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
//             {programs.filter((p) => !p.is_active).length}
//           </h2>
//         </div>

//         <div className="bg-white border rounded-3xl p-5 shadow-sm">
//           <p className="text-sm text-gray-500">Selected Roster</p>
//           <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
//             {students.length}
//           </h2>
//         </div>
//       </div>

//       <div className="bg-white rounded-3xl border shadow-sm p-5">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div className="lg:col-span-2">
//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Search Programs
//             </label>
//             <input
//               placeholder="Search by name, code, description, or year..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Academic Year
//             </label>
//             <select
//               value={yearFilter}
//               onChange={(e) => setYearFilter(e.target.value)}
//               className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
//             >
//               <option value="all">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Status
//             </label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
//             >
//               <option value="all">All Statuses</option>
//               <option value="current">Current</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
//         <div className="p-6 border-b flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Assigned Programs
//             </h2>
//             <p className="text-sm text-gray-500">
//               {filteredPrograms.length} program
//               {filteredPrograms.length === 1 ? "" : "s"} found
//             </p>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1000px]">
//             <thead className="bg-gray-50 text-sm text-gray-600">
//               <tr>
//                 <th className="text-left p-4">Program</th>
//                 <th className="text-left p-4">Academic Year</th>
//                 <th className="text-left p-4">Duration</th>
//                 <th className="text-left p-4">Members</th>
//                 <th className="text-left p-4">Volunteers</th>
//                 <th className="text-left p-4">Attendance Avg</th>
//                 <th className="text-left p-4">Status</th>
//                 <th className="text-left p-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loadingPrograms ? (
//                 <tr>
//                   <td colSpan="8" className="p-8 text-gray-500">
//                     Loading programs...
//                   </td>
//                 </tr>
//               ) : filteredPrograms.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="p-8 text-gray-500">
//                     No programs found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredPrograms.map((program) => (
//                   <tr
//                     key={program.id}
//                     className={`border-t hover:bg-gray-50 ${
//                       selectedProgram?.id === program.id ? "bg-[#0f5b54]/5" : ""
//                     }`}
//                   >
//                     <td className="p-4">
//                       <p className="font-semibold text-gray-800">
//                         {program.course_title}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {program.course_code || "No course code"}
//                       </p>
//                       {program.description && (
//                         <p className="text-xs text-gray-400 mt-1 line-clamp-1">
//                           {program.description}
//                         </p>
//                       )}
//                     </td>

//                     <td className="p-4">{program.academic_year || "-"}</td>

//                     <td className="p-4">{program.duration || "-"}</td>

//                     <td className="p-4">
//                       {program.member_enrolled || 0}/
//                       {program.member_capacity || 0}
//                     </td>

//                     <td className="p-4">
//                       {program.volunteer_enrolled || 0}/
//                       {program.volunteer_capacity || 0}
//                     </td>

//                     <td className="p-4 font-medium">
//                       {getAttendanceAverage(program.id)}
//                     </td>

//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           program.is_active
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {program.is_active ? "Current" : "Completed"}
//                       </span>
//                     </td>

//                     <td className="p-4">
//                       <button
//                         onClick={() => openProgram(program)}
//                         className="bg-[#0f5b54] hover:bg-[#0b4741] text-white px-4 py-2 rounded-xl transition"
//                       >
//                         View Students
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {selectedProgram && (
//         <div className="bg-white rounded-3xl border shadow-sm p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
//             <div>
//               <p className="text-sm text-gray-500">Student Roster</p>
//               <h2 className="text-2xl font-bold text-[#0f5b54]">
//                 {selectedProgram.course_title}
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Assign buddy matches and update program support needs notes.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
//                 <p className="text-xs text-gray-500">Students</p>
//                 <p className="font-bold">{selectedStats?.students || 0}</p>
//               </div>

//               <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
//                 <p className="text-xs text-gray-500">Volunteers</p>
//                 <p className="font-bold">{selectedStats?.volunteers || 0}</p>
//               </div>

//               <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
//                 <p className="text-xs text-gray-500">Attendance</p>
//                 <p className="font-bold">{selectedStats?.attendance || "0%"}</p>
//               </div>

//               <button
//                 onClick={() => setShowEmailModal(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl transition"
//               >
//                 Email Entire Class
//               </button>
//             </div>
//           </div>

//           {loadingStudents ? (
//             <div className="border rounded-2xl p-6 text-gray-500">
//               Loading students...
//             </div>
//           ) : students.length === 0 ? (
//             <div className="border rounded-2xl p-6 text-gray-500">
//               No students enrolled in this program yet.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4">
//               {students.map((student) => {
//                 const support = student.program_member_support?.[0];

//                 return (
//                   <div
//                     key={student.id}
//                     className="border rounded-3xl p-5 hover:shadow-sm transition"
//                   >
//                     <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
//                       <div>
//                         <p className="text-xs text-gray-500">Member</p>
//                         <h3 className="font-bold text-lg text-gray-800 mt-1">
//                           {student.people?.fname} {student.people?.lname}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           {student.people?.email || "No email"}
//                         </p>
//                         <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
//                           {student.enrollment_status || "active"}
//                         </span>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">
//                           Buddy Match
//                         </label>
//                         <select
//                           defaultValue={support?.buddy_id || ""}
//                           onChange={(e) =>
//                             updateSupport(
//                               student.id,
//                               e.target.value,
//                               support?.support_notes || "",
//                             )
//                           }
//                           className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
//                         >
//                           <option value="">
//                             {buddyOptions.length === 0
//                               ? "No assigned volunteers found"
//                               : "No buddy assigned"}
//                           </option>

//                           {buddyOptions.map((buddy) => (
//                             <option key={buddy.id} value={buddy.id}>
//                               {buddy.fname} {buddy.lname}
//                               {buddy.email ? ` - ${buddy.email}` : ""}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="xl:col-span-2">
//                         <div className="flex items-center justify-between mb-2">
//                           <label className="block text-sm font-medium text-gray-600">
//                             Program Support Needs Notes
//                           </label>
//                           {savingId === student.id && (
//                             <span className="text-xs text-[#0f5b54]">
//                               Saving...
//                             </span>
//                           )}
//                         </div>

//                         <textarea
//                           defaultValue={support?.support_notes || ""}
//                           placeholder="Support notes..."
//                           className="w-full border rounded-2xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
//                           onBlur={(e) =>
//                             updateSupport(
//                               student.id,
//                               support?.buddy_id || "",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {showEmailModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl relative">
//             <div className="w-[420px] border-r bg-gray-50 p-6 overflow-y-auto">
//               <h2 className="text-2xl font-bold text-[#0f5b54] mb-2">
//                 Email Designer
//               </h2>

//               <p className="text-sm text-gray-500 mb-6">
//                 Select a template and customize the email before sending.
//               </p>

//               <div className="space-y-4 pb-24">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Template
//                   </label>
//                   <select
//                     value={selectedTemplate}
//                     onChange={(e) => setSelectedTemplate(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                   >
//                     <option value="inclusive">Inclusive World Template</option>
//                     <option value="welcome">Welcome Email</option>
//                     <option value="reminder">Class Reminder</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Subject
//                   </label>
//                   <input
//                     value={emailSubject}
//                     onChange={(e) => setEmailSubject(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                     placeholder="Email Subject"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Program
//                   </label>
//                   <input
//                     value={selectedProgram?.course_title || ""}
//                     disabled
//                     className="w-full border rounded-xl p-3 bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Lead Name
//                   </label>
//                   <input
//                     value={leadName}
//                     onChange={(e) => setLeadName(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Co-Lead Name
//                   </label>
//                   <input
//                     value={coLeadName}
//                     onChange={(e) => setCoLeadName(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     rows={8}
//                     value={emailBody}
//                     onChange={(e) => setEmailBody(e.target.value)}
//                     className="w-full border rounded-xl p-3 resize-y"
//                   />
//                 </div>

//                 {(selectedTemplate === "welcome" ||
//                   selectedTemplate === "reminder") && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Meeting Date
//                       </label>
//                       <input
//                         type="date"
//                         value={meetingDate}
//                         onChange={(e) => setMeetingDate(e.target.value)}
//                         className="w-full border rounded-xl p-3"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Meeting Time
//                       </label>
//                       <input
//                         value={meetingTime}
//                         onChange={(e) => setMeetingTime(e.target.value)}
//                         className="w-full border rounded-xl p-3"
//                         placeholder="6:00 PM PST"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Meeting Location
//                       </label>
//                       <input
//                         value={meetingLocation}
//                         onChange={(e) => setMeetingLocation(e.target.value)}
//                         className="w-full border rounded-xl p-3"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Meeting Link
//                       </label>
//                       <input
//                         value={meetingLink}
//                         onChange={(e) => setMeetingLink(e.target.value)}
//                         className="w-full border rounded-xl p-3"
//                       />
//                     </div>
//                   </>
//                 )}

//                 {selectedTemplate === "welcome" && (
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       LMS Course Link
//                     </label>
//                     <input
//                       placeholder="LMS Course Link"
//                       value={canvasLink}
//                       onChange={(e) => setCanvasLink(e.target.value)}
//                       className="w-full border rounded-xl p-3"
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Additional Notes
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={additionalNotes}
//                     onChange={(e) => setAdditionalNotes(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Signed By
//                   </label>
//                   <input
//                     value={signedBy}
//                     onChange={(e) => setSignedBy(e.target.value)}
//                     className="w-full border rounded-xl p-3"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
//               <h2 className="text-2xl font-bold text-[#0f5b54] mb-6">
//                 Live Preview
//               </h2>

//               <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto p-10 overflow-hidden">
//                 <div
//                   className="overflow-x-auto"
//                   dangerouslySetInnerHTML={{ __html: generatePreview() }}
//                 />
//               </div>
//             </div>

//             <div className="absolute bottom-8 right-8 flex gap-3">
//               <button
//                 onClick={() => setShowEmailModal(false)}
//                 className="px-6 py-3 bg-white border rounded-xl shadow-sm"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={sendEmail}
//                 className="px-6 py-3 bg-[#0f5b54] text-white rounded-xl shadow-sm"
//               >
//                 Send Email
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { encodePersonId } from "../../../../utils/opdRouteToken";

export default function Programs({ user }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [rosterRows, setRosterRows] = useState([]);
  const [buddyOptions, setBuddyOptions] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);

  const [activeRosterTab, setActiveRosterTab] = useState("members");
  const [selectedInfo, setSelectedInfo] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("inclusive");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [canvasLink, setCanvasLink] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [leadName, setLeadName] = useState("");
  const [coLeadName, setCoLeadName] = useState("");
  const [signedBy, setSignedBy] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [programRosterCounts, setProgramRosterCounts] = useState({});
  const [selectedInfoView, setSelectedInfoView] = useState("basic");
  const [selectedInfoOPD, setSelectedInfoOPD] = useState(null);
  const [loadingInfoOPD, setLoadingInfoOPD] = useState(false);

  const [leadOPDComment, setLeadOPDComment] = useState("");
  const [savingLeadOPDComment, setSavingLeadOPDComment] = useState(false);
  const [selectedInfoOPDComments, setSelectedInfoOPDComments] = useState([]);

  useEffect(() => {
    if (user?.person_id) {
      fetchPrograms();
    }
  }, [user?.person_id]);

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  // const fetchPrograms = async () => {
  //   setLoadingPrograms(true);

  //   const { data, error } = await supabase
  //     .from("programs")
  //     .select("*")
  //     .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
  //     .eq("is_archived", false)
  //     .order("academic_year", { ascending: false })
  //     .order("course_title", { ascending: true });

  //   if (error) {
  //     console.error("Error fetching programs:", error);
  //     setLoadingPrograms(false);
  //     return;
  //   }

  //   const programList = data || [];
  //   const programIds = programList.map((p) => p.id);

  //   if (programIds.length > 0) {
  //     const { data: attendanceData, error: attendanceError } = await supabase
  //       .from("attendance")
  //       .select("program_id, attendance_status")
  //       .in("program_id", programIds);

  //     if (attendanceError) {
  //       console.error("Error fetching attendance:", attendanceError);
  //     } else {
  //       setAttendanceRows(attendanceData || []);
  //     }
  //   }

  //   const { data: rosterCountRows, error: rosterCountError } = await supabase
  //     .from("person_programs")
  //     .select("program_id, role, status")
  //     .in("program_id", programIds);

  //   if (rosterCountError) {
  //     console.error("Error fetching roster counts:", rosterCountError);
  //   } else {
  //     const counts = {};

  //     (rosterCountRows || []).forEach((row) => {
  //       const role = normalize(row.role);
  //       const status = normalize(row.status);

  //       if (status !== "current" && status !== "active") return;
  //       if (role !== "member" && role !== "volunteer") return;

  //       if (!counts[row.program_id]) {
  //         counts[row.program_id] = { members: 0, volunteers: 0 };
  //       }

  //       if (role === "member") counts[row.program_id].members += 1;
  //       if (role === "volunteer") counts[row.program_id].volunteers += 1;
  //     });

  //     setProgramRosterCounts(counts);
  //   }

  //   setPrograms(programList);
  //   setLoadingPrograms(false);
  // };

  const fetchPrograms = async () => {
    setLoadingPrograms(true);

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .or(`lead_id.eq.${user.person_id},co_lead_id.eq.${user.person_id}`)
      .eq("is_archived", false)
      .order("academic_year", { ascending: false })
      .order("course_title", { ascending: true });

    if (error) {
      console.error("Error fetching programs:", error);
      setLoadingPrograms(false);
      return;
    }

    const programList = data || [];
    const programIds = programList.map((p) => p.id);

    const { data: rosterCountRows, error: rosterCountError } = await supabase
      .from("person_programs")
      .select("program_id, role, status")
      .in("program_id", programIds);

    const counts = {};

    if (!rosterCountError) {
      (rosterCountRows || []).forEach((row) => {
        const role = row.role?.toLowerCase();
        const status = row.status?.toLowerCase();

        if (status !== "current" && status !== "active") return;

        if (!counts[row.program_id]) {
          counts[row.program_id] = { members: 0, volunteers: 0 };
        }

        if (role === "member") counts[row.program_id].members += 1;
        if (role === "volunteer") counts[row.program_id].volunteers += 1;
      });
    }

    setProgramRosterCounts(counts);

    if (programIds.length > 0) {
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("program_id, attendance_status")
        .in("program_id", programIds);

      if (attendanceError) {
        console.error("Error fetching attendance:", attendanceError);
      } else {
        setAttendanceRows(attendanceData || []);
      }
    }

    setPrograms(programList);
    setLoadingPrograms(false);
  };

  const fetchRoster = async (programId) => {
    setLoadingRoster(true);
    setRosterRows([]);
    setBuddyOptions([]);

    const { data: assignedRows, error: assignedError } = await supabase
      .from("person_programs")
      .select(
        `
    id,
    person_id,
    program_id,
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
      .eq("program_id", programId);

    if (assignedError) {
      console.error("Error fetching assigned roster:", assignedError);
      setLoadingRoster(false);
      return;
    }

    const usableAssignedRows = (assignedRows || []).filter((row) => {
      const role = normalize(row.role);
      const status = normalize(row.status);

      return (
        (status === "current" || status === "active") &&
        (role === "member" || role === "volunteer")
      );
    });

    const { data: enrollmentRows, error: enrollmentError } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        people:student_id(
          id,
          fname,
          lname,
          email
        ),
        program_member_support(
          id,
          buddy_id,
          support_notes,
          updated_at
        )
      `,
      )
      .eq("program_id", programId);

    if (enrollmentError) {
      console.error("Error fetching enrollments:", enrollmentError);
    }

    const enrollmentsByPersonId = new Map(
      (enrollmentRows || []).map((row) => [row.student_id, row]),
    );

    const enrollmentIds = (enrollmentRows || []).map((row) => row.id);

    let buddyRows = [];

    if (enrollmentIds.length > 0) {
      const { data: buddyData, error: buddyError } = await supabase
        .from("program_member_buddies")
        .select("enrollment_id, buddy_id")
        .in("enrollment_id", enrollmentIds);

      if (buddyError) {
        console.error("Error fetching buddy assignments:", buddyError);
      }

      buddyRows = buddyData || [];
    }

    const buddiesByEnrollmentId = new Map();

    buddyRows.forEach((row) => {
      if (!buddiesByEnrollmentId.has(row.enrollment_id)) {
        buddiesByEnrollmentId.set(row.enrollment_id, []);
      }

      buddiesByEnrollmentId.get(row.enrollment_id).push(row.buddy_id);
    });

    const emails = [
      ...new Set(
        (usableAssignedRows || [])
          .map((row) => row.people?.email?.toLowerCase())
          .filter(Boolean),
      ),
    ];

    let memberApps = [];
    let volunteerApps = [];

    if (emails.length > 0) {
      const { data: memberData, error: memberError } = await supabase
        .from("member_applications")
        .select("*")
        .in("email", emails);

      if (memberError) {
        console.error("Error fetching member applications:", memberError);
      }

      const { data: volunteerData, error: volunteerError } = await supabase
        .from("volunteer_applications")
        .select("*")
        .in("email", emails);

      if (volunteerError) {
        console.error("Error fetching volunteer applications:", volunteerError);
      }

      memberApps = memberData || [];
      volunteerApps = volunteerData || [];
    }

    const memberAppByEmail = new Map(
      memberApps.map((app) => [app.email?.toLowerCase(), app]),
    );

    const volunteerAppByEmail = new Map(
      volunteerApps.map((app) => [app.email?.toLowerCase(), app]),
    );

    const mergedRows = (usableAssignedRows || []).map((row) => {
      const role = normalize(row.role);
      const email = row.people?.email?.toLowerCase();
      const enrollment = enrollmentsByPersonId.get(row.person_id);
      const support = enrollment?.program_member_support?.[0] || null;

      return {
        ...row,
        role,
        enrollment,
        support,
        buddyIds: enrollment?.id
          ? buddiesByEnrollmentId.get(enrollment.id) || []
          : [],
        application:
          role === "member"
            ? memberAppByEmail.get(email)
            : volunteerAppByEmail.get(email),
      };
    });

    setRosterRows(mergedRows);

    setBuddyOptions(
      mergedRows
        .filter((row) => row.role === "volunteer")
        .map((row) => row.people)
        .filter(Boolean),
    );

    setLoadingRoster(false);
  };

  const loadProgramLeads = async (program) => {
    let lead = "";
    let coLead = "";

    if (program.lead_id) {
      const { data } = await supabase
        .from("people")
        .select("fname,lname")
        .eq("id", program.lead_id)
        .maybeSingle();

      if (data) {
        lead = `${data.fname || ""} ${data.lname || ""}`.trim();
      }
    }

    if (program.co_lead_id) {
      const { data } = await supabase
        .from("people")
        .select("fname,lname")
        .eq("id", program.co_lead_id)
        .maybeSingle();

      if (data) {
        coLead = `${data.fname || ""} ${data.lname || ""}`.trim();
      }
    }

    setLeadName(lead);
    setCoLeadName(coLead);
    setSignedBy(lead);
  };

  const openProgram = async (program) => {
    setSelectedProgram(program);
    setActiveRosterTab("members");
    setEmailSubject(`${program.course_title} Update`);

    await Promise.all([fetchRoster(program.id), loadProgramLeads(program)]);
  };

  const getAttendanceAverage = (programId) => {
    const rows = attendanceRows.filter((row) => row.program_id === programId);
    if (rows.length === 0) return "0%";

    const present = rows.filter(
      (row) => row.attendance_status === "present",
    ).length;

    return `${Math.round((present / rows.length) * 100)}%`;
  };

  // const updateSupport = async (enrollmentId, buddyId, notes) => {
  //   if (!enrollmentId) {
  //     alert(
  //       "This member is assigned to the program but does not have an enrollment row yet.",
  //     );
  //     return;
  //   }

  //   setSavingId(enrollmentId);

  //   const row = rosterRows.find((r) => r.enrollment?.id === enrollmentId);
  //   const existing = row?.support;

  //   if (existing) {
  //     const { error } = await supabase
  //       .from("program_member_support")
  //       .update({
  //         buddy_id: buddyId || null,
  //         support_notes: notes || "",
  //         updated_at: new Date().toISOString(),
  //       })
  //       .eq("id", existing.id);

  //     if (error) {
  //       console.error("Error updating support:", error);
  //     }
  //   } else {
  //     const { error } = await supabase.from("program_member_support").insert({
  //       enrollment_id: enrollmentId,
  //       buddy_id: buddyId || null,
  //       support_notes: notes || "",
  //     });

  //     if (error) {
  //       console.error("Error creating support:", error);
  //     }
  //   }

  //   if (selectedProgram?.id) {
  //     await fetchRoster(selectedProgram.id);
  //   }

  //   setSavingId(null);
  // };

  const getOrCreateEnrollment = async (row) => {
    if (row.enrollment?.id) return row.enrollment;

    const { data: existingEnrollment, error: existingError } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", row.person_id)
      .eq("program_id", row.program_id)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking enrollment:", existingError);
      return null;
    }

    if (existingEnrollment) return existingEnrollment;

    const { data: newEnrollment, error: createError } = await supabase
      .from("enrollments")
      .insert({
        student_id: row.person_id,
        program_id: row.program_id,
        enrollment_status: "active",
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Error creating enrollment:", createError);
      alert("Could not create enrollment row for this member.");
      return null;
    }

    return newEnrollment;
  };

  const updateSupport = async (row, notes) => {
    const enrollment = await getOrCreateEnrollment(row);
    if (!enrollment?.id) return;

    setSavingId(enrollment.id);

    const existing = row.support;

    if (existing) {
      const { error } = await supabase
        .from("program_member_support")
        .update({
          support_notes: notes || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) console.error("Error updating support:", error);
    } else {
      const { error } = await supabase.from("program_member_support").insert({
        enrollment_id: enrollment.id,
        support_notes: notes || "",
      });

      if (error) console.error("Error creating support:", error);
    }

    if (selectedProgram?.id) {
      await fetchRoster(selectedProgram.id);
    }

    setSavingId(null);
  };

  const updateBuddies = async (row, buddyIds) => {
    const enrollment = await getOrCreateEnrollment(row);
    if (!enrollment?.id) return;

    await supabase
      .from("program_member_buddies")
      .delete()
      .eq("enrollment_id", enrollment.id);

    if (buddyIds.length > 0) {
      const inserts = buddyIds.map((buddyId) => ({
        enrollment_id: enrollment.id,
        buddy_id: buddyId,
      }));

      const { error } = await supabase
        .from("program_member_buddies")
        .insert(inserts);

      if (error) {
        console.error("Error assigning buddies:", error);
        alert("Could not assign buddies.");
        return;
      }
    }

    await fetchRoster(selectedProgram.id);
  };

  const memberRows = useMemo(
    () => rosterRows.filter((row) => row.role === "member"),
    [rosterRows],
  );

  const volunteerRows = useMemo(
    () => rosterRows.filter((row) => row.role === "volunteer"),
    [rosterRows],
  );

  const visibleRosterRows =
    activeRosterTab === "members" ? memberRows : volunteerRows;

  const selectedStats = useMemo(() => {
    if (!selectedProgram) return null;

    return {
      members: memberRows.length,
      volunteers: volunteerRows.length,
      attendance: getAttendanceAverage(selectedProgram.id),
    };
  }, [selectedProgram, memberRows, volunteerRows, attendanceRows]);

  const years = useMemo(() => {
    return [...new Set(programs.map((p) => p.academic_year).filter(Boolean))];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const query = search.toLowerCase();

      const matchesSearch =
        p.course_title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.course_code?.toLowerCase().includes(query) ||
        String(p.academic_year || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "current" && p.is_active) ||
        (statusFilter === "completed" && !p.is_active);

      const matchesYear =
        yearFilter === "all" || String(p.academic_year) === String(yearFilter);

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [programs, search, statusFilter, yearFilter]);

  const templateConfig = {
    welcome: {
      banner: "CLASS WELCOME EMAIL",
      title: (programName) => `Welcome to ${programName}`,
      showMeetingInfo: true,
      showMaterials: true,
      showCanvas: true,
      showNotes: true,
      closing:
        "We are very excited for our journey together and look forward to meeting everyone soon.",
    },
    inclusive: {
      banner: "INCLUSIVE WORLD COMMUNICATION",
      title: () => emailSubject || "Inclusive World Update",
      showMeetingInfo: false,
      showMaterials: false,
      showCanvas: false,
      showNotes: true,
      closing: "Thank you for being part of the Inclusive World community.",
    },
    reminder: {
      banner: "CLASS REMINDER",
      title: (programName) => `${programName} Reminder`,
      showMeetingInfo: true,
      showMaterials: false,
      showCanvas: false,
      showNotes: true,
      closing: "Please reach out if you have any questions before class.",
    },
  };

  const generatePreview = () => {
    const config = templateConfig[selectedTemplate];

    const introHtml =
      selectedTemplate === "welcome"
        ? coLeadName
          ? `
            Welcome to the <strong>${selectedProgram?.course_title}</strong> class!
            <br/><br/>
            My name is <strong>${leadName}</strong>, and I am one of the instructors.
            Along with me, <strong>${coLeadName}</strong> will also be supporting this program.
          `
          : `
            Welcome to the <strong>${selectedProgram?.course_title}</strong> class!
            <br/><br/>
            My name is <strong>${leadName}</strong>, and I will be your instructor for this program.
          `
        : "Hello Everyone,";

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f8f7">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table role="presentation" width="100%" style="max-width:620px;width:100%;border-radius:24px;overflow:hidden;border:1px solid #e4ece9;font-family:Arial,Helvetica,sans-serif;table-layout:fixed;">
              <tr>
                <td bgcolor="#0c4f49" align="center" style="padding:50px 36px;">
                  <img src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png" width="72" style="display:block;margin-bottom:24px;" />
                  <div style="color:#d7efeb;font-size:12px;font-weight:bold;letter-spacing:1.6px;margin-bottom:18px;">
                    ${config.banner}
                  </div>
                  <div style="color:#ffffff;font-size:36px;line-height:44px;font-weight:bold;">
                    ${config.title(selectedProgram?.course_title || "Program")}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:42px 36px;">
                  <div style="color:#5d6c69;font-size:16px;line-height:30px;">
                    ${introHtml}
                  </div>

                  ${
                    emailBody
                      ? `
                        <div style="color:#5d6c69;font-size:15px;line-height:24px;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin-top:24px;">
                          ${emailBody}
                        </div>
                      `
                      : ""
                  }

                  ${
                    config.showMeetingInfo
                      ? `
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fbfa" style="margin-top:34px;border-radius:18px;border:1px solid #e5efec;">
                          <tr>
                            <td style="padding:28px;">
                              <div style="color:#0c4f49;font-size:20px;font-weight:bold;margin-bottom:12px;">Class Information</div>
                              <div style="color:#61706d;font-size:15px;line-height:30px;">
                                ${meetingDate ? `<strong>Date:</strong> ${meetingDate}<br/>` : ""}
                                ${meetingTime ? `<strong>Time:</strong> ${meetingTime}<br/>` : ""}
                                ${meetingLocation ? `<strong>Location:</strong> ${meetingLocation}<br/>` : ""}
                                ${
                                  meetingLink
                                    ? `<strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a><br/>`
                                    : ""
                                }
                              </div>
                            </td>
                          </tr>
                        </table>
                      `
                      : ""
                  }

                  ${
                    config.showMaterials
                      ? `
                        <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Materials Needed</div>
                        <div style="color:#5d6c69;font-size:15px;line-height:30px;margin-top:10px;">
                          • Laptop (Windows or Mac)<br/>
                          • External Mouse<br/>
                          • Power Charging Cables
                        </div>
                      `
                      : ""
                  }

                  ${
                    config.showCanvas && canvasLink
                      ? `
                        <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Canvas Course</div>
                        <div style="color:#5d6c69;font-size:15px;line-height:30px;margin-top:10px;">
                          <a href="${canvasLink}">${canvasLink}</a>
                        </div>
                      `
                      : ""
                  }

                  ${
                    config.showNotes && additionalNotes
                      ? `
                        <div style="margin-top:32px;color:#0c4f49;font-size:18px;font-weight:bold;">Additional Notes</div>
                        <div style="margin-top:12px;color:#5d6c69;line-height:30px;">
                          ${additionalNotes}
                        </div>
                      `
                      : ""
                  }

                  <div style="margin-top:42px;color:#667572;font-size:15px;line-height:28px;">
                    ${config.closing}
                  </div>

                  <div style="margin-top:42px;color:#667572;font-size:15px;line-height:28px;">
                    Thanks,<br/><br/>
                    <strong>${signedBy || leadName || "Inclusive World Team"}</strong>
                    ${user?.email ? `<br/>Email: ${user.email}` : ""}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  };

  const sendEmail = async () => {
    try {
      const recipients = memberRows
        .filter((row) => row.people?.email)
        .map((row) => ({
          email: row.people.email,
          name: `${row.people.fname || ""} ${row.people.lname || ""}`.trim(),
        }));

      if (recipients.length === 0) {
        alert("No member emails found for this class.");
        return;
      }

      if (!emailSubject.trim()) {
        alert("Please enter an email subject.");
        return;
      }

      const levelLabel = selectedProgram?.level
        ? `${selectedProgram.level.charAt(0).toUpperCase()}${selectedProgram.level.slice(1)}`
        : "Program";

      const senderName = `Inclusive World - ${selectedProgram.course_title} (${levelLabel}) Leads`;
      const receiverName = `Inclusive World - ${selectedProgram.course_title} (${levelLabel})`;

      const response = await fetch("/api/program_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject: emailSubject,
          htmlContent: generatePreview(),
          senderName,
          receiverName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      alert("Email sent successfully");
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const getInfoValues = (row) => {
    const app = row.application;
    const isMember = row.role === "member";

    const fullName = isMember
      ? `${app?.fname || row.people?.fname || ""} ${app?.lname || row.people?.lname || ""}`.trim()
      : `${app?.first_name || row.people?.fname || ""} ${app?.last_name || row.people?.lname || ""}`.trim();

    const parent1Name = isMember
      ? `${app?.p1_fname || ""} ${app?.p1_lname || ""}`.trim()
      : `${app?.parent_first_name || ""} ${app?.parent_last_name || ""}`.trim();

    const parent2Name = isMember
      ? `${app?.p2_fname || ""} ${app?.p2_lname || ""}`.trim()
      : "";

    const emergencyName = isMember
      ? `${app?.e_fname || ""} ${app?.e_lname || ""}`.trim()
      : `${app?.emergency_first_name || ""} ${app?.emergency_last_name || ""}`.trim();

    return {
      isMember,
      fullName,
      phone: app?.phone,
      email: app?.email || row.people?.email,
      parent1Name,
      parent1Relationship: isMember
        ? app?.p1_relationship
        : app?.parent_relationship,
      parent1Phone1: isMember ? app?.p1_phone1 : app?.parent_phone_1,
      parent1Phone2: isMember ? app?.p1_phone2 : app?.parent_phone_2,
      parent1Email: isMember ? app?.p1_email : app?.parent_email,
      parent2Name,
      parent2Relationship: app?.p2_relationship,
      parent2Phone1: app?.p2_phone1,
      parent2Phone2: app?.p2_phone2,
      parent2Email: app?.p2_email,
      emergencyName,
      emergencyRelationship: isMember
        ? app?.e_relationship
        : app?.emergency_relationship,
      emergencyPhone1: isMember ? app?.e_phone1 : app?.emergency_phone_1,
      emergencyPhone2: isMember ? app?.e_phone2 : app?.emergency_phone_2,
      emergencyEmail: isMember ? app?.e_email : app?.emergency_email,
    };
  };

  const getAssignedMembersForVolunteer = (volunteerId) => {
    return memberRows.filter((member) =>
      (member.buddyIds || []).includes(volunteerId),
    );
  };

  const OPD_LABELS = {
    admire_about_me: "What People Admire About Me",
    important_to_me: "What Is Important To Me",
    things_i_like_to_do: "Things I Like To Do",
    things_i_want_to_learn: "Things I Want To Learn",
    what_makes_me_happy: "What Makes Me Happy",
    what_makes_me_sad: "What Makes Me Sad",
    communication_preference: "Communication Preference",
    how_to_support_me: "How To Support Me",
    vision_for_future: "My Vision For The Future",
    characteristics_i_like: "Characteristics I Like In People",
    characteristics_i_dislike: "Characteristics I Dislike In People",
    risk_factors: "Risk Factors / Notes",
  };

  const getSelectedPersonId = (row) => {
    return (
      row?.people?.id ||
      row?.person?.id ||
      row?.person_id ||
      row?.enrollment?.student_id ||
      row?.id
    );
  };

  // const fetchSelectedInfoOPD = async (row) => {
  //   const personId = getSelectedPersonId(row);

  //   if (!personId) {
  //     setSelectedInfoOPD(null);
  //     return;
  //   }

  //   setLoadingInfoOPD(true);

  //   const { data, error } = await supabase
  //     .from("opd_profiles")
  //     .select("*")
  //     .eq("person_id", personId)
  //     .in("status", ["for_review", "published"])
  //     .order("updated_at", { ascending: false })
  //     .limit(1)
  //     .maybeSingle();

  //   if (error) {
  //     console.error("OPD fetch error:", error);
  //     setSelectedInfoOPD(null);
  //   } else {
  //     setSelectedInfoOPD(data || null);
  //   }

  //   setLoadingInfoOPD(false);
  // };

  const fetchSelectedInfoOPD = async (row) => {
    const personId = getSelectedPersonId(row);

    if (!personId) {
      setSelectedInfoOPD(null);
      setSelectedInfoOPDComments([]);
      return;
    }

    setLoadingInfoOPD(true);

    const { data, error } = await supabase
      .from("opd_profiles")
      .select("*")
      .eq("person_id", personId)
      .in("status", ["for_review", "published"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("OPD fetch error:", error);
      setSelectedInfoOPD(null);
      setSelectedInfoOPDComments([]);
      setLoadingInfoOPD(false);
      return;
    }

    setSelectedInfoOPD(data || null);

    if (data?.id) {
      const { data: commentRows, error: commentError } = await supabase
        .from("opd_comments")
        .select(
          `
        *,
        people:person_id (
          fname,
          lname,
          role
        )
      `,
        )
        .eq("opd_profile_id", data.id)
        .eq("visibility", "internal")
        .order("created_at", { ascending: false });

      if (commentError) {
        console.error("Lead OPD comments error:", commentError);
      }

      setSelectedInfoOPDComments(commentRows || []);
    } else {
      setSelectedInfoOPDComments([]);
    }

    setLoadingInfoOPD(false);
  };

  const addLeadOPDComment = async () => {
    if (!leadOPDComment.trim()) return;

    if (!selectedInfoOPD?.id) {
      alert("No OPD found for this person.");
      return;
    }

    setSavingLeadOPDComment(true);

    const personId = getSelectedPersonId(selectedInfo);

    const { error } = await supabase.from("opd_comments").insert({
      opd_profile_id: selectedInfoOPD.id,
      person_id: user?.person_id || null,
      comment: leadOPDComment.trim(),
      visibility: "internal",
      status: "open",
      resolved: false,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingLeadOPDComment(false);
      return;
    }

    await supabase.from("notifications").insert({
      title: "New lead comment on OPD",
      message: `A program lead added an internal OPD comment for ${
        selectedInfo?.people?.fname || "a participant"
      } ${selectedInfo?.people?.lname || ""}.`,
      role_target: "pcs",
      person_id: null,
      link_url: `/one-portal/pcs/opd/${encodePersonId(personId)}`,
      expires_at: null,
    });

    setLeadOPDComment("");
    await fetchSelectedInfoOPD(selectedInfo);

    setSavingLeadOPDComment(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0f5b54] to-[#063a35] rounded-3xl shadow-sm p-8 text-white">
        <p className="text-sm text-white/70">Program Lead Workspace</p>

        <h1 className="text-4xl font-bold mt-2">Programs</h1>

        <p className="text-white/80 mt-3 max-w-3xl">
          Manage your assigned programs, view enrolled members and volunteers,
          assign buddies, update support notes, and send class emails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Programs</p>
          <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
            {programs.length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Current</p>
          <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
            {programs.filter((p) => p.is_active).length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
            {programs.filter((p) => !p.is_active).length}
          </h2>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Selected Roster</p>
          <h2 className="text-3xl font-bold text-[#0f5b54] mt-1">
            {rosterRows.length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search Programs
            </label>
            <input
              placeholder="Search by name, code, description, or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Academic Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Assigned Programs
            </h2>
            <p className="text-sm text-gray-500">
              {filteredPrograms.length} program
              {filteredPrograms.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Academic Year</th>
                <th className="text-left p-4">Duration</th>
                <th className="text-left p-4">Members</th>
                <th className="text-left p-4">Volunteers</th>
                <th className="text-left p-4">Attendance Avg</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingPrograms ? (
                <tr>
                  <td colSpan="8" className="p-8 text-gray-500">
                    Loading programs...
                  </td>
                </tr>
              ) : filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-gray-500">
                    No programs found.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className={`border-t hover:bg-gray-50 ${
                      selectedProgram?.id === program.id ? "bg-[#0f5b54]/5" : ""
                    }`}
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {program.course_title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {program.course_code || "No course code"}
                      </p>
                      {program.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {program.description}
                        </p>
                      )}
                    </td>

                    <td className="p-4">{program.academic_year || "-"}</td>
                    <td className="p-4">{program.duration || "-"}</td>

                    <td className="p-4">
                      {programRosterCounts[program.id]?.members || 0}/
                      {program.member_capacity || 0}
                    </td>

                    <td className="p-4">
                      {programRosterCounts[program.id]?.volunteers || 0}/
                      {program.volunteer_capacity || 0}
                    </td>

                    <td className="p-4 font-medium">
                      {getAttendanceAverage(program.id)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          program.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {program.is_active ? "Current" : "Completed"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => openProgram(program)}
                        className="bg-[#0f5b54] hover:bg-[#0b4741] text-white px-4 py-2 rounded-xl transition"
                      >
                        View Roster
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProgram && (
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
            <div>
              <p className="text-sm text-gray-500">Program Roster</p>
              <h2 className="text-2xl font-bold text-[#0f5b54]">
                {selectedProgram.course_title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View members and volunteers, assign buddy matches, and update
                program support needs notes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
                <p className="text-xs text-gray-500">Members</p>
                <p className="font-bold">{selectedStats?.members || 0}</p>
              </div>

              <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
                <p className="text-xs text-gray-500">Volunteers</p>
                <p className="font-bold">{selectedStats?.volunteers || 0}</p>
              </div>

              <div className="px-4 py-2 bg-gray-50 border rounded-2xl">
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="font-bold">{selectedStats?.attendance || "0%"}</p>
              </div>

              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl transition"
              >
                Email Entire Class
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setActiveRosterTab("members")}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                activeRosterTab === "members"
                  ? "bg-[#0f5b54] text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Members ({memberRows.length})
            </button>

            <button
              onClick={() => setActiveRosterTab("volunteers")}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                activeRosterTab === "volunteers"
                  ? "bg-[#0f5b54] text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Volunteers ({volunteerRows.length})
            </button>
          </div>

          {loadingRoster ? (
            <div className="border rounded-2xl p-6 text-gray-500">
              Loading roster...
            </div>
          ) : visibleRosterRows.length === 0 ? (
            <div className="border rounded-2xl p-6 text-gray-500">
              No {activeRosterTab} assigned to this program yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {visibleRosterRows.map((row) => {
                const person = row.people;
                const support = row.support;
                const isMember = row.role === "member";

                return (
                  <div
                    key={row.id}
                    className="border rounded-3xl p-5 hover:shadow-sm transition"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                      <div>
                        <p className="text-xs text-gray-500">
                          {isMember ? "Member" : "Volunteer"}
                        </p>

                        <h3 className="font-bold text-lg text-gray-800 mt-1">
                          {person?.fname} {person?.lname}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {person?.email || "No email"}
                        </p>

                        <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {row.status || "current"}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedInfo(row);
                            setSelectedInfoView("basic");
                            setSelectedInfoOPD(null);
                          }}
                          className="mt-3 ml-3 px-4 py-2 rounded-xl bg-[#0f5b54] text-white text-sm font-medium"
                        >
                          View Info
                        </button>
                      </div>

                      {isMember ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Buddy Match
                            </label>
                            <div className="w-full border rounded-2xl p-3 min-h-[120px]">
                              {buddyOptions.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                  No assigned volunteers found
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {buddyOptions.map((buddy) => {
                                    const checked = (
                                      row.buddyIds || []
                                    ).includes(buddy.id);

                                    return (
                                      <label
                                        key={buddy.id}
                                        className="flex items-center gap-3 text-sm cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(e) => {
                                            const current = row.buddyIds || [];

                                            const nextBuddyIds = e.target
                                              .checked
                                              ? [...current, buddy.id]
                                              : current.filter(
                                                  (id) => id !== buddy.id,
                                                );

                                            updateBuddies(row, nextBuddyIds);
                                          }}
                                          className="accent-[#0f5b54]"
                                        />

                                        <span>
                                          {buddy.fname} {buddy.lname}
                                          {buddy.email
                                            ? ` - ${buddy.email}`
                                            : ""}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* <select
                              value={support?.buddy_id || ""}
                              onChange={(e) =>
                                updateSupport(
                                  row,
                                  e.target.value,
                                  support?.support_notes || "",
                                )
                              }
                              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
                            >
                              <option value="">
                                {buddyOptions.length === 0
                                  ? "No assigned volunteers found"
                                  : "No buddy assigned"}
                              </option>

                              {buddyOptions.map((buddy) => (
                                <option key={buddy.id} value={buddy.id}>
                                  {buddy.fname} {buddy.lname}
                                  {buddy.email ? ` - ${buddy.email}` : ""}
                                </option>
                              ))}
                            </select> */}
                          </div>

                          <div className="xl:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-600">
                                Program Support Needs Notes
                              </label>

                              {savingId === row.enrollment?.id && (
                                <span className="text-xs text-[#0f5b54]">
                                  Saving...
                                </span>
                              )}
                            </div>

                            <textarea
                              defaultValue={support?.support_notes || ""}
                              placeholder="Support notes..."
                              className="w-full border rounded-2xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
                              onBlur={(e) => updateSupport(row, e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="xl:col-span-3 text-sm text-gray-600">
                          {(() => {
                            const assignedMembers =
                              getAssignedMembersForVolunteer(person?.id);

                            if (assignedMembers.length === 0) {
                              return (
                                <p>
                                  This volunteer is available for buddy
                                  assignment.
                                </p>
                              );
                            }

                            return (
                              <div>
                                <p className="font-semibold text-gray-700 mb-2">
                                  Assigned to:
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  {assignedMembers.map((member) => (
                                    <span
                                      key={member.id}
                                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
                                    >
                                      {member.people?.fname}{" "}
                                      {member.people?.lname}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* {selectedInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInfo(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#0f5b54] mb-5">
              Basic Info
            </h2>

            {(() => {
              const info = getInfoValues(selectedInfo);

              return (
                <div className="space-y-5 text-sm">
                  <div className="border rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3">
                      {info.isMember ? "Member" : "Volunteer"} Details
                    </h3>
                    <p>
                      <strong>Name:</strong> {info.fullName || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {info.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>Email:</strong> {info.email || "Not provided"}
                    </p>
                  </div>

                  <div className="border rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3">Parent 1</h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {info.parent1Name || "Not provided"}
                    </p>
                    <p>
                      <strong>Relationship:</strong>{" "}
                      {info.parent1Relationship || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone 1:</strong>{" "}
                      {info.parent1Phone1 || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone 2:</strong>{" "}
                      {info.parent1Phone2 || "Not provided"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {info.parent1Email || "Not provided"}
                    </p>
                  </div>

                  {info.isMember && (
                    <div className="border rounded-2xl p-4">
                      <h3 className="font-bold text-gray-800 mb-3">Parent 2</h3>
                      <p>
                        <strong>Name:</strong>{" "}
                        {info.parent2Name || "Not provided"}
                      </p>
                      <p>
                        <strong>Relationship:</strong>{" "}
                        {info.parent2Relationship || "Not provided"}
                      </p>
                      <p>
                        <strong>Phone 1:</strong>{" "}
                        {info.parent2Phone1 || "Not provided"}
                      </p>
                      <p>
                        <strong>Phone 2:</strong>{" "}
                        {info.parent2Phone2 || "Not provided"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {info.parent2Email || "Not provided"}
                      </p>
                    </div>
                  )}

                  <div className="border rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Emergency Contact
                    </h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {info.emergencyName || "Not provided"}
                    </p>
                    <p>
                      <strong>Relationship:</strong>{" "}
                      {info.emergencyRelationship || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone 1:</strong>{" "}
                      {info.emergencyPhone1 || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone 2:</strong>{" "}
                      {info.emergencyPhone2 || "Not provided"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {info.emergencyEmail || "Not provided"}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )} */}

      {selectedInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInfo(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* TOP BUTTONS */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSelectedInfoView("basic")}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  selectedInfoView === "basic"
                    ? "bg-[#0f5b54] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Basic Info
              </button>

              <button
                onClick={async () => {
                  setSelectedInfoView("opd");
                  await fetchSelectedInfoOPD(selectedInfo);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  selectedInfoView === "opd"
                    ? "bg-[#0f5b54] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                OPD
              </button>
            </div>

            {/* BASIC INFO VIEW */}
            {selectedInfoView === "basic" ? (
              (() => {
                const info = getInfoValues(selectedInfo);

                return (
                  <div className="space-y-5 text-sm">
                    {/* PUT ALL YOUR EXISTING BASIC INFO CONTENT HERE */}

                    <div className="border rounded-2xl p-4">
                      <h3 className="font-bold text-gray-800 mb-3">
                        {info.isMember ? "Member" : "Volunteer"} Details
                      </h3>

                      <p>
                        <strong>Name:</strong> {info.fullName || "Not provided"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {info.phone || "Not provided"}
                      </p>
                      <p>
                        <strong>Email:</strong> {info.email || "Not provided"}
                      </p>
                    </div>

                    {/* keep your Parent 1, Parent 2, Emergency Contact blocks here */}
                  </div>
                );
              })()
            ) : (
              /* OPD VIEW */
              <div className="space-y-5 text-sm">
                {loadingInfoOPD ? (
                  <p className="text-gray-500">Loading OPD...</p>
                ) : !selectedInfoOPD ? (
                  <div className="border rounded-2xl p-5 text-gray-500">
                    No OPD has been released for this person yet.
                  </div>
                ) : (
                  <>
                    <div className="border rounded-2xl p-4 bg-[#f4faf8]">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-bold capitalize text-[#0f5b54]">
                        {selectedInfoOPD.status?.replaceAll("_", " ")}
                      </p>

                      <p className="text-xs text-gray-500 mt-3">Signed By</p>
                      <p className="font-medium">
                        {selectedInfoOPD.signed_by_name || "-"}
                      </p>
                    </div>

                    {Object.entries(OPD_LABELS).map(([key, label]) => {
                      const savedData = selectedInfoOPD.data || {};
                      const editedData = savedData.edited || savedData;

                      return (
                        <div key={key} className="border rounded-2xl p-4">
                          <h3 className="font-bold text-[#0f5b54] mb-2">
                            {label}
                          </h3>

                          <p className="whitespace-pre-wrap break-words text-gray-700">
                            {editedData[key] || "-"}
                          </p>
                        </div>
                      );
                    })}
                    <div className="border-t pt-5 mt-5 space-y-4">
                      <h3 className="font-bold text-[#0f5b54]">
                        Lead Comments
                      </h3>

                      <p className="text-sm text-gray-500">
                        These comments are internal and visible only to PCS.
                        Members and volunteers will not see them.
                      </p>

                      <textarea
                        value={leadOPDComment}
                        onChange={(e) => setLeadOPDComment(e.target.value)}
                        rows={4}
                        placeholder="Add an internal comment for the PCS team..."
                        className="w-full border rounded-xl p-3"
                      />

                      <button
                        disabled={
                          savingLeadOPDComment || !leadOPDComment.trim()
                        }
                        onClick={addLeadOPDComment}
                        className={`px-5 py-2 rounded-xl text-white ${
                          savingLeadOPDComment || !leadOPDComment.trim()
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#0f5b54]"
                        }`}
                      >
                        {savingLeadOPDComment ? "Saving..." : "Add Comment"}
                      </button>

                      <div className="space-y-3">
                        {selectedInfoOPDComments.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No internal comments yet.
                          </p>
                        ) : (
                          selectedInfoOPDComments.map((c) => (
                            <div
                              key={c.id}
                              className="border rounded-xl p-3 bg-gray-50"
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {c.comment}
                              </p>

                              <p className="text-xs text-gray-500 mt-2">
                                {c.people
                                  ? `${c.people.fname} ${c.people.lname} (${c.people.role})`
                                  : "Unknown"}{" "}
                                · {new Date(c.created_at).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl relative">
            <div className="w-[420px] border-r bg-gray-50 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#0f5b54] mb-2">
                Email Designer
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Select a template and customize the email before sending.
              </p>

              <div className="space-y-4 pb-24">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  >
                    <option value="inclusive">Inclusive World Template</option>
                    <option value="welcome">Welcome Email</option>
                    <option value="reminder">Class Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full border rounded-xl p-3"
                    placeholder="Email Subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Program
                  </label>
                  <input
                    value={selectedProgram?.course_title || ""}
                    disabled
                    className="w-full border rounded-xl p-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lead Name
                  </label>
                  <input
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Co-Lead Name
                  </label>
                  <input
                    value={coLeadName}
                    onChange={(e) => setCoLeadName(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full border rounded-xl p-3 resize-y"
                  />
                </div>

                {(selectedTemplate === "welcome" ||
                  selectedTemplate === "reminder") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Meeting Date
                      </label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Meeting Time
                      </label>
                      <input
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="w-full border rounded-xl p-3"
                        placeholder="6:00 PM PST"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Meeting Location
                      </label>
                      <input
                        value={meetingLocation}
                        onChange={(e) => setMeetingLocation(e.target.value)}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Meeting Link
                      </label>
                      <input
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === "welcome" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      LMS Course Link
                    </label>
                    <input
                      placeholder="LMS Course Link"
                      value={canvasLink}
                      onChange={(e) => setCanvasLink(e.target.value)}
                      className="w-full border rounded-xl p-3"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Signed By
                  </label>
                  <input
                    value={signedBy}
                    onChange={(e) => setSignedBy(e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-[#0f5b54] mb-6">
                Live Preview
              </h2>

              <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto p-10 overflow-hidden">
                <div
                  className="overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: generatePreview() }}
                />
              </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-3 bg-white border rounded-xl shadow-sm"
              >
                Cancel
              </button>

              <button
                onClick={sendEmail}
                className="px-6 py-3 bg-[#0f5b54] text-white rounded-xl shadow-sm"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
