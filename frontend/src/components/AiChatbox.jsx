import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

/* ── quick-reply suggestions ─────────────────────────────── */
const SUGGESTIONS = [
  'Cách đăng ký tài khoản?',
  'Hệ thống ký quỹ hoạt động thế nào?',
  'Làm thế nào để đăng dự án?',
  'Cách nộp proposal?',
  'Phí dịch vụ của nền tảng?',
  'Liên hệ hỗ trợ ở đâu?',
];

/* ── tiny markdown-ish renderer (bold + newlines only) ───── */
function RenderText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

export default function AiChatbox() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(1);          // badge on FAB
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là **AI Tasker Assistant** — trợ lý 24/7 của bạn.\n\nTôi có thể giúp bạn tìm hiểu cách sử dụng nền tảng, giải đáp thắc mắc về thanh toán, hợp đồng và nhiều hơn nữa. Bạn cần hỗ trợ gì?',
    },
  ]);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const historyRef = useRef([]); // keep last N turns for context

  /* scroll to bottom whenever messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* focus input when chat opens */
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  /* ── send message ─────────────────────────────────────── */
  const sendMessage = async (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build history (last 6 turns, excluding welcome message)
    const history = historyRef.current.slice(-6).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    try {
      const res = await API.post('/ai/chat', { message: msg, history });
      const reply = res.data.reply || 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.';
      const botMsg = { role: 'assistant', content: reply };
      setMessages(prev => [...prev, botMsg]);
      historyRef.current = [...historyRef.current, userMsg, botMsg];
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, kết nối bị gián đoạn. Vui lòng thử lại sau.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{
      role: 'assistant',
      content: 'Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì cho bạn?',
    }]);
  };

  /* ── styles ───────────────────────────────────────────── */
  const S = {
    fab: {
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
      width: '58px', height: '58px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #00f0ff, #b026ff)',
      border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem',
      boxShadow: '0 0 20px rgba(0,240,255,0.4), 0 4px 20px rgba(0,0,0,0.5)',
      transition: 'transform .2s, box-shadow .2s',
    },
    badge: {
      position: 'absolute', top: '-2px', right: '-2px',
      background: '#ff006e', color: '#fff',
      fontSize: '0.65rem', fontWeight: 'bold',
      width: '18px', height: '18px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace', border: '2px solid #05050a',
    },
    window: {
      position: 'fixed', bottom: '100px', right: '28px', zIndex: 9998,
      width: '380px', maxWidth: 'calc(100vw - 40px)',
      height: '560px', maxHeight: 'calc(100vh - 140px)',
      background: 'rgba(5,5,10,0.97)',
      border: '1px solid rgba(0,240,255,0.25)',
      borderRadius: '4px',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 0 40px rgba(0,240,255,0.08), 0 20px 60px rgba(0,0,0,0.7)',
      overflow: 'hidden',
      animation: 'chatFadeIn .18s ease',
    },
    header: {
      padding: '14px 16px',
      background: 'linear-gradient(90deg, rgba(0,240,255,0.08), rgba(176,38,255,0.08))',
      borderBottom: '1px solid rgba(0,240,255,0.12)',
      display: 'flex', alignItems: 'center', gap: '10px',
    },
    avatar: {
      width: '34px', height: '34px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #00f0ff22, #b026ff22)',
      border: '1px solid rgba(0,240,255,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', flexShrink: 0,
    },
    messages: {
      flex: 1, overflowY: 'auto', padding: '14px 12px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    },
    bubble: (role) => ({
      maxWidth: '82%',
      padding: '10px 13px',
      borderRadius: role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
      background: role === 'user'
        ? 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(176,38,255,0.12))'
        : 'rgba(255,255,255,0.04)',
      border: role === 'user'
        ? '1px solid rgba(0,240,255,0.25)'
        : '1px solid rgba(255,255,255,0.07)',
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.82rem',
      lineHeight: '1.55',
      color: role === 'user' ? '#e0f8ff' : '#d4d4e0',
    }),
    suggestions: {
      padding: '8px 12px',
      borderTop: '1px solid rgba(0,240,255,0.08)',
      display: 'flex', gap: '6px', flexWrap: 'wrap',
    },
    chip: {
      padding: '4px 10px', fontSize: '0.68rem',
      background: 'transparent',
      border: '1px solid rgba(0,240,255,0.2)',
      color: 'var(--cp-cyan)',
      fontFamily: 'monospace', cursor: 'pointer',
      borderRadius: '20px', transition: 'all .15s',
      whiteSpace: 'nowrap',
    },
    inputRow: {
      padding: '10px 12px',
      borderTop: '1px solid rgba(0,240,255,0.1)',
      display: 'flex', gap: '8px', alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.2)',
    },
    textarea: {
      flex: 1, resize: 'none',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(0,240,255,0.2)',
      color: '#e0e0ec', padding: '9px 11px',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.82rem', outline: 'none',
      borderRadius: '3px', lineHeight: '1.4',
      maxHeight: '90px', overflowY: 'auto',
    },
    sendBtn: {
      width: '38px', height: '38px', flexShrink: 0,
      background: 'linear-gradient(135deg, #00f0ff, #b026ff)',
      border: 'none', borderRadius: '3px',
      cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', transition: 'opacity .2s',
    },
  };

  return (
    <>
      {/* ── inject keyframe once ─── */}
      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes typingDot {
          0%,80%,100% { opacity:.2; transform: scale(.8); }
          40%         { opacity:1;  transform: scale(1);  }
        }
        .chat-fab:hover { transform: scale(1.1); box-shadow: 0 0 28px rgba(0,240,255,.6), 0 4px 24px rgba(0,0,0,.5) !important; }
        .chat-chip:hover { background: rgba(0,240,255,0.08) !important; border-color: var(--cp-cyan) !important; }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.2); border-radius: 4px; }
      `}</style>

      {/* ── Floating Action Button ── */}
      <button
        className="chat-fab"
        style={S.fab}
        onClick={() => setOpen(o => !o)}
        title="AI Hỗ trợ khách hàng"
      >
        {open ? '✕' : '🤖'}
        {!open && unread > 0 && <span style={S.badge}>{unread}</span>}
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div style={S.window}>

          {/* Header */}
          <div style={S.header}>
            <div style={S.avatar}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', color: 'var(--cp-cyan)', letterSpacing: '1px' }}>
                AI TASKER ASSISTANT
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#39ff14', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39ff14', display: 'inline-block', boxShadow: '0 0 6px #39ff14' }} />
                Online 24/7
              </div>
            </div>
            <button
              onClick={clearChat}
              title="Cuộc trò chuyện mới"
              style={{ background: 'transparent', border: 'none', color: 'var(--cp-text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace', padding: '4px 8px' }}
            >
              🗑 Mới
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--cp-text-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" style={S.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'var(--cp-text-muted)', marginBottom: '3px', paddingLeft: '4px' }}>
                    🤖 AI Assistant
                  </span>
                )}
                <div style={S.bubble(m.role)}>
                  <RenderText text={m.content} />
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'var(--cp-text-muted)', alignSelf: 'flex-end', paddingBottom: '2px' }}>🤖</span>
                <div style={{ ...S.bubble('assistant'), display: 'flex', gap: '5px', alignItems: 'center', padding: '12px 16px' }}>
                  {[0, 0.18, 0.36].map((d, i) => (
                    <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--cp-cyan)', display: 'inline-block', animation: `typingDot 1.2s ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (only show when few messages) */}
          {messages.length <= 2 && (
            <div style={S.suggestions}>
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <button key={i} className="chat-chip" style={S.chip} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={S.inputRow}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              style={S.textarea}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{ ...S.sendBtn, opacity: (loading || !input.trim()) ? 0.4 : 1 }}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}
