import Navbar from "../Common/Navbar";
import Founders from "../../sections/Team/Founders";
import Leadership from "../../sections/Team/Leadership";
import CoreTeam from "../../sections/Team/CoreTeam";
import Footer from "../Common/Footer";

const OurTeam = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="py-8 sm:py-10 mt-6 sm:mt-10 bg-[#ffefeb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e0705d]">
            Our Team
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-[#e0705d] mx-auto mt-3 sm:mt-4"></div>
        </div>
      </section>

      <Founders />

      <div className="max-w-6xl mx-auto h-[2px] bg-[#e0705d] my-10"></div>

      <Leadership />

      <div className="max-w-6xl mx-auto h-[2px] bg-[#e0705d] my-10"></div>

      <CoreTeam />

      <Footer />
    </div>
  );
};

export default OurTeam;
