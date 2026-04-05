import { useNavigate } from "react-router-dom";

const gradientText = {
  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
<span style={{ ...gradientText }}>CRM</span>
function Footer() {
  const navigate = useNavigate();
  const cols = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Updates", "Changelog"],
    },
    {
 title: "Company",
 links: [
  {name:"About", page:"about"},
  {name:"Contact", page:"contact"},
  {name:"Blog", page:"resources"},
  {name:"Careers", page:"careers"}
 ]
},
    {
  title: "Legal",
  links: [
    {name:"Privacy Policy", page:"legal/privacy"},
    {name:"Terms of Service", page:"legal/terms"},
    {name:"Cookies Policy", page:"legal/cookies"}
  ]
}
  ];
  return (
    <footer
      style={{
        background: "#0f0e1a",
        padding: "64px 24px 32px",
        color: "#9ca3af",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 56,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                📲
              </div>
              <span
                style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.04em" }}
              >
                StockAlert <span style={{ ...gradientText }}>CRM</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              The easiest way for retail stores to manage customers and send
              WhatsApp campaigns that drive real orders.
            </p>
            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["𝕏", "in"].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "#1a183a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#9ca3af",
                    cursor: "pointer",
                    border: "1px solid #2a2850",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          {/* Cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                {col.title}
              </div>
              {col.links.map((link) => (
  <a
    key={link.name || link}
    href="#"
    onClick={(e)=>{
 e.preventDefault();
 if(link.page){
window.scrollTo(0,0);
navigate("/"+link.page);
}
}}
                  style={{
                    display: "block",
                    color: "#9ca3af",
                    textDecoration: "none",
                    fontSize: 14,
                    padding: "4px 0",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  {link.name || link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid #2a2850",
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 13 }}>
            © 2025 StockAlert CRM. All rights reserved.
          </span>
          <span style={{ fontSize: 13 }}>Made with ❤️ for Indian retail</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;