exports.buildCustomerFilter =
(filters,storeId)=>{

let query={
store:storeId
};

if(!filters)
return query;

Object.keys(filters)
.forEach(key=>{

let value=
filters[key];

if(key==="name")
query.name=
{$regex:value,$options:"i"};

else if(key==="email")
query.email=value;

else if(key==="whatsapp")
query.whatsapp=value;

else{

query[
`customFields.${key}`
]=value;

}

});

return query;

};