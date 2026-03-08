import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { projectsStore } from "../components/store";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ProjectDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const load = async () => {
      try {
        const data = await projectsStore.getById(id);
        setProject(data);
      } catch (err) {
        console.error("Failed loading project", err);
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

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#555] text-xs">project not found.</p>
        <Link to={createPageUrl("Projects")} className="text-[10px] text-[#00ff41] mt-4 inline-block">
          ← back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to={createPageUrl("Projects")}
          className="text-[10px] text-[#333] hover:text-[#00ff41] flex items-center gap-1 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> back to projects
        </Link>

        <div className="text-[10px] text-[#00ff41]/40 mb-2">/{project.folder}</div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#e0e0e0] mb-4">{project.title}</h1>

        {project.description && (
          <p className="text-sm text-[#555] mb-6">{project.description}</p>
        )}

        <div className="flex items-center gap-4 mb-8">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20 rounded hover:bg-[#00ff41]/20 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" /> live demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 text-[#555] border border-[#1a1a1a] rounded hover:border-[#333] transition-all flex items-center gap-2"
            >
              <Github className="w-3 h-3" /> source code
            </a>
          )}
        </div>

        {project.tech_stack?.length > 0 && (
          <div className="mb-8">
            <div className="text-[10px] text-[#333] uppercase tracking-widest mb-2">tech stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-1 rounded bg-[#00ff41]/5 text-[#00ff41]/60 border border-[#00ff41]/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden border border-[#1a1a1a]">
            <img src={project.image_url} alt={project.title} className="w-full" />
          </div>
        )}

        {project.long_description && (
          <div className="prose prose-invert prose-sm max-w-none text-[#888] prose-headings:text-[#e0e0e0] prose-a:text-[#00ff41] prose-code:text-[#00ff41] prose-code:bg-[#00ff41]/10 prose-code:px-1 prose-code:rounded prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#1a1a1a]">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
}