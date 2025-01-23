import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Config/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/order/'); // Fetch orders from the API
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders'); // Show error notification
      } finally {
        setLoading(false); // Ensure loading state is updated even if there's an error
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/order/${orderId}/status`, { orderStatus: status });
      setOrders(prevOrders => 
        prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: status } : order)
      );
      toast.success('Order status updated successfully'); // Show success notification
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status'); // Show error notification
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-5">All Orders</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">User Name</th>
            <th className="py-2 px-4 border-b">Books</th>
            <th className="py-2 px-4 border-b">Total Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Shipping Address</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">{order.userId.username}</td>
              <td className="py-2 px-4 border-b">
                {order.items.map(item => (
                  <div key={item.bookId._id}>
                    <p>{item.bookId.title} - ${item.price} x {item.quantity}</p>
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">${order.totalAmount}</td>
              <td className="py-2 px-4 border-b">{order.orderStatus}</td>
              <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer /> {/* Display Toast notifications */}
    </div>
  );
};

export default AdminOrdersPage;
