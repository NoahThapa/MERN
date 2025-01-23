const User = require('../Models/userModels');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const UserProfile = require('../Models/userProfile.js');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullname,email, username, password, role } = req.body;
  

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400).json({
   
        error: 'User already existssss',
        message: 'The user you are trying to register already exists in the system.'
    });
    return
    throw new Error('User already existsssss');
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    role, // Role can be user, or admin
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      msg:"User registered succesfully",
      fullname: user.fullname,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({msg:"registration failed"});
    throw new Error('Invalid user data');
  }
});

// Authenticate user and get token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    console.log("User found:", user); 

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: 'User logged in successfully', token, userDetails: user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  const { fullname, email } = req.body;
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;

    // Save updated user
    await user.save();

    res.json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
