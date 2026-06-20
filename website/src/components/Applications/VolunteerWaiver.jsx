import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FaCheck } from "react-icons/fa";
import { PiMailboxFill } from "react-icons/pi";

const VolunteerWaiver = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);
  const [signature, setSignature] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [waiverData, setWaiverData] = useState({
    signature: "",
    cycle: null,
  });

  const [loadingCycle, setLoadingCycle] = useState(true);
  // const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);

  // =====================================================
  // CHECK REGISTRATION STATUS
  // =====================================================

  useEffect(() => {
    checkVolunteerRegistration();
  }, []);

  // const checkVolunteerRegistration = async () => {
  //   const today = new Date().toISOString().split("T")[0];

  //   const { data, error } = await supabase
  //     .from("registration_settings")
  //     .select("*")
  //     .eq("type", "volunteer")
  //     .eq("is_open", true)
  //     .lte("start_date", today)
  //     .gte("end_date", today)
  //     .single();

  //   if (!error && data) {
  //     console.log("DATA:", data);
  //     setApplicationsOpen(true);
  //   } else {
  //     setApplicationsOpen(false);
  //   }

  //   setLoadingCycle(false);
  // };

  const checkVolunteerRegistration = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("registration_settings")
      .select("*")
      .eq("type", "volunteer")
      .eq("is_open", true)
      .lte("start_date", today)
      .gte("end_date", today)
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

  const valid = checked && signature.trim().length >= 3;

  // const handleContinue = () => {
  //   if (!valid) return;

  //   onAccept(signature);
  // };
  const handleContinue = () => {
    if (!valid) return;

    if (!selectedCycle) {
      alert("Please select an application cycle.");
      return;
    }

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
  // LOADING SCREEN
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
  // APPLICATIONS CLOSED
  // =====================================================

  if (cycles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border p-10 text-center">
          <div className="w-24 h-24 rounded-full bg-[#eef8f7] flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">
              <PiMailboxFill className="text-[#03571d] text-5xl" />
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Volunteer Applications Closed
          </h1>

          <p className="text-gray-500 leading-relaxed">
            Thank you for your interest in volunteering with Inclusive World.
            Volunteer applications are currently closed at this time.
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Please check back later for future application cycles.
          </p>

          <a
            href="/"
            className="
              inline-block
              mt-8
              bg-[#0f5b54]
              hover:bg-[#0c4a45]
              text-white
              px-8
              py-3
              rounded-2xl
              transition
            "
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN WAIVER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm border p-10 mb-8 text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQHyxr0phs97VQ/company-logo_200_200/company-logo_200_200/0/1630383280732/inclusive_world_logo?e=2147483647&v=beta&t=PnAit-ETrX0PLVFK0oWUasqZNmjfswrJVydjOhzfE0U"
            alt="Inclusive World"
            className="w-24 h-24 mx-auto mb-5"
          />
          {/* ===================================================== */}
          {/* SELECT CYCLE */}
          {/* ===================================================== */}

          <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
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
            Volunteer Liability Waiver
          </h1>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Please carefully read the following waiver and liability release
            agreement before continuing to the volunteer application.
          </p>
        </div>

        {/* ===================================================== */}
        {/* WAIVER CONTENT */}
        {/* ===================================================== */}

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          {/* TITLE */}

          <div className="border-b px-8 py-5 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Inclusive World Volunteer Release Agreement
            </h2>
          </div>

          {/* CONTENT */}

          <div className="h-[500px] overflow-y-auto px-8 py-8">
            <div className="space-y-6 text-gray-700 leading-8 text-[17px]">
              <p>
                In consideration of my desire to serve as a volunteer in efforts
                to be conducted by Inclusive World, I hereby assume all
                responsibility for any and all risk of property damage or bodily
                injury that I may sustain while participating in activity of any
                nature, including the use of equipment and facilities.
              </p>

              <p>
                Further, I, for myself and my heir, executors, administrators
                and assigns, hereby release, waive and discharge Inclusive World
                and its officers, directors, employees, agents and volunteers of
                and from any and all claims which I or my heirs, administrators
                and assigns ever may have against any of the above for, on
                account of, by reason of or arising in connection with such
                volunteering efforts or my participation therein, and hereby
                waive all such claims, demands and causes of action.
              </p>

              <p>
                Further, I expressly agree that this release, waiver and
                indemnity agreement is intended to be as broad and inclusive as
                permitted by the State of California, and that if any portion
                thereof is held invalid, it is agreed that the balance shall
                continue in full legal force and effect.
              </p>

              <p>
                I currently have no known mental or physical condition that
                would impair my capability for full participation as intended or
                expected of me.
              </p>

              <p>
                I will notify Inclusive World ownership or employees if I suffer
                from any medical or health condition that may cause injury to
                myself, others, or may require emergency care during my
                participation.
              </p>

              <p>
                Further, I have carefully read the foregoing release and
                indemnification and understand the contents thereof and sign
                this release as my own free act.
              </p>

              <p>
                I hereby release, waive, discharge, and covenant not to sue
                Inclusive World from any and all liability, claims, demands,
                action and causes of action whatsoever arising of or related to
                any loss, damage or injury that may be sustained by me, or to
                any property belonging to me, while participating in physical
                activity, or while on or upon the premises where the event is
                being conducted.
              </p>

              <p>
                I, the undersigned, am at least 18 years of age or I am the
                parent or guardian of a participant who is less than 18 years of
                age. I have read this Volunteer Release and Waiver of Liability
                and understand all its terms.
              </p>

              <p>
                In signing this release, I acknowledge and represent that I have
                read the foregoing Agreement, understand that I have given up
                substantial rights by signing it, and sign it voluntarily as my
                own free act and deed.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* ACCEPTANCE */}
        {/* ===================================================== */}

        <div className="mt-8 bg-white rounded-3xl shadow-sm border p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Electronic Signature
          </h3>

          <div className="space-y-6">
            {/* SIGNATURE */}

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

            {/* CHECKBOX */}

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
                  I have read and agree to the Volunteer Liability Waiver
                </p>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  By checking this box, you acknowledge that your electronic
                  signature is legally binding and that you voluntarily agree to
                  all terms stated above.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ===================================================== */}
        {/* STICKY FOOTER */}
        {/* ===================================================== */}

        <div className="sticky bottom-6 mt-8">
          <div className="bg-white border shadow-xl rounded-3xl px-8 py-5 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">
                Ready to Continue?
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                You must complete the waiver before accessing the volunteer
                application.
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

export default VolunteerWaiver;
