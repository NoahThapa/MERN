const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.header('Authorization');

  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token from the header
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    // Attach the decoded user to the request object
    req.user = decoded.user;
    
    next();
  } catch (err) {
    // Handle invalid token
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
