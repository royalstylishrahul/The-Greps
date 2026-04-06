import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const MiniDashboard = () => (
  <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="w-full">
    {/* Header bar */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-white text-xs font-semibold opacity-90">Campaign Overview</div>
        <div className="text-white/50 text-xs">March 2025</div>
      </div>
      <div className="bg-white/10 rounded-lg px-3 py-1.5">
        <span className="text-white/80 text-xs">This Month ▾</span>
      </div>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { label: "Messages Sent", value: "12,480", change: "+18%", color: "from-blue-400/20 to-blue-600/20" },
        { label: "Store Visits", value: "3,241", change: "+34%", color: "from-purple-400/20 to-purple-600/20" },
        { label: "Orders", value: "847", change: "+22%", color: "from-indigo-400/20 to-indigo-600/20" },
      ].map((s, i) => (
        <div key={i} className={`bg-gradient-to-br ${s.color} border border-white/10 rounded-xl p-2.5`}>
          <div className="text-white/50 text-xs mb-1">{s.label}</div>
          <div className="text-white font-bold text-sm">{s.value}</div>
          <div className="text-emerald-400 text-xs font-medium">{s.change}</div>
        </div>
      ))}
    </div>

    {/* Mini bar chart */}
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
      <div className="text-white/60 text-xs mb-3">WhatsApp Campaign Performance</div>
      <div className="flex items-end gap-1.5 h-16">
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 10 || i === 11
                  ? "linear-gradient(to top, #6366f1, #a78bfa)"
                  : "rgba(255,255,255,0.15)"
              }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Recent campaigns */}
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="text-white/60 text-xs mb-2.5">Recent Campaigns</div>
      {[
        { name: "Diwali Flash Sale", sent: "2,400", open: "68%", dot: "bg-emerald-400" },
        { name: "Restock Alert - Kurtas", sent: "1,850", open: "54%", dot: "bg-blue-400" },
        { name: "Weekend Offer", sent: "980", open: "71%", dot: "bg-purple-400" },
      ].map((c, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            <span className="text-white/80 text-xs">{c.name}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-white/40 text-xs">{c.sent}</span>
            <span className="text-emerald-400 text-xs font-medium">{c.open}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function StoreAuth({setPage}) {

const location = useLocation();
const navigate = useNavigate();

const [mode, setMode] = useState(
  location.search.includes("signup") ? "signup" : "login"
);

const [showPass, setShowPass] = useState(false);   // ← ye missing hai
const [isTransitioning, setIsTransitioning] = useState(false);
const [formVisible, setFormVisible] = useState(true);
const [form, setForm] = useState({ 
storeName: "", 
ownerName: "",
whatsapp: "", 
email: "", 
password: "" 
});
const [errors, setErrors] = useState({});
const [focused, setFocused] = useState("");
const [authError, setAuthError] = useState("");
const [otpSent,setOtpSent] = useState(false);

const [otp,setOtp] = useState("");

const [otpError,setOtpError] = useState("");
const [otpTimer,setOtpTimer] = useState(30);

const [canResend,setCanResend] = useState(false);
const handleVerifyOtp = async ()=>{
  

if(otp.length!==6){

setOtpError("Enter valid OTP");

return;

}

try{

const response =
await API.post("/auth/reset-password",{
email:form.email,
otp:otp,
storeName:form.storeName,
ownerName:form.ownerName,
phone: mode==="signup" ? form.whatsapp : "9999999999",
password:form.password,
purpose: mode   
});

if(response.data.success){

if(mode==="forgot"){

setOtpSent(false);

setMode("reset");

return;

}

localStorage.setItem(
"token",
response.data.token
);

localStorage.setItem(
"storeId",
response.data.store?._id ||
response.data.store?.id ||
response.data.storeId
);

navigate("/dashboard");

}

}catch(error){

setOtpError(

error.response?.data?.message ||

"OTP verification failed"

);

}

};
useEffect(()=>{

validate();

},[form]);
useEffect(()=>{

if(!otpSent) return;

if(otpTimer===0){

setCanResend(true);

return;

}

const timer =
setTimeout(()=>{

setOtpTimer(otpTimer-1);

},1000);

return ()=> clearTimeout(timer);

},[otpTimer,otpSent]);
const validate = ()=>{

const newErrors = {};

if(mode === "signup"){

if(!form.storeName){
newErrors.storeName = "Store name required";
}
if(!form.ownerName){
newErrors.ownerName = "Owner name required";
}

if(!form.whatsapp){
newErrors.whatsapp = "WhatsApp number required";
}else if(!/^[6-9]\d{9}$/.test(form.whatsapp)){
newErrors.whatsapp = "Invalid phone number";
}

}

if(!form.email){
newErrors.email = "Email required";
}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){
newErrors.email = "Invalid email";
}

if(mode!=="forgot"){

if(!form.password){
newErrors.password = "Password required";
}
else if(form.password.length < 8){
newErrors.password = "Min 8 characters";
}

}

setErrors(newErrors);

return Object.keys(newErrors).length === 0;

};
const switchMode = (newMode) => {

  if(newMode === mode) return;

  setIsTransitioning(true);
  setFormVisible(false);

  setTimeout(()=>{

    setMode(newMode);

    setErrors({});

    setForm({
storeName:"",
ownerName:"",
whatsapp:"",
email:"",
password:""
});

    setFormVisible(true);
    setIsTransitioning(false);

  },280);

};
  
 const handleSubmit = async ()=>{

setAuthError("");

if(!validate()) return;

if(mode==="signup" || mode==="forgot"){

try{

await API.post("/otp/send-otp",{
 email:form.email,
 phone: form.whatsapp || "9999999999",
 purpose: mode
});

setOtpSent(true);
setOtpTimer(30);
setCanResend(false);

}catch(error){

setAuthError("Failed to send OTP");

}

return;

}
if(mode==="reset"){

try{

await API.post("/auth/verify-otp",{
email:form.email,
password:form.password

});

setMode("login");

setOtp("");

setOtpSent(false);

setAuthError("Password reset successful. Please login.");

}catch(error){

setAuthError("Password reset failed");

}

return;

}

try{

const data =
mode === "signup"
? {
storeName: form.storeName,
ownerName: form.ownerName,
email: form.email,
phone: form.whatsapp,
password: form.password
}
: {
email: form.email,
password: form.password
};

const endpoint =
mode === "signup"
? "/auth/signup"
: "/auth/login";

const response =
await API.post(endpoint,data);

if(response.data.success){

localStorage.setItem(
"token",
response.data.token
);

localStorage.setItem(
"storeId",
response.data.store?.id || response.data.storeId
);

navigate("/dashboard");

}

}catch(error){

console.log(error);

const message =
error.response?.data?.message || "";

if(message.includes("Email")){

setErrors({
...errors,
email:message
});

}
else if(message.includes("phone")){

setErrors({
...errors,
whatsapp:message
});

}
else{

setAuthError(
mode==="signup"
? "Signup failed"
: "Login failed"
);

}

}

};

    const inputClass = (field) => {
    const base = "w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200";
    const focus = focused === field ? "border-violet-400 ring-3 ring-violet-100 bg-white shadow-sm" : "";
    const error = errors[field] ? "border-red-300 ring-3 ring-red-50 bg-red-50/30" : "border-slate-200";
    return `${base} ${focused === field ? focus : error}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .ring-3 { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
        .form-slide-in { animation: slideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .form-slide-out { animation: slideOut 0.28s cubic-bezier(0.4, 0, 1, 1) forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
        .dashboard-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .gradient-text { background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gradient-btn { background: linear-gradient(135deg, #4f46e5, #7c3aed); transition: all 0.2s; }
        .gradient-btn:hover { background: linear-gradient(135deg, #4338ca, #6d28d9); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35); transform: translateY(-1px); }
        .gradient-btn:active { transform: translateY(0); }
        .tab-active { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04); }
        .right-panel { background: linear-gradient(145deg, #312e81 0%, #4f46e5 30%, #7c3aed 65%, #6d28d9 100%); }
        .mesh-overlay { background: radial-gradient(ellipse at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 50%); }
        .testimonial-card { backdrop-filter: blur(16px); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); }
        .google-btn:hover { background: #f8fafc; border-color: #c7d2fe; }
        input[type="password"]::-ms-reveal { display: none; }
      `}</style>

     <div className="min-h-screen flex bg-red-500 text-white text-3xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* ── LEFT PANEL ── */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <BellIcon />
            </div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "1rem" }} className="text-slate-800">
              The Greps <span className="gradient-text">CRM</span>
            </span>
          </div>

          {/* Form container */}
          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
            {/* Heading */}
            <div className="mb-8">
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "1.75rem", lineHeight: 1.2 }} className="text-slate-900 mb-2">
                {
mode === "login"
? "Welcome back 👋"
: mode === "signup"
? "Start for free today"
: "Reset your password"
}
              </h1>
              <p className="text-slate-500 text-sm">
                {
mode === "login"
? "Sign in to manage your store campaigns"
: mode === "signup"
? "Join 12,000+ store owners using The Greps"
: "Enter your email to reset password"
}
              </p>
            </div>

            {/* Toggle tabs */}
{!otpSent && mode !== "forgot" && mode !== "reset" && (

<div className="flex bg-slate-100 rounded-xl p-1 mb-7 gap-1">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === m ? "tab-active text-slate-800" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>
)}
            {/* Form fields */}
            <div className={formVisible ? "form-slide-in" : "form-slide-out"}>
              {otpSent && (
<div className="space-y-4">

<div>

<label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
Enter OTP
</label>

<input

className={inputClass("otp")}

placeholder="Enter 6 digit OTP"

value={otp}

onChange={(e)=>{

const clean =
e.target.value.replace(/\D/g,'');

setOtp(clean);

if(otpError && clean.length===6){

setOtpError("");

}

}}

maxLength={6}

/>

{otpError && (

<p className="text-red-500 text-xs mt-1.5">

{otpError}

</p>

)}

</div>

<button

onClick={handleVerifyOtp}

type="button"

disabled={otp.length!==6}

className={`gradient-btn w-full mt-4 py-3.5 rounded-xl text-white text-sm font-semibold

${otp.length!==6
? "opacity-50 cursor-not-allowed"
: ""
}

`}

>

Verify OTP →

</button>
<div className="text-center mt-3">

{!canResend ? (

<p className="text-xs text-slate-500">

Resend OTP in {otpTimer}s

</p>

):(

<button

onClick={handleSubmit}

className="text-xs text-violet-600 font-medium hover:underline"

>

Resend OTP

</button>

)}

</div>

</div>

)}
              {!otpSent && mode!=="reset" && (
<div className="space-y-4">
                {mode === "signup" && mode !== "forgot" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Store Name</label>
                      <input
                        className={inputClass("storeName")}
                        placeholder="e.g. Sharma Fashion House"
                        value={form.storeName}
                        onChange={(e) => {

setForm({
...form,
storeName:e.target.value
});

if(errors.storeName && e.target.value){
setErrors({
...errors,
storeName:""
});
}

}}
                        onFocus={() => setFocused("storeName")}
                        onBlur={() => setFocused("")}
                      />
                      {errors.storeName && <p className="text-red-500 text-xs mt-1.5">{errors.storeName}</p>}
                    </div>
                    <div>
<label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
Owner Name
</label>

<input
className={inputClass("ownerName")}
placeholder="e.g. Rahul Sharma"
value={form.ownerName}
onChange={(e)=>{

setForm({
...form,
ownerName:e.target.value
});

if(errors.ownerName && e.target.value){
setErrors({
...errors,
ownerName:""
});
}

}}
onFocus={() => setFocused("ownerName")}
onBlur={() => setFocused("")}
/>

{errors.ownerName && (
<p className="text-red-500 text-xs mt-1.5">
{errors.ownerName}
</p>
)}

</div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">WhatsApp Number</label>
                      <input
                        className={inputClass("whatsapp")}
                        placeholder="+91 98765 43210"
                        value={form.whatsapp}
                        onChange={(e)=>{

const clean =
e.target.value.replace(/\D/g,'');

setForm({
...form,
whatsapp:clean
});

if(errors.whatsapp && clean.length===10){

setErrors({
...errors,
whatsapp:""
});

}

}}
                        onFocus={() => setFocused("whatsapp")}
                        onBlur={() => setFocused("")}
                      />
                      {errors.whatsapp && <p className="text-red-500 text-xs mt-1.5">{errors.whatsapp}</p>}
                    </div>
                  </>
                )}

                <div>
  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
    {mode === "login" ? "Email / WhatsApp Number" : "Email Address"}
  </label>

  <input
    className={inputClass("email")}
    placeholder={mode === "login" ? "email@store.com or +91 98765..." : "email@store.com"}
    value={form.email}
    disabled={otpSent}
    onChange={(e)=>{
      if(otpSent) return;

      setForm({
        ...form,
        email:e.target.value
      });

      const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(errors.email && emailRegex.test(e.target.value)){
        setErrors({
          ...errors,
          email:""
        });
      }
    }}
    onFocus={() => setFocused("email")}
    onBlur={() => setFocused("")}
    style={{
      background: otpSent ? "#f8fafc" : "",
      cursor: otpSent ? "not-allowed" : ""
    }}
  />

  {errors.email && (
    <p className="text-red-500 text-xs mt-1.5">
      {errors.email}
    </p>
  )}
</div>

                {mode !== "forgot" && (

<div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
                    {mode === "login" && (
                      <button
type="button"
onClick={()=>{

setMode("forgot");

setForm({
storeName:"",
ownerName:"",
whatsapp:"",
email:"",
password:""
});

setOtpSent(false);
setOtp("");

}}

className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
>

Forgot Password?

</button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className={`${inputClass("password")} pr-11`}
                      placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPass(!showPass)}
                    >
                      <EyeIcon open={showPass}/>
                    </button>
                  </div>
                 {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
</div>

)}

                {!otpSent && (  
                  <div className="flex items-start gap-2.5 pt-1">
                    <div className="w-4 h-4 rounded bg-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer">
                      <CheckIcon />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      By creating an account, you agree to our{" "}
                      <a href="#" className="text-violet-600 font-medium hover:underline">Terms of Service</a> and{" "}
                      <a href="#" className="text-violet-600 font-medium hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                  
                )}
              </div>
            )}
            {mode==="reset" && (

<div className="space-y-6">

<div>

<label className="block text-xs font-semibold text-slate-600 mb-3 mt-4 uppercase tracking-wide">
New Password
</label>
<div>
<div className="relative">

<input
type={showPass ? "text" : "password"}
className={`${inputClass("password")} pr-10`}
placeholder="Enter new password"

value={form.password}

onChange={(e)=>{

setForm({
...form,
password:e.target.value
});

}}

/>

<button
type="button"
className="absolute right-3 top-1/2 -translate-y-1/2"

onClick={()=>setShowPass(!showPass)}
>

<EyeIcon open={showPass}/>

</button>

</div>
<label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
Confirm Password
</label>
<input
type="password"
className={inputClass("confirmPassword")}
placeholder="Confirm new password"

value={form.confirmPassword || ""}

onChange={(e)=>{
setForm({
...form,
confirmPassword:e.target.value
});
}}
/>
{form.confirmPassword &&
form.password !== form.confirmPassword && (

<p className="text-red-500 text-xs mt-1.5">
Passwords do not match
</p>

)}

</div>
</div>

<button

onClick={handleSubmit}

disabled={
!form.password ||
form.password.length < 8 ||
form.password !== form.confirmPassword
}

className={`gradient-btn w-full mt-4 py-3.5 rounded-xl text-white text-sm font-semibold

${(!form.password ||
form.password.length < 8 ||
form.password !== form.confirmPassword)
? "opacity-50 cursor-not-allowed"
: ""
}

`}

>
Reset Password →
</button>

</div>

)}
              {/* CTA */}
              {authError && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm mb-3">
    {authError}
  </div>
)}
{!otpSent && mode!=="reset" && (

<button
onClick={handleSubmit}
type="button"
disabled={
(mode==="signup" &&
(!form.storeName ||
!form.ownerName ||
!form.whatsapp ||
!form.email ||
!form.password ||
Object.keys(errors).length>0))

||

(mode==="forgot" &&
(!form.email || errors.email))
}
className={`gradient-btn w-full mt-6 py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide
${mode==="signup" &&
(!form.storeName ||
!form.ownerName ||
!form.whatsapp ||
!form.email ||
!form.password ||
Object.keys(errors).length>0)
? "opacity-50 cursor-not-allowed"
: ""
}
`}
>

{
mode === "signup"
? "Send OTP →"

: mode === "forgot"
? "Send OTP →"

: "Login to Dashboard →"
}

</button>
)}
              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Google */}
              <button className="google-btn w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all duration-200 hover:shadow-sm">
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Switch mode link */}
              <p className="text-center text-sm text-slate-500 mt-6">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="text-violet-600 font-semibold hover:text-violet-800 transition-colors">
                  {mode === "login" ? "Sign up free" : "Login"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            © 2025 The Greps CRM · Trusted by 12,000+ stores
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden lg:flex lg:w-1/2 right-panel relative overflow-hidden flex-col items-center justify-center p-12 xl:p-16">
          <div className="mesh-overlay absolute inset-0" />

          {/* Decorative circles */}
          <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 border border-white/10" />
          <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/5 border border-white/10" />
          <div className="absolute top-1/3 right-8 w-3 h-3 rounded-full bg-violet-300/60" />
          <div className="absolute top-1/4 left-12 w-2 h-2 rounded-full bg-indigo-300/60" />
          <div className="absolute bottom-1/3 right-16 w-4 h-4 rounded-full bg-purple-200/40" />

          <div className="relative z-10 w-full max-w-sm">
            {/* Headline */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-xs font-medium">12,847 campaigns sent today</span>
              </div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.25 }} className="text-white mb-3">
                Turn store visits into<br />repeat customers
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Send WhatsApp alerts for restocks, sales &amp; offers — directly to your customer list.
              </p>
            </div>

            {/* Dashboard mockup */}
            <div className="dashboard-float bg-white/5 border border-white/15 rounded-2xl p-4 backdrop-blur-sm mb-5 shadow-2xl">
              <MiniDashboard />
            </div>

            {/* Testimonial */}
            <div className="testimonial-card rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  R
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-white/85 text-xs leading-relaxed mb-2">
                    "The Greps helped me double my repeat customers! My Diwali campaign got 80% open rate."
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-medium">Rahul Sharma</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="text-white/40 text-xs">Sharma Fashion, Delhi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust logos */}
            <div className="flex items-center justify-center gap-6 mt-6 opacity-40">
              {["12k+ Stores", "98% Uptime", "4.9★ Rating"].map((t, i) => (
                <div key={i} className="text-white text-xs font-medium whitespace-nowrap">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );  
}

