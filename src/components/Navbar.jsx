import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Architecture" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ activeNav, scrollTo, isMobile }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isMobile) return (
    <>
      {/* Mobile top bar */}
      <div style={{
        position: "fixed", top: 14, left: 14, right: 14, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px", borderRadius: 999,
        background: scrolled ? "rgba(12,12,18,0.92)" : "rgba(12,12,18,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.3s ease",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "var(--accent-emerald, #10b981)"
          }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", letterSpacing: "0.5px" }}>Santhosh D.</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 5, padding: 6,
          }}
          aria-label="Open navigation menu"
        >
          <span style={{ width: 20, height: 2, background: "#cbd5e1", borderRadius: 2, display: "block" }} />
          <span style={{ width: 14, height: 2, background: "#cbd5e1", borderRadius: 2, display: "block" }} />
        </button>
      </div>

      {/* Mobile overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(6,6,10,0.98)", backdropFilter: "blur(32px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none",
        transition: "opacity 0.35s ease",
      }}>
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: "absolute", top: 24, right: 24, background: "none", border: "none",
            color: "#94a3b8", fontSize: 28, cursor: "pointer", padding: 8
          }}
          aria-label="Close navigation"
        >✕</button>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
          {NAV_ITEMS.map((n, i) => (
            <button
              key={n.id}
              onClick={() => { scrollTo(n.id); setMobileOpen(false); }}
              style={{
                background: activeNav === n.id ? "rgba(255,255,255,0.08)" : "transparent",
                border: "1px solid", borderColor: activeNav === n.id ? "rgba(255,255,255,0.16)" : "transparent",
                color: activeNav === n.id ? "#ffffff" : "#94a3b8",
                padding: "14px 24px", borderRadius: 999, fontSize: 16, fontWeight: 600,
                cursor: "pointer", transition: `all 0.3s ease ${i * 0.04}s`,
                opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
                textAlign: "center"
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <nav style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999,
      display: "flex", gap: 3,
      background: "rgba(14,14,20,0.8)", backdropFilter: "blur(24px) saturate(1.6)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999,
      padding: "5px 6px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      {NAV_ITEMS.map(n => {
        const isActive = activeNav === n.id;
        return (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            style={{
              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              border: "1px solid",
              borderColor: isActive ? "rgba(255,255,255,0.14)" : "transparent",
              color: isActive ? "#ffffff" : "#94a3b8",
              padding: "8px 18px", borderRadius: 999, cursor: "pointer",
              fontSize: 13, fontWeight: isActive ? 600 : 500, transition: "all 0.25s ease",
              letterSpacing: "0.2px",
            }}
          >
            {n.label}
          </button>
        );
      })}
    </nav>
  );
}
