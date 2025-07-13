const blogModel=require("../models/blogModel");
const blogController=async(req,res)=>{
const {title, description, image,}=req.body;

await blogModel.create({
title,
description,	
image,
})

}
module.exports= blogController;