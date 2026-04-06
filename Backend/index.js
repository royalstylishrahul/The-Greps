const serverless = require("serverless-http");
require("dotenv").config();

const express = require("express"); 
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();


// CORS
app.use(cors({
origin:[
"http://localhost:5173",
"https://main.d1jv16iunam0qq.amplifyapp.com"
],
credentials:true,
methods:["GET","POST","PUT","DELETE"],
allowedHeaders:["Content-Type","Authorization"]
}));


// Body parser
app.use(express.json({limit:"10mb"}));

app.use(express.urlencoded({
limit:"10mb",
extended:true
}));


let isConnected=false;

const connectDatabase = async ()=>{

if(isConnected) return;

await connectDB();

isConnected=true;

};


// uploads local only
if(process.env.IS_OFFLINE){

app.use("/uploads",express.static("uploads"));

}

app.use((req,res,next)=>{
  if(req.url.startsWith("/default/")){
    req.url=req.url.replace("/default","");
  }
  next();
});

// Routes
const authRoutes = require("./routes/auth.routes");

const customerRoutes = require("./routes/customer.routes");

const productRoutes = require("./routes/product.routes");

const campaignRoutes = require("./routes/campaign.routes");

const whatsappRoutes = require("./routes/whatsapp.routes");

const storeRoutes = require("./routes/store.routes");


// Root
app.get("/",(req,res)=>{

res.json({

status:"ok",

message:"CRM API Running 🚀"

});

});


// Health
app.get("/api/health",(req,res)=>{

res.json({status:"ok"});

});


// API routes
app.use("/api/auth",authRoutes);

app.use("/api/customers",customerRoutes);

app.use("/api/products",productRoutes);

app.use("/api/campaigns",campaignRoutes);

app.use("/api/whatsapp",whatsappRoutes);

app.use("/store",storeRoutes);


// 404
app.use((req,res)=>{

res.status(404).json({

success:false,

message:"Route not found"

});

});


// error handler
app.use((err,req,res,next)=>{

res.status(500).json({

success:false,

message:err.message

});

});
const handler = serverless(app);




// Lambda handler (IMPORTANT CHANGE)
module.exports.handler = async(event,context)=>{

context.callbackWaitsForEmptyEventLoop=false;

await connectDatabase();

return handler(event,context);

};


// local run
if(process.env.IS_OFFLINE){

const PORT=5001;

app.listen(PORT,()=>{

console.log(`Server running on ${PORT}`);

});

}