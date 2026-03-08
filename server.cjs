const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {

  db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    long_description TEXT,
    folder TEXT,
    tech_stack TEXT,
    live_url TEXT,
    repo_url TEXT,
    image_url TEXT,
    featured INTEGER,
    order_num INTEGER,
    created_date TEXT
  )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    content TEXT,
    tags TEXT,
    published INTEGER,
    cover_image_url TEXT,
    created_date TEXT
  )
  `);

});

function id() {
  return Math.random().toString(36).slice(2);
}

function now() {
  return new Date().toISOString();
}

//////////////////////////
// PROJECTS API
//////////////////////////

app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY order_num ASC", [], (err, rows) => {
    res.json(rows || []);
  });
});

app.post("/api/projects", (req, res) => {

  const p = req.body;

  db.run(
    `INSERT INTO projects VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id(),
      p.title,
      p.description,
      p.long_description,
      p.folder,
      JSON.stringify(p.tech_stack),
      p.live_url,
      p.repo_url,
      p.image_url,
      p.featured ? 1 : 0,
      p.order,
      now()
    ],
    function () {
      res.json({ success: true });
    }
  );
});

app.put("/api/projects/:id", (req, res) => {

  const p = req.body;

  db.run(
    `UPDATE projects SET
      title=?,
      description=?,
      long_description=?,
      folder=?,
      tech_stack=?,
      live_url=?,
      repo_url=?,
      image_url=?,
      featured=?,
      order_num=?
    WHERE id=?`,
    [
      p.title,
      p.description,
      p.long_description,
      p.folder,
      JSON.stringify(p.tech_stack),
      p.live_url,
      p.repo_url,
      p.image_url,
      p.featured ? 1 : 0,
      p.order,
      req.params.id
    ],
    () => res.json({ success: true })
  );
});

app.delete("/api/projects/:id", (req, res) => {
  db.run(`DELETE FROM projects WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

//////////////////////////
// POSTS API
//////////////////////////

app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_date DESC", [], (err, rows) => {
    res.json(rows || []);
  });
});

app.post("/api/posts", (req, res) => {

  const p = req.body;

  db.run(
    `INSERT INTO posts VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      id(),
      p.title,
      p.slug,
      p.excerpt,
      p.content,
      JSON.stringify(p.tags),
      p.published ? 1 : 0,
      p.cover_image_url,
      now()
    ],
    () => res.json({ success: true })
  );
});

app.put("/api/posts/:id", (req, res) => {

  const p = req.body;

  db.run(
    `UPDATE posts SET
      title=?,
      slug=?,
      excerpt=?,
      content=?,
      tags=?,
      published=?,
      cover_image_url=?
    WHERE id=?`,
    [
      p.title,
      p.slug,
      p.excerpt,
      p.content,
      JSON.stringify(p.tags),
      p.published ? 1 : 0,
      p.cover_image_url,
      req.params.id
    ],
    () => res.json({ success: true })
  );
});

app.delete("/api/posts/:id", (req, res) => {
  db.run(`DELETE FROM posts WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

app.listen(3001, () => {
  console.log("API running on port 3001");
});