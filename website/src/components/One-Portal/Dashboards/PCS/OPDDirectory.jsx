import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const LABELS = {
  admire_about_me: "What People Admire About Me",
  important_to_me: "What Is Important To Me",
  things_i_like_to_do: "Things I Like To Do",
  things_i_want_to_learn: "Things I Want To Learn",
  what_makes_me_happy: "What Makes Me Happy",
  what_makes_me_sad: "What Makes Me Sad",
  communication_preference: "Communication Preference",
  how_to_support_me: "How To Support Me",
  vision_for_future: "My Vision For The Future",
  characteristics_i_like: "Characteristics I Like In People",
  characteristics_i_dislike: "Characteristics I Dislike In People",
  risk_factors: "Risk Factors / Notes",
};

const OPDDirectory = () => {
  const [opds, setOpds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOPD, setSelectedOPD] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOPDs();
  }, []);

  const fetchOPDs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("opd_profiles")
      .select(
        `
        id,
        person_id,
        academic_year,
        status,
        signed_by_name,
        data,
        updated_at,
        people:person_id (
          id,
          fname,
          lname,
          email,
          role,
          is_active
        )
      `,
      )
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("OPD fetch error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setOpds((data || []).filter((opd) => opd.people?.is_active !== false));
    setLoading(false);
  };

  const filteredOPDs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return opds.filter((opd) => {
      const person = opd.people;
      const fullName =
        `${person?.fname || ""} ${person?.lname || ""}`.toLowerCase();

      return (
        !term ||
        fullName.includes(term) ||
        person?.fname?.toLowerCase().includes(term) ||
        person?.lname?.toLowerCase().includes(term)
      );
    });
  }, [opds, search]);

  const getEditedData = (opd) => {
    const savedData = opd?.data || {};
    return savedData.edited || savedData;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#0f5b54]">OPD Directory</h1>
        <p className="text-gray-500 mt-1">
          Search published OPDs by first name or last name.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by first name or last name..."
        className="w-full max-w-xl border rounded-xl px-4 py-3 bg-white"
      />

      {loading ? (
        <p className="text-gray-500">Loading OPDs...</p>
      ) : filteredOPDs.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">
          No published OPDs found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOPDs.map((opd) => {
            const person = opd.people;

            return (
              <div
                key={opd.id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {person?.fname} {person?.lname}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {person?.role || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Academic Year: {opd.academic_year || "-"}
                    </p>
                  </div>

                  <span className="h-fit px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Published
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOPD(opd)}
                  className="mt-5 w-full bg-[#0f5b54] text-white py-2 rounded-xl text-sm font-medium"
                >
                  View OPD
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedOPD && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOPD(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#0f5b54]">
                  {selectedOPD.people?.fname} {selectedOPD.people?.lname}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedOPD.people?.role} · {selectedOPD.academic_year}
                </p>
              </div>

              <button
                onClick={() => setSelectedOPD(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {Object.entries(LABELS).map(([key, label]) => {
                const editedData = getEditedData(selectedOPD);

                return (
                  <div key={key} className="border rounded-2xl p-4">
                    <h3 className="font-bold text-[#0f5b54] mb-2">{label}</h3>
                    <p className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                      {editedData[key] || "-"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OPDDirectory;
