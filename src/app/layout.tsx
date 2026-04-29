import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "餐饮菜单制作",
  description: "一个用于制作餐饮菜单的 Next.js 单页面工具"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
