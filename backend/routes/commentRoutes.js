    const express = require('express');
    const router = express.Router();
    const { getComments, createComment } = require('../controllers/commentController');
    const { protect } = require('../middleware/authMiddleware');

    // Route to get all comments for a specific issue
    router.route('/:issueId').get(getComments);

    // Route to create a new comment on a specific issue (protected)
    router.route('/:issueId').post(protect, createComment);

    module.exports = router;
    
