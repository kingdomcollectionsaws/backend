const express=require("express");
const router=express.Router();
const { updateproductvariations, addproductvariations, deleteproductvariations } = require("../services/product.service.js");
router.put('/variations/update', updateproductvariations);
router.post('/variations/add', addproductvariations);
router.delete('/variations/delete', deleteproductvariations);
module.exports=router;