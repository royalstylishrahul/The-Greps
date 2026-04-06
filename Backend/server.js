require("dotenv").config();

const express=require("express");
const cors=require("cors");
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");
const morgan=require("morgan");
const compression=require("compression");
const serverless=require("serverless-http");

// DB
const connectDB=require("./config/db");

// ROUTES
const authRoutes=require("./routes/auth.routes");
const customerRoutes=require("./routes/customer.routes");
const broadcastRoutes=require("./routes/broadcast.routes");
const campaignRoutes=require("./routes/campaign.routes");
const otpRoutes=require("./routes/otp.routes");
const whatsappRoutes=require("./routes/whatsapp.routes");
const adminRoutes=require("./routes/admin.routes");


// ERROR HANDLER
const errorHandler=require("./middleware/error.middleware");

const app=express();


// SECURITY
app.use(helmet());
const allowedOrigins = [
process.env.FRONTEND_URL,
process.env.AMPLIFY_URL,
"http://localhost:5173",
"http://127.0.0.1:5173"
];

app.options('*', cors());

app.use(cors({
origin: function(origin, callback){

// allow requests with no origin (mobile apps, postman)
if(!origin) return callback(null,true);

if(allowedOrigins.includes(origin)){
return callback(null,true);
}

return callback(null,false);

},
methods:["GET","POST","PUT","DELETE","OPTIONS"],
allowedHeaders:[
"Content-Type",
"Authorization",
"storeId"
],
credentials:true
}));


app.use(compression());
app.use(morgan("dev"));


// BODY
app.use(express.json({limit:"10mb"}));

app.use(express.urlencoded({
extended:true,
limit:"10mb"
}));


// RATE LIMIT
const limiter=rateLimit({

windowMs:15*60*1000,

max:300,

message:{
success:false,
message:"Too many requests"
}

});

app.use(limiter);


// ROUTES
app.use("/api/auth",authRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/otp",otpRoutes);

app.use("/api/customers",customerRoutes);

app.use("/api/broadcast",broadcastRoutes);

app.use("/api/campaigns",campaignRoutes);

app.use("/api/whatsapp",whatsappRoutes);


// HEALTH
app.get("/",(req,res)=>{

res.send("API Running");

});


// 404
app.use((req,res)=>{

res.status(404).json({

success:false,

message:"Route not found"

});

});


// ERROR
app.use(errorHandler);




// DB caching (important Lambda optimization)
let isDBConnected=false;


// Lambda handler
module.exports.handler=async(event,context)=>{

context.callbackWaitsForEmptyEventLoop=false;

if(!isDBConnected){

await connectDB();

isDBConnected=true;

}

const handler=serverless(app);

return handler(event,context);

};