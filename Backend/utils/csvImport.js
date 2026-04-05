const fs=
require("fs");

const csv=
require("csv-parser");

exports.importCustomers=

(file)=>{

return new Promise(

(resolve)=>{

let results=[];

fs.createReadStream(file)

.pipe(csv())

.on("data",

data=>{

results.push(data);

}

)

.on("end",

()=>{

resolve(results);

}

);

});

};