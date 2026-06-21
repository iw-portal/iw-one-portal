import Navbar from "../Common/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

import sb_hero from "/sb-hero.png";
import Footer from "../Common/Footer";

const buttons = [
  // { title: "Register for Classes", link: "#" },
  { title: "View Calendar", link: "/calendar/events" },
  { title: "Employment Services Partners", link: "/skills/partners" },
  { title: "Fall 2025-26 Weekend Schedule", link: "/skills/ay25_26_calendar" },
];

const faqData = [
  {
    question: "When are the SB@IW sessions held?",
    answer:
      "SB@IW sessions are typically held every weekend from September to May. Additional weekday project work may be available through reserved time slots.",
  },
  {
    question: "How long are the sessions?",
    answer:
      "Participants commit to at least one weekday session (1 hour) and one weekend session (approximately 90 minutes).",
  },
  {
    question: "Where are the sessions held?",
    answer:
      "All sessions are conducted at the Inclusive World Center in Milpitas, CA.",
  },
  {
    question: "What do I sign up for at SB@IW?",
    answer:
      "You can enroll in SB@IW Products, SB@IW Services, or both depending on your interests and availability.",
  },
  {
    question: "What is the nature of work I can do?",
    answer:
      "Participants can work on tasks such as product creation, packaging, marketing, inventory management, scanning services, and customer order handling.",
  },
  {
    question: "Can I do more than one program?",
    answer:
      "Yes, participants can engage in multiple programs based on their interest, availability, and readiness.",
  },
  {
    question: "Are there any prerequisites to enroll into these programs?",
    answer:
      "No prior experience is required. Participants should be willing to learn, collaborate, and engage consistently.",
  },
  {
    question: "Any other queries or questions?",
    answer: "You can reach out to us anytime at info@inclusiveworld.org.",
  },
];

export default function SmallBusiness() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO IMAGE */}
      <img
        src={sb_hero}
        alt="Small Business"
        className="w-full px-6 md:px-14 py-6 md:py-8 object-cover"
      />

      {/* TITLE */}
      <section className="text-xl bg-[#e9d6d1] text-center py-10 px-6 mx-4 md:mx-6 rounded">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
          Small Business Skills
        </h2>

        <div className="w-20 h-[2px] bg-[#e0705d] mx-auto mt-3 mb-5"></div>

        <p className="text-gray-700 max-w-5xl mx-auto tex-black">
          The mission of Small Business at IW (SB@IW) is to offer inhouse
          integrated employment programs to its differently abled members to
          lead productive and meaningful lives. These programs focus on bringing
          the work inhouse into an environment that is 100% conducive for a
          neurodiverse youth to be productively engaged.
        </p>
      </section>

      {/* BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
        {buttons.map((btn, i) => (
          <Link
            key={i}
            to={btn.link}
            className="bg-[#e16a5b] text-white px-5 py-3 rounded text-sm font-semibold hover:bg-[#cf5b4c]"
          >
            {btn.title} →
          </Link>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <section className="text-xl max-w-7xl mx-auto px-6 mt-10 grid md:grid-cols-2 gap-12">
        {/* LEFT */}
        <div className="text-gray-700 leading-relaxed space-y-5">
          <p>
            The model is centered on enabling an inclusive environment where
            neurodiverse members are integrated to work alongside their
            neurotypical peers.
          </p>

          <p>
            SB@IW ventures offer both products under SB@IW Products and services
            under SB@IW Services.
          </p>

          <p>
            The SB Skills classes happen every weekend from Sep–May. Members can
            also work on weekday projects through reserved time slots at the
            Inclusive World center.
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-[#e0705d] font-semibold text-lg mb-4">FAQ</h3>

          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <div key={index} className="border rounded bg-white">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium"
                >
                  {faq.question}

                  <span className="bg-[#b24a60] text-white w-5 h-5 flex items-center justify-center text-xs rounded">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            SB@IW Products
          </h3>

          <p className="text-xl text-gray-700 mb-4">
            Members learn all aspects of running a small business from sourcing
            materials to selling finished products.
          </p>

          <ul className="list-disc pl-6 text-xl space-y-2 text-gray-700">
            <li>Marketing</li>
            <li>Customer Order Management</li>
            <li>Sourcing raw materials</li>
            <li>Making products</li>
            <li>Quality Assurance</li>
            <li>Packaging & Labeling</li>
            <li>Shipping</li>
            <li>Inventory Management</li>
          </ul>

          <a
            href="https://forms.gle/8Z8jTcsXD16wMmgo9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-[#e16a5b] text-white px-5 py-2 text-xl rounded hover:bg-[#cf5b4c]"
          >
            Order Now
          </a>
        </div>

        <img
          src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1782006801/Screenshot_2026-06-20_at_6.53.18_PM_oxteso.png"
          alt="Products"
          className="rounded shadow"
        />
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            SB@IW Services
          </h3>

          <p className="text-xl text-gray-700 mb-4">
            SB@IW Services offers scanning and digital preservation services for
            photos and documents.
          </p>

          <ul className="list-disc pl-6 text-xl space-y-2 text-gray-700">
            <li>Marketing</li>
            <li>Customer Order Management</li>
            <li>Scanning & Labeling</li>
            <li>Bin Management</li>
            <li>Online Folder Management</li>
            <li>Quality Assurance</li>
            <li>Shipping & Packing</li>
          </ul>

          <Link
            to="/programs/small-business-skills/photoscan"
            replace
            className="inline-block mt-6 bg-[#e16a5b] text-white px-5 py-2 text-xl rounded hover:bg-[#cf5b4c]"
          >
            Scan Photos
          </Link>
          {/* <a
            href="https://inclusiveworld.org/photoscan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-[#e16a5b] text-white px-5 py-2 text-xl rounded hover:bg-[#cf5b4c]"
          >
            Scan Photos
          </a> */}
        </div>

        <img
          src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1782006733/Screenshot_2026-06-20_at_6.52.09_PM_tsjtwa.png"
          alt="Services"
          className="rounded shadow"
        />
      </section>

      <div className="h-16" />
      <Footer />
    </div>
  );
}
