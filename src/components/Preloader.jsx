import { useState, useEffect } from "react";

const GREETINGS = [
  "வணக்கம்", "Hello", "Hallo", "Bonjour", "Ciao",
  "Hola", "こんにちは", "안녕하세요", "Привет", "مرحبا",
  "Olá", "Namaste", "Merhaba", "Sawadee", "Xin chào",
];

export default function Preloader({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("greeting"); // greeting | exit
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    if (phase !== "greeting") return;
    if (currentIndex >= GREETINGS.length) {
      setPhase("exit");
      setTimeout(() => onComplete(), 800);
      return;
    }
    setWordVisible(true);
    const hideTimer = setTimeout(() => setWordVisible(false), 140);
    const nextTimer = setTimeout(() => setCurrentIndex(i => i + 1), 200);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [currentIndex, phase, onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
      transition: "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)",
      willChange: "transform",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        opacity: wordVisible && phase === "greeting" ? 1 : 0,
        transform: wordVisible && phase === "greeting" ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
        transition: "all 0.15s ease",
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "#c4c4c4", display: "inline-block", flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: "clamp(28px, 5vw, 46px)",
          fontWeight: 600, color: "#e8e8e8", letterSpacing: "-0.5px",
          whiteSpace: "nowrap",
        }}>
          {GREETINGS[currentIndex] || GREETINGS[GREETINGS.length - 1]}
        </span>
      </div>
      {/* Subtle corner glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "40%", height: "40%",
        background: "radial-gradient(ellipse at top left, rgba(100,100,120,0.08), transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
