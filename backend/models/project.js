const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' }, 
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    files_folder: [{ type: String }], 
    languages_used: [{ type: String }], 
    status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
    visibility: { type: String, enum: ['Public', 'Private', 'Restricted'], default: 'Public' }, 
    tags: [{ type: String }], 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectsSchema);
