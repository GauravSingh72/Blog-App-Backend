const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Blog = require("../models/blog.model");

// Get all blogs
router.get("/blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("author", "username");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get blogs with pagination
router.get(
  "/blogs/page=:page&limit=:limit",
  authMiddleware,
  async (req, res) => {
    try {
      const page = parseInt(req.params.page);
      const limit = parseInt(req.params.limit);

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const blogs = await Blog.find({})
        .skip(startIndex)
        .limit(limit)
        .populate("author", "username");

      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Search blogs by title
router.get("/blogs/search", authMiddleware, async (req, res) => {
  try {
    const { title } = req.query;

    const blogs = await Blog.find({
      title: { $regex: title, $options: "i" },
    }).populate("author", "username");

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a blog
router.post("/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.userId;

    const blog = new Blog({
      title,
      content,
      category,
      author: userId,
    });
    await blog.save();

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a blog
router.put("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blogId = req.params.id;
    const userId = req.user.userId;

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, author: userId },
      { title, content, category },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a blog
router.delete("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.userId;

    const blog = await Blog.findOneAndDelete({ _id: blogId, author: userId });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
