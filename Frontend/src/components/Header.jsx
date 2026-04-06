import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/thegreps-logo.png";

const gradientText = {
  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
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
};
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isActive = (path) => {
  return location.pathname === path;
};
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.07)" : "none",
        borderBottom: scrolled ? "1px solid #f0f0f5" : "1px solid transparent",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div 
  style={{ display: "flex", alignItems: "center", gap: 10, cursor:"pointer" }}
  onClick={()=>navigate("/")}
>

          <div 
 style={{ display:"flex", alignItems:"center", cursor:"pointer" }}
 onClick={()=>navigate("/")}
>

<img
 src={logo}
 alt="The Greps"
 style={{
  height:65,
  width:"auto",
  objectFit:"contain"
 }}
/>

</div>
        </div>

        {/* Desktop Nav */}
        <div
 style={{
  display: "flex",
  gap: 32,
  alignItems: "center",
 }}
 className="desktop-nav"
>

{isHome ? (

["Features", "Pricing", "How it Works"].map((item) => (

<a
 key={item}
 href={`#${item.toLowerCase().replace(/ /g, "-")}`}
 style={{
  color: "#374151",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: 15,
 }}
>
 {item}
</a>

))

) : (

<span style={{
 fontWeight:600,
 fontSize:16,
 color:"#111827"
}}>

{location.pathname
.replace("/","")
.replace("-"," ")
.replace(/^./, c=>c.toUpperCase())}

</span>

)}

</div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button 
style={{
 ...btnSecondary,
 padding: "9px 20px",
 fontSize: 14,
}}
onClick={()=>navigate("/login")}
>
 Login
</button>

<button
 style={{ ...btnSecondary, padding: "9px 20px", fontSize: 14, marginLeft:10 }}
 onClick={()=>navigate("/admin")}
>
 Admin Login
</button> 

          <button
 style={{ ...btnPrimary, padding: "9px 20px", fontSize: 14 }}
 onClick={()=>navigate("/login?mode=signup")}
>
 Start Free Trial
</button>
        </div>
      </div>
    </nav>
  );
}
export default Header;