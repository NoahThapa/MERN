import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/authContext';
import axiosInstance from '../../Config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faTrash } from '@fortawesome/free-solid-svg-icons';

const CartPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        if (response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          setTotalPrice(response.data.totalPrice);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [isLoggedIn, navigate]);

  const handleQuantityChange = async (bookId, quantity) => {
    try {
      const updatedItems = cartItems.map(item => {
        if (item.book._id === bookId) {
          return { ...item, quantity: parseInt(quantity, 10) };
        }
        return item;
      });

      setCartItems(updatedItems);

      // Update quantity in the backend
      await axiosInstance.put('/cart', { bookId, quantity });

      // Recalculate the total price
      const newTotal = updatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
      setTotalPrice(newTotal);
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRemoveItem = async (bookId) => {
    try {
      // Remove the item from the backend
      await axiosInstance.delete(`/cart/${bookId}`);

      const updatedItems = cartItems.filter(item => item.book._id !== bookId);
      setCartItems(updatedItems);

      // Recalculate the total price
      const newTotal = updatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
      setTotalPrice(newTotal);
    } catch (error) {
      console.error('Error removing item', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-5">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <FontAwesomeIcon icon={faHeartBroken} className="ml-2" /> </p>
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-3">Book Title</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.book._id} className="border-b">
                  <td className="p-3">{item.book.title}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.book._id, e.target.value)}
                      min="1"
                      className="w-16 p-1 border rounded"
                    />
                  </td>
                  <td className="p-3">${item.price.toFixed(2)}</td>
                  <td className="p-3">${(item.quantity * item.price).toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold"
                      onClick={() => handleRemoveItem(item.book._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5">
            <h3 className="text-2xl font-bold">Total Price: ${totalPrice.toFixed(2)}</h3>
            <button className="mt-3 bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
