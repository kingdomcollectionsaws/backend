
const orderService=require("../services/order.service.js");
const stripe = require('stripe')(process.env.STRIPE_KEY)

const createPaymentLink= async (orderId)=>{
    // const { amount, currency, receipt, notes } = reqData;
    

    try {
        const order = await orderService.findOrderById(orderId);

        const line_items = order.orderItems.map((i)=>(
         {
          price_data:{
            currency:"usd",
            product_data: {
                 name:i.product.title,
                images:[i.product.imageUrl[0]]  
             },
             unit_amount:Math.floor(order.totalPrice*100)
          },
          quantity:i.quantity
         }
        ))

        const session = await stripe.checkout.sessions.create({
          payment_method_types:["card"],
         line_items:line_items,
         mode:"payment",
          success_url:`${process.env.FRONTEND_URL}/account/order/${orderId}/{CHECKOUT_SESSION_ID}`,
         cancel_url:`${process.env.FRONTEND_URL}/cart`,
         })
console.log({id:session.id});
        return({id:session.id})
    
        // Return the payment link URL and ID in the response
        // const resData = {
        //   paymentLinkId: paymentLinkId,
        // };
        // return resData;
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw new Error(error.message);
      }
}

const updatePaymentInformation=async(reqData)=>{
    const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    // Fetch order details (You will need to implement the 'orderService.findOrderById' function)
    const order = await orderService.findOrderById(orderId);
    // Fetch he payment details using the payment ID
    const payment = await stripe.checkout.sessions.retrieve(paymentId);
    console.log(payment.status );
    if (payment.status == 'complete') {
      order.paymentDetails.paymentId=paymentId;
      order.paymentDetails.status='COMPLETED'; 
      order.orderStatus='PLACED';
      await order.save()
    }
    const resData = { message: 'Your order is placed', success: true };
    return resData
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(error.message)
  }
}

module.exports={createPaymentLink,updatePaymentInformation}