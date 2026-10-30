import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./App.css";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Ticker from "./components/Ticker";
import ChatWidget from "./components/ChatWidget";
import {
  IconLinkedIn,
  IconGitHub,
  IconMail,
  IconPhone,
  IconArrowRight,
  IconExternalLink,
  IconCpu,
  IconPulse,
  IconLayers,
  IconDatabase,
  IconCheck,
} from "./components/Icons";

// ─── DATA ─────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    title: "TELEICU",
    category: "healthcare",
    domain: "Critical Care",
    metric: "12+ Hospitals Live",
    summary: "Real-time ICU bed allocation, continuous multi-device medical telemetry, and clinical deterioration warning algorithms.",
    challenge: "Handling concurrent real-time vitals streams across multiple intensive care units without UI frame drops.",
    solution: "Engineered reactive Angular Signals and RxJS state pipelines synchronized with Azure SignalR for sub-80ms telemetry updates.",
    highlights: [
      "Sub-100ms real-time vitals stream latency",
      "Dynamic clinical alert threshold system",
      "Automated bed state transition engine",
      "Strict HIPAA data visualization standards"
    ],
    tech: ["Angular 17", "TypeScript", ".NET Core", "Azure SignalR", "MySQL"]
  },
  {
    id: 2,
    title: "Digital ICU",
    category: "healthcare",
    domain: "Emergency",
    metric: "<2s Video Handshake",
    summary: "Live emergency ambulance GPS fleet tracking with intelligent triage dispatch and real-time WebRTC teleconsultations.",
    challenge: "Maintaining bidirectional video and GPS streaming during variable cellular connectivity on moving ambulances.",
    solution: "Developed adaptive WebRTC bitrate fallback mechanisms and custom Google Maps vector overlays with smooth interpolations.",
    highlights: [
      "Real-time vehicle telemetry via WebSockets",
      "Low-bandwidth WebRTC video consultation",
      "Automated hospital trauma bay notification",
      "Mobile-first responsive interface for EMTs"
    ],
    tech: ["Angular", "Google Maps API", "WebRTC", "Azure", "Tailwind CSS"]
  },
  {
    id: 3,
    title: "AI Assist",
    category: "ai",
    domain: "GenAI & NLP",
    metric: "85% Intake Reduction",
    summary: "Context-aware enterprise document Q&A engine allowing clinical staff to query complex medical protocol PDFs instantaneously.",
    challenge: "Eliminating hallucination risks when querying specialized hospital clinical standard operating procedures.",
    solution: "Structured multi-stage prompt orchestration paired with chunked vector retrieval and citation highlights.",
    highlights: [
      "Streaming markdown & syntax-highlighted answers",
      "Verifiable citation links back to PDF source pages",
      "Token usage & rate limit optimization",
      "Zero medical data leakage policy enforcement"
    ],
    tech: ["Angular", "ChatGPT API", "Vector Embeddings", ".NET", "MySQL"]
  },
  {
    id: 4,
    title: "Enterprise LMS",
    category: "enterprise",
    domain: "EdTech",
    metric: "5,000+ Active Users",
    summary: "Scalable education platform featuring dynamic module enrollment, automated progression tracking, and instructor analytics.",
    challenge: "Providing seamless performance across heavy analytics dashboards and varied mobile devices.",
    solution: "Architected lazy-loaded standalone component routes, virtual scrolling lists, and server-side cached state.",
    highlights: [
      "Role-based access control (Admin, Instructor, Student)",
      "Automated compliance certification generation",
      "High-density analytics reporting modules",
      "Offline-resilient exam state caching"
    ],
    tech: ["Angular", "TypeScript", "Tailwind CSS", ".NET Core", "SQL"]
  },
  {
    id: 5,
    title: "Adaptive Logic Forms",
    category: "enterprise",
    domain: "Automation",
    metric: "40+ Dynamic Schemas",
    summary: "JSON-driven dynamic form engine with complex conditional branching, custom validation pipelines, and auto-save capabilities.",
    challenge: "Managing deeply nested conditional visibility dependencies without cascading re-renders.",
    solution: "Built a declarative rule evaluation engine on top of SurveyJS integrated into Angular reactive form models.",
    highlights: [
      "Dynamic schema generation from backend APIs",
      "Real-time expression parser for conditional logic",
      "Seamless draft autosave with local debounce",
      "Full WCAG 2.2 keyboard navigation support"
    ],
    tech: ["Angular", "SurveyJS", "Reactive Forms", "TypeScript", ".NET"]
  }
];

const TIMELINE = [
  {
    year: "2023 – Present",
    role: "Angular Developer",
    company: "Drumbuffer Analytics",
    loc: "Chennai, Tamil Nadu",
    desc: "Spearheaded frontend architecture for critical healthcare platforms (TeleICU, Digital ICU) and AI-driven platforms. Designed high-performance micro-frontends serving mission-critical patient monitoring operations.",
    achievements: [
      "Engineered real-time telemetry dashboards monitoring 50+ simultaneous ICU beds",
      "Integrated ChatGPT API pipelines for automated document interrogation",
      "Mentored junior engineers on Angular state best practices and TypeScript rigor"
    ]
  },
  {
    year: "2019 – 2023",
    role: "B.Tech Computer Science & Engineering",
    company: "Christian College of Eng. & Tech.",
    loc: "Dindigul, Tamil Nadu",
    desc: "Graduated with 8.03 / 10 CGPA. Dedicated core studies to software architecture, data structures, relational databases, and distributed web systems.",
    achievements: [
      "Published capstone project on automated clinical triage workflow",
      "Core coordinator for technical symposiums and open-source workshops"
    ]
  }
];

const STATS = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 5, suffix: "+", label: "Enterprise Deployments" },
  { value: 12, suffix: "+", label: "ICU Hospitals Connected" },
  { value: 99, suffix: ".9%", label: "System Availability" }
];

// ─── HOOKS ────────────────────────────────────────────

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
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function useWindowSize() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─── HELPER COMPONENTS ────────────────────────────────

function StatCard({ value, suffix, label, inView, delay }) {
  const count = useCounter(value, 1200, inView);
  return (
    <div
      className="stat-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function AboutScrollText({ text }) {
  const containerRef = useRef(null);
  const [wordOpacities, setWordOpacities] = useState([]);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    setWordOpacities(new Array(words.length).fill(0.18));
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.15;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const newOpacities = words.map((_, i) => {
        const wordProgress = i / words.length;
        const diff = progress - wordProgress;
        return Math.max(0.18, Math.min(1, diff * words.length * 0.4));
      });
      setWordOpacities(newOpacities);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [words]);

  return (
    <p ref={containerRef} className="about-text">
      {words.map((word, i) => (
        <span
          key={i}
          className="about-word"
          style={{ color: `rgba(248, 250, 252, ${wordOpacities[i] || 0.18})` }}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

function HeroText({ text, show, delay = 0.5 }) {
  return (
    <h1 style={{ margin: "0 0 6px", lineHeight: 1.15, perspective: "600px" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{
            animationDelay: show ? `${delay + i * 0.025}s` : "0s",
            animationPlayState: show ? "running" : "paused",
            opacity: show ? undefined : 0,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

function CustomCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    const over = () => setHovering(true);
    const out = () => setHovering(false);
    window.addEventListener("mousemove", move);
    const targets = document.querySelectorAll("a, button, .project-item, .bento-card, .contact-card, .chat-bubble-btn");
    targets.forEach(el => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", over);
        el.removeEventListener("mouseleave", out);
      });
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor ${hovering ? "hovering" : ""}`} />;
}

// ─── MAIN PORTFOLIO COMPONENT ─────────────────────────

export default function Portfolio() {
  const w = useWindowSize();
  const isMobile = w < 768;

  const [loaded, setLoaded] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [projectFilter, setProjectFilter] = useState("all");
  const [expandedProject, setExpandedProject] = useState(1);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [aboutRef] = useInView(0.12);
  const [skillsRef, skillsIn] = useInView(0.08);
  const [projectsRef, projectsIn] = useInView(0.08);
  const [timelineRef, timelineIn] = useInView(0.1);
  const [contactRef, contactIn] = useInView(0.1);
  const [statsRef, statsIn] = useInView(0.2);

  // Nav scroll tracking
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "timeline", "contact"];
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 220) {
          setActiveNav(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePreloaderComplete = useCallback(() => setLoaded(true), []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("santhoshdalwin@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return PROJECTS;
    return PROJECTS.filter(p => p.category === projectFilter);
  }, [projectFilter]);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />

      <div className="portfolio-outer">
        <div className="portfolio-card">
          <div className="corner-glow" />
          <div className="corner-glow-secondary" />

          <Navbar activeNav={activeNav} scrollTo={scrollTo} isMobile={isMobile} />

          {/* ── HERO SECTION ── */}
          <section id="home" className="hero-section">
            <div className="hero-avatar-wrap">
              <img src="/portimg.png" alt="Santhosh Dalwin" className="hero-avatar" />
              <div className="hero-avatar-badge" title="Active Engineer">
                <span style={{ fontSize: 13 }}>⚡</span>
              </div>
            </div>

            <div className="hero-status-row">
              <div className="hero-badge">
                <span className="dot" />
                <span>Available for high-impact roles</span>
              </div>
              <span className="hero-badge-location">Chennai, India • UTC+5:30</span>
            </div>

            <HeroText text="Santhosh Dalwin" show={loaded} delay={0.3} />
            <HeroText text="Architecting Scalable Frontend & AI Platforms" show={loaded} delay={0.7} />

            <p
              className="hero-subtitle"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s",
              }}
            >
              Angular Developer & Platform Engineer at Drumbuffer Analytics. Specializing in{" "}
              <strong style={{ color: "#f8fafc" }}>Real-Time Telemetry</strong>,{" "}
              <strong style={{ color: "#f8fafc" }}>Mission-Critical TeleICU Systems</strong>, and{" "}
              <strong style={{ color: "#f8fafc" }}>Autonomous AI Workflows</strong>.
            </p>

            <div
              className="hero-actions"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s",
              }}
            >
              <button onClick={() => scrollTo("projects")} className="btn-primary">
                <span>Explore Case Studies</span>
                <IconArrowRight size={16} />
              </button>
              <button onClick={() => scrollTo("contact")} className="btn-secondary">
                <span>Get in Touch</span>
              </button>
            </div>

            <div
              className="social-row"
              style={{
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.6s ease 1.7s",
              }}
            >
              <a
                href="https://linkedin.com/in/santhosh-dalwin"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn Profile"
                aria-label="LinkedIn"
              >
                <IconLinkedIn size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub Profile"
                aria-label="GitHub"
              >
                <IconGitHub size={18} />
              </a>
              <a
                href="mailto:santhoshdalwin@gmail.com"
                className="social-link"
                title="Send Direct Email"
                aria-label="Email"
              >
                <IconMail size={18} />
              </a>
              <a
                href="tel:+917339550087"
                className="social-link"
                title="Direct Phone Line"
                aria-label="Phone"
              >
                <IconPhone size={18} />
              </a>
            </div>
          </section>

          {/* ── TICKER ── */}
          <Ticker />

          {/* ── ABOUT ME ── */}
          <section id="about" className="section-pad" ref={aboutRef}>
            <span className="section-label">Engineering Philosophy</span>
            <AboutScrollText text="I bridge human interaction with mission-critical systems. At Drumbuffer Analytics, I engineer zero-failure telemedicine and ICU telemetry suites where sub-second latency directly impacts patient care. I believe great software is defined by clarity, resilient state machines, accessibility, and high aesthetic craft." />
          </section>

          <hr className="divider" />

          {/* ── ARCHITECTURE & SKILLS (BENTO GRID) ── */}
          <section id="skills" className="section-pad" ref={skillsRef}>
            <span className="section-label">Technical Arsenal</span>
            <h2 className="section-heading">Core Systems & Competencies</h2>
            <p className="section-subheading">
              Organized into modular architecture domains refined through enterprise deployments across healthcare, education, and AI automation.
            </p>

            <div
              className="bento-grid"
              style={{
                opacity: skillsIn ? 1 : 0,
                transform: skillsIn ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Bento 1: Frontend Engine (Span 7) */}
              <div className="bento-card bento-card-hero">
                <div className="bento-icon-badge">
                  <IconLayers size={22} />
                </div>
                <h3 className="bento-title">Angular & Reactive Frontend Architecture</h3>
                <p className="bento-desc">
                  Building scalable standalone architecture with Angular 17+, fine-grained Signals, NgRx, and RxJS pipelines designed for continuous data streams.
                </p>

                <div className="bento-code-preview">
                  <span className="bento-code-keyword">const</span> vitals$ = <span className="bento-code-fn">toSignal</span>(
                  <br />
                  &nbsp;&nbsp;telemetryService.<span className="bento-code-prop">icuStream$</span>.<span className="bento-code-fn">pipe</span>(
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="bento-code-fn">filter</span>(v =&gt; v.<span className="bento-code-prop">spo2</span> &lt; <span className="bento-code-string">92</span>),
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="bento-code-fn">throttleTime</span>(<span className="bento-code-string">80</span>)
                  <br />
                  &nbsp;&nbsp;)
                  <br />
                  );
                </div>

                <div className="bento-tags">
                  <span className="bento-tag">Angular 17+</span>
                  <span className="bento-tag">TypeScript 5</span>
                  <span className="bento-tag">RxJS & Signals</span>
                  <span className="bento-tag">NgRx Store</span>
                  <span className="bento-tag">Micro-Frontends</span>
                  <span className="bento-tag">Angular Material</span>
                </div>
              </div>

              {/* Bento 2: AI & LLM Systems (Span 5) */}
              <div className="bento-card bento-card-secondary">
                <div className="bento-icon-badge" style={{ color: "var(--accent-violet)" }}>
                  <IconCpu size={22} />
                </div>
                <h3 className="bento-title">GenAI & LLM Orchestration</h3>
                <p className="bento-desc">
                  Integrating ChatGPT APIs and retrieval-augmented context systems for structured document analysis and interactive intelligence.
                </p>
                <div className="bento-tags">
                  <span className="bento-tag">ChatGPT API</span>
                  <span className="bento-tag">Vector Retrieval</span>
                  <span className="bento-tag">Prompt Pipelines</span>
                  <span className="bento-tag">Streaming Responses</span>
                  <span className="bento-tag">Automated Summaries</span>
                </div>
              </div>

              {/* Bento 3: Real-Time Telemetry (Span 4) */}
              <div className="bento-card bento-card-third">
                <div className="bento-icon-badge" style={{ color: "var(--accent-emerald)" }}>
                  <IconPulse size={22} />
                </div>
                <h3 className="bento-title">Real-Time Telemetry</h3>
                <p className="bento-desc">
                  Low-latency WebSockets & WebRTC streams handling continuous patient biometric updates and emergency ambulance coordination.
                </p>
                <div className="bento-tags">
                  <span className="bento-tag">WebSockets</span>
                  <span className="bento-tag">WebRTC Audio/Video</span>
                  <span className="bento-tag">Azure SignalR</span>
                  <span className="bento-tag">Sub-100ms Vitals</span>
                </div>
              </div>

              {/* Bento 4: Backend & Cloud (Span 4) */}
              <div className="bento-card bento-card-third">
                <div className="bento-icon-badge" style={{ color: "var(--accent-cyan)" }}>
                  <IconDatabase size={22} />
                </div>
                <h3 className="bento-title">Enterprise Cloud & API</h3>
                <p className="bento-desc">
                  High-throughput RESTful endpoints powered by .NET Core, Azure Cloud services, and optimized relational MySQL databases.
                </p>
                <div className="bento-tags">
                  <span className="bento-tag">.NET Core 8</span>
                  <span className="bento-tag">RESTful APIs</span>
                  <span className="bento-tag">Azure Cloud</span>
                  <span className="bento-tag">MySQL Relational</span>
                </div>
              </div>

              {/* Bento 5: UI Craft & Design Systems (Span 4) */}
              <div className="bento-card bento-card-third">
                <div className="bento-icon-badge" style={{ color: "var(--accent-amber)" }}>
                  <IconCheck size={22} />
                </div>
                <h3 className="bento-title">UI Craft & Accessibility</h3>
                <p className="bento-desc">
                  Translating complex workflows into intuitive, WCAG 2.2 AA compliant, frosted glass interfaces with fluid responsive layout.
                </p>
                <div className="bento-tags">
                  <span className="bento-tag">Tailwind CSS</span>
                  <span className="bento-tag">WCAG 2.2 Standards</span>
                  <span className="bento-tag">Liquid Glassmorphism</span>
                  <span className="bento-tag">Micro-Interactions</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="stats-grid" ref={statsRef}>
              {STATS.map((s, i) => (
                <StatCard key={i} {...s} inView={statsIn} delay={i * 0.1} />
              ))}
            </div>
          </section>

          <hr className="divider" />

          {/* ── PROJECTS SHOWCASE ── */}
          <section id="projects" className="section-pad" ref={projectsRef}>
            <span className="section-label">Featured Works</span>
            <h2 className="section-heading">Mission-Critical Deployments</h2>
            <p className="section-subheading">
              A curated selection of enterprise solutions engineered with high uptime, clean abstraction layers, and real-time responsiveness.
            </p>

            {/* Filter Pills */}
            <div className="project-filter-row">
              <button
                className={`filter-btn ${projectFilter === "all" ? "active" : ""}`}
                onClick={() => setProjectFilter("all")}
              >
                All Works ({PROJECTS.length})
              </button>
              <button
                className={`filter-btn ${projectFilter === "healthcare" ? "active" : ""}`}
                onClick={() => setProjectFilter("healthcare")}
              >
                Healthcare & Telemetry (2)
              </button>
              <button
                className={`filter-btn ${projectFilter === "ai" ? "active" : ""}`}
                onClick={() => setProjectFilter("ai")}
              >
                GenAI & NLP (1)
              </button>
              <button
                className={`filter-btn ${projectFilter === "enterprise" ? "active" : ""}`}
                onClick={() => setProjectFilter("enterprise")}
              >
                Enterprise Systems (2)
              </button>
            </div>

            <div
              className="project-list"
              style={{
                opacity: projectsIn ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
            >
              {filteredProjects.map((p) => {
                const isExpanded = expandedProject === p.id;
                return (
                  <div
                    key={p.id}
                    className="project-item"
                    onClick={() => setExpandedProject(isExpanded ? null : p.id)}
                  >
                    <div className="project-item-header">
                      <div className="project-title-row">
                        <span className="project-title">{p.title}</span>
                        <span className="project-domain-tag">{p.domain}</span>
                        <span className="project-metric-pill">
                          <span className="project-metric-dot" />
                          {p.metric}
                        </span>
                      </div>
                      <div className="project-arrow-icon">
                        {isExpanded ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Expandable Case Study Drawer */}
                    {isExpanded && (
                      <div className="project-drawer" onClick={(e) => e.stopPropagation()}>
                        <p className="project-desc-full">{p.summary}</p>

                        <div className="project-highlights-grid">
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>
                              Technical Challenge
                            </span>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                              {p.challenge}
                            </p>
                          </div>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-emerald)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>
                              Engineering Solution
                            </span>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                              {p.solution}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>
                            Key Capabilities & Architecture
                          </span>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
                            {p.highlights.map((h, idx) => (
                              <div key={idx} className="project-highlight-item">
                                <span className="project-highlight-icon">✓</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 14, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                          <div className="project-techs-row">
                            {p.tech.map(t => (
                              <span key={t} className="project-tech-pill">{t}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => scrollTo("contact")}
                            style={{
                              background: "rgba(56, 189, 248, 0.12)",
                              border: "1px solid rgba(56, 189, 248, 0.3)",
                              color: "var(--accent-cyan)",
                              padding: "6px 14px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6
                            }}
                          >
                            <span>Inquire details</span>
                            <IconExternalLink size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="divider" />

          {/* ── TIMELINE ── */}
          <section id="timeline" className="section-pad" ref={timelineRef}>
            <span className="section-label">Trajectory</span>
            <h2 className="section-heading">Professional Journey</h2>
            <p className="section-subheading">
              Proven track record in agile enterprise environments producing production-grade software.
            </p>

            <div className="timeline-wrap">
              <div className="timeline-line" />
              {TIMELINE.map((t, i) => (
                <div
                  key={i}
                  className="timeline-item"
                  style={{
                    opacity: timelineIn ? 1 : 0,
                    transform: timelineIn ? "translateY(0)" : "translateY(24px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`,
                  }}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                      <h3 className="timeline-role">{t.role}</h3>
                      <span className="timeline-year">{t.year}</span>
                    </div>
                    <div className="timeline-company">{t.company}</div>
                    <div className="timeline-meta">📍 {t.loc}</div>
                    <p className="timeline-desc">{t.desc}</p>

                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                      {t.achievements.map((ach, aIdx) => (
                        <div key={aIdx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
                          <span style={{ color: "var(--accent-cyan)", fontSize: 12 }}>✦</span>
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="divider" />

          {/* ── CONTACT ── */}
          <section id="contact" className="section-pad contact-section" ref={contactRef}>
            <div
              className="hero-badge"
              style={{
                opacity: contactIn ? 1 : 0,
                transition: "opacity 0.5s ease",
                margin: "0 auto 20px",
              }}
            >
              <span className="dot" />
              <span>Direct Collaboration</span>
            </div>

            <h2
              className="contact-heading"
              style={{
                opacity: contactIn ? 1 : 0,
                transform: contactIn ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              Let's engineer your<br />next breakthrough.
            </h2>

            <p
              className="contact-sub"
              style={{
                opacity: contactIn ? 1 : 0,
                transition: "opacity 0.6s ease 0.3s",
              }}
            >
              Looking for a specialized Angular & AI frontend engineer? Connect directly:
            </p>

            <button
              onClick={handleCopyEmail}
              className="contact-email-btn"
              style={{
                opacity: contactIn ? 1 : 0,
                transition: "all 0.6s ease 0.4s",
              }}
              title="Click to copy email address"
            >
              <IconMail size={18} color="var(--accent-cyan)" />
              <span>santhoshdalwin@gmail.com</span>
              <span style={{ fontSize: 12, color: copiedEmail ? "var(--accent-emerald)" : "var(--text-muted)", marginLeft: 6 }}>
                {copiedEmail ? "✓ Copied!" : "(Copy)"}
              </span>
            </button>

            <div
              className="contact-cards"
              style={{
                opacity: contactIn ? 1 : 0,
                transform: contactIn ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
              }}
            >
              <a
                href="https://linkedin.com/in/santhosh-dalwin"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <IconLinkedIn size={22} />
                </div>
                <span className="contact-card-label">LinkedIn</span>
              </a>

              <a
                href="mailto:santhoshdalwin@gmail.com"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <IconMail size={22} />
                </div>
                <span className="contact-card-label">Direct Email</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <IconGitHub size={22} />
                </div>
                <span className="contact-card-label">GitHub</span>
              </a>

              <a
                href="tel:+917339550087"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <IconPhone size={22} />
                </div>
                <span className="contact-card-label">+91 73395 50087</span>
              </a>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 40, opacity: contactIn ? 1 : 0, transition: "opacity 0.6s ease 0.6s" }}>
              📍 Based in Chennai, Tamil Nadu • Available for remote and hybrid engagements worldwide
            </p>
          </section>

          {/* ── FOOTER ── */}
          <footer className="portfolio-footer">
            <p>© 2026 Santhosh Dalwin • Engineered with React, Angular design principles & taste-skill craftsmanship</p>
          </footer>
        </div>
      </div>

      {/* ── Chat Widget ── */}
      {loaded && <ChatWidget />}
    </>
  );
}
