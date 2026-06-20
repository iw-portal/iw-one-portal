// import Navbar from "./Navbar";
// import HeroCarousel from "../sections/Home/HeroCarousel";
// import Mission from "../sections/Home/Mission";
// import HomeCards from "../sections/Home/HomeCards";
// import ProgramsSection from "../sections/Home/ProgramsSection";
// import MeetFamily from "../sections/Home/MeetFamily";
// import SupportMission from "../sections/Home/SupportMission";
// import Footer from "./Footer";

// const Home = () => {
//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />

//       <HeroCarousel />

//       <Mission />

//       <HomeCards />

//       <ProgramsSection />

//       <MeetFamily />

//       <SupportMission />

//       <Footer />
//     </div>
//   );
// };

// export default Home;

import Navbar from "./Navbar";
import HeroCarousel from "../../sections/Home/HeroCarousel";
import Mission from "../../sections/Home/Mission";
import HomeCards from "../../sections/Home/HomeCards";
import ProgramsSection from "../../sections/Home/ProgramsSection";
import MeetFamily from "../../sections/Home/MeetFamily";
// import SupportMission from "../../sections/Home/SupportMission";
import Footer from "./Footer";
import ScrollingText from "../../sections/Home/Scroll";

const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* <ScrollingText /> */}

      {/* HERO (no padding, full width) */}
      <HeroCarousel />

      {/* MAIN CONTENT */}
      <main className="flex flex-col">
        {/* Consistent section spacing wrapper */}
        <section className="py-1 sm:py-2 md:py-5">
          <Mission />
        </section>

        <section className="py-10 sm:py-12 md:py-16">
          <HomeCards />
        </section>

        <ProgramsSection />

        <section className="py-10 sm:py-12 md:py-16">
          <MeetFamily />
        </section>

        {/* <SupportMission /> */}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
