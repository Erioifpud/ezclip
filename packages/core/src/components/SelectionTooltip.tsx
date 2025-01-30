import { memo, useRef } from 'react';
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
      className="selection-tooltip ec-fixed ec-z-50 ec-bg-white ec-rounded-lg ec-shadow-lg ec-p-2 ec-flex ec-gap-2 ec-flex-col"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="ec-flex ec-gap-2">
        {actions.map(action => {
          const fullActionId = getActionId(action);
          // 根据 action 自己的 shouldShow 函数判断是否显示
          const currentUrl = window.location.href;
          const shouldShowFlag = action.shouldShow?.(text || '', currentUrl) ?? true;
          if (!shouldShowFlag) {
            return null;
          }
          return (
            <button
              key={fullActionId}
              onClick={
                (ev) => {
                  action.execute(
                    createActionContext(ev, {
                      text: text || '',
                      position: position,
                    }, action)
                  );
                }
              }
              className="ec-px-3 ec-py-1 ec-bg-primary ec-text-primary-foreground ec-rounded ec-hover:ec-bg-primary/80 ec-flex ec-items-center ec-justify-center"
              style={{
                ...(action.primaryColor ? { backgroundColor: action.primaryColor } : {}),
                ...(action.secondaryColor ? { color: action.secondaryColor } : {}),
              }}
            >
              <ButtonChild
                action={action}
                status={statusMap[fullActionId]}
                feedback={feedbackMap[fullActionId]}
              />
            </button>
          )
        })}

        {/* 设置 */}
        <button
          className="ec-px-3 ec-py-1 ec-bg-primary ec-text-primary-foreground ec-rounded ec-hover:ec-bg-primary/80"
          onClick={() => {
            settingsActions.openSettings();
          }}
        >
          <SettingsIcon className="ec-w-4 ec-h-4" />
        </button>
      </div>
    </div>
  );
});