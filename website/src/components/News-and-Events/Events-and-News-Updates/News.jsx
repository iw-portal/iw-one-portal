import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Common/Navbar";
import Footer from "../../Common/Footer";

const News = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const POSTS_PER_PAGE = 14;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page = 1) => {
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("published_at", { ascending: false })
      .range(from, to);

    if (!error) {
      setPosts(data);

      setTotalPages(Math.ceil(count / POSTS_PER_PAGE));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-semibold text-center text-[#d45a5a] mb-10 mt-12">
        Events & News Updates
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-10 px-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() =>
              navigate(`/news-and-events/events-and-news-updates/${post.slug}`)
            }
            className="cursor-pointer group"
          >
            {/* IMAGE + HOVER */}
            <div className="relative overflow-hidden rounded-md">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-72 object-cover"
              />

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="text-white text-center px-4">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm mt-2">View Details</p>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="mt-4">
              <h3 className="text-[#d45a5a] font-semibold">{post.title}</h3>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(post.published_at).toDateString()}
              </p>

              <p className="text-sm text-gray-600 mt-3 line-clamp-4">
                {post.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded border
      ${
        currentPage === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100"
      }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded
          ${
            currentPage === page
              ? "bg-[#d45a5a] text-white"
              : "bg-white border hover:bg-gray-100"
          }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded border
      ${
        currentPage === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100"
      }`}
        >
          Next
        </button>
        <div className="h-40" />
      </div>
      <Footer />
    </div>
  );
};

export default News;
