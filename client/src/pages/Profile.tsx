/**
 * 芯颜 AI — Profile Page
 * Design: Warm Ivory Minimalism
 * Layout: Full-viewport locked, avatar + skin profile + goals
 * Features: Skin type selection, care goals, preference tags
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MOCK_RECORDS } from "@/lib/mockData";

const SKIN_TYPES = [
  { id: "dry", label: "干性", icon: "M9 3C6.239 3 4 5.239 4 8c0 4 5 9 5 9s5-5 5-9c0-2.761-2.239-5-5-5Z", desc: "皮肤偏干，易紧绷" },
  { id: "oily", label: "油性", icon: "M9 2C5.686 2 3 4.686 3 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z", desc: "T区易出油" },
  { id: "combo", label: "混合性", icon: "M3 9h6M9 3v6M15 9h-3M12 6v3M3 15h18", desc: "T区油，两颊干" },
  { id: "sensitive", label: "敏感性", icon: "M9 3L3 15h12L9 3Z", desc: "易泛红过敏" },
  { id: "normal", label: "中性", icon: "M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1Zm0 14A6 6 0 1 1 9 3a6 6 0 0 1 0 12Z", desc: "水油平衡" },
];

const GOALS = [
  { id: "hydrate", label: "深度补水", icon: "💧" },
  { id: "brighten", label: "提亮肤色", icon: "✨" },
  { id: "pores", label: "收缩毛孔", icon: "🔬" },
  { id: "spots", label: "淡化色斑", icon: "🌸" },
  { id: "firm", label: "紧致抗老", icon: "⏳" },
  { id: "calm", label: "舒缓修护", icon: "🌿" },
  { id: "oil", label: "控油平衡", icon: "⚖️" },
  { id: "sun", label: "防晒防护", icon: "☀️" },
];

const CONCERNS = [
  "黑头", "白头", "痘印", "细纹", "暗沉", "色素沉着",
  "毛孔粗大", "皮肤粗糙", "过敏泛红", "黑眼圈", "法令纹", "颈纹",
];

const ROUTINES = [
  { id: "minimal", label: "极简护肤", desc: "3步以内，高效简洁", icon: "M5 12H19M12 5l7 7-7 7" },
  { id: "standard", label: "标准护肤", desc: "5-7步，全面护理", icon: "M4 6h16M4 12h16M4 18h16" },
  { id: "advanced", label: "进阶护肤", desc: "精华叠加，深度护理", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);
  const [skinType, setSkinType] = useState("combo");
  const [goals, setGoals] = useState<string[]>(["hydrate", "spots"]);
  const [concerns, setConcerns] = useState<string[]>(["毛孔粗大", "暗沉"]);
  const [routine, setRoutine] = useState("standard");
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("芯颜用户");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const totalRecords = MOCK_RECORDS.length;
  const avgScore = Math.round(MOCK_RECORDS.reduce((s, r) => s + r.score, 0) / totalRecords);
  const bestScore = Math.max(...MOCK_RECORDS.map(r => r.score));
  const latestScore = MOCK_RECORDS.sort((a, b) => b.date.localeCompare(a.date))[0]?.score ?? 0;

  const toggleGoal = (id: string) => {
    setGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  };
  const toggleConcern = (c: string) => {
    setConcerns(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(193,123,92,0.06) 0%, transparent 70%)" }} />

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
          onClick={handleSave}
          className={`text-sm font-medium transition-all duration-300 ${saved ? "text-[#9A5E42]" : "text-[#C17B5C] hover:text-[#9A5E42]"}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {saved ? "已保存 ✓" : "保存"}
        </button>
      </header>

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-hidden flex flex-col md:flex-row anim-fade-in ${ready ? "" : "opacity-0"}`}>

        {/* LEFT: Avatar + Stats */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start px-8 py-8 border-b md:border-b-0 md:border-r border-[rgba(45,36,32,0.07)]"
          style={{ width: "100%", maxWidth: "280px", minWidth: "220px" }}
        >
          {/* Avatar */}
          <div className="relative mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(193,123,92,0.15) 0%, rgba(193,123,92,0.08) 100%)",
                border: "1.5px solid rgba(193,123,92,0.25)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="6" stroke="#C17B5C" strokeWidth="1.5" />
                <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#C17B5C", border: "2px solid #F5F0E8" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 1L9 3L3 9H1V7L7 1Z" stroke="#FDFAF7" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Name */}
          <div className="mb-1 flex items-center gap-2">
            {editName ? (
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setEditName(false)}
                onKeyDown={e => e.key === "Enter" && setEditName(false)}
                className="text-center bg-transparent border-b border-[#C17B5C] outline-none text-[#2D2420] text-base w-28"
                style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 400 }}
              />
            ) : (
              <button
                onClick={() => setEditName(true)}
                className="text-[#2D2420] hover:text-[#C17B5C] transition-colors"
                style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem", fontWeight: 400 }}
              >
                {name}
              </button>
            )}
          </div>
          <p className="text-[#B5ADA7] text-xs mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            点击名称可编辑
          </p>

          {/* Stats */}
          <div className="w-full space-y-3">
            {[
              { label: "累计检测", value: totalRecords, unit: "次" },
              { label: "平均评分", value: avgScore, unit: "分" },
              { label: "最高评分", value: bestScore, unit: "分" },
              { label: "最近评分", value: latestScore, unit: "分" },
            ].map(s => (
              <div
                key={s.label}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(253,250,247,0.7)", border: "1px solid rgba(45,36,32,0.07)" }}
              >
                <span className="text-[#9A8C82] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[#C17B5C] font-medium" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>{s.value}</span>
                  <span className="text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick nav */}
          <div className="w-full mt-5 space-y-1.5">
            <button
              onClick={() => setLocation("/trends")}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[#7A6E68] hover:text-[#C17B5C] hover:bg-[rgba(193,123,92,0.06)] transition-all text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 11L5 7L8 9L13 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              趋势分析
            </button>
            <button
              onClick={() => setLocation("/history")}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[#7A6E68] hover:text-[#C17B5C] hover:bg-[rgba(193,123,92,0.06)] transition-all text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
                <path d="M7 4V7L9.5 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              历史记录
            </button>
          </div>
        </div>

        {/* RIGHT: Settings */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-8">

          {/* Skin Type */}
          <section>
            <h3
              className="text-[#2D2420] mb-1"
              style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem", fontWeight: 400 }}
            >
              肤质类型
            </h3>
            <p className="text-[#B5ADA7] text-xs mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              选择最符合你日常皮肤状态的类型
            </p>
            <div className="grid grid-cols-5 gap-2">
              {SKIN_TYPES.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSkinType(st.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${skinType === st.id
                    ? "bg-[rgba(193,123,92,0.12)] border-[rgba(193,123,92,0.4)]"
                    : "bg-[rgba(253,250,247,0.6)] border-[rgba(45,36,32,0.08)] hover:border-[rgba(193,123,92,0.2)]"
                    }`}
                  style={{ border: "1px solid" }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d={st.icon} stroke={skinType === st.id ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span
                    className={`text-xs font-medium ${skinType === st.id ? "text-[#C17B5C]" : "text-[#9A8C82]"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {st.label}
                  </span>
                </button>
              ))}
            </div>
            {skinType && (
              <p className="mt-2 text-[#B5ADA7] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {SKIN_TYPES.find(s => s.id === skinType)?.desc}
              </p>
            )}
          </section>

          <div className="warm-divider" />

          {/* Care Goals */}
          <section>
            <h3
              className="text-[#2D2420] mb-1"
              style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem", fontWeight: 400 }}
            >
              护肤目标
            </h3>
            <p className="text-[#B5ADA7] text-xs mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              选择 1-3 个最重要的护肤目标（已选 {goals.length} 个）
            </p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${goals.includes(g.id)
                    ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border-[rgba(193,123,92,0.35)]"
                    : "bg-[rgba(253,250,247,0.6)] text-[#7A6E68] border-[rgba(45,36,32,0.1)] hover:border-[rgba(193,123,92,0.2)]"
                    }`}
                  style={{ border: "1px solid", fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="text-sm">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </section>

          <div className="warm-divider" />

          {/* Skin Concerns */}
          <section>
            <h3
              className="text-[#2D2420] mb-1"
              style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem", fontWeight: 400 }}
            >
              皮肤困扰
            </h3>
            <p className="text-[#B5ADA7] text-xs mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              标记你目前最想改善的皮肤问题
            </p>
            <div className="flex flex-wrap gap-2">
              {CONCERNS.map(c => (
                <button
                  key={c}
                  onClick={() => toggleConcern(c)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${concerns.includes(c)
                    ? "bg-[rgba(193,123,92,0.1)] text-[#C17B5C] border-[rgba(193,123,92,0.3)]"
                    : "bg-transparent text-[#9A8C82] border-[rgba(45,36,32,0.1)] hover:border-[rgba(193,123,92,0.2)] hover:text-[#7A6E68]"
                    }`}
                  style={{ border: "1px solid", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <div className="warm-divider" />

          {/* Daily Routine */}
          <section>
            <h3
              className="text-[#2D2420] mb-1"
              style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem", fontWeight: 400 }}
            >
              护肤习惯
            </h3>
            <p className="text-[#B5ADA7] text-xs mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              选择最符合你日常护肤步骤的方式
            </p>
            <div className="space-y-2">
              {ROUTINES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRoutine(r.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${routine === r.id
                    ? "bg-[rgba(193,123,92,0.1)] border-[rgba(193,123,92,0.3)]"
                    : "bg-[rgba(253,250,247,0.6)] border-[rgba(45,36,32,0.08)] hover:border-[rgba(193,123,92,0.15)]"
                    }`}
                  style={{ border: "1px solid" }}
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: routine === r.id ? "rgba(193,123,92,0.15)" : "rgba(45,36,32,0.04)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d={r.icon} stroke={routine === r.id ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${routine === r.id ? "text-[#C17B5C]" : "text-[#2D2420]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {r.label}
                    </p>
                    <p className="text-[#B5ADA7] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {r.desc}
                    </p>
                  </div>
                  {routine === r.id && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L7 12L13 4" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Save button */}
          <div className="pb-4">
            <button onClick={handleSave} className="btn-primary w-full py-3">
              {saved ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 7.5L6.5 11L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  已保存
                </>
              ) : "保存个人资料"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
