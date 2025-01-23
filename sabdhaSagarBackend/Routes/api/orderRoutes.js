const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder, getAllOrders } = require('../../Controllers/orderController');
const auth = require('../../Middleware/authMiddleware'); 
const adminMiddleware = require('../../Middleware/authorizationMiddleware');

// Routes for orders
router.post('/', auth, createOrder); // Create a new order (requires authentication)
router.get('/user', auth, getUserOrders); // Get all orders for the logged-in user (requires authentication)
router.get('/:orderId', auth, getOrderById); // Get a single order by ID (requires authentication)
router.put('/:orderId', auth, updateOrder); // Update an order (requires authentication)
router.patch('/:orderId/status', auth, adminMiddleware("admin"), updateOrderStatus); // Update order status (admin only)
router.delete('/:orderId', auth, adminMiddleware, deleteOrder); // Delete an order by ID (admin only)
router.get('/',auth, adminMiddleware("admin"), getAllOrders); // Get all orders (admin only)

module.exports = router;
