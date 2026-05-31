export type BackgroundType = "gradient" | "solid" | "pattern" | "image";
export type DeviceType = "none" | "browser" | "phone" | "laptop" | "tablet";
export type WatermarkPosition = "none" | "bottom-right" | "bottom-left" | "bottom-center";

export interface EditorSettings {
  // 背景
  bgType: BackgroundType;
  gradientIndex: number;
  solidColor: string;
  patternIndex: number;
  bgImage: string | null;
  
  // 内边距
  padding: number;
  
  // 圆角
  borderRadius: number;
  
  // 阴影
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowColor: string;
  
  // 设备框
  device: DeviceType;
  deviceScale: number;
  
  // 文字水印
  watermark: string;
  watermarkPosition: WatermarkPosition;
  
  // 尺寸
  exportScale: number;
  
  // 背景模糊
  bgBlur: number;
}
