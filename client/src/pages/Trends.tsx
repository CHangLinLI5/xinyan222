/**
 * 芯颜 AI — Trends Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, score trend + radar chart + dimension breakdown
 * Features: Line chart trend, radar comparison, per-dimension history
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { MOCK_RECORDS, scoreColor, tagStyle, type SkinRecord } from "@/lib/mockData";

const SORTED = [...MOCK_RECORDS].sort((a, b) => a.date.localeCompare(b.date));
const RECENT_12 = SORTED.slice(-12);
const RECENT_6 = SORTED.slice(-6);

const DIMENSION_LABELS = ["水分含量", "油脂平衡", "色素均匀度", "毛孔细腻度", "肤色亮度", "弹性紧致度"];
const DIMENSION_KEYS = [0, 1, 2, 3, 4, 5];

function formatDate(dateStr: string, short = false) {
  const d = new Date(dateStr + "T00:00:00");
  if (short) return `${d.getMonth() + 1}/${d.getDate()}`;
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

/* Animated line chart for score trend */
function TrendChart({ records }: { records: SkinRecord[] }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = Date.now();
        const dur = 1200;
        const iv = setInterval(() => {
          const p = Math.min((Date.now() - start) / dur, 1);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p >= 1) clearInterval(iv);
        }, 16);
        ob.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const W = 600, H = 140, PAD = { t: 16, r: 16, b: 32, l: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const scores = records.map(r => r.score);
  const minS = Math.min(...scores) - 5;
  const maxS = Math.max(...scores) + 5;

  const toX = (i: number) => PAD.l + (i / (records.length - 1)) * innerW;
  const toY = (s: number) => PAD.t + (1 - (s - minS) / (maxS - minS)) * innerH;

  const points = records.map((r, i) => ({ x: toX(i), y: toY(r.score), score: r.score, date: r.date }));

  // Build path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.t + innerH} L ${points[0].x} ${PAD.t + innerH} Z`;

  // Clipping for animation
  const clipW = innerW * progress;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "140px" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(193,123,92,0.18)" />
          <stop offset="100%" stopColor="rgba(193,123,92,0)" />
        </linearGradient>
        <clipPath id="progressClip">
          <rect x={PAD.l} y={0} width={clipW} height={H} />
        </clipPath>
      </defs>

      {/* Grid lines */}
      {[60, 70, 80, 90].map(v => {
        const y = toY(v);
        if (y < PAD.t || y > PAD.t + innerH) return null;
        return (
          <g key={v}>
            <line x1={PAD.l} y1={y} x2={PAD.l + innerW} y2={y} stroke="rgba(45,36,32,0.06)" strokeWidth="1" />
            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(45,36,32,0.3)" fontFamily="DM Sans, sans-serif">{v}</text>
          </g>
        );
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#areaGrad)" clipPath="url(#progressClip)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="rgba(193,123,92,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#progressClip)" />

      {/* Dots + labels */}
      {points.map((p, i) => (
        <g key={i} style={{ opacity: progress > (i / (points.length - 1)) * 0.8 + 0.1 ? 1 : 0, transition: "opacity 0.3s" }}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#F5F0E8" stroke="rgba(193,123,92,0.8)" strokeWidth="1.5" />
          {i % Math.ceil(records.length / 6) === 0 && (
            <text x={p.x} y={H - 4} textAnchor="middle" fontSize="8" fill="rgba(45,36,32,0.4)" fontFamily="DM Sans, sans-serif">
              {formatDate(p.date, true)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* Radar chart for latest vs previous */
function RadarChart({ current, previous }: { current: number[]; previous: number[] }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = Date.now();
        const dur = 1000;
        const iv = setInterval(() => {
          const p = Math.min((Date.now() - start) / dur, 1);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p >= 1) clearInterval(iv);
        }, 16);
        ob.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const N = 6;
  const CX = 130, CY = 115, R = 85;
  const angles = Array.from({ length: N }, (_, i) => (i * 2 * Math.PI) / N - Math.PI / 2);

  const toPoint = (val: number, angle: number, scale = 1) => ({
    x: CX + (val / 100) * R * scale * Math.cos(angle),
    y: CY + (val / 100) * R * scale * Math.sin(angle),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const polyPath = (vals: number[], scale: number) =>
    vals
      .map((v, i) => {
        const p = toPoint(v * scale, angles[i]);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ") + " Z";

  const LABELS = ["水分", "油脂", "色素", "毛孔", "亮度", "弹性"];
  const labelOffset = 18;

  return (
    <svg viewBox="0 0 260 230" className="w-full" style={{ height: "230px" }}>
      {/* Grid */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={angles.map(a => {
            const p = toPoint(100, a, level);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(45,36,32,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {angles.map((a, i) => {
        const p = toPoint(100, a);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(45,36,32,0.07)" strokeWidth="1" />;
      })}

      {/* Previous area */}
      <path
        d={polyPath(previous, progress)}
        fill="rgba(45,36,32,0.06)"
        stroke="rgba(45,36,32,0.2)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Current area */}
      <path
        d={polyPath(current, progress)}
        fill="rgba(193,123,92,0.12)"
        stroke="rgba(193,123,92,0.7)"
        strokeWidth="1.5"
      />

      {/* Dots */}
      <g ref={ref}>
        {current.map((v, i) => {
          const p = toPoint(v * progress, angles[i]);
          return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C17B5C" opacity="0.8" />;
        })}
      </g>

      {/* Labels */}
      {angles.map((a, i) => {
        const lp = toPoint(100 + labelOffset, a);
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y + 4}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(45,36,32,0.55)"
            fontFamily="DM Sans, sans-serif"
          >
            {LABELS[i]}
          </text>
        );
      })}

      {/* Legend */}
      <g>
        <rect x="160" y="8" width="8" height="8" fill="rgba(193,123,92,0.5)" rx="1" />
        <text x="172" y="16" fontSize="9" fill="rgba(45,36,32,0.5)" fontFamily="DM Sans, sans-serif">最新</text>
        <rect x="160" y="22" width="8" height="8" fill="rgba(45,36,32,0.15)" rx="1" />
        <text x="172" y="30" fontSize="9" fill="rgba(45,36,32,0.5)" fontFamily="DM Sans, sans-serif">上次</text>
      </g>
    </svg>
  );
}

/* Mini sparkline for a single dimension */
function DimSparkline({ values }: { values: number[] }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = Date.now();
        const dur = 800;
        const iv = setInterval(() => {
          const p = Math.min((Date.now() - start) / dur, 1);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p >= 1) clearInterval(iv);
        }, 16);
        ob.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const W = 80, H = 28;
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const toX = (i: number) => (i / (values.length - 1)) * W;
  const toY = (v: number) => H - ((v - min) / (max - min)) * H;
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: "80px", height: "28px" }}>
      <defs>
        <clipPath id={`clip-${values.join("-")}`}>
          <rect x="0" y="0" width={W * progress} height={H} />
        </clipPath>
      </defs>
      <path d={path} fill="none" stroke="rgba(193,123,92,0.6)" strokeWidth="1.5" strokeLinecap="round" clipPath={`url(#clip-${values.join("-")})`} />
    </svg>
  );
}

export default function Trends() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [period, setPeriod] = useState<"6" | "12" | "all">("12");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const displayRecords = period === "6" ? RECENT_6 : period === "12" ? RECENT_12 : SORTED;

  const latest = SORTED[SORTED.length - 1];
  const previous = SORTED[SORTED.length - 2];

  const latestMetrics = latest?.metrics.map(m => m.score) ?? [0, 0, 0, 0, 0, 0];
  const prevMetrics = previous?.metrics.map(m => m.score) ?? [0, 0, 0, 0, 0, 0];

  // Score change
  const scoreDelta = latest && previous ? latest.score - previous.score : 0;

  // Dimension sparklines: last 6 values per dimension
  const dimHistory = DIMENSION_KEYS.map(k =>
    SORTED.slice(-6).map(r => r.metrics[k]?.score ?? 0)
  );

  // Best/worst dimensions
  const dimAvgs = DIMENSION_KEYS.map(k => ({
    label: DIMENSION_LABELS[k],
    avg: Math.round(SORTED.slice(-6).reduce((s, r) => s + (r.metrics[k]?.score ?? 0), 0) / Math.min(SORTED.length, 6)),
    latest: latestMetrics[k],
    history: dimHistory[k],
  }));
  const sorted = [...dimAvgs].sort((a, b) => b.avg - a.avg);

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(193,123,92,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.85)]"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#2D2420] transition-colors text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

        <button
          onClick={() => setLocation("/history")}
          className="text-[#C17B5C] hover:text-[#9A5E42] transition-colors text-sm font-medium"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          历史记录
        </button>
      </header>

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-hidden flex flex-col lg:flex-row anim-fade-in ${ready ? "" : "opacity-0"}`}>

        {/* LEFT: Main charts */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-6">

          {/* Page title + period selector */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div>
              <h2
                className="text-[#2D2420]"
                style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.3rem", fontWeight: 400 }}
              >
                皮肤趋势分析
              </h2>
              <p className="text-[#B5ADA7] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                基于 {SORTED.length} 次历史检测数据
              </p>
            </div>
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(45,36,32,0.1)" }}
            >
              {(["6", "12", "all"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs transition-all duration-200 ${period === p
                    ? "bg-[#C17B5C] text-[#FDFAF7]"
                    : "text-[#9A8C82] hover:text-[#2D2420] bg-transparent"
                    }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {p === "all" ? "全部" : `近${p}次`}
                </button>
              ))}
            </div>
          </div>

          {/* Score trend card */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(253,250,247,0.8)", border: "1px solid rgba(45,36,32,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>综合评分趋势</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className="text-clay-gradient"
                    style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "2rem", fontWeight: 300, lineHeight: 1 }}
                  >
                    {latest?.score ?? "--"}
                  </span>
                  <span className="text-[#B5ADA7] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>/100</span>
                  {scoreDelta !== 0 && (
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${scoreDelta > 0
                        ? "text-[#C17B5C] bg-[rgba(193,123,92,0.1)]"
                        : "text-[#9A5E42] bg-[rgba(154,94,66,0.1)]"
                        }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#B5ADA7] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  最近检测
                </p>
                <p className="text-[#7A6E68] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {latest ? formatDate(latest.date) : "--"}
                </p>
              </div>
            </div>
            <TrendChart records={displayRecords} />
          </div>

          {/* Dimension breakdown */}
          <div>
            <h3
              className="text-[#7A6E68] text-sm mb-3"
              style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 400 }}
            >
              各维度近期走势
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dimAvgs.map((d, i) => {
                const delta = d.latest - (dimHistory[i][dimHistory[i].length - 2] ?? d.latest);
                return (
                  <div
                    key={d.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(253,250,247,0.7)", border: "1px solid rgba(45,36,32,0.07)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#5C4F47] text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d.label}</span>
                        <div className="flex items-center gap-1.5">
                          {delta !== 0 && (
                            <span
                              className={`text-[9px] ${delta > 0 ? "text-[#C17B5C]" : "text-[#9A5E42]"}`}
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {delta > 0 ? "↑" : "↓"}{Math.abs(delta)}
                            </span>
                          )}
                          <span
                            className="text-[#C17B5C] font-medium text-sm"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                          >
                            {d.latest}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(45,36,32,0.07)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${d.latest}%`,
                            background: `rgba(193,123,92,${0.3 + (d.latest / 100) * 0.6})`,
                          }}
                        />
                      </div>
                    </div>
                    <DimSparkline values={d.history} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Radar + insights */}
        <div
          className="hidden lg:flex flex-col flex-shrink-0 border-l border-[rgba(45,36,32,0.07)] overflow-hidden"
          style={{ width: "300px" }}
        >
          {/* Radar */}
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(45,36,32,0.07)]">
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              维度雷达对比
            </p>
            <RadarChart current={latestMetrics} previous={prevMetrics} />
          </div>

          {/* Insights */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              AI 洞察
            </p>

            {/* Best dimension */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "rgba(193,123,92,0.07)", border: "1px solid rgba(193,123,92,0.15)" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(193,123,92,0.15)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L6.18 3.5L9 3.82L7 5.76L7.45 8.5L5 7.27L2.55 8.5L3 5.76L1 3.82L3.82 3.5L5 1Z" fill="#C17B5C" />
                  </svg>
                </div>
                <span className="text-[#C17B5C] text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>优势维度</span>
              </div>
              <p className="text-[#2D2420] text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sorted[0]?.label}</p>
              <p className="text-[#9A8C82] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                近期平均 {sorted[0]?.avg} 分，保持良好
              </p>
            </div>

            {/* Needs attention */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "rgba(45,36,32,0.04)", border: "1px solid rgba(45,36,32,0.08)" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(45,36,32,0.08)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 2V6M5 8V8.5" stroke="#9A8C82" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="5" cy="5" r="4" stroke="#9A8C82" strokeWidth="1" />
                  </svg>
                </div>
                <span className="text-[#7A6E68] text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>需要关注</span>
              </div>
              <p className="text-[#2D2420] text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sorted[sorted.length - 1]?.label}</p>
              <p className="text-[#9A8C82] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                近期平均 {sorted[sorted.length - 1]?.avg} 分，建议重点护理
              </p>
            </div>

            {/* Trend summary */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "rgba(253,250,247,0.8)", border: "1px solid rgba(45,36,32,0.07)" }}
            >
              <p className="text-[#7A6E68] text-xs font-medium mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>近期趋势</p>
              {(() => {
                const last3 = SORTED.slice(-3).map(r => r.score);
                const isUp = last3[2] > last3[0];
                const isStable = Math.abs(last3[2] - last3[0]) <= 3;
                return (
                  <p className="text-[#9A8C82] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {isStable
                      ? "近 3 次检测评分稳定，皮肤状态维持良好，继续坚持当前护肤方案。"
                      : isUp
                        ? "近 3 次检测评分呈上升趋势，护肤方案效果显现，建议继续坚持。"
                        : "近 3 次检测评分略有下降，建议检查护肤步骤，适当补水保湿。"
                    }
                  </p>
                );
              })()}
            </div>

            {/* CTA */}
            <button
              onClick={() => setLocation("/chat")}
              className="btn-primary w-full py-2.5 text-sm mt-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 7.5L6.5 9L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              立即检测更新数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
