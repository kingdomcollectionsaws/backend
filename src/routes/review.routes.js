const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const reviewController = require("../controllers/review.controller.js");

router.post("/create",authenticate,reviewController.createReview);
router.get("/product/:productId",reviewController.getAllReview);
router.get('/allreviews',reviewController.allProductsReviews);
module.exports=router;