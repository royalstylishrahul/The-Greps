const multer = require("multer");
const path = require("path");


// Storage config
const storage =
multer.diskStorage({

destination:
function(req,file,cb){

cb(null,"uploads/logos");

},

filename:
function(req,file,cb){

const uniqueName =
Date.now() +
"-" +
Math.round(Math.random()*1E9) +
path.extname(file.originalname);

cb(null,uniqueName);

}

});


// File filter
const fileFilter =
(req,file,cb)=>{

const allowedTypes =

/jpeg|jpg|png|webp/;

const ext =
allowedTypes.test(
path.extname(
file.originalname
).toLowerCase()
);

const mime =
allowedTypes.test(
file.mimetype
);

if(ext && mime){

return cb(null,true);

}

cb(
"Only images allowed"
);

};


// Upload config
const upload =
multer({

storage,

limits:{
fileSize:
2*1024*1024
},

fileFilter

});


module.exports =
upload;