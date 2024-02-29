const jwt = require("jsonwebtoken");
const jwtSecret =
  "a0272a903219d701138f13626afb46ec7dce5bfb59565b16f3749b6d378b7ba0837444";

  exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" });
          } else {
            next();
          }
        }
      });
    } else {
      return res
        .status(401)
        .json("Not authorized, token not available" );
    }
  };
  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" });
          } else {
            next();
          }
        }
      });
    } else {
      return res.status(401).json( "Not authorized, token not available" );
    }
  };