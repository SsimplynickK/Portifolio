import React, { useState, useEffect } from "react";
import { projectsStore } from "../components/store";
import { FolderOpen, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {

  const [activeFolder, setActiveFolder] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {

    const loadProjects = async () => {

      try {

        const data = await projectsStore.getAll();
        setProjects(data);

      } catch (err) {

        console.error("Failed loading projects", err);

      }

    };

    loadProjects();

  }, []);

  const folders = [...new Set(projects.map((p) => p.folder))].sort();

  const filteredProjects = activeFolder
    ? projects.filter((p) => p.folder === activeFolder)
    : projects;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

      <div className="mb-10">
        <div className="text-[10px] text-[#333] mb-2 tracking-widest">
          guest@szczesny:~/projects$
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#e0e0e0]">
          Projects
        </h1>

        <p className="text-[11px] text-[#444] mt-2">
          things i've built. organised by category.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Folder sidebar */}

        <div className="lg:w-48 flex-shrink-0">

          <div className="text-[10px] text-[#333] mb-3 uppercase tracking-widest">
            folders
          </div>

          <div className="flex lg:flex-col gap-1 flex-wrap">

            <button
              onClick={() => setActiveFolder(null)}
              className={`text-left text-[11px] px-3 py-1.5 rounded transition-all flex items-center gap-2 ${
                !activeFolder
                  ? "text-[#00ff41] bg-[#00ff41]/10"
                  : "text-[#555] hover:text-[#888]"
              }`}
            >
              <FolderOpen className="w-3 h-3"/>
              all ({projects.length})
            </button>

            {folders.map((folder) => (

              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`text-left text-[11px] px-3 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeFolder === folder
                    ? "text-[#00ff41] bg-[#00ff41]/10"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                <ChevronRight className="w-3 h-3"/>

                {folder} (
                  {projects.filter((p) => p.folder === folder).length}
                )

              </button>

            ))}

          </div>

        </div>

        {/* Projects grid */}

        <div className="flex-1">

          {filteredProjects.length === 0 ? (

            <div className="text-center py-20 text-[#333] text-xs">
              no projects found.
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <AnimatePresence mode="wait">

                {filteredProjects.map((project, i) => (

                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                  />

                ))}

              </AnimatePresence>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}