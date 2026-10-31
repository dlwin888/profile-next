"use client";

import dynamic from "next/dynamic";

// 只有客户端组件才允许使用 ssr: false
const LabClient = dynamic(() => import("./LabClient"), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-zinc-400">页面加载中...</div>
});

export default function LabLoader() {
  return <LabClient />;
}