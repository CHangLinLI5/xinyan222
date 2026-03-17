/**
 * LUMIÈRE AI — Analysis Result Page
 * Design: Dark Luxe | Data visualization as art
 * Features: Large score, progress bars, skincare advice, product cards
 * Typography: Cormorant Garamond (numbers/display) + DM Sans (body)
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const PRODUCT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663445632732/YSJ4oSQb66XaWP4wqUTjGd/product-card-bg-Mn2grjt7cWeMYLN3b2mcrN.webp";

interface SkinMetric {
  label: string;
  score: number;
  status: "优秀" | "良好" | "需改善" | "注意";
  description: string;
}

interface Product {
  name: string;
  brand: string;
  type: string;
  reason: string;
  price: string;
}

const SKIN_METRICS: SkinMetric[] = [
  { label: "水分含量", score: 88, status: "优秀", description: "皮肤水分充足，屏障功能良好" },
  { label: "油脂平衡", score: 72, status: "良好", description: "T区轻微偏油，建议控油保湿并行" },
  { label: "色素均匀度", score: 65, status: "需改善", description: "颧骨区域有轻微色斑，建议使用美白精华" },
  { label: "毛孔细腻度", score: 58, status: "注意", description: "鼻翼两侧毛孔较明显，建议定期深层清洁" },
  { label: "肤色亮度", score: 78, status: "良好", description: "整体肤色均匀，局部暗沉需要改善" },
  { label: "弹性紧致度", score: 91, status: "优秀", description: "胶原蛋白充足，皮肤弹性良好" },
];

const SKINCARE_ADVICE = [
  {
    step: "01",
    title: "深层清洁",
    description: "每周 1-2 次使用酵素粉或泥膜，清洁毛孔内积聚的皮脂与老废角质。避免过度清洁破坏皮脂膜。",
    icon: "◇",
  },
  {
    step: "02",
    title: "精准美白",
    description: "早晚使用含烟酰胺（5%）或维生素C衍生物的精华，针对颧骨色斑区域重点涂抹，坚持4-6周见效。",
    icon: "◇",
  },
  {
    step: "03",
    title: "防晒优先",
    description: "每日使用 SPF50+ PA++++ 的防晒产品，这是预防色斑加深与光老化的最核心步骤，无论晴雨。",
    icon: "◇",
  },
];

const PRODUCTS: Product[] = [
  {
    name: "光感焕亮精华",
    brand: "LA MER",
    type: "精华液",
    reason: "针对色素不均，含海洋精华复合物",
    price: "¥ 1,280",
  },
  {
    name: "毛孔细致精华",
    brand: "SK-II",
    type: "精华液",
    reason: "PITERA™成分，改善毛孔与肤质",
    price: "¥ 960",
  },
  {
    name: "水光防护乳",
    brand: "SHISEIDO",
    type: "防晒乳",
    reason: "SPF50+，轻薄水润，日常必备",
    price: "¥ 380",
  },
];

function useCountUp(target: number, duration: number = 1200, delay: number = 300) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return count;
}

function AnimatedProgressBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(score), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score, delay]);

  const getColor = (s: number) => {
    if (s >= 85) return "#C9A96E";
    if (s >= 70) return "#B8A060";
    if (s >= 55) return "#8B7355";
    return "#6B5A3E";
  };

  return (
    <div ref={ref} className="h-[3px] bg-[rgba(201,169,110,0.08)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${getColor(score)}, ${getColor(score)}cc)`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: SkinMetric["status"] }) {
  const styles: Record<SkinMetric["status"], string> = {
    优秀: "text-[#C9A96E] border-[rgba(201,169,110,0.3)]",
    良好: "text-[#A89060] border-[rgba(168,144,96,0.3)]",
    需改善: "text-[#8B7355] border-[rgba(139,115,85,0.3)]",
    注意: "text-[#6B5A3E] border-[rgba(107,90,62,0.3)]",
  };
  return (
    <span
      className={`text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 ${styles[status]}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {status}
    </span>
  );
}

export default function Result() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const overallScore = useCountUp(82, 1400, 400);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0A07]">
      {/* Ambient */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.05) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-5 border-b border-[rgba(201,169,110,0.08)]">
        <button
          onClick={() => setLocation("/chat")}
          className="flex items-center gap-2 text-[#7A6F63] hover:text-[#C9A96E] transition-colors duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            返回对话
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
          onClick={() => setLocation("/")}
          className="text-[#7A6F63] hover:text-[#C9A96E] transition-colors text-xs tracking-[0.1em] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          重新检测
        </button>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pb-20">

        {/* ── Section 1: Overall Score ── */}
        <section
          className={`pt-12 pb-10 border-b border-[rgba(201,169,110,0.08)] transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Score display */}
            <div>
              <p
                className="text-[#7A6F63] text-[10px] tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                综合皮肤评分
              </p>
              <div className="flex items-end gap-3">
                <span
                  className="text-gold-gradient"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(5rem, 15vw, 8rem)",
                    fontWeight: 300,
                    lineHeight: 0.9,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {overallScore}
                </span>
                <span
                  className="text-[#4A4035] mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                  }}
                >
                  / 100
                </span>
              </div>

              {/* Score label */}
              <div className="flex items-center gap-3 mt-3">
                <div className="h-px w-6 bg-[#C9A96E] opacity-60" />
                <span
                  className="text-[#C9A96E] text-xs tracking-[0.15em]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  皮肤状态良好，有针对性改善空间
                </span>
              </div>
            </div>

            {/* Radar-style score bars */}
            <div className="flex gap-2 items-end">
              {[88, 72, 65, 58, 78, 91].map((score, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-5 rounded-sm transition-all duration-1000 ease-out"
                    style={{
                      height: `${score * 0.6}px`,
                      background: `rgba(201,169,110,${0.2 + (score / 100) * 0.7})`,
                      transitionDelay: `${400 + i * 100}ms`,
                    }}
                  />
                  <div className="w-px h-1 bg-[rgba(201,169,110,0.2)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Date */}
          <p
            className="mt-6 text-[#4A4035] text-[10px] tracking-[0.2em]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            分析时间 · {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </section>

        {/* ── Section 2: Skin Metrics ── */}
        <section
          className={`py-10 border-b border-[rgba(201,169,110,0.08)] transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <SectionTitle label="问题分析" subtitle="12 维度精准检测" />

          <div className="mt-8 space-y-6">
            {SKIN_METRICS.map((metric, i) => (
              <div key={metric.label} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[#F5F0E8] text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {metric.label}
                    </span>
                    <StatusBadge status={metric.status} />
                  </div>
                  <span
                    className="text-[#C9A96E]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.25rem",
                      fontWeight: 400,
                    }}
                  >
                    {metric.score}
                  </span>
                </div>
                <AnimatedProgressBar score={metric.score} delay={i * 120} />
                <p
                  className="mt-1.5 text-[#4A4035] text-[11px] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Skincare Advice ── */}
        <section
          className={`py-10 border-b border-[rgba(201,169,110,0.08)] transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <SectionTitle label="护肤建议" subtitle="AI 个性化方案" />

          <div className="mt-8 space-y-0">
            {SKINCARE_ADVICE.map((advice, i) => (
              <div
                key={advice.step}
                className="flex gap-6 py-6 border-b border-[rgba(201,169,110,0.06)] last:border-0 group"
              >
                {/* Step number */}
                <div className="flex-shrink-0 pt-0.5">
                  <span
                    className="text-[#3A3028] group-hover:text-[rgba(201,169,110,0.3)] transition-colors duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    {advice.step}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#C9A96E] text-xs opacity-60">{advice.icon}</span>
                    <h3
                      className="text-[#F5F0E8] text-base font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {advice.title}
                    </h3>
                  </div>
                  <p
                    className="text-[#7A6F63] text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {advice.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Product Recommendations ── */}
        <section
          className={`py-10 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <SectionTitle label="产品推荐" subtitle="基于肤质精选" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} />
            ))}
          </div>

          {/* Featured product with image */}
          <div
            className="mt-6 rounded-sm overflow-hidden border border-[rgba(201,169,110,0.12)] relative group cursor-pointer"
            style={{ height: "200px" }}
          >
            <img
              src={PRODUCT_IMAGE}
              alt="精选护肤套装"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(13,10,7,0.9) 0%, rgba(13,10,7,0.4) 60%, transparent 100%)" }}
            />
            <div className="absolute inset-0 flex items-center px-8">
              <div>
                <p
                  className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  AI 精选套装
                </p>
                <h3
                  className="text-[#F5F0E8] mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                  }}
                >
                  针对性护肤方案
                </h3>
                <p
                  className="text-[#7A6F63] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  根据你的皮肤状态，AI 为你定制的完整护肤流程
                </p>
                <button className="mt-4 btn-luxury text-[10px] py-2 px-4">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="pt-4 pb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => setLocation("/chat")}
            className="btn-luxury-filled w-full sm:w-auto"
          >
            重新分析
          </button>
          <button className="btn-luxury w-full sm:w-auto">
            保存报告
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ label, subtitle }: { label: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p
          className="text-[#7A6F63] text-[9px] tracking-[0.3em] uppercase mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {subtitle}
        </p>
        <h2
          className="text-[#F5F0E8]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.75rem",
            fontWeight: 300,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </h2>
      </div>
      <div className="h-px w-12 bg-[rgba(201,169,110,0.3)] mb-2" />
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="card-luxury p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Type badge */}
      <span
        className="text-[#7A6F63] text-[9px] tracking-[0.2em] uppercase border border-[rgba(201,169,110,0.1)] px-2 py-0.5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {product.type}
      </span>

      {/* Brand */}
      <p
        className="mt-3 text-[#C9A96E] text-[10px] tracking-[0.25em] uppercase"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {product.brand}
      </p>

      {/* Name */}
      <h3
        className="mt-1 text-[#F5F0E8] leading-tight"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.125rem",
          fontWeight: 400,
        }}
      >
        {product.name}
      </h3>

      {/* Divider */}
      <div className="my-3 gold-divider" />

      {/* Reason */}
      <p
        className="text-[#7A6F63] text-[11px] leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {product.reason}
      </p>

      {/* Price */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-[#C9A96E]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.125rem",
            fontWeight: 400,
          }}
        >
          {product.price}
        </span>
        <button
          className="text-[#7A6F63] group-hover:text-[#C9A96E] transition-colors duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
