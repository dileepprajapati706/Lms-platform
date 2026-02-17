const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ADD THIS - JSON Parse Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format! Please check your request body.",
      hint: "Use double quotes, no trailing commas, no comments in JSON"
    });
  }
  next(err);
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/internal-users", require("./routes/internalUserRoutes"));
app.use("/api/learners", require("./routes/learnerRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lectures", require("./routes/lectureRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "LMS API is running..." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});