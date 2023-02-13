const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter description"],
    },
    price:{
        type:Number,
        required:[true,"Please enter Price"],
        maxLength:[5,"price cannot exceed more than 5 character"]
    },
    ratings:{
        type:Number,
        default:0,
    },
    images:[
       { public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
       }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Category"]
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter Stock"],
        maxLength:[4,"Stock cannot exceed more than that"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{ //to check the reviewed user
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    //this is for checking the id of user who added the products
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model("Product",productSchema)