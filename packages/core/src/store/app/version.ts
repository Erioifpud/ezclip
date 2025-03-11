import { deepClone } from "@/lib/utils"

// 当前版本
export const CURRENT_VERSION = 0

type MigrateFn = (oldData: any) => any

// 迁移函数表
const migrateFnMap: Record<number, MigrateFn> = {
  // 本地版本 0，需要更新到 1 时执行
  // 1: (oldData: any) => {
  //   return {
  //     version: oldData.version++,
  //     ...
  //   }
  // }
}

// 简化的 AppState，因为旧的状态不好描述，所以只保留了必有的 version
interface SimplifiedAppState {
  version: number
  [prop: string]: any
}

// AppState 的迁移执行函数
export function updateAppState(localData: SimplifiedAppState) {
  const localVersion = localData.version;
  if (localVersion >= CURRENT_VERSION) {
    return localData;
  }
  const versions = Array.from(
    { length: CURRENT_VERSION - localVersion },
    (_, i) => localVersion + i + 1
  );
  let tempData = deepClone(localData)
  versions.forEach(version => {
    const migrate = migrateFnMap[version];
    if (typeof migrate === 'function') {
      // 执行迁移并更新配置
      tempData = migrate(tempData) || {};
    }
  });
  return tempData;
}
