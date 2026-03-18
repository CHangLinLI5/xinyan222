/**
 * 芯颜 AI — Skin Calendar Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, calendar grid with score heatmap
 * Features: Year/month navigation, score dots, click to view report
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  MOCK_RECORDS,
  RECORDS_BY_DATE,
  getRecordsForMonth,
  scoreColor,
  tagStyle,
  type SkinRecord,
} from "@/lib/mockData";
import ReportModal from "@/components/ReportModal";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function Calendar() {
  const [, setLocation] = useLocation();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<SkinRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const monthRecords = getRecordsForMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  // Avg score for month
  const avgScore = monthRecords.length
    ? Math.round(monthRecords.reduce((s, r) => s + r.score, 0) / monthRecords.length)
    : null;

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  // Month trend mini sparkline
  const sortedMonthRecords = [...monthRecords].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(193,123,92,0.05) 0%, transparent 70%)" }} />

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
        <div className="flex items-center gap-3">
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
          <button onClick={() => setLocation("/history")} className="text-[#C17B5C] hover:text-[#9A5E42] transition-colors text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            历史记录
          </button>
        </div>
      </header>

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-hidden flex flex-col lg:flex-row anim-fade-in ${ready ? "" : "opacity-0"}`}>

        {/* LEFT: Calendar */}
        <div className="flex-1 flex flex-col overflow-hidden px-4 md:px-8 py-5">

          {/* Month navigator */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A8C82] hover:text-[#2D2420] hover:bg-[rgba(45,36,32,0.06)] transition-all">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <h2 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.35rem", fontWeight: 400, color: "#2D2420" }}>
                {year} 年 {MONTHS[month - 1]}
              </h2>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A8C82] hover:text-[#2D2420] hover:bg-[rgba(45,36,32,0.06)] transition-all">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Month trend sparkline */}
              {sortedMonthRecords.length >= 2 && (
                <div className="hidden sm:flex items-end gap-0.5 h-6">
                  {sortedMonthRecords.map((r, i) => {
                    const min = Math.min(...sortedMonthRecords.map(x => x.score));
                    const max = Math.max(...sortedMonthRecords.map(x => x.score));
                    const range = max - min || 1;
                    const h = 6 + ((r.score - min) / range) * 14;
                    return (
                      <div
                        key={i}
                        className="w-1.5 rounded-sm"
                        style={{ height: `${h}px`, background: `rgba(193,123,92,${0.3 + (r.score / 100) * 0.55})` }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Month avg score badge */}
              {avgScore !== null && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(193,123,92,0.08)", border: "1px solid rgba(193,123,92,0.15)" }}>
                  <span className="text-[#B5ADA7] text-[10px] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>月均</span>
                  <span className="text-[#C17B5C] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>{avgScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2 flex-shrink-0">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[#C4BAB3] text-xs py-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-7 gap-1.5 h-full" style={{ gridTemplateRows: `repeat(${cells.length / 7}, 1fr)` }}>
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const rec = RECORDS_BY_DATE[dateStr];
                const isToday = dateStr === today.toISOString().split("T")[0];

                return (
                  <button
                    key={dateStr}
                    onClick={() => rec && setSelected(rec)}
                    className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 group ${rec ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                    style={{
                      background: rec
                        ? `rgba(193,123,92,${0.06 + (rec.score / 100) * 0.12})`
                        : "rgba(45,36,32,0.02)",
                      border: isToday
                        ? "1.5px solid rgba(193,123,92,0.5)"
                        : rec
                        ? "1px solid rgba(193,123,92,0.15)"
                        : "1px solid rgba(45,36,32,0.05)",
                      boxShadow: rec ? "0 1px 4px rgba(193,123,92,0.08)" : "none",
                    }}
                  >
                    {/* Day number */}
                    <span
                      className={`text-sm font-medium transition-colors ${rec ? "text-[#2D2420] group-hover:text-[#C17B5C]" : "text-[#C4BAB3]"} ${isToday ? "text-[#C17B5C]" : ""}`}
                      style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}
                    >
                      {day}
                    </span>

                    {/* Score dot */}
                    {rec && (
                      <div className="mt-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: scoreColor(rec.score) }}
                        />
                        <span
                          className="text-[#9A8C82] hidden sm:block"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px" }}
                        >
                          {rec.score}
                        </span>
                      </div>
                    )}

                    {/* Today indicator */}
                    {isToday && (
                      <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#C17B5C]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex-shrink-0 flex items-center gap-4 mt-3 pt-3 border-t border-[rgba(45,36,32,0.06)]">
            <span className="text-[#C4BAB3] text-[10px] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>评分</span>
            {[
              { label: "≥85", alpha: 0.85 },
              { label: "75-84", alpha: 0.55 },
              { label: "65-74", alpha: 0.35 },
              { label: "<65", alpha: 0.2 },
            ].map(({ label, alpha }) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `rgba(193,123,92,${alpha})` }} />
                <span className="text-[#B5ADA7] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#C17B5C]" />
              <span className="text-[#B5ADA7] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>今日</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Month summary sidebar */}
        <div className="hidden lg:flex flex-col flex-shrink-0 border-l border-[rgba(45,36,32,0.07)] overflow-hidden" style={{ width: "280px" }}>
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0">
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>本月记录</p>
            <p className="text-[#2D2420]" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.5rem", fontWeight: 300 }}>
              {monthRecords.length} <span className="text-[#B5ADA7] text-sm">次检测</span>
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {monthRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(193,123,92,0.08)" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#C17B5C" strokeWidth="1.2" /><path d="M6 1V4M12 1V4M2 7H16" stroke="#C17B5C" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
                <p className="text-[#C4BAB3] text-sm mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>本月暂无检测记录</p>
                <button
                  onClick={() => setLocation("/chat")}
                  className="btn-primary text-xs py-2 px-4"
                >
                  立即检测
                </button>
              </div>
            ) : (
              monthRecords
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="w-full text-left card-warm px-3.5 py-3 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#7A6E68] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {new Date(r.date + "T00:00:00").toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", weekday: "short" })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${tagStyle(r.tag)}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.tag}</span>
                        <span className="text-[#C17B5C] font-medium text-sm group-hover:text-[#9A5E42] transition-colors" style={{ fontFamily: "'Noto Serif SC', serif" }}>{r.score}</span>
                      </div>
                    </div>
                    <p className="text-[#9A8C82] text-xs leading-relaxed truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.summary}</p>
                    {/* Mini bar */}
                    <div className="mt-2 flex items-end gap-0.5">
                      {r.metrics.map((m, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.round(m.score * 0.12)}px`, background: `rgba(193,123,92,${0.2 + (m.score / 100) * 0.55})` }} />
                      ))}
                    </div>
                  </button>
                ))
            )}
          </div>

          {/* Quick actions */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-[rgba(45,36,32,0.07)] space-y-2">
            <button onClick={() => setLocation("/trends")} className="btn-primary w-full py-2 text-sm">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 10L4.5 6.5L7 8L12 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              查看趋势分析
            </button>
            <button onClick={() => setLocation("/history")} className="btn-ghost w-full py-2 text-sm">
              查看全部历史
            </button>
          </div>
        </div>
      </div>

      <ReportModal record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
