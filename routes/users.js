const express = require('express');
const router = express.Router();
const auth = require('/Users/abhinavkrishna/Skroll-Backend/middleware/auth');
const users = require('/Users/abhinavkrishna/Skroll-Backend/controllers/usersController');

router.get('/:id', auth, users.getProfile);
router.post('/:id/follow', auth, users.followToggle);

module.exports = router;
