const ErrorHandler = require("../utils/errorhandler");
const catchAsyncerror = require("../middleware/catchAsyncerror");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");

const cloudinary=require("cloudinary")


//register
exports.registerUser = catchAsyncerror(async (req, res, next) => {
  const file = req.files.avatar
  const myCloud=await cloudinary.v2.uploader.upload(file.tempFilePath,{
    folder:"avatars",
    width:150,
    crop:"scale",
  })
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  // const token=user.getToken()
  // res.status(201).send({
  //     success:true,
  //     // user,
  //     token
  // })
  sendToken(user, 201, res);
});

//login User
exports.loginUser = catchAsyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  //check email and pswd both;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password"), 404);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }

  // const token=user.getToken()
  // res.status(200).send({
  //     success:true,
  //     // user,
  //     token
  // })
  sendToken(user, 200, res);
});

//logoutUser
exports.logout = catchAsyncerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    message: "Logged Out",
  });
});

//get USer details
exports.getUserDetails = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).send({
    success: true,
    user,
  });
});

//Update User password
exports.changePassword = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is not matching", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 401));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//Update User profile
exports.profileUpdate = catchAsyncerror(async (req, res, next) => {
  const newUser = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
  };
  //we will add clodonary later
  const user = await User.findByIdAndUpdate(req.user.id, newUser);

  res.status(200).send({
    success: true,
  });
});

//ADMIN
//get all user
exports.getAllUsers = catchAsyncerror(async (req, res, next) => {
  const users = await User.find();
  res.status(200).send({
    success: true,
    users,
  });
});

//get single user by id
exports.getSingleUsers = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 401)
    );
  }
  res.status(200).send({
    success: true,
    user,
  });
});

//Update User role
exports.userRoleUpdate = catchAsyncerror(async (req, res, next) => {
  const newUser = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUser);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 401)
    );
  }
  res.status(200).send({
    success: true,
  });
});

//Delete User
exports.deleteUser = catchAsyncerror(async (req, res, next) => {
  //we will remove cloudinary img
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 401)
    );
  }
  await user.remove();

  res.status(200).send({
    success: true,
    message: "User Deleted Successfull",
  });
});
