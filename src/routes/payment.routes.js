const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const paymentController=require("../controllers/payment.controller.js");
//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
router.post("/:id",authenticate,paymentController.createPaymentLink);
router.get("/",authenticate,paymentController.updatePaymentInformation);


module.exports=router;