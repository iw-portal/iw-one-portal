import React from "react";
import pct from "/person-centered_thinking.png";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const PersonCenteredThinking = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* HERO IMAGE */}
      <div className="w-full flex justify-center bg-white pt-6">
        <img
          src={pct}
          alt="Hero"
          className="w-[85%] max-w-6xl rounded-md object-cover"
        />
      </div>

      {/* HEADER SECTION */}
      <div className="bg-[#f3d9d4] py-10 text-center mt-6">
        <h1 className="text-xl md:text-2xl font-semibold text-[#d45a5a]">
          Person Centered Thinking
        </h1>

        <div className="w-16 h-[2px] bg-[#d45a5a] mx-auto mt-2 mb-4"></div>

        <p className="text-gray-600 text-sm max-w-3xl mx-auto px-4">
          Inclusive World is rooted in Person Centered Practices encompassing
          person centered thinking, planning and tools to enable persons to lead
          self-directed, empowered lives.
        </p>
      </div>

      {/* DIAGRAM SECTION (TWO IMAGES) */}
      <div className="flex justify-center py-16 px-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT IMAGE */}
          <div className="flex justify-center lg:justify-start w-full lg:w-1/2">
            <img
              src="https://inclusiveworld.org/wp-content/uploads/2021/01/PersonCenteredThinking1.png" // <-- replace
              alt="Person Centered Planning"
              className="w-full max-w-xl object-contain"
            />
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
            <img
              src="https://inclusiveworld.org/wp-content/uploads/2021/01/PersonCenteredThinking2.png" // <-- replace
              alt="Person Centered Outcomes"
              className="w-full max-w-xl object-contain"
            />
          </div>
        </div>
      </div>

      {/* BALANCE SECTION */}
      <div className="text-center py-10">
        <h2 className="text-gray-600 text-3xl font-bold mb-6">Balance...</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6">
          {/* LEFT TEXT */}
          <div className="text-left max-w-xs text-sm text-gray-700">
            <h3 className="font-semibold mb-2">
              What's important TO a person ..
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>what makes them happy, fulfilled and satisfied</li>
            </ul>
          </div>

          {/* CENTER IMAGE */}
          <img
            src="https://inclusiveworld.org/wp-content/uploads/2020/09/stones.jpg" // <-- replace
            alt="Balance"
            className="w-72 h-72 object-cover rounded-md shadow"
          />

          {/* RIGHT TEXT */}
          <div className="text-left max-w-xs text-sm text-gray-700">
            <h3 className="font-semibold mb-2">
              What's important FOR a person
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Health & safety</li>
              <li>Being a valued member of the community</li>
            </ul>
          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div className="flex justify-center pb-16 px-4">
        <div className="bg-gray-200 text-gray-600 text-sm max-w-2xl p-6 rounded-md text-center italic">
          “Thanks a lot for helping Madhav in believing himself and being part
          of buddy program. Madhav really likes Tushar. He is very happy and he
          is able to progress his passion of being a video game editor and
          critic. Thanks Tushar for all the help. Madhav really appreciates it.
          Madhav never had a friend in life. He is very happy with the buddy
          program. Finally, he started believing himself that he is capable.”
          <div className="mt-4 font-medium not-italic text-gray-700">
            Srivastava, a parent
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PersonCenteredThinking;
