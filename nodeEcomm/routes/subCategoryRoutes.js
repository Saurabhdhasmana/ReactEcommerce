const express=require("express");
const router=express.Router();
const {subCategoryController,getAllSubCategories,updateSubCategory,deleteSubCategory}=require("../controllers/subCategoryController");
const {upload}=require("../middleware/multer")

router.post("/subcategory", upload.single("image"), subCategoryController);
router.get("/subcategory", getAllSubCategories);
router.put("/subcategory/:id", upload.single("image"), updateSubCategory);
router.delete("/subcategory/:id", deleteSubCategory);

module.exports = router;
