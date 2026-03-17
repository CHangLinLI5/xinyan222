/**
 * 芯颜 AI — Report Detail Modal
 * Reusable sheet/modal showing a full skin analysis report for a given date
 * Design: Warm Ivory, slides in from right on desktop, bottom sheet on mobile
 */

import { useEffect, useRef, useState } from "react";
import type { SkinRecord } from "@/lib/mockData";
import { tagStyle } from "@/lib/mockData";

interface Props {
  record: SkinRecord | null;
  onClose: () => void;
}

const PRODUCT_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663445632732/YSJ4oSQb66XaWP4wqUTjGd/product-serum-v2-CqmcLe74kco5BqSJiqWeAN.webp";

function ProgressBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const t = setTimeout(() => setW(score), delay + 100);
    return () => clearTimeout(t);
  }, [score, delay]);
  const alpha = 0.3 + (score / 100) * 0.6;
  return (
    <div ref={ref} className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(45,36,32,0.07)" }}>
      <div className="h-full rounded-full transition-all duration-900 ease-out"
        style={{ width: `${w}%`, background: `rgba(193,123,92,${alpha})`, transitionDuration: "900ms", transitionDelay: `${delay}ms` }} />
    </div>
  );
}

export default function ReportModal({ record, onClose }: Props) {
  const [tab, setTab] = useState<"metrics" | "advice" | "products">("metrics");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (record) {
      setTab("metrics");
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [record]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!record && !visible) return null;

  const dateObj = record ? new Date(record.date + "T00:00:00") : new Date();
  const dateStr = dateObj.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(45,36,32,0.25)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Panel — slides in from right */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: "min(520px, 100vw)",
          background: "linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)",
          boxShadow: "-8px 0 40px rgba(45,36,32,0.12)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-6 pb-4 border-b border-[rgba(45,36,32,0.07)]">
          <div>
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              皮肤分析报告
            </p>
            <h2 className="text-[#2D2420]" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem", fontWeight: 400 }}>
              {dateStr}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A8C82] hover:text-[#2D2420] hover:bg-[rgba(45,36,32,0.06)] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Score strip */}
        {record && (
          <div className="flex-shrink-0 flex items-center gap-5 px-6 py-4 border-b border-[rgba(45,36,32,0.07)]"
            style={{ background: "rgba(253,250,247,0.6)" }}>
            {/* Big score */}
            <div className="flex items-end gap-1">
              <span className="text-clay-gradient" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "3rem", fontWeight: 300, lineHeight: 1 }}>
                {record.score}
              </span>
              <span className="text-[#B5ADA7] mb-1 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>/100</span>
            </div>
            <div className="h-10 w-px bg-[rgba(45,36,32,0.08)]" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagStyle(record.tag)}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {record.tag}
                </span>
              </div>
              <p className="text-[#7A6E68] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {record.summary}
              </p>
            </div>
            {/* Mini bars */}
            <div className="flex items-end gap-1 flex-shrink-0">
              {record.metrics.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-3 rounded-sm" style={{ height: `${Math.round(m.score * 0.28)}px`, background: `rgba(193,123,92,${0.25 + (m.score / 100) * 0.6})` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-[rgba(45,36,32,0.07)] px-4">
          {(["metrics", "advice", "products"] as const).map(t => {
            const labels = { metrics: "问题分析", advice: "护肤建议", products: "产品推荐" };
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm transition-all duration-200 border-b-2 -mb-px ${tab === t ? "border-[#C17B5C] text-[#C17B5C] font-medium" : "border-transparent text-[#9A8C82] hover:text-[#2D2420]"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {record && tab === "metrics" && (
            <div className="space-y-5">
              {record.metrics.map((m, i) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2D2420] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.label}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagStyle(m.status)}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.status}</span>
                    </div>
                    <span className="text-[#C17B5C] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>{m.score}</span>
                  </div>
                  <ProgressBar score={m.score} delay={i * 80} />
                  <p className="mt-1 text-[#B5ADA7] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</p>
                </div>
              ))}
            </div>
          )}

          {record && tab === "advice" && (
            <div>
              {record.advice.map((a, i) => (
                <div key={a.step} className={`flex gap-5 py-5 ${i < record.advice.length - 1 ? "border-b border-[rgba(45,36,32,0.06)]" : ""}`}>
                  <span className="flex-shrink-0 text-[#DDD7CE] pt-0.5" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "2rem", fontWeight: 300, lineHeight: 1 }}>{a.step}</span>
                  <div>
                    <h3 className="text-[#2D2420] font-medium mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.title}</h3>
                    <p className="text-[#7A6E68] text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {record && tab === "products" && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden mb-4" style={{ height: "120px" }}>
                <img src={PRODUCT_IMAGE} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(45,36,32,0.65) 0%, transparent 60%)" }} />
                <div className="absolute inset-0 flex items-center px-5">
                  <div>
                    <p className="text-[rgba(253,250,247,0.6)] text-[10px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI 精选</p>
                    <p className="text-[#FDFAF7] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem" }}>针对性护肤套装</p>
                  </div>
                </div>
              </div>
              {record.products.map(p => (
                <div key={p.name} className="card-warm p-4 flex items-center gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(193,123,92,0.08)" }}>
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="2" stroke="#C17B5C" strokeWidth="1.2" /><path d="M6 6H12M6 9H12M6 12H9" stroke="#C17B5C" strokeWidth="1" strokeLinecap="round" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#C17B5C] text-[10px] font-medium tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.brand}</span>
                      <span className="text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.type}</span>
                    </div>
                    <p className="text-[#2D2420] text-sm font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.name}</p>
                    <p className="text-[#9A8C82] text-xs mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.reason}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[#C17B5C] font-medium text-sm" style={{ fontFamily: "'Noto Serif SC', serif" }}>{p.price}</p>
                    <svg className="ml-auto mt-1 text-[#C4BAB3] group-hover:text-[#C17B5C] transition-colors" width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[rgba(45,36,32,0.07)]">
          <button onClick={handleClose} className="btn-ghost w-full py-2.5 text-sm">关闭报告</button>
        </div>
      </div>
    </>
  );
}
