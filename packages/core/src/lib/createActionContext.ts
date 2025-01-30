import { reduce } from 'lodash-es';
import { tooltipActions } from '../store/tooltip';
import { Action, Plugin } from '@/store/plugin';
import { GM, GM_download } from '$';
import { toast } from 'sonner';
import { getActionId } from '@/store/plugin/utils';

export type UtilsMap = {
  storage: (plugin: Plugin) => {
    getItem: (key: string, defaultValue: string) => Promise<string>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  fetch: typeof fetch;
  xhr: typeof GM.xmlHttpRequest;
  clipboard: {
    write: (text: string, type?: string) => void;
  };
  download: typeof GM_download;
  open: typeof GM.openInTab;
};

export interface SelectionInfo {
  text: string;
  position: { x: number; y: number };
}

export interface ActionContext {
  meta: {
    namespace: string;
    version: {
      data: number;
      plugin: string;
    }
  };
  selection: SelectionInfo;
  tooltip: {
    toast: typeof toast;
    close: () => void;
    setLoading: (loading: boolean) => void;
    showMessage: (message: string) => void;
    setError: () => void;
    resetStatus: () => void;
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

const getStorageKey = (namespace: string, key: string) => {
  return `${namespace}-${key}`;
}

const getFullUtils = (plugin: Plugin) => {
  const { namespace } = plugin;
  return {
    storage: {
      getItem: (key: string, defaultValue: string) => {
        return GM.getValue(getStorageKey(namespace, key), defaultValue);
      },
      setItem: (key: string, value: string) => {
        return GM.setValue(getStorageKey(namespace, key), value);
      },
      removeItem: (key: string) => {
        return GM.deleteValue(getStorageKey(namespace, key));
      },
    },
    fetch,
    xhr: GM.xmlHttpRequest,
    download: GM_download,
    clipboard: {
      write: (text: string, type = 'text/plain') => {
        GM.setClipboard(text, type);
      },
    },
    open: GM.openInTab,
  } as const;
}

const getUtils = (plugin: Plugin) => {
  const { permissions } = plugin;
  const allUtils = getFullUtils(plugin);
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

export const createActionContext = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, selection: SelectionInfo, action: Action): ActionContext => {
  const actionId = getActionId(action);
  const plugin = action._plugin!;
  const utils = getUtils(plugin);
  return {
    meta: {
      namespace: plugin.namespace,
      version: plugin.version,
    },
    selection: {
      text: selection.text,
      position: selection.position,
    },
    tooltip: {
      toast,
      close: tooltipActions.close,
      setLoading: (loading: boolean) => {
        tooltipActions.setLoading(actionId, loading);
      },
      showMessage: (message: string) => {
        tooltipActions.showMessage(actionId, message);
      },
      setError: () => {
        tooltipActions.setError(actionId);
      },
      resetStatus: () => {
        tooltipActions.resetStatus(actionId);
      },
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