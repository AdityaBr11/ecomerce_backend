//creating token and saving it on cookies
const dotenv = require("dotenv");
dotenv.config();

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();

  //options to add into cookies
  res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: process.env.CookieExpire * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // add this option //but we cannot use it in localhost now it won't save the cookies
      secure: true, // also add this option for HTTPS connections
    })
    .json({
      success: true,
      user,
      token,
    });
};

module.exports = sendToken;
