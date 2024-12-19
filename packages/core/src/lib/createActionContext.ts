import { reduce } from 'lodash-es';
import { tooltipActions } from '../store/tooltip';
import { Plugin } from '@/store/plugin';
import { unsafeWindow } from '$';

export type UtilsMap = {
  storage: Storage;
  http: typeof fetch;
  clipboard: {
    writeText: (text: string) => Promise<void>;
  };
};

export interface SelectionInfo {
  text: string;
  position: { x: number; y: number };
}

export interface ActionContext {
  selection: SelectionInfo;
  tooltip: {
    close: () => void;
    showMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
  };
  config: {
    get: (key: string) => string | null;
    set: (key: string, value: any) => void;
  };
  utils: Partial<UtilsMap>;
  modifierKey: {
    isCtrl: boolean;
    isShift: boolean;
    isAlt: boolean;
  };
  version: number;
}

const allUtils: UtilsMap = {
  storage: localStorage,
  http: fetch,
  clipboard: {
    writeText: (text: string) => {
      return new Promise((resolve) => {
        unsafeWindow.document.execCommand('copy', false, text);
        resolve();
      });
    },
  },
} as const;

const getUtils = (permissions: string[]) => {
  const formatedPermissions = permissions.map(permission => permission as keyof UtilsMap);
  return reduce<keyof UtilsMap, Partial<UtilsMap>>(
    formatedPermissions,
    (utils, permission) => {
      if (!(permission in allUtils)) {
        return utils;
      }
      utils[permission] = allUtils[permission] as any;
      return utils;
    },
    {}
  );
};

export const createActionContext = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, selection: SelectionInfo, plugin: Plugin): ActionContext => {
  const { permissions } = plugin;
  const utils = getUtils(permissions);
  return {
    selection: {
      text: selection.text,
      position: selection.position,
    },
    tooltip: {
      close: tooltipActions.close,
      showMessage: tooltipActions.showMessage,
      setLoading: tooltipActions.setLoading,
    },
    config: {
      get: (key: string) => localStorage.getItem(key),
      set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
    },
    // 和权限挂钩，提供一些基本的 utils
    // 如果 plugin 声明了权限，则会提供权限对应的 utils
    // { [permission]: { [utilName]: util } }
    utils,
    modifierKey: {
      isCtrl: ev.ctrlKey,
      isShift: ev.shiftKey,
      isAlt: ev.altKey,
    },
    version: 0,
  }
};