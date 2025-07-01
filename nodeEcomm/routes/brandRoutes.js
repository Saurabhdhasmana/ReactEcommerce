const express=require("express");
const router= express.Router();
const {brandController,createbrandController,updatebrandController,deletebrandController}=require("../controllers/brandController");
const {upload}=require("../middleware/multer");




router.get("/brand",brandController);
router.post("/brand", upload.single("image"),createbrandController);
router.put("/brand/:id", upload.single("image"),updatebrandController);
router.delete("/brand/:id", deletebrandController);
module.exports=router;


