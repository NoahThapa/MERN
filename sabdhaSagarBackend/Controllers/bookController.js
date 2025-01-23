const asyncHandler = require('express-async-handler');
const Book = require('../Models/bookModels');
const multer = require('multer');
// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, category, description, price } = req.body;
    const bookImagePath = req.file ? req.file.filename : null;

    const newBook = new Book({
      title,
      author,
      category,
      description,
      price,
      bookImage: bookImagePath // Save only the filename
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
// Get all books
const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single book by ID
const getBookById = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ msg: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Update a book by ID
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, category, description, price } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Log the incoming data for debugging
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.price = price || book.price;

    // If there's an image in the request, update it
    if (req.file) {
      book.bookImage = req.file.path; // Ensure the path is correctly handled
    }

    const updatedBook = await book.save();
    res.json(updatedBook);

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Delete a book by ID
const deleteBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ msg: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
