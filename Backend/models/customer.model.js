const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

store:{
type: mongoose.Schema.Types.ObjectId,
ref: "Store",
required: true
},

name:{
type:String,
required:true
},

whatsapp:{
type:String,
required:true
},

email:{
type:String
},

address:{
type:String
},

location:{
type:String
},

gender:{
type:String
},

category:{
type:String
},

lastPurchaseDate:{
type:Date
},

tags:[
{
type:String
}
],

customFields:{
type:Object,
default:{}
},

lastContacted:{
type:Date
}

},
{
timestamps:true
});

customerSchema.index({store:1});

module.exports =
mongoose.model("Customer",customerSchema);