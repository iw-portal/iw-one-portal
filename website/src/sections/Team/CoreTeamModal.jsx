function CoreTeamModal({ member, onClose }) {
  if (!member) return null;

  const hasBio = member?.bio || member?.bio1 || member?.bio2 || member?.bio3;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 text-2xl"
        >
          ✕
        </button>

        {hasBio ? (
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-full max-w-[260px] mx-auto md:mx-0 rounded-xl object-cover"
            />

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{member.name}</h2>
              <p className="text-gray-500 mt-1">{member.role}</p>

              <div className="w-32 h-1 bg-[#d85c4b] mt-4 mb-4"></div>

              {member.bio && <p className="mb-3">{member.bio}</p>}
              {member.bio1 && <p className="mb-3">{member.bio1}</p>}
              {member.bio2 && <p className="mb-3">{member.bio2}</p>}
              {member.bio3 && <p>{member.bio3}</p>}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-full max-w-[260px] mx-auto rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-gray-500">{member.role}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-[#d85c4b] text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoreTeamModal;
