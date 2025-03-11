import { GM_getValue, GM_setValue } from "$";
import { throttle } from "lodash-es";
import { proxy, subscribe } from "valtio";
import { CURRENT_VERSION, updateAppState } from "./version";
import { AppState, Color, Source } from "./type";

// 从 GM_getValue 恢复数据
function hydrateAppStore(): AppState {
  // 更新这里的数据时，需要先去 version.ts 中更新版本与数据迁移函数
  const data = GM_getValue<AppState>('app_store', {
    version: CURRENT_VERSION,
    sources: [
      {
        name: '官方源',
        url: 'https://cdn.jsdelivr.net/gh/Erioifpud/ezclip@main/packages/plugins/registry.json'
      }
    ],
    blackList: [],
    theme: 'light',
    color: 'blue',
    cdnRoot: 'https://cdn.jsdelivr.net/gh/Erioifpud/ezclip@main',
  });

  let latestData = updateAppState(data)
  // 转换完成之后就是最新的 AppState
  return latestData as AppState;
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
