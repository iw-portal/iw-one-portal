import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";

import hero from "/employment.png";

export default function EmploymentServices() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* HERO IMAGE */}
      <div className="flex justify-center">
        <img
          src={hero}
          alt="Employment Services"
          className="w-full max-w-6xl object-cover"
        />
      </div>

      {/* HEADER SECTION */}
      <section className="bg-[#e8d6d2] text-center py-10 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
          Employment Services
        </h2>

        <p className="text-gray-700 mt-4 text-sm md:text-base max-w-4xl mx-auto">
          Our Employment Services are designed to connect individuals with
          developmental disabilities with meaningful employment and volunteer
          opportunities—while providing the ongoing support they need to
          succeed. We work closely with both members and employers to ensure the
          right fit, adequate preparation, and long-term success.
        </p>
      </section>

      {/* BUTTONS */}
      <div className="max-w-6xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-4">
        {/* <button className="flex-1 bg-[#e16a5b] text-white py-3 rounded text-sm font-semibold hover:bg-[#cf5b4c]">
          Register for Employment Services →
        </button> */}

        <Link
          to="/programs/employment-services/esp_partners"
          replace
          className="flex-1 bg-[#e16a5b] text-center text-white py-3 rounded text-sm font-semibold hover:bg-[#cf5b4c]"
        >
          Our Employment Partners →
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto px-6 mt-10 space-y-8 text-gray-700 text-sm md:text-base leading-relaxed">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            How we work with our Members
          </h3>

          <p>
            We guide each member through a structured and supportive journey
            tailored to their unique strengths and goals. The process begins
            with a discovery meeting to develop a personalized employment
            profile that outlines their interests, workplace preferences, and
            necessary accommodations. We provide comprehensive support including
            resume development, professional review, interview preparation, and
            targeted job search assistance. Skill gaps are identified and
            members are guided with resources for upskilling. Once suitable
            placements are found, we support our candidates through their
            onboarding and ensure that their experience is positive, and help
            our members grow and thrive at work.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            How we collaborate with Partner Organizations
          </h3>

          <p>
            We partner with inclusive-minded organizations to create meaningful
            volunteer, internship, and job opportunities that align with our
            members’ strengths. Through a thoughtful process, we identify
            employers and co-design neurodiversity-friendly roles. Once a match
            is made with an employer, we facilitate onboarding, coordinate
            workplace accommodations, and maintain consistent follow-ups to
            promote success and professional growth. The type of engagement with
            each partner could vary from being a volunteering job, part time to
            seasonal short term projects to full term internships and paid jobs.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 mt-10 space-y-6">
        {/* CARD 1 */}
        <div className="bg-gray-200 p-4 border-l-4 border-[#e16a5b] text-sm text-gray-700">
          “I commend organizations that open doors to give a chance to the
          special needs young adults to stimulate them and to continue to
          challenge them by raising their level of expectations. These young
          adults are internally very cognizant and it is our responsibility to
          facilitate their environment to help them reach their maximum
          potential.” – Parent
        </div>

        {/* CARD 2 */}
        <div className="bg-gray-200 p-4 border-l-4 border-[#e16a5b] text-sm text-gray-700">
          Seasonal jobs “Well coordinated by IW. Srivatsan learnt assembly line
          type of work and time allotted was sufficient to complete the task.” –
          Parent
        </div>

        {/* CARD 3 */}
        <div className="bg-gray-200 p-4 border-l-4 border-[#e16a5b] text-sm text-gray-700">
          “Skills such as hand eye coordination, problem solving and focusing
          were learnt and we also got left-right integration movement in by
          making the hands cross for each lid. Yes, it was about 15 hours of
          free therapy!” – Parent
        </div>
      </section>

      {/* BOTTOM BUTTONS */}
      <div className="max-w-6xl mx-auto px-6 mt-10 mb-16 flex flex-col md:flex-row gap-4">
        {/* <button className="flex-1 bg-[#e16a5b] text-white py-3 rounded text-sm font-semibold hover:bg-[#cf5b4c]">
          Register for Employment Services →
        </button> */}

        <Link
          to="/programs/employment-services/esp_partners"
          replace
          className="flex-1 bg-[#e16a5b] text-center text-white py-3 rounded text-sm font-semibold hover:bg-[#cf5b4c]"
        >
          Our Employment Partners →
        </Link>
      </div>
      <Footer />
    </div>
  );
}
