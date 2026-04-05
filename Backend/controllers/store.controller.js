const OTP=require("../models/otp.model");
const Store=require("../models/store.model");


// REGEX
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex=/^[6-9]\d{9}$/;
const timingRegex=/^([0-1][0-9]|2[0-3]):([0-5][0-9])\-([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
const urlRegex=/^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/;


// CREATE STORE
exports.createStore=async(req,res)=>{

try{

const{
storeName,
ownerName,
email,
phone,
password
}=req.body;


// REQUIRED
if(
!storeName ||
!ownerName ||
!email ||
!phone ||
!password
){

return res.status(400).json({

success:false,
message:"All fields required"

});

}


// FORMAT VALIDATION
if(!emailRegex.test(email)){

return res.status(400).json({

success:false,
message:"Invalid email format"

});

}


if(!phoneRegex.test(phone)){

return res.status(400).json({

success:false,
message:"Invalid phone number"

});

}


if(password.length<8){

return res.status(400).json({

success:false,
message:"Password must be 8+ chars"

});

}


// STRICT DUPLICATE CHECK
const existingEmail=
await Store.findOne({email});

if(existingEmail){

return res.status(400).json({

success:false,
message:"Email already registered"

});

}


const existingPhone=
await Store.findOne({phone});

if(existingPhone){

return res.status(400).json({

success:false,
message:"Phone already registered"

});

}


// OTP VERIFIED CHECK
const emailOTP=
await OTP.findOne({

email,
verified:true

});


const phoneOTP=
await OTP.findOne({

phone,
verified:true

});


if(!emailOTP){

return res.status(400).json({

success:false,
message:"Email OTP verification required"

});

}


if(!phoneOTP){

return res.status(400).json({

success:false,
message:"Phone OTP verification required"

});

}


// CREATE
const store=
await Store.create({

storeName,
ownerName,
email,
phone,
password,
emailVerified:true,
phoneVerified:true

});


// REMOVE OTP (SECURITY)
await OTP.deleteMany({

$or:[
{email},
{phone}
]

});


return res.status(201).json({

success:true,
message:"Store created successfully",
storeId:store._id

});

}
catch(error){

if(error.code===11000){

return res.status(400).json({

success:false,
message:"Duplicate email or phone"

});

}

return res.status(500).json({

success:false,
message:"Store creation failed"

});

}

};




// GET PROFILE
exports.getProfile=async(req,res)=>{

try{

const store=
await Store
.findById(req.storeId)
.select("-password");

if(!store){

return res.status(404).json({

success:false,
message:"Store not found"

});

}

return res.json({

success:true,
data:store

});

}
catch{

return res.status(500).json({

success:false,
message:"Profile fetch failed"

});

}

};




// UPDATE PROFILE
exports.updateProfile=async(req,res)=>{

try{

const updates={};

const allowed=[

"storeName",
"ownerName",
"description",
"category",
"address",
"website",
"timings",
"email",
"phone",
"password"

];


// LOGO
if(req.file){

if(!req.file.mimetype.startsWith("image")){

return res.status(400).json({

success:false,
message:"Logo must be image"

});

}

if(req.file.size>2*1024*1024){

return res.status(400).json({

success:false,
message:"Logo max 2MB"

});

}

updates.logo=
"/uploads/logos/"+req.file.filename;

}


// COPY SAFE FIELDS
Object.keys(req.body).forEach(key=>{

if(
allowed.includes(key) &&
req.body[key]!=="" &&
req.body[key]!==null
){

updates[key]=req.body[key];

}

});


// STORE NAME
if(updates.storeName){

if(updates.storeName.length<3){

return res.status(400).json({

success:false,
message:"Store name too short"

});

}

}


// DESCRIPTION
if(updates.description){

if(updates.description.length>500){

return res.status(400).json({

success:false,
message:"Description too long"

});

}

}


// TIMING
if(updates.timings){

if(!timingRegex.test(updates.timings)){

return res.status(400).json({

success:false,
message:"Timing format HH:MM-HH:MM"

});

}

}


// WEBSITE
if(updates.website){

if(!urlRegex.test(updates.website)){

return res.status(400).json({

success:false,
message:"Invalid website"

});

}

}


// EMAIL CHANGE
if(updates.email){

if(!emailRegex.test(updates.email)){

return res.status(400).json({

success:false,
message:"Invalid email"

});

}


const exists=
await Store.findOne({

email:updates.email,
_id:{$ne:req.storeId}

});

if(exists){

return res.status(400).json({

success:false,
message:"Email already used"

});

}


const otp=
await OTP.findOne({

email:updates.email,
verified:true

});

if(!otp){

return res.status(400).json({

success:false,
message:"Verify email OTP first"

});

}


await OTP.deleteMany({

email:updates.email

});

updates.emailVerified=true;

}



// PHONE CHANGE
if(updates.phone){

if(!phoneRegex.test(updates.phone)){

return res.status(400).json({

success:false,
message:"Invalid phone"

});

}


const exists=
await Store.findOne({

phone:updates.phone,
_id:{$ne:req.storeId}

});

if(exists){

return res.status(400).json({

success:false,
message:"Phone already used"

});

}


const otp=
await OTP.findOne({

phone:updates.phone,
verified:true

});

if(!otp){

return res.status(400).json({

success:false,
message:"Verify phone OTP first"

});

}


await OTP.deleteMany({

phone:updates.phone

});

updates.phoneVerified=true;

}



// PASSWORD
if(updates.password){

if(updates.password.length<8){

return res.status(400).json({

success:false,
message:"Password too short"

});

}

}



// NOTHING
if(Object.keys(updates).length===0){

return res.status(400).json({

success:false,
message:"No updates provided"

});

}



// UPDATE
const store=
await Store.findByIdAndUpdate(

req.storeId,
updates,
{
new:true,
runValidators:true
}

).select("-password");


return res.json({

success:true,
message:"Profile updated",
data:store

});

}
catch{

return res.status(500).json({

success:false,
message:"Update failed"

});

}

};