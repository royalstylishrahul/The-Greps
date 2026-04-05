await broadcastQueue.add(

"send",

{

customers,
message,
media,
campaignId

},

{

attempts:3,

backoff:{
type:"exponential",
delay:5000
}

}

);