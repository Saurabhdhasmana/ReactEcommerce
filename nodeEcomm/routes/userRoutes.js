const express = require('express');
const router = express.Router();
const {userSignup,userLogin,getaSingleUser,getAllusers,updateUser,adminLogin} =require("../controllers/userController");

router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
router.get("/getaUser/:id", getaSingleUser);
router.get("/getallUsers", getAllusers);
router.put("/updateUser/:id", updateUser);
//admin login
router.post("/admin/login", adminLogin);
module.exports = router;
