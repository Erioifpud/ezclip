import { SelectionInfo } from '@/lib/createActionContext';
import { proxy } from 'valtio';

type Status = 'loading' | 'normal' | 'error';

// 这里的属性都是临时的，在 SelectionTooltip 组件显示时初始化，消失的时候值就作废了
export interface TooltipState {
  visible: boolean;
  position: { x: number; y: number } | null;
  // 选中的文本
  text: string;
  // 对应 action 执行后的反馈信息
  feedbackMap: Record<string, string>;
  // 对应 action 的当前状态
  statusMap: Record<string, Status>;
}

export const tooltipStore = proxy<TooltipState>({
  visible: false,
  position: null,
  text: '',
  feedbackMap: {},
  statusMap: {},
});

/* 关于显示的优先级
  statusMap 表示 action 的当前状态，默认是 normal
  loading 和 error 是平级的，最高级，因为两种不可能同时出现
  normal 是默认状态，默认情况下显示 action 自带的文字/图标
  feedbackMap 是 action 执行后的反馈信息，比如“翻译”成功后，显示“翻译成功”
  当 normal 和 feedback 同时存在时，优先显示 feedback

  优先级（从高到低）：
  1. loading / error（显示对应的状态图标）
  2. feedback（显示反馈信息）
  3. normal（显示 action 自带的文字/图标）
*/
export const tooltipActions = {
  init: (selection: SelectionInfo) => {
    tooltipStore.visible = true;
    tooltipStore.position = selection.position;
    tooltipStore.text = selection.text;
    tooltipStore.feedbackMap = {};
    tooltipStore.statusMap = {};
  },
  close: () => {
    tooltipStore.visible = false;
    tooltipStore.position = null;
    tooltipStore.text = '';
    tooltipStore.feedbackMap = {};
    tooltipStore.statusMap = {};
  },
  showMessage: (actionId: string, message: string) => {
    tooltipStore.statusMap[actionId] = 'normal';
    tooltipStore.feedbackMap[actionId] = message;
  },
  setLoading: (actionId: string, loading: boolean) => {
    tooltipStore.statusMap[actionId] = loading ? 'loading' : 'normal';
  },
  setError: (actionId: string) => {
    tooltipStore.statusMap[actionId] = 'error';
  },
  resetStatus: (actionId: string) => {
    tooltipStore.statusMap[actionId] = 'normal';
    tooltipStore.feedbackMap[actionId] = '';
  }
};