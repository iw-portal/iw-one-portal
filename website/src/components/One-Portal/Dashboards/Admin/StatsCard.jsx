// StatsCard.jsx
const StatsCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow bg-white">
      <div className="p-5 font-semibold text-gray-700">{title}</div>

      <div className="bg-[#7a3e48] text-white text-2xl font-bold p-6">
        {value}
      </div>
    </div>
  );
};

export default StatsCard;
