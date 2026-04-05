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

/* ── SVG Icons ── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const IconBookmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ── Category colour map ── */
const CAT_STYLES = {
  "Marketing":        "bg-violet-100 text-violet-700 border-violet-200",
  "Product Updates":  "bg-blue-100 text-blue-700 border-blue-200",
  "Retail Tips":      "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Case Study":       "bg-amber-100 text-amber-700 border-amber-200",
  "Growth":           "bg-pink-100 text-pink-700 border-pink-200",
  "WhatsApp":         "bg-green-100 text-green-700 border-green-200",
};

const catStyle = (cat) => CAT_STYLES[cat] || "bg-gray-100 text-gray-600 border-gray-200";

/* ── Gradient illustration backgrounds (SVG inline) ── */
const ILLUS = [
  // Featured — large
  ({ className = "" }) => (
    <svg viewBox="0 0 640 340" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="fgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
        <linearGradient id="fgB" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity="0.5"/><stop offset="100%" stopColor="#c4b5fd" stopOpacity="0"/></linearGradient>
      </defs>
      <rect width="640" height="340" fill="url(#fgA)" rx="0"/>
      <circle cx="500" cy="60" r="130" fill="url(#fgB)"/>
      <circle cx="80" cy="280" r="90" fill="white" fillOpacity="0.06"/>
      <rect x="60" y="80" width="220" height="140" rx="16" fill="white" fillOpacity="0.12"/>
      <rect x="60" y="80" width="220" height="8" rx="4" fill="white" fillOpacity="0.35"/>
      <rect x="76" y="108" width="140" height="9" rx="4" fill="white" fillOpacity="0.3"/>
      <rect x="76" y="124" width="100" height="7" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="76" y="150" width="180" height="48" rx="10" fill="white" fillOpacity="0.15"/>
      {[0,1,2,3,4].map(i=><rect key={i} x={80} y={162+i*8} width={80+i*16} height={5} rx={2} fill="white" fillOpacity={0.25}/>)}
      <rect x="340" y="50" width="240" height="200" rx="16" fill="white" fillOpacity="0.10"/>
      <rect x="356" y="70" width="80" height="80" rx="10" fill="white" fillOpacity="0.18"/>
      <text x="396" y="118" textAnchor="middle" fontSize="32">📊</text>
      <rect x="452" y="78" width="100" height="10" rx="5" fill="white" fillOpacity="0.25"/>
      <rect x="452" y="95" width="72" height="7" rx="3" fill="white" fillOpacity="0.16"/>
      {[0,1,2].map(i=><rect key={i} x={356} y={172+i*16} width={208} height={7} rx={3} fill="white" fillOpacity={0.14}/>)}
      <text x="320" y="310" textAnchor="middle" fontSize="13" fill="white" fillOpacity="0.4" fontFamily="sans-serif">StockAlert CRM · Resources</text>
    </svg>
  ),
  // Card 1 – WhatsApp
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c1a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#d1fae5"/><stop offset="100%" stopColor="#a7f3d0"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c1a)"/>
      <circle cx="340" cy="40" r="70" fill="#6ee7b7" fillOpacity="0.4"/>
      <circle cx="60" cy="170" r="50" fill="#34d399" fillOpacity="0.2"/>
      <rect x="40" y="50" width="160" height="100" rx="14" fill="white" fillOpacity="0.7"/>
      <text x="120" y="108" textAnchor="middle" fontSize="36">💬</text>
      <rect x="220" y="60" width="140" height="80" rx="12" fill="white" fillOpacity="0.55"/>
      <rect x="234" y="78" width="90" height="7" rx="3" fill="#059669" fillOpacity="0.5"/>
      <rect x="234" y="92" width="65" height="6" rx="3" fill="#6ee7b7" fillOpacity="0.6"/>
      <rect x="234" y="106" width="100" height="6" rx="3" fill="#6ee7b7" fillOpacity="0.4"/>
    </svg>
  ),
  // Card 2 – Analytics
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c2a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ede9fe"/><stop offset="100%" stopColor="#ddd6fe"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c2a)"/>
      <circle cx="350" cy="170" r="80" fill="#c4b5fd" fillOpacity="0.35"/>
      {[
        {x:50,h:60,c:"#a78bfa"},{x:88,h:90,c:"#8b5cf6"},{x:126,h:70,c:"#7c3aed"},
        {x:164,h:110,c:"#6d28d9"},{x:202,h:85,c:"#8b5cf6"},{x:240,h:130,c:"#6366f1"},
      ].map(({x,h,c},i)=><rect key={i} x={x} y={160-h} width={28} height={h} rx={6} fill={c} fillOpacity={0.7}/>)}
      <text x="320" y="90" textAnchor="middle" fontSize="36">📈</text>
      <rect x="280" y="110" width="96" height="36" rx="10" fill="white" fillOpacity="0.65"/>
      <rect x="292" y="120" width="60" height="7" rx="3" fill="#7c3aed" fillOpacity="0.5"/>
      <rect x="292" y="133" width="40" height="5" rx="2" fill="#a78bfa" fillOpacity="0.4"/>
    </svg>
  ),
  // Card 3 – Customer
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c3a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#dbeafe"/><stop offset="100%" stopColor="#bfdbfe"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c3a)"/>
      <circle cx="60" cy="50" r="60" fill="#93c5fd" fillOpacity="0.35"/>
      {[
        {cx:120,cy:90,r:30,e:"👤"},{cx:200,cy:80,r:34,e:"👩"},{cx:285,cy:92,r:28,e:"🧑"},
      ].map(({cx,cy,r,e},i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="white" fillOpacity={0.7}/>
          <text x={cx} y={cy+8} textAnchor="middle" fontSize={r*0.9}>{e}</text>
        </g>
      ))}
      <rect x="60" y="140" width="280" height="28" rx="8" fill="white" fillOpacity="0.6"/>
      <rect x="74" y="150" width="160" height="7" rx="3" fill="#3b82f6" fillOpacity="0.4"/>
      <rect x="244" y="150" width="60" height="7" rx="3" fill="#93c5fd" fillOpacity="0.6"/>
    </svg>
  ),
  // Card 4 – Retail
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c4a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#fde68a"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c4a)"/>
      <circle cx="360" cy="30" r="60" fill="#fbbf24" fillOpacity="0.3"/>
      <text x="80" y="110" textAnchor="middle" fontSize="52">🏪</text>
      <rect x="140" y="55" width="210" height="120" rx="14" fill="white" fillOpacity="0.65"/>
      {[0,1,2,3].map(i=><rect key={i} x={156} y={72+i*20} width={140-i*10} height={8} rx={4} fill="#92400e" fillOpacity={0.18}/>)}
      <rect x="156" y="148" width="80" height="18" rx="6" fill="#f59e0b" fillOpacity="0.55"/>
      <text x="196" y="161" textAnchor="middle" fontSize="9" fill="#78350f" fontWeight="700">₹450 / bag</text>
    </svg>
  ),
  // Card 5 – Campaigns
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c5a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#fbcfe8"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c5a)"/>
      <circle cx="50" cy="160" r="70" fill="#f9a8d4" fillOpacity="0.35"/>
      <text x="200" y="90" textAnchor="middle" fontSize="44">🚀</text>
      <rect x="60" y="120" width="130" height="50" rx="12" fill="white" fillOpacity="0.7"/>
      <rect x="72" y="132" width="90" height="8" rx="4" fill="#be185d" fillOpacity="0.35"/>
      <rect x="72" y="147" width="65" height="6" rx="3" fill="#f9a8d4" fillOpacity="0.6"/>
      <rect x="210" y="115" width="130" height="55" rx="12" fill="white" fillOpacity="0.7"/>
      <rect x="222" y="128" width="90" height="8" rx="4" fill="#be185d" fillOpacity="0.35"/>
      <rect x="222" y="143" width="65" height="6" rx="3" fill="#f9a8d4" fillOpacity="0.6"/>
      <rect x="222" y="155" width="45" height="5" rx="2" fill="#f9a8d4" fillOpacity="0.4"/>
    </svg>
  ),
  // Card 6 – Multi-store
  ({ className = "" }) => (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs><linearGradient id="c6a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ecfdf5"/><stop offset="100%" stopColor="#d1fae5"/></linearGradient></defs>
      <rect width="400" height="200" fill="url(#c6a)"/>
      <circle cx="380" cy="180" r="80" fill="#6ee7b7" fillOpacity="0.25"/>
      {[{x:40,y:60},{x:160,y:45},{x:280,y:60}].map(({x,y},i)=>(
        <g key={i}>
          <rect x={x} y={y} width={90} height={120} rx="12" fill="white" fillOpacity="0.7"/>
          <text x={x+45} y={y+55} textAnchor="middle" fontSize="28">🏪</text>
          <rect x={x+10} y={y+72} width={60} height={6} rx={3} fill="#059669" fillOpacity={0.35}/>
          <rect x={x+10} y={y+85} width={40} height={5} rx={2} fill="#34d399" fillOpacity={0.4}/>
        </g>
      ))}
    </svg>
  ),
];

/* ── Blog data ── */
const FEATURED = {
  cat: "Marketing",
  title: "How to 10× Your Store Revenue with WhatsApp Campaigns in 30 Days",
  excerpt: "Most retail store owners treat WhatsApp as a chat app. The top 10% use it as their most powerful sales channel. In this deep-dive, we break down the exact campaign structure that drove ₹18 lakh in incremental revenue for a Delhi grocery chain — and how you can replicate it this week.",
  author: "Priya Sharma",
  role: "Co-founder & CTO",
  date: "June 14, 2025",
  read: "8 min read",
  IllusComp: ILLUS[0],
};

const POSTS = [
  {
    cat: "WhatsApp",
    title: "5 WhatsApp Message Templates That Get Customers to Reorder",
    desc: "Copy-paste templates proven to drive repeat purchases — tested across 200 stores.",
    author: "Rohan Das",
    date: "June 10, 2025",
    read: "5 min read",
    IllusComp: ILLUS[1],
  },
  {
    cat: "Marketing",
    title: "Understanding Your Campaign Analytics: A Beginner's Guide",
    desc: "Open rates, click-throughs, conversion — here's what every number means and what to do about it.",
    author: "Sneha Kapoor",
    date: "June 7, 2025",
    read: "6 min read",
    IllusComp: ILLUS[2],
  },
  {
    cat: "Retail Tips",
    title: "How to Segment Customers for Maximum Campaign ROI",
    desc: "Stop sending the same message to everyone. Learn to build segments that convert 3× better.",
    author: "Arjun Mehta",
    date: "June 3, 2025",
    read: "7 min read",
    IllusComp: ILLUS[3],
  },
  {
    cat: "Retail Tips",
    title: "Seasonal Sale Playbook: Eid, Diwali & New Year Campaigns",
    desc: "A seasonal calendar with campaign ideas, timing strategy, and message copy for India's biggest retail moments.",
    author: "Priya Sharma",
    date: "May 28, 2025",
    read: "9 min read",
    IllusComp: ILLUS[4],
  },
  {
    cat: "Growth",
    title: "From 0 to 1,000 Customers: A Small Retailer's CRM Journey",
    desc: "Real story of a Jaipur kirana store that built a loyal customer base in under 6 months using StockAlert.",
    author: "Rohan Das",
    date: "May 22, 2025",
    read: "5 min read",
    IllusComp: ILLUS[5],
  },
  {
    cat: "Product Updates",
    title: "Introducing Multi-Store Support: One CRM, Every Branch",
    desc: "You asked, we built. Manage all your store locations from a single dashboard — now live for all Pro users.",
    author: "Arjun Mehta",
    date: "May 18, 2025",
    read: "3 min read",
    IllusComp: ILLUS[6],
  },
];

const CATS = ["All", "Marketing", "WhatsApp", "Retail Tips", "Product Updates", "Growth", "Case Study"];

/* ── Navbar ── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${scrolled ? "bg-white/95 shadow-sm border-b border-gray-100" : "bg-white/70"}`}>
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg shadow-md">📲</div>
          <span className="font-extrabold text-[17px] text-gray-900 tracking-tight">
            StockAlert <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">CRM</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "About", "Resources"].map(l => (
            <a key={l} href="#" className={`text-sm font-medium transition-colors ${l === "Resources" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}`}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button className="text-sm font-semibold text-gray-700 border border-indigo-100 rounded-[10px] px-4 py-2 hover:bg-indigo-50 transition-colors">Login</button>
          <button className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[10px] px-4 py-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">Start Free Trial</button>
        </div>
      </div>
    </nav>
  );
}

/* ── PostCard ── */
function PostCard({ post, delay = 0 }) {
  const { cat, title, desc, author, date, read, IllusComp } = post;
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay} className="h-full">
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
        style={{
          boxShadow: hov
            ? "0 16px 48px rgba(99,102,241,0.14), 0 4px 12px rgba(0,0,0,0.07)"
            : "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          transform: hov ? "translateY(-5px)" : "translateY(0)",
          transition: "box-shadow 0.22s ease, transform 0.22s ease",
        }}
      >
        {/* Image */}
        <div className="overflow-hidden h-44 flex-shrink-0">
          <IllusComp className="w-full h-full object-cover" />
        </div>
        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <span className={`self-start text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide ${catStyle(cat)}`}>{cat}</span>
          <h3 className="font-black text-gray-900 text-[15.5px] leading-snug tracking-tight line-clamp-2">{title}</h3>
          <p className="text-gray-500 text-[13.5px] leading-relaxed line-clamp-3 flex-1">{desc}</p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
            <div>
              <p className="text-[12px] font-semibold text-gray-700">{author}</p>
              <p className="text-[11px] text-gray-400">{date}</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <IconClock />{read}
            </div>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

/* ── Newsletter ── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sub = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  };
  return (
    <FadeIn>
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-10 py-14 shadow-2xl shadow-indigo-300/30 text-center">
        {/* Dots */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
        {/* Glow blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl mx-auto">
          <div className="text-3xl mb-4">✉️</div>
          {done ? (
            <>
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">You're in!</h3>
              <p className="text-indigo-200 text-[15px]">Your first retail tip drops next Monday. Keep an eye on your inbox.</p>
            </>
          ) : (
            <>
              <h3 className="text-[clamp(22px,4vw,34px)] font-black text-white tracking-[-0.03em] leading-tight mb-3">
                Subscribe for weekly retail marketing tips
              </h3>
              <p className="text-indigo-200 text-[15px] mb-8 leading-relaxed">
                Join 4,000+ store owners getting actionable WhatsApp marketing tips, product updates, and growth ideas every Monday — free.
              </p>
              <form onSubmit={sub} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourstore.com"
                  required
                  className="flex-1 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-800 placeholder-gray-400 outline-none border-2 border-transparent focus:border-white/30 bg-white shadow-md"
                />
                <button type="submit" disabled={loading}
                  className="flex-shrink-0 bg-white text-indigo-700 font-black text-[14px] rounded-xl px-6 py-3 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : <>Subscribe <IconArrow /></>}
                </button>
              </form>
              <p className="text-indigo-300/70 text-xs mt-4">No spam, ever. Unsubscribe in one click.</p>
            </>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

/* ── Main Page ── */
export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = POSTS.filter(p => {
    const matchCat = activeCat === "All" || p.cat === activeCat;
    const q = query.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: #fafbff; }
        html { scroll-behavior: smooth; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      <NavBar />

      <main className="pt-[68px]">
        {/* ── Page Header ── */}
        <section className="relative overflow-hidden py-20 px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle,#6366f1 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative max-w-3xl mx-auto text-center mb-12">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                StockAlert CRM Blog
              </div>
            </FadeIn>
            <FadeIn delay={60}>
              <h1 className="text-[clamp(34px,6vw,60px)] font-black text-gray-900 tracking-[-0.04em] leading-[1.07] mb-5">
                Resources &{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  Articles
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={120}>
              <p className="text-[clamp(15px,2vw,18px)] text-gray-500 leading-relaxed max-w-xl mx-auto">
                Practical retail marketing guides, WhatsApp campaign playbooks, and product updates — all in one place.
              </p>
            </FadeIn>
          </div>

          {/* Search + Filters */}
          <FadeIn delay={180} className="max-w-3xl mx-auto">
            {/* Search bar */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search articles, tips, guides…"
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white text-[14.5px] font-medium text-gray-800 placeholder-gray-400 outline-none shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <IconX />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CATS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`text-[13px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-150 ${
                    activeCat === cat
                      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-md shadow-indigo-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active filter + count */}
            {(query || activeCat !== "All") && (
              <div className="flex items-center justify-between mt-4 px-1">
                <p className="text-[13px] text-gray-500">
                  <span className="font-semibold text-gray-700">{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""} found
                  {activeCat !== "All" && <span> in <span className="font-semibold text-indigo-600">{activeCat}</span></span>}
                  {query && <span> for "<span className="font-semibold text-gray-800">{query}</span>"</span>}
                </p>
                <button onClick={() => { setQuery(""); setActiveCat("All"); }}
                  className="text-[12px] text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  <IconX /> Clear
                </button>
              </div>
            )}
          </FadeIn>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-28 space-y-16">
          {/* ── Featured Post ── */}
          {(activeCat === "All" || activeCat === "Marketing") && !query && (
            <FadeIn>
              <div className="group bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
                  {/* Left – large illustration */}
                  <div className="relative overflow-hidden min-h-[260px] lg:min-h-[360px]">
                    <FEATURED.IllusComp className="w-full h-full object-cover absolute inset-0" />
                    {/* Overlay gradient for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-white/0" />
                    {/* Featured label */}
                    <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-indigo-700 border border-indigo-100 rounded-full px-3 py-1 text-[11px] font-bold shadow">
                      ⭐ Featured
                    </div>
                  </div>

                  {/* Right – content */}
                  <div className="flex flex-col justify-center p-8 lg:p-10">
                    <span className={`self-start text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide mb-4 ${catStyle(FEATURED.cat)}`}>
                      {FEATURED.cat}
                    </span>
                    <h2 className="text-[clamp(18px,2.5vw,26px)] font-black text-gray-900 tracking-tight leading-snug mb-4">
                      {FEATURED.title}
                    </h2>
                    <p className="text-gray-500 text-[14.5px] leading-[1.75] mb-6 line-clamp-4">
                      {FEATURED.excerpt}
                    </p>
                    {/* Read link */}
                    <a href="#" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-[14px] hover:gap-3 transition-all group-hover:text-indigo-700 mb-6">
                      Read Article <IconArrow />
                    </a>
                    {/* Author */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-base border-2 border-white shadow-sm">
                          👩‍💻
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">{FEATURED.author}</p>
                          <p className="text-[11px] text-gray-400">{FEATURED.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] text-gray-500 font-medium">{FEATURED.date}</p>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 justify-end mt-0.5">
                          <IconClock />{FEATURED.read}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ── Recent Posts Grid ── */}
          {filtered.length > 0 ? (
            <div>
              <FadeIn>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[22px] font-black text-gray-900 tracking-tight">
                    {activeCat === "All" && !query ? "Recent Articles" : "Results"}
                  </h2>
                  <a href="#" className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    View all <IconChevron />
                  </a>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <PostCard key={post.title} post={post} delay={i * 60} />
                ))}
              </div>
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">No articles found</h3>
                <p className="text-gray-400 text-sm mb-6">Try a different keyword or browse all categories.</p>
                <button onClick={() => { setQuery(""); setActiveCat("All"); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm rounded-xl px-5 py-2.5 shadow-md hover:-translate-y-0.5 transition-all">
                  Clear filters <IconX />
                </button>
              </div>
            </FadeIn>
          )}

          {/* ── Bookmark strip ── */}
          <FadeIn>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <IconBookmark />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Save articles to read later</p>
                  <p className="text-gray-400 text-xs">Sign up for a free account and bookmark your favourites.</p>
                </div>
              </div>
              <button className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[13px] rounded-xl px-5 py-2.5 shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-indigo-300 transition-all">
                Create Free Account →
              </button>
            </div>
          </FadeIn>

          {/* ── Newsletter ── */}
          <Newsletter />
        </div>
      </main>

      
    </>
  );
}
