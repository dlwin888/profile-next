"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProfileData {
  heroTitle: string;
  heroSubtitle: string;
  featuredWork: { kicker: string; title: string; copy: string; linkLabel: string };
  identity: { motto: string; learning: string };
}

export default function Home() {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("https://api.m3u8player.com.cn/api/profile")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="p-10 text-center text-zinc-400">加载中...</div>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 space-y-16">
      {/* 头部信息 */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">{data.heroTitle}</h1>
        <p className="text-zinc-500">{data.heroSubtitle}</p>
      </header>

      {/* 作品区 */}
      <section className="text-center">
        <p className="text-sm text-zinc-400 mb-2">{data.featuredWork.kicker}</p>
        <h2 className="text-2xl font-bold mb-2">{data.featuredWork.title}</h2>
        <p className="text-zinc-600 mb-6">{data.featuredWork.copy}</p>
        
        <Link 
          href="/lab"
          className="inline-block px-6 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
        >
          {data.featuredWork.linkLabel}
        </Link>
      </section>

      {/* 身份区 */}
      <section className="text-center border-t border-zinc-200 pt-10">
        <p className="text-lg font-medium mb-1">“{data.identity.motto}”</p>
        <p className="text-zinc-500 text-sm">{data.identity.learning}</p>
      </section>
    </main>
  );
}