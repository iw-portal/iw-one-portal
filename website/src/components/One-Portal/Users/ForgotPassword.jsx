// import { useState } from "react";
// import { supabase } from "../../../lib/supabase";
// import { INCLUSIVE_WORLD_LOGO } from "../../../constants";
// import one_portal_login_signup_bg from "/iw-brand-kit/iw-logo-white.png";
// import { Link } from "react-router-dom";

// function ForgotPassword() {
//   const [identifier, setIdentifier] = useState(""); // username or email
//   const [loading, setLoading] = useState(false);

//   const handleReset = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 🔍 Find user
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .or(`email.eq.${identifier},username.eq.${identifier}`)
//       .single();

//     if (error || !data) {
//       alert("User not found");
//       setLoading(false);
//       return;
//     }

//     // 🔐 Send reset email using Supabase Auth (recommended)
//     const { error: resetError } = await supabase.auth.resetPasswordForEmail(
//       data.email,
//       {
//         redirectTo: "http://localhost:5173/reset-password",
//       },
//     );

//     if (resetError) {
//       alert("Error sending reset email");
//       setLoading(false);
//       return;
//     }

//     alert("Password reset link sent to your email!");
//     setLoading(false);
//   };

//   const isDisabled = !identifier || loading;

//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
//       {/* LEFT PANEL (GREEN) */}
//       <div className="hidden lg:flex w-[55%] items-center justify-center bg-[#0f5b54] text-white relative">
//         <img
//           src={one_portal_login_signup_bg}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-10"
//         />

//         <div className="relative z-10 text-center px-10">
//           <h2 className="text-4xl font-semibold mb-4">Reset Password</h2>
//           <p className="text-white/80 max-w-sm mx-auto">
//             Enter your username or email and we’ll send you a reset link.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE FORM */}
//       <div className="w-full lg:w-[45%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-10 lg:min-h-screen">
//         <div className="w-full max-w-md">
//           {/* HEADER */}
//           <div className="flex flex-col items-center mb-8">
//             <img src={INCLUSIVE_WORLD_LOGO} className="h-20 mb-3" />
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
//               Forgot Password
//             </h2>
//           </div>

//           {/* FORM */}
//           <form className="space-y-5" onSubmit={handleReset}>
//             <div>
//               <label className="text-sm text-gray-600">Username or Email</label>
//               <input
//                 type="text"
//                 placeholder="Enter your username or email"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 className="
//                   w-full mt-1 px-4 py-3
//                   border border-gray-300 rounded-lg bg-gray-100
//                   focus:outline-none
//                   focus:ring-2 focus:ring-[#0f5b54]/40
//                   focus:border-[#0f5b54]
//                   transition
//                 "
//               />
//             </div>

//             {/* BUTTON */}
//             <button
//               type="submit"
//               disabled={isDisabled}
//               className={`
//                 w-full py-3 rounded-full font-medium transition
//                 ${
//                   !isDisabled
//                     ? "bg-[#0f5b54] text-white hover:bg-[#0c4a45]"
//                     : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 }
//               `}
//             >
//               {loading ? "Sending..." : "Send Reset Link"}
//             </button>

//             {/* BACK TO LOGIN */}
//             <p className="text-center text-sm text-gray-500">
//               Remembered your password?{" "}
//               <Link
//                 to="/one-portal/login"
//                 className="text-teal-700 font-medium hover:underline"
//               >
//                 Back to Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { INCLUSIVE_WORLD_LOGO } from "../../../constants";
import one_portal_login_signup_bg from "/iw-brand-kit/iw-logo-white.png";
import bcrypt from "bcryptjs";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [user, setUser] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // STEP 1 → FIND USER
  const handleFindUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (error || !data) {
      alert("User not found");
      setLoading(false);
      return;
    }

    setUser(data);
    setLoading(false);
  };

  // STEP 2 → UPDATE PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id);

    if (error) {
      alert("Error updating password");
      setLoading(false);
      return;
    }

    alert("Password updated successfully!");

    // Reset state
    setUser(null);
    setIdentifier("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      {/* LEFT PANEL (GREEN) */}
      <div className="hidden lg:flex w-[55%] items-center justify-center bg-[#0f5b54] text-white relative">
        <img
          src={one_portal_login_signup_bg}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-10"
        />

        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-semibold mb-4">
            {user ? "Set New Password" : "Forgot Password"}
          </h2>
          <p className="text-white/80 max-w-sm mx-auto">
            {user
              ? "Enter your new password below."
              : "Enter your username or email to continue."}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-10 lg:min-h-screen">
        <div className="w-full max-w-md">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <img src={INCLUSIVE_WORLD_LOGO} className="h-20 mb-3" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {user ? "Reset Password" : "Forgot Password"}
            </h2>
          </div>

          {/* STEP 1: FIND USER */}
          {!user && (
            <form className="space-y-5" onSubmit={handleFindUser}>
              <div>
                <label className="text-sm text-gray-600">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
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
                disabled={!identifier || loading}
                className={`
                  w-full py-3 rounded-full font-medium
                  ${
                    identifier
                      ? "bg-[#0f5b54] text-white"
                      : "bg-gray-300 text-gray-600"
                  }
                `}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {/* STEP 2: RESET PASSWORD */}
          {user && (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#0f5b54] text-white"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          {/* BACK */}
          <p className="text-center text-sm text-gray-500 mt-5">
            <Link
              to="/one-portal/login"
              className="text-teal-700 hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
