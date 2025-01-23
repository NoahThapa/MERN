// routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../../Controllers/contactCrontrollers');

// @route   POST /api/contact
// @desc    Create a new contact message
// @access  Public
router.post('/', createContact);

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Private (admin)
router.get('/', getContacts);

module.exports = router;