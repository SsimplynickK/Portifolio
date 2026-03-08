import React, { useState } from "react";
import { postsStore } from "../store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Save, Loader2 } from "lucide-react";

export default function AdminBlogForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: [],
    published: false,
    cover_image_url: "",
    ...post,
  });
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(post?.tags) ? post.tags.join(", ") : (post?.tags || "")
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      };
      if (post?.id) {
        await postsStore.update(post.id, data);
      } else {
        await postsStore.create(data);
      }
      onSave();
    } catch (err) {
      console.error("Failed saving post", err);
      alert("Failed to save post. Is the server running?");
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
          {post?.id ? "Edit Post" : "New Post"}
        </h3>
        <button type="button" onClick={onCancel} className="text-[#555] hover:text-[#888]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Title *</Label>
        <Input {...f("title")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] text-[#555]">Slug (auto if blank)</Label>
          <Input {...f("slug")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
        </div>
        <div>
          <Label className="text-[10px] text-[#555]">Tags (comma separated)</Label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="dev, react, tutorial"
            className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs"
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Excerpt</Label>
        <Input {...f("excerpt")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Content (Markdown) *</Label>
        <Textarea
          {...f("content")}
          className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs min-h-[250px] font-mono"
          required
        />
      </div>

      <div>
        <Label className="text-[10px] text-[#555]">Cover Image URL</Label>
        <Input {...f("cover_image_url")} className="bg-[#111] border-[#222] text-[#e0e0e0] text-xs" />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.published}
          onCheckedChange={(v) => setForm({ ...form, published: v })}
        />
        <Label className="text-[10px] text-[#555]">Published</Label>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/30 text-xs"
        >
          {saving
            ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Saving...</>
            : <><Save className="w-3 h-3 mr-2" />{post?.id ? "Update" : "Create"}</>
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