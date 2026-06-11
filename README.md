# Apply — 求职追踪器

> 专为中国大学生设计的求职进度管理工具。比 Excel 更聪明，比 Notion 更轻量，刚好够用。

## 🎯 解决的问题

找实习/校招时，投递信息散落在 Boss直聘、官网、内推、邮箱各处。Excel 太笨、Notion 太重、海外产品水土不服。

**Apply 让你在 10 秒内记录一条投递，一个看板看清所有进度。**

## ✨ 核心功能

- 📊 **仪表盘** — 投递统计、阶段漏斗、渠道分布、转化率
- 📋 **看板** — 拖拽卡片切换阶段，一键推进，逾期提醒
- 📝 **投递列表** — 搜索、阶段筛选、时间排序
- 📄 **导出报告** — 一键生成可打印的求职报告（PDF）
- 📱 **响应式** — 手机电脑都能用
- ⌨️ **快捷键** — `N` 新增，`Esc` 关闭

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 图表 | Recharts |
| 拖拽 | @hello-pangea/dnd |
| 存储 | localStorage（零后端） |
| 部署 | Vercel |

## 🚀 本地运行

```bash
npm install
npm run dev
# 浏览器打开 http://localhost:5173
```

## 📦 构建部署

```bash
npm run build    # 输出到 dist/
```
推送到 GitHub 后，Vercel 自动部署。

## 🗺 路线图

- [x] V1 — MVP：投递记录 + 看板 + 仪表盘 + 本地存储
- [x] V1.1 — 导出报告、一键推进、变更时间线
- [ ] V2 — 注册登录、云同步、邮件提醒
- [ ] V3 — Chrome 插件、微信小程序

## 📄 许可

MIT License
