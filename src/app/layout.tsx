import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShotFrame - 截图美化工具 | 一键生成精美截图",
  description: "免费在线截图美化工具。上传截图，选择渐变背景、设备框、圆角、阴影等效果，一键导出高清PNG。适用于演示文稿、社交媒体、产品展示。",
  keywords: "截图美化,screenshot beautifier,screenshot design,截图工具,演示截图,产品截图,社交媒体图片",
  openGraph: {
    title: "ShotFrame - 截图美化工具",
    description: "免费在线截图美化工具，一键生成精美截图",
    url: "https://tyr1105.github.io/shotframe",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
