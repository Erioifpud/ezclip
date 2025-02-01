import { GM_getValue, GM_setValue } from "$";
import { throttle } from "lodash-es";
import { proxy, subscribe } from "valtio";

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

// --------------------------------------------

// 从 GM_getValue 恢复数据
function hydrateAppStore(): AppState {
  const data = GM_getValue<AppState>('app_store', {
    sources: [],
    blackList: [],
    theme: 'light',
    color: 'blue',
    cdnRoot: 'https://cdn.jsdelivr.net/npm',
  });

  return data;
}

export const appStore = proxy<AppState>(hydrateAppStore());

const updateHandler = throttle(() => {
  GM_setValue('app_store', appStore);
}, 1000);

// 订阅 store 变更，自动保存数据
subscribe(appStore, updateHandler);

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
  addSource(source: Source) {
    if (appStore.sources.find(s => s.url === source.url)) {
      return false
    }
    appStore.sources.push(source);
    return true
  },
}
