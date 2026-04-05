const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();


const sendOTPEmail = async (email, otp) => {

try{

console.log("Sending OTP to:",email);

await tranEmailApi.sendTransacEmail({

sender:{
email:"royalstylishrahul@gmail.com",
name:"SetuSync"
},

to:[
{
email:email
}
],

subject:"Your SetuSync OTP",

htmlContent:`

<div style="font-family:Arial;background:#f4f6fb;padding:40px">

<div style="
max-width:500px;
background:white;
margin:auto;
padding:30px;
border-radius:12px;
text-align:center;
box-shadow:0 5px 20px rgba(0,0,0,0.08)
">

<h2 style="color:#6C63FF">
SetuSync
</h2>

<p style="color:#666">
Hello,
</p>

<p style="color:#555">
Your verification OTP is:
</p>

<div style="
font-size:34px;
letter-spacing:10px;
font-weight:bold;
margin:25px 0;
color:#333;
">

${otp}

</div>

<p style="color:#777">
Expires in 5 minutes
</p>

<hr style="border:none;border-top:1px solid #eee;margin:25px 0"/>

<p style="font-size:12px;color:#aaa">
Do not share this OTP.
</p>

</div>

</div>

`

});

console.log("EMAIL SENT SUCCESS");

}catch(err){

console.log("EMAIL ERROR:",err);

throw err;

}

};

module.exports = {sendOTPEmail};    