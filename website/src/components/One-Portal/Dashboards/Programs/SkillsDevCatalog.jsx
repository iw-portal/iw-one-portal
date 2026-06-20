import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import VolunteerSidebar from "../Sidebars/Volunteer";
import { Link } from "react-router-dom";

const categories = [
  "Coding",
  "Web Development",
  "Mobile Development",
  "Artificial Intelligence",
  "Software Testing",
  "Productivity",
  "Data & Spreadsheets",
  "Communication Skills",
  "Digital Literacy",
];

const buttons = [
  {
    id: 1,
    title: "View Calendar",
    toPointTo: "/one-portal/volunteer/programs/f25_26_schedule",
  },
];

export default function Courses({ user, setUser }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedCategories, courses]);

  function openCourse(course) {
    setSelectedCourse(course);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedCourse(null);
    setIsModalOpen(false);
  }

  async function fetchCourses() {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("course_title");

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    console.log("Courses from Supabase:", data);

    setCourses(data);
    setFilteredCourses(data);
  }

  function toggleCategory(category) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  function filterCourses() {
    if (selectedCategories.length === 0) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter((course) =>
      course.category?.some((cat) => selectedCategories.includes(cat)),
    );

    setFilteredCourses(filtered);
  }

  return (
    // <section className="py-16 bg-gray-50">
    <div className="md:flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <VolunteerSidebar />

      <div className="max-w-7xl mx-auto px-6">
        {/* PAGE TITLE */}
        <section className="py-10 mt-10 md:py-10 mb-8">
          <div className="max-w-4xl md:max-w-5xl mx-auto px-6 text-center">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0f5b54]">
              Skills Development Programs
            </h2>

            {/* Underline */}
            <div className="w-24 h-1 bg-[#0f5b54] mx-auto mt-4"></div>
          </div>
        </section>

        <div className="grid md:grid-cols-4 gap-12">
          {/* FILTER SIDEBAR */}

          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h3 className="font-semibold text-lg mb-4">Filter Courses</h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-[#e0705d]"
                  />

                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* COURSE GRID */}

          <div className="md:col-span-3 grid md:grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => openCourse(course)}
                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer p-7 flex flex-col"
              >
                <img
                  src={course.image_url.replace("..", "")}
                  alt={course.course_title}
                  className="rounded-lg mb-5 w-full h-48 object-contain"
                />

                <h3 className="text-xl font-semibold text-[#0f5b54] mb-3">
                  {course.course_title}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Pre-requisite:</strong>{" "}
                  {course.prerequisites || "None"}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <strong>Duration:</strong> {course.duration}
                </p>

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {course.category?.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-4 py-2 rounded-3xl bg-[#0f5b54] text-white hover:bg-[#e0705d] hover:text-white hover:font-bold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && selectedCourse && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-white rounded-xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>

                <img
                  src={selectedCourse.image_url.replace("..", "")}
                  alt={selectedCourse.course_title}
                  className="rounded-lg mb-6 w-full h-56 object-contain"
                />

                <h2 className="text-2xl font-semibold text-[#0f5b54] mb-4">
                  {selectedCourse.course_title}
                </h2>

                <p className="mb-2">
                  <strong>Pre-requisite:</strong>{" "}
                  {selectedCourse.prerequisites || "None"}
                </p>

                <p className="mb-4">
                  <strong>Duration:</strong> {selectedCourse.duration}
                </p>

                {selectedCourse.system_requirement !== "None" && (
                  <p className="mb-4">
                    <strong>System Requirement:</strong>{" "}
                    {selectedCourse.system_requirement}
                  </p>
                )}

                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedCourse.description}
                </p>

                {selectedCourse.review && selectedCourse.review !== "None" && (
                  <div className="border-l-4 border-[#0f5b54] pl-4 italic text-gray-600">
                    {selectedCourse.review}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedCourse.category?.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-4 py-2 rounded-3xl bg-[#0f5b54] text-white hover:bg-[#e0705d] hover:text-white hover:font-bold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUTTON STRIP */}
          <section className="py-10 mb-10 md:col-span-4">
            <div className="w-full mx-auto px-6 flex flex-wrap justify-center gap-7">
              {buttons.map((button) => (
                <Link
                  to={button.toPointTo}
                  className="bg-[#0f5b54] font-bold text-white px-6 py-4 rounded-md text-sm hover:bg-[#cf5b4c] transition"
                >
                  {button.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
