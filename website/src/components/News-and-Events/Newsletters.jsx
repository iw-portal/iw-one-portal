import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const Newsletters = () => {
  const [grouped, setGrouped] = useState({});
  const [email, setEmail] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    }, {});

    setGrouped(groupedData);
  };

  const handleSubscribe = async () => {
    if (!valid) return;

    const formData = new FormData();

    formData.append("EMAIL", email);

    await fetch(
      "https://inclusiveworld.us13.list-manage.com/subscribe/post?u=32de3663325ad99eabf3dd1d7&id=5d21e9a2d9",
      {
        method: "POST",
        mode: "no-cors",
        body: formData,
      },
    );

    setEmail("");

    setShowThankYou(true);

    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* HEADER */}
      <div className="bg-[#f3d9d4] py-12 text-center px-4">
        <h1 className="text-2xl font-semibold text-[#d45a5a]">Newsletters</h1>

        <div className="w-16 h-[2px] bg-[#d45a5a] mx-auto mt-2 mb-4"></div>

        <p className="text-lg text-gray-600 mb-4">
          Please sign up for our newsletter to receive latest news, updates and
          event information:
        </p>

        {/* SUBSCRIBE */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
      flex-1
      px-4
      py-3
      border
      border-gray-300
      rounded-xl
      outline-none
      focus:border-[#d45a5a]
      bg-white
    "
          />

          <button
            disabled={!valid}
            onClick={handleSubscribe}
            className={`
      px-6
      py-3
      rounded-xl
      text-white
      font-medium
      transition
      ${
        valid
          ? "bg-[#d45a5a] hover:bg-[#bf4f4f]"
          : "bg-gray-400 cursor-not-allowed"
      }
    `}
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* NEWSLETTER LIST */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-10">
        {Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => (
            <div key={year}>
              {/* YEAR TITLE */}
              <h2 className="text-[#d45a5a] font-semibold mb-2">
                {year} Newsletters
              </h2>

              <div className="h-[1px] bg-gray-300 mb-3"></div>

              {/* LINKS */}
              <ul className="space-y-2">
                {grouped[year].map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.link_to_newsletter}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#d45a5a] hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
      {showThankYou && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="
        bg-white
        border
        shadow-2xl
        rounded-2xl
        px-6
        py-5
        w-[340px]
        animate-fadeIn
      "
          >
            <div className="flex items-start gap-4">
              <div className="text-green-500 text-3xl">✓</div>

              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Successfully Subscribed!
                </h3>

                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Thank you for subscribing to the InclusiveWorld newsletter.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Newsletters;
