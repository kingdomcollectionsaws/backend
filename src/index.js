const express=require("express")
const cors=require('cors');
const app=express();
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    return res.status(200).send({message:"welcome to ecommerce api - node"})
})

const { default: axios } = require("axios")

const getlocation = async(req,res)=>{
    try {
        const response = await fetch('http://www.geoplugin.net/json.gp');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        const data = await response.json();
        console.log(data.geoplugin_countryCode);
       return data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}
getlocation()
module.exports = getlocation;
const authRouter=require("./routes/auth.routes.js")
app.use("/auth",authRouter)

const userRouter=require("./routes/user.routes.js");
app.use("/api/users",userRouter)

const productRouter=require("./routes/product.routes.js");
app.use("/api/products",productRouter);

const adminProductRouter=require("./routes/product.admin.routes.js");
app.use("/api/admin/products",adminProductRouter);

const cartRouter=require("./routes/cart.routes.js")
app.use("/api/cart", cartRouter);


const cartItemRouter=require("./routes/cartItem.routes.js")
app.use("/api/cart_items",cartItemRouter);

const orderRouter=require("./routes/order.routes.js");
app.use("/api/orders",orderRouter);

const paymentRouter=require("./routes/payment.routes.js");
app.use('/api/payments',paymentRouter)

const reviewRouter=require("./routes/review.routes.js");
app.use("/api/reviews",reviewRouter);

const ratingRouter=require("./routes/rating.routes.js");
app.use("/api/ratings",ratingRouter);

// admin routes handler
const adminOrderRoutes=require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders",adminOrderRoutes);
const blogroute = require('./routes/blog.route.js')
app.use("/api/blog",blogroute);



module.exports={app};
