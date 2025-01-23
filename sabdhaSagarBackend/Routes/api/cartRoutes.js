const express = require('express');
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem
} = require('../../Controllers/cartController');
const auth  = require('../../Middleware/authMiddleware');
const authorizeRole = require('../../Middleware/authorizationMiddleware')

const router = express.Router();

router.route('/')
  .post(auth, addToCart)
  .get(auth, getCart)
  .put(auth, updateCartItem);

router.route('/:bookId')
  .delete(auth, authorizeRole('user'), deleteCartItem);

module.exports = router;
