"use client";

import { useState, useEffect } from "react";

const API_BASE = "";

type Result = {
  char_count: number;
  char_no_space: number;
  word_count: number;
  chinese_count: number;
  reversed_text: string;
};

type HistoryItem = {
  id: number;
  text: string;
  char_count: number;
  word_count: number;
  created_at: string;
};

export default function TextLab() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/api/history`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取历史失败");
      const data = await res.json();
      setHistory(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("确定要删除这条记录吗？")) return;

    try {
      const res = await fetch(`${API_BASE}/api/history/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("删除失败");

      // 方案A：重新拉取历史记录（最简单）
      fetchHistory();
      
      // 方案B：直接在前端过滤掉被删除的项（体验更快）
      // setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert("删除出错，请重试");
      console.error(err);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  async function handleAnalyze() {
    if (!text.trim()) {
      setError("请输入一些文字再分析。");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: Result = await res.json();
      setResult(data);
      fetchHistory();
    } catch (err) {
      setError(`请求失败：${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-200 mb-8">
      <h2 className="text-2xl font-bold text-zinc-800 mb-2">文字实验室</h2>
      <p className="text-zinc-500 text-sm mb-6">输入一段文字，看看它有多少字、多少词。</p>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在这里输入一段文字..."
          className="w-full p-4 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-zinc-50 focus:bg-white"
        />

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "分析中…" : "分析"}
          </button>
          <button
            onClick={() => {
              setText("");
              setResult(null);
              setError("");
            }}
            className="px-6 py-2.5 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:scale-95 font-medium rounded-xl transition-all"
          >
            清空
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">分析结果</h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm text-blue-600/70 mb-1">总字符数</dt>
              <dd className="text-2xl font-bold text-blue-900">{result.char_count}</dd>
            </div>
            <div>
              <dt className="text-sm text-blue-600/70 mb-1">不含空格</dt>
              <dd className="text-2xl font-bold text-blue-900">{result.char_no_space}</dd>
            </div>
            <div>
              <dt className="text-sm text-blue-600/70 mb-1">词数</dt>
              <dd className="text-2xl font-bold text-blue-900">{result.word_count}</dd>
            </div>
            <div>
              <dt className="text-sm text-blue-600/70 mb-1">中文字数</dt>
              <dd className="text-2xl font-bold text-blue-900">{result.chinese_count}</dd>
            </div>
          </dl>
          <div className="mt-6 pt-4 border-t border-blue-200/50">
            <dt className="text-sm text-blue-600/70 mb-1">反转结果</dt>
            <dd className="text-zinc-700 bg-white p-3 rounded-lg border border-blue-100/50 break-all font-mono text-sm">
              {result.reversed_text}
            </dd>
          </div>
        </div>
      )}

      {/* 历史记录区 */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
          最近记录
        </h3>
        {history.length === 0 ? (
          <p className="text-zinc-400 text-sm">暂无记录，快去分析一段文字吧。</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-colors group">
                <span className="text-zinc-700 truncate mr-4 text-sm font-mono bg-zinc-100 px-2 py-1 rounded">
                  {item.text.slice(0, 30)}{item.text.length > 30 ? "..." : ""}
                </span>
                
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-zinc-500">
                    {item.char_count} 字符
                  </span>
                  {/* 新增的删除按钮 */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="删除记录"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}