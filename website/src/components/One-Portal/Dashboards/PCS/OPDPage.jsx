import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../../lib/supabase";
import { decodePersonId } from "../../../../utils/opdRouteToken";

const getAcademicYear = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11

  // Academic year starts July 1
  if (month > 4) {
    return `${year}-${year + 1}`;
  }

  return `${year - 1}-${year}`;
};

const ACADEMIC_YEAR = getAcademicYear();

const DEFAULT_OPD_DATA = {
  admire_about_me: "",
  important_to_me: "",
  things_i_like_to_do: "",
  things_i_want_to_learn: "",
  what_makes_me_happy: "",
  what_makes_me_sad: "",
  communication_preference: "",
  how_to_support_me: "",
  vision_for_future: "",
  characteristics_i_like: "",
  characteristics_i_dislike: "",
  risk_factors: "",
};

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

const OPDPage = ({ user }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [personId, setPersonId] = useState(null);
  const [person, setPerson] = useState(null);
  const [opd, setOpd] = useState(null);
  const [opdData, setOpdData] = useState(DEFAULT_OPD_DATA);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [signedByName, setSignedByName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sourceData, setSourceData] = useState({});

  useEffect(() => {
    try {
      setPersonId(decodePersonId(token));
    } catch (err) {
      console.error(err);
      alert("Invalid OPD link.");
      navigate("/one-portal/pcs/opd");
    }
  }, [token]);

  useEffect(() => {
    if (personId) loadOPDPage();
  }, [personId]);

  const validateOPD = () => {
    const missing = [];

    if (!signedByName?.trim()) {
      missing.push("Signed By");
    }

    Object.entries(opdData).forEach(([key, value]) => {
      if (!value || !String(value).trim()) {
        missing.push(LABELS[key]);
      }
    });

    return missing;
  };

  const loadOPDPage = async () => {
    setLoading(true);

    const { data: personData, error: personError } = await supabase
      .from("people")
      .select("*")
      .eq("id", personId)
      .maybeSingle();

    if (personError || !personData) {
      console.error(personError);
      alert("Person not found.");
      setLoading(false);
      return;
    }

    setPerson(personData);

    let { data: opdProfile, error: opdError } = await supabase
      .from("opd_profiles")
      .select("*")
      .eq("person_id", personId)
      .eq("academic_year", ACADEMIC_YEAR)
      .maybeSingle();

    if (opdError) {
      console.error(opdError);
      alert(opdError.message);
      setLoading(false);
      return;
    }

    const initialSourceData = await buildInitialOPDData(personData);
    setSourceData(initialSourceData);

    if (!opdProfile) {
      opdProfile = await createInitialOPD(personData, initialSourceData);
    }

    setOpd(opdProfile);
    const savedData = opdProfile?.data || {};

    const editedData = savedData.edited || savedData;
    const originalData = savedData.source || initialSourceData;

    setOpdData({
      ...DEFAULT_OPD_DATA,
      ...editedData,
    });

    setSourceData({
      ...DEFAULT_OPD_DATA,
      ...originalData,
    });
    setSignedByName(opdProfile?.signed_by_name || "");

    if (opdProfile?.id) {
      await fetchComments(opdProfile.id);
    }

    setLoading(false);
  };

  // const createInitialOPD = async (personData, initialData) => {
  //   const { data, error } = await supabase
  //     .from("opd_profiles")
  //     .insert({
  //       person_id: personData.id,
  //       academic_year: ACADEMIC_YEAR,
  //       built_by: user?.person_id || null,
  //       last_updated_by: user?.person_id || null,
  //       status: "in_progress",
  //       data: {
  //         edited: initialData,
  //         source: initialData,
  //       },
  //     })
  //     .select()
  //     .single();

  //   if (error) {
  //     console.error(error);
  //     alert(error.message);
  //     return null;
  //   }

  //   await supabase
  //     .from("people")
  //     .update({
  //       opd_status: "in_progress",
  //       opd_released: false,
  //     })
  //     .eq("id", personData.id);

  //   return data;
  // };

  const createInitialOPD = async (personData, initialData) => {
    const { data, error } = await supabase
      .from("opd_profiles")
      .upsert(
        {
          person_id: personData.id,
          academic_year: ACADEMIC_YEAR,
          built_by: user?.person_id || null,
          last_updated_by: user?.person_id || null,
          status: "in_progress",
          data: {
            edited: initialData,
            source: initialData,
          },
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "person_id,academic_year",
        },
      )
      .select()
      .single();

    if (error) {
      console.error(error);
      alert(error.message);
      return null;
    }

    await supabase
      .from("people")
      .update({
        opd_status: "in_progress",
        opd_released: false,
      })
      .eq("id", personData.id);

    return data;
  };

  const buildInitialOPDData = async (personData) => {
    if (personData.role === "member") {
      const { data } = await supabase
        .from("member_enrollment_profiles")
        .select("*")
        .eq("person_id", personData.id)
        .maybeSingle();

      return {
        admire_about_me: data?.about_great || "",
        important_to_me: data?.important_to || "",
        things_i_like_to_do: data?.about_likes || data?.activities || "",
        things_i_want_to_learn: data?.about_learn || data?.desired_skills || "",
        what_makes_me_happy:
          data?.about_happy || data?.communication_happy || "",
        what_makes_me_sad: data?.about_sad || data?.communication_sad || "",
        communication_preference:
          data?.communication_style || data?.communication_needs || "",
        how_to_support_me:
          data?.accommodations ||
          data?.environment_preferences ||
          data?.support_devices ||
          "",
        vision_for_future: data?.hopes_dreams || data?.dream_job || "",
        characteristics_i_like: data?.ideal_staff_traits || "",
        characteristics_i_dislike: data?.disliked_staff_traits || "",
        risk_factors: data?.risk_factors || "",
      };
    }

    if (personData.role === "volunteer") {
      const { data } = await supabase
        .from("volunteer_applications")
        .select("*")
        .eq("email", personData.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        admire_about_me: data?.about_me || "",
        important_to_me: data?.important_to_me || "",
        things_i_like_to_do: data?.fun_activities || "",
        things_i_want_to_learn: data?.new_things_to_learn || "",
        what_makes_me_happy: data?.happiness || "",
        what_makes_me_sad: data?.sadness || "",
        communication_preference: data?.communication_style || "",
        how_to_support_me:
          data?.support_preferences || data?.accommodations || "",
        vision_for_future:
          data?.hopes_and_dreams || data?.employment_goals || "",
        characteristics_i_like: "",
        characteristics_i_dislike: "",
        risk_factors: data?.risk_factors || "",
      };
    }

    return DEFAULT_OPD_DATA;
  };

  const fetchComments = async (opdProfileId) => {
    const { data, error } = await supabase
      .from("opd_comments")
      .select(
        `
        *,
        people:person_id (
          fname,
          lname,
          role
        )
      `,
      )
      .eq("opd_profile_id", opdProfileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setComments(data || []);
  };

  const updateField = (field, value) => {
    setOpdData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isOPDComplete =
    signedByName?.trim() &&
    Object.values(opdData).every((v) => v && String(v).trim().length > 0);

  const API_BASE_URL = import.meta.env.VITE_PUBLIC_APP_URL;

  const saveOPD = async (status = "in_progress") => {
    // if (!opd?.id || !person?.id) return;
    if (!person?.id) return;

    const missingFields = validateOPD();

    if (missingFields.length > 0) {
      alert(
        `Please complete all required fields before saving.\n\nMissing:\n${missingFields.join("\n")}`,
      );
      return;
    }

    setSaving(true);

    const updates = {
      // data: opdData,
      data: {
        edited: opdData,
        source: sourceData,
      },
      status,
      signed_by_name: signedByName || null,
      last_updated_by: user?.person_id || null,
      updated_at: new Date().toISOString(),
    };

    if (status === "for_review") {
      updates.released_at = new Date().toISOString();
      await supabase.from("notifications").insert({
        title: "Your OPD is ready for review",
        message:
          "Please review your One Page Description and submit any comments or requested changes.",
        role_target: person.role,
        person_id: person.id,
        link_url:
          person.role === "member"
            ? "/one-portal/member/opd-review"
            : "/one-portal/volunteer/opd-review",
        expires_at: null,
      });
      const reviewUrl =
        person.role === "member"
          ? `${API_BASE_URL}/one-portal/member/opd-review`
          : `${API_BASE_URL}/one-portal/volunteer/opd-review`;

      await fetch("/api/opd_review_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: person.email,
          fname: person.fname,
          reviewUrl,
        }),
      });
    }

    if (status === "published") {
      updates.published_at = new Date().toISOString();
      updates.reviewed_at = new Date().toISOString();
      updates.review_completed_by = user?.person_id || null;
    }

    // const { data, error } = await supabase
    //   .from("opd_profiles")
    //   .update(updates)
    //   .eq("id", opd.id)
    //   .select()
    //   .single();
    const { data, error } = await supabase
      .from("opd_profiles")
      .upsert(
        {
          person_id: person.id,
          academic_year: ACADEMIC_YEAR,
          built_by: opd?.built_by || user?.person_id || null,
          ...updates,
        },
        {
          onConflict: "person_id,academic_year",
        },
      )
      .select()
      .single();

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    await supabase
      .from("people")
      .update({
        opd_status: status,
        opd_released: status === "for_review" || status === "published",
      })
      .eq("id", person.id);

    setOpd(data);
    setSaving(false);

    alert(
      status === "in_progress"
        ? "OPD saved."
        : status === "for_review"
          ? "OPD moved to review."
          : "OPD published.",
    );
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    const { error } = await supabase.from("opd_comments").insert({
      opd_profile_id: opd.id,
      person_id: user?.person_id || null,
      comment: comment.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    setComment("");
    fetchComments(opd.id);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading OPD...</div>;
  }

  if (!person) {
    return <div className="p-6 text-gray-500">Person not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/one-portal/pcs/opd")}
        className="text-sm text-[#0f5b54] hover:underline"
      >
        ← Back to OPDs
      </button>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold text-[#0f5b54]">
              {person.fname} {person.lname}
            </h1>
            <p className="text-gray-500">{person.email}</p>
            <p className="text-sm text-gray-500 capitalize">{person.role}</p>
          </div>

          <div className="text-sm space-y-1">
            <p>
              <strong>Academic Year:</strong> {ACADEMIC_YEAR}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">
                {opd?.status?.replaceAll("_", " ")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-[#0f5b54]">Build OPD</h2>

            <div className="w-full md:w-80">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Signed By <span className="text-red-500">*</span>
              </label>

              <input
                required
                value={signedByName}
                onChange={(e) => setSignedByName(e.target.value)}
                placeholder="Enter PCP team member name"
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* {Object.entries(opdData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {LABELS[key] || key.replaceAll("_", " ")}
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                value={value || ""}
                onChange={(e) => updateField(key, e.target.value)}
                rows={4}
                className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
              />
            </div>
          ))} */}
          {Object.entries(opdData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {LABELS[key] || key.replaceAll("_", " ")}
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
                <p className="font-semibold mb-1">Original response</p>
                <p className="whitespace-pre-wrap">
                  {sourceData[key] || "No response provided."}
                </p>
              </div>

              <textarea
                value={value || ""}
                onChange={(e) => updateField(key, e.target.value)}
                rows={4}
                className="w-full border rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f5b54]/30"
              />
            </div>
          ))}

          <div className="flex gap-3 justify-end flex-wrap pt-4 border-t">
            <button
              disabled={saving}
              onClick={() => saveOPD("in_progress")}
              className="px-5 py-2 rounded-lg border"
            >
              Save Draft
            </button>

            {/* <button
              disabled={saving}
              onClick={() => saveOPD("for_review")}
              className="px-5 py-2 rounded-lg bg-yellow-500 text-white"
            >
              Move To Review
            </button> */}
            <button
              disabled={!isOPDComplete || saving}
              onClick={() => saveOPD("for_review")}
              className={`px-5 py-2 rounded-lg text-white ${
                isOPDComplete
                  ? "bg-yellow-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Move To Review
            </button>

            {/* <button
              disabled={saving}
              onClick={() => saveOPD("published")}
              className="px-5 py-2 rounded-lg bg-[#0f5b54] text-white"
            >
              Publish OPD
            </button> */}
            <button
              disabled={!isOPDComplete || saving}
              onClick={() => saveOPD("published")}
              className={`px-5 py-2 rounded-lg text-white ${
                isOPDComplete
                  ? "bg-[#0f5b54]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Publish OPD
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-semibold text-[#0f5b54]">Comments</h2>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment or review note"
            rows={4}
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={addComment}
            className="w-full bg-[#0f5b54] text-white py-2 rounded-lg"
          >
            Add Comment
          </button>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border rounded-xl p-3 bg-gray-50">
                  <p className="text-sm whitespace-pre-wrap">{c.comment}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    {c.people
                      ? `${c.people.fname} ${c.people.lname} (${c.people.role})`
                      : "Unknown"}{" "}
                    · {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OPDPage;
