const { verifyAccessToken } = require("../utility-functions");

async function authorizationMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Missing or invalid Authorization header.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authorization Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

module.exports.authorizationMiddleware = authorizationMiddleware;
