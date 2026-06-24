import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnOS - AI 主动学习平台",
  description: "上传资料 → AI 提取考点 → 诊断 → 最短提分路线",
  metadataBase: new URL("https://learnOS.site"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">{children}</body>
    </html>
  );
}
