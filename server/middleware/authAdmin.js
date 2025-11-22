export default function requireAdmin(req, res, next) {
  const token = req.header('x-admin-token') || req.query.adminToken;
  const expected = process.env.DEV_ADMIN_TOKEN;
  if (!expected) {
    return res.status(500).json({ error: 'Admin token not configured on server' });
  }
  if (!token || token !== expected) {
    return res.status(403).json({ error: 'Forbidden: invalid admin token' });
  }
  next();
}
