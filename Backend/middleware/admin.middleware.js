const jwt=require("jsonwebtoken");

exports.adminProtect=(req,res,next)=>{

try{

const token=
req.headers.authorization?.split(" ")[1];

if(!token){

return res.status(401).json({

success:false,
message:"Not authorized"

});

}

const decoded=
jwt.verify(

token,
process.env.JWT_SECRET

);

if(decoded.role!=="superadmin"){

return res.status(403).json({

success:false,
message:"Admin access only"

});

}

req.admin=decoded;

next();

}
catch(err){

return res.status(401).json({

success:false,
message:"Invalid token"

});

}

};