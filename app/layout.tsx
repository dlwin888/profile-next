import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "零到全栈",
  description: "项目，创意，灵感，心得",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-50 text-zinc-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}