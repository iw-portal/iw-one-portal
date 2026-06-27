import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { INCLUSIVE_WORLD_LOGO } from "../../../constants";
import signUpBg from "/iw-brand-kit/iw-logo-white.png";
import { supabase } from "../../../lib/supabase";
import bcrypt from "bcryptjs";
import { useSearchParams } from "react-router-dom";
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from "react-icons/hi";

/* ========================= */
/* CONFIG */
/* ========================= */

const roleMap = {
  member: "member",
  volunteer: "volunteer",
  supporter: "donor",
};

/* ========================= */
/* HELPERS */
/* ========================= */

// const calculateAge = (dob) => {
//   const birth = new Date(dob);
//   const today = new Date();

//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();

//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//     age--;
//   }

//   return age;
// };

// const generateUsername = (email, firstName, lastName, date, role) => {
//   const domain = email.split("@")[1];
//   const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

//   const f = firstName.toLowerCase();
//   const l = lastName.toLowerCase();
//   const d = date;

//   if (role == "supporter") {
//     return email.split("@")[0];
//   }

//   // ✅ InclusiveWorld (enterprise pattern)
//   if (domain === "inclusiveworld.org") {
//     const internalChoice = rand(1, 2);
//     switch (internalChoice) {
//       case 1:
//         return `${f.slice(0, 4)}${l.slice(0, 4)}`;
//       case 2:
//         return `${f.slice(0, 2)}${l.slice(0, 5)}${date}`;
//       default:
//         return `${f.slice(0, 3)}${l.slice(0, 3)}${date}`;
//     }
//   }

//   // ✅ Non-inclusiveworld → pick 1 of 4 patterns
//   const choice = rand(1, 4);

//   switch (choice) {
//     case 1:
//       return `${f}${d}`;

//     case 2:
//       return `${f.slice(0, 2)}.${l.slice(0, 4)}`;

//     case 3:
//       return `${f[0]}${l}${rand(10, 99)}`;

//     case 4:
//       return `${f.slice(0, 4)}.${l.slice(0, 5)}`;

//     default:
//       return `${f}${rand(100, 999)}`;
//   }
// };

const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const generateUsername = (email, firstName, lastName) => {
  const domain = email.split("@")[1]?.toLowerCase();

  const f = sanitize(firstName);
  const l = sanitize(lastName);

  // =========================
  // InclusiveWorld Emails
  // Pattern:
  // first4 + last4
  // =========================
  if (domain === "inclusiveworld.org") {
    const randomDigits = Math.floor(10 + Math.random() * 90);

    return `${f.slice(0, 4)}${l.slice(0, 4)}${randomDigits}`;
  }

  // =========================
  // Non-Org Emails
  // Pattern:
  // first4 + last4 + random 3 digits
  // =========================
  const randomDigits = Math.floor(100 + Math.random() * 900);

  return `${f.slice(0, 4)}${l.slice(0, 4)}${randomDigits}`;
};

const usernameExists = async (username) => {
  const { data } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  return !!data;
};

const generateUniqueUsername = async (email, firstName, lastName) => {
  let username;
  let exists = true;

  while (exists) {
    username = generateUsername(email, firstName, lastName);
    exists = await usernameExists(username);
  }

  return username;
};

/* ========================= */
/* MODALS */
/* ========================= */

const InviteStatusModal = ({ type, title, message }) => {
  const navigateToLogin = () => {
    window.location.href = "/one-portal/login";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-6 text-center">
        {type === "used" ? (
          <HiCheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
        ) : (
          <HiXCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
        )}

        <h2 className="text-2xl font-semibold mb-3">{title}</h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={navigateToLogin}
          className="w-full bg-[#0f5b54] hover:bg-[#0c4a45] text-white py-3 rounded-xl"
        >
          Proceed to Login
        </button>
      </div>
    </div>
  );
};

// const ConfirmModal = ({ data, onConfirm, onEdit }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-xl w-[420px]">
//       <h2 className="text-lg font-semibold mb-4">Confirm Your Details</h2>

//       <div className="text-sm space-y-2">
//         <p>
//           <strong>Name:</strong> {data.firstName} {data.lastName}
//         </p>
//         <p>
//           <strong>Email:</strong> {data.email}
//         </p>
//         <p>
//           <strong>Role:</strong> {data.role}
//         </p>
//       </div>

//       <div className="flex justify-between mt-6">
//         <button onClick={onEdit} className="px-4 py-2 border rounded-lg">
//           Edit
//         </button>
//         <button
//           onClick={onConfirm}
//           className="bg-[#0f5b54] text-white px-4 py-2 rounded-lg"
//         >
//           Looks Correct
//         </button>
//       </div>
//     </div>
//   </div>
// );

const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

/* ========================= */
/* MAIN COMPONENT */
/* ========================= */

const Signup = () => {
  const [lockedFields, setLockedFields] = useState(false);
  const [searchParams] = useSearchParams();
  // const presetRole = searchParams.get("role").trim();
  const inviteToken = searchParams.get("invite");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // const [age, setAge] = useState(null);
  // const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [inviteStatus, setInviteStatus] = useState("loading");

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteToken) {
        alert("Access denied");
        window.location.href = "/";
        return;
      }

      // const { data, error } = await supabase
      //   .from("signup_invites")
      //   .select("*")
      //   .eq("token", inviteToken)
      //   .eq("used", false)
      //   .gt("expires_at", new Date().toISOString())
      //   .single();

      const { data, error } = await supabase
        .from("signup_invites")
        .select("*")
        .eq("token", inviteToken)
        .maybeSingle();

      if (error || !data) {
        setInviteStatus("invalid");
        return;
      }

      if (data.used) {
        setInviteStatus("used");
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setInviteStatus("invalid");
        return;
      }

      setLockedFields(true);

      let applicationData = null;

      if (data.role === "member" && data.application_id) {
        const { data: memberApp } = await supabase
          .from("member_applications")
          .select("*")
          .eq("id", data.application_id)
          .single();

        applicationData = memberApp;
      }

      if (data.role === "volunteer" && data.application_id) {
        const { data: volunteerApp } = await supabase
          .from("volunteer_applications")
          .select("*")
          .eq("id", Number(data.application_id))
          .single();

        applicationData = volunteerApp;
      }

      // setForm((prev) => ({
      //   ...prev,

      //   role: data.role,

      //   email: applicationData?.email || data.email || "",

      //   firstName: applicationData?.fname || applicationData?.first_name || "",

      //   lastName: applicationData?.lname || applicationData?.last_name || "",

      //   dob: applicationData?.dob || "",

      //   age: applicationData?.age || "",
      // }));
      setForm((prev) => ({
        ...prev,
        role: data.role,
        email: applicationData?.email || data.email || "",
        firstName: applicationData?.fname || applicationData?.first_name || "",
        lastName: applicationData?.lname || applicationData?.last_name || "",
        // dob: applicationData?.dob || "",
      }));
      setInviteStatus("valid");

      // if (applicationData?.dob) {
      //   setAge(calculateAge(applicationData.dob));
      // }
    };

    validateInvite();
  }, []);

  if (signupSuccess) {
    console.log("RENDERING SUCCESS", signupSuccess);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <HiCheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />

          <h1 className="text-2xl font-semibold mb-3">
            Account Created Successfully
          </h1>

          <div className="bg-gray-50 border rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Your Username</p>

            <p className="font-mono text-lg font-semibold">
              {signupSuccess.username}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Your username has also been emailed to:
            <br />
            <strong>{signupSuccess.email}</strong>
          </p>

          <button
            onClick={() => (window.location.href = "/one-portal/login")}
            className="w-full bg-[#0f5b54] text-white py-3 rounded-xl"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  // console.log(presetRole);

  if (inviteStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Validating invitation...</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...form, [name]: value };
    setForm(updated);

    // if (name === "dob") {
    //   setAge(calculateAge(value));
    // }
  };

  const passwordStrength = getPasswordStrength(form.password);

  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const passwordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!passwordValid) {
  //     alert(
  //       "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.",
  //     );
  //     return;
  //   }

  //   if (form.password !== form.confirmPassword) {
  //     alert(
  //       "The passwords you entered do not match. Please re-enter them and try again.",
  //     );
  //     return;
  //   }

  //   if (!form.role) {
  //     alert(
  //       "Please select the role that best describes your relationship with Inclusive World.",
  //     );
  //     return;
  //   }

  //   // setShowConfirm(true);
  //   await handleFinalSubmit();
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      alert(
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert(
        "The passwords you entered do not match. Please re-enter them and try again.",
      );
      return;
    }

    if (!form.role) {
      alert(
        "Please select the role that best describes your relationship with Inclusive World.",
      );
      return;
    }

    await handleFinalSubmit();
  };

  // const isDisabled =
  //   !form.firstName ||
  //   !form.lastName ||
  //   !form.email ||
  //   !form.password ||
  //   !form.confirmPassword ||
  //   !form.role;

  const isDisabled =
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.password ||
    !form.confirmPassword ||
    !form.role ||
    !passwordValid;

  // const handleFinalSubmit = async () => {
  //   const { username, password } = credentials;

  //   // 🔐 HASH PASSWORD
  //   const saltRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   const { error } = await supabase.from("users").insert([
  //     {
  //       first_name: form.firstName,
  //       last_name: form.lastName,
  //       email: form.email,
  //       password: hashedPassword,
  //       dob: form.dob,
  //       age,
  //       username,
  //       role: form.role,
  //     },
  //   ]);

  //   if (error) {
  //     console.error(error);
  //     alert("Error creating account");
  //     return;
  //   }

  //   alert("Account created successfully!");
  // };

  const handleFinalSubmit = async () => {
    const password = form.password;

    const username = await generateUniqueUsername(
      form.email,
      form.firstName,
      form.lastName,
    );

    try {
      const mappedRole = roleMap[form.role?.toLowerCase()];

      if (!mappedRole) {
        alert("Invalid role selected");
        return;
      }

      // 🔐 HASH PASSWORD
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 👇 Determine profile type
      const isMember =
        mappedRole === "member" ||
        mappedRole === "volunteer" ||
        mappedRole === "donor";

      const { data: inviteData } = await supabase
        .from("signup_invites")
        .select("*")
        .eq("token", inviteToken)
        .single();

      if (!inviteData) {
        alert(
          "This signup link is no longer valid. Please contact Inclusive World for a new invitation.",
        );
        return;
      }

      if (
        inviteData.email &&
        inviteData.email.toLowerCase() !== form.email.toLowerCase()
      ) {
        alert(
          "This invitation was sent to a different email address. Please use the email address associated with your invitation.",
        );
        return;
      }

      // const { data: usedInvite, error: usedInviteError } = await supabase
      //   .from("signup_invites")
      //   .update({ used: true })
      //   .eq("token", inviteToken)
      //   .eq("used", false)
      //   .select()
      //   .single();

      // if (usedInviteError || !usedInvite) {
      //   alert("This signup link has already been used");
      //   return;
      // }

      /* ========================= */
      /* 1. INSERT INTO PEOPLE */
      /* ========================= */

      const { data: existingPerson } = await supabase
        .from("people")
        .select("id")
        .ilike("email", form.email)
        .maybeSingle();

      if (existingPerson) {
        alert(
          "We found an existing Inclusive World account with this email address. Please sign in to continue.",
        );
        return;
      }

      const { data: person, error: personError } = await supabase
        .from("people")
        .insert([
          {
            fname: form.firstName,
            lname: form.lastName,
            email: form.email,
            age: null,
            role: mappedRole,
            profile_type: isMember ? "member_full" : "basic",
          },
        ])
        .select()
        .single();

      if (personError) {
        console.error(personError);

        if (personError.code === "23505") {
          alert(
            "We found an existing Inclusive World account with this email address. Please sign in to continue.",
          );
          return;
        }

        alert(
          "We were unable to create your profile at this time. Please try again in a few moments.",
        );

        await supabase
          .from("signup_invites")
          .update({ used: false })
          .eq("token", inviteToken);

        return;
      }

      /* ========================= */
      /* 2. INSERT INTO USERS */
      /* ========================= */

      const { error: userError } = await supabase.from("users").insert([
        {
          email: form.email,
          username: username,
          password: hashedPassword, // ✅ correct column
          role: mappedRole,
          person_id: person.id,
        },
      ]);

      if (userError) {
        console.error(userError);

        if (userError.code === "23505") {
          alert(
            "An account with this email address already exists. Please sign in instead.",
          );
          return;
        }

        alert(
          "We couldn't finish setting up your account. Please try again in a few moments.",
        );

        return;
      }

      /* ========================= */
      /* SUCCESS */
      /* ========================= */

      const { error: inviteUpdateError } = await supabase
        .from("signup_invites")
        .update({ used: true })
        .eq("token", inviteToken);

      if (inviteUpdateError) {
        console.error(inviteUpdateError);
      }

      try {
        // const API_BASE_URL = import.meta.env.VITE_PUBLIC_APP_URL;
        const endpoint = "/api/account_created_email";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            fname: form.firstName,
            lname: form.lastName,
            username,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to send account email:", result);
        }
      } catch (err) {
        console.error("Account email error:", err);
      }
      console.log("ABOUT TO SET SUCCESS");
      console.log("USERNAME:", username);
      console.log("EMAIL:", form.email);
      setSignupSuccess({
        username,
        email: form.email,
      });
    } catch (err) {
      console.error(err);
      alert(
        "Something unexpected happened while creating your account. Please try again. If the problem continues, contact Inclusive World support.",
      );
    }
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      {/* iPad Banner */}
      <div className="hidden md:flex lg:hidden items-center justify-center gap-6 px-8 py-6 bg-[#0f5b54] text-white">
        <img src={signUpBg} className="w-20 opacity-20" />
        <div>
          <h2 className="text-2xl font-semibold">Join Us</h2>
          <p className="text-sm text-white/80">
            Create your account and start making an impact.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-10 lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img src={INCLUSIVE_WORLD_LOGO} className="h-20 mb-3" />
            <h2 className="text-2xl font-semibold">Sign Up</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                disabled={lockedFields}
                className="
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg bg-gray-100
  focus:outline-none 
  focus:ring-2 focus:ring-[#0f5b54]
  focus:border-[#0f5b54]
  transition
"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                disabled={lockedFields}
                className="
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg bg-gray-100
  focus:outline-none 
  focus:ring-2 focus:ring-[#0f5b54]
  focus:border-[#0f5b54]
  transition
"
              />
            </div>

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={lockedFields}
              className="
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg bg-gray-100
  focus:outline-none 
  focus:ring-2 focus:ring-[#0f5b54]
  focus:border-[#0f5b54]
  transition
"
            />

            {/* <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg bg-gray-100
  focus:outline-none 
  focus:ring-2 focus:ring-[#0f5b54]
  focus:border-[#0f5b54]
  transition
"
            /> */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg bg-gray-100
  focus:outline-none 
  focus:ring-2 focus:ring-[#0f5b54]
  focus:border-[#0f5b54]
  transition
"
            /> */}

            {passwordFocused && (
              <>
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength <= 2
                          ? "bg-red-500"
                          : passwordStrength <= 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm space-y-2">
                  <div
                    className={`flex items-center gap-2 ${
                      passwordChecks.length ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {passwordChecks.length ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiXCircle className="w-5 h-5" />
                    )}
                    <span>Minimum 8 characters</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      passwordChecks.uppercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordChecks.uppercase ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiXCircle className="w-5 h-5" />
                    )}
                    <span>Uppercase letter</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      passwordChecks.lowercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordChecks.lowercase ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiXCircle className="w-5 h-5" />
                    )}
                    <span>Lowercase letter</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      passwordChecks.number ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {passwordChecks.number ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiXCircle className="w-5 h-5" />
                    )}
                    <span>Number</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      passwordChecks.special
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordChecks.special ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiXCircle className="w-5 h-5" />
                    )}
                    <span>Special character</span>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <HiEyeOff size={20} />
                ) : (
                  <HiEye size={20} />
                )}
              </button>
            </div>

            {form.confirmPassword.length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                {passwordsMatch ? (
                  <>
                    <HiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      Passwords match
                    </span>
                  </>
                ) : (
                  <>
                    <HiXCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Passwords do not match
                    </span>
                  </>
                )}
              </div>
            )}

            {/* <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="
    w-full px-4 py-3
    border border-gray-300 
    rounded-lg bg-gray-100
    focus:outline-none 
    focus:ring-2 focus:ring-[#0f5b54]
    focus:border-[#0f5b54]
    transition
  "
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="volunteer">Volunteer</option>
              <option value="supporter">Supporter</option>
            </select> */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={lockedFields}
              className="
    w-full px-4 py-3
    border border-gray-300
    rounded-lg bg-gray-100
    focus:outline-none
    focus:ring-2 focus:ring-[#0f5b54]
    focus:border-[#0f5b54]
    transition
    disabled:bg-gray-200
    disabled:cursor-not-allowed
  "
            >
              <option value="">Select Role</option>
              <option value="member">Member</option>
              <option value="volunteer">Volunteer</option>
              <option value="supporter">Supporter</option>
            </select>

            <button
              disabled={isDisabled}
              className={`
    w-full py-3 rounded-full text-white
    ${
      form.role
        ? "bg-[#0f5b54] hover:bg-[#0c4a45]"
        : "bg-gray-300 cursor-not-allowed"
    }
  `}
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/one-portal/login"
                className="text-teal-700 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-[55%] items-center justify-center bg-[#0f5b54] text-white relative">
        <img
          src={signUpBg}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-20"
        />
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-semibold mb-4">Welcome!</h2>
          <p className="text-white/80 max-w-sm mx-auto">
            Create your account and become part of Inclusive World.
          </p>
        </div>
      </div>

      {/* MODALS */}
      {/* {showConfirm && (
        <ConfirmModal
          data={{ ...form, age }}
          onConfirm={handleConfirm}
          onEdit={() => setShowConfirm(false)}
        />
      )} */}
      {inviteStatus === "used" && (
        <InviteStatusModal
          type="used"
          title="Invitation Already Used"
          message="An account has already been created using this invitation. Please sign in to continue."
        />
      )}

      {inviteStatus === "invalid" && (
        <InviteStatusModal
          type="invalid"
          title="Invitation Invalid"
          message="This signup link has expired or is no longer available."
        />
      )}
    </div>
  );
};

export default Signup;
