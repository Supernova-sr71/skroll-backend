const express = require('express');
const router = express.Router();
const auth = require('middleware/auth');
const users = require('controllers/usersController');

router.get('/:id', auth, users.getProfile);
router.post('/:id/follow', auth, users.followToggle);

module.exports = router;
