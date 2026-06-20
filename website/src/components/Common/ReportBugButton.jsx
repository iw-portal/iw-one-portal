import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Bug } from "lucide-react";

const ReportBugButton = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return alert("Please enter a title.");
    }

    if (!form.description.trim()) {
      return alert("Please describe the issue.");
    }

    setSubmitting(true);

    const { error } = await supabase.from("bug_reports").insert({
      title: form.title.trim(),
      description: form.description.trim(),

      page_url: window.location.href,
      browser_info: navigator.userAgent,

      reported_by: user?.person_id || null,

      status: "open",
      priority: "medium",
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      return alert(error.message);
    }

    alert("Bug report submitted successfully.");

    setForm({
      title: "",
      description: "",
    });

    setShowModal(false);
  };

  return (
    <>
      {/* Floating Button */}
      {/* <button
        onClick={() => setShowModal(true)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          bg-red-600
          hover:bg-red-700
          text-white
          px-5
          py-3
          rounded-full
          shadow-xl
          flex
          items-center
          gap-2
          transition
        "
      >
        <Bug size={18} />
        Report Bug
      </button> */}
      <button
        onClick={() => setShowModal(true)}
        className="
    fixed
    bottom-4
    right-4
    z-40
    bg-red-600
    hover:bg-red-700
    text-white
    w-12
    h-12
    rounded-full
    shadow-lg
    flex
    items-center
    justify-center
    transition-all
    hover:scale-110
  "
        title="Report Bug"
      >
        <Bug size={18} />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-[999]
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setShowModal(false)}
        >
          <div
            className="
              bg-white
              w-full
              max-w-xl
              rounded-2xl
              shadow-2xl
              p-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">Report a Bug</h2>

            <p className="text-gray-500 text-sm mb-6">
              Help us improve One Portal by reporting issues.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Brief summary of the issue"
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2
                  "
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>

                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what happened, what you expected, and any steps to reproduce the issue."
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2
                  "
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                <p>
                  <strong>Page:</strong> {window.location.pathname}
                </p>

                <p className="mt-1">
                  Browser information will be attached automatically.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="
                  px-4
                  py-2
                  border
                  rounded-lg
                "
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="
                  bg-[#0f5b54]
                  hover:bg-[#0c4b45]
                  text-white
                  px-5
                  py-2
                  rounded-lg
                "
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportBugButton;
