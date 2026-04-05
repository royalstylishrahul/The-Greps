import { useState, useEffect, useRef } from "react";

/* ─── Tailwind is loaded via CDN in the artifact environment ─── */

const TEAM = [
  { name: "Arjun Mehta", role: "Co-founder & CEO", emoji: "👨‍💼", color: "from-blue-400 to-indigo-500" },
  { name: "Priya Sharma", role: "Co-founder & CTO", emoji: "👩‍💻", color: "from-violet-400 to-purple-600" },
  { name: "Rohan Das", role: "Head of Product", emoji: "🧑‍🎨", color: "from-sky-400 to-blue-500" },
  { name: "Sneha Kapoor", role: "Head of Growth", emoji: "👩‍🚀", color: "from-indigo-400 to-violet-500" },
];

const VALUES = [
  { icon: "✦", label: "Simplicity First", desc: "We strip away complexity so every store owner — regardless of tech skill — can use our product with confidence.", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { icon: "❤️", label: "Customer Obsessed", desc: "Every feature we build starts with a real retailer's pain point. Our customers shape our roadmap, not the other way around.", color: "bg-violet-50 text-violet-600 border-violet-100" },
  { icon: "⚡", label: "Move Fast", desc: "Retail doesn't pause — and neither do we. We ship quickly, learn from real usage, and iterate until it's right.", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: "🌱", label: "Grow Together", desc: "When our customers grow, we grow. We price fairly, support generously, and celebrate every milestone with our community.", color: "bg-sky-50 text-sky-600 border-sky-100" },
];

/* ─── Animated counter ─── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(to / 50);
        const timer = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(start);
          if (start >= to) clearInterval(timer);
        }, 28);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Fade-in on scroll ─── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Abstract SVG illustration ─── */
function AbstractIllustration() {
  return (
    <svg viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background blobs */}
      <circle cx="360" cy="80" r="120" fill="url(#g1)" opacity="0.18" />
      <circle cx="100" cy="300" r="90" fill="url(#g2)" opacity="0.14" />

      {/* Card 1 – customers */}
      <rect x="20" y="60" width="180" height="110" rx="16" fill="white" filter="url(#shadow)" />
      <rect x="20" y="60" width="180" height="6" rx="3" fill="url(#g3)" />
      <circle cx="52" cy="100" r="14" fill="#ede9fe" />
      <text x="48" y="105" fontSize="14" textAnchor="middle">👥</text>
      <rect x="76" y="90" width="90" height="8" rx="4" fill="#e8e8f6" />
      <rect x="76" y="104" width="60" height="6" rx="3" fill="#f0f0fa" />
      <rect x="36" y="128" width="148" height="28" rx="8" fill="#f5f3ff" />
      <text x="110" y="147" fontSize="11" textAnchor="middle" fill="#6366f1" fontWeight="700">1,240 Customers</text>

      {/* Card 2 – campaign */}
      <rect x="270" y="40" width="185" height="120" rx="16" fill="white" filter="url(#shadow)" />
      <rect x="270" y="40" width="185" height="6" rx="3" fill="url(#g2)" />
      <circle cx="302" cy="82" r="14" fill="#ede9fe" />
      <text x="298" y="87" fontSize="14" textAnchor="middle">💬</text>
      <rect x="326" y="72" width="100" height="8" rx="4" fill="#e8e8f6" />
      <rect x="326" y="86" width="70" height="6" rx="3" fill="#f0f0fa" />
      <rect x="286" y="108" width="153" height="36" rx="8" fill="url(#g4)" opacity="0.85" />
      <text x="362" y="131" fontSize="11" textAnchor="middle" fill="white" fontWeight="700">Campaign Sent 🚀</text>

      {/* Connecting line */}
      <path d="M200 110 Q240 80 270 100" stroke="url(#g3)" strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Card 3 – analytics */}
      <rect x="80" y="210" width="200" height="130" rx="16" fill="white" filter="url(#shadow)" />
      <rect x="80" y="210" width="200" height="6" rx="3" fill="url(#g4)" />
      <text x="96" y="246" fontSize="12" fill="#6b7280" fontWeight="600">Revenue Growth</text>
      {/* bar chart */}
      {[
        { x: 100, h: 28, c: "#c7d2fe" },
        { x: 128, h: 44, c: "#a5b4fc" },
        { x: 156, h: 36, c: "#818cf8" },
        { x: 184, h: 58, c: "#6366f1" },
        { x: 212, h: 70, c: "#4f46e5" },
        { x: 240, h: 62, c: "url(#g3)" },
      ].map(({ x, h, c }, i) => (
        <rect key={i} x={x} y={300 - h} width="20" height={h} rx="5" fill={c} />
      ))}
      <line x1="94" y1="300" x2="268" y2="300" stroke="#f0f0fa" strokeWidth="1.5" />
      <text x="180" y="320" fontSize="10" fill="#9ca3af" textAnchor="middle">+62% growth this quarter</text>

      {/* Floating badge */}
      <rect x="290" y="200" width="140" height="52" rx="12" fill="white" filter="url(#shadow)" />
      <circle cx="314" cy="226" r="14" fill="#d1fae5" />
      <text x="310" y="231" fontSize="14">✅</text>
      <text x="334" y="220" fontSize="10" fill="#374151" fontWeight="700">Orders Today</text>
      <text x="334" y="234" fontSize="14" fill="#22c55e" fontWeight="900">₹18,400</text>

      {/* Floating WhatsApp chip */}
      <rect x="310" y="290" width="120" height="36" rx="10" fill="white" filter="url(#shadow)" />
      <text x="326" y="313" fontSize="13">💬</text>
      <text x="345" y="313" fontSize="10" fill="#6366f1" fontWeight="700">WhatsApp live</text>

      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.1" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Navbar (matches landing page) ─── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm border-b border-gray-100" : "bg-white/70"} backdrop-blur-xl`}>
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg shadow-md">📲</div>
          <span className="font-extrabold text-[17px] text-gray-900 tracking-tight">
            StockAlert <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">CRM</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "About"].map(l => (
            <a key={l} href="#" className={`text-sm font-medium transition-colors ${l === "About" ? "text-indigo-600" : "text-gray-600 hover:text-indigo-500"}`}>{l}</a>
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

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden pt-[68px]">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.09),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(139,92,246,0.07),transparent_60%)] pointer-events-none" />

      {/* Decorative dots grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center py-20">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Our Story
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <h1 className="text-[clamp(36px,6vw,66px)] font-black text-gray-900 leading-[1.08] tracking-[-0.04em] mb-6">
            Empowering Retail Stores<br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">to Grow</span>
          </h1>
        </FadeIn>
        <FadeIn delay={150}>
          <p className="text-[clamp(16px,2vw,20px)] text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            We believe every corner store deserves enterprise-grade marketing tools. StockAlert CRM was built to give India's retail owners the power of WhatsApp campaigns — without the complexity.
          </p>
        </FadeIn>
        <FadeIn delay={220}>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { to: 500, suffix: "+", label: "Stores Active" },
              { to: 12, suffix: "L+", label: "Messages Sent" },
              { to: 98, suffix: "%", label: "Satisfaction" },
            ].map(({ to, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-black text-indigo-600 tracking-tight leading-none mb-1">
                  <Counter to={to} suffix={suffix} />
                </div>
                <div className="text-sm text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Our Story ─── */
function OurStory() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <FadeIn className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-6">
            How We Started
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-black text-gray-900 tracking-[-0.03em] leading-[1.12] mb-6">
            Born from a real<br />retail problem
          </h2>
          <div className="space-y-5 text-gray-500 text-[15.5px] leading-[1.75]">
            <p>
              In 2022, our co-founder Arjun was helping his family run a grocery store in Delhi. They were losing customers because they couldn't afford a marketing team — and WhatsApp broadcasts were a manual nightmare.
            </p>
            <p>
              Arjun teamed up with Priya, a seasoned engineer, and together they built a simple prototype over a weekend. Within a month, 20 local stores were using it. Within six months, the waitlist had hundreds of stores.
            </p>
            <p>
              Today, StockAlert CRM helps <strong className="text-gray-700">500+ stores</strong> across India manage their customers, showcase products, and send targeted WhatsApp campaigns — in just minutes.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {["from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-sky-400 to-blue-500"].map((c, i) => (
                <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${c} border-2 border-white flex items-center justify-center text-sm shadow`}>
                  {["👨‍💼", "👩‍💻", "🧑‍🎨"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">Founded by a team that <em>lived</em> the problem</span>
          </div>
        </FadeIn>

        {/* Illustration */}
        <FadeIn delay={100} className="order-1 lg:order-2">
          <div className="relative bg-gradient-to-br from-indigo-50/60 via-violet-50/40 to-sky-50/60 rounded-3xl p-6 border border-indigo-100/60 shadow-xl shadow-indigo-100/30">
            <AbstractIllustration />
            {/* Corner badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-100 flex items-center gap-2.5">
              <span className="text-xl">🏪</span>
              <div>
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Since</div>
                <div className="text-sm font-black text-gray-900">2022, Delhi</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Core Values ─── */
function CoreValues() {
  return (
    <section className="py-28 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-4">
            Core Values
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-black text-gray-900 tracking-[-0.03em] leading-tight mb-4">
            What we stand for
          </h2>
          <p className="text-gray-500 text-[16px] max-w-xl mx-auto leading-relaxed">
            Four principles that guide every feature we ship, every conversation with a customer, and every decision we make as a team.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon, label, desc, color }, i) => (
            <FadeIn key={label} delay={i * 70}>
              <div className={`group bg-white rounded-2xl p-6 border ${color.split(" ").find(c => c.startsWith("border"))} shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 h-full flex flex-col`}>
                <div className={`w-11 h-11 rounded-xl ${color.split(" ").filter(c => c.startsWith("bg") || c.startsWith("text")).join(" ")} bg-opacity-80 flex items-center justify-center text-xl mb-4 font-black border ${color.split(" ").find(c => c.startsWith("border"))}`}>
                  {icon}
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 tracking-tight">{label}</h3>
                <p className="text-[13.5px] text-gray-500 leading-[1.7] flex-1">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Team ─── */
function Team() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-4">
            The Team
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-black text-gray-900 tracking-[-0.03em] leading-tight mb-4">
            People behind the product
          </h2>
          <p className="text-gray-500 text-[16px] max-w-xl mx-auto leading-relaxed">
            A small, passionate team obsessed with making retail marketing effortless for every store owner.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(({ name, role, emoji, color }, i) => (
            <FadeIn key={name} delay={i * 80}>
              <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-250 overflow-hidden">
                {/* Avatar area */}
                <div className={`h-36 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-4xl shadow-lg">
                    {emoji}
                  </div>
                  {/* Subtle pattern */}
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-[15px] text-gray-900 tracking-tight mb-0.5">{name}</h3>
                  <p className="text-[13px] text-gray-400 font-medium mb-4">{role}</p>
                  {/* LinkedIn icon */}
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-28 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl p-16 shadow-2xl shadow-indigo-300/40 relative overflow-hidden">
          {/* Background noise dots */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* Glow circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative">
            <div className="text-4xl mb-5">🚀</div>
            <h2 className="text-[clamp(24px,4vw,38px)] font-black text-white tracking-[-0.035em] leading-tight mb-4">
              Ready to grow your store?
            </h2>
            <p className="text-indigo-200 text-[15px] leading-relaxed mb-9 max-w-lg mx-auto">
              Join 500+ retail stores across India already sending smarter WhatsApp campaigns and driving real orders with StockAlert CRM.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="bg-white text-indigo-600 font-black text-[15px] rounded-xl px-8 py-3.5 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150 tracking-tight">
                Start Free Trial →
              </button>
              <button className="text-white font-semibold text-[14px] rounded-xl px-6 py-3.5 border border-white/30 hover:bg-white/10 transition-colors">
                View Demo
              </button>
            </div>
            <p className="text-indigo-300/70 text-xs mt-5">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}


/* ─── App ─── */
export default function AboutUsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        html { scroll-behavior: smooth; }
      `}</style>
      <main>
        <Hero />
        <OurStory />
        <CoreValues />
        <Team />
        <CTA />
      </main>
    </>
  );
}
