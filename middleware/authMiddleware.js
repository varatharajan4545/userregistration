const jwt = require('jsonwebtoken');
const config = require("../config/index");
const authMiddleware = (req, res, next) => {
    let token ;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.token) {
        token = req.cookies.token;
      }
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, config.jwt_secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };

module.exports =authMiddleware