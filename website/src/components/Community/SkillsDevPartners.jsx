// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { supabase } from "../lib/supabase";
// import dev_partners from "/partners.png";

// const categoryMap = {
//   sdsp: "Skills Development Services Partners",
//   esp: "Employment Services Partners",
//   cop: "Community Outreach Partners",
//   pcsp: "Person Centered Services Partners",
//   cp: "Consulting Partners",
//   smp: "Social Media Partners",
// };

// const SkillsDevPartners = () => {
//   const [grouped, setGrouped] = useState({});

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   const fetchPartners = async () => {
//     const { data, error } = await supabase
//       .from("partners")
//       .select("*")
//       .order("id", { ascending: true });

//     if (error) {
//       console.error("Error fetching partners:", error);
//       return;
//     }

//     // 🔥 Group by category
//     const groupedData = data.reduce((acc, item) => {
//       const key = item.category || "other";

//       if (!acc[key]) acc[key] = [];
//       acc[key].push(item);

//       return acc;
//     }, {});

//     setGrouped(groupedData);
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />

//       {/* Hero Image */}
//       <div className="px-6 md:px-16 py-6 md:py-10">
//         <img
//           src={dev_partners}
//           alt="Skills Dev Partners"
//           className="w-full max-w-6xl mx-auto"
//         />
//       </div>

//       {/* Intro Section */}
//       <section className="py-10 bg-[#ffefeb] mb-8">
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
//             Partners
//           </h2>

//           <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>

//           <div className="py-6 text-lg md:text-xl text-gray-700 leading-relaxed">
//             <p>
//               Our program models thrive through the continuous support of
//               like-minded organizations and compassionate individuals in our
//               growing community. Our partners collaborate with us on
//               person-centered services, skill development programs, and
//               employment opportunities — and many also champion our mission to
//               create an inclusive and productive world for people with different
//               abilities.
//             </p>

//             <br />

//             <p>
//               <span className="font-bold">
//                 Join us by choosing one of our partner paths
//               </span>{" "}
//               – Person-Centered Services, Consulting, Employment, or Community
//               Outreach — and write to us at{" "}
//               <a
//                 className="text-red-600 font-bold"
//                 href="mailto:info@inclusiveworld.org"
//               >
//                 info@inclusiveworld.org
//               </a>
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* 🔥 Dynamic Partner Sections */}
//       {Object.entries(grouped).map(([category, items], index) => (
//         <section
//           key={category}
//           className={`py-12 md:py-16 ${
//             index % 2 === 0 ? "bg-white" : "bg-[#ffefeb]"
//           }`}
//         >
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
//             {/* Title */}
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#e0705d]">
//               {categoryMap[category] || category}
//             </h2>

//             {/* Underline */}
//             <div className="w-16 sm:w-20 h-1 bg-[#e0705d] mx-auto mt-4"></div>

//             {/* 🔥 CONDITION */}
//             {items.length === 0 || items.every((p) => !p.partner_img_url) ? (
//               <div className="mt-16 flex justify-center items-center">
//                 <h1 className="text-2xl md:text-3xl font-bold text-[#e0705d]">
//                   Coming Soon
//                 </h1>
//               </div>
//             ) : (
//               <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
//                 {items.map((partner) => (
//                   <div
//                     key={partner.id}
//                     className="flex flex-col items-center text-center"
//                   >
//                     <img
//                       src={partner.partner_img_url}
//                       alt={partner.caption}
//                       className="h-20 sm:h-24 object-contain"
//                     />

//                     <p className="mt-4 text-sm sm:text-base text-gray-700 max-w-xs">
//                       {partner.caption}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       ))}

//       <Footer />
//     </div>
//   );
// };

// export default SkillsDevPartners;

import { useEffect, useState } from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { supabase } from "../../lib/supabase";
import dev_partners from "/partners.png";

const categoryMap = {
  sdsp: "Skills Development Services Partners",
  esp: "Employment Services Partners",
  cop: "Community Outreach Partners",
  pcsp: "Person Centered Services Partners",
  cp: "Consulting Partners",
  smp: "Social Media Partners",
};

const SkillsDevPartners = () => {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      return;
    }

    const groupedData = data.reduce((acc, item) => {
      const key = item.category || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    setGrouped(groupedData);
    console.log(groupedData);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="px-6 md:px-16 py-6 md:py-10">
        <img
          src={dev_partners}
          alt="Partners"
          className="w-full max-w-6xl mx-auto"
        />
      </div>

      {/* INTRO */}
      <section className="py-10 bg-[#ffefeb] mb-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
            Partners
          </h2>

          <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>

          <div className="py-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>
              Our program models thrive through the continuous support of
              like-minded organizations and compassionate individuals in our
              growing community.
            </p>

            <p className="mt-4">
              <span className="font-bold">
                Join us by choosing one of our partner paths
              </span>{" "}
              – Person-Centered Services, Consulting, Employment, or Community
              Outreach — and write to us at{" "}
              <a
                className="text-red-600 font-bold"
                href="mailto:info@inclusiveworld.org"
              >
                info@inclusiveworld.org
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 SECTIONS */}
      {Object.entries(grouped).map(([category, items], index) => (
        <section
          key={category}
          className={`py-12 md:py-16 ${
            index % 2 === 0 ? "bg-white" : "bg-[#ffefeb]"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* TITLE */}
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#e0705d]">
                {categoryMap[category] || category}
              </h2>
              <div className="w-16 h-1 bg-[#e0705d] mx-auto mt-3"></div>
            </div>

            {/* EMPTY STATE */}
            {items.length === 0 || items.every((p) => !p.partner_img_url) ? (
              <div className="text-center text-xl font-semibold text-[#e0705d]">
                Coming Soon
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((partner) => (
                  <div
                    key={partner.id}
                    className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
                  >
                    {/* IMAGE */}
                    {partner.partner_img_url && (
                      <img
                        src={partner.partner_img_url}
                        alt={partner.caption}
                        className="h-20 object-contain mb-4"
                      />
                    )}

                    {/* TITLE / NAME */}
                    <h3 className="text-md font-semibold text-gray-800">
                      {partner.name || partner.caption}
                    </h3>

                    {/* DESCRIPTION */}
                    {partner.caption && (
                      <p className="text-sm text-gray-600 mt-2">
                        {partner.caption}
                      </p>
                    )}

                    {/* OPTIONAL LINK */}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-[#e16a5b] text-sm font-medium hover:underline"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
};

export default SkillsDevPartners;
