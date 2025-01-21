import { proxy } from 'valtio';

interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'default' | 'destructive' | 'secondary' | 'ghost';
  cancelColor?: 'default' | 'destructive' | 'secondary' | 'ghost';
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve?: (value: boolean) => void;
  reject?: () => void;
}

export const confirmStore = proxy<ConfirmState>({
  isOpen: false,
  options: {
    description: '',
  },
});

export const confirmActions = {
  async confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      confirmStore.isOpen = true;
      confirmStore.options = {
        title: '确认',
        confirmText: '确定',
        cancelText: '取消',
        confirmColor: 'destructive',
        cancelColor: 'secondary',
        ...options,
      };
      confirmStore.resolve = resolve;
      confirmStore.reject = reject;
    });
  },

  handleConfirm() {
    confirmStore.isOpen = false;
    confirmStore.resolve?.(true);
  },

  handleCancel() {
    confirmStore.isOpen = false;
    confirmStore.resolve?.(false);
  }
};