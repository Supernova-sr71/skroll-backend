const express = require('express');
const router = express.Router();
const auth = require('/Users/abhinavkrishna/Skroll-Backend/middleware/auth');
const upload = require('/Users/abhinavkrishna/Skroll-Backend/middleware/upload');
const posts = require('/Users/abhinavkrishna/Skroll-Backend/controllers/postsController');

router.post('/', auth, upload.single('media'), posts.createPost);
router.get('/feed', auth, posts.getFeed);
router.get('/:id', auth, posts.getPost);
router.post('/:id/like', auth, posts.toggleLike);
router.post('/:id/comment', auth, posts.addComment);

module.exports = router;
