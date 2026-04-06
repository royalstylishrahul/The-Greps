import React,{
useState,
useEffect,
useCallback,
useRef,
useMemo
} from "react";

import {useLocation} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useToast} from "../../App";

const API_BASE =
process.env.NODE_ENV === "development"
? "http://localhost:5001/api"
: "https://zwkkmn5355.execute-api.ap-south-1.amazonaws.com/default/greps-backend/api";

const PAGE_SIZE=8;

async function fetchCustomers({search,filter,page,pageSize},token){

const params=new URLSearchParams({
search,
filter,
page,
limit:pageSize
});

const res=await fetch(`${API_BASE}/customers?${params}`,{
headers:{
Authorization:`Bearer ${token}`
}
});

if(!res.ok){
throw new Error("Failed to load customers");
}

const result = await res.json();

return {
 data: result.data || [],
 total: result.total || 0
};

}

async function createCustomer(payload,token){
    console.log("PAYLOAD SENT:", payload);

const res=await fetch(`${API_BASE}/customers`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(payload)

});

if(!res.ok){
const errorText = await res.text();
console.log("CREATE CUSTOMER ERROR:", errorText);
throw new Error(errorText);
}

const result = await res.json();

return {
 data: result.customer || result,
 total: 1
};

}

async function deleteCustomer(id,token){

const res=await fetch(`${API_BASE}/customers/${id}`,{

method:"DELETE",

headers:{
Authorization:`Bearer ${token}`
}

});

if(!res.ok){
throw new Error("Failed to delete customer");
}

return true;

}

function useCustomers(){

const location=useLocation();

const token=localStorage.getItem("token");

const [customers,setCustomers]=useState([]);
const [total,setTotal]=useState(0);

const [isLoading,setIsLoading]=useState(true);

const [error,setError]=useState(null);

const [search,setSearch]=useState("");

const [filter,setFilter]=useState("");

const [page,setPage]=useState(1);
const [customFields,setCustomFields] = useState([]);
const [documents,setDocuments]=useState([]);
useEffect(()=>{

const fetchCustomFields = async()=>{

try{

const res = await fetch(`${API_BASE}/customers/custom-fields`,{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

setCustomFields(
data.fields ||
data.data ||
data ||
[]
);

}catch(e){

console.log("Custom fields load error",e);

}

};

const fetchDocuments = async()=>{

try{

const res = await fetch(`${API_BASE}/upload/unassigned`,{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

setDocuments(data.documents || []);

}catch(e){

console.log("Documents load error",e);

}

};

fetchCustomFields();

fetchDocuments();

},[token]);

useEffect(()=>{

const gs=location.state?.globalSearch??"";

if(gs!==search){

setSearch(gs);

setPage(1);

}

},[location.state?.globalSearch]);

const load=useCallback(async()=>{

setIsLoading(true);

setError(null);

try{

const result=await fetchCustomers({

search,
filter,
page,
pageSize:PAGE_SIZE

},token);

setCustomers(result.data || []);

setTotal(result.total || 0);

}catch(err){

setError(err.message);

}

finally{

setIsLoading(false);

}

},[search,filter,page,token]);

useEffect(()=>{

load();

},[load]);

const addCustomer=useCallback(async(payload)=>{

await createCustomer(payload,token);

setPage(1);

await load();

},[token,load]);

const removeCustomer=useCallback(async(id)=>{

await deleteCustomer(id,token);

await load();

},[token,load]);

const totalPages=Math.ceil(total/PAGE_SIZE);

return{

customers,
total,
totalPages,
customFields,
documents,

isLoading,
error,


retry:load,

search,
setSearch:(v)=>{
setSearch(v);
setPage(1);
},

filter,
setFilter:(v)=>{
setFilter(v);
setPage(1);
},

page,
setPage,

addCustomer,
removeCustomer

};

}

export default function Customers(){

const{

customers,
total,
totalPages,
customFields,
documents,

isLoading,
error,
retry,

search,
setSearch,

filter,
setFilter,

page,
setPage,

addCustomer,
removeCustomer

}=useCustomers();

const {addToast}=useToast();

const [showModal,setShowModal]=useState(false);

const [deletingId,setDeletingId]=useState(null);
const [selectedCustomer,setSelectedCustomer]=useState({});

const [localSearch,setLocalSearch]=useState(search);

const debounceRef=useRef(null);

const handleSearchChange=(e)=>{

const val=e.target.value;

setLocalSearch(val);

clearTimeout(debounceRef.current);

debounceRef.current=setTimeout(()=>{

setSearch(val);

},400);

};

const handleDeleteCustomer=async(customer)=>{

if(!window.confirm("Delete customer?")) return;

setDeletingId(customer.id);

try{

await removeCustomer(customer._id);

addToast("Customer deleted","success");

}catch(err){

addToast("Delete failed","error");

}

finally{

setDeletingId(null);

}

};

return(

<div>
{selectedCustomer?._id && (

<div style={{
border:"2px solid #6366f1",
padding:"15px",
borderRadius:"8px",
marginBottom:"20px",
background:"#fafafa"
}}>

<h2>Customer Details</h2>

<div><b>Name:</b> {selectedCustomer.name}</div>
<div><b>Whatsapp:</b> {selectedCustomer.whatsapp}</div>
<div><b>Email:</b> {selectedCustomer.email || "-"}</div>
<div><b>Address:</b> {selectedCustomer.address || "-"}</div>
<div><b>Category:</b> {selectedCustomer.category || "-"}</div>

<h3 style={{marginTop:"15px"}}>Custom Fields</h3>

{customFields.map(field=>(

<div key={field._id}>

<b>{field.name}:</b>{" "}
{selectedCustomer.customFields?.[field.name] || "-"}

</div>

))}

<button
style={{
marginTop:"15px",
padding:"6px 12px"
}}
onClick={()=>setSelectedCustomer({})}
>
Close
</button>

</div>

)}

<h1>Customers</h1>
<button onClick={()=>setShowModal(true)}>
Add Customer
</button>
<h2 style={{marginTop:20}}>Unassigned Documents</h2>

{documents.length===0 && (
<p>No documents uploaded</p>
)}

{documents.map(doc=>(

<div
key={doc._id}
style={{
border:"1px solid #ddd",
padding:"10px",
marginBottom:"8px",
borderRadius:"6px"
}}
>

<div>
<strong>Field:</strong> {doc.field?.name}
</div>

<div>
<strong>File:</strong> {doc.file}
</div>

<div>
<strong>Date:</strong>
{new Date(doc.uploadedAt).toLocaleString()}
</div>

<div style={{marginTop:8}}>

<select
onChange={(e)=>{

setSelectedCustomer({
...selectedCustomer,
[doc._id]:e.target.value
});

}}
>

<option value="">Select Customer</option>

{customers.map(c=>(

<option
key={c._id}
value={c._id}
>
{c.name}
</option>

))}

</select>

<button
style={{
marginLeft:8,
padding:"4px 10px"
}}

onClick={async()=>{

const customerId=
selectedCustomer[doc._id];

if(!customerId) return;

await fetch(
`${API_BASE}/upload/assign`,
{
method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},

body:JSON.stringify({

documentId:doc._id,

customerId

})

}
);

addToast("Document attached");

}}
>
Attach
</button>

</div>

</div>

))}
{console.log("CUSTOM FIELDS:", customFields)}
{console.log("DOCUMENTS:",documents)}

{error && (

<button onClick={retry}>
Retry
</button>

)}

{isLoading && <p>Loading...</p>}

{!isLoading && customers.map(c=>(

<div 
key={c._id}
onClick={()=>setSelectedCustomer(c)}
style={{
padding:"10px",
border:"1px solid #eee",
marginBottom:"8px",
cursor:"pointer",
borderRadius:"6px"
}}
>

<strong>{c.name}</strong>

<button
onClick={()=>handleDeleteCustomer(c)}
>

Delete

</button>

</div>

))}

</div>

);

}