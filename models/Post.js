const mongoose = require('mongoose');

const CommentSubschema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, default: '' },
  mediaUrl: { type: String, required: true }, // local path or URL
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSubschema],
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
