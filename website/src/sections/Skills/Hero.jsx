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
  {
    id: 3,
    title: "Our Skills Development Partners",
    toPointTo: "/skills/partners",
  },
  {
    id: 4,
    title: "Fall 2025-26 Weekend Classes Schedule",
    toPointTo: "/skills/ay25_26_calendar",
  },
];

const faqData = [
  {
    question: "When are the skills development classes held?",
    answer:
      "Inclusive World’s skills development classes are held during the school/college academic year starting in September through the year until May. Some classes are offered for a shorter duration of 12-14 weeks and some are for a longer duration of 24-26 weeks. Most of our classes are held on the weekend (Saturday and Sunday). See our calendar for more details.",
  },
  {
    question: "How long are the skills development classes?",
    answer:
      "Each skill class session is typically for 1 hour and 15 mins. Other than the class session, one will need to make time for another 45 minutes of homework session during the week.",
  },
  {
    question: "Where are the skills development classes held?",
    answer:
      "Inclusive World offers some skills development classes in-person at the Inclusive World Center, at Milpitas, California, and some online.",
  },
  {
    question: "What is the fee for enrolling in skills development classes?",
    answer: (
      <div className="space-y-4 text-gray-700">
        <p>
          Below is the fee structure for our Skill Development Program and Small
          Business@IW – Products & Services Programs:
        </p>

        <ul className="list-disc pl-6 space-y-3">
          <li>
            A non-refundable annual registration fee of <b>$50</b> will be
            applied.
          </li>

          <li>
            The fee for a single program enrollment is <b>$150 per program</b>,
            while the Annual Membership fee is <b>$300</b>, providing access to
            all available programs.
          </li>

          <li>
            If you are interested in enrolling in multiple programs, we suggest
            choosing the Annual Membership Fee, which grants you access to all
            available programs.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "What is the buddy system?",
    answer:
      "Inclusive World’s program model is rooted in “Person-centered” practices. When members enroll into a skill class at Inclusive World, we pair each member with a peer group volunteer to support the learning process in class. Mapping is based on the profile information we collect from members and volunteers and the “person-centered” tools we use.",
  },
  {
    question: "How do I enroll into a skills development class?",
    answer:
      "Create a user account on our One Portal and then register for classes.",
  },
  {
    question: "Can I do more than one skills development class?",
    answer:
      "Yes, you can register for more than one skill class based on your availability and the schedule we have to offer.",
  },
  {
    question: "Any other queries or questions?",
    answer: (
      <p>
        You can reach us at{" "}
        <a
          href="mailto:info@inclusiveworld.org"
          className="font-bold text-[#e16a5b]"
        >
          info@inclusiveworld.org
        </a>{" "}
        if you have any other specific question.
      </p>
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
              Skills Development
            </h2>

            {/* Underline */}
            <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>
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

        <section className="py-15 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            {/* LEFT SECTION */}
            <div>
              <h2 className="text-3xl font-bold text-[#e0705d] mb-6">
                Classes
              </h2>

              <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
                <p>
                  Our skills development program provides comprehensive training
                  in various vocational areas, designed to equip participants
                  with practical and in-demand skills. We offer these programs
                  during weekdays as part of our vocational skills curriculum,
                  as well as an extensive array of weekend vocational skills
                  programs to accommodate diverse schedules and learning
                  preferences.
                </p>

                <p>
                  We especially encourage new students to explore our{" "}
                  <strong>beginner-level programs</strong>, which are designed
                  for students with <em>no prior exposure</em> to the subject
                  matter. These classes are paced gently, with concepts broken
                  down into simple, accessible steps.
                </p>

                <p>
                  Our full-term weekend classes run from September to May, while
                  our short-term classes are available from September to
                  December and February to May.
                </p>

                <p>
                  A unique feature of our weekend programs is the one-on-one
                  buddy system. In this system, each student is paired with a
                  peer buddy volunteer who assists them with classwork and
                  homework.
                </p>

                <p>
                  For detailed information on class timings for the Fall
                  Session, please click on the Weekend Classes Schedule.
                </p>
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
        </section>
      </div>
    </>
  );
};

export default Hero;
