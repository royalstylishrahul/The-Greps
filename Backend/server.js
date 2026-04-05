require("dotenv").config();

const express=require("express");
const cors=require("cors");
const path=require("path");
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");
const morgan=require("morgan");
const compression=require("compression");


// DB
const connectDB=require("./config/db");


// ROUTES
const authRoutes=require("./routes/auth.routes");
const customerRoutes=require("./routes/customer.routes");
const broadcastRoutes=require("./routes/broadcast.routes");
const campaignRoutes=require("./routes/campaign.routes");
const otpRoutes=require("./routes/otp.routes");
const whatsappRoutes=require("./routes/whatsapp.routes");
const uploadRoutes=require("./routes/upload");


// ERROR HANDLER
const errorHandler=require("./middleware/error.middleware");


const app=express();




// SECURITY MIDDLEWARE
app.use(helmet());

app.use(cors());

app.use(compression());

app.use(morgan("dev"));


// BODY PARSER
app.use(express.json({
limit:"10mb"
}));

app.use(express.urlencoded({
extended:true,
limit:"10mb"
}));


// RATE LIMIT (GLOBAL)
const limiter=rateLimit({

windowMs:15*60*1000,

max:300,

message:{
success:false,
message:"Too many requests"
}

});

app.use(limiter);


// STATIC FILES
//app.use(

//"/uploads",

//express.static(

//path.join(__dirname,"uploads")

//)

//);


// ROUTES
app.use("/api/auth",authRoutes);
const adminRoutes=require("./routes/admin.routes");

console.log("ADMIN ROUTE LOADED");

app.use("/api/admin",adminRoutes);

app.use("/api/otp",otpRoutes);

app.use("/api/customers",customerRoutes);

app.use("/api/broadcast",broadcastRoutes);

app.use("/api/campaigns",campaignRoutes);

app.use("/api/whatsapp",whatsappRoutes);



// HEALTH CHECK
app.get("/",(req,res)=>{

res.send("API Running");

});


// 404 HANDLER
app.use((req,res)=>{

res.status(404).json({

success:false,

message:"Route not found"

});

});


// GLOBAL ERROR HANDLER
app.use(errorHandler);

const serverless = require("serverless-http");

// DB connect inside handler
let isDBConnected = false;

const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

if(!isDBConnected){

await connectDB();

isDBConnected=true;

}

return serverless(app)(event, context);

};

module.exports.handler = handler;
