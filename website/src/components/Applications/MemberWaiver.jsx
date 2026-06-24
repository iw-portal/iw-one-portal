import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FaCheck } from "react-icons/fa";
import { HiCheckCircle } from "react-icons/hi2";

const MemberWaiver = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);
  const [signature, setSignature] = useState("");

  const [loadingCycle, setLoadingCycle] = useState(true);

  const [cycles, setCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);

  // =====================================================
  // FETCH OPEN MEMBER REGISTRATION CYCLES
  // =====================================================

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    const today = new Date().toISOString().split("T")[0];
    const appEnv = import.meta.env.VITE_APP_ENV || "production";

    const { data, error } = await supabase
      .from("registration_settings")
      .select("*")
      .eq("type", "member")
      .eq("is_open", true)
      .lte("start_date", today)
      .gte("end_date", today)
      .eq("environment", appEnv)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCycles(data);

      if (data.length > 0) {
        setSelectedCycle(data[0]);
      }
    }

    setLoadingCycle(false);
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const valid = checked && signature.trim().length >= 3 && selectedCycle;

  const handleContinue = () => {
    if (!valid) return;

    onAccept({
      signature,
      cycle: selectedCycle,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingCycle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="bg-white p-10 rounded-3xl shadow border text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#0f5b54] rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-xl font-semibold text-gray-800">
            Loading Registration
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // CLOSED
  // =====================================================

  // if (cycles.length === 0) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] px-4">
  //       <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border p-10 text-center">
  //         <div className="w-24 h-24 rounded-full bg-[#eef8f7] flex items-center justify-center mx-auto mb-6">
  //           <span className="text-4xl">📭</span>
  //         </div>

  //         <h1 className="text-3xl font-bold text-gray-800 mb-4">
  //           Member Applications Closed
  //         </h1>

  //         <p className="text-gray-500 leading-relaxed">
  //           Thank you for your interest in Inclusive World. Member applications
  //           are currently closed.
  //         </p>

  //         <a
  //           href="/"
  //           className="
  //             inline-block
  //             mt-8
  //             bg-[#0f5b54]
  //             hover:bg-[#0c4a45]
  //             text-white
  //             px-8
  //             py-3
  //             rounded-2xl
  //             transition
  //           "
  //         >
  //           Back to Home
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  if (cycles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-teal-50 px-4">
        <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl border border-teal-100 overflow-hidden">
          <div className="px-8 pt-10 text-center">
            <img
              src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1782008560/iw-logo-final_urkutm.png"
              alt="Inclusive World"
              className="h-24 w-auto mx-auto mb-6"
            />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border border-teal-100 mb-6">
              <HiCheckCircle className="text-4xl text-teal-700" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Academic Year 2026–2027
              <br /> Coming Soon
            </h1>

            <div className="mx-auto h-1 w-12 rounded-full bg-teal-700 mb-6" />

            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              Registration for the upcoming academic year is not yet available.
              Program offerings, schedules, and enrollment information will be
              announced soon.
            </p>
          </div>

          <div className="mt-8 bg-teal-50 border-t border-teal-100 px-8 py-6 text-center">
            <p className="text-sm text-teal-800 mb-4">
              Please check back soon for updates regarding Academic Year
              2026–2027 registration.
            </p>

            <a
              href="/"
              className="
              inline-flex
              items-center
              justify-center
              bg-[#0f5b54]
              hover:bg-[#0c4a45]
              text-white
              px-8
              py-3
              rounded-2xl
              font-medium
              transition
            "
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border p-10 mb-8 text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQHyxr0phs97VQ/company-logo_200_200/company-logo_200_200/0/1630383280732/inclusive_world_logo?e=2147483647&v=beta&t=PnAit-ETrX0PLVFK0oWUasqZNmjfswrJVydjOhzfE0U"
            alt="Inclusive World"
            className="w-24 h-24 mx-auto mb-5"
          />

          {/* SELECT CYCLE */}

          <div className="bg-[#f8f9fa] rounded-3xl border p-8 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Select Registration Cycle
            </h2>

            <div className="grid gap-4">
              {cycles.map((cycle) => {
                const active = selectedCycle?.id === cycle.id;

                return (
                  <button
                    key={cycle.id}
                    onClick={() => setSelectedCycle(cycle)}
                    className={`
                      text-left
                      border
                      rounded-2xl
                      p-6
                      transition
                      ${
                        active
                          ? "border-[#0f5b54] bg-[#eef8f7]"
                          : "border-gray-200 bg-white hover:border-[#0f5b54]"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {cycle.title}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Academic Year: {cycle.year}
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          {cycle.start_date} → {cycle.end_date}
                        </p>
                      </div>

                      {active && (
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-[#0f5b54]
                            flex
                            items-center
                            justify-center
                            text-white
                          "
                        >
                          <FaCheck className="text-sm" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            Member Registration Waiver
          </h1>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Please carefully review the following waiver and agreement before
            continuing with the member application.
          </p>
        </div>

        {/* WAIVER */}

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="border-b px-8 py-5 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Inclusive World Member Agreement
            </h2>
          </div>

          <div className="h-[500px] overflow-y-auto px-8 py-8">
            <div className="space-y-6 text-gray-700 leading-8 text-[17px]">
              <p>
                I understand that participation in Inclusive World programs may
                involve educational, vocational, recreational, and social
                activities.
              </p>

              <p>
                I voluntarily agree to participate and acknowledge that
                Inclusive World staff, volunteers, and affiliated organizations
                are not liable for injuries, damages, or losses that may occur
                during participation.
              </p>

              <p>
                I authorize Inclusive World to provide emergency medical
                treatment if required during participation in any program or
                event.
              </p>

              <p>
                I understand that photos, videos, or recordings may be taken
                during activities and may be used for educational, promotional,
                or organizational purposes.
              </p>

              <p>
                I agree to respect all staff, volunteers, participants, and
                organizational policies while participating in programs.
              </p>

              <p>
                I acknowledge that submission of this application does not
                guarantee acceptance into any program and that placement is
                subject to availability and review.
              </p>

              <p>
                I certify that all information provided in this application is
                accurate to the best of my knowledge.
              </p>

              <p>
                By electronically signing below, I confirm that I have read,
                understood, and agreed to all terms stated above.
              </p>
            </div>
          </div>
        </div>

        {/* SIGNATURE */}

        <div className="mt-8 bg-white rounded-3xl shadow-sm border p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Electronic Signature
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Legal Name
              </label>

              <input
                type="text"
                placeholder="Type your full legal name"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-300
                  bg-gray-50
                  px-5
                  py-4
                  text-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0f5b54]
                "
              />
            </div>

            <label
              className="
                flex
                items-start
                gap-4
                p-5
                rounded-2xl
                border
                bg-gray-50
                cursor-pointer
              "
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="mt-1 w-5 h-5"
              />

              <div>
                <p className="font-medium text-gray-800">
                  I agree to the Member Registration Waiver
                </p>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  By checking this box, you acknowledge that your electronic
                  signature is legally binding.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* FOOTER */}

        <div className="sticky bottom-6 mt-8">
          <div className="bg-white border shadow-xl rounded-3xl px-8 py-5 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Ready to Continue?
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Complete the waiver to continue to the application.
              </p>
            </div>

            <button
              disabled={!valid}
              onClick={handleContinue}
              className={`
                px-8
                py-4
                rounded-2xl
                text-white
                font-medium
                transition
                ${
                  valid
                    ? "bg-[#0f5b54] hover:bg-[#0c4a45]"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              Continue Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberWaiver;
