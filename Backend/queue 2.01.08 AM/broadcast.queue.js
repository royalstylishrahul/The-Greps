const {Queue} =
require("bullmq");

const connection =
require("../config/redis");

const broadcastQueue =
new Queue(

"broadcast",

{connection}

);

module.exports=
broadcastQueue;