/**
 * 芯颜 AI — Chat Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, inner scroll only for messages
 * Colors: Warm cream bg, terracotta accent
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

type Role = "user" | "assistant";
interface Msg { id: string; role: Role; content: string; image?: string; analyzing?: boolean; }

const STEPS = [
  "识别面部轮廓...",
  "分析皮肤纹理与毛孔...",
  "检测色斑与色素...",
  "评估水油平衡...",
  "生成个性化报告...",
];

const QUICK = ["我的皮肤适合什么护肤品？", "如何改善毛孔粗大？", "怎样淡化色斑？"];

export default function Chat() {
  const [, setLocation] = useLocation();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const analyze = useCallback((img: string) => {
    setBusy(true); setStep(0); setShowWelcome(false);
    const aid = `a-${Date.now()}`;
    setMsgs(p => [...p, { id: aid, role: "assistant", content: "", analyzing: true }]);
    let s = 0;
    const iv = setInterval(() => {
      s++; setStep(s);
      if (s >= STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => {
          setBusy(false);
          setMsgs(p => p.filter(m => m.id !== aid).concat({
            id: `r-${Date.now()}`, role: "assistant",
            content: "分析完成 ✓\n\n已为你生成完整的皮肤状态报告，包含综合评分、6 项核心指标、个性化护肤建议及产品推荐。",
          }));
          setTimeout(() => setLocation("/result"), 1400);
        }, 600);
      }
    }, 680);
  }, [setLocation]);

  const upload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setShowWelcome(false);
    const r = new FileReader();
    r.onload = e => {
      const url = e.target?.result as string;
      setPreview(url);
      setMsgs(p => [...p, { id: `u-${Date.now()}`, role: "user", content: "请分析我的皮肤状态", image: url }]);
      setTimeout(() => analyze(url), 500);
    };
    r.readAsDataURL(file);
  }, [analyze]);

  const send = (q?: string) => {
    const c = q || text; if (!c.trim()) return;
    setShowWelcome(false);
    setMsgs(p => [...p, { id: `u-${Date.now()}`, role: "user", content: c }]);
    setText("");
    setTimeout(() => {
      setMsgs(p => [...p, { id: `a-${Date.now()}`, role: "assistant", content: "请上传一张清晰的正面照片，我将为你进行全面的皮肤分析。建议在自然光下拍摄，保持面部清洁，以获得最准确的分析结果。" }]);
    }, 700);
  };

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(193,123,92,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.8)]" style={{ backdropFilter: "blur(12px)" }}>
        <button onClick={() => setLocation("/")} className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#2D2420] transition-colors text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          返回
        </button>

        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="5" fill="rgba(193,123,92,0.15)" stroke="#C17B5C" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#C17B5C" />
          </svg>
          <span className="text-[#2D2420] font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            芯颜 <span className="text-[#C17B5C]">AI</span>
          </span>
        </div>

        <button onClick={() => setLocation("/result")} className="text-[#C17B5C] hover:text-[#9A5E42] transition-colors text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          查看报告
        </button>
      </header>

      {/* Body */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
        {showWelcome ? (
          <WelcomeScreen onUpload={() => fileRef.current?.click()} onQuick={send} />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-xl mx-auto space-y-4">
              {msgs.map(m => <Bubble key={m.id} msg={m} step={step} />)}
              <div ref={endRef} />
            </div>
          </div>
        )}
      </div>

      {/* Drag overlay */}
      {drag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(242,237,230,0.92)", border: "2px dashed rgba(193,123,92,0.4)" }}>
          <div className="text-center anim-scale-in">
            <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-xl" style={{ background: "rgba(193,123,92,0.1)", border: "1px solid rgba(193,123,92,0.25)" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4V16M11 4L7 8M11 4L15 8" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 19H19" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /></svg>
            </div>
            <p className="text-[#C17B5C] text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>释放以上传图片</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 flex-shrink-0 border-t border-[rgba(45,36,32,0.07)] bg-[rgba(242,237,230,0.9)]" style={{ backdropFilter: "blur(12px)" }}>
        <div className="max-w-xl mx-auto px-4 py-3">
          {preview && (
            <div className="mb-2 flex items-center gap-2">
              <img src={preview} className="w-9 h-9 object-cover rounded-md border border-[rgba(45,36,32,0.1)]" alt="" />
              <button onClick={() => setPreview(null)} className="text-[#9A8C82] hover:text-[#C17B5C] text-xs transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>移除</button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-xl border border-[rgba(45,36,32,0.12)] bg-[#FDFAF7] px-3.5 py-2.5 focus-within:border-[rgba(193,123,92,0.4)] focus-within:shadow-[0_0_0_3px_rgba(193,123,92,0.08)] transition-all duration-200">
            <button onClick={() => fileRef.current?.click()} disabled={busy} className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[#B5ADA7] hover:text-[#C17B5C] transition-colors disabled:opacity-40" title="上传照片">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="1.5" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><circle cx="6" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M1.5 11.5L5 8.5L8 11L11 8.5L15.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <textarea
              ref={taRef} value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              disabled={busy}
              placeholder="上传照片或输入皮肤问题..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-[#2D2420] placeholder-[#C4BAB3] text-sm leading-relaxed disabled:opacity-40"
              style={{ fontFamily: "'DM Sans', sans-serif", maxHeight: "100px", overflowY: "auto" }}
              onInput={e => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 100) + "px"; }}
            />
            <button onClick={() => send()} disabled={busy || !text.trim()} className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30" style={{ background: text.trim() && !busy ? "#C17B5C" : "transparent" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2L5 7L2 12L12 7Z" stroke={text.trim() && !busy ? "#fff" : "#B5ADA7"} strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className="mt-1.5 text-center text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            支持 JPG / PNG · 建议自然光正面照 · 可拖拽上传
          </p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
    </div>
  );
}

function WelcomeScreen({ onUpload, onQuick }: { onUpload: () => void; onQuick: (q: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center anim-fade-in">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(193,123,92,0.1)", border: "1px solid rgba(193,123,92,0.2)" }}>
        <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.3" />
          <circle cx="11" cy="11" r="5" fill="rgba(193,123,92,0.2)" stroke="#C17B5C" strokeWidth="1" />
          <circle cx="11" cy="11" r="2.2" fill="#C17B5C" />
        </svg>
      </div>
      <h2 className="text-[#2D2420] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.5rem", fontWeight: 400 }}>
        皮肤智能分析
      </h2>
      <p className="text-[#9A8C82] text-sm leading-relaxed max-w-xs mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        上传正面照片，AI 分析 12 个皮肤维度，生成专属护肤方案。
      </p>

      {/* Upload zone */}
      <button onClick={onUpload} className="w-full max-w-sm border-2 border-dashed border-[rgba(193,123,92,0.25)] hover:border-[rgba(193,123,92,0.5)] hover:bg-[rgba(193,123,92,0.03)] rounded-xl p-8 transition-all duration-200 group mb-6">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200" style={{ background: "rgba(193,123,92,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3V13M9 3L5.5 6.5M9 3L12.5 6.5" stroke="#C17B5C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 15H16" stroke="#C17B5C" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" /></svg>
          </div>
          <p className="text-[#C17B5C] text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>点击上传照片</p>
          <p className="text-[#C4BAB3] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>JPG / PNG · 建议正面自然光</p>
        </div>
      </button>

      {/* Quick questions */}
      <div className="w-full max-w-sm">
        <p className="text-[#C4BAB3] text-xs mb-3 tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>或直接提问</p>
        <div className="flex flex-col gap-2">
          {QUICK.map(q => (
            <button key={q} onClick={() => onQuick(q)} className="text-left px-4 py-2.5 rounded-lg border border-[rgba(45,36,32,0.08)] hover:border-[rgba(193,123,92,0.3)] hover:bg-[rgba(193,123,92,0.04)] text-[#7A6E68] hover:text-[#2D2420] text-sm transition-all duration-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg, step }: { msg: Msg; step: number }) {
  const isUser = msg.role === "user";

  if (msg.analyzing) {
    return (
      <div className="flex gap-3 anim-fade-up">
        <AvatarAI />
        <div className="flex-1 rounded-xl px-4 py-4 border border-[rgba(45,36,32,0.08)] bg-[#FDFAF7]" style={{ boxShadow: "0 1px 4px rgba(45,36,32,0.04)" }}>
          <p className="text-[#C17B5C] text-[11px] font-medium tracking-wider uppercase mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI 深度分析中</p>
          <div className="space-y-2.5">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  {i < step ? (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(193,123,92,0.15)" }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#C17B5C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  ) : i === step ? (
                    <div className="w-2 h-2 rounded-full bg-[#C17B5C]" style={{ animation: "dotPulse 1.4s ease-in-out infinite" }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full border border-[rgba(45,36,32,0.15)]" />
                  )}
                </div>
                <span className={`text-xs transition-colors duration-300 ${i <= step ? "text-[#5C4F47]" : "text-[#C4BAB3]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#C17B5C] transition-all duration-700" style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, opacity: 0.7 }} />
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 anim-fade-up">
        <div className="max-w-[78%] flex flex-col items-end gap-1.5">
          {msg.image && <img src={msg.image} className="max-w-[180px] rounded-xl border border-[rgba(45,36,32,0.08)] object-cover" style={{ maxHeight: "220px" }} alt="" />}
          {msg.content && (
            <div className="px-4 py-2.5 rounded-xl rounded-tr-sm" style={{ background: "#C17B5C" }}>
              <p className="text-white text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{msg.content}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 anim-fade-up">
      <AvatarAI />
      <div className="max-w-[82%] rounded-xl rounded-tl-sm px-4 py-3 border border-[rgba(45,36,32,0.08)] bg-[#FDFAF7]" style={{ boxShadow: "0 1px 4px rgba(45,36,32,0.04)" }}>
        <p className="text-[#2D2420] text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: "'DM Sans', sans-serif" }}>{msg.content}</p>
      </div>
    </div>
  );
}

function AvatarAI() {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5" style={{ background: "rgba(193,123,92,0.1)", border: "1px solid rgba(193,123,92,0.2)" }}>
      <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="4" fill="rgba(193,123,92,0.2)" stroke="#C17B5C" strokeWidth="1" />
        <circle cx="11" cy="11" r="1.5" fill="#C17B5C" />
      </svg>
    </div>
  );
}
