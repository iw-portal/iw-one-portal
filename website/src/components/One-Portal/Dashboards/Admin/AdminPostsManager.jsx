import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const AdminPostsManager = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editingPost, setEditingPost] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    published_at: "",
  });

  // =========================================================
  // FETCH POSTS
  // =========================================================

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (!error) {
      setPosts(data);
    }

    setLoading(false);
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setEditingPost(null);

    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image_url: "",
      published_at: "",
    });
  };

  // =========================================================
  // CREATE POST
  // =========================================================

  const createPost = async () => {
    if (!form.title || !form.slug) {
      alert("Title and slug are required.");
      return;
    }

    console.log("Creating post...");

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: form.title,
          slug: form.slug,
          content: form.content,
          excerpt: form.excerpt,
          image_url: form.image_url,
          published_at: form.published_at || new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    console.log("Created:", data);

    resetForm();

    fetchPosts();

    alert("Post created successfully!");
  };

  // =========================================================
  // UPDATE POST
  // =========================================================

  const updatePost = async () => {
    const { error } = await supabase
      .from("posts")
      .update({
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        image_url: form.image_url,
        published_at: form.published_at,
      })
      .eq("id", editingPost.id);

    if (!error) {
      resetForm();
      fetchPosts();
    }
  };

  // =========================================================
  // DELETE POST
  // =========================================================

  const deletePost = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      fetchPosts();
    }
  };

  // =========================================================
  // EDIT POST
  // =========================================================

  const handleEdit = (post) => {
    setEditingPost(post);

    setForm({
      title: post.title || "",
      slug: post.slug || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      image_url: post.image_url || "",
      published_at: post.published_at ? post.published_at.slice(0, 16) : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Manage News & Events
          </h1>

          <p className="text-gray-500 mt-2">Create, edit, and delete posts.</p>
        </div>

        {/* ========================================================= */}
        {/* FORM */}
        {/* ========================================================= */}

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="slug"
              placeholder="Slug"
              value={form.slug}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 md:col-span-2"
            />

            <input
              type="datetime-local"
              name="published_at"
              value={form.published_at}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <textarea
              name="excerpt"
              placeholder="Excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              className="border rounded-xl px-4 py-3 md:col-span-2"
            />

            <textarea
              name="content"
              placeholder="Full Content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              className="border rounded-xl px-4 py-3 md:col-span-2"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex gap-4 mt-6">
            {editingPost ? (
              <>
                <button
                  onClick={updatePost}
                  className="
                    bg-[#d45a5a]
                    hover:bg-[#bf4f4f]
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  Update Post
                </button>

                <button
                  onClick={resetForm}
                  className="
                    bg-gray-200
                    hover:bg-gray-300
                    px-6
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={createPost}
                className="
                  bg-[#d45a5a]
                  hover:bg-[#bf4f4f]
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  transition
                "
              >
                Create Post
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* POSTS TABLE */}
        {/* ========================================================= */}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">
              Existing Posts
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading posts...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">Image</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Slug</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-16 bg-gray-200 rounded-lg" />
                        )}
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {post.title}
                      </td>

                      <td className="p-4 text-gray-500">
                        {new Date(post.published_at).toDateString()}
                      </td>

                      <td className="p-4 text-gray-500">{post.slug}</td>

                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(post)}
                            className="
                              bg-blue-500
                              hover:bg-blue-600
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              transition
                            "
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deletePost(post.id)}
                            className="
                              bg-red-500
                              hover:bg-red-600
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              transition
                            "
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPostsManager;
