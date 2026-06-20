// import { useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const ContactUs = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Submitting contact form");

//     if (!name || !email || !subject || !message) {
//       console.error("Missing fields");
//       alert("Please fill all fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("Sending request to Supabase Edge Function");

//       const response = await fetch(
//         "https://rbjjmgsfinuaktsuvnsu.supabase.co/functions/v1/send-contact-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
//             Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             subject,
//             message,
//           }),
//         },
//       );

//       console.log("Response received:", response);

//       const data = await response.json();

//       console.log("Edge function response:", data);

//       if (!response.ok) {
//         console.error("Edge function error:", data);
//         alert("Something went wrong. Please try again.");
//         return;
//       }

//       console.log("Email successfully sent");

//       alert(
//         "Thank you for contacting Inclusive World. We will get back to you soon.",
//       );

//       setName("");
//       setEmail("");
//       setSubject("");
//       setMessage("");
//     } catch (error) {
//       console.error("Network or function error:", error);
//       alert("Error sending message.");
//     }

//     setLoading(false);
//   };

//   return (
//     <>
//       <div className="bg-white min-h-screen">
//         <Navbar />

//         {/* Header */}
//         <section className="py-10 bg-[#ffefeb]">
//           <div className="max-w-5xl mx-auto px-6 text-center">
//             <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
//               Contact Us
//             </h2>

//             <div className="w-24 h-1 bg-[#e0705d] mx-auto mt-4"></div>
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section className="py-16 bg-white">
//           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
//             {/* LEFT SIDE */}
//             <div className="space-y-6 text-gray-700">
//               <p>
//                 Inclusive World is a 501(c)(3) non-profit organization whose
//                 mission is to develop the skills and abilities of
//                 differently-abled individuals based on their interests and goals
//                 for the future.
//               </p>

//               <p>
//                 Thank you for your interest. You can email us or use the contact
//                 form to reach us.
//               </p>

//               <p>
//                 <strong>Inclusive World Center</strong> is located at 106 S Park
//                 Victoria Dr, Milpitas, CA 95035
//               </p>
//               <div className="space-y-3 mt-6">
//                 <div className="flex justify-between border-b pb-2">
//                   <span>General Inquiries</span>
//                   <a className="text-[#e0705d]">info@inclusiveworld.org</a>
//                 </div>

//                 <div className="flex justify-between border-b pb-2">
//                   <span>Donations</span>
//                   <a className="text-[#e0705d]">donate@inclusiveworld.org</a>
//                 </div>

//                 <div className="flex justify-between border-b pb-2">
//                   <span>Arts & Crafts Small Business related queries</span>
//                   <a className="text-[#e0705d]">sales@inclusiveworld.org</a>
//                 </div>

//                 <div className="flex justify-between border-b pb-2">
//                   <span>Enrollment Inquiries</span>
//                   <a className="text-[#e0705d]">enroll@inclusiveworld.org</a>
//                 </div>

//                 <div className="flex justify-between border-b pb-2">
//                   <span>Volunteer Inquiries</span>
//                   <a className="text-[#e0705d]">volunteer@inclusiveworld.org</a>
//                 </div>
//               </div>
//             </div>

//             {/* FORM */}
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               <h3 className="text-2xl font-semibold">Contact Us</h3>

//               {/* Name */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium">
//                   Your Name
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium">
//                   Your Email
//                 </label>

//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
//                 />
//               </div>

//               {/* Subject */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium">
//                   Subject
//                 </label>

//                 <select
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
//                 >
//                   <option value="">Please choose an option</option>
//                   <option value="general">General Inquiries</option>
//                   <option value="donations">Donations</option>
//                   <option value="sales">
//                     Arts & Crafts Small Business Queries
//                   </option>
//                   <option value="yoga">Yoga Therapy Clinic</option>
//                   <option value="work">Work Exchange</option>
//                   <option value="enroll">Enrollment Inquiries</option>
//                   <option value="volunteer">Volunteer Inquiries</option>
//                 </select>
//               </div>

//               {/* Message */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium">
//                   Message
//                 </label>

//                 <textarea
//                   rows="5"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
//                 />
//               </div>

//               {/* Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-[#e0705d] text-white px-6 py-3 rounded-lg hover:bg-[#c95f4c] transition"
//               >
//                 {loading ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>
//         </section>

//         <Footer />
//       </div>
//     </>
//   );
// };

// export default ContactUs;

import { useState } from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://rbjjmgsfinuaktsuvnsu.supabase.co/functions/v1/send-contact-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name, email, subject, message }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        return;
      }

      alert(
        "Thank you for contacting Inclusive World. We will get back to you soon.",
      );

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      alert("Error sending message.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 🔹 HEADER */}
      <section className="py-8 sm:py-10 bg-[#ffefeb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e0705d]">
            Contact Us
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-[#e0705d] mx-auto mt-3 sm:mt-4"></div>
        </div>
      </section>

      {/* 🔹 MAIN */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
          {/* 🔸 LEFT SIDE */}
          <div className="space-y-5 text-gray-700 text-sm sm:text-base">
            <p>
              Inclusive World is a 501(c)(3) non-profit organization whose
              mission is to develop the skills and abilities of
              differently-abled individuals based on their interests and goals
              for the future.
            </p>

            <p>
              Thank you for your interest. You can email us or use the contact
              form to reach us.
            </p>

            <p>
              <strong>Inclusive World Center</strong> is located at 106 S Park
              Victoria Dr, Milpitas, CA 95035
            </p>

            {/* Contact list */}
            <div className="space-y-3 mt-6">
              {[
                ["General Inquiries", "info@inclusiveworld.org"],
                ["Donations", "donate@inclusiveworld.org"],
                ["Arts & Crafts Queries", "sales@inclusiveworld.org"],
                ["Enrollment", "enroll@inclusiveworld.org"],
                ["Volunteer", "volunteer@inclusiveworld.org"],
              ].map(([label, email], i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 border-b pb-2"
                >
                  <span>{label}</span>
                  <a className="text-[#e0705d] break-all">{email}</a>
                </div>
              ))}
            </div>
          </div>

          {/* 🔸 FORM */}
          <form
            className="space-y-5 sm:space-y-6 w-full max-w-xl mx-auto md:mx-0"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl sm:text-2xl font-semibold">Contact Us</h3>

            {/* Name */}
            <div>
              <label className="block mb-1 sm:mb-2 text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 sm:mb-2 text-sm font-medium">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-1 sm:mb-2 text-sm font-medium">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
              >
                <option value="">Please choose an option</option>
                <option value="general">General Inquiries</option>
                <option value="donations">Donations</option>
                <option value="sales">Arts & Crafts Queries</option>
                <option value="yoga">Yoga Therapy Clinic</option>
                <option value="work">Work Exchange</option>
                <option value="enroll">Enrollment</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-1 sm:mb-2 text-sm font-medium">
                Message
              </label>
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#e0705d]"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#e0705d] text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#c95f4c] transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
