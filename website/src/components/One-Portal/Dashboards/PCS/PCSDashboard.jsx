import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-white border rounded-2xl p-6 shadow-sm">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <p className="text-3xl font-bold text-[#0f5b54]">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

const PCPDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalPeople: 0,
    members: 0,
    volunteers: 0,
    leads: 0,
    notStarted: 0,
    inProgress: 0,
    forReview: 0,
    published: 0,
    released: 0,
    totalOPDs: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);

    const { data: people, error: peopleError } = await supabase
      .from("people")
      .select("id, role, opd_status, opd_released, is_active")
      .in("role", ["member", "volunteer", "lead"])
      .eq("is_active", true);

    if (peopleError) {
      console.error(peopleError);
      setLoading(false);
      return;
    }

    const { data: opds, error: opdError } = await supabase
      .from("opd_profiles")
      .select("id, status, academic_year");

    if (opdError) {
      console.error(opdError);
    }

    const rows = people || [];

    setMetrics({
      totalPeople: rows.length,
      members: rows.filter((p) => p.role === "member").length,
      volunteers: rows.filter((p) => p.role === "volunteer").length,
      leads: rows.filter((p) => p.role === "lead").length,

      notStarted: rows.filter(
        (p) => (p.opd_status || "not_started") === "not_started",
      ).length,
      inProgress: rows.filter((p) => p.opd_status === "in_progress").length,
      forReview: rows.filter((p) => p.opd_status === "for_review").length,
      published: rows.filter((p) => p.opd_status === "published").length,
      released: rows.filter((p) => p.opd_released === true).length,

      totalOPDs: opds?.length || 0,
    });

    setLoading(false);
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading PCS dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#0f5b54]">PCS Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of OPD progress across members, volunteers, and leads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard title="Total People" value={metrics.totalPeople} />
        <MetricCard title="Members" value={metrics.members} />
        <MetricCard title="Volunteers" value={metrics.volunteers} />
        <MetricCard title="Leads" value={metrics.leads} />

        <MetricCard title="OPDs Not Started" value={metrics.notStarted} />
        <MetricCard title="OPDs In Progress" value={metrics.inProgress} />
        <MetricCard title="OPDs For Review" value={metrics.forReview} />
        <MetricCard title="OPDs Published" value={metrics.published} />

        <MetricCard title="Released OPDs" value={metrics.released} />
        <MetricCard
          title="Total OPD Records"
          value={metrics.totalOPDs}
          subtitle="Across all academic years"
        />
      </div>
    </div>
  );
};

export default PCPDashboard;
