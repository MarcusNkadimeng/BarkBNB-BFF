const admin = require("../config/firebaseAdmin.js");

const firebaseAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  console.log("Received Token:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);
    if (!decodedToken) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid token. Wassup though?" });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = firebaseAuthMiddleware;
