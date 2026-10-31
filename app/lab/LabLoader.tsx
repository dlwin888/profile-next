"use client";

import dynamic from "next/dynamic";

const LabClient = dynamic(() => import("./LabClient"), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-zinc-400">页面加载中...</div>
});

export default function LabLoader() {
  return <LabClient />;
}