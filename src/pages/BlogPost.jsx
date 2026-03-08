import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { postsStore } from "../components/store";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function BlogPost() {
  // Support both /blog/:id route params and ?id= query params
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get("id");

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const load = async () => {
      try {
        const data = await postsStore.getById(id);
        setPost(data);
      } catch (err) {
        console.error("Failed loading post", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#555] text-xs animate-pulse">loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#555] text-xs">post not found.</p>
        <Link to={createPageUrl("Blog")} className="text-[10px] text-[#00ff41] mt-4 inline-block">
          ← back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to={createPageUrl("Blog")}
          className="text-[10px] text-[#333] hover:text-[#00ff41] flex items-center gap-1 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> back to blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] text-[#333] tabular-nums">
              {format(new Date(post.created_date), "yyyy.MM.dd")}
            </span>
            {post.tags?.map((tag) => (
              <span key={tag} className="text-[9px] text-[#00ff41]/40">#{tag}</span>
            ))}
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-[#e0e0e0] leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-sm text-[#555] mt-3">{post.excerpt}</p>
          )}
        </header>

        {post.cover_image_url && (
          <div className="mb-10 rounded-lg overflow-hidden border border-[#1a1a1a]">
            <img src={post.cover_image_url} alt={post.title} className="w-full" />
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none text-[#888] prose-headings:text-[#e0e0e0] prose-a:text-[#00ff41] prose-code:text-[#00ff41] prose-code:bg-[#00ff41]/10 prose-code:px-1 prose-code:rounded prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#1a1a1a] prose-strong:text-[#ccc] prose-blockquote:border-[#00ff41]/20 prose-blockquote:text-[#666]">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}