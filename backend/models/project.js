const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  files_folder: { type: String },
  languages_used: [{ type: String }],
  visibility: { type: String, enum: ['Public', 'Private', 'Restricted'], default: 'Public' },
  tags: [{ type: String }],
  status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  files: [{
    filename: String,
    filepath: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
