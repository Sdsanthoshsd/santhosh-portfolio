import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────
const SKILLS = [
  { category: "Frontend", icon: "⟨/⟩", items: [
    { name: "Angular", level: 95 }, { name: "TypeScript", level: 90 },
    { name: "JavaScript", level: 88 }, { name: "Ionic", level: 70 },
  ]},
  { category: "Styling", icon: "◈", items: [
    { name: "Tailwind CSS", level: 92 }, { name: "Angular Material", level: 85 },
    { name: "SCSS / Bootstrap", level: 80 },
  ]},
  { category: "Backend & APIs", icon: "⇄", items: [
    { name: ".NET", level: 75 }, { name: "REST APIs", level: 88 },
    { name: "ChatGPT API", level: 82 }, { name: "Google Maps API", level: 80 },
  ]},
  { category: "Tools & Cloud", icon: "☁", items: [
    { name: "Git", level: 85 }, { name: "Azure", level: 72 },
    { name: "MySQL", level: 78 }, { name: "SurveyJS", level: 75 },
  ]},
];

const PROJECTS = [
  {
    id: 1, tag: "Healthcare", title: "TELEICU",
    subtitle: "Patient Registration & Bed Management",
    desc: "Automated patient intake with real-time ICU bed allocation. Integrated device monitoring, vitals tracking, and automated clinical alerts for proactive patient care.",
    tech: ["Angular", "TypeScript", ".NET", "MySQL", "REST APIs"],
    color: "#06b6d4", accent: "#0891b2", icon: "🏥",
  },
  {
    id: 2, tag: "Emergency", title: "Digital ICU",
    subtitle: "Tele Emergency Call Center",
    desc: "Live ambulance tracking via Google Maps API with intelligent dispatch based on severity & proximity. Real-time video consultations using Azure Communication Services.",
    tech: ["Angular", "Google Maps API", "Azure", "TypeScript", "WebRTC"],
    color: "#f43f5e", accent: "#e11d48", icon: "🚑",
  },
  {
    id: 3, tag: "EdTech", title: "Enterprise LMS",
    subtitle: "Learning Management System",
    desc: "Scalable course platform with dynamic enrollment, real-time progress dashboards, attendance tracking, and seamless purchase workflows for enterprise education.",
    tech: ["Angular", "TypeScript", "Tailwind CSS", ".NET", "MySQL"],
    color: "#8b5cf6", accent: "#7c3aed", icon: "📚",
  },
  {
    id: 4, tag: "AI", title: "AI Assist",
    subtitle: "Intelligent Chatbot Integration",
    desc: "AI-powered document Q&A — users upload PDFs and get context-aware answers instantly. Full-stack pipeline: Angular UI, .NET parsing backend, ChatGPT integration.",
    tech: ["Angular", "ChatGPT API", ".NET", "MySQL", "Tailwind CSS"],
    color: "#10b981", accent: "#059669", icon: "🤖",
  },
  {
    id: 5, tag: "Automation", title: "Dynamic Forms",
    subtitle: "Workflow Automation Engine",
    desc: "Adaptive forms with conditional logic using SurveyJS — fields dynamically adjust based on user input. Automated workflow triggers with real-time process updates.",
    tech: ["Angular", "SurveyJS", "TypeScript", ".NET", "REST APIs"],
    color: "#f59e0b", accent: "#d97706", icon: "⚡",
  },
];

const TIMELINE = [
  { year: "2023 – Present", role: "Angular Developer", company: "Drumbuffer Analytics", loc: "Chennai, Tamil Nadu", desc: "Built AI-driven healthcare platforms, enterprise LMS, and intelligent chatbot apps." },
  { year: "2019 – 2023", role: "B.Tech CSE", company: "Christian College of Eng. & Tech.", loc: "Dindigul", desc: "CGPA 8.03 / 10. Deep focus on full-stack development and systems design." },
];

// ─── HOOKS ────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, duration = 1200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1024, h: typeof window !== 'undefined' ? window.innerHeight : 768 });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

// ─── RESPONSIVE HELPERS ──────────────────────────────────
const bp = { sm: 480, md: 768, lg: 1024, xl: 1280 };

// ─── COMPONENTS ───────────────────────────────────────────

function Orb({ style }) {
  return <div style={{ borderRadius: "50%", filter: "blur(100px)", opacity: 0.3, position: "absolute", pointerEvents: "none", ...style }} />;
}

// Noise grain overlay
function GrainOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none", opacity: 0.018,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "200px 200px",
    }} />
  );
}

// ── Skill Bar ──
function SkillBar({ name, level, active, delay = 0 }) {
  const count = useCounter(level, 1200, active);
  return (
    <div style={{ marginBottom: 20, opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-20px)", transition: `all 0.6s cubic-bezier(.4,0,.2,1) ${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", letterSpacing: "0.3px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", display: "inline-block" }} />
          {name}
        </span>
        <span style={{ fontSize: 11, color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, background: "#06b6d415", padding: "2px 8px", borderRadius: 6 }}>{count}%</span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 8, height: 5, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 8,
          background: `linear-gradient(90deg, #06b6d4, #8b5cf6, #f43f5e)`,
          backgroundSize: "200% 100%",
          width: active ? `${level}%` : "0%",
          transition: `width 1.4s cubic-bezier(.4,0,.2,1) ${delay}s`,
          animation: "shimmer 3s linear infinite",
        }} />
      </div>
    </div>
  );
}

// ── Project Card ──
function ProjectCard({ project, index, isMobile }) {
  const [ref, inView] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const isActive = hovered || touched;

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(50px)",
      transition: `opacity 0.8s ease ${index * 0.08}s, transform 0.8s cubic-bezier(.4,0,.2,1) ${index * 0.08}s`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setTouched(true)}
        onTouchEnd={() => setTimeout(() => setTouched(false), 600)}
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden", cursor: "pointer",
          border: `1px solid ${isActive ? project.color + "60" : "#1e293b"}`,
          background: "#0f172a",
          transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
          transform: isActive ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: isActive ? `0 24px 64px ${project.color}25, 0 0 0 1px ${project.color}20` : "0 2px 16px #00000030",
        }}
      >
        {/* Glow behind card on hover */}
        <div style={{
          position: "absolute", inset: -20, background: `radial-gradient(circle at center, ${project.color}10 0%, transparent 70%)`,
          opacity: isActive ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Top accent */}
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`, position: "relative", zIndex: 1 }} />

        <div style={{ padding: isMobile ? "22px 20px 20px" : "28px 28px 24px", position: "relative", zIndex: 1 }}>
          {/* Tag + icon row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase",
              color: project.color, background: `${project.color}12`, padding: "5px 14px", borderRadius: 20,
              border: `1px solid ${project.color}25`,
            }}>{project.tag}</span>
            <span style={{ fontSize: isMobile ? 24 : 30, filter: isActive ? "scale(1.1)" : "scale(1)", transition: "filter 0.3s ease", display: "inline-block" }}>{project.icon}</span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1.5px" }}>{project.title}</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 14px", fontStyle: "italic" }}>{project.subtitle}</p>

          {/* Desc with animated expand */}
          <div style={{
            fontSize: 13, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 20px",
            maxHeight: isActive ? "200px" : isMobile ? "48px" : "42px",
            overflow: "hidden", transition: "max-height 0.5s cubic-bezier(.4,0,.2,1)",
            maskImage: isActive ? "none" : "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage: isActive ? "none" : "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}>{project.desc}</div>

          {/* Tech pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tech.map((t, ti) => (
              <span key={t} style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: isActive ? "#94a3b8" : "#64748b",
                background: isActive ? `${project.color}08` : "#1e293b", padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${isActive ? project.color + "25" : "#334155"}`,
                transition: `all 0.3s ease ${ti * 0.04}s`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Menu Overlay ──
function MobileMenu({ open, onClose, activeNav, scrollTo }) {
  const navItems = [
    { id: "home", label: "Home", icon: "◆" },
    { id: "about", label: "About", icon: "◇" },
    { id: "skills", label: "Skills", icon: "▲" },
    { id: "projects", label: "Projects", icon: "⬡" },
    { id: "timeline", label: "Timeline", icon: "◎" },
    { id: "contact", label: "Contact", icon: "⟡" },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 998,
      background: "rgba(10,14,26,0.95)", backdropFilter: "blur(24px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
      transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
    }}>
      {/* Close btn */}
      <button onClick={onClose} style={{
        position: "absolute", top: 28, right: 24, background: "none", border: "none",
        color: "#64748b", fontSize: 28, cursor: "pointer", lineHeight: 1, padding: 8,
      }}>✕</button>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        {navItems.map((n, i) => (
          <button key={n.id} onClick={() => { scrollTo(n.id); onClose(); }} style={{
            background: activeNav === n.id ? "linear-gradient(135deg,#06b6d4,#8b5cf6)" : "transparent",
            border: `1px solid ${activeNav === n.id ? "transparent" : "#1e293b"}`,
            color: activeNav === n.id ? "#fff" : "#64748b",
            padding: "14px 40px", borderRadius: 40, fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, letterSpacing: "0.5px",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.4s cubic-bezier(.4,0,.2,1) ${i * 0.06}s`,
            minWidth: 200, justifyContent: "center",
          }}>
            <span style={{ fontSize: 11, opacity: 0.6 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section Label ──
function SectionLabel({ label }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 10 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
        color: "#06b6d4", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(8px)",
        display: "inline-block", transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
      }}>{label}</span>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ value, suffix, label, inView, delay }) {
  const count = useCounter(value, 1200, inView);
  return (
    <div style={{
      textAlign: "center", padding: "24px 12px", background: "#0f172a",
      border: "1px solid #1e293b", borderRadius: 16, position: "relative", overflow: "hidden",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.6s cubic-bezier(.4,0,.2,1) ${delay}s`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, transparent)",
      }} />
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", color: "#06b6d4", letterSpacing: "1px" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500, letterSpacing: "0.3px" }}>{label}</div>
    </div>
  );
}

// ── Timeline Item ──
function TimelineItem({ item, index, isMobile }) {
  const [ref, inView] = useInView(0.15);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      position: "relative", marginBottom: 32, paddingLeft: isMobile ? 24 : 32,
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.7s cubic-bezier(.4,0,.2,1) ${index * 0.15}s`, cursor: "default",
    }}>
      {/* Dot */}
      <div style={{
        position: "absolute", left: isMobile ? -26 : -34, top: 10,
        width: 12, height: 12, borderRadius: "50%",
        background: hov ? "#06b6d4" : "#1e293b",
        border: `2px solid ${hov ? "#06b6d4" : "#334155"}`,
        transition: "all 0.3s ease",
        boxShadow: hov ? "0 0 14px #06b6d450" : "none",
      }} />

      <div style={{
        background: hov ? "#1a2845" : "#0f172a",
        border: `1px solid ${hov ? "#06b6d430" : "#1e293b"}`,
        borderRadius: 16, padding: isMobile ? "20px 18px" : "24px 28px",
        transition: "all 0.35s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <h3 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{item.role}</h3>
          <span style={{ fontSize: 10, color: "#06b6d4", background: "#06b6d415", padding: "4px 10px", borderRadius: 12, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap" }}>{item.year}</span>
        </div>
        <p style={{ fontSize: 13, color: "#8b5cf6", margin: "0 0 3px", fontWeight: 600 }}>{item.company}</p>
        <p style={{ fontSize: 11, color: "#475569", margin: "0 0 8px" }}>📍 {item.loc}</p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
      </div>
    </div>
  );
}

// ── Contact Card ──
function ContactCard({ label, icon, href, color, visible, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.5s cubic-bezier(.4,0,.2,1) ${delay}s`,
        background: hov ? `${color}12` : "#0f172a",
        border: `1px solid ${hov ? color + "50" : "#1e293b"}`,
        borderRadius: 16, padding: "20px 28px", minWidth: 130, textAlign: "center",
        boxShadow: hov ? `0 12px 40px ${color}22` : "none",
        transform: `${visible ? "translateY(0)" : "translateY(24px)"} ${hov ? "translateY(-3px)" : ""}`,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{ fontSize: 24, marginBottom: 6, filter: hov ? "drop-shadow(0 0 6px currentColor)" : "none", transition: "filter 0.3s" }}>{icon}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: hov ? color : "#94a3b8", transition: "color 0.3s", letterSpacing: "0.3px" }}>{label}</div>
      </div>
    </a>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function Portfolio() {
  const { w } = useWindowSize();
  const isMobile = w < bp.md;
  const isSmall = w < bp.sm;
  const isDesktop = w >= bp.lg;

  const [activeSkillCat, setActiveSkillCat] = useState(0);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillsVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Active nav section on scroll
  const [activeNav, setActiveNav] = useState("home");
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "timeline", "contact"];
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 140) { setActiveNav(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const desktopNavItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "timeline", label: "Timeline" },
    { id: "contact", label: "Contact" },
  ];

  const [heroRef, heroIn] = useInView(0);

  // Stats data
  const statsData = [
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 5, suffix: "", label: "Enterprise Projects" },
    { value: 15, suffix: "+", label: "Technologies" },
    { value: 100, suffix: "%", label: "Dedication" },
  ];
  const [statsRef, statsIn] = useInView(0.25);

  const [aboutRef, aboutIn] = useInView(0.12);
  const [contactRef, contactIn] = useInView(0.12);

  const contactLinks = [
    { label: "LinkedIn", icon: "💼", href: "https://linkedin.com/in/santhosh-dalwin", color: "#06b6d4" },
    { label: "Email", icon: "✉️", href: "mailto:santhoshdalwin@gmail.com", color: "#8b5cf6" },
    { label: "GitHub", icon: "🐙", href: "#", color: "#10b981" },
  ];

  // padding helpers
  const secPad = isMobile ? "70px 18px" : isDesktop ? "120px 40px" : "100px 24px";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <GrainOverlay />

      {/* ── MOBILE MENU ── */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeNav={activeNav} scrollTo={scrollTo} />

      {/* ── NAV ── */}
      {!isMobile ? (
        <nav style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          display: "flex", gap: 3, background: "#10182880", backdropFilter: "blur(24px)",
          border: "1px solid #1e293b40", borderRadius: 44, padding: "5px 6px",
          boxShadow: "0 8px 40px #00000040",
        }}>
          {desktopNavItems.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{
              background: activeNav === n.id ? "linear-gradient(135deg,#06b6d4,#8b5cf6)" : "transparent",
              border: "none", color: activeNav === n.id ? "#fff" : "#64748b",
              padding: w < bp.lg ? "7px 14px" : "8px 20px", borderRadius: 34, cursor: "pointer",
              fontSize: w < bp.lg ? 12 : 13, fontWeight: 600,
              transition: "all 0.3s cubic-bezier(.4,0,.2,1)", letterSpacing: "0.3px",
              whiteSpace: "nowrap",
            }}>{n.label}</button>
          ))}
        </nav>
      ) : (
        /* Mobile top bar */
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", background: "#0a0e1a90", backdropFilter: "blur(20px)",
          borderBottom: "1px solid #1e293b30",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "2px", color: "#f1f5f9" }}>SD</span>
          <button onClick={() => setMobileMenuOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 8,
          }}>
            <span style={{ width: 22, height: 2, background: "#94a3b8", borderRadius: 2, display: "block" }} />
            <span style={{ width: 16, height: 2, background: "#94a3b8", borderRadius: 2, display: "block" }} />
            <span style={{ width: 22, height: 2, background: "#94a3b8", borderRadius: 2, display: "block" }} />
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: isMobile ? "100px 20px 60px" : "0 24px" }}>
        <Orb style={{ width: isSmall ? 280 : 500, height: isSmall ? 280 : 500, background: "#06b6d4", top: "5%", left: isSmall ? "-20%" : "-10%" }} />
        <Orb style={{ width: isSmall ? 220 : 400, height: isSmall ? 220 : 400, background: "#8b5cf6", bottom: "2%", right: isSmall ? "-15%" : "-8%" }} />
        <Orb style={{ width: isSmall ? 140 : 250, height: isSmall ? 140 : 250, background: "#f43f5e", top: "60%", left: "40%" }} />

        <div ref={heroRef} style={{ textAlign: "center", position: "relative", zIndex: 2, maxWidth: 780, width: "100%" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
            background: "#1e293b", border: "1px solid #334155", borderRadius: 30, padding: "7px 16px",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(-16px)",
            transition: "all 0.8s cubic-bezier(.4,0,.2,1)",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "pulse 2s ease infinite" }} />
            <span style={{ fontSize: isSmall ? 12 : 13, color: "#94a3b8", fontWeight: 500 }}>Available for opportunities</span>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: isSmall ? "clamp(34px,10vw,48px)" : "clamp(48px,8vw,76px)",
            fontWeight: 800, margin: "0 0 6px",
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px", lineHeight: 1.05,
            background: "linear-gradient(135deg, #f1f5f9 20%, #06b6d4 55%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.4,0,.2,1) 0.1s",
          }}>SANTHOSH DALWIN</h1>

          {/* Role */}
          <p style={{
            fontSize: isSmall ? "clamp(15px,4vw,18px)" : "clamp(18px,2.5vw,23px)",
            color: "#64748b", fontWeight: 500, margin: "0 0 10px",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.4,0,.2,1) 0.22s",
          }}>Angular Developer & AI Platform Engineer</p>

          {/* Tagline */}
          <p style={{
            fontSize: isSmall ? 13 : 14.5, color: "#475569", lineHeight: 1.8, maxWidth: 540, margin: "0 auto 32px",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.9s cubic-bezier(.4,0,.2,1) 0.35s",
          }}>
            Crafting intelligent, scalable applications at the intersection of{" "}
            <strong style={{ color: "#06b6d4" }}>AI</strong>,{" "}
            <strong style={{ color: "#8b5cf6" }}>Healthcare</strong>, and{" "}
            <strong style={{ color: "#10b981" }}>EdTech</strong>.
          </p>

          {/* CTA */}
          <div style={{
            display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
            opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.9s cubic-bezier(.4,0,.2,1) 0.48s",
          }}>
            <HeroBtn primary onClick={() => scrollTo("projects")} label="View Projects" />
            <HeroBtn onClick={() => scrollTo("contact")} label="Contact Me" />
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop: isMobile ? 48 : 60, animation: "bounce 2.2s ease infinite", opacity: 0.5 }}>
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #06b6d4, transparent)", margin: "0 auto", borderRadius: 2 }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: secPad, maxWidth: 940, margin: "0 auto", position: "relative" }}>
        <div ref={aboutRef}>
          <SectionLabel label="About" />
          <h2 style={{ fontSize: isSmall ? "clamp(24px,6vw,32px)" : "clamp(28px,5vw,40px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "1.5px", color: "#f1f5f9" }}>About Me</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 40px" }}>The person behind the code</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 32 : 48,
            alignItems: "center",
          }}>
            {/* Avatar */}
            <div style={{
              opacity: aboutIn ? 1 : 0, transform: aboutIn ? "translateX(0)" : (isMobile ? "translateY(-20px)" : "translateX(-40px)"),
              transition: "all 0.9s cubic-bezier(.4,0,.2,1)", display: "flex", justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: isMobile ? 220 : 270, height: isMobile ? 220 : 270, display: "flex", alignItems: "center", justifyContent: "center" }}>

                {/* Outer rotating conic gradient ring */}
                <div className="avatar-spin-ring" style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #f43f5e, #10b981, #06b6d4)",
                  padding: 3,
                  animation: "spinRing 4s linear infinite",
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0a0e1a" }} />
                </div>

                {/* Secondary counter-rotating dashed ring */}
                <div style={{
                  position: "absolute", inset: 8, borderRadius: "50%",
                  border: "1px dashed #06b6d430",
                  animation: "spinRingReverse 6s linear infinite",
                }} />

                {/* Blob shape with image */}
                <div style={{
                  position: "relative", zIndex: 2,
                  width: isMobile ? 170 : 210, height: isMobile ? 170 : 210,
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: "40% 60% 55% 45% / 55% 45% 55% 45%",
                    background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", padding: 3,
                    animation: "blobMorph 6s ease-in-out infinite",
                  }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "inherit", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img
                        src="/portimg.png"
                        alt="Profile"
                        style={{
                          width: isMobile ? 140 : 180,
                          height: isMobile ? 140 : 180,
                          borderRadius: "40% 60% 55% 45% / 55% 45% 55% 45%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.5s cubic-bezier(.4,0,.2,1), box-shadow 0.5s cubic-bezier(.4,0,.2,1)",
                          boxShadow: "0 4px 32px #06b6d420",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.07)';
                          e.currentTarget.style.boxShadow = '0 12px 48px #06b6d450';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 32px #06b6d420';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Orbiting dots */}
                <div className="orbit-dot orbit-dot-1" style={{
                  position: "absolute", width: 12, height: 12, borderRadius: "50%",
                  background: "#06b6d4", boxShadow: "0 0 8px #06b6d470",
                  animation: "orbit1 3.2s linear infinite",
                  top: 0, left: "50%", marginLeft: -6,
                }} />
                <div className="orbit-dot orbit-dot-2" style={{
                  position: "absolute", width: 8, height: 8, borderRadius: "50%",
                  background: "#8b5cf6", boxShadow: "0 0 6px #8b5cf670",
                  animation: "orbit2 4.5s linear infinite",
                  top: "25%", right: -4,
                }} />
                <div className="orbit-dot orbit-dot-3" style={{
                  position: "absolute", width: 6, height: 6, borderRadius: "50%",
                  background: "#f43f5e", boxShadow: "0 0 5px #f43f5e60",
                  animation: "orbit3 5.8s linear infinite",
                  bottom: "10%", left: -3,
                }} />
                <div style={{
                  position: "absolute", width: 10, height: 10, borderRadius: "50%",
                  border: "2px solid #10b98160",
                  animation: "orbit4 7s linear infinite",
                  top: "70%", right: "15%",
                }} />
              </div>
            </div>

            {/* Text */}
            <div style={{
              opacity: aboutIn ? 1 : 0, transform: aboutIn ? "translateX(0)" : (isMobile ? "translateY(20px)" : "translateX(40px)"),
              transition: "all 0.9s cubic-bezier(.4,0,.2,1) 0.12s", textAlign: isMobile ? "center" : "left",
            }}>
              <p style={{ fontSize: isMobile ? 14 : 15, color: "#94a3b8", lineHeight: 1.9, margin: "0 0 16px" }}>
                I'm a results-driven <strong style={{ color: "#f1f5f9" }}>Angular Developer</strong> at Drumbuffer Analytics, building enterprise-grade platforms that serve real patients and learners. I specialize in turning complex problems into clean, performant interfaces.
              </p>
              <p style={{ fontSize: isMobile ? 14 : 15, color: "#94a3b8", lineHeight: 1.9, margin: 0 }}>
                From real-time ICU monitoring to AI-powered chatbots, I thrive at the intersection of{" "}
                <strong style={{ color: "#06b6d4" }}>cutting-edge tech</strong> and{" "}
                <strong style={{ color: "#8b5cf6" }}>meaningful impact</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: secPad, background: "linear-gradient(180deg, transparent, #0f172a30, transparent)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }} ref={skillsRef}>
          <SectionLabel label="Skills" />
          <h2 style={{ fontSize: isSmall ? "clamp(24px,6vw,32px)" : "clamp(28px,5vw,40px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "1.5px", color: "#f1f5f9" }}>Technical Arsenal</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 32px" }}>Technologies I work with day-to-day</p>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            {SKILLS.map((s, i) => (
              <button key={s.category} onClick={() => setActiveSkillCat(i)} style={{
                background: activeSkillCat === i ? "linear-gradient(135deg,#06b6d4,#8b5cf6)" : "#1e293b",
                border: `1px solid ${activeSkillCat === i ? "transparent" : "#334155"}`,
                color: activeSkillCat === i ? "#fff" : "#64748b",
                padding: isSmall ? "7px 14px" : "8px 18px", borderRadius: 24,
                fontSize: isSmall ? 11 : 12.5, fontWeight: 600, cursor: "pointer",
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ opacity: activeSkillCat === i ? 1 : 0.5 }}>{s.icon}</span>
                {s.category}
              </button>
            ))}
          </div>

          {/* Skill bars panel */}
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20,
            padding: isSmall ? "24px 20px" : "32px 36px",
            position: "relative", overflow: "hidden",
          }}>
            {/* subtle top glow */}
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, #06b6d440, transparent)" }} />
            {SKILLS[activeSkillCat].items.map((skill, i) => (
              <SkillBar key={skill.name + activeSkillCat} name={skill.name} level={skill.level} active={skillsVisible} delay={i * 0.08} />
            ))}
          </div>

          {/* Stats row */}
          <div ref={statsRef} style={{
            display: "grid",
            gridTemplateColumns: isSmall ? "repeat(2,1fr)" : "repeat(4,1fr)",
            gap: isSmall ? 10 : 14, marginTop: 40,
          }}>
            {statsData.map((s, i) => (
              <StatCard key={i} {...s} inView={statsIn} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: secPad }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <SectionLabel label="Projects" />
          <h2 style={{ fontSize: isSmall ? "clamp(24px,6vw,32px)" : "clamp(28px,5vw,40px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "1.5px", color: "#f1f5f9" }}>What I've Built</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 40px" }}>Enterprise-grade applications across Healthcare, EdTech & AI</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2,1fr)" : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: isSmall ? 14 : 18,
          }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} isMobile={isMobile} />)}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline" style={{ padding: secPad, background: "linear-gradient(180deg, transparent, #0f172a30, transparent)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <SectionLabel label="Timeline" />
          <h2 style={{ fontSize: isSmall ? "clamp(24px,6vw,32px)" : "clamp(28px,5vw,40px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "1.5px", color: "#f1f5f9" }}>Experience & Education</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 48px" }}>My journey so far</p>

          <div style={{ position: "relative", paddingLeft: isMobile ? 28 : 38 }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: isMobile ? 11 : 15, top: 0, bottom: 0, width: 2,
              background: "linear-gradient(to bottom, #06b6d4, #8b5cf6, transparent)",
            }} />
            {TIMELINE.map((t, i) => (
              <TimelineItem key={i} item={t} index={i} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: secPad }}>
        <div ref={contactRef} style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel label="Contact" />
          <h2 style={{ fontSize: isSmall ? "clamp(24px,6vw,32px)" : "clamp(28px,5vw,40px)", fontWeight: 800, margin: "0 0 10px", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "1.5px", color: "#f1f5f9" }}>Let's Work Together</h2>
          <p style={{ color: "#64748b", fontSize: isMobile ? 13.5 : 14.5, margin: "0 0 36px", lineHeight: 1.8, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            I'm open to exciting opportunities in front-end or full-stack development. Drop me a message — I'd love to connect.
          </p>

          {/* Contact cards */}
          <div style={{ display: "flex", gap: isSmall ? 10 : 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            {contactLinks.map((l, i) => (
              <ContactCard key={l.label} {...l} visible={contactIn} delay={i * 0.1} />
            ))}
          </div>

          {/* Info box */}
          <div style={{
            opacity: contactIn ? 1 : 0, transform: contactIn ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(.4,0,.2,1) 0.3s",
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: isSmall ? "24px 20px" : "28px 32px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, #8b5cf640, transparent)" }} />
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 6px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span>📍</span> Chennai, Tamil Nadu, India
            </p>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 6px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span>📞</span> +91 7339550087
            </p>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span>✉️</span> santhoshdalwin@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "36px 20px", borderTop: "1px solid #1e293b20" }}>
        <p style={{ color: "#334155", fontSize: 12, margin: 0, letterSpacing: "0.5px" }}>© 2026 Santhosh Dalwin — Built with precision</p>
      </footer>

      {/* ── STYLES ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(7px); } }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 8px #10b981; } 50% { opacity:0.5; box-shadow:0 0 4px #10b981; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Avatar ring + blob + orbits */
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes spinRingReverse { to { transform: rotate(-360deg); } }
        @keyframes blobMorph {
          0%,100% { border-radius: 40% 60% 55% 45% / 55% 45% 55% 45%; }
          25%      { border-radius: 55% 45% 40% 60% / 45% 55% 60% 40%; }
          50%      { border-radius: 45% 55% 60% 40% / 60% 40% 45% 55%; }
          75%      { border-radius: 60% 40% 45% 55% / 40% 60% 55% 45%; }
        }
        @keyframes orbit1 {
          0%   { top: 0%;   left: 50%; }
          25%  { top: 50%;  left: 100%; }
          50%  { top: 100%; left: 50%; }
          75%  { top: 50%;  left: 0%; }
          100% { top: 0%;   left: 50%; }
        }
        @keyframes orbit2 {
          0%   { top: 15%;  right: -4px; }
          33%  { top: 85%;  right: 30%; }
          66%  { top: 40%;  right: 95%; }
          100% { top: 15%;  right: -4px; }
        }
        @keyframes orbit3 {
          0%   { bottom: 10%; left: -3px; }
          50%  { bottom: 70%; left: 60%; }
          100% { bottom: 10%; left: -3px; }
        }
        @keyframes orbit4 {
          0%   { top: 70%; right: 15%; }
          40%  { top: 5%;  right: 60%; }
          70%  { top: 55%; right: 90%; }
          100% { top: 70%; right: 15%; }
        }
        * { box-sizing: border-box; scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        button, a { font-family: inherit; -webkit-tap-highlight-color: transparent; }
        input:focus, button:focus { outline: none; }
        @media (max-width: 480px) {
          section { padding-left: 18px !important; padding-right: 18px !important; }
        }
      `}</style>
    </div>
  );
}

// ── Hero Button ──
function HeroBtn({ primary, onClick, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: primary ? "linear-gradient(135deg,#06b6d4,#8b5cf6)" : "transparent",
        border: primary ? "none" : "1px solid #334155",
        color: primary ? "#fff" : (hov ? "#06b6d4" : "#94a3b8"),
        padding: "13px 30px", borderRadius: 40, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
        boxShadow: primary ? (hov ? "0 10px 36px #06b6d450" : "0 4px 24px #06b6d435") : "none",
        transform: hov ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)",
        borderColor: !primary && hov ? "#06b6d4" : "#334155",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)", letterSpacing: "0.4px",
      }}
    >{label}</button>
  );
}
