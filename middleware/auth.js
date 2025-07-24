// ---------------------------------------------------------------------------
// This file is used to authenticate the user
// uses the backend/models/User.js file to get the data
// uses mongodb to store the data
// ---------------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const db = require("../Config/mysqldb");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (MySQL)
      const [rows] = await db.query(
        "SELECT * FROM users WHERE id = ? OR username = ?",
        [decoded.id, decoded.id]
      );
      if (!rows.length) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 2) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
