import { useState, useEffect } from "react";

const CHAT_MESSAGES = [
  { from: "bot", text: "Hey! Welcome to my portfolio. 👋", delay: 500 },
  { from: "bot", text: "I'm Santhosh, an Angular Developer & Platform Engineer.", delay: 1500 },
  { from: "bot", text: "Ask me anything about my projects, clinical telemetry systems, or availability!", delay: 2800 },
];

const SUGGESTIONS = [
  "What is your primary tech stack?",
  "Tell me about the TeleICU project",
  "Are you open for new opportunities?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visibleMsgs, setVisibleMsgs] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [userMsgs, setUserMsgs] = useState([]);
  const [typingDots, setTypingDots] = useState(false);

  // Show bot messages one by one on open
  useEffect(() => {
    if (!open) return;
    setVisibleMsgs([]);
    const timers = CHAT_MESSAGES.map((msg) => {
      const typingTimer = setTimeout(() => setTypingDots(true), msg.delay - 400);
      const msgTimer = setTimeout(() => {
        setTypingDots(false);
        setVisibleMsgs(prev => [...prev, msg]);
      }, msg.delay);
      return [typingTimer, msgTimer];
    });
    return () => timers.flat().forEach(clearTimeout);
  }, [open]);

  const replyToQuery = (query) => {
    setTypingDots(true);
    setTimeout(() => {
      setTypingDots(false);
      const q = query.toLowerCase();
      let reply = "Thanks for asking! You can reach me directly at santhoshdalwin@gmail.com or +91 73395 50087.";
      if (q.includes("stack") || q.includes("tech")) {
        reply = "My core stack is Angular 17+ (Signals, RxJS, NgRx), TypeScript, .NET Core 8, Azure SignalR, WebRTC, and Tailwind CSS.";
      } else if (q.includes("teleicu") || q.includes("icu") || q.includes("project")) {
        reply = "TeleICU is a mission-critical platform monitoring 50+ concurrent ICU beds with sub-80ms vitals streaming and clinical alert engines built for hospitals.";
      } else if (q.includes("opportunity") || q.includes("available") || q.includes("hire") || q.includes("work")) {
        reply = "Yes, I am actively open for high-impact frontend and full-stack engineering roles, both remote and hybrid!";
      }
      setVisibleMsgs(prev => [...prev, { from: "bot", text: reply }]);
    }, 1000);
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;
    setUserMsgs(prev => [...prev, text.trim()]);
    setInputVal("");
    replyToQuery(text.trim());
  };

  return (
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className="chat-bubble-btn"
        aria-label="Toggle live chat assistant"
      >
        {!open ? (
          <div className="chat-bubble-inner">
            <img src="/portimg.png" alt="Santhosh Dalwin" className="chat-bubble-avatar" />
            <div className="chat-bubble-status">
              <span className="chat-bubble-name">Santhosh</span>
              <span className="chat-bubble-online">
                <span className="chat-online-dot" />
                Available to chat
              </span>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 18, color: "#cbd5e1" }}>✕</span>
        )}
      </button>

      {/* Chat panel */}
      <div className={`chat-panel ${open ? "chat-panel-open" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <img src="/portimg.png" alt="Santhosh Dalwin" className="chat-header-avatar" />
          <div>
            <div className="chat-header-name">Santhosh Dalwin</div>
            <div className="chat-header-status">
              <span className="chat-online-dot" />
              Online • AI Interactive Assistant
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="chat-close-btn"
            aria-label="Close chat window"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {visibleMsgs.map((msg, i) => (
            <div
              key={`bot-${i}`}
              className={`chat-msg chat-msg-${msg.from}`}
              style={{ animation: "chatMsgIn 0.3s ease forwards" }}
            >
              {msg.text}
            </div>
          ))}
          {userMsgs.map((msg, i) => (
            <div
              key={`user-${i}`}
              className="chat-msg chat-msg-user"
              style={{ animation: "chatMsgIn 0.3s ease forwards" }}
            >
              {msg}
            </div>
          ))}
          {typingDots && (
            <div className="chat-msg chat-msg-bot chat-typing">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          )}

          {/* Quick suggestions when conversation starts */}
          {visibleMsgs.length >= 2 && userMsgs.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted, #64748b)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Suggested questions:
              </span>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 12,
                    padding: "7px 12px",
                    color: "var(--accent-cyan, #38bdf8)",
                    fontSize: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.12)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me a question..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            className="chat-send-btn"
            onClick={() => handleSend()}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Prompt tooltip when closed */}
      {!open && (
        <div className="chat-prompt" onClick={() => setOpen(true)}>
          <span>👋 Have questions about my work? Let's chat!</span>
        </div>
      )}
    </>
  );
}
