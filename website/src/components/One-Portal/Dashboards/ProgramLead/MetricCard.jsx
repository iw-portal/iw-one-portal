export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl border p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-4xl font-bold text-[#0f5b54] mt-3">{value}</h2>
    </div>
  );
}
