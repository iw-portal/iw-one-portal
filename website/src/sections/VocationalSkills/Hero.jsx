import Navbar from "../../components/Common/Navbar";
import skills_hero from "../../iw-brand-kit/skills/skills-hero.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const buttons = [
  // {
  //   id: 1,
  //   title: "Register for Classes",
  //   toPointTo: "",
  // },
  {
    id: 2,
    title: "View Calendar",
    toPointTo: "/calendar/events",
  },
];

const faqData = [
  {
    question: "What materials should I bring to the program?",
    answer: (
      <div className="space-y-4 text-gray-700">
        <ul className="list-disc pl-6 space-y-3">
          <li>MS Win Laptop or Macbook</li>
          <li>A notebook and pencil/pen to write</li>
          <li>Any communication Device if used</li>
          <li>Lunch/Snacks</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Is Transportation provided for this program?",
    answer:
      "Students should have reliable transportation to commute to the program and arrive and leave on time. Transportation will only be provided for community activities which is part of the program offering.",
  },
  {
    question: "Do I need to have prior knowledge of any skills taught?",
    answer: "No, there is no skills pre-requisite.",
  },
  {
    question: "Any other queries or questions?",
    answer: (
      <div className="space-y-4 text-gray-700">
        <p>
          You can reach us at{" "}
          <a href="mailto:info@inclusiveworld.org" className="text-red-600">
            info@inclusiveworld.org
          </a>{" "}
          if you have any other specific question.
        </p>
      </div>
    ),
  },
];

const Hero = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <Navbar />

        <img
          src={skills_hero}
          alt="Skills Hero Section"
          className="w-full px-14 py-8"
        />

        <section className="py-10 mt-10 md:py-10 bg-[#ffefeb] mb-8">
          <div className="max-w-4xl md:max-w-5xl mx-auto px-6 text-center">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
              Vocational Skills Weekday Program
            </h2>

            {/* Underline */}
            <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>

            <p className="mt-5 text-2xl">
              <strong>
                Inclusive World’s Vocational Weekday Skills Program
              </strong>{" "}
              is designed to empower individuals of all abilities, both
              neurotypical and neurodiverse, with the technical and
              interpersonal skills needed to achieve their educational and
              career goals. Our curriculum is delivered by expert educators who
              excel in their fields and are highly skilled in Person-Centered
              Practices. This allows them to tailor their teaching methods to
              align with each student’s unique strengths and learning styles.
            </p>
          </div>
        </section>

        <section className="flex justify-center items-center space-x-7 mb-8">
          {buttons.map((button) => (
            <Link
              key={button.id}
              to={button.toPointTo}
              className="bg-[#e16a5b] font-bold text-white px-5 py-4 rounded-md text-sm hover:bg-[#cf5b4c] text-center"
            >
              {button.title}
            </Link>
          ))}
        </section>

        <section className="py-15 bg-gray-50 text-xl">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            {/* LEFT SECTION */}
            <div>
              <div>
                <h3 className="font-semibold text-xl mb-3 text-gray-800">
                  Program Highlights
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Vocational Skills Training:</strong> Computer
                    Programming, Functional Math, Budgeting & Money Management
                    (MS Excel), and Small Business skills.
                  </li>
                  <li>
                    <strong>Hands-On Experiential Learning:</strong> Real-world
                    projects and activities.
                  </li>
                  <li>
                    <strong>Life, Social & Communication Skills:</strong>{" "}
                    Conversational skills, self-advocacy, and teamwork.
                  </li>
                  <li>
                    <strong>Employment Preparation:</strong> Resume building,
                    interview preparation, and job search guidance.
                  </li>
                  <li>
                    <strong>Safety & Awareness:</strong> Cyber safety, community
                    safety, and navigating public spaces securely.
                  </li>
                  <li>
                    <strong>Community Engagement:</strong> Volunteering and
                    collaborative activities with the local community.
                  </li>
                  <li>
                    <strong>Health & Wellness:</strong> Physical fitness,
                    nutrition, and recreational activities.
                  </li>
                  <li>
                    <strong>No prior experience required.</strong>
                  </li>
                </ul>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="font-semibold text-xl mb-3 mt-5 text-gray-800">
                  Program Schedule
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>3-day options:</strong> Monday–Wednesday–Friday OR
                    Tuesday–Thursday–Friday
                  </li>
                  <li>
                    <strong>5-day option:</strong> Coming soon
                  </li>
                  <li>
                    <strong>Time:</strong> 9:00 AM – 3:00 PM PT (New timings for
                    Quarter 3)
                  </li>
                  <li>
                    <strong>Location:</strong> 106 S Park Victoria Dr, Milpitas,
                    CA
                  </li>
                </ul>
              </div>

              {/* Enrollment Criteria */}
              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-[#e0705d] mb-4">
                  Enrollment Criteria, Schedule & Fees
                </h3>

                <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
                  <p>
                    To ensure a supportive and successful learning environment,
                    participants and their families are expected to meet the
                    following criteria:
                  </p>

                  {/* Entry Criteria */}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 mb-2">
                      Entry Criteria
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Age:</strong> Participants must be 18 years or
                        older.
                      </li>
                      <li>
                        <strong>Independence:</strong> Must be able to manage
                        personal health and hygiene. If additional support is
                        required, a dedicated aide must accompany the
                        participant.
                      </li>
                      <li>
                        <strong>Behavioral Suitability:</strong> Must be able to
                        participate in group settings safely. Behaviors that may
                        pose risks to self or others may not be suitable for the
                        program.
                      </li>
                      <li>
                        <strong>Program Readiness:</strong> Willingness to
                        participate, follow instructions, maintain at least 85%
                        attendance, and respect peers and staff.
                      </li>
                    </ul>
                  </div>

                  {/* Parent Commitment */}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 mb-2">
                      Parent / Caregiver Engagement
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Active involvement in the participant’s growth and
                        progress.
                      </li>
                      <li>
                        <strong>Goal Setting:</strong> Attend initial sessions
                        to define clear objectives.
                      </li>
                      <li>
                        <strong>Ongoing Communication:</strong> Respond to
                        updates and participate in regular reviews.
                      </li>
                      <li>
                        <strong>Collaborative Problem-Solving:</strong> Work
                        with staff to address challenges.
                      </li>
                      <li>
                        <strong>Follow-Up at Home:</strong> Reinforce skills
                        learned during the program.
                      </li>
                    </ul>
                  </div>

                  {/* Assessment */}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 mb-2">
                      Assessment Process
                    </h4>
                    <p>
                      All applicants must complete an interview and assessment
                      with both the participant and caregiver to align
                      expectations and evaluate support needs.
                    </p>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 mb-2">
                      Schedule
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        3-day options: Monday–Wednesday–Friday OR
                        Tuesday–Thursday–Friday
                      </li>
                      <li>5-day option coming soon</li>
                    </ul>
                  </div>

                  {/* Fees */}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 mb-2">
                      Fees & Refund Policy
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Application Fee:</strong> $100 (non-refundable)
                      </li>
                      <li>
                        Full fees must be paid upon acceptance before the
                        program start date.
                      </li>
                      <li>
                        Refund (excluding application fee) available within 2
                        weeks or 10 days of program start.
                      </li>
                      <li>
                        Quarterly fees must be paid before the quarter begins.
                      </li>
                      <li>
                        <strong>Quarterly Fee:</strong> $7,560 (3-day program)
                      </li>
                    </ul>
                  </div>

                  {/* Dates */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Program Dates
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>March 17 – June 9, 2025</li>
                      <li>June 11 – September 17, 2025</li>
                      <li>
                        September 19 – December 19, 2025{" "}
                        <strong>(Enrolling Now – 9:00 AM to 3:00 PM PT)</strong>
                      </li>
                    </ul>
                  </div>

                  <p>
                    For questions, contact{" "}
                    <a
                      href="mailto:info@inclusiveworld.org"
                      className="text-red-600 font-medium"
                    >
                      info@inclusiveworld.org
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div>
              <h2 className="text-3xl font-bold text-[#e0705d] mb-8">FAQ</h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border rounded-lg bg-white">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>

                      <span
                        className={`text-white w-6 h-6 flex hover:bg-red-500 items-center justify-center rounded ${
                          openIndex === index ? "bg-red-500" : "bg-[#b24a60]"
                        }`}
                      >
                        {openIndex === index ? "−" : "+"}
                      </span>
                    </button>

                    {openIndex === index && (
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="flex justify-center items-center space-x-7 mb-3 mt-20">
            {buttons.map((button) => (
              <Link
                key={button.id}
                to={button.toPointTo}
                className="bg-[#e16a5b] font-bold text-white px-5 py-4 rounded-md text-sm hover:bg-[#cf5b4c] text-center"
              >
                {button.title}
              </Link>
            ))}
          </section>
        </section>
      </div>
    </>
  );
};

export default Hero;
