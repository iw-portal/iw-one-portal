import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../../../lib/supabase";
import EnrollmentCart from "./EnrollmentCart";
import EnrollmentProfile from "./EnrollmentProfile";
import EnrollmentCheckout from "./EnrollmentCheckout";

const STEPS = ["programs", "profile", "payment", "complete"];
const STEP_ORDER = ["programs", "profile", "payment", "complete"];
const USER_STORAGE_KEY = "iw_user";
const CHECKOUT_USER_STORAGE_KEY = "iw_checkout_user";

function readStoredUser() {
  const storedUser =
    localStorage.getItem(USER_STORAGE_KEY) ||
    sessionStorage.getItem(CHECKOUT_USER_STORAGE_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Could not restore enrollment user", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(CHECKOUT_USER_STORAGE_KEY);
    return null;
  }
}

export default function EnrollmentDashboard({ user }) {
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);

  const [step, setStep] = useState("programs");
  const [highestStep, setHighestStep] = useState("programs");
  const [paymentType, setPaymentType] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const currentStepIndex = STEPS.indexOf(step);

  // function canGoToStep(targetStep) {
  //   return STEP_ORDER.indexOf(targetStep) <= STEP_ORDER.indexOf(highestStep);
  // }
  function canGoToStep(targetStep) {
    if (targetStep === "profile" && profileCompleted) return true;

    return STEP_ORDER.indexOf(targetStep) <= STEP_ORDER.indexOf(highestStep);
  }

  const [cycles, setCycles] = useState([]);

  const [cyclesLoaded, setCyclesLoaded] = useState(false);

  const [selectedCycle, setSelectedCycle] = useState(null);

  const [initialized, setInitialized] = useState(false);
  const [activeCartId, setActiveCartId] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [finalizingPayment, setFinalizingPayment] = useState(false);
  const [recoveredUser, setRecoveredUser] = useState(readStoredUser);
  const cartInitializationRef = useRef({});
  const paymentVerificationRef = useRef(false);

  function getCurrentUser(userOverride = null) {
    return userOverride || (user?.person_id ? user : recoveredUser);
  }

  const currentUser = getCurrentUser();

  const enrolledProgramIds = new Set(
    enrolledClasses.map((enrollment) => enrollment.program_id),
  );
  const selectedCycleEnrollments = selectedCycle?.year
    ? enrolledClasses.filter(
        (enrollment) =>
          enrollment.programs?.academic_year === selectedCycle.year,
      )
    : [];

  const vocationalEnrollments = selectedCycleEnrollments.filter(
    (enrollment) =>
      enrollment.programs?.category?.toLowerCase() === "vocational",
  );

  const remainingSlots = Math.max(0, 3 - vocationalEnrollments.length);

  // const hasPaidRegistrationFee = selectedCycle?.id
  //   ? transactions.some(
  //       (transaction) =>
  //         transaction.registration_setting_id === selectedCycle.id &&
  //         transaction.payment_status === "paid" &&
  //         transaction.status === "completed" &&
  //         Number(transaction.registration_fee || 0) > 0,
  //     )
  //   : false;

  const hasPaidRegistrationFee = selectedCycle?.id
    ? transactions.some((transaction) => {
        const isSameCycle =
          transaction.registration_setting_id === selectedCycle.id;

        const hasRegistrationFee =
          Number(transaction.registration_fee || 0) > 0;

        const registrationFeeCovered =
          (transaction.payment_status === "paid" &&
            transaction.status === "completed") ||
          transaction.payment_status === "override";

        return isSameCycle && hasRegistrationFee && registrationFeeCovered;
      })
    : false;

  function stepStorageKey(cycleId = selectedCycle?.id) {
    return `member_enrollment_step_${getCurrentUser()?.person_id}_${cycleId}`;
  }

  function persistRecoveredUser(nextUser) {
    if (!nextUser?.person_id) return;

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    sessionStorage.setItem(CHECKOUT_USER_STORAGE_KEY, JSON.stringify(nextUser));
    setRecoveredUser(nextUser);
  }

  async function completeEnrollmentLocally(
    minimumClassCount = 0,
    userOverride = null,
  ) {
    setRegistrationComplete(true);
    setCart([]);
    setActiveCartId(null);
    await refreshEnrollmentData(minimumClassCount, userOverride);
    updateStep("complete");
    window.history.replaceState({}, document.title, window.location.pathname);
    setInitialized(true);
    setLoading(false);
    setFinalizingPayment(false);
  }

  async function verifyPayment(sessionId, attempt = 0) {
    try {
      const response = await fetch(
        `/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && attempt < 5) {
          setTimeout(() => verifyPayment(sessionId, attempt + 1), 1500);
          return;
        }

        sessionStorage.removeItem(`verified_checkout_session_${sessionId}`);
        setFinalizingPayment(false);
        alert(data.error || "Payment verification failed.");
        return;
      }

      if (!data.paid) {
        sessionStorage.removeItem(`verified_checkout_session_${sessionId}`);
        setFinalizingPayment(false);
        alert("Payment has not been verified.");
        return;
      }

      let paymentUser = getCurrentUser();

      if (!paymentUser?.person_id && data.person_id) {
        paymentUser = {
          person_id: data.person_id,
          role: "member",
        };

        persistRecoveredUser(paymentUser);
      }

      const minimumClassCount =
        selectedCycleEnrollments.length +
        Math.max(Number(data.created_enrollments || 0), cart.length || 1);

      await completeEnrollmentLocally(minimumClassCount, paymentUser);
    } catch (err) {
      console.error(err);
      sessionStorage.removeItem(`verified_checkout_session_${sessionId}`);
      setFinalizingPayment(false);
      alert("Payment verification failed.");
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const success = params.get("success");
    const sessionId = params.get("session_id");

    const verificationKey = `verified_checkout_session_${sessionId}`;
    const needsUserRecovery = !getCurrentUser()?.person_id;

    if (
      success === "true" &&
      sessionId &&
      !paymentVerified &&
      !paymentVerificationRef.current &&
      (!sessionStorage.getItem(verificationKey) || needsUserRecovery)
    ) {
      paymentVerificationRef.current = true;
      sessionStorage.setItem(verificationKey, "true");
      setPaymentVerified(true);
      setFinalizingPayment(true);
      verifyPayment(sessionId);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  async function fetchEnrollmentProfileStatus() {
    const activeUser = getCurrentUser();
    if (!activeUser?.person_id) return;

    const { data, error } = await supabase
      .from("member_enrollment_profiles")
      .select("completed_at")
      .eq("person_id", activeUser.person_id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setProfileCompleted(Boolean(data?.completed_at));
  }

  async function fetchCycles() {
    const activeUser = getCurrentUser();
    const today = new Date().toISOString().split("T")[0];
    const appEnv = import.meta.env.VITE_APP_ENV || "production";

    const { data, error } = await supabase
      .from("registration_settings")
      .select("*")
      .eq("type", activeUser.role)
      .eq("is_open", true)
      .lte("start_date", today)
      .gte("end_date", today)
      .eq("environment", appEnv)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setCycles(data || []);
    setCyclesLoaded(true);
    const savedCycleId = localStorage.getItem("selected_registration_cycle");

    if (savedCycleId) {
      const foundCycle = data?.find((c) => c.id === savedCycleId);

      //   if (foundCycle) {
      //     setSelectedCycle(foundCycle);
      //   }
      if (foundCycle) {
        setSelectedCycle(foundCycle);
        setStep(
          localStorage.getItem(stepStorageKey(foundCycle.id)) || "programs",
        );
      } else {
        localStorage.removeItem("selected_registration_cycle");
      }
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    initialize();
  }, [currentUser?.person_id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!user?.person_id) return;

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (selectedCycle?.id) {
      initializeCart(selectedCycle.id);
    }
  }, [selectedCycle]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (activeCartId) {
      fetchCart(activeCartId);
    }
  }, [activeCartId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  async function initialize() {
    console.log("INITIALIZE START");
    const activeUser = getCurrentUser();

    if (!activeUser?.person_id) {
      const params = new URLSearchParams(window.location.search);
      const isStripeReturn =
        params.get("success") === "true" && params.get("session_id");

      if (!isStripeReturn) {
        console.log("NO PERSON ID");
        setLoading(false);
        setInitialized(true);
      }

      return;
    }

    setLoading(true);

    console.log("FETCH CYCLES");
    await fetchCycles();

    console.log("FETCH PROFILE");
    await fetchProfile();
    await fetchEnrollmentProfileStatus();

    console.log("FETCH COMPLETION");
    await fetchCompletionStatus();
    await Promise.all([fetchEnrolledClasses(), fetchTransactions()]);

    console.log("INITIALIZE DONE");
    setLoading(false);
    setInitialized(true);
  }

  async function fetchProfile() {
    const activeUser = getCurrentUser();

    const { data, error } = await supabase
      .from("people")
      .select("*")
      .eq("id", activeUser.person_id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    return data;
  }

  async function fetchCompletionStatus() {
    const activeUser = getCurrentUser();

    const { data, error } = await supabase
      .from("enrollment_orders")
      .select("id")
      .eq("person_id", activeUser.person_id)
      .eq("payment_status", "paid")
      .eq("status", "completed")
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    setRegistrationComplete((data || []).length > 0);
  }

  async function refreshEnrollmentData(
    minimumClassCount = 0,
    userOverride = null,
  ) {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const [classes] = await Promise.all([
        fetchEnrolledClasses(userOverride),
        fetchTransactions(userOverride),
      ]);

      const matchingClasses = selectedCycle?.year
        ? (classes || []).filter(
            (enrollment) =>
              enrollment.programs?.academic_year === selectedCycle.year,
          )
        : classes || [];

      if (matchingClasses.length >= minimumClassCount || attempt === 5) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  async function fetchEnrolledClasses(userOverride = null) {
    const activeUser = getCurrentUser(userOverride);

    if (!activeUser?.person_id) return [];

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        programs (*)
      `,
      )
      .eq("student_id", activeUser.person_id)
      .order("enrolled_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return [];
    }

    const classes = data || [];

    setEnrolledClasses(classes);
    return classes;
  }

  async function fetchTransactions(userOverride = null) {
    const activeUser = getCurrentUser(userOverride);

    if (!activeUser?.person_id) return [];

    const { data, error } = await supabase
      .from("enrollment_orders")
      .select("*")
      .eq("person_id", activeUser.person_id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return [];
    }

    const orders = data || [];

    setTransactions(orders);
    return orders;
  }

  async function initializeCart(cycleId) {
    if (!cycleId) return null;

    if (cartInitializationRef.current[cycleId]) {
      return cartInitializationRef.current[cycleId];
    }

    cartInitializationRef.current[cycleId] = initializeCartOnce(cycleId);

    return cartInitializationRef.current[cycleId];
  }

  async function initializeCartOnce(cycleId) {
    if (!cycleId) return null;

    const activeUser = getCurrentUser();
    if (!activeUser?.person_id) return null;

    // const { data: completedOrder, error: completedOrderError } = await supabase
    //   .from("enrollment_orders")
    //   .select("id, payment_status")
    //   .eq("person_id", activeUser.person_id)
    //   .eq("registration_setting_id", cycleId)
    //   .in("payment_status", ["paid", "override"])
    //   .order("created_at", { ascending: false })
    //   .limit(1)
    //   .maybeSingle();

    // if (completedOrderError) {
    //   console.error(completedOrderError);
    //   return null;
    // }

    // if (completedOrder) {
    //   setCart([]);
    //   setActiveCartId(null);
    //   setStep("complete");
    //   setHighestStep("complete");
    //   return null;
    // }

    // FIND EXISTING DRAFT CART

    const { data: existingCarts, error: existingError } = await supabase
      .from("enrollment_carts")
      .select("*")
      .eq("person_id", activeUser.person_id)
      .eq("registration_setting_id", cycleId)
      .eq("status", "draft")
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false });

    if (existingError) {
      console.error(existingError);
      return null;
    }

    const existingCart = existingCarts?.[0];

    // if (existingCart) {
    //   setActiveCartId(existingCart.id);

    //   return existingCart.id;
    // }
    if (existingCart) {
      setActiveCartId(existingCart.id);
      setStep(existingCart.current_step || "programs");
      setHighestStep(existingCart.highest_step || "programs");

      return existingCart.id;
    }

    // CREATE NEW CART

    const { data: newCart, error } = await supabase
      .from("enrollment_carts")
      // .insert({
      //   person_id: activeUser.person_id,

      //   registration_setting_id: cycleId,

      //   status: "draft",

      //   payment_status: "pending",
      // })
      .insert({
        person_id: activeUser.person_id,
        registration_setting_id: cycleId,
        status: "draft",
        payment_status: "pending",
        current_step: "programs",
        highest_step: "programs",
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return null;
    }

    setActiveCartId(newCart.id);

    return newCart.id;
  }

  async function fetchCart(cartId = activeCartId) {
    if (!cartId) return;
    const activeUser = getCurrentUser();

    const { data: cartData, error } = await supabase
      .from("enrollment_cart_items")
      .select(
        `
      *,
      programs (*)
    `,
      )
      .eq("cart_id", cartId)
      .eq("person_id", activeUser.person_id)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      return;
    }

    const restoredCart = cartData || [];

    setCart(restoredCart);

    // if (restoredCart.length === 0 && ["profile", "payment"].includes(step)) {
    if (restoredCart.length === 0 && step === "payment") {
      updateStep("programs");
    }
  }

  // async function updateStep(nextStep) {
  //   setStep(nextStep);

  //   if (selectedCycle?.id) {
  //     localStorage.setItem(stepStorageKey(selectedCycle.id), nextStep);
  //   }
  // }
  function isStepAllowed(targetStep, highestStep) {
    return STEP_ORDER.indexOf(targetStep) <= STEP_ORDER.indexOf(highestStep);
  }

  async function updateStep(nextStep) {
    const currentHighestIndex = STEP_ORDER.indexOf(highestStep);
    const nextIndex = STEP_ORDER.indexOf(nextStep);

    const nextHighestStep =
      nextIndex > currentHighestIndex ? nextStep : highestStep;

    const { error } = await supabase
      .from("enrollment_carts")
      .update({
        current_step: nextStep,
        highest_step: nextHighestStep,
      })
      .eq("id", activeCartId)
      .eq("person_id", currentUser.person_id);

    if (error) {
      console.error(error);
      alert("Could not update registration step.");
      return;
    }

    setStep(nextStep);
    setHighestStep(nextHighestStep);
  }

  function renderStep() {
    // if (remainingSlots === 0) {
    //   return renderEnrollmentComplete();
    // }

    if (step === "programs") {
      return (
        <EnrollmentCart
          user={currentUser}
          cycle={selectedCycle}
          cart={cart}
          setCart={setCart}
          activeCartId={activeCartId}
          enrolledProgramIds={enrolledProgramIds}
          remainingSlots={remainingSlots}
          onNext={() => updateStep("profile")}
        />
      );
    }

    if (step === "profile") {
      return (
        // <EnrollmentProfile
        //   user={currentUser}
        //   cycle={selectedCycle}
        //   onNext={() => updateStep("payment")}
        //   onBack={() => updateStep("programs")}
        // />
        <EnrollmentProfile
          user={currentUser}
          cycle={selectedCycle}
          hasCartItems={cart.length > 0}
          onNext={() => updateStep("payment")}
          onBack={() => updateStep("programs")}
        />
      );
    }

    if (step === "payment") {
      return (
        <EnrollmentCheckout
          user={currentUser}
          cycle={selectedCycle}
          cart={cart}
          enrolledCount={vocationalEnrollments.length}
          hasPaidRegistrationFee={hasPaidRegistrationFee}
          remainingSlots={remainingSlots}
          onBack={() => updateStep("profile")}
          onComplete={(paymentType) => {
            updateStep("complete");
            setPaymentType(paymentType);
          }}
        />
      );
    }

    if (step === "complete") {
      console.log(paymentType);
      return renderEnrollmentComplete(paymentType);
    }

    return null;
  }

  // function renderEnrollmentComplete(showSuccess = false) {
  //   return (
  //     <div className="bg-white rounded-3xl p-12 shadow-sm border text-center">
  //       <h1 className="text-5xl font-bold text-[#0f5b54]">
  //         Enrollment Complete
  //       </h1>

  //       <p className="mt-5 text-gray-600 max-w-2xl mx-auto leading-relaxed">
  //         {showSuccess
  //           ? "Your payment was successful and your enrollment has been confirmed."
  //           : "You are enrolled in the maximum 3 classes for this cycle."}
  //       </p>

  //       <div className="mt-8 bg-[#eef8f7] rounded-2xl p-6 inline-block">
  //         <p className="font-medium text-[#0f5b54]">
  //           You are officially enrolled in your selected Inclusive World
  //           programs.
  //         </p>
  //       </div>

  //       <div className="flex flex-wrap justify-center gap-4 mt-8">
  //         <a
  //           href="/one-portal/member/classes"
  //           className="px-5 py-3 rounded-2xl bg-[#0f5b54] text-white font-medium"
  //         >
  //           View My Classes
  //         </a>

  //         <a
  //           href="/one-portal/member/transactions"
  //           className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium"
  //         >
  //           View Transactions
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  function renderEnrollmentComplete(paymentType) {
    const isPayNow =
      paymentType === "pay_now" ||
      transactions.some(
        (t) =>
          t.registration_setting_id === selectedCycle?.id &&
          t.payment_status === "paid",
      );

    const isOverride =
      paymentType === "pay_later" ||
      transactions.some(
        (t) =>
          t.registration_setting_id === selectedCycle?.id &&
          t.payment_status === "override",
      );

    return (
      <div className="bg-white rounded-3xl p-12 shadow-sm border text-center">
        <h1 className="text-5xl font-bold text-[#0f5b54]">
          {isPayNow ? "Enrollment Complete" : "Registration Submitted"}
        </h1>

        <p className="mt-5 text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {isPayNow
            ? "Your payment was successful and your enrollment has been confirmed."
            : "Your enrollment has been submitted successfully with a pending payment status. An Inclusive World administrator will contact you to complete your payment."}
        </p>

        <div className="mt-8 bg-[#eef8f7] rounded-2xl p-6 inline-block max-w-2xl">
          <p className="font-medium text-[#0f5b54]">
            {isPayNow
              ? "You are officially enrolled in your selected Inclusive World programs. You can now view your enrolled classes and payment history below."
              : "Your selected programs have been saved. Once your payment has been received and verified by an administrator, your enrollment will be finalized and your classes will appear in your dashboard."}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {isPayNow && (
            <a
              href="/one-portal/member/classes"
              className="px-5 py-3 rounded-2xl bg-[#0f5b54] text-white font-medium"
            >
              View My Classes
            </a>
          )}

          <a
            href="/one-portal/member/transactions"
            className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium"
          >
            View Transactions
          </a>
        </div>
      </div>
    );
  }

  if (loading || !initialized || finalizingPayment) {
    return (
      <div className="p-10 text-gray-500">
        {finalizingPayment
          ? "Finalizing your enrollment..."
          : "Restoring enrollment session..."}
      </div>
    );
  }

  if (!currentUser?.person_id) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
          <h1 className="text-3xl font-bold text-[#0f5b54]">Please Sign In</h1>

          <p className="text-gray-500 mt-3">
            We could not restore your member session.
          </p>
        </div>
      </div>
    );
  }

  if (cyclesLoaded && !selectedCycle) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border p-8">
          <h1 className="text-4xl font-bold text-[#0f5b54]">
            Registration Cycles
          </h1>

          <p className="text-gray-500 mt-3">
            Select an enrollment cycle to continue.
          </p>
        </div>

        {cycles.length === 0 && (
          <div className="bg-white rounded-3xl border p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Open Enrollment Cycles
            </h2>

            <p className="text-gray-500 mt-3">
              There are currently no active registration cycles available.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {cycles.map((cycle) => (
            <button
              key={cycle.id}
              onClick={async () => {
                setSelectedCycle(cycle);

                localStorage.setItem("selected_registration_cycle", cycle.id);
                setStep(
                  localStorage.getItem(stepStorageKey(cycle.id)) || "programs",
                );

                await initializeCart(cycle.id);
              }}
              className="
              bg-white
              rounded-3xl
              border
              p-8
              text-left
              hover:border-[#0f5b54]
              hover:shadow-lg
              transition
            "
            >
              <h2 className="text-2xl font-semibold text-[#0f5b54]">
                {cycle.title}
              </h2>

              <p className="text-gray-500 mt-2">Academic Year: {cycle.year}</p>

              <div className="mt-5 inline-flex px-4 py-2 rounded-full bg-[#eef8f7] text-[#0f5b54] text-sm font-medium">
                Open Enrollment
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">Registration</h1>

        <p className="text-gray-500 mt-3">
          Select your preferred programs and complete the registration process.
        </p>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Submission and payment do not guarantee
            placement. Program assignments are subject to availability and
            administrative review.
          </p>
        </div>

        <div className="inline-flex px-4 py-2 rounded-full bg-[#eef8f7] text-[#0f5b54] text-sm font-medium mt-5">
          {selectedCycle.title}
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          {/* {STEPS.map((s, index) => {
            const active = step === s;

            return (
              <div
                key={s}
                className={`
                  px-5
                  py-3
                  rounded-2xl
                  text-sm
                  font-medium
                  border
                  ${
                    active
                      ? "bg-[#0f5b54] text-white border-[#0f5b54]"
                      : "bg-white text-gray-600 border-gray-300"
                  }
                `}
              >
                {index + 1}. {s.toUpperCase()}
              </div>
            );
          })} */}
          {STEPS.map((s, index) => {
            const active = step === s;
            const unlocked = canGoToStep(s);

            return (
              <button
                key={s}
                type="button"
                disabled={!unlocked}
                onClick={() => updateStep(s)}
                className={`
        px-5 py-3 rounded-2xl text-sm font-medium border transition
        ${
          active
            ? "bg-[#0f5b54] text-white border-[#0f5b54]"
            : unlocked
              ? "bg-white text-gray-600 border-gray-300 hover:border-[#0f5b54]"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        }
      `}
              >
                {index + 1}. {s.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {renderStep()}
    </div>
  );
}
