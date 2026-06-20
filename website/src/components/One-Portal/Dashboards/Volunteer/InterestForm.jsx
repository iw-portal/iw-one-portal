import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { HiCheckCircle } from "react-icons/hi";

function QuestionCard({
  title,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm p-8">
      <h2 className="text-2xl font-semibold mb-5">{title}</h2>

      <textarea
        disabled={disabled}
        rows={6}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-xl p-4"
      />
    </div>
  );
}

export default function InterestForm({ user }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [applicationId, setApplicationId] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [hasAssignments, setHasAssignments] = useState(false);

  const formatPacificTime = (date) => {
    if (!date) return "Never";

    return (
      new Date(date).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) + " PT"
    );
  };

  const formatPacificTimeOnly = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);

    return date.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dayMapping = {
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
    SUN: "Sunday",
  };

  const [programRanks, setProgramRanks] = useState({});

  const [form, setForm] = useState({
    selected_programs: {},

    weekend_commitments: "",

    about_me: "",
    important_to_me: "",
    hopes_and_dreams: "",
    learning_and_work_style: "",
    growth_experiences: "",
    communication_style: "",
    support_preferences: "",

    learning_styles: [],

    interest_form_completed: false,
  });

  const learningOptions = [
    "Visual",
    "Auditory",
    "Reading/Writing",
    "Hands-On",
    "Group Learning",
    "Independent Learning",
  ];

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await Promise.all([loadPrograms(), loadVolunteerData()]);

    setLoading(false);
  };

  const loadPrograms = async () => {
    const { data } = await supabase
      .from("programs")
      .select("id, course_title, level, sections")
      .eq("is_active", true)
      .eq("is_archived", false)
      .not(
        "course_title",
        "in",
        '("Academic Counseling","Employment Services")',
      )
      .order("course_title");

    setPrograms(data || []);
  };

  const getProgramDisplayName = (program, allPrograms) => {
    const title = program.course_title;

    if (program.level?.trim()) {
      return `${title} • ${
        program.level.charAt(0).toUpperCase() + program.level.slice(1)
      }`;
    }

    const sections = program.sections || [];

    const days = [
      ...new Set(
        sections.map((s) => dayMapping[s.day] || s.day).filter(Boolean),
      ),
    ];

    const dayText = days.join(", ");

    const sameTitlePrograms = allPrograms.filter(
      (p) => p.course_title === title,
    );

    const sameTitleAndDay = sameTitlePrograms.filter((p) => {
      const pDays = [
        ...new Set(
          (p.sections || [])
            .map((s) => dayMapping[s.day] || s.day)
            .filter(Boolean),
        ),
      ].join(", ");

      return pDays === dayText;
    });

    if (sameTitleAndDay.length <= 1) {
      return `${title} • ${dayText}`;
    }

    const firstSection = sections[0];

    const timeText =
      firstSection?.start_time && firstSection?.end_time
        ? `${firstSection.start_time} - ${firstSection.end_time}`
        : "";

    return `${title} • ${dayText} • ${timeText}`;
  };

  const getProgramSchedule = (program) => {
    const sections = program.sections || [];

    if (sections.length === 0) {
      return "";
    }

    const firstSection = sections[0];

    const days = [
      ...new Set(
        sections.map((s) => dayMapping[s.day] || s.day).filter(Boolean),
      ),
    ];

    const dayText = days.join(", ");

    // const timeText =
    //   firstSection?.start_time && firstSection?.end_time
    //     ? `${firstSection.start_time} - ${firstSection.end_time}`
    //     : "";
    const timeText =
      firstSection?.start_time && firstSection?.end_time
        ? `${formatPacificTimeOnly(firstSection.start_time)} - ${formatPacificTimeOnly(firstSection.end_time)} PT`
        : "";

    return [dayText, timeText].filter(Boolean).join(" • ");
  };

  const loadVolunteerData = async () => {
    const { data } = await supabase
      .from("volunteer_applications")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    const { data: person } = await supabase
      .from("people")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (person) {
      const { data: assignments } = await supabase
        .from("person_programs")
        .select("id")
        .eq("person_id", person.id)
        .eq("role", "volunteer");

      setHasAssignments((assignments || []).length > 0);
    }

    if (!data) return;

    setApplicationId(data?.id ?? null);

    setForm((prev) => ({
      ...prev,
      ...data,
    }));

    setProgramRanks(data.selected_programs || {});
  };

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateProgramRank = (programId, rank) => {
    const updated = {
      ...programRanks,
    };

    if (!rank) {
      delete updated[programId];
    } else {
      const numericRank = Number(rank);

      // Remove this rank from any other program
      Object.keys(updated).forEach((id) => {
        if (id !== programId && updated[id] === numericRank) {
          delete updated[id];
        }
      });

      updated[programId] = numericRank;
    }

    setProgramRanks(updated);

    setForm((prev) => ({
      ...prev,
      selected_programs: updated,
    }));
  };

  const toggleLearningStyle = (style) => {
    const exists = form.learning_styles.includes(style);

    update(
      "learning_styles",
      exists
        ? form.learning_styles.filter((x) => x !== style)
        : [...form.learning_styles, style],
    );
  };

  const isComplete = () => {
    return (
      Object.keys(programRanks).length > 0 &&
      form.about_me &&
      form.important_to_me &&
      form.hopes_and_dreams &&
      form.learning_and_work_style &&
      form.growth_experiences &&
      form.communication_style &&
      form.support_preferences
    );
  };

  useEffect(() => {
    if (!applicationId || hasAssignments) return;

    const timeout = setTimeout(async () => {
      await supabase
        .from("volunteer_applications")
        .update({
          selected_programs: form.selected_programs,
          weekend_commitments: form.weekend_commitments,

          about_me: form.about_me,
          important_to_me: form.important_to_me,
          hopes_and_dreams: form.hopes_and_dreams,
          learning_and_work_style: form.learning_and_work_style,
          growth_experiences: form.growth_experiences,
          communication_style: form.communication_style,
          support_preferences: form.support_preferences,

          learning_styles: form.learning_styles,

          interest_form_updated_at: new Date(),
        })
        .eq("id", applicationId);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form, applicationId]);

  const submitForm = async () => {
    try {
      if (applicationId === null || applicationId === undefined) {
        alert("Volunteer application not found.");
        return;
      }

      setSubmitting(true);

      const { error } = await supabase
        .from("volunteer_applications")
        .update({
          selected_programs: form.selected_programs,

          weekend_commitments: form.weekend_commitments,

          about_me: form.about_me,

          important_to_me: form.important_to_me,

          hopes_and_dreams: form.hopes_and_dreams,

          learning_and_work_style: form.learning_and_work_style,

          growth_experiences: form.growth_experiences,

          communication_style: form.communication_style,

          support_preferences: form.support_preferences,

          learning_styles: form.learning_styles,

          interest_form_completed: true,
          interest_form_updated_at: new Date(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      alert("Interest Form Submitted Successfully");

      update("interest_form_completed", true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">
          Volunteer Interest Form
        </h1>

        <p className="text-gray-500 mt-2">
          Help us get to know you better and match you with programs that align
          with your interests.
        </p>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Submitting this form does not guarantee
            placement. Program assignments are subject to availability and
            administrative review.
          </p>
        </div>

        {form.interest_form_completed && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            {hasAssignments ? (
              <div className="flex items-start gap-3 text-green-700">
                <HiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />

                <p className="font-medium">
                  Interest Form Submitted. Program assignments have been made
                  and your responses are now locked.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-green-700">
                <HiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />

                <p className="font-medium">
                  Interest Form Submitted. You may continue editing and updating
                  your responses until program assignments have been made.
                </p>
              </div>
            )}

            {form.interest_form_updated_at && (
              <p className="text-sm text-green-600 mt-1">
                Last updated: {formatPacificTime(form.interest_form_updated_at)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-2">
          Volunteer Program Preferences
        </h2>

        <p className="text-gray-500 mb-6">
          Rank the programs you would be interested in supporting. Rank #1 is
          your highest preference. Leave a program blank if you are not
          interested.
        </p>

        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="
          border
          rounded-2xl
          p-5
          bg-gray-50
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-4
        "
            >
              <div>
                <div className="font-medium text-gray-900">
                  {getProgramDisplayName(program, programs)}
                </div>

                <div className="text-sm text-gray-500">
                  {getProgramSchedule(program)}
                </div>
              </div>

              <select
                disabled={hasAssignments}
                value={programRanks[program.id] || ""}
                onChange={(e) => updateProgramRank(program.id, e.target.value)}
                className="
            border
            rounded-xl
            px-4
            py-3
            bg-white
            min-w-[180px]
          "
              >
                <option value="">Not Interested</option>

                {Array.from({ length: programs.length }, (_, i) => i + 1).map(
                  (rank) => (
                    <option key={rank} value={rank}>
                      Rank #{rank}
                    </option>
                  ),
                )}
              </select>
            </div>
          ))}
        </div>

        {Object.keys(programRanks).length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-5 border">
            <h3 className="font-semibold mb-4">Your Ranked Preferences</h3>

            <div className="space-y-3">
              {Object.entries(programRanks)
                .sort((a, b) => a[1] - b[1])
                .map(([programId, rank]) => {
                  const program = programs.find((p) => p.id === programId);

                  if (!program) return null;

                  return (
                    <div
                      key={programId}
                      className="
                  flex
                  justify-between
                  items-center
                  bg-white
                  border
                  rounded-xl
                  p-4
                "
                    >
                      <span>{getProgramDisplayName(program, programs)}</span>

                      <span
                        className="
                    bg-[#0f5b54]
                    text-white
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  "
                      >
                        Rank #{rank}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <QuestionCard
        title="1. Tell us about yourself"
        value={form.about_me}
        onChange={(e) => update("about_me", e.target.value)}
        placeholder="What are some things people appreciate about you? What makes you unique?"
        disabled={hasAssignments}
      />

      <QuestionCard
        title="2. What is important to you?"
        value={form.important_to_me}
        onChange={(e) => update("important_to_me", e.target.value)}
        placeholder="People, hobbies, activities, interests, food, routines, favorite outings..."
        disabled={hasAssignments}
      />

      <QuestionCard
        title="3. What are your hopes and dreams?"
        value={form.hopes_and_dreams}
        onChange={(e) => update("hopes_and_dreams", e.target.value)}
        placeholder="What would you like your future to look like?"
        disabled={hasAssignments}
      />

      <QuestionCard
        title="4. How do you learn and work best?"
        value={form.learning_and_work_style}
        onChange={(e) => update("learning_and_work_style", e.target.value)}
        placeholder="Describe the environment where you are most successful."
        disabled={hasAssignments}
      />

      <QuestionCard
        title="5. What experiences have helped shape you?"
        value={form.growth_experiences}
        onChange={(e) => update("growth_experiences", e.target.value)}
        placeholder="School, volunteering, work, clubs, projects, experiences..."
        disabled={hasAssignments}
      />

      <QuestionCard
        title="6. How do you communicate your needs?"
        value={form.communication_style}
        onChange={(e) => update("communication_style", e.target.value)}
        placeholder="How do people know when you need help, are excited, frustrated, or overwhelmed?"
        disabled={hasAssignments}
      />

      <QuestionCard
        title="7. What should we know to support you?"
        value={form.support_preferences}
        onChange={(e) => update("support_preferences", e.target.value)}
        placeholder="If someone was meeting you for the first time, what advice would you give them?"
        disabled={hasAssignments}
      />

      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-5">Learning Styles</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {learningOptions.map((style) => (
            <button
              key={style}
              type="button"
              disabled={hasAssignments}
              onClick={() => toggleLearningStyle(style)}
              className={`p-4 rounded-xl border ${
                form.learning_styles.includes(style)
                  ? "bg-[#0f5b54] text-white"
                  : ""
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <label className="block font-medium mb-3">Weekend Commitments</label>

        <textarea
          disabled={hasAssignments}
          rows={4}
          value={form.weekend_commitments || ""}
          onChange={(e) => update("weekend_commitments", e.target.value)}
          className="w-full border rounded-xl p-4"
        />
      </div>

      <div className="sticky bottom-5">
        <div className="bg-white rounded-3xl border shadow-xl p-5 flex justify-end">
          <button
            disabled={!isComplete() || submitting || hasAssignments}
            onClick={submitForm}
            className="bg-[#0f5b54] text-white px-8 py-4 rounded-2xl"
          >
            {/* {submitting
              ? "Submitting..."
              : form.interest_form_completed
                ? "Submitted"
                : "Submit Interest Form"} */}
            {submitting
              ? "Saving..."
              : form.interest_form_completed
                ? "Submit Updates"
                : "Submit Interest Form"}
          </button>
        </div>
      </div>
    </div>
  );
}
