import { useState } from "react";

export const ConfirmModal = ({ data, onConfirm, onEdit }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Confirm Your Details
        </h2>

        {/* DETAILS */}
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-medium">Name:</span> {data.firstName}{" "}
            {data.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {data.email}
          </p>
          <p>
            <span className="font-medium">Date of Birth:</span> {data.dob}
          </p>
          <p>
            <span className="font-medium">Age:</span> {data.age}
          </p>
        </div>

        {/* CHECKBOX */}
        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="accent-[#0f5b54]"
          />
          <p className="text-xs text-gray-600">
            I confirm that the above information is correct
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Edit
          </button>

          <button
            disabled={!checked}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition ${
              checked
                ? "bg-[#0f5b54] hover:bg-[#0c4a45]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
