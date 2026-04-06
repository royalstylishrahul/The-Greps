import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";

/* ── Fade-in on scroll ── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>{children}</div>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let n = 0;
        const step = Math.ceil(to / 48);
        const t = setInterval(() => { n = Math.min(n + step, to); setVal(n); if (n >= to) clearInterval(t); }, 28);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── SVG Icons ── */
const Ico = ({ d, className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);
const IcoArrow    = () => <Ico d="M5 12h14M12 5l7 7-7 7" className="w-4 h-4" />;
const IcoPin      = () => <Ico d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} className="w-3.5 h-3.5" />;
const IcoChevron  = () => <Ico d="m9 18 6-6-6-6" className="w-4 h-4" />;
const IcoClose    = () => <Ico d="M18 6 6 18M6 6l12 12" className="w-4 h-4" />;

/* ── Data ── */
const PERKS = [
  { icon: "🌍", label: "Remote-First",       desc: "Work from anywhere in India. We're async by default — outcomes matter, not hours logged." },
  { icon: "🏥", label: "Health Insurance",    desc: "Full medical, dental and vision coverage for you and your dependents, from day one." },
  { icon: "📚", label: "Learning Budget",     desc: "₹50,000/year for courses, books, conferences, or any skill you want to level up." },
  { icon: "⏰", label: "Flexible Hours",      desc: "No fixed 9-to-5. Set your own schedule as long as your squad's covered during core hours." },
  { icon: "✈️", label: "Annual Offsites",     desc: "All-team retreats twice a year — previous trips include Goa, Coorg and Udaipur." },
  { icon: "📈", label: "ESOPs",               desc: "Every full-time hire gets meaningful equity. You own a part of what you help build." },
];

const DEPTS = [
  {
    name: "Engineering",
    icon: "⚙️",
    color: "from-blue-500 to-indigo-600",
    light: "bg-blue-50 border-blue-100",
    roles: [
      { title: "Senior Full-Stack Engineer",     loc: "Remote", tag: "Full-time",  hot: true },
      { title: "Backend Engineer (Node.js)",      loc: "Remote", tag: "Full-time",  hot: false },
      { title: "Frontend Engineer (React)",       loc: "Remote", tag: "Full-time",  hot: false },
      { title: "DevOps & Infrastructure Lead",   loc: "Delhi",  tag: "Full-time",  hot: false },
    ],
  },
  {
    name: "Sales & Growth",
    icon: "🚀",
    color: "from-violet-500 to-purple-600",
    light: "bg-violet-50 border-violet-100",
    roles: [
      { title: "Sales Development Representative", loc: "Delhi",  tag: "Full-time",  hot: true },
      { title: "Account Executive — Retail SMB",   loc: "Remote", tag: "Full-time",  hot: false },
      { title: "Growth Marketing Manager",         loc: "Remote", tag: "Full-time",  hot: true },
      { title: "Partnerships Manager",             loc: "Delhi",  tag: "Full-time",  hot: false },
    ],
  },
  {
    name: "Marketing & Content",
    icon: "✍️",
    color: "from-pink-500 to-rose-500",
    light: "bg-pink-50 border-pink-100",
    roles: [
      { title: "Content Strategist (Hindi/English)", loc: "Remote", tag: "Full-time",  hot: false },
      { title: "Performance Marketing Specialist",   loc: "Remote", tag: "Full-time",  hot: true },
      { title: "Video & Social Media Creator",       loc: "Remote", tag: "Contract",   hot: false },
    ],
  },
  {
    name: "Product & Design",
    icon: "🎨",
    color: "from-amber-400 to-orange-500",
    light: "bg-amber-50 border-amber-100",
    roles: [
      { title: "Product Manager",              loc: "Delhi",  tag: "Full-time",  hot: false },
      { title: "Senior Product Designer (UI/UX)", loc: "Remote", tag: "Full-time", hot: true },
      { title: "UX Researcher",                loc: "Remote", tag: "Contract",   hot: false },
    ],
  },
  {
    name: "Customer Success",
    icon: "💬",
    color: "from-emerald-400 to-teal-500",
    light: "bg-emerald-50 border-emerald-100",
    roles: [
      { title: "Customer Success Manager",          loc: "Delhi",  tag: "Full-time",  hot: false },
      { title: "Technical Support Specialist",      loc: "Remote", tag: "Full-time",  hot: false },
      { title: "Onboarding Specialist",             loc: "Remote", tag: "Part-time",  hot: false },
    ],
  },
];

const TAG_STYLE = {
  "Full-time": "bg-indigo-50 text-indigo-600 border-indigo-200",
  "Contract":  "bg-amber-50  text-amber-700  border-amber-200",
  "Part-time": "bg-sky-50    text-sky-600    border-sky-200",
};

const VALUES = [
  { emoji: "⚡", title: "Ship fast",      body: "We prefer a working product over a perfect plan. Bias for action over analysis paralysis." },
  { emoji: "🤝", title: "Own it",         body: "No bureaucracy. You'll own real problems and see your work in the hands of thousands of stores." },
  { emoji: "💡", title: "Stay curious",   body: "Retail is evolving fast. We learn in public, share freely, and celebrate being wrong when data wins." },
  { emoji: "🧡", title: "Care deeply",    body: "For our customers, our product, and each other. Kindness isn't soft — it's our competitive edge." },
];

/* ── Apply modal ── */
function ApplyModal({ role, dept, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", why: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const bg = useRef(null);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    setSent(true);
  };

  const inp = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" ref={bg}
      style={{ background: "rgba(15,14,26,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === bg.current) onClose(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: "modalIn .28s cubic-bezier(.22,1,.36,1) both" }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 relative">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <IcoClose />
          </button>
          <div className="relative">
            <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest mb-1">{dept}</p>
            <h3 className="text-white font-black text-xl tracking-tight leading-tight">{role}</h3>
          </div>
        </div>

        <div className="px-8 py-7">
          {sent ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h4 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Application sent!</h4>
              <p className="text-gray-500 text-[14.5px] leading-relaxed mb-6">We'll review it and get back to you within 5 business days. Thanks for your interest!</p>
              <button onClick={onClose} className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm rounded-xl px-6 py-2.5 shadow-md hover:-translate-y-0.5 transition-all">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-[11.5px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handle} required placeholder="Priya Sharma" className={inp} />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handle} required placeholder="priya@example.com" className={inp} />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Why The Greps? <span className="normal-case font-medium text-gray-400">(2–4 lines)</span></label>
                <textarea name="why" value={form.why} onChange={handle} rows={3} required placeholder="Tell us what excites you about this role…" className={inp + " resize-none leading-relaxed"} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : <>Submit Application <IcoArrow /></>}
              </button>
              <p className="text-center text-[11.5px] text-gray-400">🔒 Your data is private and never shared.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Job Row ── */
function JobRow({ role, deptName, deptColor }) {
  const [hov, setHov] = useState(false);
  const [modal, setModal] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-xl border transition-all duration-150 cursor-pointer"
        style={{
          background: hov ? "#eef2ff" : "#fff",
          borderColor: hov ? "#c7d2fe" : "#f0f0f8",
          transform: hov ? "translateX(3px)" : "translateX(0)",
        }}
        onClick={() => setModal(true)}
      >
        <div className="flex items-center gap-3 flex-1">
          {role.hot && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 whitespace-nowrap">
              🔥 Hot
            </span>
          )}
          <div>
            <p className="font-bold text-gray-900 text-[14.5px] tracking-tight">{role.title}</p>
            {role.hot && <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 mt-1">🔥 Hot</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 text-[12.5px] text-gray-500 font-medium">
            <IcoPin />
            {role.loc}
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide ${TAG_STYLE[role.tag] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {role.tag}
          </span>
          <button
            onClick={e => { e.stopPropagation(); setModal(true); }}
            className={`flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 transition-all duration-150 ${hov ? "gap-2.5" : ""}`}
          >
            Apply Now <IcoArrow />
          </button>
        </div>
      </div>
      {modal && <ApplyModal role={role.title} dept={deptName} onClose={() => setModal(false)} />}
    </>
  );
}

/* ── Dept Section ── */
function DeptSection({ dept, idx }) {
  const [open, setOpen] = useState(true);
  return (
    <FadeIn delay={idx * 80}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Dept header */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-base shadow-sm`}>
              {dept.icon}
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 text-[16px] tracking-tight">{dept.name}</h3>
              <p className="text-[12px] text-gray-400 font-medium">{dept.roles.length} open position{dept.roles.length > 1 ? "s" : ""}</p>
            </div>
          </div>
          <span className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
            <IcoChevron />
          </span>
        </button>

        {/* Roles */}
        {open && (
          <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
            {dept.roles.map(role => (
              <JobRow key={role.title} role={role} deptName={dept.name} deptColor={dept.color} />
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

/* ── Hero illustration ── */
function HeroIllus() {
  return (
    <svg viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
        <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#818cf8" stopOpacity=".5"/><stop offset="1" stopColor="#c4b5fd" stopOpacity="0"/></linearGradient>
        <filter id="hs"><feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#6366f1" floodOpacity=".14"/></filter>
      </defs>
      <circle cx="420" cy="60" r="110" fill="url(#hg2)"/>
      <circle cx="70" cy="270" r="70" fill="#c4b5fd" fillOpacity=".12"/>
      {/* Team cards */}
      {[
        {x:30,  y:60,  e:"👨‍💻", name:"Arjun · Eng",    c:"#6366f1"},
        {x:200, y:30,  e:"👩‍🎨", name:"Sneha · Design", c:"#8b5cf6"},
        {x:370, y:60,  e:"🧑‍💼", name:"Rajan · Sales",  c:"#7c3aed"},
        {x:110, y:180, e:"👩‍💻", name:"Priya · Eng",    c:"#818cf8"},
        {x:290, y:180, e:"🧑‍🎤", name:"Dev · Marketing",c:"#a78bfa"},
      ].map(({x,y,e,name,c},i)=>(
        <g key={i} filter="url(#hs)">
          <rect x={x} y={y} width={110} height={100} rx="16" fill="white" fillOpacity=".95"/>
          <rect x={x} y={y} width={110} height={5} rx="2" fill={c}/>
          <circle cx={x+55} cy={y+44} r={22} fill={c} fillOpacity=".15"/>
          <text x={x+55} y={y+52} textAnchor="middle" fontSize="22">{e}</text>
          <text x={x+55} y={y+80} textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">{name}</text>
          <rect x={x+22} y={y+88} width={66} height={4} rx="2" fill={c} fillOpacity=".25"/>
        </g>
      ))}
      {/* Connecting lines */}
      <path d="M140 110 Q155 155 165 180" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 4"/>
      <path d="M310 80 Q310 130 345 180" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 4"/>
      {/* Badge */}
      <g filter="url(#hs)">
        <rect x="190" y="235" width="140" height="50" rx="14" fill="url(#hg1)"/>
        <text x="260" y="256" textAnchor="middle" fontSize="11" fill="white" fillOpacity=".8" fontFamily="sans-serif">We're hiring</text>
        <text x="260" y="274" textAnchor="middle" fontSize="13" fill="white" fontWeight="700" fontFamily="sans-serif">17 open roles 🚀</text>
      </g>
    </svg>
  );
}

/* ── Main Page ── */
export default function CareersPage() {
  const totalRoles = DEPTS.reduce((s, d) => s + d.roles.length, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: #fafbff; }
        html { scroll-behavior: smooth; }
        @keyframes modalIn { from { opacity:0; transform:scale(.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
      <Header />

      <main className="pt-[68px]">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.09),transparent_70%)] pointer-events-none"/>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage:"radial-gradient(circle,#6366f1 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

          <div className="relative max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"/>
                  We're hiring — {totalRoles} open roles
                </div>
              </FadeIn>
              <FadeIn delay={70}>
                <h1 className="text-[clamp(34px,5.5vw,58px)] font-black text-gray-900 tracking-[-0.04em] leading-[1.07] mb-5">
                  Join our mission to{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                    revolutionize retail marketing
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={130}>
                <p className="text-[clamp(15px,2vw,18px)] text-gray-500 leading-relaxed mb-8 max-w-lg">
                  We're a small but mighty team building the CRM that powers India's corner stores. Shipped to 500+ retailers, growing fast, and there's still so much to build.
                </p>
              </FadeIn>
              <FadeIn delay={180}>
                <div className="flex flex-wrap gap-3 mb-10">
                  <a href="#positions" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[14.5px] rounded-xl px-6 py-3 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
                    View Open Roles <IcoArrow />
                  </a>
                  <a href="#values" className="inline-flex items-center gap-2 border border-indigo-200 text-indigo-600 font-bold text-[14.5px] rounded-xl px-6 py-3 bg-white hover:bg-indigo-50 transition-colors">
                    Our Culture
                  </a>
                </div>
              </FadeIn>
              {/* Social proof strip */}
              <FadeIn delay={220}>
                <div className="flex flex-wrap gap-6">
                  {[
                    { n: 22,  s: "+",  l: "Team members" },
                    { n: 500, s: "+",  l: "Stores served" },
                    { n: 4,   s: "★",  l: "Glassdoor rating" },
                  ].map(({ n, s, l }) => (
                    <div key={l}>
                      <p className="text-2xl font-black text-indigo-600 leading-none tracking-tight">
                        <Counter to={n} suffix={s} />
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right — illustration */}
            <FadeIn delay={100} className="hidden lg:block">
              <div className="relative bg-gradient-to-br from-indigo-50/70 via-violet-50/40 to-blue-50/60 rounded-3xl p-6 border border-indigo-100/60 shadow-xl shadow-indigo-100/30 h-[340px] flex items-center justify-center">
                <HeroIllus />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-100 flex items-center gap-2.5">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Great Place to Work</p>
                    <p className="text-sm font-black text-gray-900">Certified 2025</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Values ── */}
        <section id="values" className="bg-white py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-14">
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-4">
                How We Work
              </div>
              <h2 className="text-[clamp(26px,4vw,40px)] font-black text-gray-900 tracking-[-0.03em] leading-tight mb-3">
                Values we actually live by
              </h2>
              <p className="text-gray-500 text-[15.5px] max-w-xl mx-auto leading-relaxed">
                Not a wall poster. These shape every code review, every product decision, and every customer conversation.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map(({ emoji, title, body }, i) => (
                <FadeIn key={title} delay={i * 70}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 h-full">
                    <div className="text-3xl mb-4">{emoji}</div>
                    <h3 className="font-black text-gray-900 text-[15px] tracking-tight mb-2">{title}</h3>
                    <p className="text-gray-500 text-[13.5px] leading-[1.7]">{body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Perks ── */}
        <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-14">
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-4">
                Perks & Benefits
              </div>
              <h2 className="text-[clamp(26px,4vw,40px)] font-black text-gray-900 tracking-[-0.03em] leading-tight mb-3">
                We take care of you
              </h2>
              <p className="text-gray-500 text-[15.5px] max-w-md mx-auto leading-relaxed">
                Happy people build great products. Here's how we make sure you're set up to do your best work.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PERKS.map(({ icon, label, desc }, i) => (
                <FadeIn key={label} delay={i * 65}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-1 transition-all duration-200 flex gap-4 items-start h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[14.5px] tracking-tight mb-1">{label}</h3>
                      <p className="text-gray-500 text-[13px] leading-[1.65]">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Life at The Greps photo strip ── */}
        <section className="bg-white py-20 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-10">
              <h2 className="text-[clamp(22px,3vw,32px)] font-black text-gray-900 tracking-tight mb-2">Life at The Greps</h2>
              <p className="text-gray-400 text-sm">Async work, real camaraderie, and the best chai breaks in the game.</p>
            </FadeIn>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                {bg:"from-indigo-200 to-blue-300",e:"🧑‍💻",l:"Deep work"},
                {bg:"from-violet-200 to-purple-300",e:"🤝",l:"1:1s"},
                {bg:"from-emerald-200 to-teal-300",e:"🏖️",l:"Goa offsite"},
                {bg:"from-amber-200 to-orange-300",e:"🎉",l:"Launch day"},
                {bg:"from-pink-200 to-rose-300",e:"☕",l:"Team chai"},
              ].map(({bg,e,l},i)=>(
                <FadeIn key={l} delay={i*60}>
                  <div className={`rounded-2xl bg-gradient-to-br ${bg} aspect-square flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
                    <span className="text-3xl">{e}</span>
                    <span className="text-[11px] font-bold text-white/80">{l}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Open Positions ── */}
        <section id="positions" className="py-24 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-3">
                    Open Positions
                  </div>
                  <h2 className="text-[clamp(26px,4vw,40px)] font-black text-gray-900 tracking-[-0.03em] leading-tight">
                    Find your role
                  </h2>
                  <p className="text-gray-500 text-[15px] mt-2">
                    <span className="font-semibold text-gray-700">{totalRoles} positions</span> across {DEPTS.length} departments
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {DEPTS.map(d => (
                    <a key={d.name} href={`#dept-${d.name}`}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      {d.icon} {d.name.split(" ")[0]}
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <div className="space-y-4">
              {DEPTS.map((dept, i) => (
                <div key={dept.name} id={`dept-${dept.name}`}>
                  <DeptSection dept={dept} idx={i} />
                </div>
              ))}
            </div>

            {/* No role? */}
            <FadeIn delay={200}>
              <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 text-center">
                <div className="text-3xl mb-3">🤙</div>
                <h3 className="font-black text-gray-900 text-lg tracking-tight mb-1">Don't see your role?</h3>
                <p className="text-gray-500 text-[14px] mb-5 max-w-sm mx-auto leading-relaxed">
                  We're always on the lookout for exceptional people. Send us your CV and tell us how you'd contribute.
                </p>
                <a href="mailto:careers@The Grepscrm.com"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[14px] rounded-xl px-6 py-3 shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-indigo-300 transition-all">
                  Send Open Application <IcoArrow />
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 bg-white">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl p-14 shadow-2xl shadow-indigo-300/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"22px 22px" }}/>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"/>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"/>
              <div className="relative">
                <div className="text-4xl mb-4">🌟</div>
                <h2 className="text-[clamp(24px,4vw,38px)] font-black text-white tracking-[-0.03em] leading-tight mb-3">
                  Ready to build something that matters?
                </h2>
                <p className="text-indigo-200 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
                  Join a team that ships products used by real stores, real families, and real communities across India.
                </p>
                <a href="#positions"
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black text-[15px] rounded-xl px-8 py-3.5 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  Explore All Roles <IcoArrow />
                </a>
                <p className="text-indigo-300/70 text-xs mt-5">We review every application personally. No bots, no ghosting.</p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      
    </>
  );
}
