import { useState } from "react";
import { supabase } from "../../../../../lib/supabase";

export default function EnrollmentCheckout({
  user,
  cycle,
  cart,
  enrolledCount = 0,
  hasPaidRegistrationFee = false,
  remainingSlots = 3,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  const subtotal = calculateSubtotal(cart, cycle);
  const annualRegistrationFee = getRegistrationFee(cycle);
  const registrationFee = hasPaidRegistrationFee ? 0 : annualRegistrationFee;
  const total = subtotal + registrationFee;

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
            ? `${formatTime(section.start_time)} - ${formatTime(section.end_time)}`
            : "";

        return [day, time].filter(Boolean).join(" • ");
      })
      .filter(Boolean)
      .join(", ");
  };

  async function handleCheckout() {
    if (checkoutStarted) return;

    setCheckoutStarted(true);

    setLoading(true);

    if (!user?.person_id) {
      alert("Could not identify the current member. Please sign in again.");

      setLoading(false);
      setCheckoutStarted(false);

      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");

      setLoading(false);
      setCheckoutStarted(false);

      return;
    }

    if (total <= 0) {
      alert("There is no payment due for this checkout.");

      setLoading(false);
      setCheckoutStarted(false);

      return;
    }

    const { data: existingEnrollments, error: enrollmentLookupError } =
      await supabase
        .from("enrollments")
        .select("program_id, programs (academic_year, category)")
        .eq("student_id", user.person_id);

    if (enrollmentLookupError) {
      console.error(enrollmentLookupError);
      alert("Could not validate existing enrollments.");
      setLoading(false);
      setCheckoutStarted(false);
      return;
    }

    const enrolledProgramIds = new Set(
      (existingEnrollments || []).map((e) => e.program_id),
    );

    const duplicatePrograms = cart.filter((item) =>
      enrolledProgramIds.has(item.program_id),
    );

    if (duplicatePrograms.length > 0) {
      alert("You are already enrolled in one or more selected programs.");

      setLoading(false);
      setCheckoutStarted(false);

      return;
    }

    // const existingThisCycle = (existingEnrollments || []).filter(
    //   (enrollment) => enrollment.programs?.academic_year === cycle?.year,
    // );
    const existingThisCycle = (existingEnrollments || []).filter(
      (enrollment) =>
        enrollment.programs?.academic_year === cycle?.year &&
        enrollment.programs?.category?.toLowerCase() === "vocational",
    );
    const currentEnrolledCount = Math.max(
      enrolledCount,
      existingThisCycle.length,
    );

    const vocationalInCart = cart.filter(
      (item) => item.programs?.category?.toLowerCase() === "vocational",
    ).length;

    if (
      currentEnrolledCount + vocationalInCart > 3 ||
      vocationalInCart > remainingSlots
    ) {
      alert(
        "You can only register for a maximum of 3 vocational programs per year.",
      );

      setLoading(false);
      setCheckoutStarted(false);

      return;
    }

    let createdOrder = null;
    let createdNewOrder = false;

    try {
      console.log("CHECKOUT CART", cart);

      const cartId = cart[0]?.cart_id;
      const registrationSettingId = cart[0]?.registration_setting_id;

      if (!cartId || !registrationSettingId) {
        alert("Your cart could not be restored. Please refresh and try again.");
        setLoading(false);
        setCheckoutStarted(false);
        return;
      }

      if (cart.some((item) => item.locked)) {
        alert("This cart has already been submitted.");
        setLoading(false);
        setCheckoutStarted(false);
        return;
      }

      const uniqueProgramIds = new Set(cart.map((item) => item.program_id));

      if (uniqueProgramIds.size !== cart.length) {
        alert(
          "Your cart contains duplicate programs. Please refresh and try again.",
        );
        setLoading(false);
        setCheckoutStarted(false);
        return;
      }

      const subtotal = calculateSubtotal(cart, cycle);

      // CREATE ORDER FIRST

      const { data: existingOrder, error: existingOrderError } = await supabase
        .from("enrollment_orders")
        .select("*")
        .eq("person_id", user.person_id)
        .eq("cart_id", cartId)
        .eq("payment_status", "unpaid")
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (existingOrderError) {
        console.error(existingOrderError);
        alert("Could not restore existing order");
        setLoading(false);
        setCheckoutStarted(false);
        return;
      }

      let order;
      let orderError;

      if (existingOrder) {
        order = existingOrder;
      } else {
        const result = await supabase
          .from("enrollment_orders")
          .insert({
            person_id: user.person_id,
            cart_id: cartId,
            registration_setting_id: registrationSettingId,
            subtotal,
            registration_fee: registrationFee,
            total_amount: total,
            status: "pending",
            payment_status: "unpaid",
          })
          .select()
          .single();

        order = result.data;
        createdNewOrder = Boolean(result.data?.id);
        orderError = result.error;
      }

      createdOrder = order;

      if (orderError) {
        console.error(orderError);

        alert("Could not create order");

        setLoading(false);
        setCheckoutStarted(false);

        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cart,

          orderId: order.id,

          personId: user.person_id,

          cartId,
        }),
      });

      console.log("RESPONSE STATUS", response.status);

      const data = await response.json();

      console.log("CHECKOUT RESPONSE", data);

      if (!response.ok) {
        if (createdNewOrder && createdOrder?.id) {
          await supabase
            .from("enrollment_orders")
            .delete()
            .eq("id", createdOrder.id)
            .eq("payment_status", "unpaid")
            .is("stripe_session_id", null);
        }

        alert(data.error || "Checkout failed");

        setLoading(false);
        setCheckoutStarted(false);

        return;
      }

      if (data.url) {
        localStorage.setItem("iw_user", JSON.stringify(user));
        sessionStorage.setItem("iw_checkout_user", JSON.stringify(user));
        window.location.href = data.url;
      } else {
        if (createdNewOrder && createdOrder?.id) {
          await supabase
            .from("enrollment_orders")
            .delete()
            .eq("id", createdOrder.id)
            .eq("payment_status", "unpaid")
            .is("stripe_session_id", null);
        }

        alert("Stripe URL not returned");

        setLoading(false);
        setCheckoutStarted(false);

        return;
      }
    } catch (err) {
      console.error(err);

      if (createdNewOrder && createdOrder?.id) {
        await supabase
          .from("enrollment_orders")
          .delete()
          .eq("id", createdOrder.id)
          .eq("payment_status", "unpaid")
          .is("stripe_session_id", null);
      }

      alert("Something went wrong");
      setCheckoutStarted(false);
    }

    setLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8 space-y-4">
        <h1 className="text-3xl font-bold text-[#0f5b54]">Review</h1>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="
        border
        rounded-2xl
        p-5
        flex
        justify-between
        items-start
      "
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.programs?.course_title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.programs?.category?.toLowerCase() === "vocational"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.programs?.category}
                </span>

                <p className="text-sm text-gray-500 mt-1">
                  {item.programs?.course_code}
                </p>

                <p className="text-sm text-gray-500">
                  {item.programs?.duration}
                </p>

                <p className="text-sm text-gray-500">
                  {item.programs?.level?.charAt(0).toUpperCase() +
                    item.programs?.level?.slice(1)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getProgramSchedule(item.programs)}
                </p>
              </div>

              <div
                className="
          bg-[#eef8f7]
          text-[#0f5b54]
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
        "
              >
                Included
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border p-8 h-fit">
        <h2 className="text-2xl font-semibold">Payment Summary</h2>

        {/* <div className="space-y-4 mt-8">
          <div className="flex justify-between">
            <span>Programs</span>
            <span>${subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Registration Fee</span>
            <span>$50</span>
          </div>

          <div className="bg-[#f8faf9] rounded-2xl p-4 border">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your pricing has automatically been optimized based on the number
              of selected programs.
            </p>
          </div>

          <div className="border-t pt-5 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${subtotal + 50}</span>
          </div>
        </div> */}
        <div className="space-y-5 mt-8">
          <div className="flex justify-between text-gray-600">
            <span>Programs</span>
            <span>${subtotal}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Registration Fee</span>
            <span>
              {hasPaidRegistrationFee
                ? "Paid for this year"
                : `$${registrationFee}`}
            </span>
          </div>

          <div className="bg-[#f8faf9] rounded-2xl p-4 border">
            <p className="text-sm text-gray-600 leading-relaxed">
              The annual registration fee is charged once per year. Your class
              pricing is based on the number of selected programs.
            </p>
          </div>

          <div className="border-t pt-5 flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onBack} className="flex-1 border rounded-2xl py-4">
            Back
          </button>

          <button
            onClick={handleCheckout}
            disabled={
              loading || checkoutStarted || cart.length === 0 || total <= 0
            }
            className="
              flex-1
              bg-[#0f5b54]
              text-white
              rounded-2xl
              py-4
              font-medium
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Redirecting..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateSubtotal(cart, cycle) {
  if (!cycle) return 0;

  const vocationalPrograms = cart.filter(
    (item) => item.programs?.category?.toLowerCase() === "vocational",
  );

  // const nonVocationalPrograms = cart.filter(
  //   (item) => item.programs?.category?.toLowerCase() !== "vocational",
  // );

  let total = 0;

  const vocationalCount = vocationalPrograms.length;

  if (vocationalCount === 1) {
    total += Number(cycle.vocational_1_price || 250);
  } else if (vocationalCount === 2) {
    total += Number(cycle.vocational_2_price || 450);
  } else if (vocationalCount >= 3) {
    total += Number(cycle.vocational_3_price || 600);
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

function getRegistrationFee(cycle) {
  const configuredFee = Number(cycle?.registration_fee);

  if (Number.isFinite(configuredFee) && configuredFee >= 0) {
    return configuredFee;
  }

  return 50;
}
