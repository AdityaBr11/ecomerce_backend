const mongoose=require("mongoose")
const dotenv=require("dotenv");
dotenv.config()

mongoose.set('strictQuery',false)

const connectDB=()=>{
    mongoose.connect(process.env.MongoUrl).then((data)=>{console.log(`MongoDB is connected ${data.connection.host}`)})
    
    // .catch((err)=>{console.log(err)})
}

module.exports=connectDB
