const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const issueRoutes = require('./routes/issues');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/citycare";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});


// --- API Routes ---
app.use('/api/issues', issueRoutes);


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
