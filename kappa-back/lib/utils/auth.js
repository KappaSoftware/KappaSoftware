const jwt = require("jsonwebtoken");
const config = require("./config");

function createToken(data) {
  return jwt.sign(data, config.secret, { algorithm: "HS256", expiresIn: "1h" });
}

function checkToken(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
}

module.exports = {
  checkToken: checkToken,
  createToken: createToken,
};
