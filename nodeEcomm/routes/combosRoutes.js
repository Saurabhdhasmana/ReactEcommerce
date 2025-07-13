const express = require("express");
const { comboController, createcomboController, updatecomboController, deletecomboController } = require("../controllers/comboController");
const router = express.Router();
const { upload } = require("../middleware/multer");

router.get("/combos", comboController);
// Use upload.array for images field (max 10 images)
router.post("/combos", upload.array("images", 10), createcomboController);
router.put("/combos/:id", upload.array("images", 10), updatecomboController);
router.delete("/combos/:id", deletecomboController);
module.exports = router;