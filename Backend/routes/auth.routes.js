const jwt = require("jsonwebtoken");
const express=require("express");
const {body,validationResult}=require("express-validator");
const bcrypt = require("bcryptjs");
const router=express.Router();

const Store=require("../models/store.model");
const {sendOTPEmail} =
require("../services/email.service");
const crypto = require("crypto");
const otpStore = {};

const generateOTP = ()=>{

return Math.floor(
100000 + Math.random()*900000
).toString();

};

const {

signup,
login,
getMe,
updateMe,
getStoreProfile,
updateStoreProfile

}=require("../controllers/auth.controller");


const {protect}=
require("../middleware/auth.middleware");

const {upload}=
require("../middleware/upload");



// VALIDATION HANDLER
const validate=(req,res,next)=>{

const errors=validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,
errors:errors.array()

});

}

next();

};


// SIGNUP RULES
const signupRules=[

body("storeName")
.notEmpty()
.withMessage("Store name required"),

body("ownerName")
.notEmpty()
.withMessage("Owner name required"),

body("email")
.isEmail()
.withMessage("Valid email required"),

body("phone")
.matches(/^[6-9]\d{9}$/)
.withMessage("Valid phone required"),

body("password")
.isLength({min:8})
.withMessage("Password minimum 8 characters")

];


// LOGIN RULES
const loginRules=[

body("email")
.isEmail()
.withMessage("Valid email required"),

body("password")
.notEmpty()
.withMessage("Password required")

];


// ROUTES
router.post(

"/send-otp",

async(req,res)=>{

try{

const {phone,email}=req.body;

if(!phone || !email){

return res.status(400).json({

success:false,
message:"Phone and email required"

});

}

// TEMP OTP (later random करेंगे)
const otp = generateOTP();

console.log("OTP:",otp);
console.log("Sending email to:",email);
await sendOTPEmail(email,otp);
console.log("Email function called");
const normalizedEmail = email.trim().toLowerCase();

otpStore[normalizedEmail] = {

otp:otp,
purpose:req.body.purpose || "signup",
expires: Date.now() + 5*60*1000

};

return res.json({

success:true,
message:"OTP sent",
otp // testing only

});

}
catch(err){

return res.status(500).json({

success:false,
message:"OTP failed"

});

}

}

);
router.post(

"/verify-otp",

async(req,res)=>{

try{

const {
phone,
email,
otp,
storeName,
ownerName,
password,
purpose   // ← ADD THIS
}=req.body;
console.log("VERIFY DATA:",email,otp);

const normalizedEmail = email.trim().toLowerCase();

console.log("STORED:",otpStore[normalizedEmail]);

const stored = otpStore[normalizedEmail];

if(!stored){

return res.status(400).json({

success:false,
message:"OTP not found"

});

}

if(stored.expires < Date.now()){

delete otpStore[normalizedEmail];

return res.status(400).json({

success:false,
message:"OTP expired"

});

}
/* PURPOSE CHECK DISABLED TEMP */

if(purpose && stored.purpose !== purpose){

return res.status(400).json({

success:false,
message:"OTP purpose mismatch"

});

}

delete otpStore[normalizedEmail];

if(purpose==="forgot"){

return res.json({

success:true,
message:"OTP verified"

});

}

/* SIGNUP FLOW FIX */

req.body = {
storeName,
ownerName,
email,
phone,
password
};

signupRules.forEach(rule => rule.run(req));

const errors = validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,
message:"Signup validation failed"

});

}

return signup(req,res);

}
catch(err){

console.log("OTP VERIFY ERROR:",err);   // ADD THIS

return res.status(500).json({

success:false,
message:err.message   // CHANGE THIS

});

}

}

);
router.post(

"/signup",
signupRules,
validate,
signup

);


router.post(

"/login",
loginRules,
validate,
login

);



// FORGOT CHECK
router.post(

"/forgot",

async(req,res)=>{

try{

const {email}=req.body;

if(!email){

return res.status(400).json({

success:false,
message:"Email required"

});

}


const store=
await Store.findOne({email});

if(!store){

return res.status(404).json({

success:false,
message:"Email not registered"

});

}


return res.json({

success:true,
message:"Email exists"

});

}
catch(err){

return res.status(500).json({

success:false,
message:"Server error"

});

}

}

);


// RESET PASSWORD
router.post(

"/reset-password",

async(req,res)=>{

try{

const {email,password} = req.body;

if(!email || !password){

return res.status(400).json({

success:false,
message:"Email and password required"

});

}

if(password.length < 8){

return res.status(400).json({

success:false,
message:"Password must be minimum 8 characters"

});

}

const store =
await Store.findOne({email});

if(!store){

return res.status(404).json({

success:false,
message:"Store not found"

});

}

// update password
const hashedPassword = await bcrypt.hash(password,10);

store.password = hashedPassword;

await store.save();

return res.json({

success:true,
message:"Password updated"

});

}
catch(err){

return res.status(500).json({

success:false,
message:"Password reset failed"

});

}

}

);
// STORE PROFILE
router.get(

"/store-profile",
protect,
getStoreProfile

);


router.put(

"/store-profile",

protect,

upload.single("logo"),

updateStoreProfile

);



// ME
router.get(

"/me",

protect,

getMe

);


router.patch(

"/me",

protect,

updateMe

);


module.exports=router;