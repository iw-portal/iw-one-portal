function FounderModal({ founder, onClose }) {
  if (!founder) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#9e2552] w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl p-6 sm:p-8 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Image */}
          <img
            src={founder.image}
            alt={founder.name}
            className={`w-full max-w-[260px] mx-auto md:mx-0 rounded-xl
              ${founder.fit === "contain" ? "object-contain p-2" : "object-cover"}
            `}
          />

          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl text-white font-semibold">
              {founder.name}
            </h2>

            <p className="text-white mt-1">{founder.role}</p>

            {founder.lead && <p className="text-white">{founder.lead}</p>}

            <div className="w-32 h-[3px] bg-[#9e2552] mt-4 mb-4"></div>

            <p className="text-white text-sm sm:text-base leading-relaxed">
              <span className="font-semibold">{founder.name}</span>{" "}
              {founder.intro}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-[#9e2552] text-white px-5 py-2 rounded-lg hover:bg-[#7e1d40]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FounderModal;
