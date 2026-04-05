import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const gradientText = {
  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const btnPrimary = {
  background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "12px 26px",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 4px 18px rgba(99,102,241,0.25)",
  transition: "transform 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
  letterSpacing: "-0.01em",
};

const btnSecondary = {
  background: "#fff",
  color: "#3B82F6",
  border: "1.5px solid #c7d2fe",
  borderRadius: "10px",
  padding: "12px 26px",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  transition: "border-color 0.15s, background 0.15s",
  fontFamily: "inherit",
  letterSpacing: "-0.01em",
};

const sectionTitle = {
  fontSize: "clamp(28px, 4vw, 40px)",
  fontWeight: 800,
  color: "#111827",
  letterSpacing: "-0.03em",
  marginBottom: "12px",
  lineHeight: 1.15,
};

const sectionSub = {
  fontSize: "clamp(15px, 2vw, 18px)",
  color: "#6B7280",
  maxWidth: 580,
  margin: "0 auto 52px",
  lineHeight: 1.7,
  fontWeight: 400,
};

const card = {
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 2px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  padding: "28px 26px",
  border: "1px solid #f0f0f5",
  transition: "box-shadow 0.2s, transform 0.2s",
};

const features = [
  {
    icon: "👥",
    title: "Customer Management",
    desc: "Store, organise and segment your customers easily. Tag by location, purchase history, and more.",
  },
  {
    icon: "📦",
    title: "Product Management",
    desc: "Add products, manage offers, set prices and keep your catalogue updated in seconds.",
  },
  {
    icon: "💬",
    title: "WhatsApp Campaigns",
    desc: "Send personalised WhatsApp campaigns to filtered customer groups in one click.",
  },
  {
    icon: "🎯",
    title: "Smart Filters",
    desc: "Target customers by category, location, spending pattern or any custom attribute.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Track open rates, orders from campaigns and revenue growth with clear dashboards.",
  },
  {
    icon: "🏪",
    title: "Multi Store Support",
    desc: "Each store gets its own isolated CRM space — perfect for growing retail chains.",
  },
];

const steps = [
  {
    num: "01",
    icon: "👤",
    title: "Add Customers",
    desc: "Import or add customers manually. Capture name, phone, location and preferences.",
  },
  {
    num: "02",
    icon: "🛒",
    title: "Add Products",
    desc: "Build your product catalogue with images, prices and stock status.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Send Campaign & Get Orders",
    desc: "Select a segment, pick products, send the WhatsApp message and watch orders roll in.",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    highlight: false,
    badge: null,
    features: [
      "100 customers",
      "10 campaigns/month",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "5,000 customers",
      "Unlimited campaigns",
      "Advanced analytics",
      "Priority support",
      "Smart filters",
      "Multi-store (3 stores)",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: false,
    badge: null,
    features: [
      "Unlimited customers",
      "Unlimited campaigns",
      "Dedicated analytics",
      "Dedicated support",
      "Unlimited stores",
      "Custom integrations",
    ],
    cta: "Contact Sales",
  },
];

function DashboardMockup() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow:
          "0 8px 60px rgba(99,102,241,0.15), 0 2px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
        border: "1px solid #e8e8f0",
        fontFamily: "inherit",
        minWidth: 0,
        width: "100%",
      }}
    >
      {/* Window bar */}
      <div
        style={{
          background: "#f8f9ff",
          borderBottom: "1px solid #ececf5",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <div
            key={c}
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 10,
            background: "#e9eaf5",
            borderRadius: 6,
            padding: "3px 12px",
            fontSize: 11,
            color: "#888",
          }}
        >
          app.stockalertcrm.com
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", height: 320 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 52,
            background: "#1e1b4b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14,
            gap: 18,
          }}
        >
          {["👥", "📦", "💬", "📊", "⚙️"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: i === 0 ? "rgba(99,102,241,0.4)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "14px", overflow: "hidden" }}>
          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {[
              { label: "Customers", val: "1,240", trend: "+12%", color: "#6366f1" },
              { label: "Campaigns", val: "38", trend: "+5", color: "#8B5CF6" },
              { label: "Orders Today", val: "₹18K", trend: "+22%", color: "#3B82F6" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#f8f9ff",
                  borderRadius: 10,
                  padding: "8px 10px",
                  border: "1px solid #ececf5",
                }}
              >
                <div style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: s.color,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  {s.trend}
                </div>
              </div>
            ))}
          </div>

          {/* Customer table */}
          <div
            style={{
              background: "#f8f9ff",
              borderRadius: 10,
              border: "1px solid #ececf5",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 70px",
                padding: "6px 10px",
                borderBottom: "1px solid #e8e8f0",
                fontSize: 9,
                color: "#9ca3af",
                fontWeight: 600,
              }}
            >
              <span>CUSTOMER</span>
              <span>LOCATION</span>
              <span>ORDERS</span>
            </div>
            {[
              ["Priya Sharma", "Delhi", "12"],
              ["Rajan Mehta", "Mumbai", "7"],
              ["Sunita Devi", "Jaipur", "5"],
            ].map(([name, loc, orders], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 70px",
                  padding: "6px 10px",
                  borderBottom: i < 2 ? "1px solid #f0f0f8" : "none",
                  fontSize: 10,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `hsl(${i * 80 + 200}, 60%, 85%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: `hsl(${i * 80 + 200}, 60%, 30%)`,
                    }}
                  >
                    {name[0]}
                  </div>
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {name}
                  </span>
                </div>
                <span style={{ color: "#6b7280" }}>{loc}</span>
                <span
                  style={{
                    background: "#ede9fe",
                    color: "#7c3aed",
                    borderRadius: 5,
                    padding: "2px 6px",
                    fontWeight: 700,
                    fontSize: 9,
                    width: "fit-content",
                  }}
                >
                  {orders} orders
                </span>
              </div>
            ))}
          </div>

          {/* Product cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { name: "Basmati Rice 5kg", price: "₹450", tag: "In Stock" },
              { name: "Sunflower Oil 1L", price: "₹180", tag: "Offer" },
              { name: "Toor Dal 1kg", price: "₹140", tag: "In Stock" },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#f8f9ff",
                  borderRadius: 9,
                  padding: "7px 8px",
                  border: "1px solid #ececf5",
                }}
              >
                <div
                  style={{
                    height: 28,
                    borderRadius: 6,
                    background: `linear-gradient(135deg, hsl(${i * 50 + 220},80%,90%), hsl(${i * 50 + 250},80%,85%))`,
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  🛒
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#374151" }}>
                  {p.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#6366f1" }}>
                    {p.price}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      background: p.tag === "Offer" ? "#fef3c7" : "#d1fae5",
                      color: p.tag === "Offer" ? "#92400e" : "#065f46",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontWeight: 600,
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection({setPage}) {

const navigate = useNavigate();

return (
    <section
      style={{
        minHeight: "calc(100vh - 68px)",
        background:
          "radial-gradient(ellipse 80% 60% at 60% 0%, rgba(99,102,241,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 0% 80%, rgba(139,92,246,0.06) 0%, transparent 60%), #fafbff",
        display: "flex",
        alignItems: "center",
        paddingTop: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#ede9fe",
              color: "#7c3aed",
              borderRadius: 100,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 22,
              border: "1px solid #ddd6fe",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#7c3aed",
                display: "inline-block",
              }}
            />
            WhatsApp-Powered CRM for Retail
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 58px)",
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: 20,
            }}
          >
            Grow your store with{" "}
            <span style={gradientText}>WhatsApp marketing</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              color: "#6B7280",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 490,
            }}
          >
            Manage customers, add products and send WhatsApp campaigns in
            minutes with our simple CRM — built for small retail stores across
            India.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              style={btnPrimary}
              onClick={()=>navigate("/login?mode=signup")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              Start Free Trial →
            </button>
            <button
              style={btnSecondary}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f0ff";
                e.currentTarget.style.borderColor = "#a5b4fc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#c7d2fe";
              }}
            >
              ▶ View Demo
            </button>
          </div>
          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            {[
              ["🏪", "500+ Stores"],
              ["⭐", "4.9 Rating"],
              ["🔒", "Secure & Private"],
            ].map(([icon, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#6B7280",
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Dashboard Mockup */}
        <div style={{ position: "relative" }}>
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              background:
                "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <DashboardMockup />
          {/* Floating badge */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: -16,
              background: "#fff",
              borderRadius: 14,
              padding: "10px 16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              border: "1px solid #f0f0f5",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            <div>
              <div style={{ fontSize: 11, color: "#888" }}>WhatsApp sent</div>
              <div
                style={{ fontWeight: 800, color: "#22c55e", fontSize: 15 }}
              >
                1,240 messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        background: "#fff",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
            color: "#6366f1",
            borderRadius: 100,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          FEATURES
        </div>
        <h2 style={sectionTitle}>Everything your store needs</h2>
        <p style={sectionSub}>
          From managing customers to launching campaigns — StockAlert CRM puts
          the power of enterprise marketing in your hands.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 22,
            textAlign: "left",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{ ...card, cursor: "default" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 40px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background:
                    "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#111827",
                  marginBottom: 7,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background:
          "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
            color: "#6366f1",
            borderRadius: 100,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          HOW IT WORKS
        </div>
        <h2 style={sectionTitle}>Up and running in 3 steps</h2>
        <p style={sectionSub}>
          No complicated setup. No tech team needed. Just sign up, add your
          data, and send.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            textAlign: "left",
            position: "relative",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                ...card,
                background: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 52,
                  fontWeight: 900,
                  color: "#f3f4f6",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 18,
                  boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                }}
              >
                {s.icon}
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#111827",
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.65 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "96px 24px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
            color: "#6366f1",
            borderRadius: 100,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          DASHBOARD PREVIEW
        </div>
        <h2 style={{ ...sectionTitle, marginBottom: 14 }}>
          Powerful yet simple to use
        </h2>
        <p style={{ ...sectionSub, marginBottom: 50 }}>
          A CRM built specifically for retail store owners — not enterprise IT
          teams.
        </p>

        {/* Big mockup */}
        <div
          style={{
            background: "#0f0e1a",
            borderRadius: 22,
            padding: "0 0 0 0",
            boxShadow:
              "0 32px 80px rgba(99,102,241,0.22), 0 2px 20px rgba(0,0,0,0.15)",
            overflow: "hidden",
            border: "1px solid #2a2850",
          }}
        >
          {/* Window bar */}
          <div
            style={{
              background: "#1a183a",
              borderBottom: "1px solid #2a2850",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
            <div
              style={{
                marginLeft: 12,
                background: "#2a2850",
                borderRadius: 6,
                padding: "3px 16px",
                fontSize: 12,
                color: "#888",
              }}
            >
              app.stockalertcrm.com/dashboard
            </div>
          </div>
          <div style={{ display: "flex", height: 400 }}>
            {/* Sidebar */}
            <div
              style={{
                width: 200,
                background: "#13112a",
                borderRight: "1px solid #2a2850",
                padding: "16px 0",
              }}
            >
              <div style={{ padding: "0 12px 14px", marginBottom: 8, borderBottom: "1px solid #2a2850" }}>
                <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: "0.06em" }}>
                  STOCKALERT CRM
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                  Sharma Grocery Store
                </div>
              </div>
              {["👥 Customers", "📦 Products", "💬 Campaigns", "📊 Analytics", "🏪 Multi Store", "⚙️ Settings"].map(
                (item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "9px 14px",
                      fontSize: 12,
                      color: i === 0 ? "#fff" : "#888",
                      background: i === 0 ? "rgba(99,102,241,0.2)" : "transparent",
                      borderLeft: i === 0 ? "2px solid #6366f1" : "2px solid transparent",
                      cursor: "pointer",
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
            {/* Main */}
            <div
              style={{
                flex: 1,
                background: "#0f0e1a",
                padding: "18px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                  All Customers
                </span>
                <div
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Customer
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
                {[
                  ["Total", "1,240", "#6366f1"],
                  ["Active", "980", "#22c55e"],
                  ["New Today", "14", "#3B82F6"],
                  ["Campaign Sent", "3", "#8B5CF6"],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      background: "#1a183a",
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid #2a2850",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "#666" }}>{l}</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: c, letterSpacing: "-0.03em" }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Table */}
              <div
                style={{
                  background: "#1a183a",
                  borderRadius: 12,
                  border: "1px solid #2a2850",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 90px 90px 80px",
                    padding: "8px 14px",
                    borderBottom: "1px solid #2a2850",
                    fontSize: 10,
                    color: "#555",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  <span>NAME</span>
                  <span>PHONE</span>
                  <span>LOCATION</span>
                  <span>ORDERS</span>
                  <span>STATUS</span>
                </div>
                {[
                  ["Priya Sharma", "+91 98XXX XXXXX", "Delhi", "12", "Active"],
                  ["Rajan Mehta", "+91 87XXX XXXXX", "Mumbai", "7", "Active"],
                  ["Sunita Devi", "+91 76XXX XXXXX", "Jaipur", "5", "Inactive"],
                  ["Amit Gupta", "+91 99XXX XXXXX", "Pune", "9", "Active"],
                  ["Kavita Singh", "+91 70XXX XXXXX", "Lucknow", "3", "Active"],
                ].map(([name, phone, loc, orders, status], i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 90px 90px 80px",
                      padding: "9px 14px",
                      borderBottom: i < 4 ? "1px solid #231f42" : "none",
                      fontSize: 11,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: `hsl(${i * 60 + 200},55%,45%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {name[0]}
                      </div>
                      <span style={{ color: "#d1d5db", fontWeight: 600 }}>{name}</span>
                    </div>
                    <span style={{ color: "#666" }}>{phone}</span>
                    <span style={{ color: "#9ca3af" }}>{loc}</span>
                    <span style={{ color: "#9ca3af" }}>{orders}</span>
                    <span
                      style={{
                        background: status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(156,163,175,0.15)",
                        color: status === "Active" ? "#22c55e" : "#9ca3af",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 10,
                        fontWeight: 600,
                        width: "fit-content",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
            color: "#6366f1",
            borderRadius: 100,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          PRICING
        </div>
        <h2 style={sectionTitle}>Simple, transparent pricing</h2>
        <p style={{ ...sectionSub, marginBottom: 52 }}>
          Start free, scale as you grow. No hidden fees. Cancel anytime.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                ...card,
                background: p.highlight
                  ? "linear-gradient(160deg, #6366f1 0%, #8b5cf6 100%)"
                  : "#fff",
                border: p.highlight ? "none" : "1.5px solid #e8e8f0",
                padding: "32px 28px",
                position: "relative",
                transform: p.highlight ? "scale(1.04)" : "scale(1)",
              }}
            >
              {p.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fbbf24",
                    color: "#78350f",
                    borderRadius: 100,
                    padding: "3px 14px",
                    fontSize: 11,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.badge}
                </div>
              )}
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: p.highlight ? "rgba(255,255,255,0.8)" : "#6B7280",
                  marginBottom: 6,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: p.highlight ? "#fff" : "#111827",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {p.price}
                </span>
                {p.period && (
                  <span
                    style={{
                      fontSize: 15,
                      color: p.highlight ? "rgba(255,255,255,0.7)" : "#9ca3af",
                    }}
                  >
                    {p.period}
                  </span>
                )}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  textAlign: "left",
                }}
              >
                {p.features.map((f, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                      color: p.highlight ? "rgba(255,255,255,0.9)" : "#374151",
                      padding: "5px 0",
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: p.highlight
                          ? "rgba(255,255,255,0.2)"
                          : "#ede9fe",
                        color: p.highlight ? "#fff" : "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 10,
                  border: p.highlight ? "none" : "1.5px solid #c7d2fe",
                  background: p.highlight
                    ? "#fff"
                    : "transparent",
                  color: p.highlight ? "#6366f1" : "#6366f1",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({setPage}) {

const navigate = useNavigate();

return (
    <section
      style={{
        background: "#fff",
        padding: "96px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          borderRadius: 28,
          padding: "64px 40px",
          boxShadow: "0 16px 60px rgba(99,102,241,0.30)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 14,
            letterSpacing: "-0.03em",
          }}
        >
          Start growing your store today
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 17,
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Join 500+ retail stores already using StockAlert CRM to send smarter
          WhatsApp campaigns and boost sales.
        </p>
        <button
          style={{
            background: "#fff",
            color: "#6366f1",
            border: "none",
            borderRadius: 12,
            padding: "15px 36px",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            transition: "transform 0.15s",
            letterSpacing: "-0.02em",
          }}
          onClick={()=>navigate("/login?mode=signup")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          Create Free Account →
        </button>
        <p
          style={{
            marginTop: 14,
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
          }}
        >
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
}

export default function Landing() {

const navigate = useNavigate();

return (
    <div
      style={{
        fontFamily:
          "'DM Sans', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
      <HeroSection/>
      <FeaturesSection />
      <HowItWorks />
      <DashboardPreview />
      <PricingSection />
      <CTASection/>
    </div>
  );
}
