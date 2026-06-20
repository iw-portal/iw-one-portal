import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import VolunteerWaiver from "./VolunteerWaiver";
import { HiCheckCircle } from "react-icons/hi";

const PROGRAM_OPTIONS = [
  "Software Testing Level 1",
  "Software Testing Level 2",
  "Excel Basic",
  "Excel Intermediate",
  "Excel Intermediate Advanced",
  "Conversational Skills Development",
  "Conversational Skills Development In-Person",
  "Conversational Skills Development Wednesday",
  "Scratch Programming & Robotics",
  "Website Development Basic",
  "Website Development Intermediate",
  "Mobile App Development Basic",
  "Python Programming",
  "Introduction to Artificial Intelligence",
  "Small Business/IW Services",
  "Small Business/IW Products",
  "Small Business/IW Products 2",
  "Employment Services",
  "Flexible Booth Events",
  "Flexible Offline Tasks",
  "Vocational Skills Program",
];

const calculateAge = (dob) => {
  if (!dob) return null;

  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const LEARNING_OPTIONS = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic",
];

const VolunteerApplication = () => {
  const [accepted, setAccepted] = useState(false);
  const [waiverData, setWaiverData] = useState({
    signature: "",
    cycle: null,
  });
  const [signature, setSignature] = useState("");

  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [programRanks, setProgramRanks] = useState({});
  const [learningStyles, setLearningStyles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    mailing_address: "",
    dob: "",
    age: null,

    parent_first_name: "",
    parent_last_name: "",
    parent_relationship: "",
    parent_phone_1: "",
    parent_phone_2: "",
    parent_email: "",

    emergency_first_name: "",
    emergency_last_name: "",
    emergency_relationship: "",
    emergency_phone_1: "",
    emergency_phone_2: "",
    emergency_email: "",

    weekend_commitments: "",
    why_interested: "",
    expectations_goals: "",

    about_me: "",
    fun_activities: "",
    new_things_to_learn: "",
    happiness: "",
    sadness: "",

    // volunteer_experience: "",

    accommodations: "",
  });

  const update = (field, value) => {
    const updated = {
      ...form,
      [field]: value,
    };

    if (field === "dob") {
      updated.age = calculateAge(value);
    }

    setForm(updated);
  };

  const toggleProgram = (program) => {
    if (selectedPrograms.includes(program)) {
      setSelectedPrograms(selectedPrograms.filter((p) => p !== program));
    } else {
      setSelectedPrograms([...selectedPrograms, program]);
    }
  };

  const updateProgramRank = (program, rank) => {
    setProgramRanks({
      ...programRanks,
      [program]: rank,
    });
  };

  const toggleLearning = (style) => {
    if (learningStyles.includes(style)) {
      setLearningStyles(learningStyles.filter((s) => s !== style));
    } else {
      setLearningStyles([...learningStyles, style]);
    }
  };

  // const submit = async () => {
  //   setLoading(true);

  //   // =====================================================
  //   // CHECK IF USER ALREADY EXISTS
  //   // =====================================================
  //   const { data: existingUser } = await supabase
  //     .from("volunteer_applications")
  //     .select("id")
  //     .or(`email.eq.${form.email},phone.eq.${form.phone}`)
  //     .limit(1);

  //   const isNewToIW = !existingUser || existingUser.length === 0;

  //   // =====================================================
  //   // INSERT APPLICATION
  //   // =====================================================

  //   const { error } = await supabase.from("volunteer_applications").insert([
  //     {
  //       ...form,

  //       new_to_iw: isNewToIW,

  //       selected_programs: selectedPrograms,

  //       program_preference_order: programRanks,

  //       learning_styles: learningStyles,

  //       waiver_accepted: true,

  //       waiver_signature: signature,

  //       waiver_signed_at: new Date().toISOString(),

  //       status: "pending",
  //     },
  //   ]);

  //   setLoading(false);

  //   if (error) {
  //     console.error(error);
  //     alert(error.message);
  //     return;
  //   }

  //   alert("Application submitted successfully!");

  //   window.location.href = "/";
  // };

  const isValidEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
      email.trim(),
    );
  };

  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, "");

    return digits.length === 10;
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length < 4) {
      return digits;
    }

    if (digits.length < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const requiresParentInfo = form.age !== null && form.age < 18;

  const submit = async () => {
    setLoading(true);

    try {
      if (!isValidEmail(form.email)) {
        alert("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      if (requiresParentInfo && !isValidEmail(form.parent_email)) {
        alert("Please enter a valid parent/guardian email address.");
        setLoading(false);
        return;
      }

      if (requiresParentInfo) {
        if (
          !form.parent_first_name ||
          !form.parent_last_name ||
          !form.parent_relationship ||
          !form.parent_phone_1 ||
          !form.parent_email
        ) {
          alert(
            "Parent/Guardian information is required for volunteers under 18 years of age.",
          );
          setLoading(false);
          return;
        }
      }

      if (!isValidEmail(form.emergency_email)) {
        alert("Please enter a valid emergency contact email address.");
        setLoading(false);
        return;
      }

      if (!isValidPhone(form.phone)) {
        alert("Please enter a valid phone number.");
        setLoading(false);
        return;
      }
      // =====================================================
      // CHECK EXISTING USER
      // =====================================================

      // const { data: existingUser } = await supabase
      //   .from("volunteer_applications")
      //   .select("id")
      //   .or(`email.eq.${form.email},phone.eq.${form.phone}`)
      //   .limit(1);

      // const isNewToIW = !existingUser || existingUser.length === 0;
      const email = form.email.trim().toLowerCase();

      // Existing Portal Account

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        setLoading(false);

        alert(
          "An Inclusive World account already exists with this email address. Please log in to continue.",
        );

        window.location.href = "/one-portal/login";

        return;
      }

      const { data: existingPerson } = await supabase
        .from("people")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingPerson) {
        setLoading(false);

        alert(
          "An Inclusive World account already exists with this email address. Please log in to continue.",
        );

        window.location.href = "/one-portal/login";

        return;
      }

      // Existing Volunteer Application

      const { data: existingEmail } = await supabase
        .from("volunteer_applications")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existingEmail?.length) {
        setLoading(false);

        alert(
          "A volunteer application has already been submitted using this email address. Please log in to continue.",
        );

        window.location.href = "/one-portal/login";

        return;
      }

      const { data: existingPhone } = await supabase
        .from("volunteer_applications")
        .select("id")
        .eq("phone", form.phone)
        .limit(1);

      if (existingPhone?.length) {
        setLoading(false);

        alert(
          "A volunteer application has already been submitted using this phone number. Please log in to continue.",
        );

        window.location.href = "/one-portal/login";

        return;
      }

      const isNewToIW = !existingUser && !existingPerson;

      // =====================================================
      // VALIDATE CYCLE
      // =====================================================

      if (!waiverData.cycle?.id) {
        alert("No registration cycle selected.");
        setLoading(false);
        return;
      }

      const normalizePhone = (phone) => phone.replace(/\D/g, "");

      const emergencyEmail = form.emergency_email?.trim().toLowerCase();

      const volunteerEmail = form.email?.trim().toLowerCase();

      const emergencyPhone = normalizePhone(form.emergency_phone_1);

      const volunteerPhone = normalizePhone(form.phone);

      const parentEmail = form.parent_email?.trim().toLowerCase();

      const parentPhone = normalizePhone(form.parent_phone_1);

      // Cannot be the volunteer
      if (
        emergencyEmail === volunteerEmail ||
        emergencyPhone === volunteerPhone
      ) {
        alert("Emergency contact must be someone other than the volunteer.");
        setLoading(false);
        return;
      }

      // Cannot be parent/guardian
      if (
        parentEmail &&
        (emergencyEmail === parentEmail || emergencyPhone === parentPhone)
      ) {
        alert("Emergency contact cannot be the parent or guardian.");
        setLoading(false);
        return;
      }

      // =====================================================
      // INSERT
      // =====================================================

      const { error } = await supabase.from("volunteer_applications").insert([
        {
          ...form,

          cycle_id: waiverData.cycle.id,

          // cycle_title: waiverData.cycle.title,

          // cycle_year: waiverData.cycle.year,

          new_to_iw: isNewToIW,

          selected_programs: selectedPrograms,

          program_preference_order: programRanks,

          learning_styles: learningStyles,

          waiver_accepted: true,

          waiver_signature: waiverData.signature,

          waiver_signed_at: new Date().toISOString(),

          status: "pending",
        },
      ]);

      setLoading(false);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      // alert("Application submitted successfully!");

      // window.location.href = "/";
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);

      setLoading(false);

      alert("Something went wrong.");
    }
  };

  // =========================================================
  // SHOW WAIVER FIRST
  // =========================================================

  if (!accepted) {
    return (
      <VolunteerWaiver
        onAccept={({ signature, cycle }) => {
          setWaiverData({
            signature,
            cycle,
          });

          setAccepted(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Volunteer Application
          </h1>

          <p className="text-gray-500 mt-3">
            Inclusive World Volunteer Registration Form
          </p>

          <p className="text-gray-600 leading-relaxed mt-3">
            Sign up using your own email address and phone number. Both must be
            unique and cannot be used by another account.
          </p>
        </div>
        {/* ===================================================== */}
        {/* VOLUNTEER INFO */}
        {/* ===================================================== */}
        <CardSection title="Volunteer Information">
          <Grid>
            <Input
              label="First Name"
              value={form.first_name}
              required
              onChange={(v) => update("first_name", v)}
            />

            <Input
              label="Last Name"
              value={form.last_name}
              required
              onChange={(v) => update("last_name", v)}
            />

            <Input
              label="Email Address"
              value={form.email}
              required
              onChange={(v) => update("email", v)}
            />

            <Input
              label="Phone Number"
              value={form.phone}
              required
              onChange={(v) => update("phone", formatPhoneNumber(v))}
            />
          </Grid>

          <Input
            label="Mailing Address"
            value={form.mailing_address}
            required
            onChange={(v) => update("mailing_address", v)}
          />

          <Input
            type="date"
            label="Date of Birth"
            required
            value={form.dob}
            onChange={(v) => update("dob", v)}
          />
          {form.age !== null && (
            <p className="text-sm text-gray-500 mt-2">Age: {form.age}</p>
          )}
        </CardSection>
        {/* ===================================================== */}
        {/* PARENT */}
        {/* ===================================================== */}
        <CardSection
          title={
            form.age !== null && form.age < 18
              ? "Parent / Guardian Information (Required)"
              : "Parent / Guardian Information (Optional)"
          }
        >
          <Grid>
            <Input
              label="First Name"
              value={form.parent_first_name}
              required={requiresParentInfo}
              onChange={(v) => update("parent_first_name", v)}
            />

            <Input
              label="Last Name"
              value={form.parent_last_name}
              required={requiresParentInfo}
              onChange={(v) => update("parent_last_name", v)}
            />

            <Input
              label="Relationship"
              value={form.parent_relationship}
              required={requiresParentInfo}
              onChange={(v) => update("parent_relationship", v)}
            />

            <Input
              label="Phone Number 1"
              value={form.parent_phone_1}
              required={requiresParentInfo}
              onChange={(v) => update("parent_phone_1", formatPhoneNumber(v))}
            />

            <Input
              label="Phone Number 2"
              value={form.parent_phone_2}
              onChange={(v) => update("parent_phone_2", v)}
            />

            <Input
              label="Email Address"
              value={form.parent_email}
              required={requiresParentInfo}
              onChange={(v) => update("parent_email", v)}
            />
          </Grid>
        </CardSection>
        {/* ===================================================== */}
        {/* EMERGENCY */}
        {/* ===================================================== */}
        <CardSection title="Emergency Contact">
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <p className="text-sm text-red-800 font-medium">
                Emergency contact must be someone other than the volunteer and
                cannot be a parent or guardian listed above.
              </p>
            </div>
          </div>
          <Grid>
            <Input
              label="First Name"
              value={form.emergency_first_name}
              required
              onChange={(v) => update("emergency_first_name", v)}
            />

            <Input
              label="Last Name"
              value={form.emergency_last_name}
              required
              onChange={(v) => update("emergency_last_name", v)}
            />

            <Input
              label="Relationship"
              value={form.emergency_relationship}
              required
              onChange={(v) => update("emergency_relationship", v)}
            />

            <Input
              label="Phone Number 1"
              value={form.emergency_phone_1}
              required
              onChange={(v) =>
                update("emergency_phone_1", formatPhoneNumber(v))
              }
            />

            <Input
              label="Phone Number 2"
              value={form.emergency_phone_2}
              onChange={(v) => update("emergency_phone_2", v)}
            />

            <Input
              label="Email Address"
              value={form.emergency_email}
              required
              onChange={(v) => update("emergency_email", v)}
            />
          </Grid>
        </CardSection>

        {/* ===================================================== */}
        {/* SUBMIT */}
        {/* ===================================================== */}
        <div className="sticky bottom-6">
          <div className="bg-white border shadow-xl rounded-3xl p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Ready to Submit?</h3>

              <p className="text-sm text-gray-500">
                Your waiver has been accepted.
              </p>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="
                bg-[#0f5b54]
                hover:bg-[#0c4a45]
                text-white
                px-8
                py-4
                rounded-2xl
                font-medium
                transition
              "
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-4">
            <div className="flex justify-center mb-4">
              <HiCheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-semibold text-center mb-4">
              Application Submitted Successfully
            </h2>

            <p className="text-gray-600 text-center leading-relaxed">
              Thank you for submitting your application. Our team will review
              your information and contact you regarding the next steps.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Please check your Inbox, Spam/Junk,
                and Promotions folders for emails from Inclusive World. Some
                email providers may automatically filter approval emails and
                account invitations into those folders.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="mt-6 w-full bg-[#0f5b54] hover:bg-[#0c4a45] text-white py-3 rounded-xl transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

const CardSection = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-sm border p-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-8">{title}</h2>

    <div className="space-y-6">{children}</div>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-6">{children}</div>
);

const Input = ({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-gray-50
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-[#0f5b54]
      "
      type={type}
    />
  </div>
);

const Textarea = ({ label, value, placeholder, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-gray-50
        px-4
        py-4
        h-40
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-[#0f5b54]
      "
    />
  </div>
);

export default VolunteerApplication;
