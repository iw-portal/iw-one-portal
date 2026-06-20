import { useState } from "react";

const skills = [
  {
    title: "Computer Programming",
    content:
      "This program exposes students to the basics of programming through fun games & story board projects to progress to learning advanced programming skills. ",
  },
  {
    title: "Robotics",
    content:
      "In these classes, students enjoy the sensory experience of programming to control the movement of physical robots.",
  },
  {
    title: "Microsoft Excel",
    content:
      "Our students begin with learning how to organize any type of information by using MS Excel and then progress to learning how to run calculations and creating data visualizations.",
  },
  {
    title: "Software Testing",
    content:
      "In this program, our courses provide students with valuable hands-on experience with standard industry tools for testing software.",
  },
];

function ProgramsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-1">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#e16a5b]">
            Our Programs
          </h2>

          <div className="w-20 h-[3px] bg-[#e16a5b] mx-auto mt-4"></div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Video Section */}
          <div>
            <div className="aspect-video mb-6">
              <iframe
                width="360"
                height="215"
                src="https://www.youtube.com/embed/PM2KaWiJki0?si=r4dftIbMB84278A6"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>

            <h3 className="text-xl font-semibold text-[#e16a5b] mb-6">
              Skills Development
            </h3>

            {/* Accordion */}
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="border-b border-gray-300 pb-2">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex items-center justify-between w-full text-left font-semibold text-gray-800"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[#e16a5b] text-lg">+</span>
                      {skill.title}
                    </span>

                    <span className="text-gray-400">
                      {openIndex === index ? "-" : ""}
                    </span>
                  </button>

                  {openIndex === index && (
                    <p className="text-gray-600 mt-3 pl-7">{skill.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Employment Services */}
          <div>
            <img
              src="https://inclusiveworld.org/wp-content/uploads/2020/12/Employment.jpg"
              alt="Employment Services"
              className="rounded-lg mb-6"
            />

            <h3 className="text-xl font-semibold text-[#e16a5b] mb-4">
              Employment Services
            </h3>

            <p className="text-gray-600 mb-4">
              We have partnered with numerous local organizations to provide
              both dignified volunteer and paid job opportunities to give our
              members the experience of working in a real workplace setting,
              socially interacting with co-workers, in addition to learning job
              skills.
            </p>

            <p className="text-gray-600">
              Small Business at IW (SBeIW) offers integrated employment programs
              to differently abled members to lead productive and meaningful
              lives.
            </p>
          </div>

          {/* Person Centered Planning */}
          <div>
            <img
              src="https://inclusiveworld.org/wp-content/uploads/2020/12/yesican.jpg"
              alt="Person Centered Planning"
              className="rounded-lg mb-6"
            />

            <h3 className="text-xl font-semibold text-[#e16a5b] mb-4">
              Person Centered Planning
            </h3>

            <p className="text-gray-600">
              Inclusive World’s model is rooted in person centered practices. We
              currently offer the service of building one-page profiles. One
              page profiles empower individuals to self advocate who they are,
              what is important to them as a person, what is important for them
              to be safe & healthy and how to best support them, in any setting
              – be it in school, college, therapy, social and community
              interactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
