// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useState } from "react";

// const accomplishment_reports = [
//   "https://inclusiveworld.org/wp-content/uploads/2025/01/Inclusive-World-Impact-Report-2024-pdf.jpg",
//   "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-Report-2022.png",
//   "https://inclusiveworld.org/wp-content/uploads/2022/01/Bigger_2021_Annual_Report.png",
//   "https://inclusiveworld.org/wp-content/uploads/2021/01/ANNUAL-REPORT_2020_final.jpg",
//   "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-report_2023-1.png",
//   "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-Report-2022.png",
//   "https://inclusiveworld.org/wp-content/uploads/2022/01/Bigger_2021_Annual_Report.png",
//   "https://inclusiveworld.org/wp-content/uploads/2021/01/ANNUAL-REPORT_2020_final.jpg",
// ];

// function Accomplishments() {
//   const [selectedReport, setSelectedReport] = useState(null);

//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />

//       <section className="py-10 mt-10 md:py-10 bg-[#ffefeb]">
//         <div className="max-w-4xl md:max-w-5xl mx-auto px-6 text-center">
//           {/* Title */}
//           <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
//             Our Accomplishments
//           </h2>

//           {/* Underline */}
//           <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>
//         </div>
//       </section>

//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
//             {accomplishment_reports.map((img, index) => (
//               <div
//                 key={index}
//                 className="group flex justify-center cursor-pointer"
//                 onClick={() => setSelectedReport(img)}
//               >
//                 <img
//                   src={img}
//                   alt={`Report ${index}`}
//                   className="w-full max-w-[340px] rounded-xl shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-xl"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {selectedReport && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
//           onClick={() => setSelectedReport(null)}
//         >
//           <div
//             className="relative max-w-6xl max-h-[90vh] overflow-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={selectedReport}
//               className="rounded-xl shadow-2xl"
//               alt="Report"
//             />

//             <button
//               className="absolute top-4 right-4 text-white text-3xl hover:scale-110 transition"
//               onClick={() => setSelectedReport(null)}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }

// export default Accomplishments;

import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useState } from "react";

const accomplishment_reports = [
  // "https://inclusiveworld.org/wp-content/uploads/2025/01/Inclusive-World-Impact-Report-2024-pdf.jpg",
  // "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-Report-2022.png",
  // "https://inclusiveworld.org/wp-content/uploads/2022/01/Bigger_2021_Annual_Report.png",
  // "https://inclusiveworld.org/wp-content/uploads/2021/01/ANNUAL-REPORT_2020_final.jpg",
  "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-report_2023-1.png",
  "https://inclusiveworld.org/wp-content/uploads/2023/12/Inclusive-World-Annual-Report-2022.png",
  "https://inclusiveworld.org/wp-content/uploads/2022/01/Bigger_2021_Annual_Report.png",
  "https://inclusiveworld.org/wp-content/uploads/2021/01/ANNUAL-REPORT_2020_final.jpg",
];

function Accomplishments() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 🔹 HEADER */}
      <section className="py-8 sm:py-10 mt-6 sm:mt-10 bg-[#ffefeb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e0705d]">
            Our Accomplishments
          </h2>

          <div className="w-16 sm:w-24 h-1 bg-[#e0705d] mx-auto mt-3 sm:mt-4"></div>
        </div>
      </section>

      {/* 🔹 GRID */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {accomplishment_reports.map((img, index) => (
              <div
                key={index}
                className="group flex justify-center cursor-pointer"
                onClick={() => setSelectedReport(img)}
              >
                <img
                  src={img}
                  alt={`Report ${index}`}
                  className="w-full max-w-[400px] sm:max-w-[420px] md:max-w-full rounded-xl shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 MODAL */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedReport}
              alt="Report"
              className="w-full h-auto rounded-xl shadow-2xl"
            />

            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl hover:scale-110 transition"
              onClick={() => setSelectedReport(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Accomplishments;
