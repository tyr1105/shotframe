// 渐变背景预设
export const gradientPresets = [
  { name: "极光", colors: ["#667eea", "#764ba2"] },
  { name: "日落", colors: ["#f093fb", "#f5576c"] },
  { name: "海洋", colors: ["#4facfe", "#00f2fe"] },
  { name: "森林", colors: ["#43e97b", "#38f9d7"] },
  { name: "火焰", colors: ["#fa709a", "#fee140"] },
  { name: "星空", colors: ["#a18cd1", "#fbc2eb"] },
  { name: "深海", colors: ["#0c3483", "#a2b6df"] },
  { name: "晚霞", colors: ["#ff9a9e", "#fad0c4"] },
  { name: "薄荷", colors: ["#a1c4fd", "#c2e9fb"] },
  { name: "紫雾", colors: ["#d299c2", "#fef9d7"] },
  { name: "暗夜", colors: ["#0f0c29", "#302b63"] },
  { name: "赛博", colors: ["#fc466b", "#3f5efb"] },
  { name: "橙光", colors: ["#f6d365", "#fda085"] },
  { name: "冰川", colors: ["#e0c3fc", "#8ec5fc"] },
  { name: "暗金", colors: ["#1a1a2e", "#e2b714"] },
  { name: "红黑", colors: ["#0f0f0f", "#dc2626"] },
];

// 实色背景预设
export const solidPresets = [
  { name: "纯白", color: "#ffffff" },
  { name: "浅灰", color: "#f3f4f6" },
  { name: "暗灰", color: "#1f2937" },
  { name: "纯黑", color: "#000000" },
  { name: "深蓝", color: "#1e3a5f" },
  { name: "墨绿", color: "#064e3b" },
  { name: "暗紫", color: "#3b0764" },
  { name: "酒红", color: "#7f1d1d" },
  { name: "橙棕", color: "#78350f" },
  { name: "天蓝", color: "#0ea5e9" },
];

// 图片背景预设 (使用CSS pattern)
export const patternPresets = [
  { name: "网点", pattern: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", size: "20px 20px", bgColor: "#f9fafb" },
  { name: "网格", pattern: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", size: "20px 20px", bgColor: "#ffffff" },
  { name: "斜线", pattern: "repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 11px)", size: "auto", bgColor: "#ffffff" },
  { name: "暗点", pattern: "radial-gradient(circle, #374151 1px, transparent 1px)", size: "20px 20px", bgColor: "#111827" },
  { name: "暗格", pattern: "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)", size: "20px 20px", bgColor: "#0f172a" },
];
