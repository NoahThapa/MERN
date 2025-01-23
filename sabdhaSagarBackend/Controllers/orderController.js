const Order = require('../Models/orderModels');
const createOrder = async (req, res) => {
    try {
      const { items, totalAmount, shippingAddress, userId } = req.body;
  
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      // Create a new order
      const newOrder = new Order({
        userId, 
        items,
        totalAmount,
        shippingAddress,
      });
  
      // Save the order to the database
      const savedOrder = await newOrder.save();
  
      res.status(201).json({ success: true, order: savedOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('userId', 'username') // Assuming `User` model has a `username` field
        .populate('items.bookId', 'title price'); // Populate book details
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ success: false, message: 'No orders found' });
      }
  
      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  
  
  

// Get all orders for the logged-in user
const getUserOrders = async (req, res) => {
    try {
      console.log('User ID from request:', req.user.id);
      const orders = await Order.find({ userId: req.user.id }).populate('items.bookId', 'title price');
      console.log('Orders found:', orders);
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  
// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.bookId', 'title price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an order (User can update their own order)
const updateOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    // Find the order by ID and ensure it belongs to the current user
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, userId: req.user._id },
      { shippingAddress },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Admin only)
// orderController.js

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
      const { orderStatus } = req.body;
      console.log('Received request to update order status:', req.params.orderId, orderStatus);
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { orderStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  module.exports = {
    updateOrderStatus
  };
  

// Delete an order by ID (Admin only)
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getAllOrders
};
