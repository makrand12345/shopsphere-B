const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ message: 'Unauthorized' });
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = decoded;
      next();
    } catch (err) {
      if (required) return res.status(401).json({ message: 'Invalid token' });
      next();
    }
  };
}

module.exports = auth;


