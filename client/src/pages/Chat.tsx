/**
 * LUMIÈRE AI — AI Chat Page
 * Design: Dark Luxe | Mobile-first ChatGPT-style interface
 * Features: Text input, image upload, analyzing state, structured result
 * Typography: Cormorant Garamond (display) + DM Sans (body)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  image?: string;
  isAnalyzing?: boolean;
  timestamp: Date;
}

const ANALYZING_STEPS = [
  "正在识别面部区域...",
  "分析皮肤纹理与毛孔...",
  "检测色斑与色素沉淀...",
  "评估水分与油脂平衡...",
  "生成个性化报告...",
];

const QUICK_QUESTIONS = [
  "我的皮肤适合什么护肤品？",
  "如何改善毛孔粗大？",
  "怎样淡化色斑？",
];

export default function Chat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const runAnalysis = useCallback((imageUrl: string) => {
    setIsAnalyzing(true);
    setAnalyzingStep(0);
    setShowWelcome(false);

    const analyzingMsgId = `analyzing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: analyzingMsgId,
        role: "assistant",
        content: "",
        isAnalyzing: true,
        timestamp: new Date(),
      },
    ]);

    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setAnalyzingStep(step);
      if (step >= ANALYZING_STEPS.length - 1) {
        clearInterval(stepInterval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setMessages((prev) =>
            prev
              .filter((m) => m.id !== analyzingMsgId)
              .concat({
                id: `result-${Date.now()}`,
                role: "assistant",
                content: "分析完成。我已为你生成详细的皮肤状态报告，包含综合评分、6项核心指标分析、个性化护肤建议及产品推荐。",
                timestamp: new Date(),
              })
          );
          setTimeout(() => setLocation("/result"), 1200);
        }, 800);
      }
    }, 700);
  }, [setLocation]);

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setShowWelcome(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}`,
            role: "user",
            content: "请分析我的皮肤状态",
            image: imageUrl,
            timestamp: new Date(),
          },
        ]);
        setTimeout(() => runAnalysis(imageUrl), 600);
      };
      reader.readAsDataURL(file);
    },
    [runAnalysis]
  );

  const handleSend = (text?: string) => {
    const content = text || inputText;
    if (!content.trim()) return;
    setShowWelcome(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      },
    ]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: "请上传一张清晰的正面照片，我将为你进行全面的皮肤分析。建议在自然光下拍摄，保持面部清洁无妆，以获得最准确的分析结果。",
          timestamp: new Date(),
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  return (
    <div
      className="min-h-screen bg-[#0D0A07] flex flex-col"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Ambient */}
      <div
        className="fixed top-0 right-0 w-[40vw] h-[40vh] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(201,169,110,0.04) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-5 border-b border-[rgba(201,169,110,0.08)] flex-shrink-0">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-[#7A6F63] hover:text-[#C9A96E] transition-colors duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            返回
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 border border-[#C9A96E] rotate-45 opacity-60" />
            <div className="absolute inset-[2px] bg-[#C9A96E] rotate-45 opacity-30" />
          </div>
          <span
            className="text-[#C9A96E] tracking-[0.25em] text-[11px] uppercase font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            LUMIÈRE AI
          </span>
        </div>

        <button
          onClick={() => setLocation("/result")}
          className="text-[#7A6F63] hover:text-[#C9A96E] transition-colors text-xs tracking-[0.1em] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          查看报告
        </button>
      </header>

      {/* Messages / Welcome */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen
            onUpload={() => fileInputRef.current?.click()}
            onQuickQuestion={handleSend}
          />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                analyzingStep={analyzingStep}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,10,7,0.92)] border-2 border-dashed border-[rgba(201,169,110,0.4)]">
          <div className="text-center animate-fade-in">
            <div
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-[rgba(201,169,110,0.3)]"
              style={{ borderRadius: "2px" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V16M12 4L8 8M12 4L16 8" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20H20" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[#C9A96E] text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              释放以上传图片
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative z-10 border-t border-[rgba(201,169,110,0.08)] bg-[rgba(13,10,7,0.95)] flex-shrink-0" style={{ backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Image preview */}
          {uploadedImage && (
            <div className="mb-3 flex items-center gap-3">
              <img
                src={uploadedImage}
                alt="预览"
                className="w-10 h-10 object-cover border border-[rgba(201,169,110,0.2)]"
                style={{ borderRadius: "2px" }}
              />
              <button
                onClick={() => setUploadedImage(null)}
                className="text-[#7A6F63] hover:text-[#C9A96E] text-xs transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                移除
              </button>
            </div>
          )}

          <div className="flex items-end gap-3 border border-[rgba(201,169,110,0.15)] bg-[#1A1510] px-4 py-3 focus-within:border-[rgba(201,169,110,0.35)] transition-colors duration-300" style={{ borderRadius: "2px" }}>
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#7A6F63] hover:text-[#C9A96E] transition-colors duration-300 disabled:opacity-40"
              title="上传照片"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1.5" y="3" width="15" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="6.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1.5 12L5.5 8.5L8.5 11.5L11.5 8.5L16.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAnalyzing}
              placeholder="上传照片或输入皮肤问题..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-[#F5F0E8] placeholder-[#3A3028] text-sm leading-relaxed disabled:opacity-40"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                maxHeight: "120px",
                overflowY: "auto",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />

            {/* Send button */}
            <button
              onClick={() => handleSend()}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#7A6F63] hover:text-[#C9A96E] transition-colors duration-300 disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2L5.5 8L2 14L14 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p
            className="mt-2 text-center text-[#3A3028] text-[10px] tracking-[0.1em]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            支持 JPG / PNG · 建议自然光正面照 · 可拖拽上传
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// Welcome Screen
function WelcomeScreen({
  onUpload,
  onQuickQuestion,
}: {
  onUpload: () => void;
  onQuickQuestion: (q: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-16 text-center animate-fade-in">
      {/* Logo mark */}
      <div className="w-12 h-12 relative mb-8">
        <div className="absolute inset-0 border border-[rgba(201,169,110,0.4)] rotate-45" style={{ borderRadius: "2px" }} />
        <div className="absolute inset-[4px] border border-[rgba(201,169,110,0.2)] rotate-45" style={{ borderRadius: "1px" }} />
        <div className="absolute inset-[8px] bg-[rgba(201,169,110,0.3)] rotate-45" style={{ borderRadius: "1px" }} />
      </div>

      <h2
        className="text-[#F5F0E8] mb-3"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2rem",
          fontWeight: 300,
          letterSpacing: "0.02em",
        }}
      >
        皮肤智能分析
      </h2>
      <p
        className="text-[#7A6F63] text-sm leading-relaxed max-w-xs mb-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        上传一张清晰的正面照片，AI 将为你分析 12 个皮肤维度，生成专属护肤方案。
      </p>

      {/* Upload zone */}
      <button
        onClick={onUpload}
        className="w-full max-w-sm border border-dashed border-[rgba(201,169,110,0.25)] hover:border-[rgba(201,169,110,0.5)] transition-all duration-300 p-10 group mb-8"
        style={{ borderRadius: "2px" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center border border-[rgba(201,169,110,0.2)] group-hover:border-[rgba(201,169,110,0.4)] transition-colors duration-300"
            style={{ borderRadius: "2px" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V13M9 3L5.5 6.5M9 3L12.5 6.5" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 15H16" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <div>
            <p
              className="text-[#C9A96E] text-sm tracking-[0.1em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              点击上传照片
            </p>
            <p
              className="text-[#4A4035] text-[11px] mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              JPG / PNG · 建议正面自然光
            </p>
          </div>
        </div>
      </button>

      {/* Quick questions */}
      <div className="w-full max-w-sm">
        <p
          className="text-[#4A4035] text-[10px] tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          或者直接提问
        </p>
        <div className="flex flex-col gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onQuickQuestion(q)}
              className="text-left px-4 py-3 border border-[rgba(201,169,110,0.1)] hover:border-[rgba(201,169,110,0.3)] text-[#7A6F63] hover:text-[#B8AFA0] text-sm transition-all duration-300"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: "2px",
                background: "rgba(201,169,110,0.02)",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Message Bubble
function MessageBubble({
  message,
  analyzingStep,
}: {
  message: Message;
  analyzingStep: number;
}) {
  const isUser = message.role === "user";

  if (message.isAnalyzing) {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="flex gap-3 max-w-[90%] w-full">
          <AvatarAI />
          <div
            className="flex-1 px-5 py-4 border border-[rgba(201,169,110,0.15)] bg-[#1A1510]"
            style={{ borderRadius: "2px" }}
          >
            <p
              className="text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              AI 深度分析中
            </p>
            <div className="space-y-3">
              {ANALYZING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    {i < analyzingStep ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i === analyzingStep ? (
                      <div
                        className="w-2 h-2 rounded-full bg-[#C9A96E]"
                        style={{ animation: "pulse-gold 1.5s ease-in-out infinite" }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-[rgba(201,169,110,0.2)]" />
                    )}
                  </div>
                  <span
                    className={`text-xs transition-colors duration-300 ${i <= analyzingStep ? "text-[#B8AFA0]" : "text-[#3A3028]"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-px bg-[rgba(201,169,110,0.08)] overflow-hidden">
              <div
                className="h-full bg-[#C9A96E] transition-all duration-700"
                style={{ width: `${(analyzingStep / (ANALYZING_STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] flex flex-col items-end gap-2">
          {message.image && (
            <img
              src={message.image}
              alt="上传的照片"
              className="max-w-[200px] object-cover border border-[rgba(201,169,110,0.2)]"
              style={{ maxHeight: "240px", borderRadius: "2px" }}
            />
          )}
          {message.content && (
            <div
              className="px-4 py-3 bg-[#231D16] border border-[rgba(201,169,110,0.12)]"
              style={{ borderRadius: "2px" }}
            >
              <p
                className="text-[#F5F0E8] text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {message.content}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex gap-3 max-w-[85%]">
        <AvatarAI />
        <div
          className="px-5 py-4 border border-[rgba(201,169,110,0.1)] bg-[#1A1510]"
          style={{ borderRadius: "2px" }}
        >
          <p
            className="text-[#B8AFA0] text-sm leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function AvatarAI() {
  return (
    <div
      className="flex-shrink-0 w-7 h-7 flex items-center justify-center mt-1"
      style={{
        background: "rgba(201,169,110,0.06)",
        border: "1px solid rgba(201,169,110,0.2)",
        borderRadius: "2px",
      }}
    >
      <div className="w-3 h-3 relative">
        <div
          className="absolute inset-0 border border-[#C9A96E] rotate-45 opacity-70"
          style={{ borderRadius: "1px" }}
        />
      </div>
    </div>
  );
}
