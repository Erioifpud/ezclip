import { tooltipActions } from '../store/tooltip';

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
  utils: {
    storage: Storage;
    http: typeof fetch;
  };
  modifierKey: {
    isCtrl: boolean;
    isShift: boolean;
    isAlt: boolean;
  };
  version: number;
}

export const createActionContext = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, selection: SelectionInfo): ActionContext => ({
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
  utils: {
    storage: localStorage,
    http: fetch,
  },
  modifierKey: {
    isCtrl: ev.ctrlKey,
    isShift: ev.shiftKey,
    isAlt: ev.altKey,
  },
  version: 0,
});