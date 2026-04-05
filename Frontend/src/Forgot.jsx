import axios from "axios";
import { useState } from "react";

export default function Forgot({ setPage }) {

const [email,setEmail]=useState("");

function reset(){

 if(!email){
  alert("Enter email");
  return;
 }

 axios.post("http://localhost:5001/api/auth/forgot",{
  email
 })

 .then(res=>{
  alert(res.data.message);
 })

 .catch(err=>{
  alert("Error");
 });

}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"linear-gradient(180deg,#8ec5fc,#e0c3fc)"
}}>

<div style={{
width:"380px",
padding:"30px",
borderRadius:"20px",
background:"rgba(255,255,255,0.2)",
backdropFilter:"blur(15px)",
boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
}}>

<h2>Forgot Password</h2>

<input
placeholder="Enter your email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<button onClick={reset}>
Reset Password
</button>

<p 
onClick={()=>setPage("login")}
style={{cursor:"pointer"}}
>
Back to login
</p>

</div>

</div>

);

}