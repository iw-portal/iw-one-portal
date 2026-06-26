import { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabase";
import { CiCircleCheck } from "react-icons/ci";

const LEARNING_OPTIONS = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic",
];

const DREAM_OPTIONS = [
  "Employment",
  "Community",
  "Independence",
  "Vocational Skills",
  "Friendships",
];

export default function EnrollmentProfile({ user, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [learningStyles, setLearningStyles] = useState([]);

  const [dreamGoals, setDreamGoals] = useState([]);

  const [form, setForm] = useState({
    about_team: "",
    about_great: "",
    about_likes: "",
    about_learn: "",
    about_happy: "",
    about_sad: "",

    hobbies: "",
    activities: "",
    entertainment: "",
    favorite_food: "",
    favorite_people: "",
    favorite_outings: "",
    routines_rituals: "",
    perfect_day: "",

    hopes_dreams: "",
    dream_job: "",
    jobs_interested: "",
    desired_skills: "",
    desired_growth_areas: "",

    why_interested_iw: "",
    goals_expectations: "",

    important_to: "",
    important_for: "",

    support_devices: "",
    accommodations: "",
    environment_preferences: "",
    virtual_learning_help: "",
    day_program_recommendations: "",

    communication_needs: "",
    communication_style: "",
    language_used: "",

    can_initiate_conversations: null,
    communicates_without_words: null,
    can_articulate_needs: null,

    sign_language: "",
    uses_device: null,
    uses_picture_board: null,
    augmented_system: "",

    prior_jobs: "",
    available_work_days: "",
    hours_per_week: "",

    about_school_like: "",
    about_school_dislike: "",

    iep_working: "",
    iep_not_working: "",

    ideal_staff_traits: "",
    disliked_staff_traits: "",
    risk_factors: "",

    helper_person: "",

    exp_web: null,
    exp_scratch: null,
    exp_excel: null,
    exp_testing: null,
    exp_mobile: null,
    exp_python: null,
    exp_ai: null,

    communication_happy: "",
    communication_sad: "",
  });

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("member_enrollment_profiles")
      .select("*")
      .eq("person_id", user.person_id)
      .maybeSingle();

    if (error) {
      console.error(error);
      alert("Could not load enrollment profile.");
      return;
    }

    if (!data) return;

    setLearningStyles(data.learning_styles || []);

    setDreamGoals(data.dreams_goals || []);

    setForm((prev) => ({
      ...prev,
      ...data,
    }));
    if (data.completed_at) {
      setLastSaved(new Date(data.completed_at));
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (user?.person_id) {
      fetchProfile();
    }
  }, [user?.person_id]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleLearning(style) {
    setLearningStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }

  function toggleDream(goal) {
    setDreamGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  async function save() {
    if (loading) return;

    setLoading(true);

    if (!user?.person_id) {
      alert("Could not identify the current member.");
      setLoading(false);
      return;
    }

    if (learningStyles.length === 0) {
      alert("Please select at least one learning style.");
      setLoading(false);
      return;
    }

    if (dreamGoals.length === 0) {
      alert("Please select at least one goal or aspiration.");
      setLoading(false);
      return;
    }

    if (!form.hopes_dreams?.trim()) {
      alert("Please describe hopes and dreams.");
      setLoading(false);
      return;
    }

    if (!form.accommodations?.trim()) {
      alert("Please provide accommodations information.");
      setLoading(false);
      return;
    }

    if (!form.communication_needs?.trim()) {
      alert("Please describe communication needs.");
      setLoading(false);
      return;
    }

    const payload = {
      person_id: user.person_id,

      learning_styles: learningStyles,

      dreams_goals: dreamGoals,

      ...form,

      completed_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("member_enrollment_profiles")
      .upsert(payload, {
        onConflict: "person_id",
      });

    setLoading(false);

    if (error) {
      console.error(error);

      alert(error.message);

      return;
    }
    setLastSaved(new Date());
    onNext();
  }

  return (
    <div className="space-y-8">
      <div className="sticky bottom-6">
        <button
          onClick={onBack}
          className="
              px-6
              py-3
              rounded-2xl
              border
            "
        >
          Back
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">
          Enrollment Profile
        </h1>

        <p className="text-gray-500 mt-3">
          Help us better understand the student so we can build a strong support
          and enrollment plan.
        </p>
        {/* <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CiCircleCheck className="h-7 w-7" />
          <span className="text-xl">
            Your progress will be saved when you click{" "}
            <span className="font-extrabold ">Continue to Payment</span>.
            {lastSaved && (
              <>
                {" "}
                Last saved{" "}
                {new Date(lastSaved).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
                .
              </>
            )}
          </span>
        </div> */}
        <div
          className={`
    mt-5 inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm
    ${
      lastSaved
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-amber-200 bg-amber-50 text-amber-700"
    }
  `}
        >
          <CiCircleCheck
            className={`h-5 w-5 flex-shrink-0 ${
              lastSaved ? "text-green-600" : "text-amber-600"
            }`}
          />

          <div className="leading-relaxed">
            {lastSaved ? (
              <>
                <span className="font-semibold">Progress saved</span>
                <span className="mx-2 text-green-400">•</span>
                <span>
                  Last saved on{" "}
                  {lastSaved.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  PT
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold">Progress not saved yet</span>
                <span className="mx-2 text-amber-400">•</span>
                <span>
                  Click <strong>Continue to Payment</strong> to save this
                  profile.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* ======================================== */}
      {/* LEARNING */}
      {/* ======================================== */}
      <Section title="Learning Styles">
        <div className="grid md:grid-cols-2 gap-4">
          {LEARNING_OPTIONS.map((style) => (
            <SelectableCard
              key={style}
              active={learningStyles.includes(style)}
              onClick={() => toggleLearning(style)}
              label={style}
            />
          ))}
        </div>
      </Section>
      {/* ======================================== */}
      {/* GOALS */}
      {/* ======================================== */}
      <Section title="Goals & Aspirations">
        <div className="grid md:grid-cols-2 gap-4">
          {DREAM_OPTIONS.map((goal) => (
            <SelectableCard
              key={goal}
              active={dreamGoals.includes(goal)}
              onClick={() => toggleDream(goal)}
              label={goal}
            />
          ))}
        </div>

        <Textarea
          label="What are your hopes and dreams?"
          value={form.hopes_dreams}
          onChange={(v) => update("hopes_dreams", v)}
        />

        <Textarea
          label="Dream Job"
          value={form.dream_job}
          onChange={(v) => update("dream_job", v)}
        />

        <Textarea
          label="What skills would you like to develop?"
          value={form.desired_skills}
          onChange={(v) => update("desired_skills", v)}
        />

        <Textarea
          label="Desired Areas of Growth"
          value={form.desired_growth_areas}
          onChange={(v) => update("desired_growth_areas", v)}
        />
      </Section>

      {/* <Section title="Experience With Programs & Technology">
        <div className="grid md:grid-cols-2 gap-6">
          <BooleanSelect
            label="Experience with Web Development?"
            value={form.exp_web}
            onChange={(v) => update("exp_web", v)}
          />

          <BooleanSelect
            label="Experience with Scratch?"
            value={form.exp_scratch}
            onChange={(v) => update("exp_scratch", v)}
          />

          <BooleanSelect
            label="Experience with Excel?"
            value={form.exp_excel}
            onChange={(v) => update("exp_excel", v)}
          />

          <BooleanSelect
            label="Experience with Software Testing?"
            value={form.exp_testing}
            onChange={(v) => update("exp_testing", v)}
          />

          <BooleanSelect
            label="Experience with Mobile App Development?"
            value={form.exp_mobile}
            onChange={(v) => update("exp_mobile", v)}
          />

          <BooleanSelect
            label="Experience with Python?"
            value={form.exp_python}
            onChange={(v) => update("exp_python", v)}
          />

          <BooleanSelect
            label="Experience with AI?"
            value={form.exp_ai}
            onChange={(v) => update("exp_ai", v)}
          />
        </div>
      </Section> */}

      {/* ======================================== */}
      {/* ABOUT */}
      {/* ======================================== */}
      <Section title="About You">
        <Textarea
          label="What are some great things about you?"
          value={form.about_great}
          onChange={(v) => update("about_great", v)}
        />
        {/* <Textarea
          label="Who are the important people in your life?"
          value={form.about_team}
          onChange={(v) => update("about_team", v)}
        /> */}
        <Textarea
          label="What do you like to do?"
          value={form.about_likes}
          onChange={(v) => update("about_likes", v)}
        />
        <Textarea
          label="What would you like to learn?"
          value={form.about_learn}
          onChange={(v) => update("about_learn", v)}
        />
        <Textarea
          label="Hobbies & Activities"
          value={form.hobbies}
          onChange={(v) => update("hobbies", v)}
        />
        {/* <Textarea
          label=""
          value={form.activities}
          onChange={(v) => update("activities", v)}
        /> */}
        <Textarea
          label="Favorite Foods"
          value={form.favorite_food}
          onChange={(v) => update("favorite_food", v)}
        />
        <Textarea
          label="Favorite Outings"
          value={form.favorite_outings}
          onChange={(v) => update("favorite_outings", v)}
        />
        <Textarea
          label="Describe Your Perfect Day"
          value={form.perfect_day}
          onChange={(v) => update("perfect_day", v)}
        />
        <Textarea
          label="What makes you happy?"
          value={form.about_happy}
          onChange={(v) => update("about_happy", v)}
        />
        <Textarea
          label="What makes you sad or upset?"
          value={form.about_sad}
          onChange={(v) => update("about_sad", v)}
        />
        <Textarea
          label="What entertainment do you enjoy? (TV shows, movies, music, games, etc.)"
          value={form.entertainment}
          onChange={(v) => update("entertainment", v)}
        />

        <Textarea
          label="Who are the important or favorite people in your life?"
          value={form.favorite_people}
          onChange={(v) => update("favorite_people", v)}
        />

        <Textarea
          label="Are there any routines, rituals, or schedules important to you?"
          value={form.routines_rituals}
          onChange={(v) => update("routines_rituals", v)}
        />
      </Section>

      {/* ======================================== */}
      {/* SUPPORT */}
      {/* ======================================== */}
      <Section title="Support & Accessibility">
        {/* <Textarea
          label="What is important TO you?"
          value={form.important_to}
          onChange={(v) => update("important_to", v)}
        />

        <Textarea
          label="What is important FOR you?"
          value={form.important_for}
          onChange={(v) => update("important_for", v)}
        /> */}

        <Textarea
          label="Support Devices"
          value={form.support_devices}
          onChange={(v) => update("support_devices", v)}
        />

        <Textarea
          label="Accommodations"
          value={form.accommodations}
          onChange={(v) => update("accommodations", v)}
        />

        <Textarea
          label="Environment Preferences"
          value={form.environment_preferences}
          onChange={(v) => update("environment_preferences", v)}
        />

        <Textarea
          label="Virtual Learning Support Needed"
          value={form.virtual_learning_help}
          onChange={(v) => update("virtual_learning_help", v)}
        />
      </Section>

      {/* ======================================== */}
      {/* COMMUNICATION */}
      {/* ======================================== */}
      <Section title="Communication Style">
        <Textarea
          label="How do you communicate your needs?"
          value={form.communication_needs}
          onChange={(v) => update("communication_needs", v)}
        />
        <Textarea
          label="Communication Style"
          value={form.communication_style}
          onChange={(v) => update("communication_style", v)}
        />
        <Input
          label="Primary Language"
          value={form.language_used}
          onChange={(v) => update("language_used", v)}
        />

        <Textarea
          label="How do you communicate when happy?"
          value={form.communication_happy}
          onChange={(v) => update("communication_happy", v)}
        />
        <Textarea
          label="How do you communicate when upset or sad?"
          value={form.communication_sad}
          onChange={(v) => update("communication_sad", v)}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <BooleanSelect
            label="Can initiate conversations?"
            value={form.can_initiate_conversations}
            onChange={(v) => update("can_initiate_conversations", v)}
          />

          <BooleanSelect
            label="Communicates without words?"
            value={form.communicates_without_words}
            onChange={(v) => update("communicates_without_words", v)}
          />

          <BooleanSelect
            label="Can articulate needs?"
            value={form.can_articulate_needs}
            onChange={(v) => update("can_articulate_needs", v)}
          />

          <BooleanSelect
            label="Uses communication device?"
            value={form.uses_device}
            onChange={(v) => update("uses_device", v)}
          />

          <BooleanSelect
            label="Uses picture board?"
            value={form.uses_picture_board}
            onChange={(v) => update("uses_picture_board", v)}
          />
        </div>
        <Input
          label="Sign Language"
          value={form.sign_language}
          onChange={(v) => update("sign_language", v)}
        />
        <Textarea
          label="Augmented Communication System"
          value={form.augmented_system}
          onChange={(v) => update("augmented_system", v)}
        />
      </Section>
      {/* ======================================== */}
      {/* EDUCATION */}
      {/* ======================================== */}
      <Section title="Education & Employment (Optional)">
        <Textarea
          label="Prior Job Experience"
          value={form.prior_jobs}
          onChange={(v) => update("prior_jobs", v)}
        />

        <Textarea
          label="Jobs Interested In"
          value={form.jobs_interested}
          onChange={(v) => update("jobs_interested", v)}
        />

        <Textarea
          label="Available Work Days"
          value={form.available_work_days}
          onChange={(v) => update("available_work_days", v)}
        />

        <Textarea
          label="Hours Per Week Preferred"
          value={form.hours_per_week}
          onChange={(v) => update("hours_per_week", v)}
        />

        <Textarea
          label="What did you like learning at school?"
          value={form.about_school_like}
          onChange={(v) => update("about_school_like", v)}
        />

        <Textarea
          label="What did you dislike learning at school?"
          value={form.about_school_dislike}
          onChange={(v) => update("about_school_dislike", v)}
        />

        <Textarea
          label="How is your IEP working for you?"
          value={form.iep_working}
          onChange={(v) => update("iep_working", v)}
        />

        <Textarea
          label="How is your IEP NOT working for you?"
          value={form.iep_not_working}
          onChange={(v) => update("iep_not_working", v)}
        />
      </Section>
      {/* ======================================== */}
      {/* STAFF */}
      {/* ======================================== */}
      <Section title="Support Team Preferences">
        <Textarea
          label="Desired Personality Traits"
          value={form.ideal_staff_traits}
          onChange={(v) => update("ideal_staff_traits", v)}
        />
        <Textarea
          label="Not Desired Personality Traits"
          value={form.disliked_staff_traits}
          onChange={(v) => update("disliked_staff_traits", v)}
        />
        {/* <Textarea
          label="Any Risk Factors Staff Should Know?"
          value={form.risk_factors}
          onChange={(v) => update("risk_factors", v)}
        /> */}
        <Textarea
          label="Who helped complete this form?"
          value={form.helper_person}
          onChange={(v) => update("helper_person", v)}
        />
      </Section>

      <Section title="Inclusive World Enrollment Goals">
        <Textarea
          label="Why are you interested in Inclusive World?"
          value={form.why_interested_iw}
          onChange={(v) => update("why_interested_iw", v)}
        />

        <Textarea
          label="Goals and Expectations"
          value={form.goals_expectations}
          onChange={(v) => update("goals_expectations", v)}
        />

        <Textarea
          label="Day Program Recommendations"
          value={form.day_program_recommendations}
          onChange={(v) => update("day_program_recommendations", v)}
        />
      </Section>
      {/* ======================================== */}
      {/* FOOTER */}
      {/* ======================================== */}
      <div className="sticky bottom-6">
        <div className="bg-white border shadow-xl rounded-3xl p-5 flex justify-between items-center">
          <button
            onClick={onBack}
            className="
              px-6
              py-3
              rounded-2xl
              border
            "
          >
            Back
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="
              bg-[#0f5b54]
              text-white
              px-8
              py-4
              rounded-2xl
              font-medium
            "
          >
            {loading ? "Saving..." : "Save & Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================================================== */
/* HELPERS */
/* ====================================================== */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-[#0f5b54]">{title}</h2>

      {children}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          border
          rounded-2xl
          p-4
          bg-gray-50
        "
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          min-h-[120px]
          border
          rounded-2xl
          p-4
          bg-gray-50
        "
      />
    </div>
  );
}

function BooleanSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <select
        value={value === true ? "true" : value === false ? "false" : ""}
        onChange={(e) => {
          if (e.target.value === "true") onChange(true);
          else if (e.target.value === "false") onChange(false);
          else onChange(null);
        }}
        className="
          w-full
          border
          rounded-2xl
          p-4
          bg-gray-50
        "
      >
        <option value="">Select</option>

        <option value="true">Yes</option>

        <option value="false">No</option>
      </select>
    </div>
  );
}

function SelectableCard({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-5
        rounded-2xl
        border
        text-left
        transition
        ${active ? "bg-[#eef8f7] border-[#0f5b54]" : "bg-white border-gray-300"}
      `}
    >
      <span className="font-medium">{label}</span>
    </button>
  );
}
