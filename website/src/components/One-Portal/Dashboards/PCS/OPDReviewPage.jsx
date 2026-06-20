// import { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabase";

// const LABELS = {
//   admire_about_me: "What People Admire About Me",
//   important_to_me: "What Is Important To Me",
//   things_i_like_to_do: "Things I Like To Do",
//   things_i_want_to_learn: "Things I Want To Learn",
//   what_makes_me_happy: "What Makes Me Happy",
//   what_makes_me_sad: "What Makes Me Sad",
//   communication_preference: "Communication Preference",
//   how_to_support_me: "How To Support Me",
//   vision_for_future: "My Vision For The Future",
//   characteristics_i_like: "Characteristics I Like In People",
//   characteristics_i_dislike: "Characteristics I Dislike In People",
//   risk_factors: "Risk Factors / Notes",
// };

// const OPDReviewPage = ({ user }) => {
//   const [loading, setLoading] = useState(true);
//   const [opd, setOpd] = useState(null);
//   const [opdData, setOpdData] = useState({});
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);

//     const { data: profile, error } = await supabase
//       .from("opd_profiles")
//       .select("*")
//       .eq("person_id", user.person_id)
//       .in("status", ["for_review", "published"])
//       .order("updated_at", { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     if (error) {
//       console.error(error);
//       alert(error.message);
//       setLoading(false);
//       return;
//     }

//     if (!profile) {
//       setLoading(false);
//       return;
//     }

//     const savedData = profile.data || {};
//     const editedData = savedData.edited || savedData;

//     setOpd(profile);
//     setOpdData(editedData || {});

//     const { data: commentRows, error: commentError } = await supabase
//       .from("opd_comments")
//       .select("*")
//       .eq("opd_profile_id", profile.id)
//       .eq("visibility", "reviewer")
//       .order("created_at", { ascending: true });

//     if (commentError) {
//       console.error(commentError);
//     }

//     setComments(commentRows || []);
//     setLoading(false);
//   };

//   const addComment = async () => {
//     if (!newComment.trim() || !opd?.id) return;

//     const { error } = await supabase.from("opd_comments").insert({
//       opd_profile_id: opd.id,
//       person_id: user.person_id,
//       comment: newComment.trim(),
//       visibility: "reviewer",
//       status: "open",
//       resolved: false,
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setNewComment("");
//     fetchData();
//   };

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading OPD...</div>;
//   }

//   if (!opd) {
//     return (
//       <div className="p-6">
//         <div className="bg-white border rounded-2xl p-8 text-center">
//           <h1 className="text-2xl font-semibold text-[#0f5b54] mb-2">
//             No OPD Available Yet
//           </h1>
//           <p className="text-gray-500">
//             Your One Page Description has not been released for review yet.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-semibold text-[#0f5b54]">
//           Review Your One Page Description
//         </h1>

//         <p className="text-gray-500 mt-1">
//           Please review the information below and leave comments if changes are
//           needed.
//         </p>
//       </div>

//       <div className="bg-white border rounded-2xl p-6 space-y-6">
//         {Object.entries(LABELS).map(([key, label]) => (
//           <Section key={key} title={label} value={opdData[key]} />
//         ))}

//         <div className="pt-4 border-t">
//           <p className="text-sm text-gray-500">Signed By</p>
//           <p className="font-medium">{opd.signed_by_name || "-"}</p>
//         </div>
//       </div>

//       <div className="bg-white border rounded-2xl p-6">
//         <h2 className="text-xl font-semibold mb-4">Review Comments</h2>

//         <div className="space-y-4 mb-6">
//           {comments.length === 0 ? (
//             <p className="text-gray-500">No comments yet.</p>
//           ) : (
//             comments.map((comment) => (
//               <div key={comment.id} className="border rounded-xl p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <span
//                     className={`text-xs px-2 py-1 rounded-full capitalize ${
//                       comment.status === "resolved"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-orange-100 text-orange-700"
//                     }`}
//                   >
//                     {comment.status}
//                   </span>

//                   <span className="text-xs text-gray-500">
//                     {new Date(comment.created_at).toLocaleString()}
//                   </span>
//                 </div>

//                 <p className="whitespace-pre-wrap">{comment.comment}</p>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="space-y-3">
//           <textarea
//             rows={4}
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Request changes or provide feedback..."
//             className="w-full border rounded-xl p-3"
//           />

//           <button
//             onClick={addComment}
//             className="bg-[#0f5b54] text-white px-5 py-2 rounded-xl"
//           >
//             Submit Comment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Section({ title, value }) {
//   return (
//     <div>
//       <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>

//       <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap break-words overflow-hidden leading-relaxed">
//         {value || "-"}
//       </div>
//     </div>
//   );
// }

// export default OPDReviewPage;

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sparkles } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import { BsEmojiSmile } from "react-icons/bs";
import { CgSmileSad } from "react-icons/cg";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaRocket } from "react-icons/fa";

const LABELS = {
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

const OPDReviewPage = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [opd, setOpd] = useState(null);
  const [opdData, setOpdData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: profile, error } = await supabase
      .from("opd_profiles")
      .select("*")
      .eq("person_id", user.person_id)
      .in("status", ["for_review", "published"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
      return;
    }

    if (!profile) {
      setLoading(false);
      return;
    }

    const savedData = profile.data || {};
    const editedData = savedData.edited || savedData;

    setOpd(profile);
    setOpdData(editedData || {});

    const { data: commentRows, error: commentError } = await supabase
      .from("opd_comments")
      .select("*")
      .eq("opd_profile_id", profile.id)
      .eq("visibility", "reviewer")
      .order("created_at", { ascending: true });

    if (commentError) console.error(commentError);

    setComments(commentRows || []);
    setLoading(false);
  };

  const addComment = async () => {
    if (!newComment.trim() || !opd?.id) return;

    const { error } = await supabase.from("opd_comments").insert({
      opd_profile_id: opd.id,
      person_id: user.person_id,
      comment: newComment.trim(),
      visibility: "reviewer",
      status: "open",
      resolved: false,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setNewComment("");
    fetchData();
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading OPD...</div>;
  }

  if (!opd) {
    return (
      <div className="p-6">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#0f5b54] mb-2">
            No OPD Available Yet
          </h1>
          <p className="text-gray-500">
            Your One Page Description has not been released for review yet.
          </p>
        </div>
      </div>
    );
  }

  const isPublished = opd.status === "published";

  const OPD_BACKGROUND =
    "https://res.cloudinary.com/ddcxejrmd/image/upload/v1780450038/Screenshot_2026-06-02_at_6.27.11_PM_bzlbux.png";

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const addPageBackground = async (pdf) => {
    if (!OPD_BACKGROUND) return;

    try {
      const backgroundImage = await loadImage(OPD_BACKGROUND);
      pdf.addImage(backgroundImage, "PNG", 0, 0, 210, 297);
    } catch (err) {
      console.error("Background image failed:", err);
    }
  };

  const drawHeader = async (pdf, small = false) => {
    await addPageBackground(pdf);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(small ? 18 : 26);

    pdf.text(
      `${user?.fname || ""} ${user?.lname || ""}`.trim() ||
        "One Page Description",
      35,
      small ? 28 : 40,
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(small ? 10 : 12);
    pdf.text("One Page Description", 35, small ? 35 : 48);
  };

  const addSection = (pdf, title, content, startY) => {
    autoTable(pdf, {
      startY,
      head: [[title]],
      body: [[content || "-"]],
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        valign: "top",
        textColor: [50, 50, 50],
      },
      headStyles: {
        fillColor: [15, 91, 84],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 12,
        cellPadding: 4,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      margin: {
        left: 25,
        right: 48,
      },
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  const exportPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.height;

      await drawHeader(pdf, false);

      let y = 68;

      for (const [key, label] of Object.entries(LABELS)) {
        y = addSection(pdf, label, opdData[key], y);

        if (y > pageHeight - 50) {
          pdf.addPage();
          await drawHeader(pdf, false);
          y = 70;
        }
      }

      y = addSection(pdf, "Signed By", opd?.signed_by_name || "-", y);

      pdf.save(`OPD_${user?.username || user?.person_id}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className={isPublished ? "text-center" : ""}>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <h1 className="text-3xl font-semibold text-[#0f5b54]">
            {isPublished
              ? "My Published One Page Description"
              : "Review Your One Page Description"}
          </h1>

          {isPublished && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Published
            </span>
          )}
        </div>

        <p className="text-gray-500 mt-1">
          {isPublished
            ? "This is your finalized One Page Description."
            : "Please review the information below and leave comments if changes are needed."}
        </p>
      </div>

      <div
        className={
          isPublished
            ? "bg-white border rounded-3xl p-8 shadow-sm space-y-6"
            : "bg-white border rounded-2xl p-6 space-y-6"
        }
      >
        {isPublished ? (
          //   <PublishedView opdData={opdData} opd={opd} />
          <PublishedView opdData={opdData} opd={opd} exportPDF={exportPDF} />
        ) : (
          Object.entries(LABELS).map(([key, label]) => (
            <Section key={key} title={label} value={opdData[key]} />
          ))
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">Signed By</p>
          <p className="font-medium">{opd.signed_by_name || "-"}</p>
        </div>
      </div>

      {!isPublished && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Review Comments</h2>

          <CommentsList comments={comments} />

          <div className="space-y-3 mt-6">
            <textarea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Request changes or provide feedback..."
              className="w-full border rounded-xl p-3"
            />

            <button
              onClick={addComment}
              className="bg-[#0f5b54] text-white px-5 py-2 rounded-xl"
            >
              Submit Comment
            </button>
          </div>
        </div>
      )}

      {isPublished && comments.length > 0 && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Past Review Comments</h2>
          <CommentsList comments={comments} />
        </div>
      )}
    </div>
  );
};

// function PublishedView({ opdData, opd }) {
//   const exportPDF = () => {
//     const pdf = new jsPDF("p", "mm", "a4");

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(22);
//     pdf.text("One Page Description", 20, 20);

//     pdf.setFontSize(14);
//     pdf.text(`Signed By: ${opd.signed_by_name || "-"}`, 20, 30);

//     autoTable(pdf, {
//       startY: 40,
//       head: [["Section", "Details"]],
//       body: Object.entries(LABELS).map(([key, label]) => [
//         label,
//         opdData[key] || "-",
//       ]),
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//         overflow: "linebreak",
//       },
//       headStyles: {
//         fillColor: [15, 91, 84],
//         textColor: 255,
//       },
//       columnStyles: {
//         0: { cellWidth: 55, fontStyle: "bold" },
//         1: { cellWidth: 120 },
//       },
//     });

//     pdf.save("Published_OPD.pdf");
//   };

//   return (
//     <div className="space-y-6">
//       <div
//         id="opd-content"
//         className="bg-white rounded-3xl shadow-xl overflow-hidden"
//       >
//         <div className="relative bg-[#f6f6f6] px-10 py-8">
//           <img
//             src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
//             alt="Inclusive World"
//             className="h-20 mb-5"
//           />

//           <h1 className="text-4xl font-bold text-[#0f5b54]">
//             One Page Description
//           </h1>

//           <p className="italic text-gray-500 mt-2">
//             Prepared for Support at Inclusive World
//           </p>

//           <p className="text-sm text-gray-400 mt-4">Status: Published</p>
//         </div>

//         <div className="p-10 space-y-8">
//           <PublishedSection
//             icon={
//               <Sparkles
//                 size={30}
//                 className="text-yellow-400"
//                 fill="currentColor"
//               />
//             }
//             title="What people appreciate about me"
//             value={opdData.admire_about_me}
//           />

//           <PublishedSection
//             icon={<TbTargetArrow size={30} className="text-red-400" />}
//             title="What is important to me"
//             value={opdData.important_to_me}
//           />

//           <PublishedSection
//             icon={<BsEmojiSmile size={30} className="text-yellow-600" />}
//             title="What makes me happy"
//             value={opdData.what_makes_me_happy}
//           />

//           <PublishedSection
//             icon={<CgSmileSad size={30} className="text-yellow-600" />}
//             title="What makes me sad or frustrated"
//             value={opdData.what_makes_me_sad}
//           />

//           <PublishedSection
//             icon={<IoChatbubbleEllipsesSharp size={30} />}
//             title="Communication Preference"
//             value={opdData.communication_preference}
//           />

//           <PublishedSection
//             icon={<GoHeartFill size={30} className="text-red-400" />}
//             title="How To Support Me"
//             value={opdData.how_to_support_me}
//           />

//           <PublishedSection
//             icon={<FaRocket size={30} className="text-red-400" />}
//             title="My Vision For The Future"
//             value={opdData.vision_for_future}
//           />

//           <PublishedSection
//             title="Things I Like To Do"
//             value={opdData.things_i_like_to_do}
//           />

//           <PublishedSection
//             title="Things I Want To Learn"
//             value={opdData.things_i_want_to_learn}
//           />

//           <PublishedSection
//             title="Characteristics I Like In People"
//             value={opdData.characteristics_i_like}
//           />

//           <PublishedSection
//             title="Characteristics I Dislike In People"
//             value={opdData.characteristics_i_dislike}
//           />

//           {opdData.risk_factors && (
//             <div>
//               <h2 className="text-xl font-bold text-red-600 mb-3">
//                 Risk Factors / Notes
//               </h2>

//               <div className="bg-red-50 p-5 rounded-xl border border-red-200 whitespace-pre-wrap break-words">
//                 {opdData.risk_factors}
//               </div>
//             </div>
//           )}

//           <div className="pt-4 border-t">
//             <p className="text-sm text-gray-500">Signed By</p>
//             <p className="font-medium">{opd.signed_by_name || "-"}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={exportPDF}
//           className="bg-[#0f5b54] hover:bg-[#0c4a45] text-white px-6 py-3 rounded-xl font-medium"
//         >
//           Export OPD PDF
//         </button>
//       </div>
//     </div>
//   );
// }
function PublishedView({ opdData, opd, exportPDF }) {
  return (
    <div className="space-y-6">
      <div
        id="opd-content"
        className="bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="relative bg-[#f6f6f6] px-10 py-8">
          <img
            src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1781905696/Screenshot_2026-06-13_at_8.16.18_PM_suw9v6-removebg-preview_byr9ne.png"
            alt="Inclusive World"
            className="h-20 mb-5"
          />

          <h1 className="text-4xl font-bold text-[#0f5b54]">
            One Page Description
          </h1>

          <p className="italic text-gray-500 mt-2">
            Prepared for Support at Inclusive World
          </p>

          <p className="text-sm text-gray-400 mt-4">Status: Published</p>
        </div>

        <div className="p-10 space-y-8">
          {Object.entries(LABELS).map(([key, label]) => (
            <PublishedSection key={key} title={label} value={opdData[key]} />
          ))}

          {/* <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Signed By</p>
            <p className="font-medium">{opd?.signed_by_name || "-"}</p>
          </div> */}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={exportPDF}
          className="bg-[#0f5b54] hover:bg-[#0c4a45] text-white px-6 py-3 rounded-xl font-medium"
        >
          Export OPD PDF
        </button>
      </div>
    </div>
  );
}

// function PublishedSection({ icon, title, value }) {
//   return (
//     <div>
//       <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
//         {icon && <span>{icon}</span>}
//         <span>{title}</span>
//       </h2>

//       <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-words leading-relaxed">
//         {value || "-"}
//       </div>
//     </div>
//   );
// }

function PublishedSection({ title, value }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0f5b54] mb-3">{title}</h2>

      <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-words leading-relaxed">
        {value || "-"}
      </div>
    </div>
  );
}

function Section({ title, value }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap break-words overflow-hidden leading-relaxed">
        {value || "-"}
      </div>
    </div>
  );
}

function CommentsList({ comments }) {
  if (comments.length === 0) {
    return <p className="text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-xs px-2 py-1 rounded-full capitalize ${
                comment.status === "resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {comment.status}
            </span>

            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>

          <p className="whitespace-pre-wrap break-words">{comment.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default OPDReviewPage;
