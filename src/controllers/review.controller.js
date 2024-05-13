
const Review = require('../models/review.model.js');
const reviewService = require('../services/review.service.js');

const createReview = async (req, res) => {
  const user = req.user
  const reqBody = req.body;  
  console.log(`product id ${reqBody.productId} - ${reqBody.review}`);

  try {
    
    const review =await reviewService.createReview(reqBody, user);
        
    return res.status(201).send(review);
  } catch (error) {
  
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
const allProductsReviews = async(req,res)=>{
  try {
    const reviews = await Review.find().populate("user").populate("product");
    res.json(reviews)
  
} catch (error) {
  res.json(error)
}

}
const getAllReview = async (req, res) => {
  const productId = req.params.productId;

  try {
   
    const reviews =await reviewService.getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
   
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {createReview,getAllReview,allProductsReviews}
