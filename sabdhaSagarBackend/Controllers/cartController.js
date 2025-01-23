    const asyncHandler = require('express-async-handler');
    const Cart = require('../Models/cartModels');
    const Book = require('../Models/bookModels');
    // @desc    Add items to cart
    // @route   POST /api/cart
    // @access  Private
    const addToCart = asyncHandler(async (req, res) => {
        const { bookId, quantity } = req.body;
    
        // Validate the request body
        if (!bookId || !quantity) {
        return res.status(400).json({ msg: 'Book ID and quantity are required' });
        }
    
        const book = await Book.findById(bookId);
    
        if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
        }
    
        let cart = await Cart.findOne({ user: req.user.id });
    
        if (cart) {
        // Ensure items is an array
        cart.items = cart.items || [];
        const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    
        if (itemIndex > -1) {
            // Book exists in cart, update the quantity
            let item = cart.items[itemIndex];
            item.quantity += quantity;
            cart.items[itemIndex] = item;
        } else {
            // Book does not exist in cart, add new item
            cart.items.push({ book: bookId, quantity, price: book.price });
        }
    
        // Update total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    
        const updatedCart = await cart.save();
        res.json(updatedCart);
        } else {
        // No cart for user, create new cart
        const newCart = await Cart.create({
            user: req.user.id,
            items: [{ book: bookId, quantity, price: book.price }],
            totalPrice: quantity * book.price
        });
        res.status(201).json(newCart);
        }
    });
    
    // @desc    Get user cart
    // @route   GET /api/cart   
    // @access  Private
    const getCart = asyncHandler(async (req, res) => {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.book', 'title price');
    
        if (cart) {
        res.json(cart);
        } else {
        res.status(404).json({ msg: 'Cart not found' });
        }
    });
    
    // @desc    Update cart item
    // @route   PUT /api/cart
    // @access  Private
    const updateCartItem = asyncHandler(async (req, res) => {
        const { bookId, quantity } = req.body;
    
        const cart = await Cart.findOne({ user: req.user.id });
    
        if (cart) {
        cart.items = cart.items || []; // Ensure items is an array
        const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    
        if (itemIndex > -1) {
            if (quantity <= 0) {
            cart.items.splice(itemIndex, 1); // Remove item from cart
            } else {
            cart.items[itemIndex].quantity = quantity; // Update quantity
            }
            
            // Update total price
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } else {
            res.status(404).json({ msg: 'Book not found in cart' });
        }
        } else {
        res.status(404).json({ msg: 'Cart not found' });
        }
    });
    
    // @desc    Delete cart item
    // @route   DELETE /api/cart/:bookId
    // @access  Private
    const deleteCartItem = asyncHandler(async (req, res) => {
        const { bookId } = req.params;
    
        const cart = await Cart.findOne({ user: req.user.id });
    
        if (cart) {
        cart.items = cart.items || []; // Ensure items is an array
        const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
    
            // Update total price
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } else {
            res.status(404).json({ msg: 'Book not found in cart' });
        }
        } else {
        res.status(404).json({ msg: 'Cart not found' });
        }
    });
    
    module.exports = {
        addToCart,
        getCart,
        updateCartItem,
        deleteCartItem
    };