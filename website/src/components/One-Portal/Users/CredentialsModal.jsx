import { useState } from "react";

export const CredentialsModal = ({ username, password, onConfirm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    if (!revealed) {
      setShowPassword(true);
      setRevealed(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Credentials
        </h2>

        {/* USERNAME */}
        <div className="mb-3 text-gray-700">
          <p className="text-sm">Username</p>
          <p className="font-semibold text-lg">{username}</p>
        </div>

        {/* PASSWORD */}
        <div className="mb-4 text-gray-700">
          <p className="text-sm">Password</p>
          <p className="font-semibold text-lg">
            {showPassword ? password : "••••••••"}
          </p>
        </div>

        {/* REVEAL BUTTON */}
        {!revealed && (
          <button
            onClick={handleReveal}
            className="w-full bg-[#0f5b54] mb-3 text-sm text-white py-2 rounded-lg hover:bg-[#0c4a45] transition"
          >
            View Password (only once)
          </button>
        )}

        {revealed && (
          <p className="text-xs text-red-500 mb-3">
            You won’t be able to see this again
          </p>
        )}

        {/* ACTION */}
        <button
          onClick={onConfirm}
          className="w-full bg-[#0f5b54] text-white py-2 rounded-lg hover:bg-[#0c4a45] transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
