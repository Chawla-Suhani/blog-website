import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

// In-memory database for posts
let posts = [
  
];
let lastId = 3;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// --------------------- FRONTEND ROUTES ---------------------

// Render main page with all posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Render new post page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Render edit post page
app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  res.render("modify.ejs", { heading: "Edit Post", submit: "Update Post", post });
});

// --------------------- API ROUTES ---------------------

// Get all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Get a specific post by ID
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post);
});

// Create a new post
app.post("/api/posts", (req, res) => {
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };

  posts.push(newPost);
  res.redirect("/");
});

// Update a post (partial update)
app.post("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.author = req.body.author || post.author;

  res.redirect("/");
});

// Delete a post
app.get("/api/posts/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  res.redirect("/");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
