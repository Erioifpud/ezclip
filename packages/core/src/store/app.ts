import { proxy } from "valtio";

export interface Source {
  name: string;
  url: string;
}

export type Theme = 'light' | 'dark' | 'system';

export type Color = 'zinc' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet'

export interface AppState {
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

export const appStore = proxy<AppState>({
  sources: [],
  blackList: [],
  theme: 'light',
  color: 'blue',
  cdnRoot: 'https://cdn.jsdelivr.net/npm',
});

export const appActions = {
  setColor(color: Color) {
    appStore.color = color;
  },
  removeSource(url: string) {
    appStore.sources = appStore.sources.filter(source => source.url !== url);
  },
  setBlacklist(list: string[]) {
    appStore.blackList = list
  },
  setCDNRoot(cdn: string) {
    appStore.cdnRoot = cdn;
  },
}
