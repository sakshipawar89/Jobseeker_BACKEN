const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const routes = require('./routing');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve uploaded CVs or images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DATABASE CONNECTED..."))
  .catch((error) => console.log("Database connection error:", error));

// API routes
app.use('/', routes);

// Root health check route
app.get('/', (req, res) => {
  res.send('Job Portal Backend is up and running!');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING on port ${PORT}...`));
