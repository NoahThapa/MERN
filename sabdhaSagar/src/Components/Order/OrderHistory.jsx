// src/components/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
          const response = await axiosInstance.get('/order/user');
          console.log('Orders Response:', response.data); // Debug response data
          setOrders(response.data.orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Error fetching orders');
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-5">Order History</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Books</th>
            <th className="py-2 px-4 border-b">Total Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Shipping Address</th>
            <th className="py-2 px-4 border-b">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">
                {order.items.map(item => (
                  <div key={item._id}>
                    <p>{item.bookId.title} - ${item.price} x {item.quantity}</p>
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">${order.totalAmount}</td>
              <td className="py-2 px-4 border-b">{order.orderStatus}</td>
              <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
              <td className="py-2 px-4 border-b">{new Date(order.orderDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer /> {/* Display Toast notifications */}
    </div>
  );
};

export default OrderHistoryPage;
