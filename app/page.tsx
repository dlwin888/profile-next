import Link from "next/link";
import Hero from "@/components/Hero";
import TextLab from "@/components/TextLab";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
      <Hero />
      
      <div className="mb-10 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 mb-1">关于我</h2>
          <p className="text-zinc-500 text-sm">我是一名正在学习全栈开发的开发者。</p>
        </div>
        <Link 
          href="/lab" 
          className="shrink-0 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          进入独立版 &rarr;
        </Link>
      </div>

      <TextLab />
    </main>
  );
}