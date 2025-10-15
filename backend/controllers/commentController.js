    const Comment = require('../models/commentModel');
    const Issue = require('../models/issueModel');

    // @desc    Get all comments for an issue
    // @route   GET /api/comments/:issueId
    const getComments = async (req, res) => {
        try {
            const comments = await Comment.find({ issue: req.params.issueId })
                .populate('user', 'name') // Get the commenter's name
                .sort({ createdAt: 'desc' });
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    };

    // @desc    Create a new comment
    // @route   POST /api/comments/:issueId
    const createComment = async (req, res) => {
        try {
            const issue = await Issue.findById(req.params.issueId);
            if (!issue) {
                return res.status(404).json({ message: "Issue not found" });
            }

            const comment = new Comment({
                text: req.body.text,
                user: req.user.id, // from protect middleware
                issue: req.params.issueId,
            });

            const createdComment = await comment.save();
            res.status(201).json(createdComment);
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    };

    module.exports = { getComments, createComment };
    
