const express=require("express");
const errorMiddleware=require("./middleware/error");
const bodyParser = require('body-parser')
const fileUpload=require("express-fileupload")
const cookieParser=require("cookie-parser");
const cors = require("cors");

const app=express()

app.use(express.json())

app.use(cors({
    origin: "*"
}));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())

app.get("/", (req,res) => {
    res.send({Message: "swagat hy apka"});
});
// app.get('/my-route', (req, res) => {
//     const token = req.cookies.token;
//     console.log('Token:', token);
//     res.send(token)
//     // Do something with the token
//   });

//routes import
const product=require("./routes/productRoute")
const user=require("./routes/userRoute")
const order=require("./routes/orderRoute")

app.use("/",product)
app.use("/",user)
app.use("/",order)


//middleware for error
app.use(errorMiddleware)



module.exports=app