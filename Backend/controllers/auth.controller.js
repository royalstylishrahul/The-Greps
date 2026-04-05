const jwt=require("jsonwebtoken");

const {validationResult}=
require("express-validator");

const Store=
require("../models/store.model");

const bcrypt=
require("bcryptjs");

const fs=require("fs");

const path=require("path");


// REGEX
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex=/^[6-9]\d{9}$/;



// TOKEN
function signToken(payload){

return jwt.sign(

payload,

process.env.JWT_SECRET,

{

expiresIn:
process.env.JWT_EXPIRES_IN || "7d"

}

);

}



// SEND TOKEN
function sendStoreToken(store,res){

const token=
signToken({

id:store._id,
role:"store"

});


res.json({

success:true,

token,

role:"store",

store:{

id:store._id,

storeName:store.storeName,

ownerName:store.ownerName,

email:store.email,

phone:store.phone,

address:store.address,

category:store.category,

website:store.website,

logo:store.logo

}

});

}



// SIGNUP
exports.signup=async(req,res)=>{

const errors=
validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,

errors:errors.array()

});

}


const {

storeName,

ownerName,

email,

password,

phone

}=req.body;


try{


if(!emailRegex.test(email)){

return res.status(400).json({

success:false,

message:"Invalid email"

});

}


if(!phoneRegex.test(phone)){

return res.status(400).json({

success:false,

message:"Invalid phone"

});

}



// DUPLICATE
const exists=
await Store.findOne({

$or:[
{email},
{phone}
]

});


if(exists){

return res.status(409).json({

success:false,

message:"Email or phone already registered"

});

}

const hashed = password;

const store=
await Store.create({

storeName,
ownerName,
email,
password:hashed,
phone,
emailVerified:true   // ADD THIS

});


sendStoreToken(store,res);


}
catch(err){

console.log("REAL SIGNUP ERROR:",err);

return res.status(500).json({

success:false,
message:err.message

});

}

};



// LOGIN
exports.login=async(req,res)=>{

const errors=
validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,

errors:errors.array()

});

}


const {email,password}=
req.body;


try{


// STORE LOGIN
const store=
await Store
.findOne({email})
.select("+password");


if(!store){

return res.status(401).json({

success:false,

message:"Invalid credentials"

});

}

const match = await store.comparePassword(password);

if(!match){

return res.status(401).json({

success:false,

message:"Invalid credentials"

});

}


sendStoreToken(store,res);


}
catch(err){

console.log("SIGNUP ERROR:",err);

return res.status(500).json({

success:false,
message:err.message

});

}

};

// GET ME
exports.getMe=
async(req,res)=>{

res.json({

success:true,

store:req.store

});

};



// UPDATE ME
exports.updateMe=
async(req,res)=>{

try{

const updates={

storeName:req.body.storeName,

ownerName:req.body.ownerName,

phone:req.body.phone

};


if(updates.phone){

if(!phoneRegex.test(updates.phone)){

return res.status(400).json({

success:false,

message:"Invalid phone"

});

}

}


const updated=
await Store.findByIdAndUpdate(

req.store._id,

updates,

{

new:true,

runValidators:true

}

);


return res.json({

success:true,

store:updated

});

}
catch(err){

return res.status(500).json({

success:false,

message:"Update failed"

});

}

};



// STORE PROFILE
exports.getStoreProfile=
async(req,res)=>{

try{

const store=
await Store
.findById(req.store.id)
.select("-password");


return res.json({

success:true,

store

});

}
catch(error){

return res.status(500).json({

success:false,

message:"Profile error"

});

}

};



// UPDATE STORE PROFILE
exports.updateStoreProfile=
async(req,res)=>{

try{

const existingStore=
await Store.findById(req.store.id);


const updateData={

storeName:req.body.storeName,

ownerName:req.body.ownerName,

phone:req.body.phone,

address:req.body.address,

category:req.body.category,

website:req.body.website

};


// VALIDATE PHONE
if(updateData.phone){

if(!phoneRegex.test(updateData.phone)){

return res.status(400).json({

success:false,

message:"Invalid phone"

});

}

}


// EMAIL UPDATE
if(req.body.email){

if(!emailRegex.test(req.body.email)){

return res.status(400).json({

success:false,

message:"Invalid email"

});

}


updateData.email=
req.body.email;

}


// LOGO
if(req.file){

updateData.logo=
"/uploads/logos/"+req.file.filename;


// DELETE OLD
if(existingStore.logo){

const oldPath=

path.join(

__dirname,

"..",

existingStore.logo

);

if(fs.existsSync(oldPath)){

fs.unlinkSync(oldPath);

}

}

}



// UPDATE
const updatedStore=
await Store.findByIdAndUpdate(

req.store.id,

updateData,

{

new:true,

runValidators:true

}

);


return res.json({

success:true,

store:updatedStore

});

}
catch(error){

return res.status(500).json({

success:false,

message:"Profile update failed"

});

}

};
