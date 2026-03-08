import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectCard({ project, index = 0 }) {

  // Parse tech stack safely
  const techStack = (() => {
    if (!project.tech_stack) return [];
    if (Array.isArray(project.tech_stack)) return project.tech_stack;
    if (typeof project.tech_stack === "string") {
      return project.tech_stack
        .replace(/[\[\]"]/g, "")
        .split(/,|\n/)
        .map(t => t.trim())
        .filter(Boolean);
    }
    return [];
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group border border-[#1a1a1a] rounded-lg p-4 bg-[#0a0a0a] hover:border-[#00ff41]/30 transition-all duration-300 hover:bg-[#00ff41]/[0.02]"
    >

      {project.image_url && (
        <div className="mb-3 rounded overflow-hidden border border-[#1a1a1a] aspect-video">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          />
        </div>
      )}

      <h3 className="text-sm font-medium text-[#e0e0e0] group-hover:text-[#00ff41] transition-colors">
        {project.title}
      </h3>

      {project.description && (
        <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {techStack.map((tech, i) => (
            <span
              key={i}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[#00ff41]/5 text-[#00ff41]/60 border border-[#00ff41]/10"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#1a1a1a]">

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-[#555] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={12} /> live
          </a>
        )}

        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-[#555] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
          >
            <Github size={12} /> source
          </a>
        )}

        <Link
          to={createPageUrl(`ProjectDetail?id=${project.id}`)}
          className="ml-auto text-[10px] text-[#555] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
        >
          details <ArrowRight size={12} />
        </Link>

      </div>
    </motion.div>
  );
}