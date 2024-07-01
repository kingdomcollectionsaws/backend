const mongoose = require("mongoose")

// const mongoDbUrl='mongodb+srv://codewithzosh:lognBCBmtWNPjrKC@cluster0.wvt9jpw.mongodb.net/?retryWrites=true&w=majority'
const connectDb= async()=>{
     try {
        const connectionInstance = await mongoose.connect("mongodb+srv://kingdomcollection:kingdomcollection@cluster0.xsmqk48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{ useNewUrlParser: true, useUnifiedTopology: true });
        
     } catch (error) {
        console.log('datebase errror:', error);
     }
}

module.exports={connectDb}
