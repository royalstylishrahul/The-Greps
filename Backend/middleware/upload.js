const multer=require("multer");

const path=require("path");

const fs=require("fs");


// Ensure folder exists
const uploadPath="uploads/logos";

if(!fs.existsSync(uploadPath)){

fs.mkdirSync(uploadPath,{recursive:true});

}


// STORAGE
const storage=multer.diskStorage({

destination:function(req,file,cb){

cb(null,uploadPath);

},

filename:function(req,file,cb){

const ext=
path.extname(
file.originalname
).toLowerCase();

const safeName=
file.originalname
.replace(/\s+/g,"-")
.replace(ext,"");

const fileName=

safeName+
"-"+
Date.now()+
ext;

cb(null,fileName);

}

});



// FILE FILTER
const fileFilter=(req,file,cb)=>{

const allowedMime=[

"image/jpeg",
"image/jpg",
"image/png",
"image/webp"

];

if(allowedMime.includes(file.mimetype)){

cb(null,true);

}else{

cb(

new Error(
"Only JPG PNG WEBP allowed"
),

false

);

}

};



// UPLOAD CONFIG
const upload=multer({

storage,

limits:{
fileSize:2*1024*1024
},

fileFilter

});



module.exports={
upload
};