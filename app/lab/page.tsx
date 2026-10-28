"use client";

import { useState } from "react";
import Link from "next/link";

interface HistoryItem {
  id: number;
  text: string;
  char_count: number;
  created_at: string;
}

export default function LabPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 弹窗与历史记录状态
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function handleAnalyze() {
    if (!text.trim()) {
      setError("请输入文字");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("https://api.m3u8player.com.cn/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        credentials: "include",
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("请求失败");
    } finally {
      setLoading(false);
    }
  }

  async function openHistory() {
    setShowHistory(true);
    try {
      const res = await fetch("https://api.m3u8player.com.cn/api/history", {
        credentials: "include",
      });
      const data = await res.json();
      setHistory(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-zinc-500 hover:text-zinc-900 mb-8 inline-block">
        &larr; 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-8">文字实验室</h1>

      {/* 输入卡片 */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在这里输入文字..."
          className="w-full h-32 p-4 border border-zinc-300 rounded focus:outline-none focus:border-blue-500 resize-none mb-4"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "分析中..." : "开始分析"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 结果卡片 */}
      {result && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 relative animate-fade-in">
          <button
            onClick={openHistory}
            className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
          >
            历史记录
          </button>
          <h3 className="font-bold text-blue-900 mb-4">分析结果</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600">总字符数</p>
              <p className="text-2xl font-bold">{result.char_count}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">词数</p>
              <p className="text-2xl font-bold">{result.word_count}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-600">反转结果</p>
            <p className="font-mono bg-white p-2 rounded mt-1 text-sm">{result.reversed_text}</p>
          </div>
        </div>
      )}

      {/* 历史记录弹窗 Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="font-bold">历史记录</h3>
              <button onClick={() => setShowHistory(false)} className="text-zinc-400 hover:text-zinc-900">
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-zinc-500 text-center py-4">暂无记录</p>
              ) : (
                <ul className="space-y-3">
                  {history.map((item) => (
                    <li key={item.id} className="p-3 bg-zinc-50 rounded border border-zinc-100">
                      <p className="text-sm text-zinc-800 font-mono truncate">{item.text}</p>
                      <p className="text-xs text-zinc-400 mt-1">{item.char_count} 字符 • {item.created_at}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}