const express = require('express');
const auth = require('../../Middleware/authMiddleware');
const authorizeRole = require('../../Middleware/authorizationMiddleware');
const { bookImage } = require('../../Middleware/uploadMiddleware'); 

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../../Controllers/bookController');

const router = express.Router();

router.route('/')
  .get(getBooks)
  
  .post(auth, bookImage.single('bookImage'), authorizeRole('admin'), createBook);


router.route('/:id')
  .get(getBookById)
  .put( auth,bookImage.single('bookImage'), authorizeRole('admin'), updateBook)
  .delete(auth, authorizeRole('admin'), deleteBook);

module.exports = router;
