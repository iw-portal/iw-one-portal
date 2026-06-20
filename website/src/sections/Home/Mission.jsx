// import { MISSION, HOW_WE_GO_ABOUT_IT } from "../../constants";

// const Mission = () => {
//   return (
//     // <section className="py-20">
//     //   <div className="max-w-[2400px] mx-auto px-6">
//     //     {/* Our Mission */}
//     //     <div className="mb-12">
//     //       <h2 className="text-5xl font-semibold text-[#e0705d]">Our Mission</h2>

//     //       <div className="w-24 h-1 bg-[#e0705d] mt-3 mb-6"></div>

//     //       <p className="text-gray-700 leading-relaxed text-4xl">{MISSION}</p>
//     //     </div>

//     //     {/* How we go about it */}
//     //     <div>
//     //       <h2 className="text-5xl font-semibold pt-10 text-[#e0705d]">
//     //         How we go about it
//     //       </h2>

//     //       <div className="w-24 h-1 bg-[#e0705d] mt-3 mb-6"></div>

//     //       <p className="text-gray-700 leading-relaxed text-4xl">
//     //         {HOW_WE_GO_ABOUT_IT}
//     //       </p>

//     //       {/* bottom accent line */}
//     //       <div className="w-24 h-1 bg-[#e0705d] mt-10"></div>
//     //     </div>
//     //   </div>
//     // </section>
//     <section className="py-10 md:py-16 lg:py-20">
//       <div className="max-w-6xl mx-auto px-6">
//         <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#e0705d]">
//           Our Mission
//         </h2>

//         <div className="w-16 h-1 bg-[#e0705d] mt-3 mb-4"></div>

//         <p className="text-gray-700 text-base md:text-lg leading-relaxed">
//           {MISSION}
//         </p>

//         <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#e0705d] mt-12">
//           How we go about it
//         </h2>

//         <div className="w-16 h-1 bg-[#e0705d] mt-3 mb-4"></div>

//         <p className="text-gray-700 text-base md:text-lg leading-relaxed">
//           {HOW_WE_GO_ABOUT_IT}
//         </p>
//       </div>
//     </section>
//   );
// };

// export default Mission;

import { MISSION, HOW_WE_GO_ABOUT_IT } from "../../constants";

const Mission = () => {
  return (
    <section className="py-12 md:py-12">
      <div className="max-w-3xl md:max-w-5xl mx-auto px-6">
        {/* Mission */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
          Our Mission
        </h2>

        <div className="w-16 h-1 bg-[#e0705d] mt-3 mb-5"></div>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          {MISSION}
        </p>

        {/* How We Go About It */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d] mt-12">
          How we go about it
        </h2>

        <div className="w-16 h-1 bg-[#e0705d] mt-3 mb-5"></div>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          {HOW_WE_GO_ABOUT_IT}
        </p>
      </div>
    </section>
  );
};

export default Mission;
