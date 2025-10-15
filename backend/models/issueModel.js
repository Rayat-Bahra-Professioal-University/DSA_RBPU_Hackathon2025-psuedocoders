const mongoose = require('mongoose');

const issueSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    // ADD THESE TWO NEW FIELDS
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
