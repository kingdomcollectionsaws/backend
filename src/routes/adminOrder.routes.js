const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const adminOrderController=require("../controllers/adminOrder.controller.js");
const { createShipping, customTrackingId } = require("../controllers/fedexauth.js");
router.get("/",authenticate,adminOrderController.getAllOrders);
router.get("/alladdress",authenticate,adminOrderController.getAllOrdersAddress);
router.get("/allusers", adminOrderController.getAllusers);
router.put("/:orderId/confirmed",authenticate,adminOrderController.confirmedOrder);
router.put("/:orderId/ship",authenticate,adminOrderController.shippOrder);
router.put("/trakingId",authenticate,customTrackingId);
router.put("/:orderId/deliver",authenticate,adminOrderController.deliverOrder);
router.put("/:orderId/cancel",authenticate,adminOrderController.cancelledOrder);
router.delete("/:orderId/delete",authenticate,adminOrderController.deleteOrder);
router.post("/fedex/shiping",authenticate,createShipping);

module.exports=router;