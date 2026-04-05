const errorHandler=
(err,req,res,next)=>{

console.error(err.stack);


if(err.name==="MulterError"){

return res.status(400).json({

success:false,
message:"File upload error"

});

}


if(err.message==="Only JPG PNG WEBP allowed"){

return res.status(400).json({

success:false,
message:err.message

});

}


return res.status(500).json({

success:false,
message:"Server error"

});

};


module.exports=
errorHandler;