// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../../../lib/supabase";

// const ROLES = ["all", "member", "volunteer", "lead"];
// const OPD_STATUSES = [
//   "all",
//   "not_started",
//   "in_progress",
//   "for_review",
//   "published",
// ];

// const encodePersonId = (personId) =>
//   btoa(personId).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

// const formatStatus = (status) => (status || "not_started").replaceAll("_", " ");

// const normalizeEmail = (email) => email?.trim().toLowerCase();

// const Field = ({ label, value }) => (
//   <div className="bg-gray-50 rounded-xl p-4">
//     <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
//     <p className="font-medium whitespace-pre-wrap">
//       {Array.isArray(value)
//         ? value.join(", ")
//         : typeof value === "boolean"
//           ? value
//             ? "Yes"
//             : "No"
//           : value || "-"}
//     </p>
//   </div>
// );

// const DetailField = ({ label, value }) => (
//   <div className="bg-gray-50 rounded-xl p-4">
//     <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
//     <p className="font-medium text-gray-800 break-words">{value || "-"}</p>
//   </div>
// );

// const DetailSection = ({ title, children }) => (
//   <div className="border rounded-xl p-4">
//     <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
//     <div className="grid md:grid-cols-2 gap-4">{children}</div>
//   </div>
// );

// const OPDDashboard = () => {
//   const navigate = useNavigate();

//   const [people, setPeople] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   useEffect(() => {
//     fetchPeople();
//   }, []);

//   // const fetchPeople = async () => {
//   //   setLoading(true);

//   //   const { data, error } = await supabase
//   //     .from("people")
//   //     .select(
//   //       `
//   //       id,
//   //       fname,
//   //       lname,
//   //       email,
//   //       phone,
//   //       role,
//   //       is_active,
//   //       opd_status,
//   //       opd_released,
//   //       opd_profiles (
//   //         id,
//   //         academic_year,
//   //         status,
//   //         signed_by_name,
//   //         updated_at
//   //       )
//   //     `,
//   //     )
//   //     .in("role", ["member", "volunteer", "lead"])
//   //     .eq("is_active", true)
//   //     .order("fname", { ascending: true });

//   //   if (error) {
//   //     console.error(error);
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   setPeople(data || []);
//   //   setLoading(false);
//   // };

//   const fetchPeople = async () => {
//     setLoading(true);

//     const { data: peopleData, error: peopleError } = await supabase
//       .from("people")
//       .select(
//         `
//       id,
//       fname,
//       lname,
//       email,
//       phone,
//       role,
//       is_active,
//       opd_status,
//       opd_released
//     `,
//       )
//       .in("role", ["member", "volunteer", "lead"])
//       .or("is_active.eq.true,is_active.is.null")
//       .order("fname", { ascending: true });

//     if (peopleError) {
//       console.error("People fetch error:", peopleError);
//       alert(peopleError.message);
//       setLoading(false);
//       return;
//     }

//     const personIds = (peopleData || []).map((p) => p.id);
//     const emails = (peopleData || [])
//       .map((p) => normalizeEmail(p.email))
//       .filter(Boolean);

//     const { data: opdData } = await supabase
//       .from("opd_profiles")
//       .select(
//         "id, person_id, academic_year, status, signed_by_name, updated_at",
//       )
//       .in("person_id", personIds);

//     const { data: memberProfiles } = await supabase
//       .from("member_enrollment_profiles")
//       .select("*")
//       .in("person_id", personIds);

//     const { data: volunteerApplications } = await supabase
//       .from("volunteer_applications")
//       .select("*")
//       .in("email", emails);

//     const peopleWithDetails = (peopleData || []).map((person) => ({
//       ...person,
//       opd_profiles: (opdData || []).filter(
//         (opd) => opd.person_id === person.id,
//       ),
//       memberProfile: (memberProfiles || []).find(
//         (profile) => profile.person_id === person.id,
//       ),
//       volunteerApplication: (volunteerApplications || []).find(
//         (app) => normalizeEmail(app.email) === normalizeEmail(person.email),
//       ),
//     }));

//     setPeople(peopleWithDetails);
//     setLoading(false);
//   };

//   const buildOPD = (personId) => {
//     navigate(`/one-portal/pcs/opd/${encodePersonId(personId)}`);
//   };

//   const viewDetails = async (person) => {
//     setDetailsLoading(true);
//     setSelectedPerson({ ...person, applicationDetails: null });

//     let applicationDetails = null;

//     if (person.role === "member") {
//       const { data, error } = await supabase
//         .from("member_applications")
//         .select("*")
//         .eq("email", person.email)
//         .order("created_at", { ascending: false })
//         .limit(1)
//         .maybeSingle();

//       if (error) console.error(error);
//       applicationDetails = data;
//     }

//     if (person.role === "volunteer") {
//       const { data, error } = await supabase
//         .from("volunteer_applications")
//         .select("*")
//         .eq("email", person.email)
//         .order("created_at", { ascending: false })
//         .limit(1)
//         .maybeSingle();

//       if (error) console.error(error);
//       applicationDetails = data;
//     }

//     setSelectedPerson({ ...person, applicationDetails });
//     setDetailsLoading(false);
//   };

//   const filteredPeople = useMemo(() => {
//     const term = search.toLowerCase().trim();

//     return people.filter((person) => {
//       const fullName =
//         `${person.fname || ""} ${person.lname || ""}`.toLowerCase();

//       return (
//         (!term ||
//           fullName.includes(term) ||
//           person.email?.toLowerCase().includes(term)) &&
//         (roleFilter === "all" || person.role === roleFilter) &&
//         (statusFilter === "all" ||
//           (person.opd_status || "not_started") === statusFilter)
//       );
//     });
//   }, [people, search, roleFilter, statusFilter]);

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-semibold text-[#0f5b54]">OPDs</h1>
//         <p className="text-gray-500 mt-1">
//           Search people, build OPDs, and review released OPDs.
//         </p>
//       </div>

//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search by name or email"
//         className="border rounded-xl px-4 py-3 w-full max-w-xl bg-white"
//       />

//       <div className="flex flex-wrap gap-2">
//         {ROLES.map((role) => (
//           <button
//             key={role}
//             onClick={() => setRoleFilter(role)}
//             className={`px-4 py-2 rounded-full text-sm capitalize ${
//               roleFilter === role
//                 ? "bg-[#0f5b54] text-white"
//                 : "bg-white text-gray-700 border"
//             }`}
//           >
//             {role === "all" ? "All Roles" : role}
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-wrap gap-2">
//         {OPD_STATUSES.map((status) => (
//           <button
//             key={status}
//             onClick={() => setStatusFilter(status)}
//             className={`px-4 py-2 rounded-full text-sm capitalize ${
//               statusFilter === status
//                 ? "bg-[#0f5b54] text-white"
//                 : "bg-white text-gray-700 border"
//             }`}
//           >
//             {status === "all" ? "All Statuses" : formatStatus(status)}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <p className="text-gray-500">Loading people...</p>
//       ) : filteredPeople.length === 0 ? (
//         <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
//           No people found.
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
//           {filteredPeople.map((person) => {
//             const latestOPD = person.opd_profiles?.[0];

//             return (
//               <div
//                 key={person.id}
//                 className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="flex justify-between gap-3">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       {person.fname} {person.lname}
//                     </h2>
//                     <p className="text-sm text-gray-500">{person.email}</p>
//                     <p className="text-sm text-gray-500">
//                       {person.phone || "No phone"}
//                     </p>
//                   </div>

//                   <span className="h-fit px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs capitalize">
//                     {person.role}
//                   </span>
//                 </div>

//                 <div className="mt-4 space-y-1 text-sm">
//                   <p>
//                     <span className="text-gray-500">Status:</span>{" "}
//                     <span className="font-medium capitalize">
//                       {formatStatus(person.opd_status)}
//                     </span>
//                   </p>

//                   <p>
//                     <span className="text-gray-500">Released:</span>{" "}
//                     <span className="font-medium">
//                       {person.opd_released ? "Yes" : "No"}
//                     </span>
//                   </p>

//                   <p>
//                     <span className="text-gray-500">Academic Year:</span>{" "}
//                     <span className="font-medium">
//                       {latestOPD?.academic_year || "-"}
//                     </span>
//                   </p>

//                   <p>
//                     <span className="text-gray-500">Signed By:</span>{" "}
//                     <span className="font-medium">
//                       {latestOPD?.signed_by_name || "-"}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="flex gap-3 mt-5">
//                   <button
//                     onClick={() => buildOPD(person.id)}
//                     className="flex-1 bg-[#0f5b54] text-white py-2 rounded-lg text-sm"
//                   >
//                     Build OPD
//                   </button>

//                   <button
//                     onClick={() => viewDetails(person)}
//                     className="flex-1 border border-[#0f5b54] text-[#0f5b54] py-2 rounded-lg text-sm"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {selectedPerson && (
//         <div
//           className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
//           onClick={() => setSelectedPerson(null)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6 border-b flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-semibold text-[#0f5b54]">
//                   {selectedPerson.fname} {selectedPerson.lname}
//                 </h2>
//                 <p className="text-sm text-gray-500 capitalize">
//                   {selectedPerson.role}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedPerson(null)}
//                 className="text-gray-400 hover:text-gray-700 text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {detailsLoading ? (
//                 <p className="text-gray-500">Loading details...</p>
//               ) : (
//                 <>
//                   <DetailSection title="Basic Information">
//                     <DetailField
//                       label="First Name"
//                       value={selectedPerson.fname}
//                     />
//                     <DetailField
//                       label="Last Name"
//                       value={selectedPerson.lname}
//                     />
//                     <DetailField label="Email" value={selectedPerson.email} />
//                     <DetailField label="Phone" value={selectedPerson.phone} />
//                     <DetailField label="Role" value={selectedPerson.role} />
//                     <DetailField
//                       label="Status"
//                       value={formatStatus(selectedPerson.opd_status)}
//                     />
//                   </DetailSection>

//                   {selectedPerson.role === "member" && (
//                     <>
//                       <DetailSection title="Member Application Information">
//                         <DetailField
//                           label="First Name"
//                           value={selectedPerson.applicationDetails?.first_name}
//                         />
//                         <DetailField
//                           label="Last Name"
//                           value={selectedPerson.applicationDetails?.last_name}
//                         />
//                         <DetailField
//                           label="Email"
//                           value={selectedPerson.applicationDetails?.email}
//                         />
//                         <DetailField
//                           label="Phone"
//                           value={selectedPerson.applicationDetails?.phone}
//                         />
//                         <DetailField
//                           label="Date of Birth"
//                           value={selectedPerson.applicationDetails?.dob}
//                         />
//                         <DetailField
//                           label="Age"
//                           value={selectedPerson.applicationDetails?.age}
//                         />
//                         <DetailField
//                           label="Address"
//                           value={
//                             selectedPerson.applicationDetails?.mailing_address
//                           }
//                         />
//                         <DetailField
//                           label="Status"
//                           value={selectedPerson.applicationDetails?.status}
//                         />
//                       </DetailSection>

//                       <DetailSection title="Parent / Guardian Information">
//                         <DetailField
//                           label="Parent 1 Name"
//                           value={`${selectedPerson.applicationDetails?.parent1_first_name || ""} ${
//                             selectedPerson.applicationDetails
//                               ?.parent1_last_name || ""
//                           }`}
//                         />
//                         <DetailField
//                           label="Parent 1 Relationship"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.parent1_relationship
//                           }
//                         />
//                         <DetailField
//                           label="Parent 1 Phone"
//                           value={
//                             selectedPerson.applicationDetails?.parent1_phone_1
//                           }
//                         />
//                         <DetailField
//                           label="Parent 1 Email"
//                           value={
//                             selectedPerson.applicationDetails?.parent1_email
//                           }
//                         />

//                         <DetailField
//                           label="Parent 2 Name"
//                           value={`${selectedPerson.applicationDetails?.parent2_first_name || ""} ${
//                             selectedPerson.applicationDetails
//                               ?.parent2_last_name || ""
//                           }`}
//                         />
//                         <DetailField
//                           label="Parent 2 Relationship"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.parent2_relationship
//                           }
//                         />
//                         <DetailField
//                           label="Parent 2 Phone"
//                           value={
//                             selectedPerson.applicationDetails?.parent2_phone_1
//                           }
//                         />
//                         <DetailField
//                           label="Parent 2 Email"
//                           value={
//                             selectedPerson.applicationDetails?.parent2_email
//                           }
//                         />
//                       </DetailSection>

//                       <DetailSection title="Emergency Contact">
//                         <DetailField
//                           label="Name"
//                           value={`${selectedPerson.applicationDetails?.emergency_first_name || ""} ${
//                             selectedPerson.applicationDetails
//                               ?.emergency_last_name || ""
//                           }`}
//                         />
//                         <DetailField
//                           label="Relationship"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.emergency_relationship
//                           }
//                         />
//                         <DetailField
//                           label="Phone 1"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_phone_1
//                           }
//                         />
//                         <DetailField
//                           label="Phone 2"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_phone_2
//                           }
//                         />
//                         <DetailField
//                           label="Email"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_email
//                           }
//                         />
//                       </DetailSection>
//                     </>
//                   )}

//                   {selectedPerson.role === "volunteer" && (
//                     <>
//                       <DetailSection title="Volunteer Application Information">
//                         <DetailField
//                           label="First Name"
//                           value={selectedPerson.applicationDetails?.first_name}
//                         />
//                         <DetailField
//                           label="Last Name"
//                           value={selectedPerson.applicationDetails?.last_name}
//                         />
//                         <DetailField
//                           label="Email"
//                           value={selectedPerson.applicationDetails?.email}
//                         />
//                         <DetailField
//                           label="Phone"
//                           value={selectedPerson.applicationDetails?.phone}
//                         />
//                         <DetailField
//                           label="Date of Birth"
//                           value={selectedPerson.applicationDetails?.dob}
//                         />
//                         <DetailField
//                           label="Age"
//                           value={selectedPerson.applicationDetails?.age}
//                         />
//                         <DetailField
//                           label="Address"
//                           value={
//                             selectedPerson.applicationDetails?.mailing_address
//                           }
//                         />
//                         <DetailField
//                           label="Application Status"
//                           value={selectedPerson.applicationDetails?.status}
//                         />
//                         <DetailField
//                           label="Interest Form Completed"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.interest_form_completed
//                               ? "Yes"
//                               : "No"
//                           }
//                         />
//                         <DetailField
//                           label="Weekend Commitments"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.weekend_commitments
//                           }
//                         />
//                       </DetailSection>

//                       <DetailSection title="Parent / Guardian Information">
//                         <DetailField
//                           label="Parent Name"
//                           value={`${selectedPerson.applicationDetails?.parent_first_name || ""} ${
//                             selectedPerson.applicationDetails
//                               ?.parent_last_name || ""
//                           }`}
//                         />
//                         <DetailField
//                           label="Relationship"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.parent_relationship
//                           }
//                         />
//                         <DetailField
//                           label="Phone 1"
//                           value={
//                             selectedPerson.applicationDetails?.parent_phone_1
//                           }
//                         />
//                         <DetailField
//                           label="Phone 2"
//                           value={
//                             selectedPerson.applicationDetails?.parent_phone_2
//                           }
//                         />
//                         <DetailField
//                           label="Email"
//                           value={
//                             selectedPerson.applicationDetails?.parent_email
//                           }
//                         />
//                       </DetailSection>

//                       <DetailSection title="Emergency Contact">
//                         <DetailField
//                           label="Name"
//                           value={`${selectedPerson.applicationDetails?.emergency_first_name || ""} ${
//                             selectedPerson.applicationDetails
//                               ?.emergency_last_name || ""
//                           }`}
//                         />
//                         <DetailField
//                           label="Relationship"
//                           value={
//                             selectedPerson.applicationDetails
//                               ?.emergency_relationship
//                           }
//                         />
//                         <DetailField
//                           label="Phone 1"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_phone_1
//                           }
//                         />
//                         <DetailField
//                           label="Phone 2"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_phone_2
//                           }
//                         />
//                         <DetailField
//                           label="Email"
//                           value={
//                             selectedPerson.applicationDetails?.emergency_email
//                           }
//                         />
//                       </DetailSection>
//                     </>
//                   )}

//                   <div className="flex justify-end gap-3">
//                     <button
//                       onClick={() => setSelectedPerson(null)}
//                       className="px-4 py-2 rounded-lg border"
//                     >
//                       Close
//                     </button>

//                     <button
//                       onClick={() => buildOPD(selectedPerson.id)}
//                       className="px-4 py-2 rounded-lg bg-[#0f5b54] text-white"
//                     >
//                       Build OPD
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OPDDashboard;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/supabase";
import { encodePersonId } from "../../../../utils/opdRouteToken";

const ROLES = ["all", "member", "volunteer", "lead"];
const OPD_STATUSES = [
  "all",
  "not_started",
  "in_progress",
  "for_review",
  "published",
];

const formatStatus = (status) => (status || "not_started").replaceAll("_", " ");
const normalizeEmail = (email) => email?.trim().toLowerCase();

const DetailField = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800 break-words">{value || "-"}</p>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="border rounded-xl p-4">
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const OPDDashboard = () => {
  const navigate = useNavigate();

  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setLoading(true);

    const { data: peopleData, error: peopleError } = await supabase
      .from("people")
      .select(
        `
        id,
        fname,
        lname,
        email,
        phone,
        role,
        is_active,
        opd_status,
        opd_released
      `,
      )
      .in("role", ["member", "volunteer", "lead"])
      .or("is_active.eq.true,is_active.is.null")
      .order("fname", { ascending: true });

    if (peopleError) {
      console.error("People fetch error:", peopleError);
      alert(peopleError.message);
      setLoading(false);
      return;
    }

    const personIds = (peopleData || []).map((p) => p.id);
    const emails = (peopleData || [])
      .map((p) => normalizeEmail(p.email))
      .filter(Boolean);

    const { data: opdData, error: opdError } = await supabase
      .from("opd_profiles")
      .select(
        "id, person_id, academic_year, status, signed_by_name, updated_at",
      )
      .in("person_id", personIds);

    if (opdError) {
      console.error("OPD fetch error:", opdError);
    }

    const opdIds = (opdData || []).map((opd) => opd.id);

    let reviewerComments = [];

    if (opdIds.length > 0) {
      const { data: commentsData, error: commentsError } = await supabase
        .from("opd_comments")
        .select("id, opd_profile_id, visibility, status")
        .in("opd_profile_id", opdIds)
        .in("visibility", ["reviewer", "internal"])
        .eq("status", "open");

      if (commentsError) {
        console.error("Reviewer comments fetch error:", commentsError);
      } else {
        reviewerComments = commentsData || [];
      }
    }

    const { data: memberProfiles } = await supabase
      .from("member_enrollment_profiles")
      .select("*")
      .in("person_id", personIds);

    const { data: volunteerApplications } = await supabase
      .from("volunteer_applications")
      .select("*")
      .in("email", emails);

    const peopleWithDetails = (peopleData || []).map((person) => {
      const personOPDs = (opdData || []).filter(
        (opd) => opd.person_id === person.id,
      );

      const openReviewerCommentCount = personOPDs.reduce((count, opd) => {
        return (
          count +
          reviewerComments.filter(
            (comment) => comment.opd_profile_id === opd.id,
          ).length
        );
      }, 0);

      return {
        ...person,
        opd_profiles: personOPDs,
        openReviewerCommentCount,
        memberProfile: (memberProfiles || []).find(
          (profile) => profile.person_id === person.id,
        ),
        volunteerApplication: (volunteerApplications || []).find(
          (app) => normalizeEmail(app.email) === normalizeEmail(person.email),
        ),
      };
    });

    setPeople(peopleWithDetails);
    setLoading(false);
  };

  const buildOPD = (personId) => {
    navigate(`/one-portal/pcs/opd/${encodePersonId(personId)}`);
  };

  const viewDetails = async (person) => {
    setDetailsLoading(true);
    setSelectedPerson({ ...person, applicationDetails: null });

    let applicationDetails = null;

    if (person.role === "member") {
      const { data, error } = await supabase
        .from("member_applications")
        .select("*")
        .eq("email", person.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error(error);
      applicationDetails = data;
    }

    if (person.role === "volunteer") {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .eq("email", person.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error(error);
      applicationDetails = data;
    }

    setSelectedPerson({ ...person, applicationDetails });
    setDetailsLoading(false);
  };

  const filteredPeople = useMemo(() => {
    const term = search.toLowerCase().trim();

    return people.filter((person) => {
      const fullName =
        `${person.fname || ""} ${person.lname || ""}`.toLowerCase();

      return (
        (!term ||
          fullName.includes(term) ||
          person.email?.toLowerCase().includes(term)) &&
        (roleFilter === "all" || person.role === roleFilter) &&
        (statusFilter === "all" ||
          (person.opd_status || "not_started") === statusFilter)
      );
    });
  }, [people, search, roleFilter, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#0f5b54]">OPDs</h1>
        <p className="text-gray-500 mt-1">
          Search people, build OPDs, and review released OPDs.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="border rounded-xl px-4 py-3 w-full max-w-xl bg-white"
      />

      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              roleFilter === role
                ? "bg-[#0f5b54] text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            {role === "all" ? "All Roles" : role}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {OPD_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              statusFilter === status
                ? "bg-[#0f5b54] text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            {status === "all" ? "All Statuses" : formatStatus(status)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading people...</p>
      ) : filteredPeople.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No people found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPeople.map((person) => {
            const latestOPD = person.opd_profiles?.[0];

            return (
              <div
                key={person.id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {person.fname} {person.lname}
                    </h2>
                    <p className="text-sm text-gray-500">{person.email}</p>
                    <p className="text-sm text-gray-500">
                      {person.phone || "No phone"}
                    </p>
                  </div>

                  <span className="h-fit px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs capitalize">
                    {person.role}
                  </span>
                </div>

                {/* {person.openReviewerCommentCount > 0 && (
                  <div className="mt-4">
                    <span className="inline-flex bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {person.openReviewerCommentCount} comment
                      {person.openReviewerCommentCount === 1 ? "" : "s"} to
                      review
                    </span>
                  </div>
                )} */}
                {person.openReviewerCommentCount > 0 && (
                  <div className="mt-4">
                    <span className="inline-flex bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {person.openReviewerCommentCount} open OPD comment
                      {person.openReviewerCommentCount === 1 ? "" : "s"}
                    </span>
                  </div>
                )}

                <div className="mt-4 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="font-medium capitalize">
                      {formatStatus(person.opd_status)}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-500">Released:</span>{" "}
                    <span className="font-medium">
                      {person.opd_released ? "Yes" : "No"}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-500">Academic Year:</span>{" "}
                    <span className="font-medium">
                      {latestOPD?.academic_year || "-"}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-500">Signed By:</span>{" "}
                    <span className="font-medium">
                      {latestOPD?.signed_by_name || "-"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => buildOPD(person.id)}
                    className="flex-1 bg-[#0f5b54] text-white py-2 rounded-lg text-sm"
                  >
                    Build OPD
                  </button>

                  <button
                    onClick={() => viewDetails(person)}
                    className="flex-1 border border-[#0f5b54] text-[#0f5b54] py-2 rounded-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-[#0f5b54]">
                  {selectedPerson.fname} {selectedPerson.lname}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedPerson.role}
                </p>
              </div>

              <button
                onClick={() => setSelectedPerson(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {detailsLoading ? (
                <p className="text-gray-500">Loading details...</p>
              ) : (
                <>
                  <DetailSection title="Basic Information">
                    <DetailField
                      label="First Name"
                      value={selectedPerson.fname}
                    />
                    <DetailField
                      label="Last Name"
                      value={selectedPerson.lname}
                    />
                    <DetailField label="Email" value={selectedPerson.email} />
                    <DetailField label="Phone" value={selectedPerson.phone} />
                    <DetailField label="Role" value={selectedPerson.role} />
                    <DetailField
                      label="Status"
                      value={formatStatus(selectedPerson.opd_status)}
                    />
                  </DetailSection>

                  {selectedPerson.role === "member" && (
                    <>
                      <DetailSection title="Member Application Information">
                        <DetailField
                          label="First Name"
                          value={selectedPerson.applicationDetails?.first_name}
                        />
                        <DetailField
                          label="Last Name"
                          value={selectedPerson.applicationDetails?.last_name}
                        />
                        <DetailField
                          label="Email"
                          value={selectedPerson.applicationDetails?.email}
                        />
                        <DetailField
                          label="Phone"
                          value={selectedPerson.applicationDetails?.phone}
                        />
                        <DetailField
                          label="Date of Birth"
                          value={selectedPerson.applicationDetails?.dob}
                        />
                        <DetailField
                          label="Age"
                          value={selectedPerson.applicationDetails?.age}
                        />
                        <DetailField
                          label="Address"
                          value={
                            selectedPerson.applicationDetails?.mailing_address
                          }
                        />
                        <DetailField
                          label="Status"
                          value={selectedPerson.applicationDetails?.status}
                        />
                      </DetailSection>

                      <DetailSection title="Parent / Guardian Information">
                        <DetailField
                          label="Parent 1 Name"
                          value={`${selectedPerson.applicationDetails?.parent1_first_name || ""} ${
                            selectedPerson.applicationDetails
                              ?.parent1_last_name || ""
                          }`}
                        />
                        <DetailField
                          label="Parent 1 Relationship"
                          value={
                            selectedPerson.applicationDetails
                              ?.parent1_relationship
                          }
                        />
                        <DetailField
                          label="Parent 1 Phone"
                          value={
                            selectedPerson.applicationDetails?.parent1_phone_1
                          }
                        />
                        <DetailField
                          label="Parent 1 Email"
                          value={
                            selectedPerson.applicationDetails?.parent1_email
                          }
                        />

                        <DetailField
                          label="Parent 2 Name"
                          value={`${selectedPerson.applicationDetails?.parent2_first_name || ""} ${
                            selectedPerson.applicationDetails
                              ?.parent2_last_name || ""
                          }`}
                        />
                        <DetailField
                          label="Parent 2 Relationship"
                          value={
                            selectedPerson.applicationDetails
                              ?.parent2_relationship
                          }
                        />
                        <DetailField
                          label="Parent 2 Phone"
                          value={
                            selectedPerson.applicationDetails?.parent2_phone_1
                          }
                        />
                        <DetailField
                          label="Parent 2 Email"
                          value={
                            selectedPerson.applicationDetails?.parent2_email
                          }
                        />
                      </DetailSection>

                      <DetailSection title="Emergency Contact">
                        <DetailField
                          label="Name"
                          value={`${selectedPerson.applicationDetails?.emergency_first_name || ""} ${
                            selectedPerson.applicationDetails
                              ?.emergency_last_name || ""
                          }`}
                        />
                        <DetailField
                          label="Relationship"
                          value={
                            selectedPerson.applicationDetails
                              ?.emergency_relationship
                          }
                        />
                        <DetailField
                          label="Phone 1"
                          value={
                            selectedPerson.applicationDetails?.emergency_phone_1
                          }
                        />
                        <DetailField
                          label="Phone 2"
                          value={
                            selectedPerson.applicationDetails?.emergency_phone_2
                          }
                        />
                        <DetailField
                          label="Email"
                          value={
                            selectedPerson.applicationDetails?.emergency_email
                          }
                        />
                      </DetailSection>
                    </>
                  )}

                  {selectedPerson.role === "volunteer" && (
                    <>
                      <DetailSection title="Volunteer Application Information">
                        <DetailField
                          label="First Name"
                          value={selectedPerson.applicationDetails?.first_name}
                        />
                        <DetailField
                          label="Last Name"
                          value={selectedPerson.applicationDetails?.last_name}
                        />
                        <DetailField
                          label="Email"
                          value={selectedPerson.applicationDetails?.email}
                        />
                        <DetailField
                          label="Phone"
                          value={selectedPerson.applicationDetails?.phone}
                        />
                        <DetailField
                          label="Date of Birth"
                          value={selectedPerson.applicationDetails?.dob}
                        />
                        <DetailField
                          label="Age"
                          value={selectedPerson.applicationDetails?.age}
                        />
                        <DetailField
                          label="Address"
                          value={
                            selectedPerson.applicationDetails?.mailing_address
                          }
                        />
                        <DetailField
                          label="Application Status"
                          value={selectedPerson.applicationDetails?.status}
                        />
                        <DetailField
                          label="Interest Form Completed"
                          value={
                            selectedPerson.applicationDetails
                              ?.interest_form_completed
                              ? "Yes"
                              : "No"
                          }
                        />
                        <DetailField
                          label="Weekend Commitments"
                          value={
                            selectedPerson.applicationDetails
                              ?.weekend_commitments
                          }
                        />
                      </DetailSection>

                      <DetailSection title="Parent / Guardian Information">
                        <DetailField
                          label="Parent Name"
                          value={`${selectedPerson.applicationDetails?.parent_first_name || ""} ${
                            selectedPerson.applicationDetails
                              ?.parent_last_name || ""
                          }`}
                        />
                        <DetailField
                          label="Relationship"
                          value={
                            selectedPerson.applicationDetails
                              ?.parent_relationship
                          }
                        />
                        <DetailField
                          label="Phone 1"
                          value={
                            selectedPerson.applicationDetails?.parent_phone_1
                          }
                        />
                        <DetailField
                          label="Phone 2"
                          value={
                            selectedPerson.applicationDetails?.parent_phone_2
                          }
                        />
                        <DetailField
                          label="Email"
                          value={
                            selectedPerson.applicationDetails?.parent_email
                          }
                        />
                      </DetailSection>

                      <DetailSection title="Emergency Contact">
                        <DetailField
                          label="Name"
                          value={`${selectedPerson.applicationDetails?.emergency_first_name || ""} ${
                            selectedPerson.applicationDetails
                              ?.emergency_last_name || ""
                          }`}
                        />
                        <DetailField
                          label="Relationship"
                          value={
                            selectedPerson.applicationDetails
                              ?.emergency_relationship
                          }
                        />
                        <DetailField
                          label="Phone 1"
                          value={
                            selectedPerson.applicationDetails?.emergency_phone_1
                          }
                        />
                        <DetailField
                          label="Phone 2"
                          value={
                            selectedPerson.applicationDetails?.emergency_phone_2
                          }
                        />
                        <DetailField
                          label="Email"
                          value={
                            selectedPerson.applicationDetails?.emergency_email
                          }
                        />
                      </DetailSection>
                    </>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedPerson(null)}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => buildOPD(selectedPerson.id)}
                      className="px-4 py-2 rounded-lg bg-[#0f5b54] text-white"
                    >
                      Build OPD
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OPDDashboard;
