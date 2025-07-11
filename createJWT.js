const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (fn, ln, id) {
  try {
    const user = { userId: id, firstName: fn, lastName: ln };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m' // or '1h', '24h', etc.
    });
    return { accessToken };
  } catch (e) {
    return { error: e.message };
  }
};


exports.isExpired = function (tokenStr) {
  try {
    jwt.verify(tokenStr, process.env.ACCESS_TOKEN_SECRET);
    return false;
  } catch (e) {
    return true;
  }
};

exports.refresh = function (tokenStr) {
  try {
    const decoded = jwt.decode(tokenStr);
    if (!decoded || !decoded.userId) throw new Error("Invalid token");
    const tokenObj = exports.createToken(decoded.firstName, decoded.lastName, decoded.userId);
    return tokenObj.accessToken || "";
  } catch (e) {
    return { error: e.message };
  }
};