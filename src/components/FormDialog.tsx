import { useState, useEffect } from 'react';
import type { Application, Channel, Stage } from '../lib/types';
import { useApps } from '../App';

interface Props {
  editId: string | null;
  onClose: () => void;
}

export default function FormDialog({ editId, onClose }: Props) {
  const { applications, addApp, updateApp } = useApps();

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [channel, setChannel] = useState<Channel>('Boss直聘');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState<Stage>('已投递');
  const [note, setNote] = useState('');
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // 编辑模式：回填数据
  useEffect(() => {
    if (editId) {
      const app = applications.find(a => a.id === editId);
      if (app) {
        setEditingApp(app);
        setCompany(app.company);
        setPosition(app.position);
        setChannel(app.channel);
        setDate(app.date);
        setStage(app.stage);
        setNote(app.note || '');
      }
    } else {
      resetForm();
    }
  }, [editId]);

  function resetForm() {
    setCompany('');
    setPosition('');
    setChannel('Boss直聘');
    setDate(new Date().toISOString().split('T')[0]);
    setStage('已投递');
    setNote('');
  }

  function handleSave() {
    if (!company.trim() || !position.trim()) {
      alert('请至少填写公司名称和岗位名称');
      return;
    }

    if (editId) {
      updateApp(editId, {
        company: company.trim(),
        position: position.trim(),
        channel,
        date,
        stage,
        note: note.trim(),
      });
    } else {
      addApp({
        company: company.trim(),
        position: position.trim(),
        channel,
        date,
        stage,
        note: note.trim(),
      });
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e25304d] backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-8 w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-app-border">
        <h2 className="text-lg font-semibold mb-6 tracking-[-0.3px] text-app-text">
          {editId ? '编辑投递' : '新增投递'}
        </h2>

        {/* 公司 */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">公司名称 *</label>
          <input
            type="text" value={company} onChange={e => setCompany(e.target.value)}
            placeholder="例如：字节跳动"
            className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent focus:ring-3 focus:ring-app-accent/15 transition-all"
          />
        </div>

        {/* 岗位 */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">岗位名称 *</label>
          <input
            type="text" value={position} onChange={e => setPosition(e.target.value)}
            placeholder="例如：产品经理实习生"
            className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent focus:ring-3 focus:ring-app-accent/15 transition-all"
          />
        </div>

        {/* 渠道 + 日期 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">投递渠道 *</label>
            <select
              value={channel} onChange={e => setChannel(e.target.value as Channel)}
              className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent transition-all"
            >
              <option value="Boss直聘">Boss直聘</option>
              <option value="实习僧">实习僧</option>
              <option value="牛客">牛客</option>
              <option value="官网">官网</option>
              <option value="内推">内推</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">投递日期</label>
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent transition-all"
            />
          </div>
        </div>

        {/* 阶段 */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">当前阶段</label>
          <select
            value={stage} onChange={e => setStage(e.target.value as Stage)}
            className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent transition-all"
          >
            <option value="已投递">📨 已投递</option>
            <option value="简历筛选">📋 简历筛选</option>
            <option value="笔试/测评">✏️ 笔试/测评</option>
            <option value="面试中">💬 面试中</option>
            <option value="Offer">🎉 Offer</option>
            <option value="已凉">❌ 已凉</option>
          </select>
        </div>

        {/* 备注 */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-app-text-secondary mb-1.5">备注</label>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="面试时间、HR联系方式……"
            rows={3}
            className="w-full px-3.5 py-2.5 border border-app-border rounded-lg text-sm bg-app-card-tint text-app-text outline-none focus:border-app-accent focus:ring-3 focus:ring-app-accent/15 transition-all resize-y"
          />
        </div>

        {/* 阶段变更时间线（仅编辑模式且有历史时显示） */}
        {editingApp?.stageHistory && editingApp.stageHistory.length > 0 && (
          <div className="mb-6 p-4 bg-app-card-tint rounded-lg border border-app-border">
            <h4 className="text-xs font-semibold text-app-text-secondary mb-2">⏱ 阶段变更记录</h4>
            <div className="flex flex-col gap-1.5">
              {editingApp.stageHistory.map((change, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-app-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-app-accent flex-shrink-0" />
                  <span>{change.from}</span>
                  <span className="text-app-text-muted">→</span>
                  <span className="font-medium text-app-text">{change.to}</span>
                  <span className="text-app-text-muted ml-auto">
                    {new Date(change.at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-[13px] font-medium text-app-text-secondary rounded-lg hover:bg-black/5 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-[13px] font-medium bg-app-accent text-white rounded-lg hover:bg-app-accent-hover transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
