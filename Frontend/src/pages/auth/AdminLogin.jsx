  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  const LockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const EyeIcon = ({ open }) =>
    open ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );

  export default function AdminLogin({setPage}) {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [focused, setFocused] = useState(null);

  const handleLogin = async (e)=>{

  e.preventDefault();

  setLoading(true);

  try{

  // STEP 1 → send OTP if not entered
  if(!otp){

  const res = await axios.post(

  "http://localhost:5001/api/admin/login",

  {email,password}

  );

  if(res.data.success){

  setError("OTP sent to your email");

  }

  }else{

  // STEP 2 → verify OTP

  const res = await axios.post(

  "http://localhost:5001/api/admin/verify-otp",

  {email,otp}

  );

  localStorage.setItem(
  "token",
  res.data.token
  );

  localStorage.setItem(
  "role",
  res.data.role
  );

  navigate("/admin-dashboard");

  }

  }catch(err){

  setError(

  err.response?.data?.message ||
  "Login failed"

  );

  }

  setLoading(false);

  };

     // ← THIS closes handleLogin

    const inputBase =
      "w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm placeholder-slate-400 outline-none transition-all duration-200";
    const inputIdle = "border-slate-200 hover:border-slate-300";
    const inputFocused = "border-indigo-500 ring-3 ring-indigo-50 shadow-sm";

    return (
      <div
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
      >
        {/* Subtle grid background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo area */}
        <div className="relative mb-7 flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-slate-800 font-semibold text-xl tracking-tight">
              The Greps <span className="text-indigo-600">CRM</span>
            </span>
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{
              color: "#6366f1",
              background: "rgba(99,102,241,0.07)",
              borderColor: "rgba(99,102,241,0.18)",
              letterSpacing: "0.12em",
            }}
          >
            Admin Portal
          </span>
        </div>

        {/* Card */}
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/70"
          style={{ border: "1px solid rgba(226,232,240,0.9)" }}
        >
          {/* Gradient top border */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }}
          />

          <div className="px-8 pt-8 pb-7">
            {/* Card header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-slate-400">
                  <ShieldIcon />
                </span>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Admin Access
                </h1>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Please enter your credentials to access the master control panel.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Admin Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase" style={{ letterSpacing: "0.06em" }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value);setError("");}}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="admin@The Greps.io"
                  className={`${inputBase} ${focused === "email" ? inputFocused : inputIdle}`}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 tracking-wide uppercase" style={{ letterSpacing: "0.06em" }}>
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);setError("");}}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••••"
                    className={`${inputBase} pr-10 ${focused === "password" ? inputFocused : inputIdle}`}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* 2FA / OTP */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase" style={{ letterSpacing: "0.06em" }}>
                  2FA / OTP Code
                  <span className="ml-1.5 normal-case font-normal text-slate-400 tracking-normal" style={{ fontSize: "10px" }}>
                    (Authenticator App)
                  </span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onFocus={() => setFocused("otp")}
                  onBlur={() => setFocused(null)}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  className={`${inputBase} tracking-[0.3em] font-mono text-center ${focused === "otp" ? inputFocused : inputIdle}`}
                  style={{ letterSpacing: otp ? "0.35em" : undefined }}
                />
              </div>
  {error && (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
      {error}
    </div>
  )}
              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70"
                  style={{
                    background: loading ? "#4338ca" : "#3730a3",
                    boxShadow: "0 1px 3px rgba(55,48,163,0.25), 0 4px 12px rgba(55,48,163,0.15)",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#312e81"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#3730a3"; }}
                >
                  <LockIcon />
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Authenticating…
                    </span>
                  ) : (
                    "Secure Login"
                  )}
                </button>
              </div>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-start gap-2 px-3.5 py-3 bg-slate-50 rounded-lg border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-slate-400 leading-relaxed">
                This is a restricted area. All access attempts are logged and monitored. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-5 text-xs text-slate-400">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to main website
          </a>
          <span className="text-slate-200">|</span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            IT Support
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-300">
          © {new Date().getFullYear()} The Greps CRM. All rights reserved.
        </p>
      </div>
    );
  }
