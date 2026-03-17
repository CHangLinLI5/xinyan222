/**
 * 芯颜 AI — Mock Data Layer
 * Simulates historical skin analysis records
 */

export interface SkinRecord {
  id: string;
  date: string; // YYYY-MM-DD
  score: number;
  tag: "优秀" | "良好" | "需关注";
  summary: string;
  metrics: {
    label: string;
    score: number;
    status: "优秀" | "良好" | "需改善" | "注意";
    desc: string;
  }[];
  advice: { step: string; title: string; body: string }[];
  products: { name: string; brand: string; type: string; reason: string; price: string }[];
}

const BASE_METRICS = (offsets: number[]) => [
  { label: "水分含量", score: clamp(88 + offsets[0]), status: scoreTag(88 + offsets[0]), desc: "皮肤水分充足，屏障功能良好" },
  { label: "油脂平衡", score: clamp(72 + offsets[1]), status: scoreTag(72 + offsets[1]), desc: "T区轻微偏油，建议控油保湿并行" },
  { label: "色素均匀度", score: clamp(65 + offsets[2]), status: scoreTag(65 + offsets[2]), desc: "颧骨区域有轻微色斑，建议使用美白精华" },
  { label: "毛孔细腻度", score: clamp(58 + offsets[3]), status: scoreTag(58 + offsets[3]), desc: "鼻翼两侧毛孔较明显，建议定期深层清洁" },
  { label: "肤色亮度", score: clamp(78 + offsets[4]), status: scoreTag(78 + offsets[4]), desc: "整体肤色均匀，局部暗沉需要改善" },
  { label: "弹性紧致度", score: clamp(91 + offsets[5]), status: scoreTag(91 + offsets[5]), desc: "胶原蛋白充足，皮肤弹性良好" },
] as SkinRecord["metrics"];

const BASE_ADVICE: SkinRecord["advice"] = [
  { step: "01", title: "深层清洁", body: "每周 1-2 次使用酵素粉或泥膜，清洁毛孔内积聚的皮脂与老废角质。" },
  { step: "02", title: "精准美白", body: "早晚使用含烟酰胺（5%）或维生素C衍生物的精华，针对颧骨色斑区域重点涂抹。" },
  { step: "03", title: "防晒优先", body: "每日使用 SPF50+ PA++++ 防晒产品，这是预防色斑加深与光老化的核心步骤。" },
];

const BASE_PRODUCTS: SkinRecord["products"] = [
  { name: "光感焕亮精华", brand: "LA MER", type: "精华液", reason: "针对色素不均，含海洋精华复合物", price: "¥1,280" },
  { name: "毛孔细致精华", brand: "SK-II", type: "精华液", reason: "PITERA™成分，改善毛孔与肤质", price: "¥960" },
  { name: "水光防护乳", brand: "SHISEIDO", type: "防晒乳", reason: "SPF50+，轻薄水润，日常必备", price: "¥380" },
];

function clamp(n: number) { return Math.max(30, Math.min(99, n)); }
function scoreTag(n: number): "优秀" | "良好" | "需改善" | "注意" {
  if (n >= 85) return "优秀";
  if (n >= 70) return "良好";
  if (n >= 55) return "需改善";
  return "注意";
}
function overallTag(n: number): "优秀" | "良好" | "需关注" {
  if (n >= 85) return "优秀";
  if (n >= 65) return "良好";
  return "需关注";
}

function makeRecord(date: string, score: number, offsets: number[], summary: string): SkinRecord {
  return {
    id: `rec-${date}`,
    date,
    score,
    tag: overallTag(score),
    summary,
    metrics: BASE_METRICS(offsets),
    advice: BASE_ADVICE,
    products: BASE_PRODUCTS,
  };
}

// Generate ~30 records spanning 2024-11 to 2025-03
export const MOCK_RECORDS: SkinRecord[] = [
  // 2025-03
  makeRecord("2025-03-17", 82, [0, 0, 0, 0, 0, 0], "皮肤状态良好，水分充足，色斑区域需持续改善"),
  makeRecord("2025-03-14", 79, [-3, 2, -4, 1, -2, -1], "轻微脱水迹象，建议加强补水步骤"),
  makeRecord("2025-03-10", 85, [4, -1, 3, 2, 3, 2], "本周皮肤状态明显改善，护肤方案效果显现"),
  makeRecord("2025-03-05", 77, [-2, 3, -5, -3, -1, 0], "T区油脂分泌偏多，需注意控油"),
  makeRecord("2025-03-01", 80, [1, -2, 0, -1, 2, 1], "换季期间皮肤状态稳定"),

  // 2025-02
  makeRecord("2025-02-25", 74, [-5, 4, -6, -4, -3, -2], "干燥天气影响水分，建议增加保湿频率"),
  makeRecord("2025-02-20", 81, [2, -1, 1, 0, 2, 1], "皮肤整体状态良好"),
  makeRecord("2025-02-14", 88, [6, -3, 5, 4, 5, 3], "情人节护肤特别护理后，皮肤状态达到近期最佳"),
  makeRecord("2025-02-10", 76, [-3, 2, -3, -2, -1, 0], "轻微敏感，建议减少刺激性产品使用"),
  makeRecord("2025-02-05", 72, [-6, 5, -7, -5, -4, -3], "春节期间作息不规律，皮肤状态下降"),
  makeRecord("2025-02-01", 78, [-1, 1, -2, -1, 0, 1], "节后恢复期，皮肤逐渐改善"),

  // 2025-01
  makeRecord("2025-01-28", 83, [3, -2, 2, 1, 3, 2], "坚持护肤一个月，效果显著"),
  makeRecord("2025-01-20", 80, [1, 0, 0, -1, 2, 1], "皮肤状态稳定"),
  makeRecord("2025-01-15", 75, [-4, 3, -4, -3, -2, -1], "冬季干燥，水分流失明显"),
  makeRecord("2025-01-08", 77, [-2, 2, -3, -2, -1, 0], "新年护肤计划开始执行"),
  makeRecord("2025-01-02", 70, [-8, 6, -8, -6, -5, -4], "年末疲劳，皮肤状态较差"),

  // 2024-12
  makeRecord("2024-12-25", 82, [2, -1, 1, 0, 2, 1], "圣诞节特别护理，皮肤状态良好"),
  makeRecord("2024-12-18", 78, [-1, 2, -2, -1, 0, 0], "冬季护肤调整中"),
  makeRecord("2024-12-10", 74, [-5, 4, -5, -4, -3, -2], "气温骤降，皮肤屏障受损"),
  makeRecord("2024-12-03", 76, [-3, 3, -4, -3, -2, -1], "开始使用冬季护肤方案"),

  // 2024-11
  makeRecord("2024-11-28", 80, [1, -1, 0, 0, 2, 1], "秋冬换季护理到位"),
  makeRecord("2024-11-20", 77, [-2, 2, -3, -2, -1, 0], "换季期间皮肤轻微敏感"),
  makeRecord("2024-11-12", 73, [-6, 4, -6, -5, -4, -3], "初冬干燥，皮肤需要加强保湿"),
  makeRecord("2024-11-05", 79, [0, 0, -1, -1, 1, 1], "秋季护肤收尾，状态稳定"),
];

// Index by date for O(1) lookup
export const RECORDS_BY_DATE: Record<string, SkinRecord> = {};
MOCK_RECORDS.forEach(r => { RECORDS_BY_DATE[r.date] = r; });

// Get all dates that have records for a given YYYY-MM
export function getRecordsForMonth(year: number, month: number): SkinRecord[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return MOCK_RECORDS.filter(r => r.date.startsWith(prefix));
}

// Get all available year-months
export function getAvailableMonths(): { year: number; month: number }[] {
  const seen = new Set<string>();
  const result: { year: number; month: number }[] = [];
  MOCK_RECORDS.forEach(r => {
    const [y, m] = r.date.split("-");
    const key = `${y}-${m}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ year: parseInt(y), month: parseInt(m) });
    }
  });
  return result.sort((a, b) => b.year - a.year || b.month - a.month);
}

export function scoreColor(score: number): string {
  if (score >= 85) return "rgba(193,123,92,0.85)";
  if (score >= 75) return "rgba(193,123,92,0.55)";
  if (score >= 65) return "rgba(193,123,92,0.35)";
  return "rgba(193,123,92,0.2)";
}

export function tagStyle(tag: string): string {
  const map: Record<string, string> = {
    优秀: "text-[#C17B5C] bg-[rgba(193,123,92,0.1)]",
    良好: "text-[#9A7A50] bg-[rgba(154,122,80,0.1)]",
    需改善: "text-[#8B6A45] bg-[rgba(139,106,69,0.1)]",
    注意: "text-[#9A5E42] bg-[rgba(154,94,66,0.12)]",
    需关注: "text-[#9A5E42] bg-[rgba(154,94,66,0.12)]",
  };
  return map[tag] ?? "text-[#9A8C82] bg-[rgba(45,36,32,0.08)]";
}
