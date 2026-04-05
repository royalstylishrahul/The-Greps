module.exports =
(req,res,next)=>{

if(!req.user.store)
return res.status(403).json({

message:"Store not assigned"

});

req.storeId =
req.user.store;

next();

};