import { useSnapshot } from 'valtio';
import { confirmStore, confirmActions } from '@/store/confirm';
import { Button } from './ui/button';

export function Confirm() {
  const { isOpen, options } = useSnapshot(confirmStore);

  if (!isOpen) return null;

  return (
    <div className="ec-fixed ec-inset-0 ec-z-50 ec-bg-black/50 ec-flex ec-items-center ec-justify-center">
      <div className="ec-bg-white ec-rounded-lg ec-shadow-lg ec-w-[90%] ec-max-w-[400px] ec-p-4">
        <div className="ec-mb-4">
          {options.title && (
            <h3 className="ec-text-lg ec-font-semibold ec-mb-2">{options.title}</h3>
          )}
          <p className="ec-text-gray-600 ec-text-xs">{options.description}</p>
        </div>

        <div className="ec-flex ec-justify-end ec-gap-2">
          <Button
            className="ec-text-xs"
            size="sm"
            variant={options.cancelColor}
            onClick={confirmActions.handleCancel}
          >
            {options.cancelText}
          </Button>
          <Button
            className="ec-text-xs"
            size="sm"
            variant={options.confirmColor}
            onClick={confirmActions.handleConfirm}
          >
            {options.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}