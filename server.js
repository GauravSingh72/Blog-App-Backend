const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://gauravsingh:MXmOEw1XB9bYZZNC@gauravsinghcluster.kxnryue.mongodb.net/jobApp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/blog.routes"));

// Start the server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
