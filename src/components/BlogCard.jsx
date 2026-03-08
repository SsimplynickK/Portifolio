import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={createPageUrl(`BlogPost?id=${post.id}`)}
        className="group block border-b border-[#1a1a1a] py-5 hover:bg-[#00ff41]/[0.02] px-3 -mx-3 rounded transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[10px] text-[#333] tabular-nums">
                {format(new Date(post.created_date), "yyyy.MM.dd")}
              </span>
              {post.tags?.length > 0 && (
                <div className="flex gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] text-[#00ff41]/40">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h3 className="text-sm text-[#e0e0e0] group-hover:text-[#00ff41] transition-colors font-medium">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-[11px] text-[#444] mt-1 line-clamp-1">{post.excerpt}</p>
            )}
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-[#00ff41] mt-1 transition-colors flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}