const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    id: { type: Number, required: true, unique: true },
    description: { type: String, default: '' }, 
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    files_folder: [{ type: String }], 
    languages_used: [{ type: String }], 
    status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
    visibility: { type: String, enum: ['Public', 'Private', 'Restricted'], default: 'Public' }, 
    tags: [{ type: String }], 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }], 
    tasks: [{ 
        title: { type: String },
        completed: { type: Boolean, default: false }
    }], 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectsSchema);
