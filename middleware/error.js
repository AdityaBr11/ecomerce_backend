const ErrorHandler=require("../utils/errorhandler")

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message|| "internal servel error";

    //wrong mongoDB error
    if(err.name==="CastError"){
        const message=`Resourses Not found.${err.path}`
        err=new ErrorHandler(message,404)
    }

    //handle the error when the already user wants to create accounts again
    //dublicate error handle
    if(err.code===11000){
        const message=`Dublicate ${Object.keys(err.keyValue)} Entered`
        err=new ErrorHandler(message,404)
    }

    //jwt token error
    if(err.name==="JsonWebTokenError"){
        const message=`token is Invalid ,try again`
        err=new ErrorHandler(message,404)
    }

     //jwt token expire error
     if(err.name==="TokenExpiredError"){
        const message=`token is Expired ,try again`
        err=new ErrorHandler(message,404)
    }

    res.status(err.statusCode).json({
        status:false,
        message:err.message
    })
}