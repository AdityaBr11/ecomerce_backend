//creating token and saving it on cookies
const dotenv=require("dotenv");
dotenv.config()

const sendToken=(user,statusCode,res)=>{
    const token=user.getToken()

    //options to add into cookies
    const options={
        expire:new Date(
            Date.now() + process.env.CookieExpire* 24 * 60 * 60 * 1000
        ),
        httpOnly:false
    };

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
}

module.exports=sendToken