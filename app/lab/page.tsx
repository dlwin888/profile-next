"use client";

import { useState } from "react";
import Link from "next/link";
// 👇 新增这一行：强制此页面动态渲染，跳过构建时的静态预渲染
export const dynamic = "force-dynamic";
const [aiResult, setAiResult] = useState<string | null>(null);
const [aiLoading, setAiLoading] = useState(false);

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
      const res = await fetch("/api/analyze", {
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
      const res = await fetch("/api/history", {
        credentials: "include",
      });
      const data = await res.json();
      setHistory(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  // 新增的删除逻辑
  async function handleDelete(id: number) {
    if (!window.confirm("确定要删除这条记录吗？")) return;

    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("删除失败");

      // 删除成功后，前端过滤掉这条记录，实现无缝刷新
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("删除出错，请重试");
    }
  }

  async function handleAIAnalyze() {
    if (!text.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("AI 请求失败");
      const data = await res.json();
      setAiResult(data.result);
    } catch (err) {
      alert("AI 分析失败，请稍后再试");
    } finally {
      setAiLoading(false);
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

      {/* AI 分析入口 */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <button
          onClick={handleAIAnalyze}
          disabled={aiLoading}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {aiLoading ? "🤖 AI 思考中..." : "🤖 AI 深度解析"}
        </button>

        {/* AI 结果展示区 */}
        {aiResult && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
            <h4 className="text-sm font-bold text-purple-700 mb-2">AI 分析报告</h4>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
              {aiResult}
            </p>
          </div>
        )}
      </div>

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
                    <li key={item.id} className="p-3 bg-zinc-50 rounded border border-zinc-100 flex justify-between items-start group">
                      <div className="overflow-hidden">
                        <p className="text-sm text-zinc-800 font-mono truncate">{item.text}</p>
                        <p className="text-xs text-zinc-400 mt-1">{item.char_count} 字符 • {item.created_at}</p>
                      </div>
                      
                      {/* 删除按钮：平时半透明，鼠标悬浮时变红 */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors shrink-0 ml-2"
                        title="删除记录"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
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