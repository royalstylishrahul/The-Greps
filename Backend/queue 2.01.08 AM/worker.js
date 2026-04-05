const Campaign =
require("../models/Campaign");

new Worker(

"broadcast",

async job=>{

let {

customers,
message,
media,
campaignId

}
=job.data;

await Campaign.findByIdAndUpdate(

campaignId,

{
status:"sending"
}

);

let sent=0;
let failed=0;

for(let c of customers){

try{

await whatsapp.sendMessage(

c.whatsapp,

message,
media

);

sent++;

await Campaign.findByIdAndUpdate(

campaignId,

{

$inc:{
sent:1
}

}

);

}catch(e){

failed++;

await Campaign.findByIdAndUpdate(

campaignId,

{

$inc:{
failed:1
}

}

);

}

await new Promise(

r=>setTimeout(r,2000)

);

}

await Campaign.findByIdAndUpdate(

campaignId,

{

status:"completed"

}

);

}
);