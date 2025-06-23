const express=require("express");
const router= express.Router();
const getallBrands=require("../controllers/brandController");

router.get("/brand",getallBrands);

module.exports=router;


