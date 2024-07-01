const mongoose = require("mongoose")

// const mongoDbUrl='mongodb+srv://codewithzosh:lognBCBmtWNPjrKC@cluster0.wvt9jpw.mongodb.net/?retryWrites=true&w=majority'
const connectDb= async()=>{
     try {
        const connectionInstance = await mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
        
     } catch (error) {
        console.log('datebase errror:', error);
     }
}

module.exports={connectDb}
