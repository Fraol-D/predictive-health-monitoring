const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// API Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/recommendations", require("./routes/recommendations"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/sharing", require("./routes/sharing"));
app.use("/api/reports", require("./routes/reports"));

// Simple route for testing
app.get("/", (req, res) => {
  res.send("Predictive Health Monitoring Backend is running!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
