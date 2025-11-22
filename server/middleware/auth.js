import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.header('authorization') || req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    // attach minimal user info
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    console.error('JWT verify failed', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authorization required' });
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden: insufficient role' });
  next();
};

export default authenticate;
