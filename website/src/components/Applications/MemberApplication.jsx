import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import MemberWaiver from "./MemberWaiver";
import { HiCheckCircle } from "react-icons/hi";

const PROGRAM_OPTIONS = [
  "Weekday Vocational Skills Program",
  "Weekend Vocational and Small Business Skills",
  "Employment Services",
  "Academic and Vocational Counseling Services",
  "Person-Centered Services",
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

// const LEARNING_OPTIONS = [
//   "Visual",
//   "Auditory",
//   "Reading/Writing",
//   "Kinesthetic",
// ];

// const DREAM_OPTIONS = [
//   "Lead a productive life through employment",
//   "Learn vocational skills",
//   "Make friends",
//   "Have a sense of community",
//   "Have a work routine",
//   "Financial independence",
// ];

const MemberApplication = () => {
  const [accepted, setAccepted] = useState(false);

  const [waiverData, setWaiverData] = useState({
    signature: "",
    cycle: null,
  });

  const [loading, setLoading] = useState(false);

  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [learningStyles, setLearningStyles] = useState([]);
  // const [dreamGoals, setDreamGoals] = useState([]);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    age: null,
    grade: "",

    p1_fname: "",
    p1_lname: "",
    p1_relationship: "",
    p1_phone1: "",
    p1_phone2: "",
    p1_email: "",
    p1_employer: "",

    p2_fname: "",
    p2_lname: "",
    p2_relationship: "",
    p2_phone1: "",
    p2_phone2: "",
    p2_email: "",
    p2_employer: "",

    e_fname: "",
    e_lname: "",
    e_relationship: "",
    e_phone1: "",
    e_phone2: "",
    e_email: "",

    // exp_web: null,
    // exp_scratch: null,
    // exp_excel: null,
    // exp_testing: null,
    // exp_mobile: null,
    // exp_python: null,
    // exp_ai: null,

    // about_team: "",
    // about_great: "",
    // about_likes: "",
    // about_learn: "",
    // about_happy: "",
    // about_sad: "",
    // about_school_like: "",
    // about_school_dislike: "",

    // prior_jobs: "",

    // iep_working: "",
    // iep_not_working: "",

    // support_devices: "",
    // environment_preferences: "",
    // helper_person: "",

    // accommodations: "",
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

  // const toggleLearning = (style) => {
  //   if (learningStyles.includes(style)) {
  //     setLearningStyles(learningStyles.filter((s) => s !== style));
  //   } else {
  //     setLearningStyles([...learningStyles, style]);
  //   }
  // };

  // const toggleDream = (dream) => {
  //   if (dreamGoals.includes(dream)) {
  //     setDreamGoals(dreamGoals.filter((d) => d !== dream));
  //   } else {
  //     setDreamGoals([...dreamGoals, dream]);
  //   }
  // };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, "");

    return digits.length === 10;
  };

  const submit = async () => {
    setLoading(true);

    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(form.p1_email)) {
      alert("Please enter a valid parent/guardian email address.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(form.e_email)) {
      alert("Please enter a valid emergency contact email address.");
      setLoading(false);
      return;
    }

    if (!isValidPhone(form.phone)) {
      alert("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

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

    // Existing Member Application

    const { data: existingEmail } = await supabase
      .from("member_applications")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      setLoading(false);

      alert(
        "A member application has already been submitted using this email address. Please log in to continue.",
      );

      window.location.href = "/one-portal/login";

      return;
    }

    const { data: existingPhone } = await supabase
      .from("member_applications")
      .select("id")
      .eq("phone", form.phone)
      .maybeSingle();

    if (existingPhone) {
      setLoading(false);

      alert(
        "A member application has already been submitted using this phone number. Please log in to continue.",
      );

      window.location.href = "/one-portal/login";

      return;
    }

    const normalizePhone = (phone) => phone.replace(/\D/g, "");

    const emergencyEmail = form.e_email?.trim().toLowerCase();
    const memberEmail = form.email?.trim().toLowerCase();

    const emergencyPhone = normalizePhone(form.e_phone1);
    const memberPhone = normalizePhone(form.phone);

    const parent1Email = form.p1_email?.trim().toLowerCase();
    const parent2Email = form.p2_email?.trim().toLowerCase();

    const parent1Phone = normalizePhone(form.p1_phone1);
    const parent2Phone = normalizePhone(form.p2_phone1);

    // Cannot be the member
    if (emergencyEmail === memberEmail || emergencyPhone === memberPhone) {
      alert("Emergency contact must be someone other than the member.");
      setLoading(false);
      return;
    }

    // Cannot be Parent / Guardian 1
    if (emergencyEmail === parent1Email || emergencyPhone === parent1Phone) {
      alert("Emergency contact cannot be Parent/Guardian 1.");
      setLoading(false);
      return;
    }

    // Cannot be Parent / Guardian 2
    if (
      parent2Email &&
      (emergencyEmail === parent2Email || emergencyPhone === parent2Phone)
    ) {
      alert("Emergency contact cannot be Parent/Guardian 2.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("member_applications").insert([
      {
        ...form,

        cycle_id: waiverData.cycle.id,

        selected_programs: selectedPrograms,

        // learning_styles: learningStyles,

        // dreams_goals: dreamGoals,

        waiver_accepted: true,

        waiver_signature: waiverData.signature,

        waiver_signed_at: new Date().toISOString(),

        terms: true,

        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setShowSuccessModal(true);
  };

  if (!accepted) {
    return (
      <MemberWaiver
        onAccept={(data) => {
          setWaiverData(data);
          setAccepted(true);
        }}
      />
    );
  }

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

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Member Interest Form
          </h1>

          <p className="text-gray-500 mt-3">
            Inclusive World Registration Form
          </p>

          <div className="mt-5 inline-block bg-[#eef8f7] text-[#0f5b54] px-5 py-2 rounded-full text-sm font-medium">
            {waiverData.cycle?.title}
          </div>

          <p className="text-gray-600 leading-relaxed mt-3">
            Sign up using your own email address and phone number. Both must be
            unique and cannot be used by another account.
          </p>

          <div className="mt-6 max-w-3xl mx-auto bg-[#f8f9fa] border rounded-2xl p-5 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">
              What Happens After Submission?
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Once you submit your application, our team will review it
              carefully. If your application is approved, you will receive an
              email with approval details and a link to sign up for the
              Inclusive World One Portal.
            </p>

            <p className="text-gray-600 leading-relaxed mt-3">
              The One Portal will be used to register for classes, manage your
              enrollment, and complete fee payments for your selected programs
              and services.
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-800">
              Fields marked with
              <span className="mx-1 font-bold text-red-600">*</span>
              are required.
            </p>
          </div>
        </div>

        {/* MEMBER INFO */}

        <CardSection title="Member Information">
          <Grid>
            <Input
              label="First Name"
              value={form.fname}
              required
              onChange={(v) => update("fname", v)}
            />

            <Input
              label="Last Name"
              value={form.lname}
              required
              onChange={(v) => update("lname", v)}
            />

            <Input
              type="email"
              label="Email Address"
              value={form.email}
              required
              onChange={(v) => update("email", v)}
            />

            <Input
              label="Phone Number"
              value={form.phone}
              placeholder="(408) 555-1234"
              required
              onChange={(v) => update("phone", formatPhoneNumber(v))}
            />
          </Grid>

          <Input
            label="Mailing Address"
            value={form.address}
            required
            onChange={(v) => update("address", v)}
          />

          <Grid>
            <Input
              type="date"
              label="Date of Birth"
              value={form.dob}
              required
              onChange={(v) => update("dob", v)}
            />

            {form.age !== null && (
              <p className="text-sm text-gray-500 mt-2">Age: {form.age}</p>
            )}

            <Input
              label="Grade"
              value={form.grade}
              onChange={(v) => update("grade", v)}
            />
          </Grid>
        </CardSection>

        {/* PARENT 1 */}

        <CardSection title="Parent / Guardian 1">
          <Grid>
            <Input
              label="First Name"
              value={form.p1_fname}
              required
              onChange={(v) => update("p1_fname", v)}
            />

            <Input
              label="Last Name"
              value={form.p1_lname}
              required
              onChange={(v) => update("p1_lname", v)}
            />

            <Input
              label="Relationship"
              value={form.p1_relationship}
              required
              onChange={(v) => update("p1_relationship", v)}
            />

            <Input
              label="Phone Number 1"
              value={form.p1_phone1}
              required
              onChange={(v) => update("p1_phone1", formatPhoneNumber(v))}
            />

            <Input
              label="Phone Number 2"
              value={form.p1_phone2}
              onChange={(v) => update("p1_phone2", v)}
            />

            <Input
              label="Email Address"
              value={form.p1_email}
              required
              onChange={(v) => update("p1_email", v)}
            />
          </Grid>

          <Input
            label="Employer Name and Job Title"
            value={form.p1_employer}
            onChange={(v) => update("p1_employer", v)}
          />
        </CardSection>

        {/* PARENT 2 */}

        <CardSection title="Parent / Guardian 2">
          <Grid>
            <Input
              label="First Name"
              value={form.p2_fname}
              onChange={(v) => update("p2_fname", v)}
            />

            <Input
              label="Last Name"
              value={form.p2_lname}
              onChange={(v) => update("p2_lname", v)}
            />

            <Input
              label="Relationship"
              value={form.p2_relationship}
              onChange={(v) => update("p2_relationship", v)}
            />

            <Input
              label="Phone Number 1"
              value={form.p2_phone1}
              onChange={(v) => update("p2_phone1", v)}
            />

            <Input
              label="Phone Number 2"
              value={form.p2_phone2}
              onChange={(v) => update("p2_phone2", v)}
            />

            <Input
              label="Email Address"
              value={form.p2_email}
              onChange={(v) => update("p2_email", v)}
            />
          </Grid>

          <Input
            label="Employer Name and Job Title"
            value={form.p2_employer}
            onChange={(v) => update("p2_employer", v)}
          />
        </CardSection>

        {/* EMERGENCY */}

        <CardSection title="Emergency Contact">
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <p className="text-sm text-red-800 font-medium">
                Emergency contact must be someone other than the member and
                cannot be a parent or guardian listed above.
              </p>
            </div>
          </div>
          <Grid>
            <Input
              label="First Name"
              value={form.e_fname}
              required
              onChange={(v) => update("e_fname", v)}
            />

            <Input
              label="Last Name"
              value={form.e_lname}
              required
              onChange={(v) => update("e_lname", v)}
            />

            <Input
              label="Relationship"
              value={form.e_relationship}
              required
              onChange={(v) => update("e_relationship", v)}
            />

            <Input
              label="Phone Number 1"
              value={form.e_phone1}
              required
              onChange={(v) => update("e_phone1", formatPhoneNumber(v))}
            />

            <Input
              label="Phone Number 2"
              value={form.e_phone2}
              onChange={(v) => update("e_phone2", v)}
            />

            <Input
              label="Email Address"
              value={form.e_email}
              required
              onChange={(v) => update("e_email", v)}
            />
          </Grid>
        </CardSection>

        {/* PROGRAMS */}

        <CardSection title="Program Interests">
          <div className="grid md:grid-cols-2 gap-5">
            {PROGRAM_OPTIONS.map((program) => {
              const active = selectedPrograms.includes(program);

              return (
                <button
                  key={program}
                  type="button"
                  onClick={() => toggleProgram(program)}
                  className={`
                    text-left
                    border
                    rounded-2xl
                    p-5
                    transition
                    ${
                      active
                        ? "bg-[#eef8f7] border-[#0f5b54]"
                        : "bg-white border-gray-200 hover:border-[#0f5b54]"
                    }
                  `}
                >
                  <h3 className="font-semibold text-gray-800">{program}</h3>
                </button>
              );
            })}
          </div>
        </CardSection>

        {/* FOOTER */}

        <div className="sticky bottom-6">
          <div className="bg-white border shadow-xl rounded-3xl p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Ready to Submit?</h3>

              <p className="text-sm text-gray-500">
                Your waiver has been accepted.
              </p>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
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
              your information and contact you at{" "}
              <span className="font-semibold text-gray-800">{form.email}</span>{" "}
              regarding the next steps.
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
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-4">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Confirm Your Information
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Please verify your contact information before submitting.
              Inclusive World will use this information to contact you.
            </p>

            <div className="rounded-2xl border bg-gray-50 p-5 space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>{" "}
                {form.fname} {form.lname}
              </div>

              <div>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {form.email}
              </div>

              <div>
                <span className="font-semibold text-gray-700">Phone:</span>{" "}
                {form.phone}
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Emergency Contact:
                </span>{" "}
                {form.e_fname} {form.e_lname}
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Emergency Contact Email:
                </span>{" "}
                {form.e_email}
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Emergency Contact Phone:
                </span>{" "}
                {form.e_phone1}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  submit();
                }}
                className="w-1/2 bg-[#0f5b54] hover:bg-[#0c4a45] text-white py-3 rounded-xl transition"
              >
                Confirm & Submit
              </button>
            </div>
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

const BooleanSelect = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <select
      value={value === true ? "true" : value === false ? "false" : ""}
      onChange={(e) => {
        if (e.target.value === "true") onChange(true);
        else if (e.target.value === "false") onChange(false);
        else onChange(null);
      }}
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
    >
      <option value="">Select</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-6">{children}</div>
);

// const Input = ({ label, value, placeholder, onChange, type = "text" }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       {label}
//     </label>

//     <input
//       value={value}
//       placeholder={placeholder}
//       onChange={(e) => onChange(e.target.value)}
//       className="
//         w-full
//         rounded-xl
//         border
//         border-gray-300
//         bg-gray-50
//         px-4
//         py-3
//         focus:outline-none
//         focus:ring-2
//         focus:ring-[#0f5b54]
//       "
//       type={type}
//     />
//   </div>
// );

const Input = ({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
      {label}

      {required && (
        <span className="text-red-600 font-bold" title="Required field">
          *
        </span>
      )}
    </label>

    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      type={type}
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

const SelectableCard = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      text-left
      border
      rounded-2xl
      p-5
      transition
      ${
        active
          ? "bg-[#eef8f7] border-[#0f5b54]"
          : "bg-white border-gray-200 hover:border-[#0f5b54]"
      }
    `}
  >
    <span className="font-bold text-black">{label}</span>
  </button>
);

export default MemberApplication;
