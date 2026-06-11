import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Columns, List } from 'lucide-react';
import { useApps } from '../App';

// 侧边栏 + 顶部栏 + 内容区
export default function Layout() {
  const location = useLocation();
  const { applications } = useApps();
  const interviewing = applications.filter(a => a.stage === '面试中').length;
  const offers = applications.filter(a => a.stage === 'Offer').length;

  const pageTitles: Record<string, string> = {
    '/': '仪表盘',
    '/kanban': '看板',
    '/list': '投递列表',
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 bg-app-sidebar border-r border-[#b3bfcd] flex flex-col py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-9">
          <span className="w-2 h-2 rounded-full bg-app-accent" />
          <span className="text-lg font-bold tracking-[-0.3px] text-app-text">Apply</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white shadow-sm text-app-text font-semibold'
                  : 'text-app-text-secondary hover:bg-black/5 hover:text-app-text'
              }`
            }
          >
            <LayoutDashboard size={18} className="opacity-60" />
            仪表盘
          </NavLink>
          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white shadow-sm text-app-text font-semibold'
                  : 'text-app-text-secondary hover:bg-black/5 hover:text-app-text'
              }`
            }
          >
            <Columns size={18} className="opacity-60" />
            看板
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white shadow-sm text-app-text font-semibold'
                  : 'text-app-text-secondary hover:bg-black/5 hover:text-app-text'
              }`
            }
          >
            <List size={18} className="opacity-60" />
            投递列表
          </NavLink>
        </nav>

        <div className="border-t border-[#b3bfcd] pt-4 pl-3 text-xs text-app-text-muted">
          V1 · MVP
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-7 py-4 border-b border-app-border bg-white/40 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <h1 className="text-lg font-semibold tracking-[-0.3px] text-app-text">
              {pageTitles[location.pathname] || ''}
            </h1>
            <div className="flex gap-4 text-xs text-app-text-secondary">
              <span>总计 <b className="text-app-text text-[15px]">{applications.length}</b></span>
              <span>面试 <b className="text-app-text text-[15px]">{interviewing}</b></span>
              <span>Offer <b className="text-app-text text-[15px]">{offers}</b></span>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'apply-backup-' + new Date().toISOString().split('T')[0] + '.json';
                a.click();
              }}
              title="导出 JSON 数据备份"
              className="px-3 py-2 text-xs font-medium border border-app-border rounded-lg bg-white text-app-text-secondary hover:border-app-accent hover:text-app-accent-hover transition-all"
            >
              ⬇ 备份数据
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('export-report'));
              }}
              title="导出可打印的求职报告"
              className="px-3 py-2 text-xs font-medium border border-app-border rounded-lg bg-white text-app-text-secondary hover:border-app-accent hover:text-app-accent-hover transition-all"
            >
              📄 导出报告
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-form'));
              }}
              className="px-4 py-2.5 text-[13px] font-medium bg-app-accent text-white rounded-lg hover:bg-app-accent-hover transition-all"
            >
              + 新增投递
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
