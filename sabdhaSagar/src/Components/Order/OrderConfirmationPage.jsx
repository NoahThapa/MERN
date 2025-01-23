import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <p>No order details available.</p>;
  }

  return (
    <div className="container mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-5 text-center">Order Confirmation</h2>
      <p className="text-lg mb-3 text-center">Thank you for your order!</p>
      <div className="border-t pt-4">
        <h3 className="text-2xl font-bold mb-4">Order Details:</h3>
        <p className="mb-2"><strong>Order ID:</strong> {order._id}</p>
        <p className="mb-2"><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
        <p className="mb-4"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <h4 className="text-xl font-bold mb-3">Items:</h4>
        <ul className="list-disc pl-5 space-y-3">
          {order.items.map(item => (
            <li key={item._id} className="border p-3 rounded bg-gray-100">
              <p><strong>Book ID:</strong> {item.bookId}</p>
              <p><strong>Book Name:</strong> {item.bookName}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
