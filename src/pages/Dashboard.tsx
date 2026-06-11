import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useApps } from '../App';
import { FUNNEL_STAGES, FUNNEL_COLORS, CHANNEL_COLORS } from '../lib/types';
import type { Channel } from '../lib/types';
import { daysAgo } from '../lib/storage';

export default function Dashboard() {
  const { applications } = useApps();
  const total = applications.length;
  const interviewing = applications.filter(a => a.stage === '面试中').length;
  const offers = applications.filter(a => a.stage === 'Offer').length;
  const rate = total > 0 ? (offers / total * 100).toFixed(1) : '0.0';

  // ── 渠道分布数据 ──
  const channelCounts: Record<string, number> = {};
  applications.forEach(a => {
    channelCounts[a.channel] = (channelCounts[a.channel] || 0) + 1;
  });
  const pieData = Object.entries(channelCounts).map(([name, value]) => ({ name, value }));

  // ── 漏斗数据 ──
  const funnelData = FUNNEL_STAGES.map(stage => ({
    name: stage,
    count: applications.filter(a => a.stage === stage).length,
    fill: FUNNEL_COLORS[FUNNEL_STAGES.indexOf(stage)],
  }));

  // ── 最近投递 ──
  const recent = [...applications].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const statCards = [
    { label: '总投递', value: total, sub: '家公司', color: '#8e9aaf' },
    { label: '面试中', value: interviewing, sub: '正在进行', color: '#b0a3af' },
    { label: 'Offer', value: offers, sub: offers > 0 ? '🎉 恭喜上岸' : '继续加油', color: '#9aab9e' },
    { label: '转化率', value: `${rate}%`, sub: '投递 → Offer', color: '#c4b998' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {statCards.map(card => (
          <div
            key={card.label}
            className="relative bg-white border border-app-border rounded-app p-5 shadow-sm overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-app"
              style={{ background: card.color }}
            />
            <div className="text-xs text-app-text-muted tracking-wide font-semibold mb-1.5">{card.label}</div>
            <div className="text-[34px] font-bold tracking-[-1.2px] text-app-text tabular-nums">{card.value}</div>
            <div className="text-xs text-app-text-secondary mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-6">
        {/* 阶段漏斗 */}
        <div className="bg-white border border-app-border rounded-app p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-app-text">📊 阶段漏斗</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical" barCategoryGap={8}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fontSize: 12, fill: '#4a5568' }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={28}>
                {funnelData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 渠道分布 */}
        <div className="bg-white border border-app-border rounded-app p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-app-text">投递渠道分布</h3>
          {pieData.length === 0 ? (
            <div className="text-center py-10 text-app-text-muted text-sm">暂无数据</div>
          ) : (
            <div className="flex items-center gap-7">
              <PieChart width={130} height={130}>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={CHANNEL_COLORS[entry.name as Channel] || '#b5afa5'}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2">
                {pieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[13px] text-app-text-secondary">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: CHANNEL_COLORS[entry.name as Channel] || '#b5afa5' }}
                    />
                    {entry.name} · {entry.value} 家
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 最近投递 ── */}
      <div className="bg-white border border-app-border rounded-app p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-app-text">最近投递</h3>
        {recent.length === 0 ? (
          <div className="text-center py-10 text-app-text-muted text-sm">
            还没有投递记录，点右上角「+ 新增投递」开始吧
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map(app => (
              <div
                key={app.id}
                onClick={() => window.dispatchEvent(new CustomEvent('open-form', { detail: app.id }))}
                className="flex items-center justify-between px-4 py-3 bg-app-card-tint rounded-app-sm border border-transparent hover:border-app-border hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-app-text">{app.company}</span>
                  <span className="text-xs text-app-text-muted">{app.position}</span>
                  <span className="text-[10px] text-app-text-muted ml-1">{daysAgo(app.createdAt)}</span>
                </div>
                <span className={`stage-${app.stage} text-[11px] px-2.5 py-1 rounded-full font-medium`}>
                  {app.stage}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
