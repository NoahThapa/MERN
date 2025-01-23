const express = require('express');
const router = express.Router();
const { addToWishlist, getUserWishlist, removeFromWishlist } = require('../../Controllers/wishListControllers');
const auth  = require('../../Middleware/authMiddleware');

router.post('/', auth, addToWishlist);
router.get('/', auth, getUserWishlist);
router.delete('/:id', auth, removeFromWishlist);

module.exports = router;
