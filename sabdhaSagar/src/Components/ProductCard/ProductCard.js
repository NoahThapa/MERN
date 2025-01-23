import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faInfoCircle, faHeart } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../Config/axiosConfig';
import { toast } from 'react-toastify'; // Import toast

const ProductCard = ({ product }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const imageUrl = `http://localhost:5000/uploads/books/${product.bookImage}`;

  const handleInfoIconClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };
  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post('/cart', {
        bookId: product._id,
        quantity: 1 // Default quantity to 1, or you can set it dynamically
      });
      console.log('Added to cart:', response.data);
      toast.success('Item has been added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
  };
  

  const handleAddToWishlist = async () => {
    try {
      const response = await axiosInstance.post('/wishlist', {
        bookId: product._id
      });
      console.log('Added to wishlist:', response.data);
      toast.success('Book added to wishlist!'); // Show success notification
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Book is already in your wishlist!'); // Show error notification
    }
  };

  return (
    <div 
      className="p-4 rounded hover:shadow-xl hover:scale-105 transition-transform relative"
    >
      {/* Information Icon */}
      <div 
        className="absolute top-3 right-4"
        onClick={handleInfoIconClick}
      >
        <FontAwesomeIcon 
          icon={faInfoCircle} 
          className="text-gray-400 cursor-pointer text-xl hover:text-blue-700 transition-colors"
          title="View Details"
        />
      </div>
      {/* Product Image */}
      <img  
        src={imageUrl} 
        alt={product.title} 
        className="mb-4 w-full object-cover rounded"
      />
      {/* Add to Cart and Add to Wishlist Icons */}
      <div className="absolute bottom-1 right-1 flex gap-2 z-10">
        <FontAwesomeIcon 
          icon={faCartPlus} 
          className="text-gray-400 cursor-pointer text-xl hover:text-red-700 transition-colors"
          title="Add to Cart"
          onClick={handleAddToCart}
        />
        <FontAwesomeIcon 
          icon={faHeart} 
          className="text-red-300 cursor-pointer text-xl hover:text-red-600 transition-colors"
          title="Add to Wishlist"
          onClick={handleAddToWishlist}
        />
      </div>
      {/* Product Details */}
      <div className="mb-2 text-center">
        <p className="text-amber-500 text-lg font-bold">${product.price.toFixed(2)}</p>
        <p className="text-gray-800 text-2xl uppercase font-serif hover:text-red-700 cursor-pointer">{product.title}</p>
        <p className="text-gray-500 text-l hover:text-red-700 cursor-pointer translate-x-2 capitalize">By {product.author}</p>
      </div>
      {/* Description Overlay */}
      {isOverlayVisible && (
        <div 
          className="absolute inset-0 bg-gray-800 bg-opacity-75 text-white flex items-center justify-center p-4 rounded transition-opacity duration-300 opacity-100"
          onClick={() => setIsOverlayVisible(false)} // Hide the overlay on click
        >
          <p className="text-center">{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
