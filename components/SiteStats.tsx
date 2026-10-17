export default async function SiteStats() {
// 优先读取环境变量，如果没有（比如生产环境），就默认走线上公网地址
  const apiBase = process.env.API_BASE_URL || "https://api.m3u8player.com.cn";
  
  const res = await fetch(`${apiBase}/api/stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-center text-red-500 my-4">无法加载全站统计</div>;
  }

  const data = await res.json();

  return (
    <div className="my-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-center shadow-sm">
      <p className="text-blue-900 font-medium">
        🚀 全站已累计分析{" "}
        <span className="text-2xl font-extrabold text-blue-600 mx-1">
          {data.total_analyses}
        </span>{" "}
        次文字
      </p>
    </div>
  );
}