
const User = require("../models/user.model.js");
const orderService=require("../services/order.service.js");
const stripe = require('stripe')(process.env.STRIPE_KEY)

const createPaymentLink= async (orderId)=>{
    // const { amount, currency, receipt, notes } = reqData;
    

    try {
        const order = await orderService.findOrderById(orderId);
        const user = await User.findById(order.user);
        
        let d = order.orderItems.length
        const line_item = order.orderItems.map((i)=>(
         {
          price_data:{
            currency:"usd",
            
            product_data: {
                 name:i.product.title,
                images:[i.product.imageUrl[0]]  
             },
            // unit_amount:Math.floor(order.totalPrice*100)
             unit_amount:Math.ceil(i.product.discountedPrice)*100
          },
          quantity:i.quantity
         }
        ))
        const session = await stripe.checkout.sessions.create({
      // payment_method_types:["card","Apple Pay"],
      payment_method_types:  ["card"],
  
         mode:"payment",
         billing_address_collection:"auto",
        
          success_url:`http://localhost:5173/account/order/${orderId}/{CHECKOUT_SESSION_ID}`,
         cancel_url:`http://localhost:5173/paynment/paymentcanceled`,
         })
console.log({id:session.id});
user.joiningBonus = 0;
user.save()
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
      
        // Call FedEx API to create shipment
          //  const shippingLabels = await createShipment(order); // Implement createShipment function

            // Save shipping labels to the order or send them to the user
        //    order.shippingLabels = shippingLabels; 
      await order.save()
    }
    const resData = {order:order, success: true };
    return resData
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(error.message)
  }
}


// const createShipment = async (order) => {
//   try {
//       // Construct the shipment request based on the order details
//       const shipmentRequestXml = constructShipmentRequest(order); // Implement this function

//       // Make a request to the FedEx shipping API endpoint
//       const response = await axios.post(fedexApiEndpoint, shipmentRequestXml, {
//           headers: {
//               'Content-Type': 'text/xml',
//               'Content-Length': shipmentRequestXml.length
//           },
//           auth: {
//               username: fedexApiKey,
//               password: fedexApiPassword
//           }
//       });

//       // Handle the response from FedEx API and extract shipping labels
//       const shippingLabels = parseShippingLabels(response.data); // Implement this function

//       // Return the shipping labels
//       return shippingLabels;
//   } catch (error) {
//       console.error('Error creating shipment with FedEx API:', error);
//       throw error;
//   }
// };

module.exports={createPaymentLink,updatePaymentInformation}