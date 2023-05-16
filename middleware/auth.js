const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extract the token from the authorization header
    const token = authHeader;

    // Verify the token
    jwt.verify(token, 'token', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        // Token is valid, retrieve the user information from the decoded token
        const userId = decodedToken.userId;

        console.log(`................................/////////......... ${userId}`)
        // Check if the user exists in the database
        User.findByPk(userId)
          .then((user) => {
            if (!user) {
              return res.status(401).json({ message: 'User not found' });
            }

            // Attach the user object to the request for further processing
            req.user = user;

            // Call the next middleware
            next();
          })
          .catch((error) => {
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    });
  } else {
    res.status(401).json({ message: 'Authorization header not found' });
  }
};

module.exports = {
    authenticate
};
