import Modal from "../../components/Modal";
import CustomFieldBuilder from "./CustomFieldBuilder";
import SettingsView from "./SettingsView";
import API from "../../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

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

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.textB};}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-thumb{background:#e0e0f0;border-radius:8px;}
.fade{animation:fadeUp .2s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
.slide-down{animation:slideDown .18s ease both;}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}
.card{background:${T.card};border-radius:${T.r};box-shadow:${T.shadow};border:1.5px solid ${T.border};}
.nav-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:${T.rSm};cursor:pointer;font-size:14px;font-weight:500;color:${T.textS};transition:all .17s;user-select:none;}
.nav-link:hover{background:#f0f0ff;color:${T.accent};}
.nav-link.active{background:${T.grad};color:#fff;box-shadow:0 4px 14px rgba(99,102,241,0.3);}
.btn-primary{background:${T.grad};color:#fff;border:none;padding:10px 20px;border-radius:${T.rSm};font-size:13.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:7px;box-shadow:0 4px 14px rgba(99,102,241,0.28);transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(99,102,241,0.38);}
.btn-primary:active{transform:none;}
.btn-secondary{background:#fff;color:${T.accent};border:1.5px solid #c7d2fe;padding:9px 18px;border-radius:${T.rSm};font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .18s;font-family:'DM Sans',sans-serif;}
.btn-secondary:hover{background:#f0f0ff;border-color:#a5b4fc;}
.btn-ghost{background:transparent;border:1.5px solid ${T.border};padding:8px 14px;border-radius:${T.rSm};font-size:13px;font-weight:500;cursor:pointer;color:${T.textS};transition:all .18s;font-family:'DM Sans',sans-serif;}
.btn-ghost:hover{background:#f9f9fc;border-color:${T.accentLight};}
.input{background:#f7f7fd;border:1.5px solid ${T.border};border-radius:${T.rSm};padding:10px 14px;font-size:13.5px;color:${T.textH};outline:none;font-family:'DM Sans',sans-serif;width:100%;transition:border .18s,background .18s;}
.input:focus{border-color:${T.accentLight};background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.08);}
.select{background:#f7f7fd;border:1.5px solid ${T.border};border-radius:${T.rSm};padding:10px 14px;font-size:13.5px;color:${T.textH};outline:none;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;}
.select:focus{border-color:${T.accentLight};}
.textarea{background:#f7f7fd;border:1.5px solid ${T.border};border-radius:${T.rSm};padding:10px 14px;font-size:13.5px;color:${T.textH};outline:none;font-family:'DM Sans',sans-serif;width:100%;resize:vertical;transition:border .18s;}
.textarea:focus{border-color:${T.accentLight};background:#fff;}
.label{font-size:12.5px;font-weight:600;color:${T.textS};margin-bottom:6px;display:block;letter-spacing:.02em;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;font-size:11.5px;font-weight:700;color:${T.textM};padding:10px 16px;letter-spacing:.05em;text-transform:uppercase;background:#fafafe;border-bottom:1.5px solid ${T.border};}
td{font-size:13.5px;color:${T.textB};padding:13px 16px;border-bottom:1px solid #f5f5fc;transition:background .13s;}
tr:hover td{background:#fafafe;}tr:last-child td{border-bottom:none;}
.badge{display:inline-flex;align-items:center;font-size:11.5px;font-weight:600;padding:3px 11px;border-radius:20px;}
.badge-green{background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;}
.badge-red{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;}
.badge-blue{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;}
.badge-amber{background:#fffbeb;color:#d97706;border:1px solid #fde68a;}
.badge-gray{background:#f9fafb;color:#6b7280;border:1px solid #e5e7eb;}
.badge-purple{background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe;}
.modal-overlay{position:fixed;inset:0;background:rgba(15,10,40,.45);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeOverlay .18s ease;}
@keyframes fadeOverlay{from{opacity:0;}to{opacity:1;}}
.modal-box{background:#fff;border-radius:22px;box-shadow:${T.shadowLg};width:100%;max-width:520px;max-height:90vh;overflow-y:auto;animation:slideUp .22s ease;}
@keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
.toast-container{position:fixed;bottom:28px;right:28px;z-index:300;display:flex;flex-direction:column;gap:10px;}
.toast{background:#fff;border-radius:14px;box-shadow:${T.shadowMd};padding:14px 18px;display:flex;align-items:center;gap:12px;min-width:280px;border-left:4px solid ${T.green};animation:toastIn .25s ease;font-size:13.5px;font-weight:500;}
.toast.error{border-left-color:${T.red};}
@keyframes toastIn{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:none;}}
.dropdown{position:absolute;background:#fff;border-radius:16px;box-shadow:${T.shadowLg};border:1.5px solid ${T.border};z-index:100;overflow:hidden;animation:slideDown .17s ease;}
.dropdown-item{display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:13.5px;font-weight:500;color:${T.textB};cursor:pointer;transition:background .14s;}
.dropdown-item:hover{background:#f5f3ff;color:${T.accent};}
.dropdown-item.danger{color:${T.red};}
.dropdown-item.danger:hover{background:#fef2f2;}
.tab-btn{padding:9px 20px;border-radius:10px;border:1.5px solid transparent;font-size:13px;font-weight:600;cursor:pointer;transition:all .17s;font-family:'DM Sans',sans-serif;}
.tab-btn.active{background:${T.grad};color:#fff;box-shadow:0 3px 12px rgba(99,102,241,0.25);}
.tab-btn:not(.active){color:${T.textS};background:#fff;border-color:${T.border};}
.tab-btn:not(.active):hover{border-color:${T.accentLight};color:${T.accent};}
.settings-tab{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:${T.rSm};cursor:pointer;font-size:13.5px;font-weight:500;color:${T.textS};transition:all .17s;}
.settings-tab:hover{background:#f5f3ff;color:${T.accent};}
.settings-tab.active{background:${T.grad};color:#fff;box-shadow:0 3px 12px rgba(99,102,241,0.22);}
.progress-bg{background:#f0f0ff;border-radius:20px;height:7px;overflow:hidden;}
.progress-fill{height:100%;border-radius:20px;background:${T.grad};}
.logo-text{background:${T.grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Sora',sans-serif;font-weight:800;font-size:18px;}
.page-title{font-family:'Sora',sans-serif;font-size:22px;font-weight:700;color:${T.textH};}
.section-title{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:${T.textH};}
.metric-val{font-family:'Sora',sans-serif;font-size:28px;font-weight:700;color:${T.textH};}
.notif-dot{width:9px;height:9px;background:${T.gradPink};border-radius:50%;position:absolute;top:1px;right:1px;border:1.5px solid #fff;}
.icon-btn{width:38px;height:38px;border-radius:${T.rSm};background:#f5f6fa;border:1.5px solid ${T.border};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;position:relative;flex-shrink:0;transition:all .17s;}
.icon-btn:hover{background:#f0f0ff;border-color:${T.accentLight};}
`;

// ─── APP CONTEXT ──────────────────────────────────────────────────────────────
const AppCtx = createContext(null);

export function useApp() {
  return useContext(AppCtx);
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.type==="error"?" error":""}`} onClick={() => dismiss(t.id)} style={{cursor:"pointer"}}>
          <span style={{fontSize:20}}>{t.type==="error"?"❌":"✅"}</span>
          <div>
            <div style={{fontWeight:700,fontSize:13.5,color:T.textH}}>{t.title}</div>
            {t.body && <div style={{fontSize:12.5,color:T.textS,marginTop:2}}>{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── ADD CUSTOMER MODAL ───────────────────────────────────────────────
function AddCustomerModal({ open, onClose, onSave, customFields, editData }) {
  
  useEffect(()=>{
  console.log("CUSTOM FIELDS MODAL:",customFields);
},[customFields]);
  const [form, setForm] = useState({
    
    name: "", whatsapp: "", email: "", address: "", location: "", gender: "", tag: "regular", customFields: {}
  });

  // Reset form when modal opens/closes
  useEffect(() => {

if(open){

if(editData){

setForm({
name:editData.name || "",
whatsapp:editData.whatsapp || "",
email:editData.email || "",
address:editData.address || "",
location:editData.location || "",
gender:editData.gender || "",
tag:editData.tag || "regular",
customFields:editData.customFields || {}
});

}else{

setForm({
name:"",
whatsapp:"",
email:"",
address:"",
location:"",
gender:"",
tag:"regular",
customFields:{}
});

}

}

},[open,editData]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Custom Field update handler
  const handleCustomFieldChange = (fieldName, value) => {
    setForm(f => ({
      ...f,
      customFields: {
        ...f.customFields,
        [fieldName]: value
      }
    }));
  };

  const save = () => {
    if (!form.name || !form.whatsapp){
      alert("Please fill required fields (Name & WhatsApp)");
      return;
    }

const formData = new FormData();

formData.append("name",form.name || "");
formData.append("whatsapp",form.whatsapp || "");
formData.append("email",form.email || "");


Object.keys(form.customFields).forEach(key=>{

const value = form.customFields[key];

if(value instanceof File){

formData.append("files",value);

}else{

formData.append(`customFields[${key}]`,value);

}

});
console.log("FORM DATA:",{
name:form.name,
whatsapp:form.whatsapp,
email:form.email,
customFields:form.customFields
});
onSave(formData);

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="➕ Add New Customer">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Standard Fields */}
        <div><label className="label">Full Name *</label><input className="input" placeholder="e.g. Priya Kapoor" value={form.name} onChange={set("name")} /></div>
        <div><label className="label">WhatsApp Number *</label><input className="input" placeholder="+91 98765 43210" value={form.whatsapp} onChange={set("whatsapp")} /></div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label className="label">Email</label><input className="input" placeholder="mail@example.com" value={form.email} onChange={set("email")} /></div>
          <div><label className="label">Gender</label>
            <select className="select" value={form.gender} onChange={set("gender")}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* DYNAMIC CUSTOM FIELDS ────────────────────────────────────────────── */}
        {Array.isArray(customFields) && customFields.length>0 && (

<div style={{ marginTop: 10, paddingTop: 15, borderTop: `1.5px solid ${T.border}` }}>

<div style={{ fontSize: 13, fontWeight: 700, color: T.accent, marginBottom: 12 }}>
ADDITIONAL DETAILS (Custom)
</div>

<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

{customFields.map((field,i)=>(
<div key={field._id || i}>

<label className="label">{field.name}</label>

{field.type?.toLowerCase() === "select" ? (

<select
className="select"
value={form.customFields[field._id] || ""}
onChange={(e)=>handleCustomFieldChange(field._id,e.target.value)}
>
<option value="">Select option</option>

{field.options?.map(opt=>(
<option key={opt} value={opt}>{opt}</option>
))}

</select>

) : field.type?.toLowerCase() === "date" ? (

<input
type="date"
className="input"
value={form.customFields[field._id] || ""}
onChange={(e)=>handleCustomFieldChange(field._id,e.target.value)}
/>

) : field.type?.toLowerCase() === "fileqr" ? (

<input
type="file"
className="input"
onChange={(e)=>{

const file = e.target.files[0];

handleCustomFieldChange(
field._id,
file
);

}}
/>

) : (

<input
type="text"
className="input"
placeholder={`Enter ${field.name}`}
value={form.customFields[field._id] || ""}
onChange={(e)=>handleCustomFieldChange(field._id,e.target.value)}
/>

)}

</div>
))}

</div>

</div>

)}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save Customer</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── ADD PRODUCT MODAL ────────────────────────────────────────────────────────
function AddProductModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({name:"",price:"",cat:"Sarees",status:"in_stock",sku:"",emoji:"📦",stock:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const emojis = ["📦","🥻","👕","👗","🧣","💃","🎩","👚","👟","💍"];
  const save = () => {
    if(!form.name||!form.price) return;
    onSave({...form, id:Date.now()}); 
    setForm({name:"",price:"",cat:"Sarees",status:"in_stock",sku:"",emoji:"📦",stock:""}); 
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="📦 Add New Product">
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{emojis.map(e=>(
          <button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} style={{width:36,height:36,borderRadius:10,border:`2px solid ${form.emoji===e?T.accent:T.border}`,background:form.emoji===e?"#f0f0ff":"#fff",fontSize:20,cursor:"pointer"}}>{e}</button>
        ))}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label className="label">Product Name *</label><input className="input" placeholder="e.g. Silk Saree" value={form.name} onChange={set("name")}/></div>
          <div><label className="label">Price *</label><input className="input" placeholder="₹2,500" value={form.price} onChange={set("price")}/></div>
          <div><label className="label">Category</label>
            <select className="select" value={form.cat} onChange={set("cat")}>
              {["Sarees","Kurtas","Suits","Lehengas","Accessories","Ethnic Wear","Blouses"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Status</label>
            <select className="select" value={form.status} onChange={set("status")}>
              <option value="in_stock">In Stock</option><option value="out_stock">Out of Stock</option>
            </select>
          </div>
          <div><label className="label">SKU</label><input className="input" placeholder="e.g. SS-001" value={form.sku} onChange={set("sku")}/></div>
          <div><label className="label">Stock Qty</label><input className="input" type="number" placeholder="50" value={form.stock} onChange={set("stock")}/></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Add Product</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── CREATE CAMPAIGN MODAL ────────────────────────────────────────────────────
function CreateCampaignModal({ open, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:"",audience:"all",msg:"",scheduled:false,schedDate:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const audiences = [{v:"all",l:"All Customers (4,832)"},{v:"vip",l:"VIP Customers (348)"},{v:"new",l:"New This Month (213)"},{v:"inactive",l:"Inactive 30d (892)"}];
  const reset = () => { setStep(1); setForm({name:"",audience:"all",msg:"",scheduled:false,schedDate:""}); };
  const save = () => {
    if(!form.name||!form.msg) return;
    onSave({...form,id:Date.now(),date:"Now",status:form.scheduled?"scheduled":"sent",readPct:0,clicked:0,
      audience:audiences.find(a=>a.v===form.audience)?.l.match(/\d+,?\d*/)?.[0]?.replace(",","")||0});
    reset(); onClose();
  };
  
  if(!open) return null;
  
  return (
    <div className="modal-overlay" onClick={()=>{reset();onClose();}}>
      <div className="modal-box" style={{maxWidth:540}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:`1.5px solid ${T.border}`}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,color:T.textH}}>✨ Create Campaign</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3].map(s=>(
                <div key={s} style={{width:s<=step?28:22,height:7,borderRadius:20,background:s<=step?T.grad:"#e0e0f0",transition:"all .2s"}}/>
              ))}
            </div>
            <button onClick={()=>{reset();onClose();}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:T.textM}}>&times;</button>
          </div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {step===1 && (
            <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade">
              <div style={{fontSize:13.5,fontWeight:600,color:T.textS,marginBottom:-4}}>Step 1: Campaign Details</div>
              <div><label className="label">Campaign Name *</label><input className="input" placeholder="e.g. Diwali Flash Sale" value={form.name} onChange={set("name")}/></div>
              <div><label className="label">Target Audience</label>
                <select className="select" value={form.audience} onChange={set("audience")}>
                  {audiences.map(a=><option key={a.v} value={a.v}>{a.l}</option>)}
                </select>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn-ghost" onClick={()=>{reset();onClose();}}>Cancel</button>
                <button className="btn-primary" onClick={()=>form.name&&setStep(2)} style={{opacity:form.name?1:.5}}>Next →</button>
              </div>
            </div>
          )}
          {step===2 && (
            <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade">
              <div style={{fontSize:13.5,fontWeight:600,color:T.textS,marginBottom:-4}}>Step 2: Message</div>
              <div><label className="label">WhatsApp Message *</label>
                <textarea className="textarea" rows={5} placeholder="Type your message here... Use {{name}} to personalize." value={form.msg} onChange={set("msg")}/>
                <div style={{fontSize:11.5,color:T.textM,marginTop:4}}>Characters: {form.msg.length} / 1024</div>
              </div>
              {form.msg && (
                <div style={{background:"#f0fdf4",border:`1.5px solid #a7f3d0`,borderRadius:12,padding:"12px 14px",fontSize:13,color:"#065f46"}}>
                  <div style={{fontWeight:600,marginBottom:4,fontSize:12}}>📱 Preview</div>
                  <div style={{background:"#fff",borderRadius:10,padding:"10px 12px",fontSize:13.5,lineHeight:1.6,whiteSpace:"pre-wrap",color:T.textB}}>{form.msg.replace("{{name}}","Priya")}</div>
                </div>
              )}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={()=>form.msg&&setStep(3)} style={{opacity:form.msg?1:.5}}>Next →</button>
              </div>
            </div>
          )}
          {step===3 && (
            <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade">
              <div style={{fontSize:13.5,fontWeight:600,color:T.textS,marginBottom:-4}}>Step 3: Schedule & Send</div>
              <div style={{background:"#f5f3ff",border:`1.5px solid #ddd6fe`,borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.textH,marginBottom:8}}>Campaign Summary</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13,color:T.textS}}>
                  <div><span style={{color:T.textM}}>Name:</span> <strong style={{color:T.textH}}>{form.name}</strong></div>
                  <div><span style={{color:T.textM}}>Audience:</span> <strong style={{color:T.textH}}>{audiences.find(a=>a.v===form.audience)?.l}</strong></div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#f9f9fc",borderRadius:12}}>
                <input type="checkbox" id="sched" checked={form.scheduled} onChange={e=>setForm(f=>({...f,scheduled:e.target.checked}))} style={{width:16,height:16,accentColor:T.accent}}/>
                <label htmlFor="sched" style={{fontSize:13.5,fontWeight:600,color:T.textH,cursor:"pointer"}}>Schedule for later</label>
              </div>
              {form.scheduled && (
                <div><label className="label">Schedule Date & Time</label><input className="input" type="datetime-local" value={form.schedDate} onChange={set("schedDate")}/></div>
              )}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn-ghost" onClick={()=>setStep(2)}>← Back</button>
                <button className="btn-primary" onClick={save}>🚀 {form.scheduled?"Schedule":"Send Now"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATION DROPDOWN ────────────────────────────────────────────────────
function NotifDropdown({ notifs, onMarkAll, onClose }) {
  const ref = useRef();
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))onClose();};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[onClose]);
  return (
    <div ref={ref} className="dropdown slide-down" style={{right:0,top:"calc(100% + 10px)",width:340,position:"absolute"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:`1.5px solid ${T.border}`}}>
        <div style={{fontWeight:700,fontSize:14,color:T.textH}}>Notifications</div>
        <button onClick={onMarkAll} style={{fontSize:12,color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Mark all read</button>
      </div>
      {notifs.map(n=>(
        <div key={n.id} className="dropdown-item" style={{alignItems:"flex-start",gap:12,padding:"12px 16px",background:n.read?"#fff":"#fafafe",borderBottom:`1px solid ${T.border}`}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:n.read?500:700,fontSize:13.5,color:T.textH}}>{n.title}</div>
            <div style={{fontSize:12.5,color:T.textS,marginTop:2,lineHeight:1.4}}>{n.body}</div>
            <div style={{fontSize:11.5,color:T.textM,marginTop:4}}>{n.time}</div>
          </div>
          {!n.read && <div style={{width:8,height:8,borderRadius:"50%",background:T.accent,flexShrink:0,marginTop:4}}/>}
        </div>
      ))}
      <div style={{padding:"10px 16px",textAlign:"center"}}>
        <button style={{fontSize:13,color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>View all notifications →</button>
      </div>
    </div>
  );
}

// ─── PROFILE DROPDOWN ─────────────────────────────────────────────────────────
function ProfileDropdown({ onSettings, onLogout, onClose, storeProfile }) {
  const ref = useRef();
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))onClose();};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[onClose]);
  
  const items = [
    {icon:"👤",label:"View Profile",  action:onSettings},
    {icon:"⚙️", label:"Settings",     action:onSettings},
    {icon:"💳",label:"Billing",       action:()=>{}},
    {icon:"📚",label:"Help & Docs",   action:()=>{}},
  ];
  
  return (
    <div ref={ref} className="dropdown slide-down" style={{right:0,top:"calc(100% + 10px)",width:220,position:"absolute"}}>
      <div style={{padding:"14px 16px",borderBottom:`1.5px solid ${T.border}`}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.textH}}>{storeProfile?.ownerName || "Owner"}</div>
        <div style={{fontSize:12,color:T.textM,marginTop:2}}>
{storeProfile?.email || ""}
</div>
      </div>
      {items.map(it=>(
        <div key={it.label} className="dropdown-item" onClick={()=>{it.action();onClose();}}>
          <span>{it.icon}</span><span>{it.label}</span>
        </div>
      ))}
      <div style={{borderTop:`1.5px solid ${T.border}`,margin:"4px 0"}}/>
      <div className="dropdown-item danger" onClick={()=>{onLogout();onClose();}}>
        <span>🚪</span><span>Logout</span>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ activeTab, onNavigate, onQuickCampaign, storeProfile }) {
  const { notifs, markAllRead, logout } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const unread = notifs?.filter(n=>!n.read)?.length || 0;
  
  const titles = { dashboard:`Welcome Back, ${storeProfile?.storeName || "Store"} 👋`, customers:"Customer Management", products:"Product Catalog", campaigns:"WhatsApp Campaigns", analytics:"Analytics & Insights", settings:"Settings" };
  const subs = { dashboard:storeProfile?.address || "Store Dashboard", customers:"Manage contacts and WhatsApp segments", products:"Inventory and product listings", campaigns:"Create and track WhatsApp campaigns", analytics:"Performance data and growth metrics", settings:"Store profile, integrations & billing" };

    return (
      <header style={{background:"#fff",borderBottom:`1.5px solid ${T.border}`,padding:"15px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40,boxShadow:`0 2px 12px rgba(99,102,241,0.05)`}}>
        <div>
          <div style={{fontSize:activeTab==="dashboard"?19:17,fontWeight:700,color:T.textH,fontFamily:"'Sora',sans-serif"}}>{titles[activeTab]}</div>
          <div style={{fontSize:12.5,color:T.textM,marginTop:2}}>{subs[activeTab]}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <input className="input" placeholder="🔍  Search anything..." style={{width:220,padding:"9px 14px",fontSize:13}}/>
  
          {/* Notifications */}
          <div style={{position:"relative"}}>
            <div className="icon-btn" onClick={()=>{setShowNotif(v=>!v);setShowProfile(false);}}>
              <span>🔔</span>
              {unread>0 && <div className="notif-dot"/>}
            </div>
            {showNotif && <NotifDropdown notifs={notifs} onMarkAll={()=>{markAllRead();setShowNotif(false);}} onClose={()=>setShowNotif(false)}/>}
          </div>
  
          {/* Profile */}
          <div style={{position:"relative"}}>
            <div
              onClick={()=>{setShowProfile(v=>!v);setShowNotif(false);}}
              style={{
                width:38,
                height:38,
                borderRadius:10,
                overflow:"hidden",
                cursor:"pointer",
                boxShadow:"0 2px 10px rgba(99,102,241,0.28)"
              }}
            >
              {storeProfile?.logo ? (
<img
src={`http://localhost:5001${storeProfile.logo}`}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>
) : (
                <div
                  style={{
                    width:"100%",
                    height:"100%",
                    background:T.grad,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    color:"#fff",
                    fontSize:13,
                    fontWeight:700
                  }}
                >
                  {storeProfile?.storeName?.charAt(0) || "S"}
                </div>
              )}
            </div>
            {showProfile && <ProfileDropdown onSettings={()=>onNavigate("settings")} onLogout={logout} onClose={()=>setShowProfile(false)}/>}
          </div>
  
          <button className="btn-primary" onClick={onQuickCampaign} style={{marginLeft:4}}>
            <span>⚡</span> Quick Campaign
          </button>
        </div>
      </header>
    );
  }


// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard",label:"Dashboard",icon:"⊞"},
  {id:"customers",label:"Customers",icon:"👥"},
  {id:"products",label:"Products",icon:"📦"},
  {id:"campaigns",label:"Campaigns",icon:"📣"},
  {id:"analytics",label:"Analytics",icon:"📊"},
  {id:"settings",label:"Settings",icon:"⚙️"},
];

function Sidebar({ activeTab, setActiveTab, storeProfile, customers = [], campaigns = [] }) {
  return (
    <aside style={{width:232,minHeight:"100vh",background:T.sidebar,borderRight:`1.5px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"22px 14px",position:"fixed",top:0,left:0,bottom:0,zIndex:50,boxShadow:"2px 0 16px rgba(99,102,241,0.06)"}}>
      <div style={{marginBottom:26,paddingLeft:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
          <div style={{width:33,height:33,borderRadius:10,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:"0 3px 10px rgba(99,102,241,0.3)"}}>📲</div>
          <span className="logo-text">StockAlert</span>
        </div>
        <span style={{fontSize:10.5,fontWeight:700,background:"#f0f0ff",color:T.accent,borderRadius:8,padding:"2px 9px",letterSpacing:".04em"}}>STORE ACCESS</span>
      </div>
      <nav style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
        {NAV.map(item=>(
          <div key={item.id} className={`nav-link${activeTab===item.id?" active":""}`} onClick={()=>setActiveTab(item.id)}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <span style={{flex:1}}>{item.label}</span>
            
            {item.id==="customers" && customers?.length>0 && (
              <span style={{
                fontSize:11,
                fontWeight:700,
                padding:"1px 7px",
                borderRadius:20,
                background:"#f0f0ff",
                color:"#6366f1"
              }}>
                {customers.length}
              </span>
            )}

            {item.id==="campaigns" && campaigns?.length>0 && (
              <span style={{
                fontSize:11,
                fontWeight:700,
                padding:"1px 7px",
                borderRadius:20,
                background:"#fffbeb",
                color:"#d97706"
              }}>
                {campaigns.length}
              </span>
            )}  
          </div>
        ))}
      </nav>
      <div style={{borderTop:`1.5px solid ${T.border}`,paddingTop:14,marginTop:10,display:"flex",flexDirection:"column",gap:10}}>
        <button style={{background:"#f5f6fa",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"8px 12px",fontSize:12.5,color:T.textB,cursor:"pointer",width:"100%",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'DM Sans',sans-serif",transition:"border .18s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.accentLight} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140,fontSize:12}}>{storeProfile?.storeName || "Store"}</span>
          <span style={{color:T.textM,fontSize:12}}>▾</span>
        </button>
        <div
          style={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            gap:6,
            padding:"12px",
            borderRadius:12,
            cursor:"pointer",
            background:"#f9f9fc"
          }}
          onClick={()=>setActiveTab("settings")}
        >
          <img
            src={
storeProfile?.logo
? `http://localhost:5001${storeProfile.logo}`
: "/store.png"
}
            style={{
              width:60,
              height:60,
              borderRadius:12,
              objectFit:"cover",
              border:"1.5px solid #eee"
            }}
          />
          <div style={{fontSize:13,fontWeight:600,color:T.textH}}>
{storeProfile?.storeName || "Store"}
</div>

<div style={{fontSize:11,color:T.textM}}>
{storeProfile?.ownerName || "Owner"}
</div>
        </div>
      </div>
    </aside>
  );
}

// ─── DASHBOARD HOME ───────────────────────────────────────────────────────────
function DashboardHome({ onNavigate, onCampaign, customers, products, campaigns }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const BAR_COLORS = {sent:"#6366f1",delivered:"#8b5cf6",read:"#a78bfa",clicked:"#c4b5fd"};
  const BAR_MAX = 520;
  const segments=[
    {name:"Diwali Shoppers",count:1240,color:"#6366f1",badge:"Festival"},
    {name:"VIP Customers",count:348,color:"#8b5cf6",badge:"Premium"},
    {name:"Inactive 30d",count:892,color:"#f59e0b",badge:"Win-back"},
    {name:"New This Month",count:213,color:"#10b981",badge:"Fresh"},
    {name:"Big Spenders",count:156,color:"#ec4899",badge:"High-val"},
  ];
  return (
    <div className="fade">
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:24}}>
        {[
          {label:"Total Customers",value:customers?.length || 0,icon:"👥",growth:"+12.4%",sub:"vs last month",nav:"customers"},
          {label:"Total Products",value:products?.length || 0,icon:"📦",growth:"+8.1%",sub:"3 stores",nav:"products"},
          {label:"Running Campaigns",value:campaigns?.length || 0,icon:"📣",growth:"2 scheduled",sub:"active now",nav:"campaigns"},
          {label:"Orders via WhatsApp",value:"₹3.2L",icon:"💬",growth:"+21.7%",sub:"this month",nav:"analytics"},
        ].map((m,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:T.r,padding:"22px 22px",boxShadow:T.shadow,border:`1.5px solid ${T.border}`,cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform="none";}}
            onClick={()=>onNavigate(m.nav)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{m.icon}</div>
              <span style={{fontSize:11.5,fontWeight:600,padding:"2px 9px",borderRadius:20,background:"#ecfdf5",color:"#059669"}}>{m.growth}</span>
            </div>
            <div className="metric-val" style={{marginBottom:4}}>{m.value}</div>
            <div style={{fontSize:13,fontWeight:600,color:T.textS}}>{m.label}</div>
            <div style={{fontSize:11.5,color:T.textM,marginTop:2}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:18,marginBottom:22}}>
        <div className="card" style={{padding:"24px 26px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div className="section-title">WhatsApp Campaign Analytics</div>
            <button className="btn-ghost" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>onNavigate("analytics")}>Full Report →</button>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
            {Object.entries(BAR_COLORS).map(([k,c])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.textS,fontWeight:500}}>
                <div style={{width:10,height:10,borderRadius:3,background:c}}/><span style={{textTransform:"capitalize"}}>{k}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:165,paddingBottom:22,position:"relative"}}>
            {[0,25,50,75,100].map(p=>(
              <div key={p} style={{position:"absolute",left:0,right:0,bottom:`${p*1.4+22}px`,borderTop:"1px dashed #f0f0fa",zIndex:0}}/>
            ))}
            {[].map((d,di)=>(
              <div key={d.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,zIndex:1}}>
                <div style={{display:"flex",alignItems:"flex-end",gap:2,height:140,width:"100%"}}>
                  {Object.entries(BAR_COLORS).map(([k,c])=>(
                    <div key={k} style={{flex:1,height:`${(d[k]/BAR_MAX)*140}px`,background:hoveredBar===`${di}-${k}`?c:c+"cc",borderRadius:"4px 4px 0 0",minHeight:3,transition:"opacity .18s",cursor:"pointer"}}
                      onMouseEnter={()=>setHoveredBar(`${di}-${k}`)} onMouseLeave={()=>setHoveredBar(null)} title={`${k}: ${d[k]}`}/>
                  ))}
                </div>
                <div style={{fontSize:11.5,color:T.textM,fontWeight:600}}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{padding:"22px 18px"}}>
          <div className="section-title">Quick Actions</div>
          {[
            {icon:"➕",label:"Add Customer",desc:"Import or create",color:"#6366f1",nav:"customers"},
            {icon:"📦",label:"Add Product",desc:"New inventory item",color:"#8b5cf6",nav:"products"},
            {icon:"📣",label:"New Campaign",desc:"Send to segment",color:"#a78bfa",action:onCampaign},
            {icon:"📊",label:"View Analytics",desc:"Reports & insights",color:"#10b981",nav:"analytics"},
          ].map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,cursor:"pointer",transition:"all .18s",border:`1.5px solid ${T.border}`,marginBottom:10}}
              onMouseEnter={e=>{e.currentTarget.style.background="#f5f3ff";e.currentTarget.style.borderColor="#c4b5fd";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.border;}}
              onClick={a.action || (()=>onNavigate(a.nav))}>
              <div style={{width:38,height:38,borderRadius:11,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{a.icon}</div>
              <div>
                <div style={{fontSize:13.5,fontWeight:600,color:T.textH}}>{a.label}</div>
                <div style={{fontSize:11.5,color:T.textM}}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card" style={{padding:"22px 22px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div className="section-title" style={{marginBottom:0}}>Customer Segments</div>
            <button className="btn-ghost" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>onNavigate("customers")}>View All →</button>
          </div>
          {segments.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<segments.length-1?`1px solid #f3f4f6`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:10,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:s.color}}/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.textH}}>{s.name}</div>
                  <div style={{fontSize:11.5,color:T.textM}}>{s.count.toLocaleString()} contacts</div>
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:20,background:s.color+"18",color:s.color}}>{s.badge}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:"22px 22px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div className="section-title" style={{marginBottom:0}}>Recent Campaigns</div>
            <button className="btn-ghost" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>onNavigate("campaigns")}>View All →</button>
          </div>
          <table>
            <thead><tr><th>Campaign</th><th>Status</th><th>Read%</th></tr></thead>
            <tbody>{(campaigns || []).slice(0,5).map((c,i)=>(
              <tr key={i}>
                <td style={{fontWeight:600,color:T.textH,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</td>
                <td><span className={`badge badge-${c.status==="sent"?"green":c.status==="scheduled"?"blue":"gray"}`} style={{fontSize:11}}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
                <td style={{fontWeight:600,color:c.readPct>0?"#059669":T.textM}}>{c.readPct>0?`${c.readPct}%`:"—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS VIEW ───────────────────────────────────────────────────────────
function CustomersView({ onAddOpen, customFields, customersLoading, setDeleteCustomer }) {
  const { customers, addToast, setCustomers } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [msgCustomer, setMsgCustomer] = useState(null);
  const [selectedCustomer,setSelectedCustomer]=useState(null);
  const [editCustomer,setEditCustomer]=useState(null);
  const [msgText, setMsgText] = useState("");

  const filtered = useMemo(()=>customers.filter(c=>{
  const ms = (c.name || "").toLowerCase().includes(search.toLowerCase())
  || (c.whatsapp || "").includes(search);
  const mf = filter==="all"||(filter==="vip"&&c.orders>=15)||(filter==="new"&&c.orders<=5);
  return ms&&mf;
}),[customers,search,filter]);
if(customersLoading){
  return (
    <div className="card" style={{padding:40,textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:10}}>⏳</div>
      <div style={{fontWeight:600}}>Loading customers...</div>
      <div style={{fontSize:13,color:"#6b7280",marginTop:6}}>
        Fetching data from server
      </div>
    </div>
  );
}
  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p style={{fontSize:13.5,color:T.textM,marginTop:4}}>{customers.length} total · {customers.filter(c=>c.orders>=15).length} VIP</p>
        </div>
        <button 
className="btn-primary" 
onClick={onAddOpen}
>➕ Add Customer</button>
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 18px",borderBottom:`1.5px solid ${T.border}`,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,maxWidth:300}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.textM}}>🔍</span>
            <input className="input" style={{paddingLeft:36}} placeholder="Search name or WhatsApp..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="select" style={{width:180}} value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Customers</option>
            <option value="vip">VIP (15+ orders)</option>
            <option value="new">New (≤5 orders)</option>
          </select>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button className="btn-secondary" onClick={()=>addToast("Export Started","Preparing your CSV...")}>📤 Export</button>
            <button className="btn-secondary" onClick={()=>addToast("Import Ready","Drag a CSV to import customers.")}>🔽 Import</button>
          </div>
        </div>
        <table>
         <thead>
<tr>
<th>Name</th>
<th>WhatsApp</th>
<th>Email</th>
<th>Address</th>

{customFields?.map(field=>(
<th key={field._id || field.name}>
{field.name}
</th>
))}

<th>Category</th>
<th>Actions</th>

</tr>
</thead>
          <tbody>{filtered.map((c,index)=>(
  <tr 
key={c._id || c.id || index}
onClick={()=>setSelectedCustomer(c)}
style={{cursor:"pointer"}}
>
              <td>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:35,height:35,borderRadius:"50%",background:`${c.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:c.color,flexShrink:0}}>{c.initials}</div>
                  <div>
                    <div style={{fontWeight:600,color:T.textH}}>{c.name}</div>
                    {c.tag==="vip"&&<span className="badge badge-purple" style={{fontSize:10,padding:"1px 7px"}}>VIP</span>}
                  </div>
                </div>
              </td>
              <td style={{fontFamily:"monospace"}}>{c.whatsapp}</td>
              <td>{c.email || "-"}</td>
              <td>{c.address || "-"}</td>

{customFields?.map(field=>(
<td key={field._id || field.name}>
{c.customFields?.[field._id] || "-"}
</td>
))}

<td>{c.category || "-"}</td>
              <td>
                <div style={{display:"flex",gap:6}}>
  <button 
    style={{background:"#f0f0ff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,color:"#6366f1",cursor:"pointer"}}
    onClick={(e)=>{
e.stopPropagation();
setMsgCustomer(c);
setMsgText("");
}}
  >
    💬 Message
  </button>

  <button 
    style={{background:"#fef2f2",border:"none",borderRadius:8,padding:"5px 10px",fontSize:12,color:"#dc2626",cursor:"pointer"}}
    onClick={(e)=>{
e.stopPropagation();
setDeleteCustomer(c);
}}
  >
    🗑 Delete
  </button>

</div>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0&&<div style={{padding:"40px",textAlign:"center",color:T.textM}}><div style={{fontSize:32,marginBottom:8}}>🔍</div><div style={{fontWeight:600}}>No customers found</div></div>}
        <div style={{padding:"12px 18px",borderTop:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:13,color:T.textM}}>Showing {filtered.length} of {customers.length}</span>
          <div style={{display:"flex",gap:6}}>
            {["‹","1","2","3","›"].map((p,i)=>(
              <button key={i} style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${i===1?T.accent:T.border}`,background:i===1?T.accent:"#fff",color:i===1?"#fff":T.textS,fontSize:13,fontWeight:600,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Send Message Modal */}
      <Modal open={!!msgCustomer} onClose={()=>setMsgCustomer(null)} title={`💬 Message ${msgCustomer?.name}`}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#f5f3ff",border:`1.5px solid #ddd6fe`,borderRadius:12,padding:"10px 14px",fontSize:13,color:T.textS}}>
            Sending via WhatsApp to <strong>{msgCustomer?.wa}</strong>
          </div>
          <textarea className="textarea" rows={4} placeholder="Type your message..." value={msgText} onChange={e=>setMsgText(e.target.value)}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn-ghost" onClick={()=>setMsgCustomer(null)}>Cancel</button>
            <button className="btn-primary" onClick={()=>{if(msgText){addToast("Message Sent!",`WhatsApp message delivered to ${msgCustomer?.name}`);setMsgCustomer(null);}}}>Send via WhatsApp</button>
          </div>
        </div>
      </Modal>

{/* CUSTOMER DETAIL MODAL */}
<AddCustomerModal
open={!!editCustomer}
onClose={()=>setEditCustomer(null)}
onSave={async(data)=>{

try{

await API.put(
"/customers/"+editCustomer._id,
data,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);

addToast("Customer updated",editCustomer.name);

setEditCustomer(null);

/* reload customers */

API.get("/customers?store="+localStorage.getItem("storeId"))
.then(res=>{

setCustomers(res.data.data || []);

});

}catch(err){

console.log(err);

addToast("Update failed","Try again",{type:"error"});

}

}}
customFields={customFields}
editData={editCustomer}
/>

<Modal 
open={!!selectedCustomer}
onClose={()=>setSelectedCustomer(null)}
title="Customer Details"
width={600}
className="fade"
>

{selectedCustomer && (


<div style={{
display:"flex",
flexDirection:"column",
gap:16,
position:"relative"
}}>

<button
className="btn-primary"
style={{alignSelf:"flex-end"}}
onClick={()=>{
setEditCustomer(selectedCustomer);
setSelectedCustomer(null);
}}
>
✏ Edit Customer
</button>

{/* BASIC DETAILS */}
<div style={{padding:4}}>

<div className="section-title" style={{marginBottom:12}}>
Basic Details
</div>

<div><b>Name :</b> {selectedCustomer.name}</div>

<div><b>WhatsApp :</b> {selectedCustomer.whatsapp}</div>

<div><b>Email :</b> {selectedCustomer.email || "-"}</div>

<div><b>Address :</b> {selectedCustomer.address || "-"}</div>

</div>

{/* CUSTOM FIELDS */}
{customFields?.length>0 && (

<div style={{
padding:4,
marginTop:10,
borderTop:"1.5px solid #eeeef8"
}}>

<div className="section-title" style={{marginBottom:12}}>
Additional Details
</div>

{customFields.map(field=>{

const value = selectedCustomer.customFields?.[field._id];

return(

<div key={field._id} style={{marginBottom:10}}>

<b>{field.name} :</b>{" "}

{field.type?.toLowerCase()==="fileqr" && value ? (

<img
src={`http://localhost:5001${value}`}
style={{
width:80,
height:80,
objectFit:"cover",
borderRadius:8,
border:"1px solid #eee",
marginTop:6
}}
/>

) : (

value || "-"

)}

</div>

);

})}

</div>

)}

</div>

)}

</Modal>
</div>
);
}

// ─── PRODUCTS VIEW ────────────────────────────────────────────────────────────
function ProductsView({ onAddOpen }) {
  const { products, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [catFilter, setCatFilter] = useState("all");
  const [editProduct, setEditProduct] = useState(null);

  const cats = ["all", ...new Set(products.map(p=>p.cat))];
  const filtered = products.filter(p=>{
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter==="all"||p.cat===catFilter;
    return ms&&mc;
  });

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p style={{fontSize:13.5,color:T.textM,marginTop:4}}>{products.length} products · {products.filter(p=>p.status==="in_stock").length} in stock</p>
        </div>
        <button className="btn-primary" onClick={onAddOpen}>➕ Add New Product</button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.textM}}>🔍</span>
          <input className="input" style={{paddingLeft:36,width:260}} placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="select" style={{width:190}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          {cats.map(c=><option key={c} value={c}>{c==="all"?"All Categories":c}</option>)}
        </select>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          {[["grid","⊞"],["list","☰"]].map(([v,ic])=>(
            <button key={v} onClick={()=>setViewMode(v)} style={{width:36,height:36,borderRadius:10,border:`1.5px solid ${viewMode===v?T.accent:T.border}`,background:viewMode===v?T.accent:"#fff",color:viewMode===v?"#fff":T.textS,cursor:"pointer",fontSize:16}}>{ic}</button>
          ))}
        </div>
      </div>
      {viewMode==="grid" ? (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
          {filtered.map(p=>(
            <div key={p.id} style={{background:"#fff",borderRadius:16,border:`1.5px solid ${T.border}`,padding:16,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor="#c4b5fd";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=T.border;}}>
              <div style={{height:100,borderRadius:12,background:"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:12}}>{p.emoji}</div>
              <div style={{fontSize:13.5,fontWeight:700,color:T.textH,marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:14,fontWeight:700,color:T.accent}}>{p.price}</span>
                <span className={`badge badge-${p.status==="in_stock"?"green":"red"}`} style={{fontSize:10.5}}>{p.status==="in_stock"?"In Stock":"Out"}</span>
              </div>
              <div style={{fontSize:11.5,color:T.textM,marginBottom:12}}>{p.cat} · SKU: {p.sku}</div>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,padding:"7px 0",borderRadius:10,border:`1.5px solid #ededfc`,background:"#f5f3ff",color:T.accent,fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setEditProduct(p)}>Edit</button>
                <button style={{flex:1,padding:"7px 0",borderRadius:10,background:T.grad,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>addToast("Link Copied!",`Share link for ${p.name} copied.`)}>📤 Share</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(p=>(
              <tr key={p.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.emoji}</div>
                  <span style={{fontWeight:600,color:T.textH}}>{p.name}</span>
                </div></td>
                <td style={{fontFamily:"monospace",fontSize:12.5,color:T.textM}}>{p.sku}</td>
                <td><span style={{fontSize:12.5,background:"#f5f6fa",padding:"3px 10px",borderRadius:8,color:T.textS}}>{p.cat}</span></td>
                <td style={{fontWeight:700,color:T.accent}}>{p.price}</td>
                <td style={{fontWeight:600,color:p.stock>0?"#059669":T.red}}>{p.stock>0?p.stock:"—"}</td>
                <td><span className={`badge badge-${p.status==="in_stock"?"green":"red"}`}>{p.status==="in_stock"?"In Stock":"Out of Stock"}</span></td>
                <td><div style={{display:"flex",gap:6}}>
                  <button style={{background:"#f0f0ff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,color:T.accent,cursor:"pointer"}} onClick={()=>setEditProduct(p)}>Edit</button>
                  <button style={{background:"#f9f9fc",border:"none",borderRadius:8,padding:"5px 10px",fontSize:12,color:T.textS,cursor:"pointer"}} onClick={()=>addToast("Link Copied!",`Share link for ${p.name} copied.`)}>📤</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal open={!!editProduct} onClose={()=>setEditProduct(null)} title={`✏️ Edit: ${editProduct?.name}`}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label className="label">Product Name</label><input className="input" defaultValue={editProduct?.name}/></div>
            <div><label className="label">Price</label><input className="input" defaultValue={editProduct?.price}/></div>
            <div><label className="label">Stock Qty</label><input className="input" type="number" defaultValue={editProduct?.stock}/></div>
            <div><label className="label">Status</label><select className="select" defaultValue={editProduct?.status}>
              <option value="in_stock">In Stock</option><option value="out_stock">Out of Stock</option>
            </select></div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn-ghost" onClick={()=>setEditProduct(null)}>Cancel</button>
            <button className="btn-primary" onClick={()=>{addToast("Product Updated!",`${editProduct?.name} saved.`);setEditProduct(null);}}>Save Changes</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── CAMPAIGNS VIEW ───────────────────────────────────────────────────────────
function CampaignsView({ onAddOpen }) {
  const { campaigns, addToast } = useApp();
  const [filter, setFilter] = useState("all");
  const [reportCampaign, setReportCampaign] = useState(null);
  const statusMap = {sent:"green",scheduled:"blue",draft:"gray"};
  const filtered = campaigns.filter(c=>filter==="all"||c.status===filter);

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <h1 className="page-title">WhatsApp Campaigns</h1>
          <p style={{fontSize:13.5,color:T.textM,marginTop:4}}>{campaigns.filter(c=>c.status==="sent").length} sent · {campaigns.filter(c=>c.status==="scheduled").length} scheduled · {campaigns.filter(c=>c.status==="draft").length} drafts</p>
        </div>
        <button className="btn-primary" onClick={onAddOpen}>✨ Create Campaign</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:22}}>
        {[
          {label:"Total Campaigns",value:campaigns.length,icon:"📣",color:"#6366f1"},
          {label:"Total Audience",value:"8,338",icon:"👥",color:"#8b5cf6"},
          {label:"Avg Read Rate",value:"67%",icon:"👁️",color:"#10b981"},
          {label:"Total Clicks",value:campaigns.reduce((a,c)=>a+c.clicked,0).toLocaleString(),icon:"🔗",color:"#ec4899"},
        ].map((m,i)=>(
          <div key={i} className="card" style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,borderRadius:12,background:m.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:700,color:T.textH,fontFamily:"'Sora',sans-serif"}}>{m.value}</div>
              <div style={{fontSize:12,color:T.textM,fontWeight:500}}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderBottom:`1.5px solid ${T.border}`,flexWrap:"wrap"}}>
          {["all","sent","scheduled","draft"].map(f=>(
            <button key={f} className={`tab-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
              {f!=="all"&&<span style={{marginLeft:5,fontSize:11,opacity:.8}}>({campaigns.filter(c=>c.status===f).length})</span>}
            </button>
          ))}
          <div style={{marginLeft:"auto"}}>
            <button className="btn-secondary" onClick={()=>addToast("Report Exported","Campaign report downloading...")}>📊 Export</button>
          </div>
        </div>
        
        {filtered.map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",padding:"14px 18px",borderBottom:`1px solid #f5f5fc`,gap:12,transition:"background .14s",cursor:"default"}}
            onMouseEnter={e=>e.currentTarget.style.background="#fafafe"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#f0f0ff,#e8e8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
              {c.status==="sent"?"✅":c.status==="scheduled"?"🗓️":"📝"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:T.textH,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
              <div style={{fontSize:12,color:T.textM,marginTop:2}}>{c.date}</div>
            </div>
            <div style={{width:110,textAlign:"center"}}><span className={`badge badge-${statusMap[c.status]}`}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></div>
            <div style={{width:100,textAlign:"center"}}>
              <div style={{fontSize:13.5,fontWeight:700,color:T.textH}}>{c.audience>0?c.audience.toLocaleString():"—"}</div>
              <div style={{fontSize:11,color:T.textM}}>audience</div>
            </div>
            <div style={{width:140}}>
              {c.status==="sent"?(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11.5,color:T.textS,fontWeight:500}}>Read Rate</span>
                    <span style={{fontSize:12,fontWeight:700,color:T.accent}}>{c.readPct}%</span>
                  </div>
                  <div className="progress-bg"><div className="progress-fill" style={{width:`${c.readPct}%`}}/></div>
                </>
              ):<span style={{fontSize:12,color:T.textM}}>—</span>}
            </div>
            <div style={{width:70,textAlign:"center"}}>
              <div style={{fontSize:13.5,fontWeight:700,color:c.clicked>0?"#059669":T.textM}}>{c.clicked>0?c.clicked:"—"}</div>
              <div style={{fontSize:11,color:T.textM}}>clicks</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {c.status==="draft"&&<button style={{padding:"5px 13px",borderRadius:9,background:T.accent,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={onAddOpen}>Edit</button>}
              {c.status==="scheduled"&&<button style={{padding:"5px 13px",borderRadius:9,background:"#eff6ff",border:`1.5px solid #bfdbfe`,color:"#2563eb",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>addToast("Edit Mode","Editing scheduled campaign.")}>Modify</button>}
              {c.status==="sent"&&<button style={{padding:"5px 13px",borderRadius:9,background:"#f0fdf4",border:`1.5px solid #a7f3d0`,color:"#059669",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setReportCampaign(c)}>Report</button>}
              <button style={{padding:"5px 10px",borderRadius:9,background:"#f9f9fc",border:"none",color:T.textS,fontSize:12,cursor:"pointer"}} onClick={()=>addToast("Options","Campaign options menu.")}>⋯</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!reportCampaign} onClose={()=>setReportCampaign(null)} title={`📊 Report: ${reportCampaign?.name}`} width={560}>
        {reportCampaign&&<div style={{
display:"flex",
flexDirection:"column",
gap:20,
paddingTop:5
}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[{l:"Audience",v:reportCampaign.audience.toLocaleString(),c:"#6366f1"},{l:"Read Rate",v:`${reportCampaign.readPct}%`,c:"#10b981"},{l:"Clicks",v:reportCampaign.clicked,c:"#ec4899"}].map((s,i)=>(
              <div key={i} style={{background:s.c+"10",borderRadius:14,padding:"14px 16px",textAlign:"center",border:`1.5px solid ${s.c}22`}}>
                <div style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'Sora',sans-serif"}}>{s.v}</div>
                <div style={{fontSize:12,color:T.textS,fontWeight:500,marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#f5f6fa",borderRadius:12,padding:"12px 14px"}}>
            <div style={{fontSize:12.5,fontWeight:600,color:T.textS,marginBottom:6}}>Message Sent</div>
            <div style={{fontSize:13.5,color:T.textB,lineHeight:1.6}}>{reportCampaign.msg}</div>
          </div>
          <button className="btn-primary" style={{justifyContent:"center"}} onClick={()=>setReportCampaign(null)}>Close Report</button>
        </div>}
      </Modal>
    </div>
  );
}

// ─── ANALYTICS VIEW ───────────────────────────────────────────────────────────
function AnalyticsView() {
  const { campaigns } = useApp();
  const [dateRange, setDateRange] = useState("last30");
  const topCampaigns = campaigns.filter(c=>c.status==="sent").sort((a,b)=>b.readPct-a.readPct);
  const kpis = [
    {label:"Messages Sent",value:"18,420",change:"+14%",icon:"📤",color:"#6366f1"},
    {label:"Delivery Rate",value:"95.8%",change:"+2.1%",icon:"✅",color:"#10b981"},
    {label:"Avg Read Rate",value:"67.3%",change:"+8.5%",icon:"👁️",color:"#8b5cf6"},
    {label:"Conversions",value:"1,712",change:"+22%",icon:"🛒",color:"#ec4899"},
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:T.shadowMd,fontSize:13}}>
        <div style={{fontWeight:700,color:T.textH,marginBottom:6}}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{color:p.color,fontWeight:600}}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <h1 className="page-title">Analytics & Insights</h1>
          <p style={{fontSize:13.5,color:T.textM,marginTop:4}}>Performance data across all campaigns and customers</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[["last7","Last 7 days"],["last30","Last 30 days"],["last90","Last 90 days"]].map(([v,l])=>(
            <button key={v} className={`tab-btn${dateRange===v?" active":""}`} onClick={()=>setDateRange(v)} style={{padding:"8px 16px",fontSize:13}}>{l}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:24}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:T.r,padding:"20px 22px",boxShadow:T.shadow,border:`1.5px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:k.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{k.icon}</div>
              <span style={{fontSize:11.5,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#ecfdf5",color:"#059669"}}>{k.change}</span>
            </div>
            <div className="metric-val" style={{marginBottom:4}}>{k.value}</div>
            <div style={{fontSize:13,fontWeight:600,color:T.textS}}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
        <div className="card" style={{padding:"22px 22px"}}>
          <div className="section-title" style={{marginBottom:18}}>Message Delivery Rate</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaigns || []} barSize={14} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:12,fill:T.textM}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:T.textM}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{fontSize:12,paddingTop:8}}/>
              <Bar dataKey="sent" name="Sent" fill="#6366f1" radius={[4,4,0,0]} fillOpacity={0.9}/>
              <Bar dataKey="delivered" name="Delivered" fill="#8b5cf6" radius={[4,4,0,0]} fillOpacity={0.8}/>
              <Bar dataKey="read" name="Read" fill="#a78bfa" radius={[4,4,0,0]} fillOpacity={0.7}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:"22px 22px"}}>
          <div className="section-title" style={{marginBottom:18}}>Customer Growth (30 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
           <AreaChart data={(campaigns || []).filter((_ ,i)=>i%3===0)}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:12,fill:T.textM}} axisLine={false} tickLine={false} label={{value:"Day",position:"insideBottom",offset:-2,style:{fill:T.textM,fontSize:11}}}/>
              <YAxis tick={{fontSize:12,fill:T.textM}} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="customers" name="Total Customers" stroke="#6366f1" strokeWidth={2.5} fill="url(#cg)" dot={false} activeDot={{r:5,fill:"#6366f1"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Customers Bar Chart */}
      <div className="card" style={{padding:"22px 22px",marginBottom:22}}>
        <div className="section-title" style={{marginBottom:18}}>Daily New Customer Signups</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={(campaigns || []).filter((_,i)=>i%2===0)} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:11,fill:T.textM}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:T.textM}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="new" name="New Customers" radius={[4,4,0,0]}>
              {(campaigns || []).filter((_,i)=>i%2===0).map((_,i)=>(
                <rect key={i} fill={`hsl(${250+i*3},75%,${60+i%10}%)`}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Campaigns Table */}
      <div className="card">
        <div style={{padding:"18px 22px",borderBottom:`1.5px solid ${T.border}`}}>
          <div className="section-title" style={{marginBottom:0}}>Top Performing Campaigns</div>
        </div>
        <table>
          <thead><tr><th>Campaign</th><th>Date</th><th>Audience</th><th>Open Rate</th><th>Link Clicks</th><th>CTR</th></tr></thead>
          <tbody>{topCampaigns.map((c,i)=>(
            <tr key={i}>
              <td>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:6,height:36,borderRadius:3,background:T.grad,flexShrink:0}}/>
                  <div style={{fontWeight:600,color:T.textH}}>{c.name}</div>
                </div>
              </td>
              <td style={{color:T.textM,fontSize:12.5}}>{c.date}</td>
              <td style={{fontWeight:600}}>{c.audience.toLocaleString()}</td>
              <td>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,maxWidth:80,background:"#f0f0ff",borderRadius:20,height:7,overflow:"hidden"}}>
                    <div style={{width:`${c.readPct}%`,height:"100%",borderRadius:20,background:T.grad}}/>
                  </div>
                  <span style={{fontWeight:700,color:T.accent,fontSize:13}}>{c.readPct}%</span>
                </div>
              </td>
              <td style={{fontWeight:700,color:"#059669"}}>{c.clicked.toLocaleString()}</td>
              <td><span className="badge badge-green" style={{fontSize:11}}>{((c.clicked/c.audience)*100).toFixed(1)}%</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function StoreDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [storeProfile,setStoreProfile] = useState(null);
  useEffect(()=>{

API.get("/auth/store-profile")
.then(res=>{

setStoreProfile(res.data.store);

})
.catch(err=>{

console.log("Profile load error",err);

});

},[]);
  const [toasts, setToasts] = useState([]);
  const [customFields,setCustomFields] = useState([]);
  const [notifs, setNotifs] = useState([]);
  
  // Modals
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const openAddCustomer = ()=>{
console.log("ADD CLICKED");

setShowAddCustomer(prev=>true);

}
  const [deleteCustomer,setDeleteCustomer] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateCampaign,setShowCreateCampaign]=useState(false); 
  const [showCustomFieldBuilder, setShowCustomFieldBuilder] = useState(false);
  
  const addToast = useCallback((title, body, opts={}) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, {id, title, body, type: opts.type||"success"}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  const markAllRead = useCallback(() => setNotifs(n => n.map(x => ({...x, read:true}))), []);
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    window.history.replaceState(null,null,"/login");
    window.location.replace("/Landing");
  }, []);
  
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("storeId");
  
  useEffect(()=>{

if(storeId){

loadCustomFields();

}

},[]);

  const loadCustomFields = async () => {
    console.log("STORE ID:",storeId);

  try{

    const res = await API.get("/customers/custom-fields",{
      headers:{
        storeId: storeId
      }
    });

    console.log("FIELDS:",res.data);

const fieldsData = res?.data || [];

setCustomFields(Array.isArray(fieldsData) ? fieldsData : []);
  }catch(err){

    console.log("Custom field error",err);

  }
};
  
  const fetchStoreProfile = async()=>{
    try{
      const storeId = localStorage.getItem("storeId");
      //const res = await API.get("/stores/"+storeId);
      //setStoreProfile(res.data);
    }catch(e){
      console.log(e);
    }
  };
  
  useEffect(()=>{
    fetchStoreProfile();

    setCustomersLoading(true);

API.get("/customers?store="+storeId)
.then(res=>{
  setCustomers(res.data.data || []);
})
.catch(err=>{
  setCustomers([]);
})
.finally(()=>{
  setCustomersLoading(false);
});

    API.get("/campaigns")
    .then(res=>{
      setCampaigns(res.data.data || []);
    })
    .catch(err=>{
      console.error(err);
    });

  },[]);

  const handleAddCustomer = async (data) => {

try{

const res = await API.post("/customers", data,{
headers:{
"Content-Type":"multipart/form-data"
}
});

const savedCustomer = res?.data?.customer || {};

const customerName = savedCustomer?.name || "Customer";

const initials = customerName
.split(" ")
.map(w=>w[0])
.join("")
.slice(0,2)
.toUpperCase();

const colors=[
"#6366f1",
"#8b5cf6",
"#ec4899",
"#10b981",
"#f59e0b",
"#3b82f6"
];

setCustomers(c=>[...c,{
...savedCustomer,
name:customerName,
customFields:savedCustomer.customFields || {},
initials,
color:colors[Math.floor(Math.random()*colors.length)],
orders:0,
spent:"₹0",
last:"Just now"
}]);

addToast("Customer Added!",customerName+" saved");

}catch(err){

console.log(err);

addToast("Error","Customer not saved",{type:"error"});

}

};

  const handleAddProduct = (data) => {
    setProducts(p => [...p, data]);
    addToast("Product Added!", `${data.name} is now in your catalog.`);
  };

  const handleCreateCampaign = async (data) => {
    console.log("CAMPAIGN DATA:", data);
    try {
      await API.post("/campaigns", {
        name: data.name,
        message: data.msg,
        productId: "null",
        filters: {}
      });

      setCampaigns(c => [...c, {...data, id: Date.now()}]);
      addToast("Campaign Created!", `${data.name} ${data.scheduled ? "scheduled" : "sent"} successfully.`);
    } catch(err) {
      console.log(err);
      addToast("Error", "Failed to create campaign", { type: "error" });
    }
  };
const handleDeleteCustomer = async (customer) => {

try{

await API.delete("/customers/" + (customer._id || customer.id),{
  headers:{
    storeid: storeId,
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});

setCustomers(prev =>
prev.filter(c => c._id !== customer._id)
);

addToast("Customer deleted",customer.name);

}catch(err){

console.log(err);

addToast("Delete failed","Try again",{type:"error"});

}

};
 
  const ctx = {
notifs,
markAllRead,
addToast,
logout,
customers,
setCustomers,
products,
campaigns,
storeProfile,
setStoreProfile,
customFields
};

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":  return <DashboardHome onNavigate={setActiveTab} onCampaign={()=>setShowCreateCampaign(true)} customers={customers} products={products} campaigns={campaigns} />;
      case "customers":
return (
  <CustomersView 
  onAddOpen={openAddCustomer}
  customFields={customFields}
  customersLoading={customersLoading}
  setDeleteCustomer={setDeleteCustomer}
/>
);
      case "products":   return <ProductsView onAddOpen={()=>setShowAddProduct(true)}/>;
      case "campaigns":  return <CampaignsView onAddOpen={()=>setShowCreateCampaign(true)}/>;
      case "analytics":  return <AnalyticsView/>;
      case "settings":   return <SettingsView openCustomFields={()=>setShowCustomFieldBuilder(true)}/>;
      default:           return <DashboardHome onNavigate={setActiveTab} onCampaign={()=>setShowCreateCampaign(true)} customers={customers} products={products} campaigns={campaigns} />;
    }
  };

  return (
    <AppCtx.Provider value={ctx}>
      <div>
        <style>{CSS}</style>
        <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif"}}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} storeProfile={storeProfile || {}} customers={customers} campaigns={campaigns} />
          <div style={{marginLeft:232,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
            <Header activeTab={activeTab} onNavigate={setActiveTab} onQuickCampaign={()=>setShowCreateCampaign(true)} storeProfile={storeProfile || {}}/>
            <main style={{padding:"26px 30px",flex:1,overflowY:"auto"}}>
              {renderView()}
            </main>
          </div>
        </div>
      </div>

      {/* Global Modals */}
     <AddCustomerModal
open={showAddCustomer}
onClose={()=>setShowAddCustomer(false)}
onSave={handleAddCustomer}
customFields={customFields}
/>
{deleteCustomer && (
<div className="modal-overlay"> 
<div className="modal-box" style={{width:"420px",padding:"24px"}}>

<div style={{fontSize:18,fontWeight:700,marginBottom:10}}>
Delete Customer
</div>

<div style={{color:"#6b7280",marginBottom:20}}>
Are you sure you want to delete <b>{deleteCustomer.name}</b>?
</div>

<div style={{
display:"flex",
justifyContent:"flex-end",
gap:10,
marginTop:20
}}>

<button
className="btn-ghost"
onClick={()=>setDeleteCustomer(null)}
>
Cancel
</button>

<button
className="btn-primary"
style={{background:"#ef4444"}}
onClick={async ()=>{
await handleDeleteCustomer(deleteCustomer);
setDeleteCustomer(null);
}}
>
Delete
</button>

</div>

</div>
</div>
)}
      <AddProductModal
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSave={handleAddProduct}
      />
      <CreateCampaignModal 
        open={showCreateCampaign}
        onClose={()=>setShowCreateCampaign(false)}
        onSave={handleCreateCampaign}
      />
{showCustomFieldBuilder && (
   <CustomFieldBuilder 
customFields={customFields}

onAddField={async(name,type,options,required)=>{

await API.post("/customers/custom-fields",{
name,
type,
options,
required,
store:storeId
});

await loadCustomFields();

}}

onUpdateField={async(id,name)=>{

await API.put("/customers/custom-fields/"+id,{
name
});

await loadCustomFields();

}}

onDeleteField={async(id)=>{

await API.delete("/customers/custom-fields/"+id);

await loadCustomFields();

}}

onClose={async ()=>{
setShowCustomFieldBuilder(false);
await loadCustomFields();
}}
/>
)}

      <ToastContainer toasts={toasts} dismiss={dismissToast}/>
    </AppCtx.Provider>
  );
}
