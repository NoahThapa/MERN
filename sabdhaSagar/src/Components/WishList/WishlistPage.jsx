// src/pages/WishlistPage.js

import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../Config/axiosConfig'; 
import AuthContext from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishlistPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get('/wishlist');// Debugging line
        setWishlistItems(response.data.wishlist || []);
      } catch (error) {
        console.error('API Error:', error); // Debugging line
        setError('Failed to fetch wishlist items.');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchWishlist();
    } else {
      setError('Please log in to view your wishlist.');
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      const response = await axiosInstance.delete(`/wishlist/${bookId}`);
      // console.log('Remove Response:', response.data);
      toast.success(response.data.msg);
      setWishlistItems(wishlistItems.filter(item => item.bookId._id !== bookId));
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error.response || error.message);
      setError('Failed to remove item from wishlist.');
      toast.error('Failed to remove item from wishlist.');
    }
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">
          Your wishlist is empty. <FontAwesomeIcon icon={faHeartBroken} className="ml-2" />
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-4 relative">
              <img
                src={`http://localhost:5000/uploads/books/${item.bookId.bookImage}`} // Ensure this is correct
                alt={item.bookId.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-semibold mb-2">{item.bookId.title || 'No Title'}</h2>
              <p className="text-gray-600 mb-2">By {item.bookId.author || 'No Author'}</p>
              <p className="text-lg font-bold">${item.bookId.price ? item.bookId.price.toFixed(2) : 'N/A'}</p>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveFromWishlist(item.bookId._id)}
                title="Remove from wishlist"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
