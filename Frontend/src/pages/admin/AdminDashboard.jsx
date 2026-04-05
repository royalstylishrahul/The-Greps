import { 
useState,
useEffect,
useRef,
useCallback,
createContext,
useContext
} from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

/* ============================================================
   GLOBAL STATE CONTEXT
   ============================================================ */
const AppContext = createContext(null);


const INITIAL_STORES = [
  { id: 1, name: "FreshMart Delhi", owner: "Rajesh Kumar", email: "rajesh@freshmart.in", plan: "Enterprise", status: "Active", joined: "Jan 12, 2026", customers: 4820, messages: 12400 },
  { id: 2, name: "TechBazaar Mumbai", owner: "Priya Sharma", email: "priya@techbazaar.co", plan: "Pro", status: "Active", joined: "Feb 3, 2026", customers: 2310, messages: 6700 },
  { id: 3, name: "StyleHouse Pune", owner: "Ankit Joshi", email: "ankit@stylehouse.in", plan: "Starter", status: "Trial", joined: "Mar 1, 2026", customers: 430, messages: 890 },
  { id: 4, name: "GreenGrocer BLR", owner: "Meena Nair", email: "meena@greengrocer.io", plan: "Pro", status: "Active", joined: "Feb 18, 2026", customers: 1890, messages: 5200 },
  { id: 5, name: "AutoParts Chennai", owner: "Suresh Raj", email: "suresh@autoparts.in", plan: "Enterprise", status: "Suspended", joined: "Jan 28, 2026", customers: 3100, messages: 9800 },
];

const INITIAL_SUBSCRIPTIONS = [
  { id: 1, store: "FreshMart Delhi", plan: "Enterprise", amount: "$149/mo", nextBilling: "Apr 12, 2026", status: "Active" },
  { id: 2, store: "TechBazaar Mumbai", plan: "Pro", amount: "$79/mo", nextBilling: "Apr 3, 2026", status: "Active" },
  { id: 3, store: "GreenGrocer BLR", plan: "Pro", amount: "$79/mo", nextBilling: "Apr 18, 2026", status: "Active" },
  { id: 4, store: "KidsWorld Kolkata", plan: "Starter", amount: "$29/mo", nextBilling: "Apr 5, 2026", status: "Active" },
];

const INITIAL_FAILED = [
  { id: 1, store: "StyleHouse Pune", amount: "$49.00", date: "Mar 27, 2026", reason: "Card Declined", retries: 2 },
  { id: 2, store: "AutoParts Chennai", amount: "$149.00", date: "Mar 25, 2026", reason: "Insufficient Funds", retries: 1 },
  { id: 3, store: "MediStore Nagpur", amount: "$29.00", date: "Mar 22, 2026", reason: "Expired Card", retries: 3 },
];

const NOTIFICATIONS = [
  { id: 1, type: "error", title: "WhatsApp API Error", msg: "AutoParts Chennai gateway failed", time: "5m ago", read: false },
  { id: 2, type: "warning", title: "Failed Payment", msg: "StyleHouse Pune payment declined", time: "22m ago", read: false },
  { id: 3, type: "info", title: "New Signup", msg: "FarmFresh Jaipur joined on Starter plan", time: "1h ago", read: true },
];

const REVENUE_DATA = [
  { month: "Jan", current: 82000, previous: 60000 },
  { month: "Feb", current: 95000, previous: 72000 },
  { month: "Mar", current: 88000, previous: 68000 },
  { month: "Apr", current: 102000, previous: 80000 },
  { month: "May", current: 110000, previous: 85000 },
  { month: "Jun", current: 108000, previous: 88000 },
  { month: "Jul", current: 125000, previous: 95000 },
  { month: "Aug", current: 118000, previous: 100000 },
  { month: "Sep", current: 135000, previous: 112000 },
  { month: "Oct", current: 142000, previous: 118000 },
  { month: "Nov", current: 158000, previous: 130000 },
  { month: "Dec", current: 186420, previous: 145000 },
];

function AppProvider({ children }) {
  const [route, setRoute] = useState("dashboard");
  const [stores, setStores] = useState(INITIAL_STORES);
  const [subscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [failedPayments] = useState(INITIAL_FAILED);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState({
    wapiKey: "WA-sk-prod-xK9mN2pQ7rL4vJ",
    stripeKey: "sk_live_51Hb3K2...",
    razorpayKey: "rzp_live_KmN9pQ7rL4vJ",
    webhookUrl: "https://api.stockalert.io/webhooks",
  });

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const markNotificationsRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  const toggleStoreStatus = (id) => {
    setStores(prev => prev.map(s => {
      if (s.id !== id) return s;
      const newStatus = s.status === "Active" ? "Suspended" : "Active";
      return { ...s, status: newStatus };
    }));
    addToast("Store status updated successfully");
  };

  const deleteStore = (id) => {
    setStores(prev => prev.filter(s => s.id !== id));
    addToast("Store deleted", "error");
  };

  const addStore = (data) => {
    const newStore = {
      id: Date.now(),
      name: data.name,
      owner: data.owner,
      email: data.email,
      plan: data.plan,
      status: "Active",
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      customers: 0,
      messages: 0,
    };
    setStores(prev => [newStore, ...prev]);
    addToast("New store added successfully!");
  };

  const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "/";
};

  return (
    <AppContext.Provider value={{
      route, setRoute,
      stores, toggleStoreStatus, deleteStore, addStore,
      subscriptions, failedPayments,
      notifications, markNotificationsRead,
      toasts, addToast,
      isLoggedIn, logout,
      searchQuery, setSearchQuery,
      settings, setSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

/* ============================================================
   UTILITY COMPONENTS
   ============================================================ */
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} style={{
          animation: "slideUp 0.3s ease",
          background: t.type === "error" ? "#fee2e2" : t.type === "warning" ? "#fef9c3" : "#f0fdf4",
          borderLeft: `4px solid ${t.type === "error" ? "#ef4444" : t.type === "warning" ? "#f59e0b" : "#22c55e"}`,
          padding: "12px 16px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: "10px", minWidth: "280px", maxWidth: "360px"
        }}>
          <span style={{ fontSize: "18px" }}>
            {t.type === "error" ? "🗑️" : t.type === "warning" ? "⚠️" : "✅"}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function Badge({ label, variant }) {
  const styles = {
    Active: { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" },
    Trial: { bg: "#fef9c3", color: "#a16207", border: "#fde68a" },
    Suspended: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
    Enterprise: { bg: "linear-gradient(135deg,#ede9fe,#e0e7ff)", color: "#6366f1", border: "#c4b5fd" },
    Pro: { bg: "#ede9fe", color: "#7c3aed", border: "#c4b5fd" },
    Starter: { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  };
  const s = styles[label] || styles.Starter;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: "42px", height: "22px", borderRadius: "999px",
      background: checked ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#e2e8f0",
      border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute", top: "3px",
        left: checked ? "22px" : "3px",
        width: "16px", height: "16px", borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function Spinner({ size = 16, color = "#fff" }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2px solid ${color}30`, borderTop: `2px solid ${color}`,
      borderRadius: "50%", animation: "spin 0.7s linear infinite",
    }} />
  );
}

/* ============================================================
   ADMIN LAYOUT
   ============================================================ */
function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { route, setRoute, notifications, markNotificationsRead, logout, searchQuery, setSearchQuery, toasts } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/admin", { replace: true });
  }

}, [navigate]);

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "stores", label: "Stores", icon: "🏪" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "system", label: "System Health", icon: "⚡" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        input:focus, textarea:focus, select:focus { outline: none; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: "240px", background: "linear-gradient(180deg,#0f172a 0%,#1e1b4b 100%)",
        display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0,
            }}>🔔</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.3px" }}>StockAlert</div>
              <div style={{ color: "#94a3b8", fontSize: "11px" }}>CRM Platform</div>
            </div>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "6px", padding: "4px 10px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6" }} />
            <span style={{ color: "#a78bfa", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Master Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(item => {
            const active = route === item.id;
            return (
              <button key={item.id} onClick={() => setRoute(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                background: active ? "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))" : "transparent",
                borderLeft: active ? "3px solid #6366f1" : "3px solid transparent",
                color: active ? "#e0e7ff" : "#94a3b8",
                fontSize: "13.5px", fontWeight: active ? 600 : 400,
                transition: "all 0.15s", textAlign: "left",
                fontFamily: "inherit",
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom User */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "13px", flexShrink: 0,
            }}>SA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: "12.5px", fontWeight: 600 }}>Super Admin</div>
              <div style={{ color: "#64748b", fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>admin@stockalert.io</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* HEADER */}
        <header style={{
          height: "60px", background: "#fff", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", padding: "0 24px", gap: "16px",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 1px 0 #e2e8f0",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>
              {navItems.find(n => n.id === route)?.label || "Dashboard"}
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px" }}>🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stores, users..."
              style={{
                paddingLeft: "32px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px",
                border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "13px",
                color: "#334155", background: "#f8fafc", width: "220px",
                transition: "border-color 0.15s", fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button onClick={() => { setNotifOpen(p => !p); markNotificationsRead(); }} style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", position: "relative",
            }}>
              🔔
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: "4px", right: "4px",
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff", fontSize: "9px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unread}</span>
              )}
            </button>

            {notifOpen && (
              <div style={{
                position: "absolute", top: "44px", right: 0, width: "300px",
                background: "#fff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0", zIndex: 100, animation: "fadeIn 0.15s ease",
                overflow: "hidden",
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>
                  Notifications
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} style={{
                    padding: "12px 16px", borderBottom: "1px solid #f8fafc",
                    display: "flex", gap: "10px", alignItems: "flex-start",
                    background: n.read ? "#fff" : "#fafafe",
                  }}>
                    <span style={{ fontSize: "16px", marginTop: "1px" }}>
                      {n.type === "error" ? "🔴" : n.type === "warning" ? "🟡" : "🔵"}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "12.5px", color: "#1e293b" }}>{n.title}</div>
                      <div style={{ color: "#64748b", fontSize: "11.5px", marginTop: "2px" }}>{n.msg}</div>
                      <div style={{ color: "#94a3b8", fontSize: "10.5px", marginTop: "3px" }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button onClick={() => setProfileOpen(p => !p)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px",
              padding: "5px 12px 5px 5px", cursor: "pointer",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: "11px",
              }}>SA</div>
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}>Admin</span>
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>▼</span>
            </button>

            {profileOpen && (
              <div style={{
                position: "absolute", top: "44px", right: 0, width: "180px",
                background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0", zIndex: 100, animation: "fadeIn 0.15s ease",
                overflow: "hidden",
              }}>
                {[
                  { label: "⚙️  Platform Settings", action: () => { setRoute("settings"); setProfileOpen(false); } },
                  { label: "🔒  Secure Logout", action: () => logout(), danger: true },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{
                    width: "100%", padding: "11px 16px", border: "none", background: "transparent",
                    textAlign: "left", cursor: "pointer", fontSize: "13px",
                    color: item.danger ? "#ef4444" : "#334155", fontWeight: item.danger ? 600 : 400,
                    fontFamily: "inherit",
                    borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >{item.label}</button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}


function DashboardPage() {
const { stores = [] } = useApp() || {};

const totalCustomers = stores.reduce((a, s) => a + (s.customers || 0), 0);

const totalMessages = stores.reduce((a, s) => a + (s.messages || 0), 0);

  const kpis = [
    { label: "Total Registered Stores", value: stores.length, sub: "+2 this week", color: "#6366f1", bg: "#eef2ff", icon: "🏪" },
    { label: "Active Customers", value: totalCustomers.toLocaleString(), sub: "Managed globally", color: "#8b5cf6", bg: "#f5f3ff", icon: "👥" },
    { label: "Monthly Recurring Revenue", value: "$186,420", sub: "+12.4% vs last month", color: "#10b981", bg: "#ecfdf5", icon: "💰" },
    { label: "WhatsApp Messages Sent", value: `${(totalMessages / 1000).toFixed(1)}k`, sub: "Platform total", color: "#f59e0b", bg: "#fffbeb", icon: "💬" },
  ];

  const recentStores = [...stores].slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: "14px", padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)",
            border: "1px solid #f1f5f9",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: k.bg, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1 }}>{k.value}</div>
            <div style={{ color: "#64748b", fontSize: "12px", marginTop: "6px" }}>{k.label}</div>
            <div style={{ color: k.color, fontSize: "11.5px", fontWeight: 600, marginTop: "6px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Revenue Growth (MRR)</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>2026 vs 2025 · hover for details</div>
            </div>
            <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#64748b" }}>
              <span>● <span style={{ color: "#6366f1" }}>2026</span></span>
              <span>● <span style={{ color: "#cbd5e1" }}>2025</span></span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${v / 1000}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="current" name="2026" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="previous" name="2025" stroke="#e2e8f0" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Plan Distribution</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>By store count</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={[
              { plan: "Starter", count: stores.filter(s => s.plan === "Starter").length },
              { plan: "Pro", count: stores.filter(s => s.plan === "Pro").length },
              { plan: "Ent.", count: stores.filter(s => s.plan === "Enterprise").length },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="plan" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "#f8fafc" }} content={({ active, payload }) => active && payload?.length ? (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}>
                  <strong>{payload[0].value}</strong> stores
                </div>
              ) : null} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Recent Store Activity</div>
          <button onClick={() => {}} style={{ fontSize: "12.5px", color: "#6366f1", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Store Name", "Owner", "Plan", "Status", "Joined"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentStores.map((s, i) => (
              <tr key={s.id} style={{ borderTop: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafe"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{s.name}</td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>{s.owner}</td>
                <td style={{ padding: "12px 16px" }}><Badge label={s.plan} /></td>
                <td style={{ padding: "12px 16px" }}><Badge label={s.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: "12.5px", color: "#94a3b8" }}>{s.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   STORE MANAGEMENT PAGE
   ============================================================ */
function AddStoreModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", owner: "", email: "", plan: "Starter" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Store name required";
    if (!form.owner.trim()) e.owner = "Owner name required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { onAdd(form); setLoading(false); onClose(); }, 800);
  };

  const field = (key, label, type = "text", opts = null) => (
    <div key={key} style={{ marginBottom: "14px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{
          width: "100%", padding: "9px 12px", border: `1.5px solid ${errors[key] ? "#fca5a5" : "#e2e8f0"}`,
          borderRadius: "9px", fontSize: "13px", color: "#1e293b", background: "#fff", fontFamily: "inherit",
        }}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: "" })); }}
          style={{
            width: "100%", padding: "9px 12px", border: `1.5px solid ${errors[key] ? "#fca5a5" : "#e2e8f0"}`,
            borderRadius: "9px", fontSize: "13px", color: "#1e293b", fontFamily: "inherit",
          }} />
      )}
      {errors[key] && <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "3px" }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
      backdropFilter: "blur(2px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: "18px", width: "440px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "modalIn 0.2s ease",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>Add New Store</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>✕</button>
        </div>
        <div style={{ padding: "24px" }}>
          {field("name", "Store Name")}
          {field("owner", "Owner Name")}
          {field("email", "Email Address", "email")}
          {field("plan", "Subscription Plan", "select", ["Starter", "Pro", "Enterprise"])}
          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
              background: "transparent", color: "#64748b", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={submit} style={{
              flex: 1, padding: "10px",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none", borderRadius: "10px", color: "#fff",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              fontFamily: "inherit",
            }}>
              {loading ? <><Spinner size={14} /> Adding...</> : "Add Store"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoresPage() {
  const { stores, toggleStoreStatus, deleteStore, addStore, searchQuery } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>Store Management</div>
          <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{filtered.length} stores found</div>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: "10px 18px",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff", border: "none", borderRadius: "10px",
          fontSize: "13px", fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px",
          fontFamily: "inherit", boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
        }}>
          <span style={{ fontSize: "16px" }}>+</span> Add New Store
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Store Name", "Owner / Email", "Plan", "Status", "Active", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>No stores match your search.</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} style={{ borderTop: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafe"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#1e293b" }}>{s.name}</div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: "13px", color: "#374151" }}>{s.owner}</div>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{s.email}</div>
                </td>
                <td style={{ padding: "14px 16px" }}><Badge label={s.plan} /></td>
                <td style={{ padding: "14px 16px" }}><Badge label={s.status} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <Toggle checked={s.status === "Active"} onChange={() => toggleStoreStatus(s.id)} />
                </td>
                <td style={{ padding: "14px 16px", fontSize: "12.5px", color: "#94a3b8" }}>{s.joined}</td>
                <td style={{ padding: "14px 16px", position: "relative" }}>
                  <div ref={openMenu === s.id ? menuRef : null}>
                    <button onClick={() => setOpenMenu(p => p === s.id ? null : s.id)} style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      border: "1.5px solid #e2e8f0", background: "#fff",
                      cursor: "pointer", fontSize: "16px",
                      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit",
                    }}>⋮</button>
                    {openMenu === s.id && (
                      <div style={{
                        position: "absolute", right: "16px", top: "40px", zIndex: 50,
                        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)", width: "150px",
                        animation: "fadeIn 0.12s ease", overflow: "hidden",
                      }}>
                        <button onClick={() => setOpenMenu(null)} style={{
                          width: "100%", padding: "10px 14px", background: "none", border: "none",
                          textAlign: "left", fontSize: "13px", color: "#374151", cursor: "pointer", fontFamily: "inherit",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >👁 View Details</button>
                        <button onClick={() => { deleteStore(s.id); setOpenMenu(null); }} style={{
                          width: "100%", padding: "10px 14px", background: "none", border: "none",
                          textAlign: "left", fontSize: "13px", color: "#ef4444", fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit", borderTop: "1px solid #f1f5f9",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >🗑 Delete Store</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <AddStoreModal onClose={() => setShowModal(false)} onAdd={addStore} />}
    </div>
  );
}

/* ============================================================
   BILLING PAGE
   ============================================================ */
function BillingPage() {
  const { subscriptions, failedPayments } = useApp();
  const [tab, setTab] = useState("active");

  return (
    <div>
      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Billing & Subscriptions</div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Active Subscriptions", value: subscriptions.length, color: "#6366f1", bg: "#eef2ff" },
          { label: "MRR", value: "$186,420", color: "#10b981", bg: "#ecfdf5" },
          { label: "Failed Payments", value: failedPayments.length, color: "#ef4444", bg: "#fef2f2" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "18px 20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ color: s.color, fontSize: "26px", fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: "12.5px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", borderRadius: "10px", padding: "4px", width: "fit-content", marginBottom: "20px" }}>
        {[["active", "Active Subscriptions"], ["failed", "Failed Payments"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "8px 18px", borderRadius: "7px", border: "none",
            background: tab === id ? "#fff" : "transparent",
            color: tab === id ? "#6366f1" : "#64748b",
            fontWeight: tab === id ? 700 : 400, fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {tab === "active"
                ? ["Store", "Plan", "Amount", "Next Billing", "Status"]
                : ["Store", "Amount", "Failed Date", "Reason", "Retries"]
              }.map(h = (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))
            </tr>
          </thead>
          <tbody>
            {tab === "active" ? subscriptions.map(s => (
              <tr key={s.id} style={{ borderTop: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafe"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: "13.5px", color: "#1e293b" }}>{s.store}</td>
                <td style={{ padding: "13px 16px" }}><Badge label={s.plan} /></td>
                <td style={{ padding: "13px 16px", color: "#10b981", fontWeight: 700, fontSize: "13.5px" }}>{s.amount}</td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "13px" }}>{s.nextBilling}</td>
                <td style={{ padding: "13px 16px" }}><Badge label={s.status} /></td>
              </tr>
            )) : failedPayments.map(f => (
              <tr key={f.id} style={{ borderTop: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: "13.5px", color: "#1e293b" }}>{f.store}</td>
                <td style={{ padding: "13px 16px", color: "#ef4444", fontWeight: 700, fontSize: "13.5px" }}>{f.amount}</td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "13px" }}>{f.date}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", padding: "2px 8px", fontSize: "11.5px", fontWeight: 600 }}>{f.reason}</span>
                </td>
                <td style={{ padding: "13px 16px", color: "#94a3b8", fontSize: "13px" }}>{f.retries} attempts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   SYSTEM HEALTH PAGE
   ============================================================ */
function SystemPage() {
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1500); return () => clearInterval(t); }, []);

  const services = [
    { name: "API Gateway", latency: "42ms", status: "healthy", uptime: "99.98%" },
    { name: "WhatsApp Gateway", latency: "Operational", status: "healthy", uptime: "99.95%" },
    { name: "Database Cluster", latency: "18ms", status: "healthy", uptime: "100%" },
    { name: "Auth Service", latency: "8ms", status: "healthy", uptime: "100%" },
    { name: "Error Rate (24h)", latency: "0.12%", status: "warning", uptime: "—" },
    { name: "CDN", latency: "Operational", status: "healthy", uptime: "99.99%" },
  ];

  const logs = [
    { time: "03:42:11", level: "ERROR", msg: "AutoParts Chennai: WA webhook delivery failed (timeout)" },
    { time: "03:40:55", level: "WARN", msg: "StyleHouse Pune: Billing retry #2 failed" },
    { time: "03:38:00", level: "INFO", msg: "FreshMart Delhi: 1,200 messages dispatched successfully" },
    { time: "03:35:20", level: "INFO", msg: "Database compaction complete. Freed 2.4GB." },
    { time: "03:30:10", level: "WARN", msg: "API Gateway: Rate limit hit by TechBazaar Mumbai" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>System Health</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: "999px", padding: "4px 12px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", opacity: pulse ? 1 : 0.4, transition: "opacity 0.5s" }} />
          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#16a34a" }}>All Systems Operational</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {services.map((s, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: "12px", padding: "18px 20px",
            border: `1px solid ${s.status === "warning" ? "#fde68a" : "#f1f5f9"}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#1e293b" }}>{s.name}</div>
              <span style={{
                fontSize: "10.5px", fontWeight: 600, borderRadius: "999px", padding: "2px 8px",
                background: s.status === "warning" ? "#fef9c3" : "#dcfce7",
                color: s.status === "warning" ? "#a16207" : "#16a34a",
                border: `1px solid ${s.status === "warning" ? "#fde68a" : "#bbf7d0"}`,
              }}>{s.status === "warning" ? "Warning" : "Healthy"}</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: s.status === "warning" ? "#f59e0b" : "#6366f1" }}>{s.latency}</div>
            <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "4px" }}>Uptime: {s.uptime}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#0f172a", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Error Logs</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", opacity: pulse ? 1 : 0.3, transition: "opacity 0.5s" }} />
        </div>
        <div style={{ padding: "12px 0", fontFamily: "'Fira Code','Courier New',monospace" }}>
          {logs.map((l, i) => (
            <div key={i} style={{
              padding: "6px 20px", fontSize: "12px",
              color: l.level === "ERROR" ? "#fca5a5" : l.level === "WARN" ? "#fde68a" : "#94a3b8",
              display: "flex", gap: "14px",
            }}>
              <span style={{ color: "#475569", flexShrink: 0 }}>{l.time}</span>
              <span style={{ flexShrink: 0, fontWeight: 700, minWidth: "42px" }}>[{l.level}]</span>
              <span>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS PAGE
   ============================================================ */
function SettingsPage() {
  const { settings, setSettings, addToast } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [visible, setVisible] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSettings(form);
      setSaving(false);
      addToast("Configuration saved successfully!");
    }, 2000);
  };

  const fields = [
    { key: "wapiKey", label: "Global WhatsApp API Key", icon: "💬", secret: true },
    { key: "stripeKey", label: "Stripe Secret Key", icon: "💳", secret: true },
    { key: "razorpayKey", label: "Razorpay Key", icon: "🔑", secret: true },
    { key: "webhookUrl", label: "Webhook Endpoint URL", icon: "🔗", secret: false },
  ];

  return (
    <div>
      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>Platform Settings</div>
      <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px" }}>Manage global API keys and platform configuration.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "4px" }}>API Configuration</div>
          <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "20px" }}>Update your integration keys below.</div>

          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                <span>{f.icon}</span> {f.label}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={f.secret && !visible[f.key] ? "password" : "text"}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{
                    width: "100%", padding: "9px 36px 9px 12px",
                    border: "1.5px solid #e2e8f0", borderRadius: "9px",
                    fontSize: "13px", color: "#1e293b", fontFamily: "'Fira Code','Courier New',monospace",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                {f.secret && (
                  <button onClick={() => setVisible(p => ({ ...p, [f.key]: !p[f.key] }))} style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#94a3b8",
                  }}>{visible[f.key] ? "🙈" : "👁"}</button>
                )}
              </div>
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} style={{
            marginTop: "8px", width: "100%", padding: "11px",
            background: saving ? "#e2e8f0" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: saving ? "#94a3b8" : "#fff", border: "none", borderRadius: "10px",
            fontSize: "13.5px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            fontFamily: "inherit", boxShadow: saving ? "none" : "0 2px 8px rgba(99,102,241,0.3)",
            transition: "all 0.2s",
          }}>
            {saving ? <><Spinner size={15} color="#94a3b8" /> Saving Configuration...</> : "💾  Save Configuration"}
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "4px" }}>Platform Info</div>
          <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "20px" }}>Version and environment details.</div>
          {[
            ["Platform Version", "v3.4.1"],
            ["Environment", "Production"],
            ["Region", "ap-south-1 (Mumbai)"],
            ["Node Version", "20.11.0"],
            ["Last Deploy", "Mar 28, 2026 · 14:32 IST"],
            ["Database", "PostgreSQL 15.4"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f8fafc" }}>
              <span style={{ fontSize: "12.5px", color: "#64748b" }}>{k}</span>
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b", fontFamily: "'Fira Code',monospace" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
function AppContent() {
  const { route } = useApp();


  const pages = {
    dashboard: <DashboardPage />,
    stores: <StoresPage />,
    billing: <BillingPage />,
    system: <SystemPage />,
    settings: <SettingsPage />,
  };

  return (
    <AdminLayout>
      {pages[route] || <DashboardPage />}
    </AdminLayout>
  );
}


export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
