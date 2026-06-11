import type { Application } from './types';
import { getApplications, saveApplications } from './storage';

export function seedIfEmpty(): void {
  if (getApplications().length > 0) return;

  const now = Date.now();
  const day = 86400000;
  const list: Application[] = [
    { id:'s0',  company:'字节跳动', position:'产品经理实习生',   channel:'Boss直聘', date:'2024-06-10', stage:'面试中',   note:'周三下午3点腾讯会议',     createdAt:now-day*1 },
    { id:'s1',  company:'腾讯',     position:'产品策划实习生',   channel:'官网',     date:'2024-06-09', stage:'笔试/测评', note:'完成行测+产品题',         createdAt:now-day*2 },
    { id:'s2',  company:'阿里巴巴', position:'产品实习生',       channel:'内推',     date:'2024-06-08', stage:'已投递',   note:'内推人：张三学长',         createdAt:now-day*3 },
    { id:'s3',  company:'美团',     position:'产品运营实习生',   channel:'实习僧',   date:'2024-06-07', stage:'简历筛选', note:'',                           createdAt:now-day*4 },
    { id:'s4',  company:'小红书',   position:'社区产品实习生',   channel:'Boss直聘', date:'2024-06-06', stage:'已投递',   note:'',                           createdAt:now-day*5 },
    { id:'s5',  company:'百度',     position:'AI产品实习生',     channel:'牛客',     date:'2024-06-05', stage:'已凉',     note:'简历没过',                   createdAt:now-day*6 },
    { id:'s6',  company:'京东',     position:'电商产品实习生',   channel:'官网',     date:'2024-06-04', stage:'Offer',     note:'下周一给答复',               createdAt:now-day*7 },
    { id:'s7',  company:'网易',     position:'产品助理',         channel:'Boss直聘', date:'2024-06-03', stage:'面试中',   note:'',                           createdAt:now-day*8 },
    { id:'s8',  company:'快手',     position:'策略产品实习生',   channel:'内推',     date:'2024-06-02', stage:'简历筛选', note:'',                           createdAt:now-day*12 },
    { id:'s9',  company:'滴滴',     position:'增长产品实习生',   channel:'实习僧',   date:'2024-06-01', stage:'已投递',   note:'',                           createdAt:now-day*13 },
    { id:'s10', company:'B站',      position:'内容产品实习生',   channel:'Boss直聘', date:'2024-05-30', stage:'已凉',     note:'岗位已关闭',                 createdAt:now-day*15 },
    { id:'s11', company:'拼多多',   position:'产品实习生',       channel:'官网',     date:'2024-05-29', stage:'已投递',   note:'',                           createdAt:now-day*16 },
  ];

  saveApplications(list);
}
