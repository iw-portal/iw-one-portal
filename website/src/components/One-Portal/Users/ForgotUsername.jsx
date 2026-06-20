import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { INCLUSIVE_WORLD_LOGO } from "../../../constants";
import one_portal_login_signup_bg from "/iw-brand-kit/iw-logo-white.png";
import { Link } from "react-router-dom";

function ForgotUsername() {
  const [role, setRole] = useState("member");

  const [email, setEmail] = useState("");

  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");

  const [application, setApplication] = useState(null);

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // STEP 1 - FIND APPLICATION BY EMAIL
  const handleFindApplication = async (e) => {
    e.preventDefault();
    setLoading(true);

    const table =
      role === "member" ? "member_applications" : "volunteer_applications";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !data) {
      showErrorModal(
        "We were unable to locate an application with the information provided.",
      );
      setLoading(false);
      return;
    }

    setApplication(data);
    setLoading(false);
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  // STEP 2 - VERIFY DOB + PHONE
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedDob = application?.dob;

    const storedPhone = application?.phone?.replace(/\D/g, "") || "";

    const enteredPhone = phone.replace(/\D/g, "");

    if (storedDob !== dob || storedPhone !== enteredPhone) {
      showErrorModal("We were unable to verify the information provided.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !data) {
      showErrorModal("No user account was found for this application.");
      setLoading(false);
      return;
    }

    setUsername(data.username);
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[55%] items-center justify-center bg-[#0f5b54] text-white relative">
        <img
          src={one_portal_login_signup_bg}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-10"
          alt=""
        />

        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-semibold mb-4">
            {username
              ? "Username Found"
              : application
                ? "Verify Identity"
                : "Forgot Username"}
          </h2>

          <p className="text-white/80 max-w-sm mx-auto">
            {username
              ? "Your username has been successfully recovered."
              : application
                ? "Please verify your identity to continue."
                : "Enter your email address to begin recovering your username."}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-10 lg:min-h-screen">
        <div className="w-full max-w-md">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={INCLUSIVE_WORLD_LOGO}
              className="h-20 mb-3"
              alt="Inclusive World"
            />

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {username
                ? "Username Found"
                : application
                  ? "Verify Identity"
                  : "Forgot Username"}
            </h2>
          </div>

          {/* STEP 1 */}
          {!application && !username && (
            <form className="space-y-5" onSubmit={handleFindApplication}>
              <div>
                <label className="text-sm text-gray-600">I am a</label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="
                    w-full mt-1 px-4 py-3
                    border border-gray-300 rounded-lg bg-gray-100
                    focus:outline-none
                    focus:ring-2 focus:ring-[#0f5b54]/40
                  "
                >
                  <option value="member">Member</option>

                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="
                    w-full mt-1 px-4 py-3
                    border border-gray-300 rounded-lg bg-gray-100
                    focus:outline-none
                    focus:ring-2 focus:ring-[#0f5b54]/40
                  "
                />
              </div>

              <button
                type="submit"
                disabled={!email || loading}
                className={`
                  w-full py-3 rounded-full font-medium transition
                  ${
                    email
                      ? "bg-[#0f5b54] text-white hover:bg-[#0c4a45]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {application && !username && (
            <form className="space-y-5" onSubmit={handleVerifyIdentity}>
              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>

                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="
                    w-full mt-1 px-4 py-3
                    border border-gray-300 rounded-lg bg-gray-100
                    focus:outline-none
                    focus:ring-2 focus:ring-[#0f5b54]/40
                  "
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="
                    w-full mt-1 px-4 py-3
                    border border-gray-300 rounded-lg bg-gray-100
                    focus:outline-none
                    focus:ring-2 focus:ring-[#0f5b54]/40
                  "
                />
              </div>

              <button
                type="submit"
                disabled={!dob || !phone || loading}
                className={`
                  w-full py-3 rounded-full font-medium transition
                  ${
                    dob && phone
                      ? "bg-[#0f5b54] text-white hover:bg-[#0c4a45]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                {loading ? "Verifying..." : "Verify Identity"}
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {username && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Your username is</p>

                <div className="bg-gray-100 border rounded-lg py-4 px-4 text-xl font-semibold text-gray-800">
                  {username}
                </div>
              </div>

              <Link
                to="/one-portal/login"
                className="
                  block w-full text-center
                  py-3 rounded-full
                  bg-[#0f5b54]
                  text-white
                  hover:bg-[#0c4a45]
                "
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* BACK */}
          {!username && (
            <p className="text-center text-sm text-gray-500 mt-5">
              <Link
                to="/one-portal/login"
                className="text-teal-700 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          )}
        </div>
      </div>
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h3>

              <p className="text-gray-600 mb-6">{errorMessage}</p>

              <button
                onClick={() => setShowError(false)}
                className="
            w-full
            bg-[#0f5b54]
            hover:bg-[#0c4a45]
            text-white
            py-3
            rounded-full
            font-medium
            transition
          "
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotUsername;
