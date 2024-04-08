
const User = require("../models/Doctor");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid.",
      });
    }

    // Extract the token without the 'Bearer ' prefix
    const tokenWithoutPrefix = token.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(tokenWithoutPrefix, "your-secret-key");

    // Attach user information to the request object
    req.user = await User.findById(decoded.userId);

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({
      success: false,
      message: "Invalid token or user not found.",
    });
  }
};



// const authenticateToken = async (req, res, next) => {
//   try {
//     // Get the JWT token from the Authorization header
//     const { token } = req.cookies;
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token is missing.",
//       });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, "your-secret-key");
//     req.user = await User.findById(decoded.userId);

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(403).json({
//       success: false,
//       message: "Invalid token.",
//     });
//   }
// };

module.exports = authenticateToken;
