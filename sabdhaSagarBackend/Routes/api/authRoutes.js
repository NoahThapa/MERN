const express = require('express');
const { registerUser, loginUser, getUserProfile,updateUserProfile } = require('../../Controllers/authControllers');
const auth = require('../../Middleware/authMiddleware');
const authorizeRole = require('../../Middleware/authorizationMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.put('/', auth, updateUserProfile);

module.exports = router;