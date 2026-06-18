const jwt = require("jsonwebtoken");

const protect = (
  req,
  res,
  next
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    try {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      req.user = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

module.exports = protect;