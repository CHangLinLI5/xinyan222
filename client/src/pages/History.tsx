/**
 * 芯颜 AI — History Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, left filter panel + right record list
 * Features: Year/month filter, timeline list, click to view report, trends link
 */

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  MOCK_RECORDS,
  getAvailableMonths,
  tagStyle,
  scoreColor,
  type SkinRecord,
} from "@/lib/mockData";
import ReportModal from "@/components/ReportModal";

const MONTH_CN = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export default function History() {
  const [, setLocation] = useLocation();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [activeRecord, setActiveRecord] = useState<SkinRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const availableMonths = useMemo(() => getAvailableMonths(), []);
  const availableYears = useMemo(() => Array.from(new Set(availableMonths.map(m => m.year))).sort((a, b) => b - a), [availableMonths]);

  // Filtered records
  const filtered = useMemo(() => {
    return MOCK_RECORDS.filter(r => {
      const [y, m] = r.date.split("-").map(Number);
      if (selectedYear && y !== selectedYear) return false;
      if (selectedMonth && m !== selectedMonth) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedYear, selectedMonth]);

  // Group by year-month for timeline display
  const grouped = useMemo(() => {
    const map = new Map<string, SkinRecord[]>();
    filtered.forEach(r => {
      const [y, m] = r.date.split("-");
      const key = `${y}-${m}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries()).map(([key, records]) => {
      const [y, m] = key.split("-").map(Number);
      return { year: y, month: m, records };
    });
  }, [filtered]);

  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, r) => s + r.score, 0) / filtered.length)
    : null;

  // Score trend (last 8 records)
  const trend = MOCK_RECORDS
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8);
  const trendMax = Math.max(...trend.map(r => r.score));
  const trendMin = Math.min(...trend.map(r => r.score));

  const FilterSidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0">
        <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>筛选</p>

        {/* All records */}
        <button
          onClick={() => { setSelectedYear(null); setSelectedMonth(null); setMobileFilterOpen(false); }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all duration-200 ${!selectedYear && !selectedMonth ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] font-medium" : "text-[#7A6E68] hover:bg-[rgba(45,36,32,0.04)]"}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          全部记录
          <span className="ml-1 text-[10px] text-[#B5ADA7]">({MOCK_RECORDS.length})</span>
        </button>
      </div>

      {/* Year/month tree */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {availableYears.map(y => {
          const months = availableMonths.filter(m => m.year === y);
          const yearCount = MOCK_RECORDS.filter(r => r.date.startsWith(String(y))).length;
          return (
            <div key={y} className="mb-3">
              <button
                onClick={() => { setSelectedYear(y); setSelectedMonth(null); setMobileFilterOpen(false); }}
                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all duration-200 ${selectedYear === y && !selectedMonth ? "text-[#C17B5C] font-medium" : "text-[#5C4F47] hover:text-[#2D2420]"}`}
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                <span>{y} 年</span>
                <span className="text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{yearCount}</span>
              </button>
              <div className="ml-3 mt-0.5 space-y-0.5">
                {months.map(({ month: m }) => {
                  const cnt = MOCK_RECORDS.filter(r => r.date.startsWith(`${y}-${String(m).padStart(2, "0")}`)).length;
                  const isActive = selectedYear === y && selectedMonth === m;
                  return (
                    <button
                      key={m}
                      onClick={() => { setSelectedYear(y); setSelectedMonth(m); setMobileFilterOpen(false); }}
                      className={`w-full text-left flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${isActive ? "bg-[rgba(193,123,92,0.1)] text-[#C17B5C] font-medium" : "text-[#9A8C82] hover:bg-[rgba(45,36,32,0.04)] hover:text-[#2D2420]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span>{MONTH_CN[m]}</span>
                      <span className="text-[10px] text-[#C4BAB3]">{cnt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-[rgba(45,36,32,0.07)] space-y-2">
        <button
          onClick={() => setLocation("/trends")}
          className="btn-primary w-full py-2 text-sm"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 10L4.5 6.5L7 8L12 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          趋势分析
        </button>
        <button
          onClick={() => setLocation("/calendar")}
          className="btn-ghost w-full py-2 text-sm"
        >
          日历视图
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(193,123,92,0.04) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.85)]" style={{ backdropFilter: "blur(12px)" }}>
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
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(v => !v)}
            className="md:hidden flex items-center gap-1.5 text-[#9A8C82] hover:text-[#C17B5C] transition-colors text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            筛选
          </button>
          <button onClick={() => setLocation("/calendar")} className="text-[#C17B5C] hover:text-[#9A5E42] transition-colors text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            日历视图
          </button>
        </div>
      </header>

      {/* Mobile filter dropdown */}
      {mobileFilterOpen && (
        <div
          className="relative z-20 md:hidden flex-shrink-0 mx-4 mb-2 rounded-xl border border-[rgba(45,36,32,0.08)] bg-[rgba(253,250,247,0.97)] overflow-hidden"
          style={{ backdropFilter: "blur(12px)", maxHeight: "300px" }}
        >
          <FilterSidebar />
        </div>
      )}

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-hidden flex anim-fade-in ${ready ? "" : "opacity-0"}`}>

        {/* LEFT: Filter sidebar — desktop only */}
        <div className="hidden md:flex flex-col flex-shrink-0 border-r border-[rgba(45,36,32,0.07)] overflow-hidden" style={{ width: "220px" }}>
          <FilterSidebar />
        </div>

        {/* RIGHT: Records list */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Stats bar */}
          <div className="flex-shrink-0 flex items-center gap-5 px-5 md:px-7 py-3.5 border-b border-[rgba(45,36,32,0.07)] bg-[rgba(253,250,247,0.5)]">
            <div>
              <p className="text-[#B5ADA7] text-[10px] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {selectedYear ? `${selectedYear}年${selectedMonth ? MONTH_CN[selectedMonth] : ""}` : "全部时间"}
              </p>
              <p className="text-[#2D2420]" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem", fontWeight: 400 }}>
                {filtered.length} 条记录
              </p>
            </div>
            {avgScore !== null && (
              <>
                <div className="h-8 w-px bg-[rgba(45,36,32,0.08)]" />
                <div>
                  <p className="text-[#B5ADA7] text-[10px] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>平均评分</p>
                  <p className="text-[#C17B5C]" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>{avgScore}</p>
                </div>
              </>
            )}

            {/* Trend sparkline */}
            <div className="ml-auto hidden sm:flex items-center gap-3">
              <div className="flex items-end gap-1">
                {trend.map((r, i) => {
                  const range = trendMax - trendMin || 1;
                  const h = 8 + ((r.score - trendMin) / range) * 20;
                  return (
                    <div
                      key={r.id}
                      className="w-2 rounded-sm transition-all duration-500"
                      style={{ height: `${h}px`, background: `rgba(193,123,92,${0.25 + (r.score / 100) * 0.6})`, transitionDelay: `${i * 40}ms` }}
                    />
                  );
                })}
                <span className="text-[#C4BAB3] text-[10px] ml-1.5 self-end" style={{ fontFamily: "'DM Sans', sans-serif" }}>趋势</span>
              </div>
              <button
                onClick={() => setLocation("/trends")}
                className="flex items-center gap-1 text-[#C17B5C] hover:text-[#9A5E42] transition-colors text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 9L4 6L6.5 7.5L11 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                详细分析
              </button>
            </div>
          </div>

          {/* Records timeline */}
          <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(193,123,92,0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V10L13 13" stroke="#C17B5C" strokeWidth="1.3" strokeLinecap="round" /><circle cx="10" cy="10" r="8" stroke="#C17B5C" strokeWidth="1.3" /></svg>
                </div>
                <p className="text-[#9A8C82] text-sm mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>暂无符合条件的记录</p>
                <button
                  onClick={() => setLocation("/chat")}
                  className="btn-primary text-sm py-2 px-5"
                >
                  立即检测
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {grouped.map(({ year: y, month: m, records }) => (
                  <div key={`${y}-${m}`}>
                    {/* Group header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "0.95rem", fontWeight: 400, color: "#7A6E68" }}>
                        {y} 年 {MONTH_CN[m]}
                      </h3>
                      <div className="flex-1 h-px bg-[rgba(45,36,32,0.07)]" />
                      <span className="text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{records.length} 次</span>
                    </div>

                    {/* Record cards */}
                    <div className="space-y-2.5">
                      {records.map((r, idx) => {
                        const d = new Date(r.date + "T00:00:00");
                        return (
                          <button
                            key={r.id}
                            onClick={() => setActiveRecord(r)}
                            className="w-full text-left card-warm px-4 py-3.5 group flex items-center gap-4 anim-fade-up"
                            style={{ animationDelay: `${idx * 60}ms` }}
                          >
                            {/* Date block */}
                            <div className="flex-shrink-0 w-10 text-center">
                              <div className="text-[#C17B5C] font-medium leading-none" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.4rem" }}>
                                {d.getDate()}
                              </div>
                              <div className="text-[#C4BAB3] text-[10px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {d.toLocaleDateString("zh-CN", { weekday: "short" })}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="flex-shrink-0 h-10 w-px bg-[rgba(45,36,32,0.08)]" />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tagStyle(r.tag)}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.tag}</span>
                              </div>
                              <p className="text-[#7A6E68] text-xs leading-relaxed truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.summary}</p>
                            </div>

                            {/* Score + mini bars */}
                            <div className="flex-shrink-0 flex items-center gap-3">
                              {/* Mini metric bars */}
                              <div className="hidden sm:flex items-end gap-0.5">
                                {r.metrics.map((mm, i) => (
                                  <div key={i} className="w-2 rounded-sm" style={{ height: `${Math.round(mm.score * 0.14)}px`, background: `rgba(193,123,92,${0.2 + (mm.score / 100) * 0.55})` }} />
                                ))}
                              </div>
                              <div className="text-right">
                                <span className="text-[#C17B5C] font-medium group-hover:text-[#9A5E42] transition-colors" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.4rem" }}>{r.score}</span>
                              </div>
                              <svg className="text-[#C4BAB3] group-hover:text-[#C17B5C] transition-colors flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal record={activeRecord} onClose={() => setActiveRecord(null)} />

      {/* Mobile bottom tab bar spacing */}
      <div className="md:hidden flex-shrink-0 h-16" />
    </div>
  );
}
