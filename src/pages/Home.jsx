import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { projectsStore } from "../components/store";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import TerminalText from "../components/TerminalText";
import ProjectCard from "../components/ProjectCard";

export default function Home() {

  const [introReady, setIntroReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(0);

  // Load projects from API
  useEffect(() => {

    const loadProjects = async () => {

      try {

        const allProjects = await projectsStore.getAll();

        setProjectCount(allProjects.length);

        const featured = allProjects
          .filter(p => p.featured)
          .slice(0, 4);

        setFeaturedProjects(featured);

      } catch (err) {

        console.error("Failed loading projects", err);

      }

    };

    loadProjects();

  }, []);

  useEffect(() => {

    if (introReady) {

      const t = setTimeout(() => setShowContent(true), 300);

      return () => clearTimeout(t);

    }

  }, [introReady]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* Hero */}
      <section className="py-20 sm:py-32">

        <div className="text-[10px] text-[#333] mb-4 tracking-widest">
          guest@szczesny:~$
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#e0e0e0] leading-tight">

          <TerminalText
            text="Nicholas Szczesny"
            speed={50}
            onComplete={() => setIntroReady(true)}
          />

        </h1>

        {introReady && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >

            <p className="text-sm text-[#555] mt-4 max-w-lg leading-relaxed">
              teen developer. building things that work.
              <br/>
              <span className="text-[#00ff41]/60">
                focused on shipping, not talking.
              </span>
            </p>

            <div className="flex items-center gap-4 mt-8">

              <Link
                to={createPageUrl("Projects")}
                className="text-xs px-4 py-2 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20 rounded hover:bg-[#00ff41]/20 transition-all flex items-center gap-2"
              >
                view projects <ArrowRight className="w-3 h-3"/>
              </Link>

              <Link
                to={createPageUrl("Blog")}
                className="text-xs px-4 py-2 text-[#555] border border-[#1a1a1a] rounded hover:border-[#333] hover:text-[#888] transition-all"
              >
                read blog
              </Link>

            </div>

          </motion.div>

        )}

      </section>

      {/* Status line */}
      {showContent && (

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4 }}
          className="border-t border-[#1a1a1a] mb-16"
        >

          <div className="flex items-center gap-6 py-3 text-[10px] text-[#333] overflow-x-auto">

            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
              available for work
            </span>

            <span>
              projects: {projectCount}
            </span>

            <span>
              location: uk
            </span>

          </div>

        </motion.div>

      )}

      {/* Featured Projects */}
      {showContent && featuredProjects.length > 0 && (

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pb-20"
        >

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xs text-[#555] tracking-widest uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3 text-[#00ff41]" />
              featured_projects
            </h2>

            <Link
              to={createPageUrl("Projects")}
              className="text-[10px] text-[#333] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
            >
              view all <ArrowRight className="w-3 h-3"/>
            </Link>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {featuredProjects.map((project, i) => (

              <ProjectCard
                key={project.id}
                project={project}
                index={i}
              />

            ))}

          </div>

        </motion.section>

      )}

    </div>
  );
}