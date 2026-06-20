import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../Common/Footer";
import Navbar from "../../Common/Navbar";

const NewsDetail = () => {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchRecent();
  }, [slug]);

  // =========================================================
  // FETCH CURRENT POST
  // =========================================================

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error) {
      setPost(data);
    }
  };

  // =========================================================
  // FETCH RECENT POSTS
  // =========================================================

  const fetchRecent = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(8);

    if (!error) {
      setRecent(data);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ========================================================= */}
      {/* PAGE CONTENT */}
      {/* ========================================================= */}

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        {/* ========================================================= */}
        {/* TITLE */}
        {/* ========================================================= */}

        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 mt-5">
            {new Date(post.published_at).toDateString()}
          </p>
        </div>

        {/* ========================================================= */}
        {/* MAIN LAYOUT */}
        {/* ========================================================= */}

        <div className="grid lg:grid-cols-12 gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDE */}
          {/* ========================================================= */}

          <div className="lg:col-span-8">
            {/* HERO IMAGE */}

            {post.image_url && (
              <div className="mb-10">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="
                    w-full
                    rounded-3xl
                    shadow-xl
                    object-cover
                    max-h-[550px]
                  "
                />
              </div>
            )}

            {/* CONTENT */}

            <div className="space-y-2">
              <p className="text-[20px] text-gray-700">
                {post.content.replace(/<[^>]*>/g, "")}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ========================================================= */}

          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                  Recent Posts
                </h3>

                <div className="space-y-5">
                  {recent.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        navigate(
                          `/news-and-events/events-and-news-updates/${item.slug}`,
                        )
                      }
                      className="
                        cursor-pointer
                        border-b
                        pb-4
                        hover:border-[#d45a5a]
                        transition
                        group
                      "
                    >
                      <h4 className="font-medium text-gray-800 group-hover:text-[#d45a5a] transition text-lg leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(item.published_at).toDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetail;
