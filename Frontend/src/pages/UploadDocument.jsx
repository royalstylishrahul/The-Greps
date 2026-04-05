import React,{useState} from "react";
import {useParams} from "react-router-dom";

const API="http://localhost:5001/api";

export default function UploadDocument(){

const {qrToken}=useParams();

const [file,setFile]=useState(null);

const [msg,setMsg]=useState("");

const upload=async()=>{

if(!file) return;

const formData=new FormData();

formData.append("file",file);

formData.append("qrToken",qrToken);

const res=await fetch(`${API}/upload`,{

method:"POST",

body:formData

});

if(res.ok){

setMsg("Uploaded successfully");

}else{

setMsg("Upload failed");

}

};

return(

<div style={{

height:"100vh",

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

fontFamily:"sans-serif"

}}>

<h2>Upload Document</h2>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button
onClick={upload}
style={{
marginTop:10,
padding:"8px 20px"
}}
>
Upload
</button>

<p>{msg}</p>

</div>

);

}