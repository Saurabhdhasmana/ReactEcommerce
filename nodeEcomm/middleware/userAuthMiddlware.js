const jwt=require("jsonwebtoken");
const userModel = require("../models/userModel");
async function userAuth(req, res, next) {
const head=req.headers.authorization?.split(" ")[1]
if(!head) {
	return res.status(401).json({ message: "Unauthorized" });
  }
  try {
	const decoded = jwt.verify(head, process.env.JWT_SECRET);
    if (!decoded.isUser) {
	  return res.status(403).json({ message: "Forbidden" });
	}
   const user=await userModel.findOne({_id:decoded.id})
	if(!user) {	
	  return res.status(404).json({ message: "User not found" });
	}
	req.user = user;
   console.log("User authenticated:", user);
	next();
  } catch {
	res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = userAuth;