import React from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const PersonCenteredServices = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* HERO IMAGE */}
      <div className="w-full flex justify-center bg-white pt-6">
        <img
          src="/onepage-hero.png" // <-- replace
          alt="One Page Profile"
          className="w-[85%] max-w-5xl object-contain"
        />
      </div>

      {/* HEADER SECTION */}
      <div className="bg-[#f3d9d4] py-12 text-center mt-6 px-4">
        <h1 className="text-lg md:text-xl font-semibold text-[#d45a5a]">
          Empowering self-advocacy through the One-Page Profile
        </h1>

        <div className="w-16 h-[2px] bg-[#d45a5a] mx-auto mt-2 mb-4"></div>

        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Our One-Page Profile is a simple, powerful tool designed to put
          individuals in control of telling their own story. It captures what
          matters most to them—how they prefer to learn, work, and live—so that
          anyone supporting them fully understands the best ways to help. This
          tool is adaptable across all environments including schools, college,
          therapy, employment, and social settings.
        </p>
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="flex justify-center py-12 px-6">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 text-sm text-gray-700">
          {/* LEFT */}
          <div>
            <h2 className="text-[#d45a5a] font-semibold text-lg mb-4">
              What is a One-Page Profile?
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Personalized Snapshot:</span>{" "}
                Highlights strengths, preferences, support needs, and
                communication style.
              </li>
              <li>
                <span className="font-semibold">Portable & Practical:</span>{" "}
                Easily shared with educators, therapists, employers, and family.
              </li>
              <li>
                <span className="font-semibold">Advocacy-Focused:</span> Helps
                participants articulate their desires and support needs
                effectively.
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <h2 className="text-[#d45a5a] font-semibold text-lg mb-4">
              Why It Matters?
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Centering the Individual:</span>{" "}
                Emphasizing personal interests, dreams, and self-defined goals.
              </li>
              <li>
                <span className="font-semibold">
                  Fostering Consistency Across Roles:
                </span>{" "}
                Ensuring educators, job coaches, therapists, and others are
                aligned in their approach.
              </li>
              <li>
                <span className="font-semibold">
                  Building Confidence & Independence:
                </span>{" "}
                Enabling individuals to advocate for themselves and engage more
                meaningfully in their communities.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div className="flex justify-center px-4">
        <div className="bg-gray-200 text-gray-600 text-sm max-w-3xl p-6 rounded-md text-center italic">
          “The one-page profile initiated by Inclusive World is an excellent way
          of conveying about myself, about my strengths and weaknesses, and how
          to help me. I have been sharing it with my professors at San Jose
          State University, my supervisors during my internships at Genentech
          and at NASA and other employment organizations where I have been
          applying for employment. I recommend this to others who have similar
          needs.”
          <div className="mt-4 font-medium not-italic text-gray-700">
            Neel, a college student
          </div>
        </div>
      </div>

      {/* HOW TO GET STARTED */}
      <div className="bg-[#f3d9d4] mt-12 py-12 text-center px-6">
        <h2 className="text-[#d45a5a] font-semibold text-lg mb-6">
          How to Get Started
        </h2>
        <div className="max-w-3xl mx-auto text-sm text-gray-700 text-left">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-semibold">Register for a Profile:</span>{" "}
              Sign up through our website to begin creating a One-Page Profile.
            </li>
            <li>
              <span className="font-semibold">Collaborate in Process:</span>{" "}
              Work with mentors, educators, therapists, family, and support
              networks.
            </li>
            <li>
              <span className="font-semibold">Share and Use:</span> Utilize your
              finished profile in various settings including education,
              employment, and healthcare.
            </li>
            <li>
              <span className="font-semibold">Review & Update:</span> Regularly
              revisit and refine the profile as needs and goals evolve.
            </li>
          </ol>
        </div>
        {/* CTA BUTTON
        <div className="mt-8">
          <button className="bg-[#d45a5a] text-white px-6 py-2 rounded-md text-sm hover:bg-[#c14d4d] transition">
            Click to Register
          </button>
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default PersonCenteredServices;
