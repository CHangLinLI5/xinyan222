/**
 * LUMIÈRE AI — Landing Page
 * Design: Dark Luxe | Deep Espresso + Café Gold
 * Layout: Asymmetric full-screen hero, left text / right image
 * Typography: Cormorant Garamond (display) + DM Sans (body)
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663445632732/YSJ4oSQb66XaWP4wqUTjGd/hero-face-WjEg5morYicKXqnHybAouY.webp";

export default function Home() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0A07] overflow-hidden relative">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 py-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 border border-[#C9A96E] rotate-45 opacity-60" />
            <div className="absolute inset-[3px] bg-[#C9A96E] rotate-45 opacity-30" />
          </div>
          <span
            className="text-[#C9A96E] tracking-[0.3em] text-xs uppercase font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            LUMIÈRE AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["关于", "技术", "案例"].map((item) => (
            <button
              key={item}
              className="text-[#7A6F63] hover:text-[#C9A96E] transition-colors duration-300 text-xs tracking-[0.12em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLocation("/chat")}
          className="btn-luxury text-xs"
        >
          开始检测
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 min-h-[calc(100vh-96px)] flex items-center">
        <div className="w-full px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

          {/* Left: Text Content */}
          <div className="flex flex-col justify-center lg:pr-16">
            {/* Label */}
            <div
              className={`flex items-center gap-3 mb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <div className="h-px w-8 bg-[#C9A96E] opacity-60" />
              <span
                className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase opacity-80"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                AI Skin Intelligence
              </span>
            </div>

            {/* Main Title */}
            <h1
              className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#F5F0E8",
              }}
            >
              了解你的
              <br />
              <span className="text-gold-gradient italic">皮肤状态</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-8 text-[#7A6F63] leading-relaxed max-w-sm transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9375rem",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              上传一张照片，LUMIÈRE AI 将为你深度分析皮肤问题，
              <br className="hidden md:block" />
              提供个性化护肤方案与专业产品建议。
            </p>

            {/* Divider */}
            <div
              className={`my-10 w-16 h-px transition-all duration-700 delay-300 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.5), transparent)" }}
            />

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <button
                onClick={() => setLocation("/chat")}
                className="btn-luxury-filled"
              >
                开始检测
              </button>
              <button
                onClick={() => setLocation("/chat")}
                className="btn-luxury"
              >
                咨询专家
              </button>
            </div>

            {/* Stats row */}
            <div
              className={`mt-14 flex items-center gap-10 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {[
                { value: "98%", label: "分析准确率" },
                { value: "30s", label: "出结果时间" },
                { value: "12+", label: "检测维度" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      color: "#C9A96E",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[#7A6F63] text-[10px] tracking-[0.12em] uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image + Score Badge */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            {/* Image container */}
            <div className="relative w-full max-w-[420px] lg:max-w-[480px]">
              {/* Subtle gold frame */}
              <div
                className="absolute -inset-px"
                style={{
                  background: "linear-gradient(135deg, rgba(201,169,110,0.2) 0%, transparent 50%, rgba(201,169,110,0.1) 100%)",
                  borderRadius: "2px",
                }}
              />

              <img
                src={HERO_IMAGE}
                alt="AI皮肤分析示例"
                className="relative w-full object-cover"
                style={{
                  aspectRatio: "3/4",
                  borderRadius: "2px",
                  filter: "contrast(1.02) brightness(0.98)",
                }}
              />

              {/* Score Badge — only overlay */}
              <div
                className={`absolute bottom-8 -left-6 md:-left-10 card-luxury p-5 min-w-[160px] transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(13,10,7,0.85)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  borderRadius: "2px",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.05)",
                }}
              >
                <div className="flex items-end gap-1 mb-2">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "3rem",
                      fontWeight: 400,
                      color: "#C9A96E",
                      lineHeight: 1,
                    }}
                  >
                    82
                  </span>
                  <span
                    className="text-[#7A6F63] mb-2 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    / 100
                  </span>
                </div>
                <div className="gold-divider mb-2" />
                <p
                  className="text-[#B8AFA0] text-[11px] tracking-[0.08em]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  综合皮肤评分
                </p>
                <div className="mt-3 flex gap-1">
                  {[75, 88, 62, 90, 78].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: "3px",
                        background: `rgba(201,169,110,${v / 100 * 0.8 + 0.1})`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-4 right-4 w-8 h-8 pointer-events-none"
                style={{
                  borderTop: "1px solid rgba(201,169,110,0.4)",
                  borderRight: "1px solid rgba(201,169,110,0.4)",
                }}
              />
              <div
                className="absolute bottom-4 left-4 w-8 h-8 pointer-events-none"
                style={{
                  borderBottom: "1px solid rgba(201,169,110,0.4)",
                  borderLeft: "1px solid rgba(201,169,110,0.4)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-800 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="text-[#7A6F63] text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Scroll
        </span>
        <div className="w-px h-8 overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(to bottom, #C9A96E, transparent)",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
