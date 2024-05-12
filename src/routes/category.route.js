const express=require("express");
const router=express.Router();
const { getcategories, addcategories, deletecategories } = require("../services/category.js");
router.get('/', getcategories);
router.post('/add', addcategories);
router.delete('/delete/:id', deletecategories);
module.exports=router;