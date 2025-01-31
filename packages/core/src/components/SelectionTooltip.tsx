import { memo, useRef, Fragment } from 'react';
import { useSnapshot } from 'valtio';
import { tooltipStore } from '../store/tooltip';
import { useEnabledActions } from '@/hooks/useEnabledActions';
import { createActionContext } from '@/lib/createActionContext';
import { CircleXIcon, Loader2Icon, SettingsIcon } from 'lucide-react';
import { getActionId } from '@/store/plugin/utils';
import { settingsActions } from '@/store/settings';
import { Action } from '@/store/plugin';

interface ButtonChildProps {
  action: Action;
  status: 'loading' | 'error' | 'normal';
  feedback: string;
}

const ButtonChild = memo(({ action, status, feedback }: ButtonChildProps) => {
  if (status === 'loading') {
    return <Loader2Icon className="ec-w-4 ec-h-4 ec-animate-spin" />;
  }
  if (status === 'error') {
    return <CircleXIcon className="ec-w-4 ec-h-4" />;
  }
  if (feedback) {
    return <span className="ec-text-xs">{feedback}</span>;
  }
  return <>{action.icon}</>;
})

export const SelectionTooltip = memo(() => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { visible, position, text, feedbackMap, statusMap } = useSnapshot(tooltipStore);
  const actions = useEnabledActions();

  if (!visible || !position) return null;

  return (
    <div
      ref={tooltipRef}
      className="selection-tooltip ec-overflow-x-hidden ec-fixed ec-z-50 ec-bg-zinc-800 ec-h-7 ec-rounded-lg ec-shadow-lg ec-flex ec-items-center ec-bg-opacity-95"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {actions.map((action) => {
        const fullActionId = getActionId(action);
        const shouldShowFlag = action.shouldShow?.(text || '', window.location.href) ?? true;

        if (!shouldShowFlag) return null;

        return (
          <Fragment key={fullActionId}>
            <button
              onClick={(ev) => {
                action.execute(
                  createActionContext(ev, {
                    text: text || '',
                    position: position,
                  }, action)
                );
              }}
              className="ec-px-3 ec-h-full ec-text-sm ec-text-white hover:ec-bg-blue-500 ec-transition-colors ec-flex ec-items-center ec-justify-center"
            >
              <ButtonChild
                action={action}
                status={statusMap[fullActionId]}
                feedback={feedbackMap[fullActionId]}
              />
            </button>
          </Fragment>
        );
      })}

      <button
        className="ec-px-3 ec-h-full ec-text-sm ec-text-white hover:ec-bg-blue-500 ec-transition-colors"
        onClick={() => {
          settingsActions.openSettings();
        }}
      >
        <SettingsIcon className="ec-w-4 ec-h-4" />
      </button>
    </div>
  );
});