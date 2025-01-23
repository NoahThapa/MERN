import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/authContext';
import axiosInstance from '../../Config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPage = () => {
  const { userId } = useContext(AuthContext); // Retrieve userId from AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.log('User ID is missing');
      return;
    }

    console.log('User ID:', userId); // Debugging: Log userId

    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        setCartItems(response.data.items);
        setTotalAmount(response.data.totalPrice);
      } catch (error) {
        console.error('Error fetching cart items', error);
        toast.error('Error fetching cart items');
      }
    };

    fetchCartItems();
  }, [userId]);
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
  
    if (!shippingAddress) {
      setError('Shipping address is required');
      return;
    }
  
    if (!userId) {
      console.error('User ID is not available');
      setError('User ID is not available');
      return;
    }
  
    try {
      const formattedItems = cartItems.map(item => ({
        bookId: item.book._id,
        bookName: item.book.title,
        quantity: item.quantity,
        price: item.price
      }));
  
      console.log("Order Payload:", {
        userId,
        items: formattedItems,
        totalAmount,
        shippingAddress
      });
  
      const response = await axiosInstance.post('/order', {
        userId,
        items: formattedItems,
        totalAmount,
        shippingAddress
      });
  
      const order = response.data.order; // Extract the order from the response data
  
      console.log('Order placed:', order);
      toast.success('Order placed successfully!');
  
      // Navigate to the order confirmation page with the order details
      navigate('/order-confirmation', { state: { order } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order');
      setError('Error placing order');
    }
  };
  

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-5">Checkout</h2>
      <form onSubmit={handleOrderSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippingAddress">
            Shipping Address
          </label>
          <input
            type="text"
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <ul className="list-disc pl-5">
            {cartItems.map((item) => (
              <li key={item.book._id} className="flex justify-between py-2">
                <span>{item.book.title}</span>
                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between py-2 mt-2 border-t border-gray-300">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600"
          >
            Place Order
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default OrderPage;
