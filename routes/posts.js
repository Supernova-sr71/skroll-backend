const express = require('express');
const router = express.Router();
const auth = require('middleware/auth');
const upload = require('middleware/upload');
const posts = require('controllers/postsController');

router.post('/', auth, upload.single('media'), posts.createPost);
router.get('/feed', auth, posts.getFeed);
router.get('/:id', auth, posts.getPost);
router.post('/:id/like', auth, posts.toggleLike);
router.post('/:id/comment', auth, posts.addComment);

module.exports = router;
