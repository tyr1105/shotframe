"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload, Download, RotateCcw, Image as ImageIcon,
  Palette, Layers, Type, Settings2, Sparkles
} from "lucide-react";
import { type EditorSettings, type BackgroundType, type DeviceType, type WatermarkPosition } from "@/lib/types";
import { gradientPresets, solidPresets, patternPresets } from "@/lib/presets";

const defaultSettings: EditorSettings = {
  bgType: "gradient",
  gradientIndex: 0,
  solidColor: "#1f2937",
  patternIndex: 0,
  bgImage: null,
  padding: 64,
  borderRadius: 12,
  shadowEnabled: true,
  shadowBlur: 40,
  shadowColor: "rgba(0,0,0,0.3)",
  device: "none",
  deviceScale: 1,
  watermark: "",
  watermarkPosition: "bottom-center",
  exportScale: 2,
  bgBlur: 0,
};

type Tab = "bg" | "frame" | "text" | "export";

export default function Editor() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [tab, setTab] = useState<Tab>("bg");
  const [dragover, setDragover] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 处理图片上传
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImage(url);
        setImageSize({ w: img.width, h: img.height });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  // 拖拽上传
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // 粘贴上传
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          handleFile(item.getAsFile()!);
          break;
        }
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [handleFile]);

  // 导出
  const handleExport = useCallback(() => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const pad = settings.padding * settings.exportScale;
      const scale = settings.exportScale;
      const radius = settings.borderRadius * scale;
      
      let canvasW = (img.width * scale) + pad * 2;
      let canvasH = (img.height * scale) + pad * 2;
      
      // 设备框额外空间
      if (settings.device === "browser") {
        canvasH += 40 * scale;
      } else if (settings.device === "phone") {
        canvasW += 20 * scale;
        canvasH += 80 * scale;
      } else if (settings.device === "laptop") {
        canvasH += 50 * scale;
      } else if (settings.device === "tablet") {
        canvasW += 30 * scale;
        canvasH += 50 * scale;
      }
      
      canvas.width = canvasW;
      canvas.height = canvasH;

      // 绘制背景
      if (settings.bgType === "gradient") {
        const g = gradientPresets[settings.gradientIndex];
        const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
        grad.addColorStop(0, g.colors[0]);
        grad.addColorStop(1, g.colors[1]);
        ctx.fillStyle = grad;
      } else if (settings.bgType === "solid") {
        ctx.fillStyle = settings.solidColor;
      } else if (settings.bgType === "pattern") {
        const p = patternPresets[settings.patternIndex];
        ctx.fillStyle = p.bgColor;
      } else {
        ctx.fillStyle = "#1f2937";
      }
      ctx.fillRect(0, 0, canvasW, canvasH);

      // 阴影
      if (settings.shadowEnabled) {
        ctx.shadowColor = settings.shadowColor;
        ctx.shadowBlur = settings.shadowBlur * scale;
        ctx.shadowOffsetY = 10 * scale;
      }

      // 圆角裁剪
      const imgX = pad;
      const imgY = pad + (settings.device === "browser" ? 40 * scale : 0);
      const imgW = img.width * scale;
      const imgH = img.height * scale;

      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, radius);
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgW, imgH);

      // 重置阴影
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 水印
      if (settings.watermark && settings.watermarkPosition !== "none") {
        ctx.font = `${14 * scale}px -apple-system, sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.textAlign = "center";
        const y = canvasH - 20 * scale;
        ctx.fillText(settings.watermark, canvasW / 2, y);
      }

      // 下载
      const link = document.createElement("a");
      link.download = `shotframe_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  }, [image, settings]);

  // 更新设置
  const update = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 获取背景样式
  const getBgStyle = () => {
    if (settings.bgType === "gradient") {
      const g = gradientPresets[settings.gradientIndex];
      return { background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` };
    }
    if (settings.bgType === "solid") {
      return { background: settings.solidColor };
    }
    if (settings.bgType === "pattern") {
      const p = patternPresets[settings.patternIndex];
      return { background: `${p.pattern}, ${p.bgColor}`, backgroundSize: p.size };
    }
    if (settings.bgType === "image" && settings.bgImage) {
      return { 
        backgroundImage: `url(${settings.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: settings.bgBlur > 0 ? `blur(${settings.bgBlur}px)` : undefined,
      };
    }
    return { background: "#1f2937" };
  };

  // 获取设备框样式
  const getDeviceFrame = () => {
    if (settings.device === "browser") {
      return (
        <div className="bg-[#1e1e2e] rounded-t-lg border-b border-[#333]">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex-1 bg-[#2a2a3e] rounded px-3 py-0.5 text-xs text-[#666] truncate">
              shotframe.dev
            </div>
          </div>
        </div>
      );
    }
    if (settings.device === "phone") {
      return (
        <div className="bg-[#1a1a1a] rounded-[2rem] p-3 border border-[#333]">
          <div className="bg-black rounded-t-2xl flex items-center justify-center py-1">
            <div className="w-16 h-3 bg-[#1a1a1a] rounded-b-lg" />
          </div>
        </div>
      );
    }
    return null;
  };

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: "bg", icon: <Palette className="w-4 h-4" />, label: "背景" },
    { key: "frame", icon: <Layers className="w-4 h-4" />, label: "样式" },
    { key: "text", icon: <Type className="w-4 h-4" />, label: "水印" },
    { key: "export", icon: <Settings2 className="w-4 h-4" />, label: "导出" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem-80px)]">
      {/* 左侧控制面板 */}
      <div className="lg:w-[320px] border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col">
        {/* 标签栏 */}
        <div className="flex border-b border-[var(--border)]">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors cursor-pointer ${
                tab === t.key
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* 控制内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === "bg" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">背景类型</label>
                <div className="flex gap-2">
                  {(["gradient", "solid", "pattern"] as BackgroundType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => update("bgType", t)}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                        settings.bgType === t
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                      }`}
                    >
                      {t === "gradient" ? "渐变" : t === "solid" ? "纯色" : "图案"}
                    </button>
                  ))}
                </div>
              </div>

              {settings.bgType === "gradient" && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">渐变背景</label>
                  <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.map((g, i) => (
                      <button
                        key={i}
                        onClick={() => update("gradientIndex", i)}
                        className={`aspect-square rounded-lg transition-all cursor-pointer ${
                          settings.gradientIndex === i ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-secondary)]" : "hover:scale-105"
                        }`}
                        style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
                        title={g.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {settings.bgType === "solid" && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">纯色背景</label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {solidPresets.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => update("solidColor", s.color)}
                        className={`aspect-square rounded-lg border border-[var(--border)] transition-all cursor-pointer ${
                          settings.solidColor === s.color ? "ring-2 ring-white" : "hover:scale-105"
                        }`}
                        style={{ background: s.color }}
                        title={s.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.solidColor} onChange={e => update("solidColor", e.target.value)} />
                    <span className="text-xs text-[var(--text-secondary)]">{settings.solidColor}</span>
                  </div>
                </div>
              )}

              {settings.bgType === "pattern" && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">图案背景</label>
                  <div className="grid grid-cols-3 gap-2">
                    {patternPresets.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => update("patternIndex", i)}
                        className={`aspect-square rounded-lg border border-[var(--border)] transition-all cursor-pointer ${
                          settings.patternIndex === i ? "ring-2 ring-white" : "hover:scale-105"
                        }`}
                        style={{ background: `${p.pattern}, ${p.bgColor}`, backgroundSize: p.size }}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "frame" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  内边距: {settings.padding}px
                </label>
                <input
                  type="range" min={16} max={160} value={settings.padding}
                  onChange={e => update("padding", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  圆角: {settings.borderRadius}px
                </label>
                <input
                  type="range" min={0} max={48} value={settings.borderRadius}
                  onChange={e => update("borderRadius", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-2">
                  <input
                    type="checkbox" checked={settings.shadowEnabled}
                    onChange={e => update("shadowEnabled", e.target.checked)}
                    className="rounded"
                  />
                  阴影效果
                </label>
                {settings.shadowEnabled && (
                  <div className="space-y-2">
                    <label className="block text-xs text-[var(--text-secondary)]">
                      模糊: {settings.shadowBlur}px
                    </label>
                    <input
                      type="range" min={0} max={100} value={settings.shadowBlur}
                      onChange={e => update("shadowBlur", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">设备框</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "none", label: "无" },
                    { key: "browser", label: "🌐 浏览器" },
                    { key: "phone", label: "📱 手机" },
                  ] as { key: DeviceType; label: string }[]).map(d => (
                    <button
                      key={d.key}
                      onClick={() => update("device", d.key)}
                      className={`py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                        settings.device === d.key
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "text" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">水印文字</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--accent)]"
                  placeholder="输入水印文字（可选）"
                  value={settings.watermark}
                  onChange={e => update("watermark", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">水印位置</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: "none", label: "不显示" },
                    { key: "bottom-center", label: "底部居中" },
                    { key: "bottom-right", label: "右下角" },
                    { key: "bottom-left", label: "左下角" },
                  ] as { key: WatermarkPosition; label: string }[]).map(w => (
                    <button
                      key={w.key}
                      onClick={() => update("watermarkPosition", w.key)}
                      className={`py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                        settings.watermarkPosition === w.key
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "export" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  导出倍率: {settings.exportScale}x
                </label>
                <input
                  type="range" min={1} max={4} step={0.5} value={settings.exportScale}
                  onChange={e => update("exportScale", Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {image && `输出尺寸: ${Math.round(imageSize.w * settings.exportScale)} × ${Math.round(imageSize.h * settings.exportScale)}px`}
                </p>
              </div>

              <button
                onClick={() => setSettings(defaultSettings)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors cursor-pointer w-full"
              >
                <RotateCcw className="w-4 h-4" />
                重置所有设置
              </button>
            </>
          )}
        </div>

        {/* 导出按钮 */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleExport}
            disabled={!image}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4" />
            导出 PNG
          </button>
        </div>
      </div>

      {/* 右侧预览区 */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-[var(--bg-primary)]">
        {image ? (
          <div
            ref={previewRef}
            className="relative transition-all duration-300"
            style={{
              ...getBgStyle(),
              padding: `${settings.padding}px`,
              borderRadius: settings.device !== "none" ? "16px" : undefined,
            }}
          >
            {settings.device !== "none" && getDeviceFrame()}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: `${settings.borderRadius}px`,
                boxShadow: settings.shadowEnabled
                  ? `0 ${settings.shadowBlur / 4}px ${settings.shadowBlur}px ${settings.shadowColor}`
                  : "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="截图预览"
                className="block max-w-full"
                style={{ maxHeight: "calc(100vh - 280px)" }}
              />
            </div>
            {settings.watermark && settings.watermarkPosition !== "none" && (
              <div className="text-center mt-3 text-xs text-white/60">{settings.watermark}</div>
            )}
          </div>
        ) : (
          <div
            className={`drop-zone w-full max-w-2xl aspect-video rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${dragover ? "dragover" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center">
              <Upload className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">拖拽、粘贴或点击上传截图</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">支持 PNG, JPG, WebP 格式</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ctrl+V 粘贴截图即可使用</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
