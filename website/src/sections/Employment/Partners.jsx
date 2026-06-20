import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Common/Navbar";
import Footer from "../../components/Common/Footer";

export default function EmploymentPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("category", "esp"); // 👈 FILTER HERE

    if (error) {
      console.error("Error fetching partners:", error);
    } else {
      setPartners(data);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="text-center py-10 px-6 bg-[#e8d6d2]">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#e0705d]">
          Employment Services Partners
        </h2>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-gray-500">No partners found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {partner.partner_img_url && (
                  <img
                    src={partner.partner_img_url}
                    alt={partner.caption}
                    className="w-full h-32 object-contain mb-4"
                  />
                )}

                {partner.caption && (
                  <p className="text-sm text-center text-gray-600 mt-2">
                    {partner.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
