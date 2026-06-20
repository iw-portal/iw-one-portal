import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import hero from "/avc-hero.png"; // replace with your image

export default function AcademicVocationalCounseling() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* HERO IMAGE */}
      <div className="px-4 md:px-10 pt-4">
        <img
          src={hero}
          alt="Academic and Vocational Counseling"
          className="w-full max-w-7xl mx-auto object-cover"
        />
      </div>
      {/* MAIN SECTION */}
      <section className="bg-[#e6d3ce] mt-4 py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* TITLE */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
              Academic and Vocational Counseling
            </h2>

            <div className="w-28 h-[2px] bg-[#e0705d] mx-auto mt-3 mb-6"></div>
          </div>

          {/* INTRO */}
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
            Navigating systems of support for individuals with developmental
            disabilities (individuals) can be overwhelming, especially for
            families and individuals unfamiliar with available resources and
            processes. The Academic and Vocational Counseling Service is
            designed to provide person-centered, strengths-based guidance
            through a structured, accessible pathway. Our goal is to empower
            individuals and their families by offering clarity, connection to
            resources, and individualized transition planning rooted in the
            individual’s goals, preferences, and lived experiences. This service
            is best suited for:
          </p>

          {/* BULLETS */}
          <ul className="list-disc pl-6 text-sm md:text-base text-gray-700 space-y-2 mb-8">
            <li>
              Individuals preparing for transition (e.g., from high school to
              college or work)
            </li>
            <li>
              Families unfamiliar with support systems who need structured
              guidance
            </li>
            <li>
              Individuals seeking a collaborative planning process aligned with
              their strengths and aspirations
            </li>
          </ul>

          {/* SECTION TITLE */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Consultation Package Overview
          </h3>

          {/* FREE CONSULT */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800">
              Free Initial Consultation (with annual registration)
            </h4>

            <ul className="list-disc pl-6 text-sm md:text-base text-gray-700 mt-2 space-y-1">
              <li>
                <span className="font-semibold">Duration:</span> Upto 30 minutes
              </li>
              <li>
                <span className="font-semibold">Description:</span> An
                introductory, no-obligation conversation to understand the
                individual’s needs, provide an overview of available supports,
                and explore how our service can assist. This is a safe,
                supportive space to ask questions and learn more. If you choose
                to avail the counseling service, you will be invoiced for this
                service followed by an intake appointment.
              </li>
            </ul>
          </div>

          {/* STEP 1 */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800">
              STEP 1: Intake Appointment
            </h4>

            <ul className="list-disc pl-6 text-sm md:text-base text-gray-700 mt-2 space-y-1">
              <li>
                <span className="font-semibold">Duration:</span> 60 minutes
              </li>
              <li>
                <span className="font-semibold">Description:</span> A
                foundational session designed to gather meaningful information
                and begin the process to create an{" "}
                <span className="font-semibold">
                  Individualized Next Steps Navigator Document
                </span>
                . This session includes:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    Comprehensive review of strengths, needs, and preferences
                  </li>
                  <li>Exploration of potential support systems</li>
                  <li>Introduction to person-centered planning principles</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* STEP 2 */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800">
              STEP 2: Review of Individualized Next Steps Navigator document
            </h4>

            <ul className="list-disc pl-6 text-sm md:text-base text-gray-700 mt-2 space-y-1">
              <li>
                <span className="font-semibold">Duration:</span> 60 minutes
              </li>
              <li>
                <span className="font-semibold">Description:</span> In this
                session, the{" "}
                <span className="font-semibold">
                  Individualized Next Steps Navigator Document
                </span>{" "}
                created by the counselor based on information gathered in the
                intake appointment will be reviewed and updated.
              </li>
            </ul>
          </div>

          {/* NOTE */}
          <p className="text-sm md:text-base text-gray-700 mb-6">
            All sessions are collaborative, respectful, and tailored to the
            individual’s voice and choices.
          </p>

          {/* COST */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Cost</h4>

            <ul className="list-disc pl-6 text-sm md:text-base text-gray-700 space-y-1">
              <li>
                <span className="font-semibold">
                  $120 ( for intake + Individualized Next Steps Navigator
                  Document)
                </span>
              </li>
              <li>
                Additional sessions available as needed, at{" "}
                <span className="font-semibold">$30</span> for 45 minutes each.
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* CTA BUTTON
      <div className="px-4 md:px-10 py-6">
        <div className="max-w-6xl mx-auto">
          <button className="w-full bg-[#e16a5b] text-white py-3 rounded text-sm md:text-base font-semibold hover:bg-[#cf5b4c] transition">
            Register for Academic & Vocational Counseling →
          </button>
        </div>
      </div> */}
      <Footer />
    </div>
  );
}
