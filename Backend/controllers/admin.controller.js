const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const {sendOTPEmail}=require("../services/email.service");

const otpStore={};

function generateOTP(){

return Math.floor(
100000 + Math.random()*900000
).toString();

}

function signToken(payload){

return jwt.sign(

payload,
process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

}

exports.adminLogin = async (req,res)=>{

try{

const {email,password}=req.body;

if(email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.trim().toLowerCase()){

return res.status(401).json({
success:false,
message:"Invalid credentials"
});

}

const match = await bcrypt.compare(
password,
process.env.ADMIN_PASSWORD_HASH
);

if(!match){

return res.status(401).json({
success:false,
message:"Invalid credentials"
});

}

// OTP GENERATE
const otp = generateOTP();

otpStore[email]={

otp,
expires:Date.now()+5*60*1000,
attempts:0,
lastSent:Date.now()

};

// SEND EMAIL
try{
 await sendOTPEmail(email,otp);
}catch(e){
 console.log("Email failed, OTP:",otp);
}

return res.json({
success:true,
message:"OTP sent"
});


}
catch(err){

console.log("ADMIN LOGIN ERROR:",err);

return res.status(500).json({
success:false,
message:"Admin login failed"
});

}



}



exports.verifyAdminOTP=async(req,res)=>{

try{

const {email,otp}=req.body;

const stored=otpStore[email];

if(!stored){

return res.status(400).json({

success:false,
message:"OTP not found"

});

}

if(stored.expires < Date.now()){

delete otpStore[email];

return res.status(400).json({

success:false,
message:"OTP expired"

});

}

if(stored.otp !== otp){

stored.attempts++;

if(stored.attempts>=5){

delete otpStore[email];

return res.status(400).json({

success:false,
message:"Too many wrong attempts"

});

}

return res.status(400).json({

success:false,
message:"Invalid OTP"

});

}

delete otpStore[email];

const token=
signToken({

role:"superadmin",
admin:true,
loginTime:Date.now()

});

return res.json({

success:true,
token,
role:"superadmin"

});

}
catch(err){

return res.status(500).json({

success:false,
message:"OTP verification failed"

});

}

};