const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminAuth(req, res, next) {
  const token = req.headers.token;

  const decodedData = jwt.verify(token, JWT_ADMIN_PASSWORD);

  if (decodedData) {
    req.adminId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      message: "Something Went Wrong",
    });
  }
}

module.exports = {
  adminAuth,
};
