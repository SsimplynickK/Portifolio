import React, { useState } from "react";
import { projectsStore } from "../store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";

export default function AdminProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    long_description: "",
    folder: "",
    tech_stack: [],
    live_url: "",
    repo_url: "",
    image_url: "",
    featured: false,
    order: 0,
    ...project,
  });
  const [techInput, setTechInput] = useState(
    Array.isArray(project?.tech_stack) ? project.tech_stack.join(", ") : (project?.tech_stack || "")
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        tech_stack: techInput.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (project?.id) {
        await projectsStore.update(project.id, data);
      } else {
        await projectsStore.create(data);
      }
      onSave();
    } catch (err) {
      console.error("Failed saving project", err);
      alert("Failed to save project. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => ({
    value: form[field] ?? "",
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-[#1a1a1a] rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#e0e0e0]">
          {project?.id ? "Edit Project" : "New Project"}
        </h3>
        <button type="button" onClick={onCancel} className="text-[#555] hover:text-[#888]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] text-[#555]">Title *</Label>
          <Input {...f("title")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" required />
        </div>
        <div>
          <Label className="text-[10px] text-[#555]">Folder *</Label>
          <Input
            {...f("folder")}
            placeholder="e.g. web, games, tools"
            className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Short Description</Label>
        <Input {...f("description")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Full Description (Markdown)</Label>
        <Textarea
          {...f("long_description")}
          className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs min-h-[120px]"
        />
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Tech Stack (comma separated)</Label>
        <Input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="React, Node.js, Python"
          className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] text-[#555]">Live URL</Label>
          <Input {...f("live_url")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
        </div>
        <div>
          <Label className="text-[10px] text-[#555]">Repo URL</Label>
          <Input {...f("repo_url")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] text-[#555]">Image URL</Label>
          <Input {...f("image_url")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
        </div>
        <div>
          <Label className="text-[10px] text-[#555]">Display Order</Label>
          <Input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.featured}
          onCheckedChange={(v) => setForm({ ...form, featured: v })}
        />
        <Label className="text-[10px] text-[#555]">Featured on homepage</Label>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/30 text-xs"
        >
          {saving
            ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Saving...</>
            : <><Save className="w-3 h-3 mr-2" />{project?.id ? "Update" : "Create"}</>
          }
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] text-[#555] hover:text-[#888]"
        >
          cancel
        </button>
      </div>
    </form>
  );
}