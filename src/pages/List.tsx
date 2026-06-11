import { useState, useMemo } from 'react';
import { useApps } from '../App';
import { STAGE_ORDER } from '../lib/types';
import type { Stage } from '../lib/types';

export default function List() {
  const { applications, deleteApp } = useApps();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Stage | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  // 筛选 + 排序
  const filtered = useMemo(() => {
    let apps = [...applications];
    if (filter !== 'all') apps = apps.filter(a => a.stage === filter);
    if (search.trim()) apps = apps.filter(a => a.company.toLowerCase().includes(search.toLowerCase()));
    apps.sort((a, b) => sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    return apps;
  }, [applications, filter, search, sort]);

  function handleEdit(id: string) {
    window.dispatchEvent(new CustomEvent('open-form', { detail: id }));
  }

  function handleDelete(id: string) {
    const app = applications.find(a => a.id === id);
    if (app && confirm(`确定删除「${app.company}」的投递记录吗？此操作不可恢复。`)) {
      deleteApp(id);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 搜索公司名称…"
          className="flex-1 max-w-[280px] px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-white text-app-text outline-none focus:border-app-accent focus:ring-3 focus:ring-app-accent/10 shadow-sm transition-all"
        />

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-app-accent text-white border-app-accent'
                : 'bg-white border-app-border text-app-text-secondary hover:bg-app-accent-light hover:border-app-accent'
            }`}
          >
            全部
          </button>
          {STAGE_ORDER.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-app-accent text-white border-app-accent'
                  : 'bg-white border-app-border text-app-text-secondary hover:bg-app-accent-light hover:border-app-accent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-app-text-muted">排序</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2 border border-app-border rounded-lg text-xs bg-white text-app-text outline-none cursor-pointer"
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最早优先</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-app-border rounded-app shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-app-card-tint border-b border-app-border">
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">公司</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">岗位</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">渠道</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">日期</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">阶段</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase">备注</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-app-text-secondary tracking-wide uppercase w-[110px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-app-text-muted text-sm">
                  没有匹配的投递记录
                </td>
              </tr>
            ) : (
              filtered.map(app => (
                <tr key={app.id} className="border-b border-app-border last:border-b-0 hover:bg-app-card-tint transition-colors">
                  <td className="px-4 py-3.5 text-sm font-semibold text-app-text">{app.company}</td>
                  <td className="px-4 py-3.5 text-sm text-app-text-secondary">{app.position}</td>
                  <td className="px-4 py-3.5 text-sm text-app-text-secondary">{app.channel}</td>
                  <td className="px-4 py-3.5 text-sm text-app-text-secondary">{app.date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`stage-${app.stage} text-[11px] px-2.5 py-1 rounded-full font-medium`}>{app.stage}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-app-text-muted max-w-[150px] truncate">
                    {app.note || '-'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(app.id)}
                        className="px-2.5 py-1 text-[11px] font-medium border border-app-border rounded-md bg-white text-app-text-secondary hover:border-app-accent hover:text-app-accent-hover hover:bg-app-accent-light transition-all"
                      >
                        ✎ 编辑
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="px-2.5 py-1 text-[11px] font-medium border border-app-border rounded-md bg-white text-app-text-secondary hover:border-[#7a4d4e] hover:text-[#7a4d4e] hover:bg-red-50 transition-all"
                      >
                        ✕ 删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
