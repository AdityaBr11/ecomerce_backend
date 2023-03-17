const ErrorHandler = require("../utils/errorhandler");
const catchAsyncerror = require("./catchAsyncerror");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
const User = require("../models/userModels");
const Cookies=require("js-cookie")

dotenv.config()

exports.isAuthancticate = catchAsyncerror(async (req, res, next) => {
  const token =Cookies.get('token')
  // const { token } = req.cookies;
  //   console.log(token);
  if (!token) {
    return next(new ErrorHandler("Please login to Access", 401));
  }
  const decordedData=jwt.verify(token, process.env.Secret);

  req.user = await User.findById(decordedData.id);
  // console.log(req.user.role,"user")
  next();
});

//to check if admin then they can access
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
