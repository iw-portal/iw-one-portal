import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // adjust path
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";

const Supporters = () => {
  const [supporters, setSupporters] = useState([]);

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    const { data, error } = await supabase
      .from("supporters")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching supporters:", error);
    } else {
      setSupporters(data);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* HERO */}
      <div className="w-full flex justify-center bg-white pt-6">
        <img
          src="/supporters.png" // replace
          alt="Supporters"
          className="w-[85%] max-w-5xl object-contain"
        />
      </div>

      {/* HEADER */}
      <div className="bg-[#f3d9d4] py-12 text-center mt-6 px-4">
        <h1 className="text-lg md:text-xl font-semibold text-[#d45a5a]">
          Supporters
        </h1>

        <div className="w-16 h-[2px] bg-[#d45a5a] mx-auto mt-2 mb-4"></div>

        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          We are deeply grateful to the extended network of our supporters who
          believe in our mission, work tirelessly as enablers, give us
          opportunities to run our programs, showcase our impact, promote our
          handcrafted products, and provide us financial support directly or
          indirectly through partnerships.
        </p>
      </div>

      {/* SUPPORTERS GRID */}
      <div className="text-center py-12 px-6">
        <h2 className="text-[#d45a5a] font-semibold mb-8">Our Supporters</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center">
          {supporters.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <img
                src={item.partner_img_url}
                alt="supporter"
                className="h-16 object-contain"
              />

              {item.caption && (
                <p className="text-xs text-gray-600 text-center max-w-[140px]">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BE A SUPPORTER SECTION */}
      <div className="flex justify-center pb-16 px-4">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LEFT CARD */}
          <div className="bg-gray-200 p-6 rounded-md flex items-start gap-4 w-full md:w-[60%]">
            {/* ICON */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-lg">
              ★
            </div>

            {/* TEXT */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Be a Supporter
              </h3>

              <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                <li>Partner with us to further our mission</li>
                <li>Be an Inclusive World Ambassador</li>
                <li>Be a sponsor, donor, patron, and more</li>
              </ul>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Link
              to="/about/contact"
              className="bg-[#d45a5a] text-white px-6 py-2 rounded-md text-sm hover:bg-[#c14d4d] transition"
            >
              Questions? Please Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Supporters;
