/**
 * 芯颜 AI — Landing Page
 * Design: Warm Ivory Minimalism (Claude-inspired)
 * Layout: Full-viewport locked, no scroll, split left/right
 * Colors: Warm cream bg #F2EDE6, terracotta accent #C17B5C
 * Typography: Noto Serif SC (display) + DM Sans (body)
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663445632732/YSJ4oSQb66XaWP4wqUTjGd/hero-face-v2-euoxTCUUMVSboNQDUe9oiM.webp";

const METRICS = [
  { label: "水分", val: 88 },
  { label: "油脂", val: 72 },
  { label: "色斑", val: 65 },
  { label: "毛孔", val: 58 },
  { label: "亮度", val: 78 },
  { label: "弹性", val: 91 },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      {/* Subtle warm texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(193,123,92,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="5" fill="rgba(193,123,92,0.15)" stroke="#C17B5C" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#C17B5C" />
          </svg>
          <span
            className="text-[#2D2420] font-medium tracking-wide text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            芯颜 <span className="text-[#C17B5C]">AI</span>
          </span>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "开始检测", path: "/chat" },
            { label: "护肤日历", path: "/calendar" },
            { label: "历史记录", path: "/history" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setLocation(item.path)}
              className="px-3.5 py-2 text-[#9A8C82] hover:text-[#2D2420] hover:bg-[rgba(45,36,32,0.04)] rounded-lg transition-all duration-200 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA + mobile menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/chat")}
            className="btn-primary text-sm py-2 px-5"
          >
            免费检测
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#9A8C82] hover:text-[#2D2420] hover:bg-[rgba(45,36,32,0.06)] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {menuOpen
                ? <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                : <><path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="relative z-20 md:hidden flex-shrink-0 mx-4 mb-2 rounded-xl border border-[rgba(45,36,32,0.08)] bg-[rgba(253,250,247,0.95)] overflow-hidden" style={{ backdropFilter: "blur(12px)" }}>
          {[
            { label: "开始检测", path: "/chat", icon: "M7.5 1.5C4.186 1.5 1.5 4.186 1.5 7.5S4.186 13.5 7.5 13.5 13.5 10.814 13.5 7.5 10.814 1.5 7.5 1.5Z" },
            { label: "护肤日历", path: "/calendar", icon: "M2 3H13V13H2V3ZM5 1V4M10 1V4M2 7H13" },
            { label: "历史记录", path: "/history", icon: "M8 3V8L11 11M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7Z" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { setLocation(item.path); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-[#5C4F47] hover:text-[#C17B5C] hover:bg-[rgba(193,123,92,0.04)] transition-all border-b border-[rgba(45,36,32,0.05)] last:border-0 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d={item.icon} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 flex items-stretch overflow-hidden">
        {/* Left panel */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-6 min-w-0">

          {/* Badge */}
          <div className={`mb-6 anim-fade-up ${ready ? "" : "opacity-0"}`}>
            <span className="pill-clay">✦ AI 皮肤智能分析</span>
          </div>

          {/* Headline */}
          <h1
            className={`anim-fade-up d-100 ${ready ? "" : "opacity-0"}`}
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              color: "#2D2420",
              letterSpacing: "-0.01em",
            }}
          >
            了解你的
            <br />
            <span className="text-clay-gradient" style={{ fontWeight: 400 }}>
              皮肤状态
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`mt-5 text-[#7A6E68] leading-relaxed max-w-[340px] anim-fade-up d-200 ${ready ? "" : "opacity-0"}`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9375rem", fontWeight: 300 }}
          >
            上传一张照片，芯颜 AI 在 30 秒内为你分析
            12 个皮肤维度，给出专属护肤方案。
          </p>

          {/* Divider */}
          <div className={`my-7 warm-divider w-20 anim-fade-in d-300 ${ready ? "" : "opacity-0"}`} />

          {/* Primary buttons */}
          <div className={`flex flex-wrap gap-3 anim-fade-up d-300 ${ready ? "" : "opacity-0"}`}>
            <button onClick={() => setLocation("/chat")} className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1.5C4.186 1.5 1.5 4.186 1.5 7.5S4.186 13.5 7.5 13.5 13.5 10.814 13.5 7.5 10.814 1.5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5.5 7.5L7 9L9.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              开始检测
            </button>
            <button onClick={() => setLocation("/chat")} className="btn-ghost">
              咨询专家
            </button>
          </div>

          {/* Secondary nav links */}
          <div className={`mt-5 flex items-center gap-4 anim-fade-up d-350 ${ready ? "" : "opacity-0"}`}>
            <button
              onClick={() => setLocation("/calendar")}
              className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#C17B5C] transition-colors text-sm group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:stroke-[#C17B5C] transition-colors">
                <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
                <path d="M4 1V3M10 1V3M1 6H13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              护肤日历
            </button>
            <span className="text-[#DDD7CE]">·</span>
            <button
              onClick={() => setLocation("/history")}
              className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#C17B5C] transition-colors text-sm group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:stroke-[#C17B5C] transition-colors">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
                <path d="M7 4V7L9.5 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              历史记录
            </button>
          </div>

          {/* Stats */}
          <div className={`mt-8 flex items-center gap-8 anim-fade-up d-400 ${ready ? "" : "opacity-0"}`}>
            {[
              { n: "98%", sub: "准确率" },
              { n: "30s", sub: "出结果" },
              { n: "12+", sub: "检测维度" },
            ].map((s) => (
              <div key={s.sub}>
                <div
                  className="text-[#C17B5C]"
                  style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.5rem", fontWeight: 400, lineHeight: 1 }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[#B5ADA7] text-[11px] mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em" }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — image */}
        <div
          className={`hidden md:flex relative flex-shrink-0 items-end justify-center anim-fade-in d-200 ${ready ? "" : "opacity-0"}`}
          style={{ width: "clamp(320px, 42vw, 560px)" }}
        >
          {/* Warm bg shape behind image */}
          <div
            className="absolute bottom-0 right-0 w-[90%] h-[92%]"
            style={{
              background: "linear-gradient(160deg, #E8E2D9 0%, #DDD7CE 100%)",
              borderRadius: "16px 16px 0 0",
            }}
          />

          {/* Portrait */}
          <img
            src={HERO_IMAGE}
            alt="皮肤分析示例"
            className="relative z-10 object-cover object-top"
            style={{
              width: "82%",
              height: "90%",
              borderRadius: "12px 12px 0 0",
              objectPosition: "center top",
            }}
          />

          {/* Score card — floating */}
          <ScoreCard ready={ready} />

          {/* Metrics strip — floating bottom-left */}
          <MetricsStrip ready={ready} />
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className={`relative z-20 flex-shrink-0 flex items-center justify-between px-6 md:px-12 py-3 border-t border-[rgba(45,36,32,0.06)] anim-fade-in d-500 ${ready ? "" : "opacity-0"}`}
      >
        <p
          className="text-[#B5ADA7] text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          © 2025 芯颜 AI · 专业皮肤智能分析
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C17B5C] opacity-70" />
          <span
            className="text-[#B5ADA7] text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            服务运行中
          </span>
        </div>
      </div>
    </div>
  );
}

/* Score card floating overlay */
function ScoreCard({ ready }: { ready: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const start = Date.now();
    const duration = 1200;
    const target = 82;
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [ready]);

  return (
    <div
      className={`absolute top-8 left-0 -translate-x-1/3 z-20 anim-scale-in d-500 ${ready ? "" : "opacity-0"}`}
      style={{
        background: "rgba(253,250,247,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(193,123,92,0.15)",
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(45,36,32,0.1), 0 2px 8px rgba(45,36,32,0.06)",
        minWidth: "148px",
      }}
    >
      <div className="flex items-end gap-1 mb-1">
        <span
          className="text-clay-gradient"
          style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "2.75rem", fontWeight: 400, lineHeight: 1 }}
        >
          {count}
        </span>
        <span className="text-[#B5ADA7] text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          / 100
        </span>
      </div>
      <div className="warm-divider mb-2" />
      <p className="text-[#9A8C82] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        综合皮肤评分
      </p>
      {/* Mini bar chart */}
      <div className="mt-2.5 flex items-end gap-1">
        {[88, 72, 65, 58, 78, 91].map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.round(v * 0.22)}px`,
              background: `rgba(193,123,92,${0.25 + (v / 100) * 0.65})`,
              transition: `height 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Metrics strip */
function MetricsStrip({ ready }: { ready: boolean }) {
  return (
    <div
      className={`absolute bottom-6 right-4 z-20 anim-fade-up d-600 ${ready ? "" : "opacity-0"}`}
      style={{
        background: "rgba(253,250,247,0.88)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(193,123,92,0.12)",
        borderRadius: "10px",
        padding: "12px 14px",
        boxShadow: "0 4px 16px rgba(45,36,32,0.08)",
      }}
    >
      <p
        className="text-[#B5ADA7] text-[10px] mb-2.5 tracking-wider uppercase"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        检测维度
      </p>
      <div className="space-y-1.5">
        {METRICS.map((m) => (
          <div key={m.label} className="flex items-center gap-2.5">
            <span
              className="text-[#7A6E68] text-[11px] w-8 flex-shrink-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {m.label}
            </span>
            <div className="w-20 h-1 bg-[rgba(45,36,32,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${m.val}%`,
                  background: `rgba(193,123,92,${0.35 + (m.val / 100) * 0.55})`,
                  transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </div>
            <span
              className="text-[#C17B5C] text-[11px] w-6 text-right flex-shrink-0"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            >
              {m.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
