import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   LEGAL CONTENT DATA
───────────────────────────────────────────── */
const DOCS = {
  privacy: {
    title: "Privacy Policy",
    updated: "June 14, 2025",
    effective: "July 1, 2025",
    intro: "At The Greps CRM, we take your privacy seriously. This policy explains what data we collect, why we collect it, and how we protect it.",
    sections: [
      {
        id: "data-collection",
        heading: "1. Data We Collect",
        content: [
          {
            type: "p",
            text: "We collect information you provide directly to us when you create an account, use our services, or contact support. This may include:",
          },
          {
            type: "ul",
            items: [
              "Full name, email address, and phone number",
              "Business name, store location, and GST number",
              "Customer lists and product catalogues you upload",
              "WhatsApp campaign content and recipient data",
              "Billing information (processed securely via Razorpay — we never store card details)",
            ],
          },
          {
            type: "h3",
            text: "Automatically Collected Data",
          },
          {
            type: "p",
            text: "When you use The Greps CRM, we may automatically collect certain technical information:",
          },
          {
            type: "ul",
            items: [
              "IP address, browser type, and operating system",
              "Pages visited, time spent, and click patterns",
              "Device identifiers and session tokens",
              "Error logs and crash reports to improve product stability",
            ],
          },
        ],
      },
      {
        id: "data-usage",
        heading: "2. How We Use Your Data",
        content: [
          {
            type: "p",
            text: "We use the information we collect to provide, maintain, and improve our services. Specifically, we use your data to:",
          },
          {
            type: "ul",
            items: [
              "Create and manage your CRM account",
              "Enable WhatsApp campaign delivery through our messaging infrastructure",
              "Process payments and send invoices",
              "Respond to support requests and provide technical assistance",
              "Send product updates, security notices, and service announcements",
              "Analyse usage patterns to improve features and fix bugs",
              "Comply with legal obligations under Indian law",
            ],
          },
          {
            type: "h3",
            text: "We Never Sell Your Data",
          },
          {
            type: "p",
            text: "The Greps CRM does not sell, rent, or trade your personal information or your customers' data to third parties for marketing purposes. Your data is yours — we are simply the custodian.",
          },
        ],
      },
      {
        id: "data-sharing",
        heading: "3. Data Sharing & Third Parties",
        content: [
          {
            type: "p",
            text: "We may share your information with trusted third-party service providers who assist us in operating our platform:",
          },
          {
            type: "ul",
            items: [
              "WhatsApp Business API providers for message delivery",
              "Razorpay for payment processing (PCI DSS compliant)",
              "AWS and Google Cloud for secure data hosting",
              "Intercom for in-app customer support",
              "PostHog for anonymised product analytics",
            ],
          },
          {
            type: "p",
            text: "Each provider is contractually bound to handle your data only for the specified purpose and in compliance with applicable data protection laws.",
          },
        ],
      },
      {
        id: "data-retention",
        heading: "4. Data Retention",
        content: [
          {
            type: "p",
            text: "We retain your account data for as long as your account remains active. If you delete your account:",
          },
          {
            type: "ul",
            items: [
              "Your personal data is deleted within 30 days",
              "Customer lists and campaign data are purged within 30 days",
              "Billing records are retained for 7 years as required by Indian GST regulations",
              "Anonymised, aggregated analytics may be retained indefinitely",
            ],
          },
        ],
      },
      {
        id: "your-rights",
        heading: "5. Your Rights",
        content: [
          {
            type: "p",
            text: "You have the following rights with respect to your personal data:",
          },
          {
            type: "ul",
            items: [
              "Access: Request a copy of the data we hold about you",
              "Rectification: Correct inaccurate or incomplete information",
              "Erasure: Request deletion of your personal data (subject to legal obligations)",
              "Portability: Export your data in a machine-readable format",
              "Objection: Opt out of certain types of processing",
            ],
          },
          {
            type: "p",
            text: "To exercise any of these rights, contact us at privacy@The Grepscrm.com. We will respond within 30 days.",
          },
        ],
      },
      {
        id: "security",
        heading: "6. Security",
        content: [
          {
            type: "p",
            text: "We implement industry-standard security measures to protect your data, including:",
          },
          {
            type: "ul",
            items: [
              "AES-256 encryption at rest for all stored data",
              "TLS 1.3 encryption in transit for all API calls",
              "Two-factor authentication support for all accounts",
              "Regular third-party penetration testing",
              "SOC 2 Type II certification (in progress)",
            ],
          },
          {
            type: "p",
            text: "Despite these safeguards, no system is 100% secure. We encourage you to use a strong, unique password and enable two-factor authentication.",
          },
        ],
      },
      {
        id: "cookies",
        heading: "7. Cookies",
        content: [
          {
            type: "p",
            text: "We use cookies and similar tracking technologies to operate and improve our service. Please see our Cookie Policy for full details. You can control cookie preferences through your browser settings.",
          },
        ],
      },
      {
        id: "changes",
        heading: "8. Changes to This Policy",
        content: [
          {
            type: "p",
            text: "We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and by displaying a prominent notice within the product at least 14 days before the changes take effect. Continued use of the service after the effective date constitutes acceptance.",
          },
        ],
      },
      {
        id: "contact",
        heading: "9. Contact Us",
        content: [
          {
            type: "p",
            text: "If you have questions about this Privacy Policy or your data, please reach out:",
          },
          {
            type: "ul",
            items: [
              "Email: privacy@The Grepscrm.com",
              "Address: The Greps Technologies Pvt. Ltd., Connaught Place, New Delhi — 110001",
              "Grievance Officer: Arjun Mehta (grievance@The Grepscrm.com)",
            ],
          },
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    updated: "June 14, 2025",
    effective: "July 1, 2025",
    intro: "These Terms of Service govern your use of The Greps CRM. By accessing or using our services, you agree to be bound by these terms.",
    sections: [
      {
        id: "acceptance",
        heading: "1. Acceptance of Terms",
        content: [
          { type: "p", text: "By creating an account or using any The Greps CRM service, you confirm that you are at least 18 years old, that you have read and understood these Terms, and that you agree to be legally bound by them. If you are using The Greps on behalf of a business, you represent that you have authority to bind that business." },
        ],
      },
      {
        id: "service-description",
        heading: "2. Service Description",
        content: [
          { type: "p", text: "The Greps CRM provides a cloud-based customer relationship management platform with WhatsApp marketing capabilities designed for retail businesses. Features include:" },
          { type: "ul", items: ["Customer database management", "Product catalogue creation", "WhatsApp campaign broadcasting", "Analytics and reporting dashboards", "Multi-store management"] },
          { type: "p", text: "We reserve the right to modify, suspend, or discontinue any part of the service at any time, with reasonable notice where feasible." },
        ],
      },
      {
        id: "accounts",
        heading: "3. Accounts & Responsibilities",
        content: [
          { type: "h3", text: "Account Security" },
          { type: "p", text: "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately at security@The Grepscrm.com if you suspect unauthorised access." },
          { type: "h3", text: "Accurate Information" },
          { type: "p", text: "You agree to provide accurate, complete, and up-to-date information when creating your account and to keep this information current." },
        ],
      },
      {
        id: "acceptable-use",
        heading: "4. Acceptable Use",
        content: [
          { type: "p", text: "You agree NOT to use The Greps CRM to:" },
          { type: "ul", items: ["Send unsolicited messages (spam) to individuals who have not opted in", "Violate WhatsApp Business Policy or any applicable law", "Upload malicious code, viruses, or disruptive content", "Attempt to gain unauthorised access to our systems", "Resell or sublicense the service without written permission", "Use the platform for activities that are illegal under Indian law"] },
        ],
      },
      {
        id: "billing",
        heading: "5. Billing & Payments",
        content: [
          { type: "p", text: "Paid plans are billed monthly or annually in advance. All prices are in Indian Rupees (INR) and are exclusive of applicable GST. Refund policy:" },
          { type: "ul", items: ["Annual plans: Pro-rated refund if cancelled within 14 days of billing", "Monthly plans: No refunds; access continues until the end of the billing period", "Free plan: No payment required, no refunds applicable"] },
        ],
      },
      {
        id: "intellectual-property",
        heading: "6. Intellectual Property",
        content: [
          { type: "p", text: "The Greps CRM and its original content, features, and functionality are and will remain the exclusive property of The Greps Technologies Pvt. Ltd. You may not copy, modify, or distribute our platform without express written consent. Your content (customer data, product listings) remains your property." },
        ],
      },
      {
        id: "limitation",
        heading: "7. Limitation of Liability",
        content: [
          { type: "p", text: "To the maximum extent permitted by law, The Greps CRM shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of revenue, data, or business opportunities. Our total aggregate liability shall not exceed the fees paid by you in the 3 months preceding the claim." },
        ],
      },
      {
        id: "governing-law",
        heading: "8. Governing Law",
        content: [
          { type: "p", text: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi. We encourage resolution through mediation before litigation." },
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie Policy",
    updated: "June 14, 2025",
    effective: "July 1, 2025",
    intro: "This Cookie Policy explains how The Greps CRM uses cookies and similar tracking technologies when you visit our website or use our product.",
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. What Are Cookies",
        content: [
          { type: "p", text: "Cookies are small text files stored on your browser when you visit a website. They help websites remember information about your visit, making future visits more efficient and the site more useful to you." },
          { type: "p", text: "We also use similar technologies including local storage, session storage, and web beacons (tracking pixels) for analytics purposes." },
        ],
      },
      {
        id: "types-of-cookies",
        heading: "2. Types of Cookies We Use",
        content: [
          { type: "h3", text: "Strictly Necessary Cookies" },
          { type: "p", text: "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to your actions, such as logging in or filling in forms. You can set your browser to block them, but some parts of the site will not work." },
          { type: "h3", text: "Analytics & Performance Cookies" },
          { type: "p", text: "These cookies help us understand how visitors interact with our website. All data is anonymised and aggregated. We use PostHog and Google Analytics for this purpose." },
          { type: "h3", text: "Functional Cookies" },
          { type: "p", text: "These cookies allow us to remember your preferences (such as language or region) and provide enhanced, personalised features." },
          { type: "h3", text: "Marketing Cookies" },
          { type: "p", text: "We may use these to show you relevant advertisements on third-party websites. You can opt out at any time through your cookie preferences." },
        ],
      },
      {
        id: "third-party",
        heading: "3. Third-Party Cookies",
        content: [
          { type: "p", text: "Some cookies are placed by third-party services that appear on our pages:" },
          { type: "ul", items: ["Google Analytics — Website traffic analysis", "PostHog — Product analytics and session replay (anonymised)", "Intercom — Customer support chat widget", "Razorpay — Payment processing and fraud prevention", "LinkedIn Insight Tag — B2B advertising performance"] },
          { type: "p", text: "Each of these providers has their own privacy and cookie policies, which we encourage you to review." },
        ],
      },
      {
        id: "managing-cookies",
        heading: "4. Managing Your Cookie Preferences",
        content: [
          { type: "p", text: "You have several options for managing cookies:" },
          { type: "ul", items: ["Browser settings: Most browsers allow you to refuse or delete cookies via their settings", "Our cookie banner: Click 'Manage Preferences' at any time to update your choices", "Opt-out tools: Use industry opt-out mechanisms like NAI opt-out or Google Analytics Opt-out Browser Add-on", "Do Not Track: We honour DNT signals from supported browsers"] },
          { type: "p", text: "Note that disabling certain cookies may affect the functionality of our website and product." },
        ],
      },
      {
        id: "retention",
        heading: "5. Cookie Retention Periods",
        content: [
          { type: "p", text: "Different cookies have different lifespans:" },
          { type: "ul", items: ["Session cookies: Deleted when you close your browser", "Authentication tokens: 30 days (or until logout)", "Preference cookies: 1 year", "Analytics cookies: Up to 2 years", "Marketing cookies: Up to 90 days"] },
        ],
      },
      {
        id: "updates",
        heading: "6. Updates to This Policy",
        content: [
          { type: "p", text: "We may update this Cookie Policy periodically. When we do, we will update the 'Last updated' date at the top of this page and, if changes are significant, notify you through the product or by email." },
        ],
      },
    ],
  },
};

/* ─────────────────────────────────────────────
   RENDER CONTENT BLOCK
───────────────────────────────────────────── */
function ContentBlock({ block }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="text-[17px] font-black text-slate-800 mt-8 mb-3 tracking-tight">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-slate-600 text-[15px] leading-[1.85] mb-4">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mb-5 space-y-2 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 text-[15px] leading-[1.75]">
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${scrolled ? "bg-white/96 shadow-sm border-b border-gray-100" : "bg-white/80"}`}>
      <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-base shadow-md">📲</div>
          <span className="font-extrabold text-[16px] text-gray-900 tracking-tight">
            The Greps <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">CRM</span>
          </span>
        </div>
        <a href="#" className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[9px] px-4 py-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
          Start Free Trial
        </a>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   MAIN LEGAL PAGE COMPONENT
───────────────────────────────────────────── */
export default function LegalPage() {
  const { type } = useParams();
  const [activeDoc, setActiveDoc] = useState("privacy");
  const [activeSection, setActiveSection] = useState("");
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const doc = DOCS[activeDoc];
  useEffect(()=>{
 if(type){
   setActiveDoc(type);
 }
},[type]);
  <>
    <style>...</style>
    <NavBar />
   <div className="legal-page pt-[64px] min-h-screen">
      {/* baaki sab same */}
    </div>
  </>

  /* Register section refs */
  const registerRef = useCallback((id, el) => {
    if (el) sectionRefs.current[id] = el;
  }, []);

  /* Intersection observer for active TOC link */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topmost.target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach(el => observer.observe(el));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [activeDoc]);

  /* Reset on doc change */
  useEffect(() => {
    sectionRefs.current = {};
    setActiveSection(doc.sections[0]?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeDoc]);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; background: #f8f9fc; color: #1e293b; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #818cf8; }
      `}</style>
      <NavBar />

      <div className="pt-[64px] min-h-screen">
        {/* ── Page Header ── */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-12 text-center">
            {/* Doc switcher tabs */}
            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8">
              {Object.entries(DOCS).map(([key, d]) => (
                <button
                  key={key}
                  onClick={() => setActiveDoc(key)}
                  className={`px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all duration-150 ${
                    activeDoc === key
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {d.title}
                </button>
              ))}
            </div>

            <h1 className="text-[clamp(30px,5vw,48px)] font-black text-slate-900 tracking-[-0.04em] leading-tight mb-3">
              {doc.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13.5px] text-slate-400 font-medium">
              <span>Last updated: <span className="text-slate-600 font-semibold">{doc.updated}</span></span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Effective: <span className="text-slate-600 font-semibold">{doc.effective}</span></span>
            </div>

            {/* Intro */}
            <p className="mt-5 text-[15.5px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {doc.intro}
            </p>

            {/* Quick chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { icon: "🔒", label: "GDPR-aligned" },
                { icon: "🇮🇳", label: "IT Act 2000" },
                { icon: "📜", label: "Plain English" },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-[11.5px] font-bold">
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── Main: Sidebar + Content ── */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex gap-8 items-start">

            {/* ─ Left Sidebar TOC ─ */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-[84px]">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Contents</p>
                </div>

                <nav className="py-2">
                  {doc.sections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left flex items-start gap-0 group transition-all duration-150 ${isActive ? "" : "hover:bg-gray-50"}`}
                      >
                        {/* Active bar */}
                        <span className={`w-0.5 self-stretch flex-shrink-0 transition-all duration-200 ${isActive ? "bg-indigo-500" : "bg-transparent group-hover:bg-indigo-200"}`} />
                        <span className={`px-4 py-2.5 text-[13px] font-medium leading-snug transition-colors duration-150 ${isActive ? "text-indigo-600 font-bold" : "text-slate-500 group-hover:text-slate-700"}`}>
                          {sec.heading}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Contact quick link */}
                <div className="mx-4 mb-4 mt-2 rounded-xl bg-indigo-50 border border-indigo-100 p-3.5 text-center">
                  <p className="text-[11.5px] text-indigo-500 font-semibold mb-1">Questions about this policy?</p>
                  <a href="mailto:legal@The Grepscrm.com" className="text-[12px] font-black text-indigo-700 hover:underline">
                    legal@The Grepscrm.com
                  </a>
                </div>
              </div>

              {/* Other docs */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Other Legal Docs</p>
                </div>
                {Object.entries(DOCS).filter(([k]) => k !== activeDoc).map(([key, d]) => (
                  <button key={key} onClick={() => setActiveDoc(key)}
                    className="w-full flex items-center justify-between px-5 py-3 text-[13px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium border-b border-gray-50 last:border-0">
                    {d.title}
                    <span className="text-gray-300 text-xs">→</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* ─ Right Content Area ─ */}
            <main ref={contentRef} className="flex-1 min-w-0">
              {/* Mobile TOC */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Jump to section</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.sections.map(sec => (
                      <button key={sec.id} onClick={() => scrollToSection(sec.id)}
                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          activeSection === sec.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-gray-50 text-slate-600 border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                        }`}>
                        {sec.heading.split(". ")[1] || sec.heading}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-2">
                {doc.sections.map((sec, idx) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    ref={el => registerRef(sec.id, el)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 scroll-mt-[90px]"
                  >
                    <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-5 pb-4 border-b border-gray-50 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[12px] font-black flex-shrink-0 shadow-sm">
                        {idx + 1}
                      </span>
                      {sec.heading.split(". ").slice(1).join(". ") || sec.heading}
                    </h2>
                    <div>
                      {sec.content.map((block, i) => (
                        <ContentBlock key={i} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-6 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 px-8 py-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-[14px] mb-0.5">This document was last reviewed by our legal team</p>
                  <p className="text-slate-500 text-[13px]">
                    {doc.updated} · Questions? <a href="mailto:legal@The Grepscrm.com" className="text-indigo-600 font-semibold hover:underline">legal@The Grepscrm.com</a>
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 text-[13px] font-bold rounded-xl px-4 py-2 hover:bg-indigo-50 transition-colors shadow-sm">
                  🖨 Print / Save PDF
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>

     
    </>
  );
}
