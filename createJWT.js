// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// exports.createToken = function (fn, ln, id) {
//   try {
//     const user = { userId: id, firstName: fn, lastName: ln };
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//     jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
//     return { accessToken };
//   } catch (e) {
//     return { error: e.message };
//   }
// };

// exports.isExpired = function (tokenStr) {
//   try {
//     jwt.verify(tokenStr, process.env.ACCESS_TOKEN_SECRET);
//     return false;
//   } catch (e) {
//     return true;
//   }
// };

// exports.refresh = function (tokenStr) {
//   const decoded = jwt.decode(tokenStr);
//   return exports.createToken(decoded.firstName, decoded.lastName, decoded.userId);
// };


// jwt might need some fixing
// keeping original code above just in case this porks everything
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (fn, ln, id) {
  try {
    const user = { userId: id, firstName: fn, lastName: ln };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    // jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
  const decoded = jwt.decode(tokenStr);
  return exports.createToken(decoded.firstName, decoded.lastName, decoded.userId);
};