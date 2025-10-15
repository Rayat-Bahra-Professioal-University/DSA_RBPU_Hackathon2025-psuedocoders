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
  // The text fields are now in req.body
  const { title, description, category, latitude, longitude } = req.body;

  // The image URL is constructed from the file path
  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;

  const location = { latitude, longitude };

  if (!title || !description || !category || !location || !imageUrl) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl, // <-- Use the newly constructed URL
      user: req.user.id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      // Get the new status from the request body
      issue.status = req.body.status || issue.status;
      
      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getMyIssues = async (req, res) => {
  try {
    // Find issues where the 'user' field matches the logged-in user's ID
    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getIssues,
  createIssue,
  updateIssueStatus,
  getMyIssues,
};