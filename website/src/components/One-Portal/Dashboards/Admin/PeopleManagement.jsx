import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const ROLE_FILTERS = ["all", "member", "volunteer", "lead", "admin"];
const STATUS_FILTERS = ["all", "active", "inactive"];
const PAYMENT_FILTERS = ["all", "paid", "unpaid", "override"];

const OVERRIDE_ADMIN_USERNAMES = ["pranmaga", "rohipanc87", "madhkris93"];

const generateManualTransactionId = (paymentMethod, orderId) => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const mode = paymentMethod
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return `iwpay_man_${mode}_order_${orderId}`;
};

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-5">
    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800 break-words">
      {value === null || value === undefined || value === ""
        ? "-"
        : typeof value === "boolean"
          ? value
            ? "Yes"
            : "No"
          : Array.isArray(value)
            ? value.join(", ")
            : value}
    </p>
  </div>
);

const formatName = (person) => {
  const first = person?.fname || person?.first_name || "";
  const last = person?.lname || person?.last_name || "";

  return `${first} ${last}`
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const roleBadge = (role) => {
  switch (role) {
    case "lead":
      return "bg-purple-100 text-purple-700";
    case "volunteer":
      return "bg-green-100 text-green-700";
    case "member":
      return "bg-blue-100 text-blue-700";
    case "admin":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getAllowedRoleChanges = (currentRole) => {
  switch (currentRole) {
    case "member":
      return ["volunteer"];

    case "volunteer":
      return ["member", "lead", "admin"];

    case "lead":
      return ["volunteer", "admin"];

    default:
      return [];
  }
};

const getUsername = (person) => {
  return person?.users?.[0]?.username || "-";
};

const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [memberApplications, setMemberApplications] = useState([]);
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [programAssignmentCounts, setProgramAssignmentCounts] = useState({});

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [leadAssignmentType, setLeadAssignmentType] = useState("lead");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [roleModalPerson, setRoleModalPerson] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [enrollmentCarts, setEnrollmentCarts] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentModalPerson, setPaymentModalPerson] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [overrideModalOrder, setOverrideModalOrder] = useState(null);

  const [selectedPersonHasPendingCart, setSelectedPersonHasPendingCart] =
    useState(false);
  const [manualPaymentForm, setManualPaymentForm] = useState({
    payment_method: "",
    amount_received: "",
    payment_notes: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("iw_user") || "{}");
  //   const username = storedUser.username;
  //   console.log(username);
  // }, []);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("iw_user") || "{}");
      setCurrentUser(storedUser);
    } catch (error) {
      console.error("Failed to parse iw_user", error);
      setCurrentUser(null);
    }
  }, []);

  const canOverridePayments =
    currentUser?.role === "admin" &&
    OVERRIDE_ADMIN_USERNAMES.includes(currentUser?.username);

  const fetchEnrollmentCarts = async () => {
    const { data, error } = await supabase
      .from("enrollment_carts")
      .select("id, person_id, member_comments, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setEnrollmentCarts(data || []);
  };

  const checkPendingCartForPerson = async (personId) => {
    if (!personId) {
      setSelectedPersonHasPendingCart(false);
      return;
    }

    const { data, error } = await supabase
      .from("enrollment_orders")
      .select("id, cart_id, payment_status, status")
      .eq("person_id", personId)
      .eq("payment_status", "unpaid")
      .not("cart_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Pending cart check failed:", error);
      setSelectedPersonHasPendingCart(false);
      return;
    }

    setSelectedPersonHasPendingCart((data || []).length > 0);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchPeople(),
      fetchPrograms(),
      fetchProgramAssignmentCounts(),
      fetchMemberApplications(),
      fetchVolunteerApplications(),
      fetchEnrollments(),
      fetchEnrollmentCarts(),
    ]);
  };

  //   const fetchPeople = async () => {
  //     const { data, error } = await supabase
  //       .from("people")
  //       .select(
  //         `
  //         *,
  //         person_programs (
  //           id,
  //           status,
  //           role,
  //           program_id,
  //           programs (
  //             id,
  //             course_title,
  //             course_code
  //           )
  //         )
  //       `,
  //       )
  //       .in("role", ["member", "volunteer", "lead", "admin"])
  //       .order("fname");

  //     if (error) {
  //       console.error(error);
  //       return;
  //     }

  //     setPeople(data || []);
  //   };

  const fetchPeople = async () => {
    const { data, error } = await supabase
      .from("people")
      //   .select(
      //     `
      //   *,
      //   person_programs (
      //     id,
      //     status,
      //     role,
      //     program_id,
      //     programs (
      //       id,
      //       course_title,
      //       course_code
      //     )
      //   )
      // `,
      //   )
      .select(
        `
  *,
  users (
    username
  ),
  enrollment_orders (
    id,
    cart_id,
    payment_status,
    status,
    total_amount,
    transaction_id,
    payment_method,
    amount_received,
    paid_at,
    override_reason,
    overridden_at,
    created_at
  ),
  person_programs (
    id,
    status,
    role,
    program_id,
    programs (
      id,
      course_title,
      course_code
    )
  )
`,
      )
      .order("fname");

    if (error) {
      console.error(error);
      return;
    }

    setPeople(
      (data || []).filter((p) =>
        ["member", "volunteer", "lead", "admin"].includes(
          (p.role || "").trim().toLowerCase(),
        ),
      ),
    );
  };

  const fetchProgramAssignmentCounts = async () => {
    const { data, error } = await supabase
      .from("person_programs")
      .select("program_id, role, status")
      .eq("status", "current");

    if (error) {
      console.error(error);
      return;
    }

    const counts = {};

    (data || []).forEach((row) => {
      if (!counts[row.program_id]) {
        counts[row.program_id] = {
          member: 0,
          volunteer: 0,
        };
      }

      if (row.role === "member") {
        counts[row.program_id].member += 1;
      }

      if (row.role === "volunteer") {
        counts[row.program_id].volunteer += 1;
      }
    });

    setProgramAssignmentCounts(counts);
  };

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select(
        `
        id,
        course_title,
        course_code,
        category,
        level,
        lead_id,
        co_lead_id,
        member_capacity,
        volunteer_capacity,
        member_enrolled,
        volunteer_enrolled
      `,
      )
      .order("course_title");

    if (error) {
      console.error(error);
      return;
    }

    setPrograms(data || []);
  };

  const fetchMemberApplications = async () => {
    const { data, error } = await supabase
      .from("member_applications")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setMemberApplications(data || []);
  };

  const fetchVolunteerApplications = async () => {
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setVolunteerApplications(data || []);
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase.from("enrollments").select(
      `
      *,
      programs (
        id,
        course_title,
        course_code,
        category
      )
    `,
    );

    if (error) {
      console.error(error);
      return;
    }

    setEnrollments(data || []);
  };

  const getPersonDetails = (person) => {
    const email = person?.email?.toLowerCase();

    const memberApplication = memberApplications.find(
      (app) => app.email?.toLowerCase() === email,
    );

    const volunteerApplication = volunteerApplications.find(
      (app) => app.email?.toLowerCase() === email,
    );

    const memberEnrollments = enrollments.filter(
      (enrollment) => enrollment.student_id === person.id,
    );

    const memberCarts = enrollmentCarts.filter(
      (cart) => cart.person_id === person.id,
    );

    const latestMemberCart = memberCarts[0] || null;

    return {
      ...person,
      memberApplication,
      volunteerApplication,
      enrollments: memberEnrollments,
      latestMemberCart,
    };

    return {
      ...person,
      memberApplication,
      volunteerApplication,
      enrollments: memberEnrollments,
    };
  };

  const getLatestOrder = (person) => {
    return [...(person?.enrollment_orders || [])].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
    )[0];
  };

  const getPaymentStatus = (person) => {
    return getLatestOrder(person)?.payment_status || "unpaid";
  };

  const hasPaymentStatus = (person, status) => {
    const orders = person?.enrollment_orders || [];

    if (status === "paid") {
      return (
        orders.length > 0 &&
        orders.every((order) => order.payment_status === "paid")
      );
    }

    return orders.some((order) => order.payment_status === status);
  };

  const getPaymentSummary = (person) => {
    const orders = person?.enrollment_orders || [];

    const hasUnpaid = orders.some((order) => order.payment_status === "unpaid");
    const hasOverride = orders.some(
      (order) => order.payment_status === "override",
    );
    const allPaid =
      orders.length > 0 &&
      orders.every((order) => order.payment_status === "paid");

    if (hasUnpaid && hasOverride) return "UNPAID + OVERRIDE";
    if (hasUnpaid) return "UNPAID";
    if (hasOverride) return "OVERRIDE";
    if (allPaid) return "PAID";

    return "UNPAID";
  };

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const term = search.toLowerCase();

      const matchesSearch =
        person.fname?.toLowerCase().includes(term) ||
        person.lname?.toLowerCase().includes(term) ||
        person.email?.toLowerCase().includes(term) ||
        person.phone?.toLowerCase().includes(term);

      const matchesRole = roleFilter === "all" || person.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && person.is_active) ||
        (statusFilter === "inactive" && !person.is_active);

      // const matchesPayment =
      //   paymentFilter === "all" || getPaymentStatus(person) === paymentFilter;
      const matchesPayment =
        paymentFilter === "all" || hasPaymentStatus(person, paymentFilter);

      return matchesSearch && matchesRole && matchesStatus && matchesPayment;
    });
  }, [people, search, roleFilter, statusFilter, paymentFilter]);

  const counts = useMemo(() => {
    return {
      all: people.length,
      member: people.filter((p) => p.role === "member").length,
      volunteer: people.filter((p) => p.role === "volunteer").length,
      lead: people.filter((p) => p.role === "lead").length,
      admin: people.filter((p) => p.role === "admin").length,
      active: people.filter((p) => p.is_active).length,
      inactive: people.filter((p) => !p.is_active).length,
      // paid: people.filter((p) => getPaymentStatus(p) === "paid").length,
      // unpaid: people.filter((p) => getPaymentStatus(p) === "unpaid").length,
      // override: people.filter((p) => getPaymentStatus(p) === "override").length,
      paid: people.filter((p) => hasPaymentStatus(p, "paid")).length,
      unpaid: people.filter((p) => hasPaymentStatus(p, "unpaid")).length,
      override: people.filter((p) => hasPaymentStatus(p, "override")).length,
    };
  }, [people]);

  const toggleActive = async (person) => {
    const { error } = await supabase
      .from("people")
      .update({ is_active: !person.is_active })
      .eq("id", person.id);

    if (error) {
      alert(error.message);
      return;
    }

    setPeople((prev) =>
      prev.map((p) =>
        p.id === person.id ? { ...p, is_active: !p.is_active } : p,
      ),
    );

    setSelectedPerson((prev) =>
      prev?.id === person.id ? { ...prev, is_active: !prev.is_active } : prev,
    );
  };

  const openRoleModal = (person) => {
    const assignedLeadPrograms = programs.filter(
      (program) =>
        program.lead_id === person.id || program.co_lead_id === person.id,
    );

    setRoleModalPerson({
      ...person,
      assignedLeadPrograms,
    });

    setNewRole(person.role);
  };

  const updateRole = async () => {
    if (!roleModalPerson) return;

    if (
      roleModalPerson.role === "lead" &&
      newRole !== "lead" &&
      roleModalPerson.assignedLeadPrograms?.length > 0
    ) {
      alert(
        "This lead is still assigned to one or more programs. Remove them as lead/co-lead first.",
      );
      return;
    }

    const { error } = await supabase
      .from("people")
      .update({ role: newRole })
      .eq("id", roleModalPerson.id);

    if (error) {
      alert(error.message);
      return;
    }

    setRoleModalPerson(null);
    await fetchPeople();
  };

  // const refreshSelectedPerson = async (personId) => {
  //   await Promise.all([
  //     fetchPeople(),
  //     fetchPrograms(),
  //     fetchMemberApplications(),
  //     fetchVolunteerApplications(),
  //     fetchEnrollments(),
  //   ]);

  //   const { data: personData, error } = await supabase
  //     .from("people")
  //     .select(
  //       `
  //     *,
  //     person_programs (
  //       id,
  //       status,
  //       role,
  //       program_id,
  //       programs (
  //         id,
  //         course_title,
  //         course_code
  //       )
  //     )
  //   `,
  //     )
  //     .eq("id", personId)
  //     .single();

  //   if (error || !personData) return;

  //   const { data: memberApps } = await supabase
  //     .from("member_applications")
  //     .select("*");

  //   const { data: volunteerApps } = await supabase
  //     .from("volunteer_applications")
  //     .select("*");

  //   const { data: enrollmentData } = await supabase
  //     .from("enrollments")
  //     .select(
  //       `
  //     *,
  //     programs (
  //       id,
  //       course_title,
  //       course_code,
  //       category
  //     )
  //   `,
  //     )
  //     .eq("student_id", personId);

  //   const email = personData.email?.toLowerCase();

  //   setSelectedPerson({
  //     ...personData,
  //     memberApplication:
  //       memberApps?.find((app) => app.email?.toLowerCase() === email) || null,
  //     volunteerApplication:
  //       volunteerApps?.find((app) => app.email?.toLowerCase() === email) ||
  //       null,
  //     enrollments: enrollmentData || [],
  //   });
  // };

  const refreshSelectedPerson = async (personId) => {
    await Promise.all([
      fetchPeople(),
      fetchPrograms(),
      fetchMemberApplications(),
      fetchVolunteerApplications(),
      fetchEnrollments(),
      fetchEnrollmentCarts(),
      fetchProgramAssignmentCounts(),
    ]);

    const { data: personData, error } = await supabase
      .from("people")
      .select(
        `
      *,
      users (
        username
      ),
      enrollment_orders (
        id,
        cart_id,
        payment_status,
        status,
        total_amount,
        transaction_id,
        payment_method,
        amount_received,
        paid_at,
        override_reason,
        overridden_at,
        created_at
      ),
      person_programs (
        id,
        status,
        role,
        program_id,
        programs (
          id,
          course_title,
          course_code
        )
      )
    `,
      )
      .eq("id", personId)
      .single();

    if (error || !personData) return;

    const email = personData.email?.toLowerCase();

    const { data: memberApps } = await supabase
      .from("member_applications")
      .select("*");

    const { data: volunteerApps } = await supabase
      .from("volunteer_applications")
      .select("*");

    const { data: enrollmentData } = await supabase
      .from("enrollments")
      .select(
        `
      *,
      programs (
        id,
        course_title,
        course_code,
        category
      )
    `,
      )
      .eq("student_id", personId);

    const { data: cartData } = await supabase
      .from("enrollment_carts")
      .select("id, person_id, member_comments, created_at")
      .eq("person_id", personId)
      .order("created_at", { ascending: false });

    setSelectedPerson({
      ...personData,
      memberApplication:
        memberApps?.find((app) => app.email?.toLowerCase() === email) || null,
      volunteerApplication:
        volunteerApps?.find((app) => app.email?.toLowerCase() === email) ||
        null,
      enrollments: enrollmentData || [],
      latestMemberCart: cartData?.[0] || null,
    });
  };

  const hasCompletedVolunteerInterestForm = (person) =>
    person?.volunteerApplication?.interest_form_completed === true ||
    person?.volunteerApplication?.interest_form_completed === "true";

  // const markMemberAsOverride = async (person) => {
  //   if (!canOverridePayments) {
  //     alert("You do not have permission to override payments.");
  //     return;
  //   }

  //   const latestOrder = getLatestOrder(person);

  //   if (!latestOrder) {
  //     alert("No enrollment order found for this member.");
  //     return;
  //   }

  //   const reason = window.prompt("Enter override reason:");
  //   if (!reason?.trim()) return;

  //   const { error } = await supabase
  //     .from("enrollment_orders")
  //     .update({
  //       payment_status: "override",
  //       override_reason: reason.trim(),
  //       overridden_by: currentUser.id,
  //       overridden_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     })
  //     .eq("id", latestOrder.id);

  //   if (error) {
  //     alert(error.message);
  //     return;
  //   }

  //   await refreshSelectedPerson(person.id);

  //   alert("Member marked as override.");
  // };

  const markMemberAsOverride = async (person) => {
    if (!canOverridePayments) {
      alert("You do not have permission to override payments.");
      return;
    }

    // const latestOrder = getLatestOrder(person);
    const latestOrder = overrideModalOrder || getLatestOrder(person);

    if (!latestOrder?.id || !latestOrder?.cart_id) {
      alert("No pending enrollment order/cart found for this member.");
      return;
    }

    const reason = window.prompt("Enter override reason:");
    if (!reason?.trim()) return;

    const { data: cartItems, error: cartError } = await supabase
      .from("enrollment_cart_items")
      .select("program_id")
      .eq("cart_id", latestOrder.cart_id)
      .eq("person_id", person.id);

    if (cartError) {
      alert(cartError.message);
      return;
    }

    if (!cartItems?.length) {
      alert("No selected programs found in this member's cart.");
      return;
    }

    const { error: orderError } = await supabase
      .from("enrollment_orders")
      .update({
        payment_status: "override",
        override_reason: reason.trim(),
        overridden_by: currentUser.id,
        overridden_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", latestOrder.id);

    if (orderError) {
      alert(orderError.message);
      return;
    }

    const enrollmentRows = cartItems.map((item) => ({
      student_id: person.id,
      program_id: item.program_id,
      order_id: latestOrder.id,
      enrollment_status: "preferred",
    }));

    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .upsert(enrollmentRows, {
        onConflict: "student_id,program_id",
        ignoreDuplicates: true,
      });

    if (enrollmentError) {
      alert(enrollmentError.message);
      return;
    }

    const { error: cartUpdateError } = await supabase
      .from("enrollment_carts")
      .update({
        status: "completed",
        payment_status: "override",
        current_step: "complete",
        highest_step: "complete",
        finalized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", latestOrder.cart_id);

    if (cartUpdateError) {
      alert(cartUpdateError.message);
      return;
    }

    await refreshSelectedPerson(person.id);
    await fetchPeople();

    setOverrideModalOrder(null);

    alert("Member marked as override and enrollment preferences were created.");
  };

  const markOverrideAsPaid = async () => {
    if (!paymentModalPerson || !canOverridePayments) return;

    // const latestOrder = getLatestOrder(paymentModalPerson);
    const latestOrder = paymentModalOrder;

    if (!latestOrder) {
      alert("No enrollment order selected.");
      return;
    }

    if (
      !manualPaymentForm.payment_method.trim() ||
      !manualPaymentForm.amount_received
    ) {
      alert("Payment method and amount received are required.");
      return;
    }

    const { error } = await supabase
      .from("enrollment_orders")
      .update({
        payment_status: "paid",
        status: "completed",
        transaction_id: generateManualTransactionId(
          manualPaymentForm.payment_method,
          latestOrder.id.slice(0, 8),
        ),
        payment_method: manualPaymentForm.payment_method.trim(),
        amount_received: Number(manualPaymentForm.amount_received),
        payment_notes: manualPaymentForm.payment_notes.trim(),
        manual_payment_entered_by: currentUser.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", latestOrder.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (latestOrder.cart_id) {
      await supabase
        .from("enrollment_carts")
        .update({
          status: "completed",
          payment_status: "paid",
          current_step: "complete",
          highest_step: "complete",
          finalized_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", latestOrder.cart_id);
    }

    const personId = paymentModalPerson.id;

    setPaymentModalPerson(null);
    setPaymentModalOrder(null);
    setManualPaymentForm({
      payment_method: "",
      amount_received: "",
      payment_notes: "",
    });

    await refreshSelectedPerson(personId);
    await fetchPeople();

    alert("Payment marked as paid.");
  };

  const assignProgramToPerson = async (programIdOverride = null) => {
    const programId = programIdOverride || selectedProgramId;
    if (!selectedPerson || !programId) return;

    if (
      selectedPerson.role === "volunteer" &&
      selectedPerson.volunteerApplication?.interest_form_completed !== true
    ) {
      alert(
        "This volunteer has not completed the interest form yet. Please ask them to complete it before assigning a program.",
      );
      return;
    }

    if (selectedPerson.role === "member") {
      const { data: paidOrder, error: paidOrderError } = await supabase
        .from("enrollment_orders")
        .select("id")
        .eq("person_id", selectedPerson.id)
        // .eq("payment_status", "paid")
        .in("payment_status", ["paid", "override"])
        .limit(1)
        .maybeSingle();

      if (paidOrderError) {
        alert(paidOrderError.message);
        return;
      }

      if (!paidOrder) {
        alert(
          "This member has not paid and does not have an admin override. Please mark them as override before assigning a program.",
        );
        return;
      }
    }

    if (selectedPerson.role === "lead") {
      await assignLeadToProgram();
      return;
    }

    const existingAssignments = selectedPerson.person_programs || [];

    const alreadyAssigned = existingAssignments.some(
      (assignment) => String(assignment.program_id) === String(programId),
    );

    if (alreadyAssigned) {
      alert("This program is already assigned.");
      return;
    }

    // if (existingAssignments.length >= 3) {
    //   alert("This user already has the maximum of 3 assigned programs.");
    //   return;
    // }

    // const selectedProgram = programs.find((p) => p.id === programId);
    // const selectedProgram = programs.find(
    //   (p) => String(p.id) === String(programId),
    // );

    // if (!selectedProgram) {
    //   alert("Program not found.");
    //   return;
    // }
    const selectedProgram = programs.find(
      (p) => String(p.id) === String(programId),
    );

    if (!selectedProgram) {
      alert("Program not found.");
      return;
    }

    const isVocational =
      selectedPerson.role === "member" &&
      selectedProgram.category?.toLowerCase() === "vocational";

    if (isVocational) {
      const vocationalAssignments = existingAssignments.filter((assignment) => {
        const assignedProgram = programs.find(
          (p) => String(p.id) === String(assignment.program_id),
        );

        return assignedProgram?.category?.toLowerCase() === "vocational";
      });

      if (vocationalAssignments.length >= 3) {
        alert("This member already has the maximum of 3 vocational programs.");
        return;
      }
    }

    const enrolledColumn =
      selectedPerson.role === "member"
        ? "member_enrolled"
        : "volunteer_enrolled";

    const capacityColumn =
      selectedPerson.role === "member"
        ? "member_capacity"
        : "volunteer_capacity";

    const currentEnrolled = selectedProgram[enrolledColumn] || 0;
    const capacity = selectedProgram[capacityColumn] || 0;

    if (capacity > 0 && currentEnrolled >= capacity) {
      const override = window.confirm(
        `${selectedProgram.course_title} appears full.\n\nCapacity: ${capacity}\nAssigned: ${currentEnrolled}\n\nPress OK to override and continue.`,
      );

      if (!override) return;
    }

    const { error } = await supabase.from("person_programs").insert({
      person_id: selectedPerson.id,
      program_id: programId,
      status: "current",
      role: selectedPerson.role,
    });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase
      .from("programs")
      .update({
        [enrolledColumn]: currentEnrolled + 1,
      })
      .eq("id", programId);

    setSelectedProgramId("");
    await refreshSelectedPerson(selectedPerson.id);
  };

  const assignLeadToProgram = async () => {
    if (!selectedPerson || !selectedProgramId) return;

    const column = leadAssignmentType === "lead" ? "lead_id" : "co_lead_id";

    const { error } = await supabase
      .from("programs")
      .update({
        [column]: selectedPerson.id,
      })
      .eq("id", selectedProgramId);

    if (error) {
      alert(error.message);
      return;
    }

    setSelectedProgramId("");
    await fetchPrograms();
    alert("Lead assignment updated.");
  };

  const removeProgramAssignment = async (assignment) => {
    if (!selectedPerson) return;

    const confirmed = window.confirm(
      `Remove ${assignment.programs?.course_title || "this program"} from ${formatName(
        selectedPerson,
      )}?`,
    );

    if (!confirmed) return;

    const selectedProgram = programs.find(
      (p) => String(p.id) === String(assignment.program_id),
    );

    const { error } = await supabase
      .from("person_programs")
      .delete()
      .eq("id", assignment.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (selectedProgram) {
      const enrolledColumn =
        assignment.role === "member" ? "member_enrolled" : "volunteer_enrolled";

      await supabase
        .from("programs")
        .update({
          [enrolledColumn]: Math.max(
            0,
            (selectedProgram[enrolledColumn] || 0) - 1,
          ),
        })
        .eq("id", assignment.program_id);
    }

    await refreshSelectedPerson(selectedPerson.id);
  };

  const removeLeadFromProgram = async (program, type) => {
    const column = type === "lead" ? "lead_id" : "co_lead_id";

    const confirmed = window.confirm(
      `Remove ${formatName(selectedPerson)} as ${type} from ${program.course_title}?`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("programs")
      .update({ [column]: null })
      .eq("id", program.id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchPrograms();
  };

  // const openProfile = (person) => {
  //   setSelectedPerson(getPersonDetails(person));
  //   setSelectedProgramId("");
  // };
  const openProfile = (person) => {
    const details = getPersonDetails(person);

    setSelectedPerson(details);
    setSelectedProgramId("");

    checkPendingCartForPerson(person.id);
  };

  const currentLeadPrograms = selectedPerson
    ? programs.filter((program) => program.lead_id === selectedPerson.id)
    : [];

  const currentCoLeadPrograms = selectedPerson
    ? programs.filter((program) => program.co_lead_id === selectedPerson.id)
    : [];

  const availableProgramsForSelectedPerson = programs.filter((program) => {
    if (!selectedPerson) return false;

    if (selectedPerson.role === "lead") return true;

    // return !selectedPerson.person_programs?.some(
    //   (assignment) => assignment.program_id === program.id,
    // );
    return !selectedPerson.person_programs?.some(
      (assignment) => String(assignment.program_id) === String(program.id),
    );
  });

  const hasPendingCart =
    selectedPerson?.enrollment_orders?.some(
      (order) => order.payment_status === "unpaid" && order.cart_id,
    ) || false;

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">People Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage members, volunteers, leads, roles, status, and program
            assignments.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {ROLE_FILTERS.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-xl border transition ${
              roleFilter === role
                ? "bg-[#0f5b54] text-white border-[#0f5b54]"
                : "bg-white border-gray-300"
            }`}
          >
            {role === "all"
              ? `All (${counts.all})`
              : `${role.charAt(0).toUpperCase() + role.slice(1)} (${counts[role]})`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl border transition ${
              statusFilter === status
                ? "bg-[#0f5b54] text-white border-[#0f5b54]"
                : "bg-white border-gray-300"
            }`}
          >
            {status === "all"
              ? "All Status"
              : status === "active"
                ? `Active (${counts.active})`
                : `Inactive (${counts.inactive})`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {PAYMENT_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setPaymentFilter(status)}
            className={`px-4 py-2 rounded-xl border transition ${
              paymentFilter === status
                ? "bg-[#0f5b54] text-white border-[#0f5b54]"
                : "bg-white border-gray-300"
            }`}
          >
            {status === "all"
              ? "All Payments"
              : `${status.charAt(0).toUpperCase() + status.slice(1)} (${counts[status]})`}
          </button>
        ))}
      </div>

      {filteredPeople.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPeople.map((person) => {
            const assignedPrograms = person.person_programs || [];

            return (
              <div
                key={person.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border p-5 flex flex-col"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {formatName(person)}
                    </h2>
                    <p className="text-sm text-gray-500">{person.email}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge(
                      person.role,
                    )}`}
                  >
                    {person.role}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>{person.phone || "No phone"}</p>

                  <p>
                    {assignedPrograms.length > 0
                      ? assignedPrograms
                          .map((p) => p.programs?.course_title)
                          .filter(Boolean)
                          .join(", ")
                      : person.role === "lead"
                        ? "Lead assignment managed in modal"
                        : "No programs assigned"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => openProfile(person)}
                    className="flex-1 bg-teal-800 text-white py-2 rounded-lg text-sm hover:bg-teal-700"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => toggleActive(person)}
                    className={`px-3 py-2 rounded-lg text-xs ${
                      person.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {person.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPerson && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-2xl p-6 max-h-[88vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <div className="flex justify-between items-start gap-4 mb-6 pr-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {formatName(selectedPerson)}
                </h2>
                <p className="text-gray-500">{selectedPerson.email}</p>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge(
                    selectedPerson.role,
                  )}`}
                >
                  {selectedPerson.role}
                </span>

                <button
                  onClick={() => openRoleModal(selectedPerson)}
                  className="px-3 py-1 rounded-full text-xs bg-[#0f5b54] text-white"
                >
                  Change Role
                </button>

                <button
                  onClick={() => toggleActive(selectedPerson)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedPerson.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {selectedPerson.is_active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <Section title="Basic Information">
                <Grid>
                  <Field label="First Name" value={selectedPerson.fname} />
                  <Field label="Last Name" value={selectedPerson.lname} />
                  <Field label="Email" value={selectedPerson.email} />
                  <Field label="Phone" value={selectedPerson.phone} />
                  <Field label="Address" value={selectedPerson.address} />
                  <Field label="Date of Birth" value={selectedPerson.dob} />
                  <Field label="Age" value={selectedPerson.age} />
                  <Field label="Role" value={selectedPerson.role} />
                  <Field label="Active" value={selectedPerson.is_active} />
                  <Field
                    label="Profile Type"
                    value={selectedPerson.profile_type}
                  />
                </Grid>
              </Section>

              {selectedPerson.role === "member" && (
                <>
                  <Section title="Member Application Details">
                    <Grid>
                      <Field
                        label="Grade"
                        value={selectedPerson.memberApplication?.grade}
                      />
                      <Field
                        label="GED"
                        value={selectedPerson.memberApplication?.ged}
                      />
                      <Field
                        label="Training Courses"
                        value={
                          selectedPerson.memberApplication?.training_courses
                        }
                      />
                      <Field
                        label="Parent 1"
                        value={`${selectedPerson.memberApplication?.p1_fname || ""} ${
                          selectedPerson.memberApplication?.p1_lname || ""
                        }`}
                      />
                      <Field
                        label="Parent 1 Phone"
                        value={selectedPerson.memberApplication?.p1_phone1}
                      />
                      <Field
                        label="Emergency Contact"
                        value={`${selectedPerson.memberApplication?.e_fname || ""} ${
                          selectedPerson.memberApplication?.e_lname || ""
                        }`}
                      />
                      <Field
                        label="Emergency Phone"
                        value={selectedPerson.memberApplication?.e_phone1}
                      />
                      <Field
                        label="Username"
                        value={getUsername(selectedPerson)}
                      />
                    </Grid>
                  </Section>
                  {canOverridePayments && (
                    <Section title="Admin Payment Status">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-700">
                          Current Payment Status:{" "}
                          <b>
                            {/* {getPaymentStatus(selectedPerson).toUpperCase()} */}
                            {getPaymentSummary(selectedPerson)}
                          </b>
                        </span>

                        {hasPaymentStatus(selectedPerson, "unpaid") && (
                          <button
                            onClick={() => markMemberAsOverride(selectedPerson)}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Mark as Override
                          </button>
                        )}

                        {/* {getPaymentStatus(selectedPerson) === "override" && (
                          <button
                            onClick={() =>
                              setPaymentModalPerson(selectedPerson)
                            }
                            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Mark as Paid
                          </button>
                        )} */}
                      </div>
                    </Section>
                  )}
                  <Section title="Transactions">
                    {selectedPerson.enrollment_orders?.length > 0 ? (
                      <div className="space-y-3">
                        {[...selectedPerson.enrollment_orders]
                          .sort(
                            (a, b) =>
                              new Date(b.created_at || 0) -
                              new Date(a.created_at || 0),
                          )
                          .map((order) => (
                            <div
                              key={order.id}
                              className="bg-gray-50 border rounded-lg p-3"
                            >
                              <div className="flex justify-between gap-3 flex-wrap">
                                <p className="font-semibold">
                                  {order.payment_status?.toUpperCase() ||
                                    "UNPAID"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  $
                                  {order.amount_received ||
                                    order.total_amount ||
                                    0}
                                </p>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
                                <p>
                                  <b>Transaction ID:</b>{" "}
                                  {order.transaction_id || "-"}
                                </p>
                                <p>
                                  <b>Payment Method:</b>{" "}
                                  {order.payment_method || "-"}
                                </p>
                                <p>
                                  <b>Paid At:</b>{" "}
                                  {order.paid_at
                                    ? new Date(order.paid_at).toLocaleString()
                                    : "-"}
                                </p>
                                <p>
                                  <b>Created At:</b>{" "}
                                  {order.created_at
                                    ? new Date(
                                        order.created_at,
                                      ).toLocaleString()
                                    : "-"}
                                </p>
                                <p>
                                  <b>Override Reason:</b>{" "}
                                  {order.override_reason || "-"}
                                </p>
                                <p>
                                  <b>Notes:</b> {order.payment_notes || "-"}
                                </p>
                              </div>
                              {canOverridePayments &&
                                order.payment_status === "unpaid" && (
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      onClick={() => {
                                        setOverrideModalOrder(order);
                                        markMemberAsOverride(selectedPerson);
                                      }}
                                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                      Mark This Transaction as Override
                                    </button>
                                  </div>
                                )}
                              {canOverridePayments &&
                                order.payment_status === "override" && (
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      onClick={() => {
                                        setPaymentModalPerson(selectedPerson);
                                        setPaymentModalOrder(order);
                                        setManualPaymentForm({
                                          payment_method: "",
                                          amount_received:
                                            order.total_amount || "",
                                          payment_notes: "",
                                        });
                                      }}
                                      className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                      Mark This Transaction as Paid
                                    </button>
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No transactions found.
                      </p>
                    )}
                  </Section>
                  {/* <Section title="Member Enrollment Preferences">
                    {selectedPerson.enrollments?.length > 0 ? (
                      selectedPerson.enrollments.map((enrollment, index) => {
                        const program = programs.find(
                          (p) =>
                            p.course_title?.trim().toLowerCase() ===
                            programName?.trim().toLowerCase(),
                        );

                        return (
                          <div
                            key={programName}
                            className="flex justify-between mb-3 items-center bg-gray-50 p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-semibold">{programName}</p>
                              <p className="text-xs text-gray-500">
                                {program?.course_code || "Program not found"}
                              </p>
                            </div>

                            <button
                              disabled={
                                !program ||
                                !["paid", "override"].includes(
                                  getPaymentStatus(selectedPerson),
                                )
                              }
                              onClick={() => assignProgramToPerson(program.id)}
                              className="bg-teal-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Assign Choice #{index + 1}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-red-600">
                        This member has not completed payment and submitted
                        enrollment preferences yet. Please ask them to complete
                        enrollment before assigning a program.
                      </p>
                    )}
                  </Section> */}
                  {/* <Section title="Member Enrollment Preferences">
                    {selectedPerson.enrollments?.length > 0 ? (
                      selectedPerson.enrollments.map((enrollment, index) => {
                        const program = enrollment.programs;

                        return (
                          <div
                            key={enrollment.id}
                            className="flex justify-between mb-3 items-center bg-gray-50 p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-semibold">
                                {program?.course_title || "Unknown Program"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {program?.course_code || "Program not found"}
                              </p>
                            </div>

                            <button
                              disabled={
                                !program?.id ||
                                !["paid", "override"].includes(
                                  getPaymentStatus(selectedPerson),
                                )
                              }
                              onClick={() => assignProgramToPerson(program.id)}
                              className="bg-teal-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Assign Choice #{index + 1}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      // <p className="text-xs text-red-600">
                      //   This member has not completed payment and submitted
                      //   enrollment preferences yet. Please ask them to complete
                      //   enrollment before assigning a program.
                      // </p>
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        This member has selected programs but has not completed
                        payment yet, so their program selections cannot be
                        viewed here. If you need to review or assign these
                        selected programs before payment is received, mark the
                        payment status as{" "}
                        <span className="font-semibold">Override</span>. Their
                        selected programs will then appear here for assignment.
                      </p>
                    )}
                  </Section> */}
                  <Section title="Member Enrollment Preferences">
                    {selectedPerson.enrollments?.length > 0 ? (
                      selectedPerson.enrollments.map((enrollment, index) => {
                        const program = enrollment.programs;

                        return (
                          <div
                            key={enrollment.id}
                            className="flex justify-between mb-3 items-center bg-gray-50 p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-semibold">
                                {program?.course_title || "Unknown Program"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {program?.course_code || "Program not found"}
                              </p>
                            </div>

                            <button
                              disabled={
                                !program?.id ||
                                (!hasPaymentStatus(selectedPerson, "paid") &&
                                  !hasPaymentStatus(selectedPerson, "override"))
                              }
                              onClick={() => assignProgramToPerson(program.id)}
                              className="bg-teal-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Assign Choice #{index + 1}
                            </button>
                          </div>
                        );
                      })
                    ) : selectedPersonHasPendingCart ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800 font-medium">
                          This member has already selected their programs, but
                          payment is still pending.
                        </p>

                        <p className="text-sm text-amber-700 mt-2">
                          To review and assign the selected programs before
                          payment is received, mark the payment status as{" "}
                          <strong>Override</strong>. Once marked as Override,
                          the selected programs will appear here for assignment.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">
                          This member has not submitted any enrollment
                          preferences yet. Please ask them to complete
                          enrollment before assigning programs.
                        </p>
                      </div>
                    )}
                  </Section>
                  <Section title="Member Additional Program Requests">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedPerson.latestMemberCart?.member_comments ||
                        "No comments provided."}
                    </p>
                  </Section>
                </>
              )}

              {/* {selectedPerson.role === "volunteer" && (
                <Section title="Volunteer Application Details">
                  <Grid>
                    <Field
                      label="Weekend Commitments"
                      value={
                        selectedPerson.volunteerApplication?.weekend_commitments
                      }
                    />
                    <Field
                      label="Learning Styles"
                      value={
                        selectedPerson.volunteerApplication?.learning_styles
                      }
                    />
                    <Field
                      label="Interest Form Completed"
                      value={
                        selectedPerson.volunteerApplication
                          ?.interest_form_completed
                      }
                    />
                    <Field
                      label="Parent"
                      value={`${
                        selectedPerson.volunteerApplication
                          ?.parent_first_name || ""
                      } ${
                        selectedPerson.volunteerApplication?.parent_last_name ||
                        ""
                      }`}
                    />
                    <Field
                      label="Emergency Contact"
                      value={`${
                        selectedPerson.volunteerApplication
                          ?.emergency_first_name || ""
                      } ${
                        selectedPerson.volunteerApplication
                          ?.emergency_last_name || ""
                      }`}
                    />
                    <Field
                      label="Emergency Phone"
                      value={
                        selectedPerson.volunteerApplication?.emergency_phone_1
                      }
                    />
                  </Grid>
                </Section>
              )} */}
              {selectedPerson.role === "volunteer" && (
                <>
                  <Section title="Volunteer Application Details">
                    <Grid>
                      <Field
                        label="Weekend Commitments"
                        value={
                          selectedPerson.volunteerApplication
                            ?.weekend_commitments
                        }
                      />
                      <Field
                        label="Learning Styles"
                        value={
                          selectedPerson.volunteerApplication?.learning_styles
                        }
                      />
                      <Field
                        label="Interest Form Completed"
                        value={
                          selectedPerson.volunteerApplication
                            ?.interest_form_completed
                        }
                      />
                      <Field
                        label="Parent"
                        value={`${
                          selectedPerson.volunteerApplication
                            ?.parent_first_name || ""
                        } ${
                          selectedPerson.volunteerApplication
                            ?.parent_last_name || ""
                        }`}
                      />
                      <Field
                        label="Emergency Contact"
                        value={`${
                          selectedPerson.volunteerApplication
                            ?.emergency_first_name || ""
                        } ${
                          selectedPerson.volunteerApplication
                            ?.emergency_last_name || ""
                        }`}
                      />
                      <Field
                        label="Emergency Phone"
                        value={
                          selectedPerson.volunteerApplication?.emergency_phone_1
                        }
                      />
                    </Grid>
                  </Section>

                  <Section title="Volunteer Program Preferences">
                    {!hasCompletedVolunteerInterestForm(selectedPerson) && (
                      <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                        <p className="font-semibold">
                          Interest form not submitted
                        </p>
                        <p className="mt-1">
                          These preferences were saved automatically as a draft.
                          Please ask the volunteer to submit the interest form
                          before assigning a program.
                        </p>
                      </div>
                    )}
                    {selectedPerson.volunteerApplication?.selected_programs &&
                    Object.keys(
                      selectedPerson.volunteerApplication.selected_programs,
                    ).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(
                          selectedPerson.volunteerApplication.selected_programs,
                        )
                          .sort((a, b) => Number(a[1]) - Number(b[1]))
                          .map(([programId, rank]) => {
                            const program = programs.find(
                              (p) => String(p.id) === String(programId),
                            );

                            return (
                              <div
                                key={programId}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                              >
                                <div>
                                  <p className="font-semibold">
                                    {program?.course_title || "Unknown Program"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {program?.course_code || ""}
                                  </p>
                                </div>

                                <button
                                  onClick={() =>
                                    assignProgramToPerson(programId)
                                  }
                                  // disabled={
                                  //   selectedPerson.volunteerApplication
                                  //     ?.interest_form_completed !== true
                                  // }
                                  disabled={
                                    !hasCompletedVolunteerInterestForm(
                                      selectedPerson,
                                    )
                                  }
                                  className="bg-teal-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Assign Choice #{rank}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">
                        This volunteer has not completed the interest form yet.
                        Please ask them to complete it before assigning a
                        program.
                      </p>
                    )}
                  </Section>
                  <Section title="Volunteer Additional Program Requests">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedPerson.volunteerApplication
                        ?.additional_comments || "No comments provided."}
                    </p>
                  </Section>
                </>
              )}

              {selectedPerson.role === "lead" && (
                <Section title="Lead Assignments">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">Lead Programs</h4>

                      {currentLeadPrograms.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No lead programs assigned.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {currentLeadPrograms.map((program) => (
                            <div
                              key={program.id}
                              className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-semibold">
                                  {program.course_title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {program.course_code}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  removeLeadFromProgram(program, "lead")
                                }
                                className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Co-Lead Programs</h4>

                      {currentCoLeadPrograms.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No co-lead programs assigned.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {currentCoLeadPrograms.map((program) => (
                            <div
                              key={program.id}
                              className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-semibold">
                                  {program.course_title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {program.course_code}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  removeLeadFromProgram(program, "co_lead")
                                }
                                className="text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Section>
              )}

              {selectedPerson.role !== "lead" && (
                <Section title="Assigned Programs">
                  {selectedPerson.person_programs?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPerson.person_programs.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-semibold">
                              {assignment.programs?.course_title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {assignment.programs?.course_code}
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              {assignment.status}
                            </span>
                          </div>

                          {selectedPerson.is_active && (
                            <button
                              onClick={() =>
                                removeProgramAssignment(assignment)
                              }
                              className="text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No programs assigned.
                    </p>
                  )}
                </Section>
              )}

              {selectedPerson.is_active && (
                <Section
                  title={
                    selectedPerson.role === "lead"
                      ? "Assign Lead / Co-Lead to Program"
                      : "Assign Program"
                  }
                >
                  <div className="flex flex-col md:flex-row gap-3">
                    {selectedPerson.role === "lead" && (
                      <select
                        value={leadAssignmentType}
                        onChange={(e) => setLeadAssignmentType(e.target.value)}
                        className="border p-2 rounded md:w-56"
                      >
                        <option value="lead">Lead</option>
                        <option value="co_lead">Co-Lead</option>
                      </select>
                    )}

                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      className="border p-2 rounded flex-1"
                    >
                      <option value="">Select Program</option>

                      {availableProgramsForSelectedPerson.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.course_title} ({program.course_code})
                          {/* {selectedPerson.role === "member"
                            ? ` • ${Math.max(
                                0,
                                (program.member_capacity || 0) -
                                  (program.member_enrolled || 0),
                              )} member seats left`
                            : selectedPerson.role === "volunteer"
                              ? ` • ${Math.max(
                                  0,
                                  (program.volunteer_capacity || 0) -
                                    (program.volunteer_enrolled || 0),
                                )} volunteer seats left`
                              : ""} */}
                          {selectedPerson.role === "member"
                            ? ` • ${Math.max(
                                0,
                                (program.member_capacity || 0) -
                                  (programAssignmentCounts[program.id]
                                    ?.member || 0),
                              )} member seats left`
                            : selectedPerson.role === "volunteer"
                              ? ` • ${Math.max(
                                  0,
                                  (program.volunteer_capacity || 0) -
                                    (programAssignmentCounts[program.id]
                                      ?.volunteer || 0),
                                )} volunteer seats left`
                              : ""}
                        </option>
                      ))}
                    </select>

                    {/* <button
                      onClick={() => assignProgramToPerson()}
                      className="bg-teal-800 text-white px-5 py-2 rounded"
                    >
                      Assign
                    </button> */}
                    <button
                      // disabled={
                      //   selectedPerson.role === "volunteer" &&
                      //   selectedPerson.volunteerApplication
                      //     ?.interest_form_completed !== true
                      // }
                      disabled={
                        (selectedPerson.role === "volunteer" &&
                          selectedPerson.volunteerApplication
                            ?.interest_form_completed !== true) ||
                        // (selectedPerson.role === "member" &&
                        //   !selectedPerson.enrollments?.length)
                        (selectedPerson.role === "member" &&
                          !["paid", "override"].includes(
                            getPaymentStatus(selectedPerson),
                          ))
                      }
                      onClick={() => assignProgramToPerson()}
                      className="bg-teal-800 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Assign
                    </button>
                  </div>
                </Section>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentModalPerson && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70] px-4"
          onClick={() => {
            setPaymentModalPerson(null);
            setPaymentModalOrder(null);
          }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Mark Payment as Paid</h2>

            <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Payment method, e.g. Cash, Check, Zelle"
              value={manualPaymentForm.payment_method}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({
                  ...prev,
                  payment_method: e.target.value,
                }))
              }
            />

            <input
              type="number"
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Amount received"
              value={manualPaymentForm.amount_received}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({
                  ...prev,
                  amount_received: e.target.value,
                }))
              }
            />

            <textarea
              className="w-full border rounded-lg p-3 mb-4"
              placeholder="Payment notes, check number, reference, etc."
              value={manualPaymentForm.payment_notes}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({
                  ...prev,
                  payment_notes: e.target.value,
                }))
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPaymentModalPerson(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={markOverrideAsPaid}
                className="px-4 py-2 bg-[#0f5b54] text-white rounded-lg"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {roleModalPerson && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4"
          onClick={() => setRoleModalPerson(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Change Role</h2>

            <div className="mb-4">
              <p className="font-medium">{formatName(roleModalPerson)}</p>
              <p className="text-gray-500 text-sm">{roleModalPerson.email}</p>
            </div>

            {/* <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6"
            >
              <option value="member">Member</option>
              <option value="volunteer">Volunteer</option>
              <option value="lead">Lead</option>
            </select> */}
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6"
            >
              <option value={roleModalPerson.role}>
                Current: {roleModalPerson.role}
              </option>

              {getAllowedRoleChanges(roleModalPerson.role).map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            {roleModalPerson.assignedLeadPrograms?.length > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="font-medium mb-2">Lead Assignments</p>

                {roleModalPerson.assignedLeadPrograms.map((program) => (
                  <p key={program.id}>• {program.course_title}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRoleModalPerson(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateRole}
                className="px-4 py-2 bg-[#0f5b54] text-white rounded-lg"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleManagement;
