const mongoose = require("mongoose");

const customFieldSchema =
new mongoose.Schema({

store:{
type:mongoose.Schema.Types.ObjectId,
ref:"Store",
required:true
},

name:{
type:String,
required:true
},

type:{
type:String,
enum:[
"text",
"number",
"date",
"select",
"fileQR"
],
default:"text"
},

options:[{
type:String
}],

qrToken:{
type:String,
unique:true,
sparse:true
}

},
{
timestamps:true
});

module.exports=
mongoose.model(
"CustomField",
customFieldSchema
);