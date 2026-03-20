const jwt = require("jsonwebtoken");
const User = require("../models/User");

// middleware to protect routes
const protect = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = cookieToken || bearerToken;
  console.log(token, "token");

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded");

    const userInfo = await User.findById(decoded.id);
    console.log(userInfo, "userInfo");

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = userInfo;
    req.userId = userInfo._id;

    next(); //
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
};

module.exports = { protect };
