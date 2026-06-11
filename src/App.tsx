import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Application } from './lib/types';
import { getApplications, addApplication, updateApplication, deleteApplication } from './lib/storage';
import Layout from './components/Layout';
import FormDialog from './components/FormDialog';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import List from './pages/List';

// ─── Context ───
interface AppContextValue {
  applications: Application[];
  addApp: (app: Omit<Application, 'id' | 'createdAt'>) => void;
  updateApp: (id: string, updates: Partial<Application>) => void;
  deleteApp: (id: string) => void;
  refreshApps: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApps(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApps must be used inside AppProvider');
  return ctx;
}

// ─── App ───
export default function App() {
  const [applications, setApplications] = useState<Application[]>(() => getApplications());
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const refreshApps = useCallback(() => {
    setApplications(getApplications());
  }, []);

  const addApp = useCallback((data: Omit<Application, 'id' | 'createdAt'>) => {
    addApplication({
      ...data,
      id: 'a' + Date.now(),
      createdAt: Date.now(),
    } as Application);
    refreshApps();
  }, [refreshApps]);

  const updateApp = useCallback((id: string, updates: Partial<Application>) => {
    updateApplication(id, updates);
    refreshApps();
  }, [refreshApps]);

  const deleteApp = useCallback((id: string) => {
    deleteApplication(id);
    refreshApps();
  }, [refreshApps]);

  // 监听全局自定义事件，用于从看板/仪表盘触发编辑表单
  useEffect(() => {
    function handleOpenForm(e: Event) {
      const detail = (e as CustomEvent).detail;
      setEditId(detail || null);
      setFormOpen(true);
    }
    window.addEventListener('open-form', handleOpenForm);
    return () => window.removeEventListener('open-form', handleOpenForm);
  }, []);

  // 导出可打印的求职报告
  useEffect(() => {
    function handleExportReport() {
      const apps = getApplications();
      const total = apps.length;
      const offers = apps.filter(a => a.stage === 'Offer').length;
      const interviewing = apps.filter(a => a.stage === '面试中').length;
      const rate = total > 0 ? (offers / total * 100).toFixed(1) : '0.0';

      // 渠道统计
      const channelCounts: Record<string, number> = {};
      apps.forEach(a => { channelCounts[a.channel] = (channelCounts[a.channel] || 0) + 1; });

      // 阶段统计
      const stageCounts: Record<string, number> = {};
      apps.forEach(a => { stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1; });

      const now = new Date().toLocaleDateString('zh-CN');

      const reportHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>求职报告 - ${now}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:800px;margin:0 auto;padding:40px 24px;color:#1e2530;background:#fff}
  h1{font-size:28px;margin-bottom:4px;letter-spacing:-0.5px}
  .date{color:#7b8799;font-size:14px;margin-bottom:32px}
  h2{font-size:16px;margin:28px 0 12px;padding-bottom:8px;border-bottom:2px solid #dce6f2}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
  .stat{background:#f5f7fa;padding:16px;border-radius:8px;text-align:center}
  .stat .num{font-size:28px;font-weight:700}
  .stat .lbl{font-size:11px;color:#7b8799;margin-top:4px}
  .bar-wrap{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .bar-lbl{width:70px;text-align:right;font-size:13px;color:#4a5568}
  .bar-bg{flex:1;height:24px;background:#f0f3f7;border-radius:4px;overflow:hidden}
  .bar{height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;color:#fff;font-size:11px;font-weight:600}
  .bar-num{width:30px;font-size:13px;font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th{text-align:left;padding:10px 12px;font-size:11px;color:#7b8799;text-transform:uppercase;border-bottom:1px solid #e2e5ea}
  td{padding:10px 12px;font-size:13px;border-bottom:1px solid #f0f3f7}
  .tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:500}
  .tag-已投递{background:#dee4ed;color:#4a5466}.tag-简历筛选{background:#e8e3d8;color:#6b5f4a}
  .tag-笔试\\/测评{background:#e4dcec;color:#5d4d6e}.tag-面试中{background:#d6e0ee;color:#3f5a7a}
  .tag-Offer{background:#d6e8dd;color:#3d694e}.tag-已凉{background:#ead9da;color:#7a4d4e}
  .timeline{font-size:12px;color:#7b8799;margin-top:4px}
  @media print{body{padding:20px}}
</style></head>
<body>
<h1>📋 求职追踪报告</h1>
<p class="date">生成于 ${now} · 共 ${total} 条投递记录</p>

<div class="stats">
  <div class="stat"><div class="num">${total}</div><div class="lbl">总投递</div></div>
  <div class="stat"><div class="num">${interviewing}</div><div class="lbl">面试中</div></div>
  <div class="stat"><div class="num">${offers}</div><div class="lbl">Offer</div></div>
  <div class="stat"><div class="num">${rate}%</div><div class="lbl">转化率</div></div>
</div>

<h2>📊 阶段分布</h2>
${['已投递','简历筛选','笔试/测评','面试中','Offer','已凉'].map(s => {
  const n = stageCounts[s] || 0;
  const w = total > 0 ? (n/total*100) : 0;
  const colors = ['#8e9aaf','#e8e3d8','#e4dcec','#7b8fa1','#9aab9e','#ead9da'];
  const texts = ['#fff','#6b5f4a','#5d4d6e','#fff','#fff','#7a4d4e'];
  const i = ['已投递','简历筛选','笔试/测评','面试中','Offer','已凉'].indexOf(s);
  return `<div class="bar-wrap"><span class="bar-lbl">${s}</span><div class="bar-bg"><div class="bar" style="width:${w}%;background:${colors[i]};color:${texts[i]}">${n>0?n:''}</div></div><span class="bar-num">${n}</span></div>`;
}).join('')}

<h2>📈 渠道分布</h2>
${Object.entries(channelCounts).map(([k,v]) => {
  const w = total > 0 ? (v/total*100) : 0;
  return `<div class="bar-wrap"><span class="bar-lbl">${k}</span><div class="bar-bg"><div class="bar" style="width:${w}%;background:#8e9aaf">${v}</div></div><span class="bar-num">${v}</span></div>`;
}).join('')}

<h2>📝 投递明细</h2>
<table><thead><tr><th>公司</th><th>岗位</th><th>渠道</th><th>日期</th><th>阶段</th><th>备注</th></tr></thead>
<tbody>
${[...apps].sort((a,b)=>b.createdAt-a.createdAt).map(a => `
  <tr>
    <td><b>${a.company}</b></td>
    <td>${a.position}</td>
    <td>${a.channel}</td>
    <td>${a.date}</td>
    <td><span class="tag tag-${a.stage}">${a.stage}</span></td>
    <td style="color:#7b8799">${a.note||'-'}</td>
  </tr>
  ${a.stageHistory && a.stageHistory.length > 0 ? `
  <tr><td colspan="6" class="timeline">
    ⏱ ${a.stageHistory.map(h => `${h.from}→${h.to}(${new Date(h.at).toLocaleDateString('zh-CN')})`).join(' · ')}
  </td></tr>` : ''}
`).join('')}
</tbody></table>

<p style="text-align:center;margin-top:32px;color:#c8d2de;font-size:12px">由 Apply 求职追踪器生成</p>
</body></html>`;

      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(reportHtml);
        win.document.close();
      }
    }
    window.addEventListener('export-report', handleExportReport);
    return () => window.removeEventListener('export-report', handleExportReport);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setFormOpen(false);
        setEditId(null);
      }
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement === document.body) {
        setEditId(null);
        setFormOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ctxValue: AppContextValue = {
    applications,
    addApp,
    updateApp,
    deleteApp,
    refreshApps,
  };

  return (
    <AppContext.Provider value={ctxValue}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="list" element={<List />} />
        </Route>
      </Routes>

      {formOpen && (
        <FormDialog
          editId={editId}
          onClose={() => { setFormOpen(false); setEditId(null); }}
        />
      )}
    </AppContext.Provider>
  );
}
