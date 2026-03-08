import React, { useState, useEffect } from "react";
import { postsStore } from "../components/store";
import { Terminal } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await postsStore.getPublished();
        setPosts(data);
      } catch (err) {
        console.error("Failed loading posts", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="mb-10">
        <div className="text-[10px] text-[#333] mb-2 tracking-widest">
          guest@szczesny:~/blog$
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#e0e0e0]">Blog</h1>
        <p className="text-[11px] text-[#444] mt-2">thoughts, learnings, and build logs.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-[#333] text-xs animate-pulse">loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Terminal className="w-5 h-5 text-[#333] mx-auto mb-3" />
          <p className="text-[#333] text-xs">no posts yet. check back soon.</p>
        </div>
      ) : (
        <div>
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}