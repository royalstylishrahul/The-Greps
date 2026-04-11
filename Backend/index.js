const adminRoutes = require("./routes/admin.routes");
const serverless = require("serverless-http");

if(process.env.NODE_ENV !== "production"){
 require("dotenv").config();
}

const express = require("express"); 
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const BASE_PATH="/greps-backend";


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


// Routes
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const campaignRoutes = require("./routes/campaign.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const storeRoutes = require("./routes/store.routes");


// Root
app.get(BASE_PATH,(req,res)=>{

 res.json({
  status:"ok",
  message:"CRM API Running 🚀"
 });

});


// Health
app.get(BASE_PATH+"/api/health",(req,res)=>{

 res.json({status:"ok"});

});


// API routes
app.use(BASE_PATH+"/api/auth",authRoutes);
app.use(BASE_PATH+"/api/customers",customerRoutes);
app.use(BASE_PATH+"/api/products",productRoutes);
app.use(BASE_PATH+"/api/campaigns",campaignRoutes);
app.use(BASE_PATH+"/api/whatsapp",whatsappRoutes);
app.use(BASE_PATH+"/api/store",storeRoutes);
app.use(BASE_PATH+"/api/admin",adminRoutes);


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


// Lambda handler
module.exports.handler = async(event,context)=>{

 context.callbackWaitsForEmptyEventLoop=false;

 await connectDatabase();

 return handler(event,context);

};


// local run
if(process.env.IS_OFFLINE){

 const PORT=5001;

 connectDatabase().then(()=>{

  app.listen(PORT,()=>{

   console.log(`Server running on ${PORT}`);
   console.log("✅ MongoDB Connected");

  });

 });

}
