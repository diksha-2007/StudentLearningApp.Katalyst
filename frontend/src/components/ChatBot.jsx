import { useState } from "react";
import API from "../api";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Katalyst AI. Ask me about trainings, mentors, or career tips!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await API.post("/ai/chatbot", { question });
      setMessages((m) => [...m, { role: "bot", text: res.data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-glass-lg pulse-blue"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border shadow-glass-lg animate-fade-in"
          style={{ background: "var(--bg-glass)", borderColor: "var(--border)", backdropFilter: "blur(16px)" }}
        >
          <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold">Katalyst AI Assistant</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Always here to help</p>
          </div>
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-katalyst-500 text-white"
                    : "mr-auto"
                }`}
                style={msg.role === "bot" ? { background: "var(--accent-light)", color: "var(--text-primary)" } : {}}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="mr-auto rounded-xl px-3 py-2 text-sm" style={{ background: "var(--accent-light)" }}>
                Thinking...
              </div>
            )}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-3" style={{ borderColor: "var(--border)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="input-field !py-2 text-sm"
            />
            <button type="submit" className="btn-primary !px-3 !py-2 text-sm">→</button>
          </form>
        </div>
      )}
    </>
  );
}
