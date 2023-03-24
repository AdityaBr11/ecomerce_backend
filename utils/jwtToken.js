//creating token and saving it on cookies
const dotenv = require("dotenv");
dotenv.config();

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  res
    .status(statusCode)
    .json({
      success: true,
      user,
      token,
    });
};

module.exports = sendToken;
