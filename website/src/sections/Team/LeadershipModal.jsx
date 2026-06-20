function LeadershipModal({ leader, onClose }) {
  if (!leader) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <img
            src={leader.image}
            alt={leader.name}
            className="w-full max-w-[250px] mx-auto md:mx-0 rounded-xl object-cover"
          />

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {leader.name}
            </h2>

            <p className="text-gray-500 mt-1 mb-4">{leader.role}</p>

            <div className="w-32 h-[3px] bg-[#e16a5b] mb-4"></div>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {leader.bio1 ? (
                <>
                  {leader.bio1}
                  <br />
                  <br />
                  {leader.bio2}
                  <br />
                  <br />
                  {leader.bio3}
                  <br />
                  <br />
                  {leader.bio4}
                </>
              ) : (
                leader.bio
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-[#e16a5b] text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadershipModal;
