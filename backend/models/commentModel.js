const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the user who commented
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Issue', // Reference to the issue being commented on
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
