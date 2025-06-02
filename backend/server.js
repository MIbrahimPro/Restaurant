// app.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const generalRoutes = require("./routes/general");
const adminRoutes = require("./routes/admin");

const app = express();

// 1) Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 2) Built‐in middleware
app.use(express.json());



function requestLogger(req, res, next) {
  // Log details about the incoming request
  console.log(`\n--- API Request ---`);
  console.log(`Method: ${req.method}`); // HTTP method (GET, POST, PUT, DELETE, etc.)
  console.log(`URL: ${req.originalUrl}`); // Full URL of the request
  console.log(`Timestamp: ${new Date().toISOString()}`); // Time of the request
  next();
}

app.use(requestLogger);




// If you want to serve uploaded images statically:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3) Mount routes
app.use('/admin', adminRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/general", generalRoutes);

// 4) Catch‐all 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

// 5) Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error." });
});

// 6) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
