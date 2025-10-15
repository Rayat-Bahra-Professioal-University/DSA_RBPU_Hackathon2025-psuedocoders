const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import route files
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issueRoutes'); // <-- IMPORT NEW ROUTES

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the CityCare API! 🏙️" });
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes); // <-- USE NEW ROUTES

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});