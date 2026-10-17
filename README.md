# 🚀 零到全栈：个人主页与文字实验室

一个从零构建、具备完整前后端架构与生产级部署的现代 Web 应用。

🔗 **在线体验**: [https://profile.m3u8player.com.cn](https://profile.m3u8player.com.cn)

## 📖 项目简介

本项目旨在打通 Web 开发的全链路：从静态页面、现代前端框架，到后端 API、数据库持久化，再到 Nginx 反向代理与 HTTPS 生产环境部署。

应用包含两个核心部分：
1. **个人主页**：展示技能、项目与个人介绍，支持深浅主题切换与响应式布局。
2. **文字实验室**：接收用户输入，通过调用后端 API 进行字符统计与逻辑处理，并**基于 Cookie 实现会话隔离**，为每个独立用户展示其专属的“最近分析记录”。

## 🛠️ 技术栈

**前端 (Frontend)**
*   **框架**: Next.js 16 (App Router), React, TypeScript
*   **样式**: Tailwind CSS (原子化样式设计，完全响应式)
*   **特性**: 服务端 rewrites 代理 (`next.config.ts`) 彻底解决跨域问题

**后端 (Backend)**
*   **框架**: FastAPI (Python 3.12)
*   **数据库**: SQLite (轻量级持久化，防 SQL 注入的参数化查询)
*   **认证**: 基于 `httponly` Cookie 的 Session ID 识别与用户状态隔离

**部署与运维 (DevOps)**
*   **服务器**: 阿里云 ECS (Ubuntu 24.04 LTS)
*   **前端托管**: 宝塔面板 Node 项目管理器 (PM2 守护)
*   **后端托管**: Linux systemd 常驻服务 (开机自启，崩溃重启)
*   **网关与安全**: Nginx 反向代理 + Let's Encrypt HTTPS 证书

## 🏗️ 系统架构图

```text
用户浏览器
    │  https://profile.m3u8player.com.cn
    ▼
Nginx (公网 80/443 端口)
    │
    ├── /            → Node.js (Next.js, 127.0.0.1:3000) → 渲染前端页面
    │                                                     │
    │                                                     ▼ (Next.js 服务端代理转发)
    │                                              https://api.m3u8player.com.cn
    │                                                     │
    └── /api/*       → Nginx 反向代理 (127.0.0.1:8001) ───┘
                                                          │
                                                          ▼
                                               FastAPI (Python Uvicorn 进程)
                                                          │
                                                          ▼
                                                  SQLite (读写磁盘数据)