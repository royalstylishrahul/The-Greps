const jwt=require("jsonwebtoken");

const Store=
require("../models/store.model");


const protect=
async(req,res,next)=>{

try{

let token;


// AUTH HEADER
if(

req.headers.authorization &&

req.headers.authorization.startsWith("Bearer ")

){

token=
req.headers.authorization.split(" ")[1];

}


// NO TOKEN
if(!token){

return res.status(401).json({

success:false,
message:"Not authenticated"

});

}


// VERIFY
const decoded=
jwt.verify(

token,

process.env.JWT_SECRET

);


// FIND STORE
const store=
await Store
.findById(decoded.id)
.select("-password");


if(!store){

return res.status(401).json({

success:false,
message:"Store not found"

});

}


// ATTACH
req.store=store;

req.storeId=
store._id;


// NEXT
next();

}
catch(err){

if(err.name==="TokenExpiredError"){

return res.status(401).json({

success:false,
message:"Token expired"

});

}


return res.status(401).json({

success:false,
message:"Invalid token"

});

}

};



// ADMIN CHECK
const requireAdmin=
(req,res,next)=>{

if(

!req.store ||

req.store.role!=="admin"

){

return res.status(403).json({

success:false,
message:"Admin access required"

});

}

next();

};


module.exports={

protect,

requireAdmin

};