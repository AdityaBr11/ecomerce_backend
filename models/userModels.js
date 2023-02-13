const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv");
dotenv.config()

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [25, "Name should less than 25 character"],
    minLength: [4, "Name should more than 5 character"],
    index: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "password should more than 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  role:{
    type:String,
    default:"user"
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
});

//bcrypt
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
})

//jwt Token
userSchema.methods.getToken=function(){
    return jwt.sign({id:this._id},process.env.SECRET,{
        expiresIn:process.env.Expire,
    })
}
//compare password
userSchema.methods.comparePassword= async function(givenPassword){
    return await bcrypt.compare(givenPassword,this.password)
}


//Export the model
module.exports = mongoose.model("User", userSchema);
