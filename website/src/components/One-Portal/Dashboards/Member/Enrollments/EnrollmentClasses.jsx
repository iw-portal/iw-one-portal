import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";

export default function EnrollmentClasses({ user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.person_id) {
      fetchClasses();
    }
  }, [user?.person_id]);

  const fetchClasses = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        programs (*)
      `,
      )
      .eq("student_id", user.person_id)
      .eq("enrollment_status", "active")
      .order("enrolled_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    setClasses(data || []);
    setLoading(false);
  };

  const dayMapping = {
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
    SUN: "Sunday",
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute || 0));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getProgramSchedule = (program) => {
    const sections = program?.sections || [];

    if (sections.length === 0) {
      return "Schedule not available";
    }

    return sections
      .map((section) => {
        const day = dayMapping[section.day] || section.day || "";

        const time =
          section.start_time && section.end_time
            ? `${formatTime(section.start_time)} - ${formatTime(section.end_time)}`
            : "";

        return [day, time].filter(Boolean).join(" • ");
      })
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return <div className="p-6">Loading enrolled classes...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-4xl font-bold text-[#0f5b54]">My Classes</h1>

        <p className="text-gray-500 mt-3">
          Classes you are currently enrolled in.
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">No Classes Found</h2>

          <p className="text-gray-500 mt-2">
            You are not enrolled in any programs yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes.map((item) => (
            <div
              key={item.id}
              className="
    bg-white
    rounded-3xl
    shadow-sm
    border
    hover:shadow-lg
    transition
    overflow-hidden
  "
            >
              <div className="bg-[#f8faf9] flex justify-center p-6">
                <img
                  src={item.programs?.image_url?.replace("..", "")}
                  alt={item.programs?.course_title}
                  className="h-48 object-contain"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0f5b54]">
                      {item.programs?.course_title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {item.programs?.course_code}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">Duration</p>

                    <p className="font-medium mt-1">
                      {item.programs?.duration}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">Level</p>

                    <p className="font-medium mt-1 capitalize">
                      {item.programs?.level}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                    <p className="text-xs text-gray-500 uppercase">Schedule</p>

                    <p className="font-medium mt-1">
                      {getProgramSchedule(item.programs)}
                    </p>
                  </div>
                </div>

                <div className="border-t mt-6 pt-4 flex justify-between text-sm">
                  <span className="text-gray-500">Enrolled</span>

                  <span className="font-medium">
                    {new Date(item.enrolled_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
