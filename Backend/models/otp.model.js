const mongoose=require("mongoose");

const otpSchema=new mongoose.Schema({

email:{
type:String
},

phone:{
type:String
},

otp:{
type:String,
required:true
},

verified:{
type:Boolean,
default:false
},

attempts:{
type:Number,
default:0
},

expiresAt:{
type:Date,
required:true,
index:{expires:300}
}

},{
timestamps:true
});

module.exports=
mongoose.model("OTP",otpSchema);