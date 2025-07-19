
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Ensure Firebase Admin SDK is initialized before any usage
require("./utils/firebaseAdmin");

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
const usersRouter = require("./routes/users");
const assessmentsRouter = require("./routes/assessments");
const chatRouter = require("./routes/chat");
const recommendationsRouter = require("./routes/recommendations");
const sharingRouter = require("./routes/sharing");
const notificationsRouter = require("./routes/notifications");
const reportsRouter = require("./routes/reports");
const insightsRouter = require("./routes/insights");

app.use("/api/users", usersRouter);
app.use("/api/assessments", assessmentsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/sharing", sharingRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/insights", insightsRouter);

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
