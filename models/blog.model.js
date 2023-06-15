const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["Business", "Tech", "Lifestyle", "Entertainment"],
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: { type: String },
      content: { type: String },
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
