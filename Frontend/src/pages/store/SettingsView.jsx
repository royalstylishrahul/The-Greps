import { useState, useEffect } from "react";
import { useApp } from "./StoreDashboard";
import API from "../../services/api";
import CustomFieldBuilder from "./CustomFieldBuilder";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  accent: "#6366f1", accentDark: "#4f46e5", accentLight: "#a5b4fc",
  purple: "#8b5cf6", pink: "#ec4899", green: "#10b981", amber: "#f59e0b",
  blue: "#3b82f6", red: "#ef4444",
  bg: "#f4f5fb", card: "#ffffff", sidebar: "#ffffff",
  border: "#eeeef8", borderHover: "#c4b5fd",
  textH: "#1e1b4b", textB: "#374151", textS: "#6b7280", textM: "#9ca3af",
  grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  gradPink: "linear-gradient(135deg,#ec4899,#8b5cf6)",
  shadow: "0 2px 14px rgba(99,102,241,0.09)",
  shadowMd: "0 6px 28px rgba(99,102,241,0.15)",
  shadowLg: "0 16px 48px rgba(99,102,241,0.22)",
  r: "18px", rSm: "12px", rXs: "8px",
};

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView({ openCustomFields }) {
const { addToast, setStoreProfile, storeProfile } = useApp();
const [tab, setTab] = useState("profile");
const [showCustomFieldPopup,setShowCustomFieldPopup] = useState(false);
const [customFields,setCustomFields] = useState([]);   
const [newFieldName,setNewFieldName] = useState("");
const [newFieldType,setNewFieldType] = useState("text");
const [showAdd,setShowAdd] = useState(false);
const [editId,setEditId] = useState(null);

const [editName,setEditName] = useState("");
const [deleteId,setDeleteId] = useState(null);

const updateField = async(id)=>{

if(!editName.trim()) return;

try{

await API.put(
`/customers/custom-fields/${id}`,
{
name:editName
}
);

setCustomFields(prev=>
prev.map(f=>
f._id===id
? {...f,name:editName}
: f
)
);

setEditId(null);

addToast("Field updated");

}catch{

addToast("Update failed");

}

};  

const deleteField = async(id)=>{

try{

await API.delete(
`/customers/custom-fields/${id}`
);

setCustomFields(prev=>
prev.filter(f=>f._id!==id)
);

setDeleteId(null);

addToast("Field deleted");

}catch{

addToast("Delete failed");

}

};



const addField = async(name,type,options=[],required=false)=>{

if(!name.trim()) return;

try{

await API.post("/customers/custom-fields",{
 name:name,
 type:type,
 options:options,
 required:required,
 store: storeProfile._id
});

// always refetch (safe method)
await fetchCustomFields();

addToast("Field added");

}catch(e){

console.log(e);

addToast("Error adding field");

}

};

  const [logoFile,setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors,setErrors] = useState({});
  const [form, setForm] = useState({
storeName:"",
ownerName:"",
phone:"",
email:"",
address:"",
category:"",
website:"",
});
  const [wa, setWa] = useState({apiKey:"",phoneId:"",businessId:"",webhookUrl:""});
  const [billing] = useState({plan:"Pro",next:"Dec 1, 2024",amount:"₹2,499",card:"•••• 4242"});
  const set = k => e => {

const value = e.target.value;

setForm(f=>({...f,[k]:value}));

// clear error when user edits field
setErrors(prev=>({
...prev,
[k]:null
}));

};
  const setWaField = k => e => setWa(f=>({...f,[k]:e.target.value}));

  const TABS = [
 {id:"profile",icon:"👤",label:"Store Profile"},
 {id:"custom_fields",icon:"🧩",label:"Custom Fields"},   // ADD THIS
 {id:"whatsapp",icon:"💬",label:"WhatsApp API"},
 {id:"billing",icon:"💳",label:"Billing"},
 {id:"team",icon:"👥",label:"Team Members"},
 {id:"notifications",icon:"🔔",label:"Notifications"},
];
const handleLogoChange = (e)=>{

const file = e.target.files[0];

if(!file) return;

// limit 2MB
if(file.size > 2 * 1024 * 1024){

setErrors(prev=>({
...prev,
logo:"Logo must be under 2MB"
}));

addToast("Image too large");

return;

}

setErrors(prev=>({
...prev,
logo:null
}));

setLogoFile(file);

const imageUrl = URL.createObjectURL(file);

setLogoPreview(imageUrl);

};
const fetchCustomFields = async()=>{

try{

const res = await API.get("/customers/custom-fields");

console.log("CUSTOM FIELDS API:",res.data);

setCustomFields(res.data || []);

}catch(e){

console.log("CUSTOM FIELD ERROR:",e);
setCustomFields([]);

}

};
const fetchStoreProfile = async()=>{

try{

const res = await API.get("/auth/store-profile");

console.log("STORE API DATA:", res.data.store);

if(res.data.store){

setForm({
storeName:res.data.store.storeName || "",
ownerName:res.data.store.ownerName || "",
phone:res.data.store.phone || "",
email:res.data.store.email || "",
address:res.data.store.address || "",
category:res.data.store.category || "",
website:res.data.store.website || ""
});

setLogoPreview(
res.data.store.logo
? `http://localhost:5001${res.data.store.logo}`
: null
);

setStoreProfile(res.data.store);

}

}catch(e){

console.log(e);

}

};
useEffect(()=>{

fetchCustomFields();
fetchStoreProfile();

},[]);

  return (
    <>
    <div className="fade">
      <div style={{marginBottom:22}}>
        <h1 className="page-title">Settings</h1>
        <p style={{fontSize:13.5,color:T.textM,marginTop:4}}>Manage your store configuration and integrations</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20,alignItems:"start"}}>
        {/* Side Tabs */}
        <div className="card" style={{padding:"12px"}}>
          {TABS.map(t=>(
            <div key={t.id} className={`settings-tab${tab===t.id?" active":""}`} 
            
onClick={()=>{
setTab(t.id);
}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {tab==="profile" && (
            <div className="card fade" style={{padding:"26px 28px"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.textH,marginBottom:20}}>Store Profile</div>

              {/* Logo Upload */}
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24,padding:"18px 20px",background:"#fafafe",borderRadius:14,border:`1.5px dashed ${T.border}`}}>
                <div style={{width:80,height:80,borderRadius:16,background:logoPreview?"transparent":"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:logoPreview?0:34,overflow:"hidden",flexShrink:0,border:`2px solid ${T.border}`}}>
                  {logoPreview ? <img src={logoPreview} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : "🏪"}
                </div>
                <div>
                  <div style={{fontWeight:700,color:T.textH,marginBottom:4}}>Store Logo</div>
                  <div style={{fontSize:12.5,color:T.textM,marginBottom:10}}>PNG or JPG. Recommended 200×200px.</div>
                  {errors.logo && (
<div style={{
color:"#ef4444",
fontSize:"12px",
marginBottom:"6px"
}}>
{errors.logo}
</div>
)}
                  <label style={{cursor:"pointer"}}>
                    <span className="btn-secondary" style={{fontSize:12.5,padding:"6px 14px"}}>📁 Upload Logo</span>
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoChange}/>
                  </label>
                  {logoPreview && <button style={{marginLeft:8,fontSize:12,color:T.red,background:"none",border:"none",cursor:"pointer",fontWeight:600}} onClick={()=>setLogoPreview(null)}>Remove</button>}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:14}}>
                <div>

<label className="label">Store Name *</label>

<input 
className="input" 
value={form.storeName} 
onChange={set("storeName")}
style={{
border: errors.storeName ? "1.5px solid #ef4444" : ""
}}
/>

{errors.storeName && (
<div style={{
color:"#ef4444",
fontSize:"12px",
marginTop:"4px"
}}>
{errors.storeName}
</div>
)}

</div>
                <div>

<label className="label">Owner Name *</label>

<input 
className="input" 
value={form.ownerName} 
onChange={set("ownerName")}
style={{
border: errors.ownerName ? "1.5px solid #ef4444" : ""
}}
/>

{errors.ownerName && (
<div style={{
color:"#ef4444",
fontSize:"12px",
marginTop:"4px"
}}>
{errors.ownerName}
</div>
)}

</div>
                <div>
<label className="label">Contact Number</label>

<input 
className="input" 
value={form.phone} 

onChange={(e)=>{

const value = e.target.value.replace(/[^0-9]/g,'');

setForm(f=>({...f,phone:value}));

// live validation
if(value && value.length !== 10){

setErrors(prev=>({
...prev,
phone:"Phone must be 10 digits"
}));

}else{

setErrors(prev=>({
...prev,
phone:null
}));

}

}}

maxLength={10}

style={{
border: errors.phone ? "1.5px solid #ef4444" : ""
}}
/>
{errors.phone && (
<div style={{
color:"#ef4444",
fontSize:"12px",
marginTop:"4px"
}}>
{errors.phone}
</div>
)}

</div>
<div><label className="label">Email Address</label>
<input
className="input bg-slate-100 cursor-not-allowed"
type="email"
value={form.email}
disabled
style={{
border: errors.email
? "1.5px solid #ef4444"
: "1.5px solid transparent"
}}
/>
{errors.email && (
<div style={{
color:"#ef4444",
fontSize:"12px",
marginTop:"4px"
}}>
{errors.email}
</div>
)}
</div>
                <div><label className="label">Business Category</label>
                  <select className="select" value={form.category} onChange={set("category")}>
  <option value="">Select Category</option>
  {["Clothing","Electronics","Grocery","Jewellery","Home Decor","Books & Stationery","Beauty & Health","Footwear","Sports","Other"].map(c=>
    <option key={c} value={c}>{c}</option>
  )}
</select>
                </div>
                <div><label className="label">Website (optional)</label><input className="input" value={form.website} onChange={set("website")}/></div>
              </div>
              <div style={{marginBottom:20}}>
                <label className="label">Full Store Address</label>
                <textarea className="textarea" rows={3} value={form.address} onChange={set("address")}/>
              </div>
              <div style={{display:"flex",gap:10}}>
              <button 
className="btn-primary" 

disabled={
!form.storeName.trim() ||
!form.ownerName.trim() ||
errors.storeName ||
errors.ownerName ||
errors.phone ||
errors.email ||
errors.logo
}

style={{
opacity:
(!form.storeName || !form.ownerName || Object.values(errors).some(e=>e))
? 0.6 : 1,

cursor:
(!form.storeName || !form.ownerName || Object.values(errors).some(e=>e))
? "not-allowed" : "pointer"
}}

onClick={async()=>{

try{
  
let newErrors = {};

if(!form.storeName.trim()){
newErrors.storeName = "Store name required";
}

if(!form.ownerName.trim()){
newErrors.ownerName = "Owner name required";
}

if(form.phone && form.phone.length !== 10){
newErrors.phone = "Phone must be 10 digits";
}

setErrors(newErrors);

if(Object.keys(newErrors).length > 0){
return;
}

const formData = new FormData();

if(form.storeName)
formData.append("storeName",form.storeName);

if(form.ownerName)
formData.append("ownerName",form.ownerName);

if(form.address)
formData.append("address",form.address);

if(form.category)
formData.append("category",form.category);

if(form.website)
formData.append("website",form.website);

// IMPORTANT: email & phone remove (unless you build OTP flow)

if(logoFile){
formData.append("logo",logoFile);
}

const res = await API.put(
"/auth/store-profile",
formData,
{
 headers:{
  "Content-Type":"multipart/form-data",
  Authorization:`Bearer ${localStorage.getItem("token")}`
 }
}
);

setStoreProfile(res.data.store);

setForm({
storeName: res.data.store.storeName || "",
ownerName: res.data.store.ownerName || "",
phone: res.data.store.phone || "",
email: res.data.store.email || "",
address: res.data.store.address || "",
category: res.data.store.category || "",
website: res.data.store.website || "",
});
setLogoPreview(
res.data.store.logo
? `http://localhost:5001${res.data.store.logo}`
: null
);

addToast(
"Store Profile Updated!",
"Your changes saved successfully"
);

}catch(e){

console.log("UPDATE ERROR:", e);
console.log("RESPONSE:", e.response?.data);

addToast("Update failed");

}

}}>💾 Save Changes</button>
                <button className="btn-ghost" onClick={()=>addToast("Changes Discarded","Reverted to last saved state.")}>Discard</button>
              </div>
            </div>
          )}

          {tab==="whatsapp" && (
            <div className="card fade" style={{padding:"26px 28px"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.textH,marginBottom:6}}>WhatsApp Business API</div>
              <div style={{fontSize:13.5,color:T.textM,marginBottom:22}}>Connect your WhatsApp Business account to send campaigns.</div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"#ecfdf5",border:`1.5px solid #a7f3d0`,borderRadius:12,marginBottom:20}}>
                <span style={{fontSize:20}}>✅</span>
                <div>
                  <div style={{fontWeight:700,color:"#065f46",fontSize:13.5}}>Connected: +91 98765 43210</div>
                  <div style={{fontSize:12.5,color:"#047857"}}>WhatsApp Business API · Tier 2 · 1,000 msgs/day</div>
                </div>
              </div>
              {[{k:"apiKey",l:"API Access Token",ph:"EAABsbCS..."},{k:"phoneId",l:"Phone Number ID",ph:"1234567890"},{k:"businessId",l:"Business Account ID",ph:"9876543210"},{k:"webhookUrl",l:"Webhook URL",ph:"https://yourapp.com/webhook"}].map(f=>(
                <div key={f.k} style={{marginBottom:14}}>
                  <label className="label">{f.l}</label>
                  <input className="input" type={f.k==="apiKey"?"password":"text"} placeholder={f.ph} value={wa[f.k]} onChange={setWaField(f.k)}/>
                </div>
              ))}
              <button className="btn-primary" onClick={()=>addToast("API Settings Saved","WhatsApp integration updated.")}>Save API Settings</button>
            </div>
          )}

          {tab==="billing" && (
            <div className="card fade" style={{padding:"26px 28px"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.textH,marginBottom:20}}>Billing & Subscription</div>
              <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:16,padding:"22px 24px",color:"#fff",marginBottom:22}}>
                <div style={{fontSize:12.5,opacity:.8,marginBottom:4}}>Current Plan</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,marginBottom:6}}>The Greps Pro</div>
                <div style={{fontSize:13.5,opacity:.9}}>Unlimited campaigns · 5,000 contacts · 3 stores</div>
                <div style={{marginTop:14,fontSize:12.5,opacity:.75}}>Next billing: {billing.next} · {billing.amount}/month</div>
              </div>
              {[
                {label:"Payment Method",value:`Visa ${billing.card}`,action:"Change"},
                {label:"Billing Email",value:form.email,action:"Update"},
                {label:"Invoice History",value:"View last 12 invoices",action:"Download All"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                  <div>
                    <div style={{fontWeight:600,color:T.textH,fontSize:13.5}}>{r.label}</div>
                    <div style={{fontSize:12.5,color:T.textM,marginTop:2}}>{r.value}</div>
                  </div>
                  <button className="btn-ghost" style={{fontSize:12.5,padding:"6px 14px"}} onClick={()=>addToast(r.action,`${r.label} action triggered.`)}>{r.action}</button>
                </div>
              ))}
              <div style={{marginTop:18}}>
                <button style={{padding:"10px 20px",borderRadius:12,border:`1.5px solid #fecaca`,background:"#fef2f2",color:T.red,fontSize:13,fontWeight:600,cursor:"pointer"}} onClick={()=>addToast("Cancellation Request","Our team will contact you within 24h.",{type:"error"})}>Cancel Subscription</button>
              </div>
            </div>
          )}

          {tab==="team" && (
            <div className="card fade" style={{padding:"26px 28px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.textH}}>Team Members</div>
                <button className="btn-primary" onClick={()=>addToast("Invite Sent","Team invitation email sent.")}>+ Invite Member</button>
              </div>
              {[
                {name:"Rajesh Sharma",email:"rajesh@...",role:"Owner",initials:"RS",color:"#6366f1"},
                {name:"Meena Singh",email:"meena@...",role:"Manager",initials:"MS",color:"#8b5cf6"},
                {name:"Arjun Dev",email:"arjun@...",role:"Staff",initials:"AD",color:"#10b981"},
              ].map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:m.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:m.color}}>{m.initials}</div>
                    <div>
                      <div style={{fontWeight:600,color:T.textH}}>{m.name}</div>
                      <div style={{fontSize:12.5,color:T.textM}}>{m.email}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12.5,fontWeight:600,padding:"3px 12px",borderRadius:20,background:"#f0f0ff",color:T.accent}}>{m.role}</span>
                    {m.role!=="Owner"&&<button style={{background:"none",border:"none",fontSize:13,color:T.red,cursor:"pointer",fontWeight:600}} onClick={()=>addToast("Removed",`${m.name} removed from team.`)}>Remove</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="custom_fields" && (
  <CustomFieldBuilder 
  onClose={() => setTab("profile")}
  customFields={customFields}
  newFieldName={newFieldName}
  setNewFieldName={setNewFieldName}
  newFieldType={newFieldType}
  setNewFieldType={setNewFieldType}
  showAdd={showAdd}
  setShowAdd={setShowAdd}
  editId={editId}
  setEditId={setEditId}
  editName={editName}
  setEditName={setEditName}
  deleteId={deleteId}
  setDeleteId={setDeleteId}
  onAddField={(name,type,options,required)=>
addField(name,type,options,required)
}
  onUpdateField={updateField}
  onDeleteField={deleteField}
/>
)}

          {tab==="notifications" && (
            <div className="card fade" style={{padding:"26px 28px"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.textH,marginBottom:20}}>Notification Preferences</div>
              {[
                {label:"Campaign Delivered",desc:"When a campaign finishes sending",checked:true},
                {label:"New Customer Added",desc:"When a new contact joins",checked:true},
                {label:"Low Stock Alert",desc:"When a product goes below 5 units",checked:false},
                {label:"Payment Received",desc:"When an order is placed via WhatsApp",checked:true},
                {label:"Weekly Report",desc:"Summary every Monday at 9am",checked:false},
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}>
                  <div>
                    <div style={{fontWeight:600,color:T.textH,fontSize:13.5}}>{n.label}</div>
                    <div style={{fontSize:12.5,color:T.textM,marginTop:2}}>{n.desc}</div>
                  </div>
                  <label style={{position:"relative",display:"inline-block",width:44,height:24,cursor:"pointer",flexShrink:0}}>
                    <input type="checkbox" defaultChecked={n.checked} style={{opacity:0,width:0,height:0}}
                      onChange={e=>addToast(n.label,e.target.checked?"Enabled":"Disabled")}/>
                    <span style={{position:"absolute",inset:0,background:n.checked?"#6366f1":"#d1d5db",borderRadius:24,transition:"all .2s"}}>
                      <span style={{position:"absolute",left:n.checked?22:2,top:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/>
                    </span>
                  </label>
                </div>
              ))}
              <div style={{marginTop:18}}>
                <button className="btn-primary" onClick={()=>addToast("Preferences Saved","Notification settings updated.")}>Save Preferences</button>
              </div>
            </div>
          )}
        </div>
     </div>
    </div>
</>
);
}
export default SettingsView;
