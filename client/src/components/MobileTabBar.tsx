/**
 * 芯颜 AI — Mobile Bottom Tab Bar
 * Design: Warm Ivory Minimalism
 * Tabs: 检测 | 日历 | 历史记录 | 我的
 * Only visible on mobile (< 768px)
 */

import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";

interface TabItem {
  label: string;
  path: string;
  icon: (active: boolean) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    label: "检测",
    path: "/chat",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" />
        <circle cx="11" cy="11" r="4.5" fill={active ? "rgba(193,123,92,0.15)" : "none"} stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1" />
        <circle cx="11" cy="11" r="1.8" fill={active ? "#C17B5C" : "#B5ADA7"} />
      </svg>
    ),
  },
  {
    label: "日历",
    path: "/calendar",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="15" rx="2" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" />
        <path d="M7 2V5M15 2V5M3 9H19" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" strokeLinecap="round" />
        {active && (
          <>
            <circle cx="8" cy="13" r="1" fill="#C17B5C" />
            <circle cx="11" cy="13" r="1" fill="rgba(193,123,92,0.5)" />
            <circle cx="14" cy="13" r="1" fill="rgba(193,123,92,0.3)" />
          </>
        )}
      </svg>
    ),
  },
  {
    label: "历史",
    path: "/history",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" />
        <path d="M11 6V11L14.5 14.5" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        {active && <circle cx="11" cy="11" r="1.5" fill="rgba(193,123,92,0.3)" />}
      </svg>
    ),
  },
  {
    label: "我的",
    path: "/profile",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" />
        <path d="M4 19C4 15.134 7.134 12.5 11 12.5C14.866 12.5 18 15.134 18 19" stroke={active ? "#C17B5C" : "#B5ADA7"} strokeWidth="1.3" strokeLinecap="round" />
        {active && <circle cx="11" cy="8" r="1.5" fill="rgba(193,123,92,0.2)" />}
      </svg>
    ),
  },
];

/** Pages where the tab bar should be hidden */
const HIDDEN_PATHS = ["/result"];

export default function MobileTabBar() {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();

  if (!isMobile) return null;
  if (HIDDEN_PATHS.some((p) => location.startsWith(p))) return null;

  const currentPath = location === "/" ? "/chat" : location;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-[rgba(45,36,32,0.08)]"
      style={{
        background: "rgba(245,240,232,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = currentPath.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => setLocation(tab.path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 relative"
          >
            {/* Active indicator dot */}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                style={{ background: "#C17B5C" }}
              />
            )}
            <div className="transition-transform duration-200" style={{ transform: isActive ? "scale(1.05)" : "scale(1)" }}>
              {tab.icon(isActive)}
            </div>
            <span
              className="text-[10px] transition-colors duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: isActive ? "#C17B5C" : "#B5ADA7",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
