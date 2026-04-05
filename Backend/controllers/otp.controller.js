const OTP=require("../models/otp.model");
const bcrypt=require("bcryptjs");


// SEND OTP
exports.sendOTP=async(req,res)=>{

try{

const {email,phone}=req.body;

if(!email && !phone){

return res.status(400).json({

success:false,
message:"Email or phone required"

});

}


// EMAIL VALIDATION
if(email){

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){

return res.status(400).json({

success:false,
message:"Invalid email"

});

}

}


// PHONE VALIDATION
if(phone){

const phoneRegex=/^[6-9]\d{9}$/;

if(!phoneRegex.test(phone)){

return res.status(400).json({

success:false,
message:"Invalid phone"

});

}

}


// RESEND LIMIT (30 sec)
const existingOTP=await OTP.findOne({

$or:[
email ? {email} : null,
phone ? {phone} : null
].filter(Boolean)

});

if(existingOTP){

const diff=
(Date.now()-existingOTP.createdAt)/1000;

if(diff < 30){

return res.status(429).json({

success:false,
message:"Wait 30 seconds before requesting again"

});

}

}


// GENERATE OTP
const rawOTP=Math.floor(
100000+Math.random()*900000
).toString();


// HASH OTP
const salt=await bcrypt.genSalt(10);

const hashedOTP=
await bcrypt.hash(rawOTP,salt);


// EXPIRY 5 MIN
const expiresAt=
new Date(Date.now()+5*60*1000);


// DELETE OLD OTP
await OTP.deleteMany({

$or:[
{email},
{phone}
]

});


// SAVE OTP
await OTP.create({

email:email||null,

phone:phone||null,

otp:hashedOTP,

expiresAt,

verified:false,

attempts:0

});


// TODO integrate SMS/email provider
// DEV ONLY (remove later)
console.log("OTP:",rawOTP);


return res.json({

success:true,

message:"OTP sent"

});

}
catch(e){

return res.status(500).json({

success:false,

message:"OTP failed"

});

}

};



// VERIFY OTP
exports.verifyOTP=async(req,res)=>{

try{

const{email,phone,otp}=req.body;

if(!otp){

return res.status(400).json({

success:false,
message:"OTP required"

});

}


// FIND RECORD
const record=
await OTP.findOne({

$or:[
{email},
{phone}
]

});


if(!record){

return res.status(400).json({

success:false,
message:"OTP not found"

});

}


// EXPIRY CHECK
if(record.expiresAt < new Date()){

await OTP.deleteOne({_id:record._id});

return res.status(400).json({

success:false,
message:"OTP expired"

});

}


// ATTEMPT LIMIT
if(record.attempts >=5){

await OTP.deleteOne({_id:record._id});

return res.status(429).json({

success:false,
message:"Too many attempts"

});

}


// CHECK OTP
const match=
await bcrypt.compare(

otp,
record.otp

);


if(!match){

record.attempts+=1;

await record.save();

return res.status(400).json({

success:false,
message:"Invalid OTP"

});

}


// SUCCESS
record.verified=true;

await record.save();


// DELETE AFTER VERIFY (prevent reuse)
await OTP.deleteOne({_id:record._id});


return res.json({

success:true,

message:"OTP verified"

});

}
catch(e){

return res.status(500).json({

success:false,
message:"Verification failed"

});

}

};