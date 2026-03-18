/**
 * 芯颜 AI — Result Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, two-column (score left / details right)
 * Colors: Warm cream bg, terracotta accent
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const PRODUCT_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663445632732/YSJ4oSQb66XaWP4wqUTjGd/product-serum-v2-CqmcLe74kco5BqSJiqWeAN.webp";

interface Metric { label: string; score: number; tag: string; desc: string; }
interface Product { name: string; brand: string; type: string; reason: string; price: string; }

const METRICS: Metric[] = [
  { label: "水分含量", score: 88, tag: "优秀", desc: "皮肤水分充足，屏障功能良好" },
  { label: "油脂平衡", score: 72, tag: "良好", desc: "T区轻微偏油，建议控油保湿并行" },
  { label: "色素均匀度", score: 65, tag: "需改善", desc: "颧骨区域有轻微色斑，建议使用美白精华" },
  { label: "毛孔细腻度", score: 58, tag: "注意", desc: "鼻翼两侧毛孔较明显，建议定期深层清洁" },
  { label: "肤色亮度", score: 78, tag: "良好", desc: "整体肤色均匀，局部暗沉需改善" },
  { label: "弹性紧致度", score: 91, tag: "优秀", desc: "胶原蛋白充足，皮肤弹性良好" },
];

const PRODUCTS: Product[] = [
  { name: "光感焕亮精华", brand: "LA MER", type: "精华液", reason: "针对色素不均，含海洋精华复合物", price: "¥1,280" },
  { name: "毛孔细致精华", brand: "SK-II", type: "精华液", reason: "PITERA™成分，改善毛孔与肤质", price: "¥960" },
  { name: "水光防护乳", brand: "SHISEIDO", type: "防晒乳", reason: "SPF50+，轻薄水润，日常必备", price: "¥380" },
];

const ADVICE = [
  { step: "01", title: "深层清洁", body: "每周 1-2 次使用酵素粉或泥膜，清洁毛孔内积聚的皮脂与老废角质。" },
  { step: "02", title: "精准美白", body: "早晚使用含烟酰胺（5%）或维生素C衍生物的精华，针对颧骨色斑区域重点涂抹。" },
  { step: "03", title: "防晒优先", body: "每日使用 SPF50+ PA++++ 防晒产品，这是预防色斑加深与光老化的核心步骤。" },
];

function useCountUp(target: number, delay = 400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dt = setTimeout(() => {
      const start = Date.now();
      const dur = 1300;
      const iv = setInterval(() => {
        const p = Math.min((Date.now() - start) / dur, 1);
        setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p >= 1) clearInterval(iv);
      }, 16);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(dt);
  }, [target, delay]);
  return n;
}

function ProgressBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setW(score), delay); ob.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [score, delay]);

  const alpha = 0.3 + (score / 100) * 0.6;
  return (
    <div ref={ref} className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(45,36,32,0.07)" }}>
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${w}%`, background: `rgba(193,123,92,${alpha})`, transitionDelay: `${delay}ms` }} />
    </div>
  );
}

const TAG_STYLE: Record<string, string> = {
  优秀: "text-[#C17B5C] bg-[rgba(193,123,92,0.1)]",
  良好: "text-[#9A7A50] bg-[rgba(154,122,80,0.1)]",
  需改善: "text-[#8B6A45] bg-[rgba(139,106,69,0.1)]",
  注意: "text-[#9A5E42] bg-[rgba(154,94,66,0.12)]",
};

export default function Result() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"metrics" | "advice" | "products">("metrics");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const score = useCountUp(82, 300);

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-locked flex flex-col" style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(193,123,92,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.8)]" style={{ backdropFilter: "blur(12px)" }}>
        <button onClick={() => setLocation("/chat")} className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#2D2420] transition-colors text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          返回对话
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/trends")}
            className="hidden sm:flex items-center gap-1.5 text-[#9A8C82] hover:text-[#C17B5C] transition-colors text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 9L4 6L6.5 7.5L11 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            趋势
          </button>
          <button onClick={() => setLocation("/")} className="btn-ghost py-1.5 px-3 text-xs">重新检测</button>
        </div>
      </header>

      {/* Main — two column on desktop, stacked on mobile */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col md:flex-row gap-0">

        {/* LEFT: Score panel */}
        <div
          className={`flex-shrink-0 flex flex-col items-center justify-center px-8 py-6 border-b md:border-b-0 md:border-r border-[rgba(45,36,32,0.07)] anim-fade-in ${ready ? "" : "opacity-0"}`}
          style={{ width: "100%", maxWidth: "280px", minWidth: "220px" }}
        >
          {/* Mobile: horizontal layout */}
          <div className="flex flex-row md:flex-col items-center gap-6 md:gap-4 w-full justify-center">
            {/* Score */}
            <div className="flex flex-col items-center">
              <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>综合评分</p>
              <div className="flex items-end gap-1">
                <span className="text-clay-gradient anim-count-up" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(3.5rem,8vw,5.5rem)", fontWeight: 300, lineHeight: 1 }}>{score}</span>
                <span className="text-[#B5ADA7] mb-2 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>/100</span>
              </div>
              <span className="pill-clay text-[10px] mt-1">皮肤状态良好</span>
            </div>

            {/* Mini metrics chart */}
            <div className="flex items-end gap-1.5">
              {METRICS.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-5 rounded-sm transition-all duration-1000 ease-out" style={{ height: `${Math.round(m.score * 0.45)}px`, background: `rgba(193,123,92,${0.2 + (m.score / 100) * 0.65})`, transitionDelay: `${300 + i * 80}ms` }} />
                  <span className="text-[#C4BAB3] text-[8px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.label.slice(0, 2)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#C4BAB3] text-[10px] mt-3 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })} · 12 维度分析
          </p>
        </div>

        {/* RIGHT: Detail tabs */}
        <div className={`flex-1 flex flex-col overflow-hidden anim-fade-up d-200 ${ready ? "" : "opacity-0"}`}>
          {/* Tab bar */}
          <div className="flex-shrink-0 flex border-b border-[rgba(45,36,32,0.07)] px-5 pt-1">
            {(["metrics", "advice", "products"] as const).map((t) => {
              const labels = { metrics: "问题分析", advice: "护肤建议", products: "产品推荐" };
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 text-sm transition-all duration-200 border-b-2 -mb-px ${tab === t ? "border-[#C17B5C] text-[#C17B5C] font-medium" : "border-transparent text-[#9A8C82] hover:text-[#2D2420]"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Tab content — inner scroll */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {tab === "metrics" && (
              <div className="space-y-5">
                {METRICS.map((m, i) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#2D2420] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.label}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_STYLE[m.tag]}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.tag}</span>
                      </div>
                      <span className="text-[#C17B5C] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>{m.score}</span>
                    </div>
                    <ProgressBar score={m.score} delay={i * 100} />
                    <p className="mt-1 text-[#B5ADA7] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "advice" && (
              <div className="space-y-0">
                {ADVICE.map((a, i) => (
                  <div key={a.step} className={`flex gap-5 py-5 ${i < ADVICE.length - 1 ? "border-b border-[rgba(45,36,32,0.06)]" : ""}`}>
                    <span className="flex-shrink-0 text-[#DDD7CE] pt-0.5" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "2rem", fontWeight: 300, lineHeight: 1 }}>{a.step}</span>
                    <div>
                      <h3 className="text-[#2D2420] font-medium mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.title}</h3>
                      <p className="text-[#7A6E68] text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.body}</p>
                    </div>
                  </div>
                ))}

                {/* Tip card */}
                <div
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: "rgba(193,123,92,0.06)", border: "1px solid rgba(193,123,92,0.15)" }}
                >
                  <p className="text-[#C17B5C] text-xs font-medium mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>💡 芯颜提示</p>
                  <p className="text-[#7A6E68] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    建议每 7-10 天进行一次皮肤检测，持续追踪护肤效果。坚持 4 周后，你将看到明显的改善趋势。
                  </p>
                </div>
              </div>
            )}

            {tab === "products" && (
              <div className="space-y-3">
                {/* Featured image */}
                <div className="relative rounded-xl overflow-hidden mb-4" style={{ height: "130px" }}>
                  <img src={PRODUCT_IMAGE} className="w-full h-full object-cover" alt="精选护肤" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(45,36,32,0.7) 0%, rgba(45,36,32,0.2) 60%, transparent 100%)" }} />
                  <div className="absolute inset-0 flex items-center px-5">
                    <div>
                      <p className="text-[rgba(253,250,247,0.6)] text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI 精选</p>
                      <p className="text-[#FDFAF7] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem", fontWeight: 400 }}>针对性护肤套装</p>
                    </div>
                  </div>
                </div>

                {PRODUCTS.map((p) => (
                  <div key={p.name} className="card-warm p-4 flex items-center gap-4 group cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(193,123,92,0.08)" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="2" stroke="#C17B5C" strokeWidth="1.2" /><path d="M6 6H12M6 9H12M6 12H9" stroke="#C17B5C" strokeWidth="1" strokeLinecap="round" /></svg>
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
                      <svg className="ml-auto mt-1 text-[#C4BAB3] group-hover:text-[#C17B5C] transition-colors" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-[rgba(45,36,32,0.07)] flex gap-3">
            <button onClick={() => setLocation("/chat")} className="btn-primary flex-1 py-2.5 text-sm">重新分析</button>
            <button
              onClick={handleSave}
              className={`btn-ghost flex-1 py-2.5 text-sm transition-all duration-300 ${saved ? "border-[rgba(193,123,92,0.4)] text-[#C17B5C]" : ""}`}
            >
              {saved ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  已保存
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V9M7 9L4 6M7 9L10 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 11H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  保存报告
                </>
              )}
            </button>
            <button
              onClick={() => setLocation("/trends")}
              className="btn-ghost py-2.5 px-3 text-sm"
              title="查看趋势"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 11L5 7L8 9L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar spacing */}
      <div className="md:hidden flex-shrink-0 h-16" />
    </div>
  );
}
