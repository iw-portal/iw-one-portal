// ProgramCard.jsx
const ProgramCard = ({ name, date, members }) => {
  return (
    <div className="bg-[#0f5b54] text-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm opacity-80">{date}</p>

      <div className="flex justify-between mt-3 text-sm">
        <span className="bg-white/20 px-2 py-1 rounded-full">Active</span>
        <span>{members} members</span>
      </div>
    </div>
  );
};

export default ProgramCard;
