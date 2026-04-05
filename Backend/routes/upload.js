const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");

const CustomField = require("../models/CustomField");
const DocumentUpload = require("../models/DocumentUpload");

const storage = multer.diskStorage({

destination:async(req,file,cb)=>{

try{

const {qrToken}=req.body;

const field = await CustomField.findOne({qrToken});

if(!field){

return cb(new Error("Invalid QR"));

}

const storeFolder =
"uploads/"+field.store.toString();

const fs = require("fs");

if(!fs.existsSync(storeFolder)){

fs.mkdirSync(storeFolder,{recursive:true});

}

req.storeId=field.store;

cb(null,storeFolder);

}catch(e){

cb(e);

}

},

filename:(req,file,cb)=>{

const crypto=require("crypto");

cb(

null,

crypto.randomBytes(8).toString("hex")+

Date.now()+

path.extname(file.originalname)

);

}

});

const upload = multer({

storage,

limits:{
fileSize:5*1024*1024
},

fileFilter:(req,file,cb)=>{

const allowedTypes=[

"application/pdf",

"image/jpeg",

"image/png",

"image/webp"

];

if(allowedTypes.includes(file.mimetype)){

cb(null,true);

}else{

cb(new Error("Invalid file type"));

}

}

});

router.post("/",upload.single("file"),async(req,res)=>{

try{

const {qrToken}=req.body;

const field = await CustomField.findOne({
qrToken
});

if(!field){

return res.status(404).json({
message:"Invalid QR"
});

}

const doc = new DocumentUpload({

store:field.store,

field:field._id,

file:req.file.filename

});

await doc.save();

res.json({

success:true,

file:req.file.filename,

documentId:doc._id

});

}catch(e){

res.status(500).json({
message:e.message
});

}

});

router.get("/document/:id",protect,async(req,res)=>{

try{

const doc = await DocumentUpload.findById(req.params.id);

if(!doc){

return res.status(404).json({
message:"Document not found"
});

}

if(doc.store.toString()!==req.store.id){

return res.status(403).json({
message:"Unauthorized"
});

}

const filePath =
require("path").join(
__dirname,
"../uploads",
doc.store.toString(),
doc.file
);

res.download(filePath);

}catch(e){

res.status(500).json({
message:e.message
});

}

});
router.get("/unassigned",protect,async(req,res)=>{

try{

const docs = await DocumentUpload.find({

store:req.store.id,

customer:null

})
.populate("field")
.sort({uploadedAt:-1});

res.json({

success:true,

documents:docs

});

}catch(e){

res.status(500).json({

message:e.message

});

}

});

router.put("/assign",protect,async(req,res)=>{

try{

const {documentId,customerId}=req.body;

const doc = await DocumentUpload.findById(documentId);

if(!doc){

return res.status(404).json({
message:"Document not found"
});

}

if(doc.store.toString()!==req.store.id){

return res.status(403).json({
message:"Unauthorized"
});

}

doc.customer=customerId;

await doc.save();

res.json({

success:true,

message:"Document assigned"

});

}catch(e){

res.status(500).json({

message:e.message

});

}

});

module.exports=router;