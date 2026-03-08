import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { projectsStore, postsStore, adminAuth } from "../components/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Pencil, Trash2, FolderOpen, FileText, ArrowLeft,
  Star, Eye, EyeOff, Terminal, LogOut, Lock, ChevronRight
} from "lucide-react";
import AdminProjectForm from "../components/admin/AdminProjectForm";
import AdminBlogForm from "../components/admin/AdminBlogForm";

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminAuth.login(password)) {
      onLogin();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Terminal className="w-6 h-6 text-[#00ff41] mx-auto mb-3" />
          <div className="text-[10px] text-[#333] tracking-widest mb-1">szczesny.co.uk</div>
          <h1 className="text-sm text-[#e0e0e0]">admin access</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="w-3 h-3 text-[#444] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`pl-8 bg-[#111] border-[#222] text-[#e0e0e0] text-xs ${error ? "border-red-500/50" : ""}`}
              autoFocus
            />
          </div>
          {error && <p className="text-[10px] text-red-400">incorrect password</p>}
          <Button
            type="submit"
            className="w-full bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20 hover:bg-[#00ff41]/20 text-xs"
          >
            access panel
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Reusable row for a project ──────────────────────────────────────────────
function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a] transition-colors group">
      <div className="flex items-center gap-2 min-w-0">
        {project.featured && (
          <Star className="w-3 h-3 text-[#00ff41]/60 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-xs text-[#e0e0e0] truncate">{project.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#444] flex items-center gap-1">
              <ChevronRight className="w-2.5 h-2.5" />{project.folder}
            </span>
            {project.tech_stack?.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] text-[#00ff41]/30">#{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(project)}
          className="p-1.5 rounded text-[#555] hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="p-1.5 rounded text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Reusable row for a post ─────────────────────────────────────────────────
function PostRow({ post, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a] transition-colors group">
      <div className="flex items-center gap-2 min-w-0">
        {post.published
          ? <Eye className="w-3 h-3 text-[#00ff41]/60 flex-shrink-0" />
          : <EyeOff className="w-3 h-3 text-[#444] flex-shrink-0" />
        }
        <div className="min-w-0">
          <p className="text-xs text-[#e0e0e0] truncate">{post.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${post.published ? "text-[#00ff41]/60 bg-[#00ff41]/5" : "text-[#444] bg-[#111]"}`}>
              {post.published ? "published" : "draft"}
            </span>
            {post.tags?.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] text-[#444]">#{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(post)}
          className="p-1.5 rounded text-[#555] hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="p-1.5 rounded text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main Admin component ────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("projects");

  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  const [editingProject, setEditingProject] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    setAuthed(adminAuth.isLoggedIn());
  }, []);

  const loadData = async () => {
    try {
      const [projectData, postData] = await Promise.all([
        projectsStore.getAll(),
        postsStore.getAll(),
      ]);
      setProjects(projectData);
      setPosts(postData);
    } catch (err) {
      console.error("Failed loading data", err);
    }
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const handleDeleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await projectsStore.delete(id);
    loadData();
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    await postsStore.delete(id);
    loadData();
  };

  const handleProjectSaved = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    loadData();
  };

  const handlePostSaved = () => {
    setShowPostForm(false);
    setEditingPost(null);
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-[#00ff41]" />
          <h1 className="text-sm font-semibold text-[#e0e0e0]">admin panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={createPageUrl("Home")}
            className="text-[10px] text-[#333] hover:text-[#00ff41] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> back to site
          </Link>
          <button
            onClick={() => { adminAuth.logout(); setAuthed(false); }}
            className="text-[10px] text-[#333] hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" /> logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 border-b border-[#1a1a1a]">
        <button
          onClick={() => setTab("projects")}
          className={`px-4 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            tab === "projects" ? "border-[#00ff41] text-[#00ff41]" : "border-transparent text-[#555] hover:text-[#888]"
          }`}
        >
          <FolderOpen className="w-3 h-3" /> Projects
          <span className="ml-1 text-[10px] opacity-60">({projects.length})</span>
        </button>
        <button
          onClick={() => setTab("blog")}
          className={`px-4 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            tab === "blog" ? "border-[#00ff41] text-[#00ff41]" : "border-transparent text-[#555] hover:text-[#888]"
          }`}
        >
          <FileText className="w-3 h-3" /> Blog Posts
          <span className="ml-1 text-[10px] opacity-60">({posts.length})</span>
        </button>
      </div>

      {/* PROJECTS TAB */}
      {tab === "projects" && (
        <div>
          {showProjectForm ? (
            <AdminProjectForm
              project={editingProject}
              onSave={handleProjectSaved}
              onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
            />
          ) : (
            <button
              onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
              className="mb-5 flex items-center gap-2 text-xs px-3 py-2 rounded border border-[#00ff41]/20 text-[#00ff41]/70 hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Project
            </button>
          )}

          {projects.length === 0 && !showProjectForm && (
            <p className="text-[11px] text-[#444] py-8 text-center">no projects yet.</p>
          )}

          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onEdit={(p) => { setEditingProject(p); setShowProjectForm(true); }}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        </div>
      )}

      {/* BLOG TAB */}
      {tab === "blog" && (
        <div>
          {showPostForm ? (
            <AdminBlogForm
              post={editingPost}
              onSave={handlePostSaved}
              onCancel={() => { setShowPostForm(false); setEditingPost(null); }}
            />
          ) : (
            <button
              onClick={() => { setEditingPost(null); setShowPostForm(true); }}
              className="mb-5 flex items-center gap-2 text-xs px-3 py-2 rounded border border-[#00ff41]/20 text-[#00ff41]/70 hover:text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Post
            </button>
          )}

          {posts.length === 0 && !showPostForm && (
            <p className="text-[11px] text-[#444] py-8 text-center">no posts yet.</p>
          )}

          <div className="space-y-2">
            {posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                onEdit={(p) => { setEditingPost(p); setShowPostForm(true); }}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}