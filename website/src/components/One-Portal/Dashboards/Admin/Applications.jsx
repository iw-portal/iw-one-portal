import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const AdminApplications = () => {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingApp, setRejectingApp] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchApps = async () => {
    // =====================================================
    // FETCH VOLUNTEERS
    // =====================================================

    const { data: volunteerData, error: volunteerError } = await supabase
      .from("volunteer_applications")
      .select("*, registration_settings(*)")
      .order("created_at", { ascending: false });

    // =====================================================
    // FETCH MEMBERS
    // =====================================================

    const { data: memberData, error: memberError } = await supabase
      .from("member_applications")
      .select("*, registration_settings(*)")
      .order("created_at", { ascending: false });

    if (volunteerError || memberError) {
      console.error(volunteerError || memberError);
      return;
    }

    // =====================================================
    // NORMALIZE DATA
    // =====================================================

    const volunteers =
      volunteerData?.map((v) => ({
        ...v,
        application_type: "volunteer",
        display_name: `${v.first_name || ""} ${v.last_name || ""}`,
      })) || [];

    const members =
      memberData?.map((m) => ({
        ...m,
        application_type: "member",
        display_name: `${m.fname || ""} ${m.lname || ""}`,
      })) || [];

    // =====================================================
    // MERGE + SORT
    // =====================================================

    const merged = [...volunteers, ...members].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    setApps(merged);
  };

  /* ---------------- FORMAT KEYS ---------------- */
  const formatKey = (key) => {
    const map = {
      fname: "First Name",
      lname: "Last Name",

      first_name: "First Name",
      last_name: "Last Name",

      p1_fname: "Parent 1 First Name",
      p1_lname: "Parent 1 Last Name",

      e_fname: "Emergency First Name",
      e_lname: "Emergency Last Name",

      exp_web: "Website Experience",
      exp_excel: "Excel Experience",
      exp_ai: "AI Experience",
      exp_mobile: "Mobile App Experience",
      exp_python: "Python Experience",
    };

    if (map[key]) return map[key];

    return key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  /* ---------------- APPROVE ---------------- */
  // const approve = async (app) => {
  //   const user = await supabase.auth.getUser();
  //   const data = app.data || {};

  //   try {
  //     const email = data.email?.trim().toLowerCase();

  //     const username = `${(data.fname || "user").toLowerCase()}${Math.floor(
  //       Math.random() * 1000,
  //     )}`;

  //     const password = Math.random().toString(36).slice(-8);
  //     const hashed = await bcrypt.hash(password, 10);

  //     /* ---------------- PEOPLE INSERT ---------------- */
  //     const personPayload = {
  //       fname: data.fname,
  //       lname: data.lname,
  //       email: email,
  //       phone: data.phone,
  //       address: data.address,

  //       age: data.ageinput,
  //       hear_about_us: data.hear_about_us,
  //       vol_experience: data.vol_experience,
  //       which_jobs: data.which_jobs,
  //       how_learn: data.how_learn,
  //       interested: data.interested,
  //       expectations: data.expectations,

  //       parent1_fname: data.parent_fname,
  //       parent1_lname: data.parent_lname,
  //       parent1_phone1: data.parent_phone1,
  //       parent1_phone2: data.parent_phone2,
  //       parent1_email: data.parent_email,

  //       emergency_email: data.emergency_email,
  //       emergency_phone1: data.emergency_phone1,
  //       emergency_phone2: data.emergency_phone2,

  //       new_to_iw: data.new_to_iw === "true" || data.new_to_iw === true,
  //       terms: data.terms === true || data.terms === "true",

  //       about_you: {
  //         about_great: data.about_great,
  //         about_happy: data.about_happy,
  //         about_learn: data.about_learn,
  //         about_likes: data.about_likes,
  //         about_sad: data.about_sad,
  //       },

  //       extra_data: data,

  //       role: "volunteer",
  //       profile_type: "member_full",
  //     };

  //     const { data: person, error: pError } = await supabase
  //       .from("people")
  //       .insert([personPayload])
  //       .select()
  //       .single();

  //     if (pError) throw pError;

  //     /* ---------------- CHECK EXISTING USER ---------------- */
  //     const { data: existingUser } = await supabase
  //       .from("users")
  //       .select("*")
  //       .ilike("email", email)
  //       .maybeSingle();

  //     /* ---------------- INSERT USER IF NOT EXISTS ---------------- */
  //     if (!existingUser) {
  //       const { error: uError } = await supabase.from("users").insert([
  //         {
  //           email: email,
  //           username,
  //           password: hashed,
  //           role: "volunteer",
  //           person_id: person.id,
  //         },
  //       ]);

  //       if (uError) throw uError;
  //     }

  //     /* ---------------- UPDATE APPLICATION ---------------- */
  //     console.log("User:", user);
  //     const { error: aError } = await supabase
  //       .from("applications")
  //       .update({
  //         status: "approved",
  //         reviewed_at: new Date(),
  //         reviewed_by: user.id,
  //       })
  //       .eq("id", app.id);

  //     if (aError) throw aError;

  //     alert(`Approved!\nUsername: ${username}\nPassword: ${password}`);

  //     fetchApps();
  //     setSelected(null);
  //   } catch (err) {
  //     console.error("Approve error:", err);
  //     alert(err.message);
  //   }
  // };

  const API_BASE_URL = import.meta.env.VITE_PUBLIC_APP_URL;

  const approve = async (app) => {
    try {
      const endpoint =
        app.application_type === "volunteer"
          ? "/api/volunteer_email"
          : "/api/member_email";

      const url = `${API_BASE_URL}${endpoint}`;

      const table =
        app.application_type === "volunteer"
          ? "volunteer_applications"
          : "member_applications";

      // =====================================================
      // UPDATE STATUS
      // =====================================================

      const { error } = await supabase
        .from(table)
        .update({
          status: "approved",
        })
        .eq("id", app.id);

      if (error) throw error;

      // =====================================================
      // SEND EMAIL
      // =====================================================

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: app.email,

          fname:
            app.application_type === "volunteer" ? app.first_name : app.fname,

          lname:
            app.application_type === "volunteer" ? app.last_name : app.lname,

          decision: "approved",
          application_id: app.id,
        }),
      });

      console.log("BREVO STATUS:", response.status);

      const result = await response.json();

      console.log(result);

      alert("Application approved and email sent!");

      fetchApps();

      setSelected(null);
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  };

  /* ---------------- REJECT ---------------- */
  const reject = async (app) => {
    try {
      const endpoint =
        app.application_type === "volunteer"
          ? "/api/volunteer_email"
          : "/api/member_email";

      const url = `${API_BASE_URL}${endpoint}`;

      const table =
        app.application_type === "volunteer"
          ? "volunteer_applications"
          : "member_applications";

      // =====================================================
      // UPDATE STATUS
      // =====================================================

      // const { error } = await supabase
      //   .from(table)
      //   .update({
      //     status: "rejected",
      //   })
      //   .eq("id", app.id);
      if (!rejectionReason.trim()) {
        alert(
          "Please enter a rejection reason before rejecting this application.",
        );
        return;
      }

      const { error } = await supabase
        .from(table)
        .update({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
        })
        .eq("id", app.id);

      if (error) {
        console.error("SUPABASE UPDATE ERROR:", error);
        throw error;
      }

      console.log("STATUS UPDATED SUCCESSFULLY");

      // =====================================================
      // SEND EMAIL
      // =====================================================

      // const endpoint =
      //   app.application_type === "volunteer"
      //     ? "/api/volunteer_email"
      //     : "/api/member_email";

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: app.email,

          fname:
            app.application_type === "volunteer" ? app.first_name : app.fname,

          lname:
            app.application_type === "volunteer" ? app.last_name : app.lname,

          decision: "rejected",
          rejection_reason: rejectionReason.trim(),
        }),
      });

      const result = await response.json();

      console.log(result);

      alert("Application rejected and email sent!");

      fetchApps();

      setSelected(null);
      setShowRejectModal(false);
      setRejectingApp(null);
      setRejectionReason("");
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  };

  const filteredApps = apps.filter((app) => {
    const statusMatch = statusFilter === "all" || app.status === statusFilter;

    const typeMatch =
      typeFilter === "all" || app.application_type === typeFilter;

    return statusMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">Applications</h1>

      <div className="flex gap-3 mb-3 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
        px-4 py-2 rounded-xl border font-medium transition
        ${
          statusFilter === status
            ? "bg-[#0f5b54] text-white border-[#0f5b54]"
            : "bg-white border-gray-300"
        }
      `}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "member", "volunteer"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`
        px-4 py-2 rounded-xl border font-medium transition
        ${
          typeFilter === type
            ? "bg-[#0f5b54] text-white border-[#0f5b54]"
            : "bg-white border-gray-300"
        }
      `}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} (
            {type === "all"
              ? apps.length
              : apps.filter((a) => a.application_type === type).length}
            )
          </button>
        ))}
      </div>

      {/* ---------------- CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => {
          return (
            <div
              key={app.id}
              // onClick={() => setSelected(app)}
              onClick={() => {
                setSelected(app);
                setRejectionReason(app.rejection_reason || "");
              }}
              className="cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="bg-white border border-slate-700 rounded-2xl p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">
                      {app.display_name}
                    </h2>

                    <span
                      className={`
    text-xs
    font-bold
    px-2
    py-1
    rounded-full

    ${
      app.status === "approved"
        ? "bg-green-100 text-green-700"
        : app.status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
    }
  `}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">{app.email}</p>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span
                      className={`
      text-xs
      px-2
      py-1
      rounded-full

      ${
        app.application_type === "volunteer"
          ? "bg-blue-100 text-blue-700"
          : "bg-purple-100 text-purple-700"
      }
    `}
                    >
                      {app.application_type}
                    </span>

                    <span className="text-xs text-slate-500">
                      {app.registration_settings?.title}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto bg-white text-black rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selected.display_name}</h2>
                <p className="text-slate-600 mt-1">{selected.email}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(selected || {})
                .filter(
                  ([key]) =>
                    ![
                      "registration_settings",
                      "display_name",
                      "stripe_session_id",
                      "updated_at",
                      "waiver_signature",
                      "waiver_signed_at",
                    ].includes(key),
                )
                .map(([key, value]) => {
                  const isLong =
                    typeof value === "string" && value.length > 120;

                  return (
                    <div
                      key={key}
                      className={`
          bg-white
          border
          border-slate-200
          rounded-xl
          p-4
          ${isLong ? "md:col-span-2" : ""}
        `}
                    >
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">
                        {formatKey(key)}
                      </p>

                      <p className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                        {Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "object" && value !== null
                            ? Array.isArray(value)
                              ? value.join(", ")
                              : JSON.stringify(value, null, 2)
                            : typeof value === "boolean"
                              ? value
                                ? "Yes"
                                : "No"
                              : String(value)}
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* {selected.status === "pending" && (
              <div className="mt-8 flex gap-4">
                <div className="mt-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rejection Reason
                  </label>

                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="Enter the reason that should be included in the rejection email..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
                  />
                </div>
                <button
                  onClick={() => approve(selected)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(selected)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
                >
                  Reject
                </button>
              </div>
            )} */}

            {selected.status === "pending" && (
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => approve(selected)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    setRejectingApp(selected);
                    setRejectionReason("");
                    setShowRejectModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showRejectModal && rejectingApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Rejection Reason
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Please enter the reason that should be included in the rejection
              email.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
              className="mt-4 w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
              placeholder="Example: The application is missing required information..."
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingApp(null);
                  setRejectionReason("");
                }}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => reject(rejectingApp)}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
