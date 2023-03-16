const app=require("./app")
const express=require("express");
const dotenv=require("dotenv");
const connectDB=require("./config/db")
const cloudinary=require("cloudinary")

//handling uncaughtException
process.on("uncaughtException",err=>{
    console.log(`error: ${err.message}`)
    console.log('Shutting down the server')
    process.exit(1)
})


// config
dotenv.config()

//connecting to DB
connectDB()

//cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  })



const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running at https://port/${process.env.PORT}`)
})

//when our server crash we handle
process.on("unhandledRejection",err=>{
    console.log(`error: ${err.message}`)
    console.log('Shutting down the server')
    server.close()
    process.exit()
})