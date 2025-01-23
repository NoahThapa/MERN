// controllers/contactController.js

const Contact = require('../Models/contactUsModels');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate the input
    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    // Create a new contact document
    const newContact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // Save the contact message to the database
    await newContact.save();

    res.status(201).json({ msg: 'Contact message sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all contact messages (optional, for admin)
// @route   GET /api/contact
// @access  Private (admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export the controller functions
module.exports = {
  createContact,
  getContacts,
};
