const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const storeSchema = new mongoose.Schema({

storeName:{
type:String,
required:true,
trim:true,
minlength:3,
maxlength:100
},

ownerName:{
type:String,
required:true,
trim:true,
minlength:3,
maxlength:100
},

email:{
type:String,
required:true,
unique:true,
index:true,
trim:true,
lowercase:true,
match:[
/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
"Invalid email"
]
},

phone:{
type:String,
required:true,
unique:true,
index:true,
trim:true,
match:[
/^[6-9]\d{9}$/,
"Invalid phone number"
]
},

password:{
type:String,
required:true,
minlength:8
},

logo:{
type:String,
default:null
},

description:{
type:String,
maxlength:500,
default:""
},

category:{
type:String,
enum:[
"Grocery",
"Restaurant",
"Clothing",
"Electronics",
"Pharmacy",
"Salon",
"Stationery",
"Other"
],
default:"Other"
},

address:{
type:String,
maxlength:300,
default:""
},

website:{
type:String,
default:"",
match:[
/^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/,
"Invalid website"
]
},

timings:{
type:String,
default:""
},

emailVerified:{
type:Boolean,
default:false
},

phoneVerified:{
type:Boolean,
default:false
}

},{
timestamps:true
});


// Password hash middleware

storeSchema.pre("save",async function(){

if(!this.isModified("password")) return;

const salt = await bcrypt.genSalt(10);

this.password = await bcrypt.hash(this.password,salt);

});

// Compare password
storeSchema.methods.comparePassword=
async function(candidate){

return bcrypt.compare(
candidate,
this.password
);

};


module.exports=
mongoose.model(
"Store",
storeSchema
);