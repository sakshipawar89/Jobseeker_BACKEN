const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const routes = require('./routing');

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Corrected CORS (spelling fixed)
app.use(cors({
  origin: "https://jobseeker-forntend-f1ik.vercel.app/", // Make sure this matches your Vercel frontend
  credentials: true
}));

// ✅ Preflight request support
app.options('*', cors());

// ✅ Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ DATABASE CONNECTED..."))
  .catch((error) => console.log("❌ Database connection error:", error));

// ✅ API routes
app.use('/', routes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Job Portal Backend is up and running!');
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING on port ${PORT}...`));

