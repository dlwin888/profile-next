# 🚀 零到全栈：AI 驱动的个人主页与文字实验室

一个从零构建、具备完整前后端架构、安全防护与 AI 大模型赋能的生产级 Web 应用。

🔗 **在线体验**: [https://profile.m3u8player.com.cn](https://profile.m3u8player.com.cn)

## 📖 项目简介

本项目打通了现代 Web 开发的全链路：从 Next.js 服务端渲染、FastAPI 后端接口、SQLite 数据持久化，到 Nginx 反向代理、HTTPS 生产环境部署，最后成功集成了智谱 AI (GLM-4) 大语言模型。

应用包含两个核心功能：
1. **个人主页**：展示个人信息、作品集入口，采用完全数据驱动的 API 渲染。
2. **文字实验室**：提供文字统计功能，支持基于 Cookie 的 Session 会话隔离，用户可查看并管理个人的历史记录，并支持一键调用 AI 进行深度解析（情感分析、关键词提取、一句话总结）。

## ✨ 核心技术亮点

*   **彻底的跨域解决方案 (Same-Origin Proxy)**：前端不直接请求后端域名，而是通过 Next.js `rewrites` 进行服务端代理，实现同源访问。既消除了浏览器的 CORS 报错，又隐藏了后端真实地址。
*   **严密的后端权限控制 (Session Security)**：使用 `HTTP-Only` Cookie 结合 UUID 生成 Session ID。在删除历史记录时，后端 SQL 强制进行 `id` 和 `session_id` 双条件匹配，确保用户 A 无法越权删除用户 B 的数据。
*   **接口安全防护 (Rate Limiting)**：接入 `slowapi` 中间件，对分析和 AI 接口实施 IP 级别的限流（5次/分钟），有效防止恶意刷量与 DDoS 攻击。
*   **AI 大模型赋能 (LLM Integration)**：后端通过官方 SDK 安全接入智谱 GLM-4 模型。API Key 通过 systemd 环境变量注入，绝不暴露在前端代码或 Git 仓库中。

## 🛠️ 技术栈

*   **前端**: Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS / `next/dynamic`
*   **后端**: FastAPI (Python 3.12) / Uvicorn / SQLite / SlowAPI / ZhipuAI SDK
*   **部署与运维**: 阿里云 Ubuntu / Nginx 反向代理 / Let's Encrypt (HTTPS) / Linux systemd / 宝塔面板 / pnpm

## 🏗️ 系统架构图

```text
用户浏览器
    │  https://profile.m3u8player.com.cn
    ▼
Nginx (公网 80/443 端口, HTTPS 加密)
    │
    ├── /            → Node.js (Next.js 服务, 127.0.0.1:3000) 
    │                     │
    │                     ▼ (Next.js 服务端 rewrites 代理转发)
    │                  /api/* 
    │                     │
    └─────────────────────┼──→ Nginx 反向代理 (127.0.0.1:8001)
                          │
                          ▼
                 FastAPI (Python Uvicorn 进程)
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
          SQLite (数据持久化)   智谱 AI API (大模型)