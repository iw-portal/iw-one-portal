import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";

function calculateSubtotal(cart, cycle) {
  if (!cycle) return 0;

  const vocationalPrograms = cart.filter(
    (item) => item.programs?.category?.toLowerCase() === "vocational",
  );

  let total = 0;

  const vocationalCount = vocationalPrograms.length;

  if (vocationalCount === 1) {
    total += Number(cycle.vocational_1_price || 0);
  } else if (vocationalCount === 2) {
    total += Number(cycle.vocational_2_price || 0);
  } else if (vocationalCount >= 3) {
    total += Number(cycle.vocational_3_price || 0);
  }

  cart.forEach((item) => {
    const category = item.programs?.category?.toLowerCase();

    if (category === "employment_services") {
      total += Number(cycle.employment_services_price || 0);
    }

    if (category === "person_centered_services") {
      total += Number(cycle.person_centered_services_price || 0);
    }

    if (
      category === "academic_counseling" ||
      category === "vocational_counseling"
    ) {
      total += Number(cycle.counseling_intake_price || 0);
    }
  });

  return total;
}

export default function EnrollmentCart({
  user,
  cycle,
  cart,
  setCart,
  activeCartId,
  enrolledProgramIds = new Set(),
  remainingSlots = 3,
  onNext,
}) {
  const [programs, setPrograms] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [selectedProgramDetails, setSelectedProgramDetails] = useState(null);
  const [comments, setComments] = useState("");

  async function fetchPrograms() {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("academic_year", cycle.year)
      .eq("is_active", true)
      .eq("is_archived", false)
      .neq("category", "volunteer_only")
      .order("course_title");

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(data || []);
  }

  const dayMapping = {
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
    SUN: "Sunday",
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute || 0));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getProgramSchedule = (program) => {
    const sections = program?.sections || [];

    if (sections.length === 0) {
      return "Schedule not available";
    }

    return sections
      .map((section) => {
        const day = dayMapping[section.day] || section.day || "";

        const time =
          section.start_time && section.end_time
            ? `${formatTime(section.start_time)} - ${formatTime(section.end_time)} PT`
            : "";

        return [day, time].filter(Boolean).join(" • ");
      })
      .filter(Boolean)
      .join(", ");
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (cycle?.id) {
      fetchPrograms();
    }
  }, [cycle]);

  useEffect(() => {
    async function fetchComments() {
      if (!activeCartId) return;

      const { data, error } = await supabase
        .from("enrollment_carts")
        .select("member_comments")
        .eq("id", activeCartId)
        .eq("person_id", user.person_id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setComments(data?.member_comments || "");
    }

    fetchComments();
  }, [activeCartId, user.person_id]);

  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  function isSelected(programId) {
    return cart.some((c) => c.program_id === programId);
  }

  function selectedItem(programId) {
    return cart.find((c) => c.program_id === programId);
  }

  async function toggleProgram(program) {
    if (updating) return;

    setUpdating(true);

    const vocationalCartCount = cart.filter(
      (c) => c.programs?.category?.toLowerCase() === "vocational",
    ).length;

    try {
      if (!activeCartId) {
        alert("Your cart is still loading. Please try again.");
        return;
      }

      const exists = isSelected(program.id);
      const alreadyEnrolled = enrolledProgramIds.has(program.id);

      // MAX 3 PROGRAMS

      if (!exists && alreadyEnrolled) {
        alert("You are already enrolled in this program.");
        return;
      }

      const isVocational = program.category?.toLowerCase() === "vocational";

      if (!exists && isVocational && vocationalCartCount >= remainingSlots) {
        alert(`You can add ${remainingSlots} more vocational program(s).`);
        return;
      }
      // REMOVE FROM CART
      if (exists) {
        const item = selectedItem(program.id);

        if (!item) return;

        if (item.locked) {
          return;
        }

        const { error } = await supabase
          .from("enrollment_cart_items")
          .delete()
          .eq("id", item.id)
          .eq("cart_id", activeCartId)
          .eq("person_id", user.person_id)
          .eq("locked", false);

        if (error) {
          console.error(error);
          return;
        }

        setCart(cart.filter((c) => c.program_id !== program.id));

        return;
      }

      console.log("USER", user);
      console.log("CYCLE", cycle);
      console.log("PROGRAM", program);

      // const { count, error: countError } = await supabase
      //   .from("enrollment_cart_items")
      //   .select("id", {
      //     count: "exact",
      //     head: true,
      //   })
      //   .eq("cart_id", activeCartId)
      //   .eq("person_id", user.person_id);

      // if (countError) {
      //   console.error(countError);
      //   return;
      // }

      if (isVocational && vocationalCartCount >= remainingSlots) {
        alert(`You can add ${remainingSlots} more vocational program(s).`);
        return;
      }

      // ADD TO CART

      const { data, error } = await supabase
        .from("enrollment_cart_items")
        .insert([
          {
            cart_id: activeCartId,

            person_id: user.person_id,

            program_id: program.id,

            registration_setting_id: cycle.id,
          },
        ])
        .select(
          `
        *,
        programs (*)
      `,
        )
        .single();

      if (error) {
        console.error(error);
        if (error.code === "23505") {
          alert("This program is already in your cart.");
        }
        return;
      }

      setCart((prev) => {
        if (prev.some((item) => item.program_id === data.program_id)) {
          return prev;
        }

        return [...prev, data];
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleContinue() {
    const cleanedComments = comments.trim();

    if (!cleanedComments) {
      alert(
        'Additional Program Requests is required. If you have no requests, enter "N/A".',
      );
      return;
    }

    if (!activeCartId) {
      alert("Your cart is still loading. Please try again.");
      return;
    }

    const { error } = await supabase
      .from("enrollment_carts")
      .update({
        member_comments: cleanedComments,
      })
      .eq("id", activeCartId)
      .eq("person_id", user.person_id);

    if (error) {
      console.error(error);
      alert("Could not save comments.");
      return;
    }

    onNext();
  }

  console.log("SELECTED CYCLE", cycle);
  const subtotal = calculateSubtotal(cart, cycle);

  const vocationalCartCount = cart.filter(
    (item) => item.programs?.category?.toLowerCase() === "vocational",
  ).length;

  const commentsValid = comments.trim().length > 0;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
        {programs.map((program) => {
          const selected = isSelected(program.id);
          const locked = selectedItem(program.id)?.locked;
          const alreadyEnrolled = enrolledProgramIds.has(program.id);
          const isVocational = program.category?.toLowerCase() === "vocational";

          const limitReached =
            !selected && isVocational && vocationalCartCount >= remainingSlots;

          return (
            <div
              key={program.id}
              onClick={() => setSelectedProgramDetails(program)}
              className="bg-white rounded-3xl shadow-sm border p-6 cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={program.image_url?.replace("..", "")}
                alt={program.course_title}
                className="w-full h-48 object-contain rounded-2xl"
              />

              <div className="flex items-center gap-3 mt-5">
                <h2 className="text-xl font-semibold">
                  {program.course_title}
                </h2>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.category?.toLowerCase() === "vocational"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {program.category}
                </span>
              </div>

              {program.tracks?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {program.tracks.map((track) => (
                    <span
                      key={track}
                      className="px-2.5 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-xs font-medium"
                    >
                      {track}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {program.description}
              </p>

              <div className="mt-4 rounded-2xl bg-[#f8faf9] border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Class Schedule
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {getProgramSchedule(program)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProgramDetails(program);
                }}
                className="mt-6 w-full border border-[#0f5b54] text-[#0f5b54] py-3 rounded-2xl font-medium hover:bg-[#eef8f7] transition"
              >
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProgram(program);
                }}
                disabled={updating || locked || alreadyEnrolled || limitReached}
                className={`
                  mt-3
                  w-full
                  py-3
                  rounded-2xl
                  font-medium
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  ${
                    selected
                      ? "bg-red-100 text-red-700"
                      : alreadyEnrolled
                        ? "bg-gray-100 text-gray-600"
                        : "bg-[#0f5b54] text-white"
                  }
                `}
              >
                {updating
                  ? "Updating..."
                  : alreadyEnrolled
                    ? "Already Enrolled"
                    : selected
                      ? "Remove"
                      : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="sticky top-6 h-fit bg-white rounded-3xl shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-[#0f5b54]">Your Cart</h2>

        <div className="space-y-4 mt-6">
          {cart.length === 0 ? (
            <p className="text-gray-500">No programs selected.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="border rounded-2xl p-4">
                <h3 className="font-medium">{item.programs?.course_title}</h3>
              </div>
            ))
          )}
          <div className="bg-white rounded-3xl border p-6 mt-6">
            <label className="block font-medium mb-3">
              Additional Program Requests{" "}
              <span className="text-red-600">*</span>
            </label>

            <textarea
              rows={7}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={`Examples:
• I prefer Saturday classes
• I would like morning sessions
• Please avoid overlapping schedules
• Interested in multiple sections if available

If you have no requests, enter N/A.`}
              className="w-full border rounded-xl p-4"
            />
            {!commentsValid && (
              <p className="text-red-600 text-sm mt-2">
                This field is required. If you have no requests, please enter
                "N/A".
              </p>
            )}
          </div>
        </div>

        <div className="border-t mt-6 pt-6 space-y-3">
          <div className="flex justify-between">
            <span>Vocational Programs</span>
            <span>
              {vocationalCartCount} / {remainingSlots}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Estimated Total</span>
            <span>${subtotal}</span>
          </div>
        </div>

        <button
          disabled={cart.length === 0 || updating || !commentsValid}
          // onClick={onNext}
          onClick={handleContinue}
          className="
    mt-6
    w-full
    py-4
    rounded-2xl
    font-medium
    bg-[#0f5b54]
    text-white
    disabled:bg-gray-400
    disabled:text-gray-100
    disabled:cursor-not-allowed
  "
        >
          Continue
        </button>
      </div>
      {selectedProgramDetails && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedProgramDetails(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#0f5b54]">
                  {selectedProgramDetails.course_title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedProgramDetails.course_code}
                </p>
              </div>

              <button
                onClick={() => setSelectedProgramDetails(null)}
                className="text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {selectedProgramDetails.image_url && (
                <div className="bg-gray-50 rounded-2xl p-4 flex justify-center">
                  <img
                    src={selectedProgramDetails.image_url?.replace("..", "")}
                    alt={selectedProgramDetails.course_title}
                    className="h-56 object-contain"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <InfoBox
                  label="Category"
                  value={selectedProgramDetails.category}
                />
                {selectedProgramDetails.tracks?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Program Tracks
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedProgramDetails.tracks.map((track) => (
                        <span
                          key={track}
                          className="px-3 py-1 rounded-full bg-[#0f5b54]/10 text-[#0f5b54] text-sm font-medium"
                        >
                          {track}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <InfoBox
                  label="Level"
                  value={selectedProgramDetails.level || "No Level"}
                />
                <InfoBox
                  label="Duration"
                  value={selectedProgramDetails.duration}
                />
                <InfoBox
                  label="Schedule"
                  value={getProgramSchedule(selectedProgramDetails)}
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedProgramDetails.description ||
                    "No description available."}
                </p>
              </div>

              {selectedProgramDetails.prerequisites && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Prerequisites
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedProgramDetails.prerequisites}
                  </p>
                </div>
              )}

              {selectedProgramDetails.system_requirement && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    System Requirements
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedProgramDetails.system_requirement}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedProgramDetails(null)}
                className="w-full bg-[#0f5b54] text-white py-3 rounded-2xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 mt-1 capitalize">
        {value || "-"}
      </p>
    </div>
  );
}

// function calculateSubtotal(cart) {
//   const count = cart.length;

//   if (count === 1) return 250;
//   if (count === 2) return 450;
//   if (count >= 3) return 600;

//   return 0;
// }
