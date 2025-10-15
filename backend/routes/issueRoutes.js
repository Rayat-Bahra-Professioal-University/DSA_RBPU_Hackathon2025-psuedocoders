const express = require('express');
const router = express.Router();
const { getIssues, createIssue } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all issues and create a new one
router.route('/')
  .get(getIssues) // Anyone can view the issues
  .post(protect, createIssue); // Only a logged-in user can create an issue

module.exports = router;