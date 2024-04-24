const express=require("express");
const { createblog, getblog, deleteblog, updateblog, getblogbyslug } = require("../controllers/blog");

const router=express.Router();
router.post("/create",createblog);
router.get("/allblogs",getblog);
router.get("/:slug",getblogbyslug);
router.delete("/delete",deleteblog);
router.put("/update",updateblog);
module.exports=router;