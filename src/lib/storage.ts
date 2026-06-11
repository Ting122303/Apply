import type { Application, StageChange } from './types';

const STORAGE_KEY = 'apply_applications';

// 读取所有投递记录
export function getApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 保存所有投递记录
export function saveApplications(apps: Application[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

// 添加一条记录
export function addApplication(app: Application): void {
  const apps = getApplications();
  apps.push(app);
  saveApplications(apps);
}

// 更新一条记录（如果阶段变更，自动记录时间线）
export function updateApplication(id: string, updates: Partial<Application>): void {
  const apps = getApplications().map(a => {
    if (a.id !== id) return a;

    const updated = { ...a, ...updates, updatedAt: Date.now() };

    // 阶段变更时自动记录历史
    if (updates.stage && updates.stage !== a.stage) {
      const change: StageChange = {
        from: a.stage,
        to: updates.stage,
        at: Date.now(),
      };
      updated.stageHistory = [...(a.stageHistory || []), change];
    }

    return updated;
  });
  saveApplications(apps);
}

// 删除一条记录
export function deleteApplication(id: string): void {
  saveApplications(getApplications().filter(a => a.id !== id));
}

// 计算天数
export function daysAgo(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  return `${days}天前`;
}

// 判断是否逾期（在「已投递」或「简历筛选」停留超过 7 天）
export function isOverdue(app: Application): boolean {
  if (app.stage === 'Offer' || app.stage === '已凉') return false;
  const days = (Date.now() - app.createdAt) / 86400000;
  return days > 7;
}
