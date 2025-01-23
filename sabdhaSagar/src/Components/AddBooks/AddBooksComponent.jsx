import React, { useState, useEffect } from "react";
import axiosInstance from "../../Config/axiosConfig";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBooksComponent = () => {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    price: '',
    bookImage: null,
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/all");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get("/book/");
      const booksData = response.data;

      if (Array.isArray(booksData)) {
        setBooks(booksData);
      } else if (booksData && Array.isArray(booksData.books)) {
        setBooks(booksData.books);
      } else {
        console.error('Books data is not an array or missing:', booksData);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageChange = (e) => {
    setBookData({ ...bookData, bookImage: e.target.files[0] });
  };

  const validate = () => {
    const errors = {};
    if (!bookData.title) errors.title = "Title is required";
    if (!bookData.author) errors.author = "Author is required";
    if (!bookData.category) errors.category = "Category is required";
    if (!bookData.description) errors.description = "Description is required";
    if (!bookData.price) errors.price = "Price is required";
    if (!bookData.bookImage && !isEditing) errors.bookImage = "Book image is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('category', bookData.category);
      formData.append('description', bookData.description);
      formData.append('price', bookData.price);
      if (bookData.bookImage) formData.append('bookImage', bookData.bookImage);

      try {
        if (isEditing) {
          await axiosInstance.put(`/book/${editingBook._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success('Book updated successfully!');
        } else {
          await axiosInstance.post("/book", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success('Book added successfully!');
        }
        setBookData({
          title: '',
          author: '',
          category: '',
          description: '',
          price: '',
          bookImage: null,
        });
        setIsEditing(false);
        fetchBooks();
      } catch (error) {
        toast.error(error.response.data.msg || 'Failed to save book');
      }
    }
  };

  const handleEdit = async (bookId) => {
    try {
      const response = await axiosInstance.get(`/book/${bookId}`);
      const book = response.data;

      if (book) {
        setBookData({
          title: book.title || '',
          author: book.author || '',
          category: book.category || '',
          description: book.description || '',
          price: book.price || '',
          bookImage: null,
        });
        setEditingBook(book);
        setIsEditing(true);
      } else {
        toast.error('Book details not found.');
      }
    } catch (error) {
      toast.error('Failed to fetch book details.');
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axiosInstance.delete(`/book/${bookId}`);
      toast.success('Book deleted successfully!');
      fetchBooks();
    } catch (error) {
      toast.error(error.response.data.msg || 'Failed to delete book');
    }
  };

  return (
    <div className="m-16 gap-4">
      <ToastContainer />
      <h2 className="font-serif text-5xl mb-6">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="font-serif gap-3 mb-10">
        <div className="mb-5">
          <label htmlFor="title" className="gap-3 text-lg">Title</label>
          <br />
          <input
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            type="text"
            id="title"
            name="title"
            placeholder="Enter book title"
            value={bookData.title}
            onChange={handleInputChange}
            required
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="author" className="gap-3 text-lg">Author</label>
          <br />
          <input
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            type="text"
            id="author"
            name="author"
            placeholder="Enter book author"
            value={bookData.author}
            onChange={handleInputChange}
            required
          />
          {errors.author && <p className="text-red-600">{errors.author}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="category" className="gap-3 text-lg">Category</label>
          <br />
          <select
            id="category"
            name="category"
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            value={bookData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-600">{errors.category}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="description" className="gap-3 text-lg">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded h-36"
            placeholder="Enter book description"
            value={bookData.description}
            onChange={handleInputChange}
            required
          ></textarea>
          {errors.description && <p className="text-red-600">{errors.description}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="price" className="gap-3 text-lg">Price</label>
          <br />
          <input
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            type="number"
            id="price"
            name="price"
            placeholder="Enter book price"
            value={bookData.price}
            onChange={handleInputChange}
            required
          />
          {errors.price && <p className="text-red-600">{errors.price}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="bookImage" className="gap-3 text-lg">Book Image</label>
          <br />
          <input
            className="bg-gray-200 px-5 py-3 w-2/4 focus:outline focus:outline-red-500 rounded"
            type="file"
            id="bookImage"
            name="bookImage"
            onChange={handleImageChange}
            required={!isEditing}
          />
          {errors.bookImage && <p className="text-red-600">{errors.bookImage}</p>}
        </div>
        <button
          type="submit"
          className="bg-red-600 border border-red-600 px-6 py-4 text-white rounded-md font-serif font-bold text-xs hover:bg-white hover:text-red-600 hover:drop-shadow-xl transition-all"
        >
                    {isEditing ? 'Update Book' : 'Add Book'}
        </button>
      </form>
      <div className="font-serif">
        <h3 className="text-3xl mb-5">Book List</h3>
        <ul className="space-y-4">
          {books.map((book) => (
            <li
              key={book._id}
              className="flex justify-between items-center p-4 border-b border-gray-300 shadow-md rounded-md"
            >
              <div>
                <h4 className="text-2xl font-semibold">{book.title}</h4>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600">Category: {book.category}</p>
                <p className="text-gray-600">Price: ${book.price}</p>
                <p className="text-gray-600">{book.description}</p>
              </div>
              {book.bookImage && (
                <img
                  src={`http://localhost:5000/${book.bookImage}`}
                  alt={book.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex items-center">
                <button
                  onClick={() => handleEdit(book._id)}
                  className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <AiFillEdit size={24} />
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <AiFillDelete size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddBooksComponent;

