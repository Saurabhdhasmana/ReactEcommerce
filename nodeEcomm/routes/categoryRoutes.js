const express = require('express');
const router=express.Router();
const {upload} = require("../middleware/multer");
const {createCategory,deleteCategory,updateCategory,getallCategories}=require("../controllers/categoryController");
const adminAuth=require("../middleware/authMiddleware");

router.get("/category",getallCategories);
router.post("/category",upload.single("image"),createCategory);
router.put("/category/:id",upload.single("image"),updateCategory);
router.delete("/category/:id",deleteCategory);

module.exports = router;