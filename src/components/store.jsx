// API-based store — communicates with local backend server

const API_BASE = "/api";

// ─── Helpers ─────────────────────────────────────────

async function request(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}

// SQLite stores arrays as JSON strings — parse them back
function parseProject(p) {
  if (!p) return p;
  return {
    ...p,
    tech_stack: (() => {
      if (Array.isArray(p.tech_stack)) return p.tech_stack;
      if (typeof p.tech_stack === "string") {
        try { return JSON.parse(p.tech_stack); } catch {
          return p.tech_stack.replace(/[\[\]"]/g, "").split(",").map(s => s.trim()).filter(Boolean);
        }
      }
      return [];
    })(),
    featured: Boolean(p.featured),
    order: p.order_num ?? p.order ?? 0,
  };
}

function parsePost(p) {
  if (!p) return p;
  return {
    ...p,
    tags: (() => {
      if (Array.isArray(p.tags)) return p.tags;
      if (typeof p.tags === "string") {
        try { return JSON.parse(p.tags); } catch {
          return p.tags.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
      return [];
    })(),
    published: Boolean(p.published),
  };
}

// ─── Projects Store ─────────────────────────────────

export const projectsStore = {

  async getAll() {
    const rows = await request("/projects");
    return rows.map(parseProject);
  },

  async getFeatured() {
    const all = await this.getAll();
    return all.filter(p => p.featured);
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find(p => p.id === id) || null;
  },

  async create(data) {
    return await request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return await request(`/projects/${id}`, {
      method: "DELETE",
    });
  },

};

// ─── Posts Store ────────────────────────────────────

export const postsStore = {

  async getAll() {
    const rows = await request("/posts");
    return rows.map(parsePost);
  },

  async getPublished() {
    const all = await this.getAll();
    return all.filter(p => p.published);
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find(p => p.id === id) || null;
  },

  async create(data) {
    return await request("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return await request(`/posts/${id}`, {
      method: "DELETE",
    });
  },

};

// ─── Admin Auth ──────────────────────────────────────

const ADMIN_KEY = "szczesny_admin_session";

export const adminAuth = {

  PASSWORD: "Ni1Ch6Ol1As1", // change this

  login(password) {
    if (password === this.PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(ADMIN_KEY);
  },

  isLoggedIn() {
    return sessionStorage.getItem(ADMIN_KEY) === "true";
  },

};