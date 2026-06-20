import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sparkles } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import { BsEmojiSmile } from "react-icons/bs";
import { CgSmileSad } from "react-icons/cg";
import { PiHandshake, PiPlantFill } from "react-icons/pi";
import { RiGraduationCapFill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaRocket } from "react-icons/fa";

const TABS = ["profile", "programs", "family"];

const Field = ({ label, value }) => (
  <div className="flex flex-col min-w-0">
    <span className="text-xs text-gray-500 mb-1">{label}</span>

    <div
      className="
        font-medium
        text-gray-800
        whitespace-pre-wrap
        break-words
        leading-relaxed
        bg-gray-50
        border
        rounded-lg
        px-3
        py-2
        min-h-[44px]
      "
    >
      {value || "-"}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow space-y-4">
    <h3 className="font-semibold text-[#0f5b54]">{title}</h3>
    {children}
  </div>
);

const EditableField = ({
  label,
  field,
  value,
  editing,
  updateField,
  readOnly = false,
  multiline = true,
}) => (
  <div className="flex flex-col min-w-0">
    <span className="text-xs text-gray-500 mb-1">{label}</span>

    {editing && !readOnly ? (
      multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="border rounded-lg p-2 mt-1 min-h-[44px]"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          className="border rounded-lg p-2 mt-1 min-h-[44px]"
        />
      )
    ) : (
      <div className="font-medium text-gray-800 whitespace-pre-wrap break-words leading-relaxed bg-gray-50 border rounded-lg px-3 py-2 min-h-[44px]">
        {value || "-"}
      </div>
    )}
  </div>
);

const VolunteerProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [data, setData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [assignedPrograms, setAssignedPrograms] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // useEffect(() => {
  //   fetchProfile();
  //   fetchPrograms();
  // }, [user?.person_id]);

  useEffect(() => {
    fetchProfile();
    fetchAssignedPrograms();
  }, [user?.person_id]);

  useEffect(() => {
    if (data?.selected_programs) {
      fetchPrograms();
    }
  }, [data]);

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setData(data);
    setFormData(data || {});
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const isAdult = getAge(formData.dob) >= 18;

  const saveProfile = async () => {
    try {
      const normalizeEmail = (email) => email?.trim().toLowerCase();
      const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");

      const volunteerEmail = normalizeEmail(formData.email);
      const parentEmail = normalizeEmail(formData.parent_email);
      const emergencyEmail = normalizeEmail(formData.emergency_email);

      if (
        emergencyEmail &&
        [volunteerEmail, parentEmail].filter(Boolean).includes(emergencyEmail)
      ) {
        alert(
          "Emergency contact email must be different from the volunteer and parent.",
        );
        return;
      }

      const volunteerPhone = normalizePhone(formData.phone);
      const parentPhone = normalizePhone(formData.parent_phone_1);
      const emergencyPhone = normalizePhone(formData.emergency_phone_1);

      if (
        emergencyPhone &&
        [volunteerPhone, parentPhone].filter(Boolean).includes(emergencyPhone)
      ) {
        alert(
          "Emergency contact phone must be different from the volunteer and parent.",
        );
        return;
      }

      if (!isAdult) {
        if (
          !formData.parent_first_name ||
          !formData.parent_last_name ||
          !formData.parent_phone_1 ||
          !formData.parent_email
        ) {
          alert(
            "Parent/guardian information is required for volunteers under 18.",
          );
          return;
        }
      }

      const { error } = await supabase
        .from("volunteer_applications")
        .update({
          phone: formData.phone,
          mailing_address: formData.mailing_address,

          parent_first_name: formData.parent_first_name,
          parent_last_name: formData.parent_last_name,
          parent_relationship: formData.parent_relationship,
          parent_phone_1: formData.parent_phone_1,
          parent_email: formData.parent_email,

          emergency_first_name: formData.emergency_first_name,
          emergency_last_name: formData.emergency_last_name,
          emergency_relationship: formData.emergency_relationship,
          emergency_phone_1: formData.emergency_phone_1,
          emergency_email: formData.emergency_email,

          weekend_commitments: formData.weekend_commitments,
          communication_style: formData.communication_style,
          support_preferences: formData.support_preferences,
          accommodations: formData.accommodations,
        })
        .eq("id", data.id);

      if (error) throw error;

      setData(formData);
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  /* ---------------- FETCH PROGRAMS ---------------- */
  // const fetchPrograms = async () => {
  //   if (!data?.selected_programs) return;

  //   const ids = Object.keys(data.selected_programs);

  //   if (!ids.length) return;

  //   const { data: programsData } = await supabase
  //     .from("programs")
  //     .select("id, course_title, level, sections")
  //     .in("id", ids);

  //   setPrograms(programsData || []);
  // };
  const fetchAssignedPrograms = async () => {
    if (!user?.person_id) return;

    const { data, error } = await supabase
      .from("person_programs")
      .select(
        `
      id,
      status,
      role,
      enrolled_at,
      program:programs (
        id,
        course_title,
        level
      )
    `,
      )
      .eq("person_id", user.person_id)
      .order("enrolled_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAssignedPrograms(data || []);
  };

  const fetchPrograms = async () => {
    if (!data?.selected_programs) return;

    const ids = Object.entries(data.selected_programs)
      .filter(([key, value]) => typeof value === "number" && key.includes("-"))
      .map(([key]) => key);

    if (!ids.length) return;

    const { data: programsData, error } = await supabase
      .from("programs")
      .select("id, course_title, level, sections")
      .in("id", ids);

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(programsData || []);
  };

  if (!data) return <div className="p-10">Loading...</div>;

  /* ---------------- UI HELPERS ---------------- */
  // const Field = ({ label, value }) => (
  //   <div className="flex flex-col">
  //     <span className="text-xs text-gray-500">{label}</span>
  //     <span className="font-medium">{value || "-"}</span>
  //   </div>
  // );

  // const exportPDF = async () => {
  //   const element = document.getElementById("opd-content");

  //   const canvas = await html2canvas(element, {
  //     scale: 2,
  //     useCORS: true,
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pageWidth = 210;

  //   const pageHeight = (canvas.height * pageWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

  //   pdf.save(`${data.first_name}_${data.last_name}_OPD.pdf`);
  // };

  const OPD_BACKGROUND =
    "https://res.cloudinary.com/ddcxejrmd/image/upload/v1780450038/Screenshot_2026-06-02_at_6.27.11_PM_bzlbux.png";

  // const PROFILE_PHOTO =
  //   "https://res.cloudinary.com/ddcxejrmd/image/upload/v1780447543/Screenshot_2026-06-02_at_5.45.37_PM_hkkuhm.png";

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);
      img.onerror = reject;

      img.src = url;
    });

  // const drawHeader = async (pdf) => {
  //   await addPageBackground(pdf);

  //   pdf.setFont("helvetica", "bold");
  //   pdf.setFontSize(26);

  //   pdf.text(`${data.first_name || ""} ${data.last_name || ""}`, 35, 40);

  //   pdf.setFont("helvetica", "normal");
  //   pdf.setFontSize(12);

  //   pdf.text("One Page Description", 35, 48);

  //   try {
  //     const profileImage = await loadImage(PROFILE_PHOTO);

  //     pdf.addImage(profileImage, "PNG", 155, 18, 28, 35);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const drawHeader = async (pdf, small = false) => {
    await addPageBackground(pdf);

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(small ? 18 : 26);

    pdf.text(
      `${data.first_name || ""} ${data.last_name || ""}`,
      35,
      small ? 28 : 40,
    );

    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(small ? 10 : 12);

    pdf.text("One Page Description", 35, small ? 35 : 48);

    // try {
    //   const profileImage = await loadImage(PROFILE_PHOTO);

    //   pdf.addImage(
    //     profileImage,
    //     "PNG",
    //     155,
    //     small ? 10 : 18,
    //     small ? 22 : 28,
    //     small ? 28 : 35,
    //   );
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const addPageBackground = async (pdf) => {
    if (!OPD_BACKGROUND) return;

    try {
      const backgroundImage = await loadImage(OPD_BACKGROUND);

      pdf.addImage(backgroundImage, "PNG", 0, 0, 210, 297);
    } catch (err) {
      console.error("Background image failed:", err);
    }
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

  const addKeyValueSection = (pdf, title, rows, startY) => {
    autoTable(pdf, {
      startY,

      head: [[title]],

      body: rows.map(([label, value]) => [label, value || "-"]),

      theme: "grid",

      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: "linebreak",
        lineColor: [230, 230, 230],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [15, 91, 84],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 12,
        cellPadding: 4,
      },

      // columnStyles: {
      //   0: {
      //     fontStyle: "bold",
      //     cellWidth: 48,
      //     fillColor: [248, 248, 248],
      //   },

      //   1: {
      //     cellWidth: "auto",
      //   },
      // },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 45,
          fillColor: [248, 248, 248],
        },

        1: {
          cellWidth: 95,
        },
      },

      margin: {
        left: 28,
        right: 48,
      },
    });

    return pdf.lastAutoTable.finalY + 10;
  };

  // const drawSection = (pdf, title, content, x, y, width) => {
  //   pdf.setFont("helvetica", "bold");
  //   pdf.setFontSize(12);

  //   // pdf.text(title, x, y);
  //   pdf.setFillColor(15, 91, 84);

  //   pdf.roundedRect(x, y - 5, width, 8, 2, 2, "F");

  //   pdf.setTextColor(255);

  //   pdf.setFontSize(13);

  //   pdf.text(title, x + 3, y + 1);

  //   pdf.setTextColor(0);

  //   const lines = pdf.splitTextToSize(content || "-", width - 10);

  //   const textHeight = lines.length * 5;

  //   const boxHeight = Math.max(textHeight + 12, 24);

  //   // pdf.setDrawColor(220);

  //   // pdf.rect(x, y + 5, width, boxHeight);

  //   pdf.setFont("helvetica", "normal");
  //   pdf.setFontSize(10);

  //   // pdf.text(lines, x + 4, y + 13);
  //   pdf.text(lines, x, y + 8);

  //   return y + boxHeight + 18;
  // };

  // const ensureSpace = async (pdf, currentY, requiredHeight) => {
  //   if (currentY + requiredHeight > 260) {
  //     pdf.addPage();

  //     await addPageBackground(pdf);

  //     return 30;
  //   }

  //   return currentY;
  // };

  const exportPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.height;

      await addPageBackground(pdf);

      // =====================================================
      // HEADER
      // =====================================================

      // pdf.setFont("helvetica", "bold");
      // pdf.setFontSize(26);

      // pdf.text(`${data.first_name || ""} ${data.last_name || ""}`, 35, 48);

      // pdf.setFont("helvetica", "normal");
      // pdf.setFontSize(12);

      // pdf.text("One Page Description", 35, 56);

      // // =====================================================
      // // PROFILE PHOTO
      // // =====================================================

      // try {
      //   const profileImage = await loadImage(PROFILE_PHOTO);

      //   pdf.addImage(profileImage, "PNG", 150, 16, 35, 42);
      // } catch (err) {
      //   console.error("Profile photo failed:", err);
      // }
      await drawHeader(pdf, false);

      let y = 68;

      // =====================================================
      // ABOUT ME
      // =====================================================

      y = addSection(pdf, "What People Appreciate About Me", data.about_me, y);

      if (y > pageHeight - 50) {
        pdf.addPage();

        // await addPageBackground(pdf);
        await drawHeader(pdf, false);

        y = 70;
      }

      // =====================================================
      // IMPORTANT TO ME
      // =====================================================
      y = addSection(
        pdf,
        "What Is Important To Me",
        `
IMPORTANT TO ME
${data.important_to_me || "-"}

THINGS I ENJOY
${data.fun_activities || "-"}

THINGS I WANT TO LEARN
${data.new_things_to_learn || "-"}

WHAT MAKES ME HAPPY
${data.happiness || "-"}
`,
        y,
      );

      // =====================================================
      // PAGE BREAK
      // =====================================================

      // pdf.addPage();

      // await addPageBackground(pdf);

      // y = 70;

      if (y > pageHeight - 50) {
        pdf.addPage();

        await drawHeader(pdf, false);

        y = 70;
      }

      // =====================================================
      // SUPPORT
      // =====================================================

      y = addSection(
        pdf,
        "How To Support Me In A Way That Works For Me",
        `
      Communication Style:
      ${data.communication_style || "-"}

      Support Preferences:
      ${data.support_preferences || "-"}

      Learning Style:
      ${(data.learning_styles || []).join(", ") || "-"}

      Accommodations:
      ${data.accommodations || "-"}

      Risk Factors:
      ${data.risk_factors || "-"}
      `,
        y,
      );
      // y = addKeyValueSection(
      //   pdf,
      //   "How To Support Me In A Way That Works For Me",
      //   [
      //     ["Communication Style", data.communication_style],
      //     ["Support Preferences", data.support_preferences],
      //     ["Learning Style", (data.learning_styles || []).join(", ")],
      //     ["Accommodations", data.accommodations],
      //     ["Risk Factors", data.risk_factors],
      //   ],
      //   y,
      // );

      if (y > pageHeight - 50) {
        pdf.addPage();

        await drawHeader(pdf, false);

        y = 70;
      }

      // =====================================================
      // EXPERIENCES
      // =====================================================

      y = addSection(
        pdf,
        "Experiences That Have Helped Shape Me",
        data.growth_experiences,
        y,
      );

      // =====================================================
      // PAGE BREAK
      // =====================================================

      // pdf.addPage();

      // await addPageBackground(pdf);

      // y = 70;
      if (y > pageHeight - 50) {
        pdf.addPage();

        await drawHeader(pdf, false);

        y = 70;
      }

      // =====================================================
      // FUTURE
      // =====================================================

      y = addSection(
        pdf,
        "My Vision Of The Future",
        `
      Hopes & Dreams:
      ${data.hopes_and_dreams || "-"}

      Volunteer Interests:
      ${data.volunteer_interest || "-"}

      Employment Goals:
      ${data.employment_goals || "-"}
      `,
        y,
      );
      // y = addKeyValueSection(
      //   pdf,
      //   "My Vision Of The Future",
      //   [
      //     ["Hopes & Dreams", data.hopes_and_dreams],
      //     ["Volunteer Interests", data.volunteer_interest],
      //     ["Employment Goals", data.employment_goals],
      //   ],
      //   y,
      // );

      if (y > pageHeight - 50) {
        pdf.addPage();

        await drawHeader(pdf, false);

        y = 70;
      }

      // =====================================================
      // VOLUNTEERING
      // =====================================================

      y = addSection(
        pdf,
        "Why I Volunteer With Inclusive World",
        `
      Why I Am Interested:
      ${data.why_interested || "-"}

      Goals & Expectations:
      ${data.expectations_goals || "-"}

      Weekend Commitments:
      ${data.weekend_commitments || "-"}
      `,
        y,
      );

      // y = addKeyValueSection(
      //   pdf,
      //   "Why I Volunteer With Inclusive World",
      //   [
      //     ["Why I Am Interested", data.why_interested],
      //     ["Goals & Expectations", data.expectations_goals],
      //     ["Weekend Commitments", data.weekend_commitments],
      //   ],
      //   y,
      // );
      pdf.save(`${data.first_name}_${data.last_name}_OPD.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-[#0f5b54]">Profile</h1>

      <button
        onClick={() => setEditing(!editing)}
        className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
      >
        {editing ? "Cancel" : "Edit Profile"}
      </button>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab ? "bg-[#0f5b54] text-white" : "bg-white border"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Section title="Personal Information">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EditableField label="First Name" value={formData.first_name} />
              <EditableField label="Last Name" value={formData.last_name} />
              <EditableField label="Email" value={formData.email} />
              <EditableField label="Phone" value={formData.phone} />
              <EditableField label="Date of Birth" value={formData.dob} />
              <EditableField
                label="Address"
                field="mailing_address"
                value={formData.mailing_address}
                editing={editing}
                updateField={updateField}
              />
            </div>
          </Section>

          <Section title="Volunteer Information">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <EditableField
                  label="Weekend Commitments"
                  field="weekend_commitments"
                  value={formData.weekend_commitments}
                  editing={editing}
                  updateField={updateField}
                />
              </div>

              <EditableField
                label="Interest Form Completed"
                field="interest_form_completed"
                value={formData.interest_form_completed ? "Yes" : "No"}
              />

              <div className="lg:col-span-2">
                <EditableField
                  label="Learning Styles"
                  field="learning_styles"
                  value={formData.learning_styles?.join(", ")}
                  editing={editing}
                  updateField={updateField}
                />
              </div>

              <EditableField
                field="status"
                label="Status"
                value={formData.status}
              />
            </div>
          </Section>
        </div>
      )}

      {/* {activeTab === "programs" && (
        <Section title="Program Preferences">
          <div className="space-y-4">
            {Object.entries(data.selected_programs || {})
              .sort((a, b) => a[1] - b[1])
              .map(([programId, rank]) => {
                const program = programs.find((p) => p.id === programId);

                if (!program) return null;

                return (
                  <div
                    key={programId}
                    className="border rounded-xl p-4 flex justify-between"
                  >
                    <span>{program.course_title}</span>

                    <span className="bg-[#0f5b54] text-white px-3 py-1 rounded-full">
                      Rank #{rank}
                    </span>
                  </div>
                );
              })}
          </div>
        </Section>
      )} */}

      {/* {activeTab === "programs" && (
        <Section title="Program Preferences">
          <div className="space-y-4">
            {Object.entries(data.selected_programs || {})
              .filter(
                ([key, value]) =>
                  typeof value === "number" && key.includes("-"),
              )
              .sort((a, b) => a[1] - b[1])
              .map(([programId, rank]) => {
                const program = programs.find(
                  (p) => String(p.id) === String(programId),
                );

                return (
                  <div
                    key={programId}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">
                        {program?.course_title || "Unknown Program"}
                      </div>

                      {program?.level && (
                        <div className="text-sm text-gray-500">
                          {program.level}
                        </div>
                      )}
                    </div>

                    <span className="bg-[#0f5b54] text-white px-3 py-1 rounded-full">
                      Rank #{rank}
                    </span>
                  </div>
                );
              })}
          </div>
        </Section>
      )} */}

      {activeTab === "programs" && (
        <div className="space-y-6">
          {/* Assigned Programs */}
          <Section title="Assigned Programs">
            {assignedPrograms.length === 0 ? (
              <div className="text-gray-500">No programs assigned.</div>
            ) : (
              <div className="space-y-4">
                {assignedPrograms.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">
                        {item.program?.course_title}
                      </div>

                      {item.program?.level && (
                        <div className="text-sm text-gray-500">
                          {item.program.level}
                        </div>
                      )}
                    </div>

                    <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                      {item.status || "Current"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Preferences */}
          <Section title="Program Preferences">
            <div className="space-y-4">
              {Object.entries(formData.selected_programs || {})
                .filter(
                  ([key, value]) =>
                    typeof value === "number" && key.includes("-"),
                )
                .sort((a, b) => a[1] - b[1])
                .map(([programId, rank]) => {
                  const program = programs.find(
                    (p) => String(p.id) === String(programId),
                  );

                  return (
                    <div
                      key={programId}
                      className="border rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">
                          {program?.course_title || "Unknown Program"}
                        </div>

                        {program?.level && (
                          <div className="text-sm text-gray-500">
                            {program.level}
                          </div>
                        )}
                      </div>

                      <span className="bg-[#0f5b54] text-white px-3 py-1 rounded-full">
                        Rank #{rank}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Section>
        </div>
      )}

      {activeTab === "family" && (
        <div className="space-y-6">
          {!isAdult && (
            <Section title="Parent / Guardian">
              {isAdult && (
                <p className="text-sm text-gray-500 mb-4">
                  Parent/guardian information is optional for volunteers over
                  18.
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <EditableField
                  label="Parent First Name"
                  field="parent_first_name"
                  value={formData.parent_first_name}
                  editing={editing}
                  updateField={updateField}
                  multiline={false}
                />

                <EditableField
                  label="Parent Last Name"
                  field="parent_last_name"
                  value={formData.parent_last_name}
                  editing={editing}
                  updateField={updateField}
                  multiline={false}
                />

                <EditableField
                  label="Relationship"
                  field="parent_relationship"
                  value={formData.parent_relationship}
                  editing={editing}
                  updateField={updateField}
                  multiline={false}
                />

                <EditableField
                  label="Phone"
                  field="parent_phone_1"
                  value={formData.parent_phone_1}
                  editing={editing}
                  updateField={updateField}
                  multiline={false}
                />

                <EditableField
                  label="Email"
                  field="parent_email"
                  value={formData.parent_email}
                  editing={editing}
                  updateField={updateField}
                  multiline={false}
                />
              </div>
            </Section>
          )}

          <Section title="Emergency Contact">
            <div className="grid md:grid-cols-2 gap-6">
              <EditableField
                label="Emergency First Name"
                field="emergency_first_name"
                value={formData.emergency_first_name}
                editing={editing}
                updateField={updateField}
                multiline={false}
              />
              <EditableField
                label="Emergency Last Name"
                field="emergency_last_name"
                value={formData.emergency_last_name}
                editing={editing}
                updateField={updateField}
                multiline={false}
              />

              <EditableField
                label="Relationship"
                field="emergency_relationship"
                value={formData.emergency_relationship}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Phone"
                field="emergency_phone_1"
                value={formData.emergency_phone_1}
                editing={editing}
                updateField={updateField}
              />

              <EditableField
                label="Email"
                field="emergency_email"
                value={formData.emergency_email}
                editing={editing}
                updateField={updateField}
                multiline={false}
              />
            </div>
          </Section>
        </div>
      )}
      {activeTab === "opd" && (
        <div className="space-y-6">
          {/* HEADER */}
          <div
            id="opd-content"
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* TOP BANNER */}
            <div className="relative bg-[#f6f6f6] px-10 py-8">
              <div className="flex justify-between items-start">
                {/* LEFT */}
                <div className="flex-1">
                  <img
                    src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1780447484/logoinclusiveNEW-1-removebg-preview_ktz5ni.png"
                    alt="Inclusive World"
                    className="h-20 mb-5"
                  />

                  <h1 className="text-4xl font-bold text-[#0f5b54]">
                    {data.first_name} {data.last_name}
                  </h1>

                  <h2 className="text-2xl font-semibold text-gray-700 mt-2">
                    One Page Description
                  </h2>

                  <p className="italic text-gray-500 mt-2">
                    Prepared for Support at Inclusive World
                  </p>

                  <p className="text-sm text-gray-400 mt-4">
                    Last Updated:{" "}
                    {data.interest_form_updated_at
                      ? new Date(
                          data.interest_form_updated_at,
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                {/* PHOTO */}
                {/* <div>
                  <img
                    src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1780447543/Screenshot_2026-06-02_at_5.45.37_PM_hkkuhm.png"
                    alt="Volunteer"
                    className="
                      w-44
                      h-44
                      object-cover
                      rounded-xl
                      border-4
                      border-white
                      shadow-lg
                    "
                  />
                </div> */}
              </div>
            </div>

            {/* BODY */}
            <div className="p-10 space-y-8">
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <Sparkles
                      size={32}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                  </div>

                  <span>What people appreciate about me</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border">
                  {data.about_me || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <TbTargetArrow size={32} className="text-red-400" />
                  </div>

                  <span>What is important to me</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
                  <div>
                    <h3 className="font-extrabold text-[#0f5b54] text-lg mb-1">
                      Important To Me
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap break-all">
                      {data.important_to_me || "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f5b54] text-base mb-1">
                      Things I Like To Do
                    </h3>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.fun_activities || "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f5b54] text-base mb-1">
                      Things I Want To Learn
                    </h3>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.new_things_to_learn || "-"}
                    </p>
                  </div>
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <BsEmojiSmile
                      size={32}
                      className="text-yellow-600"
                      fill="currentColor"
                    />
                  </div>

                  <span>What makes me happy</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-all">
                  {data.happiness || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <CgSmileSad
                      size={32}
                      className="text-yellow-600"
                      fill="currentColor"
                    />
                  </div>

                  <span>What makes me sad or frustrated</span>
                </h2>
                <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-all">
                  {data.sadness || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <PiHandshake
                      size={32}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                  </div>

                  <span>Why I volunteer with Inclusive World</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
                  <div>
                    <strong>Why I Am Interested</strong>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.why_interested || "-"}
                    </p>
                  </div>

                  <div>
                    <strong>Goals & Expectations</strong>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.expectations_goals || "-"}
                    </p>
                  </div>
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 break-all text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <PiPlantFill
                      size={32}
                      className="text-green-400"
                      fill="currentColor"
                    />
                  </div>

                  <span>Experiences That Have Helped Shape Me</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-all">
                  {data.growth_experiences || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <RiGraduationCapFill
                      size={32}
                      className="text-black"
                      fill="currentColor"
                    />
                  </div>

                  <span>How I Learn & Work Best</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
                  <p className="whitespace-pre-wrap break-all overflow-hidden">
                    {data.learning_and_work_style || "-"}
                  </p>

                  <div className="flex flex-wrap gap-2 whitespace-pre-wrap break-all">
                    {(data.learning_styles || []).map((style) => (
                      <span
                        key={style}
                        className="
                    bg-[#0f5b54]
                    text-white
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  "
                      >
                        {style}
                      </span>
                    ))}
                  </div>

                  {data.accommodations && (
                    <div>
                      <strong>Accommodations</strong>
                      <p className="whitespace-pre-wrap break-all overflow-hidden">
                        {data.accommodations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <IoChatbubbleEllipsesSharp
                      size={32}
                      className="text-black"
                      fill="currentColor"
                    />
                  </div>

                  <span>Communication Style</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-all">
                  {data.communication_style || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <GoHeartFill
                      size={32}
                      className="text-red-400"
                      fill="currentColor"
                    />
                  </div>

                  <span>How To Support Me</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border whitespace-pre-wrap break-all">
                  {data.support_preferences || "-"}
                </div>
              </div>
              {/* SECTION */}
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold text-[#0f5b54] mb-3">
                  <div className="p-2 rounded-full">
                    <FaRocket
                      size={32}
                      className="text-red-400"
                      fill="currentColor"
                    />
                  </div>

                  <span>My Vision For The Future</span>
                </h2>

                <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
                  <div>
                    <strong>Hopes & Dreams</strong>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.hopes_and_dreams || "-"}
                    </p>
                  </div>

                  <div>
                    <strong>Volunteer Interests</strong>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.volunteer_interest || "-"}
                    </p>
                  </div>

                  <div>
                    <strong>Employment Goals</strong>
                    <p className="whitespace-pre-wrap break-all overflow-hidden">
                      {data.employment_goals || "-"}
                    </p>
                  </div>
                </div>
              </div>
              {/* SECTION */}
              {data.risk_factors && (
                <div>
                  <h2 className="text-xl font-bold text-red-600 mb-3">
                    ⚠ Risk Factors / Considerations
                  </h2>

                  <div className="bg-red-50 p-5 rounded-xl border border-red-200 whitespace-pre-wrap break-all">
                    {data.risk_factors}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EXPORT BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={exportPDF}
              className="
          bg-[#0f5b54]
          hover:bg-[#0c4a45]
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
        "
            >
              Export OPD PDF
            </button>
          </div>
        </div>
      )}
      {editing && activeTab !== "opd" && (
        <div className="flex justify-end">
          <button
            onClick={saveProfile}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default VolunteerProfile;
