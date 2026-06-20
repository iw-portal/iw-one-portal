import { Link } from "react-router-dom";
import { INCLUSIVE_WORLD_LOGO } from "../../../constants";
import one_portal_login_signup_bg from "/iw-brand-kit/iw-logo-white.png";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      setLoading(false);
      alert("User not found");
      return;
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      setLoading(false);
      alert("Incorrect password");
      return;
    }

    // ✅ Store user
    localStorage.setItem("iw_user", JSON.stringify(data));
    setUser(data);

    // ✅ ROLE-BASED ROUTING
    if (data.role === "volunteer") {
      navigate("/one-portal/volunteer");
    } else if (data.role === "member") {
      navigate("/one-portal/member");
    } else if (data.role === "lead") {
      navigate("/one-portal/program-lead");
    } else if (data.role === "admin") {
      navigate("/one-portal/admin");
    } else if (data.role === "pcs") {
      navigate("/one-portal/pcs");
    } else {
      alert("Invalid role");
    }

    setLoading(false);

    // setLoading(false);
    // alert("Login successful!");
  };

  const isDisabled = !username || !password || loading || password.length < 8;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      {/* iPad Banner */}
      <div className="hidden md:flex lg:hidden items-center justify-center gap-6 px-8 py-6 bg-[#0f5b54] text-white">
        <img src={one_portal_login_signup_bg} className="w-20 opacity-20" />
        <div>
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-white/80 max-w-xs">
            Access your account and continue making an impact.
          </p>
        </div>
      </div>

      {/* LEFT SIDE */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-10 lg:min-h-screen">
        <div className="w-full max-w-md sm:pt-24 lg:pt-12">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <img src={INCLUSIVE_WORLD_LOGO} className="h-20 mb-3" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Log In
            </h2>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full mt-1 px-4 py-3 
                  border border-gray-300 rounded-lg bg-gray-100
                  focus:outline-none 
                  focus:ring-2 focus:ring-[#0f5b54]/40
                  focus:border-[#0f5b54]
                  transition
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full mt-1 px-4 py-3 
                  border border-gray-300 rounded-lg bg-gray-100
                  focus:outline-none 
                  focus:ring-2 focus:ring-[#0f5b54]/40
                  focus:border-[#0f5b54]
                  transition
                "
              />
            </div>

            {/* FORGOT PASSWORD */}
            {/* <Link
              to="/one-portal/forgot-password"
              className="text-sm text-teal-700 hover:underline"
            >
              Forgot Password?
            </Link>
            <Link
              to="/one-portal/forgot-username"
              className="text-sm text-teal-700 hover:underline"
            >
              Forgot Username?
            </Link> */}
            <div className="flex flex-row gap-53">
              <Link
                to="/one-portal/forgot-username"
                className="text-sm text-teal-700 hover:underline"
              >
                Forgot Username?
              </Link>
              <Link
                to="/one-portal/forgot-password"
                className="text-sm text-teal-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="h-[0.5px]" />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`
                w-full py-3 rounded-full font-medium transition
                ${
                  !isDisabled
                    ? "bg-[#0f5b54] text-white hover:bg-[#0c4a45]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }
              `}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* SIGNUP */}
            {/* <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/one-portal/signup"
                className="text-teal-700 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p> */}
          </form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-[55%] items-center justify-center bg-[#0f5b54] text-white relative">
        <img
          src={one_portal_login_signup_bg}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-10"
        />

        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-white/80 max-w-sm mx-auto">
            Access your account and continue making an impact with Inclusive
            World.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
