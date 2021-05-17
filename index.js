// Packages
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

// BDD
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome on my Marvel API" });
});

// const contentRoutes = require("./routes/content");
const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/search");
// app.use(contentRoutes);
app.use(userRoutes);
app.use(searchRoutes);

// Clôture
app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT} 🚀 `);
});
