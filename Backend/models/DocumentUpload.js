const mongoose = require("mongoose");

const documentSchema =
new mongoose.Schema({

store:{
type:mongoose.Schema.Types.ObjectId,
ref:"Store"
},

field:{
type:mongoose.Schema.Types.ObjectId,
ref:"CustomField"
},

file:{
type:String
},

customer:{
type:mongoose.Schema.Types.ObjectId,
ref:"Customer",
default:null
},

uploadedAt:{
type:Date,
default:Date.now
}

});

module.exports=
mongoose.model(
"DocumentUpload",
documentSchema
);