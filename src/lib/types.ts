// 阶段变更记录
export interface StageChange {
  from: string;
  to: Stage;
  at: number;          // timestamp
}

// 投递记录数据结构
export interface Application {
  id: string;
  company: string;
  position: string;
  channel: Channel;
  date: string;         // YYYY-MM-DD
  stage: Stage;
  note: string;
  createdAt: number;    // timestamp
  updatedAt?: number;
  stageHistory?: StageChange[];  // 阶段变更时间线
}

// 投递渠道
export type Channel = 'Boss直聘' | '实习僧' | '牛客' | '官网' | '内推' | '其他';

// 阶段
export type Stage = '已投递' | '简历筛选' | '笔试/测评' | '面试中' | 'Offer' | '已凉';

// 阶段顺序（看板列顺序）
export const STAGE_ORDER: Stage[] = [
  '已投递',
  '简历筛选',
  '笔试/测评',
  '面试中',
  'Offer',
  '已凉',
];

// 渠道颜色映射（Morandi palette）
export const CHANNEL_COLORS: Record<Channel, string> = {
  'Boss直聘': '#8e9aaf',
  '实习僧': '#9aab9e',
  '牛客': '#c4b998',
  '官网': '#b0a3af',
  '内推': '#c4a8a8',
  '其他': '#b5afa5',
};

// 漏斗阶段（不含"已凉"）
export const FUNNEL_STAGES: Stage[] = [
  '已投递',
  '简历筛选',
  '笔试/测评',
  '面试中',
  'Offer',
];

export const FUNNEL_COLORS = [
  '#8e9aaf',
  '#9aab9e',
  '#b0a3af',
  '#8e9aaf',
  '#7a9e83',
];

// 阶段图标
export const STAGE_ICONS: Record<Stage, string> = {
  '已投递': '📨',
  '简历筛选': '📋',
  '笔试/测评': '✏️',
  '面试中': '💬',
  'Offer': '🎉',
  '已凉': '❌',
};
