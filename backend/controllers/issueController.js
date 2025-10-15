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
  // Destructure city and state from the body
  const { title, description, category, latitude, longitude, city, state } = req.body;
  
  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
  const location = { latitude, longitude };

  // Add validation for new fields
  if (!title || !description || !category || !location || !imageUrl || !city || !state) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl,
      city, // <-- Add city
      state, // <-- Add state
      user: req.user.id,
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update an issue's status
// @route   PUT /api/issues/:id/status
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


// @desc    Get logged in user's issues
// @route   GET /api/issues/myissues
const getMyIssues = async (req, res) => {
  try {
    // Find issues where the 'user' field matches the logged-in user's ID
    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get a single issue by ID
// @route   GET /api/issues/:id
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('user', 'name email');

    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


// exports
module.exports = {
  getIssues,
  createIssue,
  updateIssueStatus,
  getMyIssues,
  getIssueById,
};