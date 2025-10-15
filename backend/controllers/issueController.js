const Issue = require('../models/issueModel');

// @desc    Get all issues
// @route   GET /api/issues
const getIssues = async (req, res) => {
  try {
    // We use .populate('user', 'name email') to also fetch the name and email
    // from the referenced User document.
    const issues = await Issue.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new issue
// @route   POST /api/issues
const createIssue = async (req, res) => {
  const { title, description, category, location, imageUrl } = req.body;

  if (!title || !description || !category || !location || !imageUrl) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl,
      user: req.user.id, // The user ID comes from our 'protect' middleware
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getIssues,
  createIssue,
};