import { proxy } from 'valtio';

export interface TooltipState {
  visible: boolean;
  message: string | null;
  position: { x: number; y: number } | null;
  loading: boolean;
}

export const tooltipStore = proxy<TooltipState>({
  visible: false,
  message: null,
  position: null,
  loading: false,
});

export const tooltipActions = {
  close: () => {
    tooltipStore.visible = false;
    tooltipStore.message = null;
    tooltipStore.loading = false;
  },
  showMessage: (message: string) => {
    tooltipStore.message = message;
  },
  setLoading: (loading: boolean) => {
    tooltipStore.loading = loading;
  }
};