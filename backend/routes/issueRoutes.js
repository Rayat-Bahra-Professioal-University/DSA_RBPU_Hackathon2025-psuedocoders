const express = require('express');
const router = express.Router();
const { getIssues, createIssue,updateIssueStatus } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route to get all issues and create a new one
router.route('/')
  .get(getIssues) // Anyone can view the issues
  .post(protect, createIssue)// Only a logged-in user can create an issue
  .post(protect, upload.single('image'), createIssue);

module.exports = router;