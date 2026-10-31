import dynamic from "next/dynamic";

// 强制该页面只在客户端渲染，彻底绕过 Next.js 的服务端预渲染报错
const LabClient = dynamic(() => import("./LabClient"), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-zinc-400">页面加载中...</div>
});

export default function LabPage() {
  return <LabClient />;
}