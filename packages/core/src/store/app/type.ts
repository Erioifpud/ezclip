export interface Source {
  name: string;
  url: string;
}
  
export type Theme = 'light' | 'dark' | 'system';

export type Color = 'zinc' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet'

export interface AppState {
  // 脚本配置的版本号，用于数据迁移
  version: number
  // 插件来源
  sources: Source[];
  // 禁用脚本的站点
  blackList: string[];
  // 主题
  theme: Theme;
  // 颜色
  color: Color;
  // 插件 CDN 根路径
  cdnRoot: string;
}