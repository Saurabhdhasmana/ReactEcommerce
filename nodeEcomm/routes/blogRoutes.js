const express = require("express");
const { blogController, getAllblogController, deleteBlogController, updateBlogController, getSingleblogController } = require("../controllers/blogController");
const router = express.Router();
const { upload } = require("../middleware/multer");

router.post("/create", upload.single("image"), blogController);
router.get("/getAll", getAllblogController);
router.delete("/delete/:id", deleteBlogController);
router.put("/update/:id", upload.single("image"), updateBlogController);
router.get("/getSingle/:id", getSingleblogController);

module.exports = router;

