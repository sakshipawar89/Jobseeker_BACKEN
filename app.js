const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const routes = require('./routing');

// ✅ Middleware for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Fixed CORS (no trailing slash in origin)
const allowedOrigin = 'https://jobseeker-forntend.vercel.app/';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ✅ Handle preflight requests correctly
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ DATABASE CONNECTED..."))
  .catch((error) => console.error("❌ Database connection error:", error));

// ✅ API routes
app.use('/', routes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Job Portal Backend is up and running!');
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING on port ${PORT}...`));


