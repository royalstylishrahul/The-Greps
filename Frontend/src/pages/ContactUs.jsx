import { useState, useRef, useEffect } from "react";

/* ── Fade-in on scroll ── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

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
            The Greps <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">CRM</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "About", "Contact"].map(l => (
            <a key={l} href="#" className={`text-sm font-medium transition-colors ${l === "Contact" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}`}>{l}</a>
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

/* ── SVG Icons ── */
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7 10-7" />
  </svg>
);
const IconHeadset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 12a9 9 0 1 1 18 0" /><path d="M20 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /><path d="M4 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4Z" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

/* ── Contact info items ── */
const INFO_ITEMS = [
  {
    icon: <IconMail />,
    label: "Chat with Sales",
    value: "sales@The Grepscrm.com",
    sub: "We reply within 2 hours",
    href: "mailto:sales@The Grepscrm.com",
  },
  {
    icon: <IconHeadset />,
    label: "Support",
    value: "support@The Grepscrm.com",
    sub: "Available Mon–Sat, 9am–7pm IST",
    href: "mailto:support@The Grepscrm.com",
  },
  {
    icon: <IconPin />,
    label: "Office Location",
    value: "Connaught Place, New Delhi",
    sub: "110001, India",
    href: "#",
  },
];

const FAQ_ITEMS = [
  { q: "How long does onboarding take?", a: "Most stores are up and running within 15 minutes. Our setup wizard guides you through every step." },
  { q: "Can I import existing customers?", a: "Yes — upload a CSV and we'll import all your contacts instantly, no technical knowledge needed." },
  { q: "Is there a free plan?", a: "Absolutely. Our free plan supports up to 100 customers and 10 campaigns per month with no credit card required." },
  { q: "Do you support multiple stores?", a: "Yes. Each store gets its own isolated CRM workspace, perfect for growing retail chains." },
];

/* ── FAQ accordion ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="text-[14px] font-semibold text-gray-800">{q}</span>
        <span className={`text-indigo-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          <IconChevron />
        </span>
      </div>
      {open && (
        <div className="px-6 pb-5 text-[13.5px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
          {a}
        </div>
      )}
    </button>
  );
}

/* ── Contact Form ── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", store: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const inputClass = (name) =>
    `w-full rounded-xl border px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 bg-gray-50/60 font-medium ${focused === name ? "border-indigo-400 bg-white ring-2 ring-indigo-100 shadow-sm" : "border-gray-200 hover:border-gray-300"}`;

  if (sent) return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-indigo-200">✅</div>
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Message sent!</h3>
      <p className="text-gray-500 text-[15px] max-w-xs leading-relaxed mb-6">We've received your message and will get back to you within 2 hours.</p>
      <button onClick={() => { setSent(false); setForm({ name: "", email: "", store: "", subject: "", message: "" }); }}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
        ← Send another message
      </button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
          <input name="name" value={form.name} onChange={handle} onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
            required placeholder="Priya Sharma" className={inputClass("name")} />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
          <input name="email" type="email" value={form.email} onChange={handle} onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
            required placeholder="you@example.com" className={inputClass("email")} />
        </div>
      </div>
      <div>
        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Store Name</label>
        <input name="store" value={form.store} onChange={handle} onFocus={() => setFocused("store")} onBlur={() => setFocused("")}
          placeholder="Sharma Grocery, Delhi" className={inputClass("store")} />
      </div>
      <div>
        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Subject</label>
        <select name="subject" value={form.subject} onChange={handle} onFocus={() => setFocused("subject")} onBlur={() => setFocused("")}
          required className={inputClass("subject") + " cursor-pointer"}>
          <option value="">Select a topic…</option>
          <option>Sales enquiry</option>
          <option>Technical support</option>
          <option>Billing question</option>
          <option>Feature request</option>
          <option>Partnership</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message</label>
        <textarea name="message" value={form.message} onChange={handle} onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
          required rows={4} placeholder="Tell us how we can help…"
          className={inputClass("message") + " resize-none leading-relaxed"} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : "Send Message →"}
      </button>

      <p className="text-center text-[12px] text-gray-400">
        🔒 We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}

/* ── Main Page ── */
export default function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: #fafbff; }
        html { scroll-behavior: smooth; }
      `}</style>

      <NavBar />

      <main>
        {/* ── Hero ── */}
        <section className="relative pt-[68px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.032] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle,#6366f1 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

          <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                We'd love to hear from you
              </div>
            </FadeIn>
            <FadeIn delay={70}>
              <h1 className="text-[clamp(38px,6vw,62px)] font-black text-gray-900 tracking-[-0.04em] leading-[1.07] mb-5">
                Get in{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  touch
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={140}>
              <p className="text-[clamp(16px,2vw,19px)] text-gray-500 leading-relaxed max-w-xl mx-auto">
                Our team is here to help you succeed. Whether you have a question about features, pricing, or anything else — we're ready.
              </p>
            </FadeIn>

            {/* Response time badges */}
            <FadeIn delay={200}>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {[
                  { icon: "⚡", text: "Replies in < 2 hours" },
                  { icon: "🕘", text: "Mon–Sat, 9am–7pm IST" },
                  { icon: "🇮🇳", text: "India-based support" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-gray-600 shadow-sm">
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Split: Info + Form ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">

            {/* ─ Left: Contact Info Card ─ */}
            <FadeIn>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-8 shadow-2xl shadow-indigo-300/30 h-full flex flex-col">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
                {/* Glow blobs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-violet-400/20 rounded-full blur-3xl" />

                <div className="relative flex flex-col h-full">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">Contact Information</h2>
                    <p className="text-indigo-200 text-[14px] leading-relaxed">Choose the channel that works best for you.</p>
                  </div>

                  <div className="space-y-5 flex-1">
                    {INFO_ITEMS.map(({ icon, label, value, sub, href }) => (
                      <a key={label} href={href}
                        className="group flex items-start gap-4 bg-white/10 hover:bg-white/20 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/25 transition-colors">
                          {icon}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-0.5">{label}</div>
                          <div className="text-[14px] font-bold text-white mb-0.5">{value}</div>
                          <div className="text-[12px] text-indigo-300">{sub}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="mt-8 pt-6 border-t border-white/15">
                    <p className="text-[12px] text-indigo-300 mb-3 font-medium">Prefer WhatsApp?</p>
                    <a href="#"
                      className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#22c55e] text-white text-[13px] font-bold rounded-xl px-4 py-2.5 transition-colors shadow-lg">
                      <IconWhatsApp />
                      Chat on WhatsApp
                    </a>
                  </div>

                  {/* Social proof */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["from-blue-300 to-indigo-400", "from-violet-300 to-purple-500", "from-sky-300 to-blue-400"].map((c, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-indigo-500 flex items-center justify-center text-xs`}>
                          {["😊", "🧑", "👩"][i]}
                        </div>
                      ))}
                    </div>
                    <span className="text-[12px] text-indigo-200 font-medium">500+ stores trust us</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ─ Right: Form Card ─ */}
            <FadeIn delay={100}>
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 lg:p-10">
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
                      <IconSparkle />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Send a message</span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">How can we help you?</h2>
                  <p className="text-gray-500 text-[14px] mt-1">Fill out the form and we'll be in touch within 2 hours.</p>
                </div>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Map placeholder ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden h-52 bg-gradient-to-br from-indigo-50 via-violet-50/40 to-blue-50 border border-indigo-100/60 shadow-sm flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle,#6366f1 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="text-center relative">
                <div className="text-4xl mb-2">📍</div>
                <p className="font-bold text-gray-700 text-sm">Connaught Place, New Delhi — 110001, India</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Open in Google Maps <IconChevron />
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── FAQ Section ── */}
        <section className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <FadeIn className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 rounded-full px-3.5 py-1 text-xs font-bold tracking-widest uppercase mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(26px,4vw,38px)] font-black text-gray-900 tracking-[-0.03em] leading-tight mb-3">
                Common questions
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mx-auto">
                Quick answers before you reach out. Can't find what you need?{" "}
                <a href="#" className="text-indigo-600 font-semibold hover:underline">Browse our Help Center →</a>
              </p>
            </FadeIn>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <FAQItem {...item} />
                </FadeIn>
              ))}
            </div>

            {/* Help center CTA */}
            <FadeIn delay={280}>
              <div className="mt-10 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-5">
                  <div className="text-3xl">💡</div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-gray-800 text-sm">Still have questions?</p>
                    <p className="text-gray-500 text-xs mt-0.5">Our Help Center has 200+ articles to guide you.</p>
                  </div>
                  <a href="#"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[13px] font-bold rounded-xl px-5 py-2.5 shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-indigo-300 transition-all">
                    Visit Help Center <IconChevron />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      
    </>
  );
}
