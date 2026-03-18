/**
 * 芯颜 AI — Profile / 个人中心 Page
 * Design: Warm Ivory Minimalism
 * Features: User info card, stats, menu items, settings
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { MOCK_RECORDS } from "@/lib/mockData";

const SKIN_TYPES = ["干性", "油性", "混合偏干", "混合偏油", "中性", "敏感性"];

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn, logout, updateProfile } = useUser();
  const [ready, setReady] = useState(false);
  const [showSkinType, setShowSkinType] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return <GuestProfile onLogin={() => setLocation("/login")} ready={ready} setLocation={setLocation} />;
  }

  const maskedPhone = user!.phone.slice(0, 3) + "****" + user!.phone.slice(-4);

  const menuItems = [
    {
      icon: "M7 3V8L11 11M7 1C3.134 1 0 4.134 0 8s3.134 7 7 7 7-3.134 7-7S10.866 1 7 1Z",
      label: "检测记录",
      sub: `${MOCK_RECORDS.length} 条记录`,
      action: () => setLocation("/history"),
    },
    {
      icon: "M1 3H13V13H1V3ZM4 1V4M10 1V4M1 7H13",
      label: "护肤日历",
      sub: "查看护肤打卡",
      action: () => setLocation("/calendar"),
    },
    {
      icon: "M7 1L9 5H13L10 8L11 12L7 9.5L3 12L4 8L1 5H5L7 1Z",
      label: "我的收藏",
      sub: "3 个方案",
      action: () => {},
    },
    {
      icon: "M2 2H12V12H2V2ZM5 5H9M5 7.5H8",
      label: "护肤方案",
      sub: "查看定制方案",
      action: () => setLocation("/result"),
    },
  ];

  const settingItems = [
    { label: "肤质设置", value: user!.skinType, action: () => setShowSkinType(true) },
    { label: "消息通知", value: "已开启", action: () => {} },
    { label: "隐私设置", value: "", action: () => {} },
    { label: "关于芯颜 AI", value: "v1.0.0", action: () => {} },
  ];

  const handleNicknameSubmit = () => {
    if (nicknameInput.trim()) {
      updateProfile({ nickname: nicknameInput.trim() });
    }
    setEditingNickname(false);
  };

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(193,123,92,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.85)]" style={{ backdropFilter: "blur(12px)" }}>
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
        <span className="text-[#2D2420] font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          个人中心
        </span>
        <button
          onClick={() => setShowLogout(true)}
          className="text-[#9A8C82] hover:text-[#C17B5C] transition-colors text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3C2.448 2 2 2.448 2 3V13C2 13.552 2.448 14 3 14H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M10 11L14 8L10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Body — scrollable */}
      <div className={`relative z-10 flex-1 overflow-y-auto anim-fade-in ${ready ? "" : "opacity-0"}`}>
        <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

          {/* User card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(193,123,92,0.12) 0%, rgba(193,123,92,0.04) 100%)",
              border: "1px solid rgba(193,123,92,0.15)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: "rgba(193,123,92,0.06)" }} />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ background: "rgba(193,123,92,0.04)" }} />

            <div className="relative flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden"
                style={{ border: "2px solid rgba(193,123,92,0.25)" }}
              >
                <img src={user!.avatar} alt="头像" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                {editingNickname ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNicknameSubmit()}
                      autoFocus
                      className="bg-[rgba(253,250,247,0.8)] rounded-lg px-2 py-1 text-[#2D2420] text-sm outline-none border border-[rgba(193,123,92,0.3)] w-28"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      maxLength={12}
                    />
                    <button onClick={handleNicknameSubmit} className="text-[#C17B5C] text-xs">确定</button>
                    <button onClick={() => setEditingNickname(false)} className="text-[#B5ADA7] text-xs">取消</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-[#2D2420] truncate"
                      style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.15rem", fontWeight: 400 }}
                    >
                      {user!.nickname}
                    </h2>
                    <button
                      onClick={() => { setNicknameInput(user!.nickname); setEditingNickname(true); }}
                      className="text-[#B5ADA7] hover:text-[#C17B5C] transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-[#9A8C82] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {maskedPhone}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="pill-clay text-[10px]">{user!.skinType}</span>
                  <span className="text-[#C4BAB3] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    加入于 {user!.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative mt-5 pt-4 border-t border-[rgba(193,123,92,0.12)] grid grid-cols-3 gap-4">
              {[
                { n: String(MOCK_RECORDS.length), label: "检测次数" },
                { n: String(user!.avgScore), label: "平均评分" },
                { n: "28", label: "连续天数" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[#C17B5C]" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.3rem", fontWeight: 400, lineHeight: 1 }}>
                    {s.n}
                  </div>
                  <div className="text-[#B5ADA7] text-[10px] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick menu */}
          <div>
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-2.5 px-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              我的功能
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="card-warm p-4 text-left group flex items-start gap-3"
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                    style={{ background: "rgba(193,123,92,0.08)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d={item.icon} stroke="#C17B5C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#2D2420] text-sm font-medium group-hover:text-[#C17B5C] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.label}
                    </p>
                    <p className="text-[#B5ADA7] text-[10px] mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-2.5 px-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              设置
            </p>
            <div className="card-warm overflow-hidden divide-y divide-[rgba(45,36,32,0.06)]">
              {settingItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[rgba(193,123,92,0.03)] transition-colors group"
                >
                  <span className="text-[#5C4F47] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-[#B5ADA7] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.value}
                      </span>
                    )}
                    <svg className="text-[#C4BAB3] group-hover:text-[#C17B5C] transition-colors" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogout(true)}
            className="w-full py-3 rounded-xl text-sm text-[#9A8C82] hover:text-[#C0392B] border border-[rgba(45,36,32,0.1)] hover:border-[rgba(192,57,43,0.3)] hover:bg-[rgba(192,57,43,0.03)] transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            退出登录
          </button>

          {/* Bottom spacing for mobile tab bar */}
          <div className="h-16 md:h-4" />
        </div>
      </div>

      {/* Skin type picker modal */}
      {showSkinType && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center" onClick={() => setShowSkinType(false)}>
          <div className="absolute inset-0 bg-[rgba(45,36,32,0.3)]" style={{ backdropFilter: "blur(4px)" }} />
          <div
            className="relative w-full md:w-96 bg-[#FDFAF7] rounded-t-2xl md:rounded-2xl p-5 anim-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#2D2420] font-medium mb-4" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.1rem" }}>
              选择肤质类型
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { updateProfile({ skinType: type }); setShowSkinType(false); }}
                  className={`py-3 rounded-xl text-sm transition-all duration-200 ${
                    user!.skinType === type
                      ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.3)] font-medium"
                      : "bg-[rgba(45,36,32,0.04)] text-[#7A6E68] border border-transparent hover:border-[rgba(193,123,92,0.2)]"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSkinType(false)}
              className="w-full mt-4 py-2.5 text-[#9A8C82] text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Logout confirmation modal */}
      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowLogout(false)}>
          <div className="absolute inset-0 bg-[rgba(45,36,32,0.3)]" style={{ backdropFilter: "blur(4px)" }} />
          <div
            className="relative w-80 bg-[#FDFAF7] rounded-2xl p-6 text-center anim-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: "rgba(192,57,43,0.08)" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 3H4C3.448 3 3 3.448 3 4V16C3 16.552 3.448 17 4 17H8" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 14L17 10L13 6" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 10H8" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[#2D2420] font-medium mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.05rem" }}>
              确认退出登录？
            </h3>
            <p className="text-[#9A8C82] text-xs mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              退出后将无法查看个人数据
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 btn-ghost py-2.5 text-sm"
              >
                取消
              </button>
              <button
                onClick={() => { logout(); setShowLogout(false); }}
                className="flex-1 py-2.5 rounded-md text-sm font-medium text-white transition-all duration-200"
                style={{ background: "#C0392B" }}
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Guest profile view — shown when not logged in */
function GuestProfile({ onLogin, ready, setLocation }: { onLogin: () => void; ready: boolean; setLocation: (path: string) => void }) {
  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(193,123,92,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.85)]" style={{ backdropFilter: "blur(12px)" }}>
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
        <span className="text-[#2D2420] font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          个人中心
        </span>
        <div className="w-12" />
      </header>

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-y-auto anim-fade-in ${ready ? "" : "opacity-0"}`}>
        <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

          {/* Guest card */}
          <div
            className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(193,123,92,0.1) 0%, rgba(193,123,92,0.03) 100%)",
              border: "1px solid rgba(193,123,92,0.15)",
            }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: "rgba(193,123,92,0.06)" }} />

            <div className="relative">
              {/* Avatar placeholder */}
              <div
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(193,123,92,0.08)", border: "2px dashed rgba(193,123,92,0.25)" }}
              >
                <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="8" r="3.5" stroke="#C17B5C" strokeWidth="1.3" opacity="0.5" />
                  <path d="M4 19C4 15.134 7.134 12.5 11 12.5C14.866 12.5 18 15.134 18 19" stroke="#C17B5C" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>

              <h2 className="text-[#2D2420] mb-1" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.2rem", fontWeight: 400 }}>
                登录芯颜 AI
              </h2>
              <p className="text-[#9A8C82] text-sm mb-5 max-w-xs mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                登录后可保存检测记录、查看历史报告、获取个性化护肤方案
              </p>

              <button onClick={onLogin} className="btn-primary py-3 px-10 text-sm">
                立即登录
              </button>
            </div>
          </div>

          {/* Feature preview cards */}
          <div>
            <p className="text-[#B5ADA7] text-[10px] tracking-widest uppercase mb-2.5 px-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              登录后可享
            </p>
            <div className="space-y-2.5">
              {[
                { icon: "M7 3V8L11 11M7 1C3.134 1 0 4.134 0 8s3.134 7 7 7 7-3.134 7-7S10.866 1 7 1Z", title: "检测记录云端同步", desc: "所有检测数据自动保存，随时回顾皮肤变化趋势" },
                { icon: "M1 3H13V13H1V3ZM4 1V4M10 1V4M1 7H13", title: "护肤日历提醒", desc: "智能提醒护肤步骤，养成良好护肤习惯" },
                { icon: "M7 1L9 5H13L10 8L11 12L7 9.5L3 12L4 8L1 5H5L7 1Z", title: "专属护肤方案", desc: "根据肤质和检测结果，定制个性化护肤方案" },
              ].map((item) => (
                <div key={item.title} className="card-warm p-4 flex items-start gap-3.5">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(193,123,92,0.08)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d={item.icon} stroke="#C17B5C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#2D2420] text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.title}
                    </p>
                    <p className="text-[#B5ADA7] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom spacing for mobile tab bar */}
          <div className="h-16 md:h-4" />
        </div>
      </div>
    </div>
  );
}
