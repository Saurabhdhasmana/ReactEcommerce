const jwt = require("jsonwebtoken");

 function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if (!decoded.isAdmin) return res.status(403).json({ error: "Not admin" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
module.exports = adminAuth;