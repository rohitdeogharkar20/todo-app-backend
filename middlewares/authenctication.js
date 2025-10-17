require("dotenv").config();

const { JWT_SECRET = "&^*1$-+12345&*^($)", JWT_EXPIRY = "1d" } = process.env;

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    { username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  return token;
};

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unautorized no token provided!" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  generateToken,
  authenticationToken,
};
