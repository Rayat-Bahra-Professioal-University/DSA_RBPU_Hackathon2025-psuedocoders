const express = require('express');
const router = express.Router();
const {
  getIssues,
  createIssue,
  updateIssueStatus,
  getMyIssues,
  getIssueById,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Route for getting all issues and creating a new one
router.route('/')
  .get(getIssues)
  .post(protect, upload.single('image'), createIssue);

// Route for getting a user's own issues (This must come BEFORE /:id)
router.route('/myissues').get(protect, getMyIssues);

// --- CORRECTED ORDER ---
// The more specific route with '/status' MUST come before the general '/:id' route.

// Route for updating an issue's status
router.route('/:id/status')
  .put(protect, admin, updateIssueStatus);

// Route for getting a single issue by ID (This must be last)
router.route('/:id').get(getIssueById);

module.exports = router;