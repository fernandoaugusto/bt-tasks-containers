const jwt = require('jsonwebtoken');
const { createToken, getUserByToken } = require('../auth/auth.service');

const SECRET_KEY = process.env.SECRET_KEY || null;

const authenticate = async (req, res, next) => {
    if (!SECRET_KEY) {
      return res.status(401).json({ status_code: 401, message: "Please contact support team." });
    }
    const token = req.headers['x-auth'] || null;
    if (!token) {
      return res.status(401).json({ status_code: 401, message: "Auth token was not informed!" });
    }
    try {
      const resUser = await getUserByToken(token);
      req.user = resUser;
      req.next_token = createToken(resUser.id);
      next();
    } catch(error) {
      return res.status(401).json({ status_code: 401, message: error.message });
    }
  };

module.exports = { authenticate };