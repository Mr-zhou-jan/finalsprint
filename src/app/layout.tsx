import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinalSprint - AI 期末提分系统",
  description: "上传资料 → AI 提取考点 → 诊断 → 最短提分路线",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">{children}</body>
    </html>
  );
}
