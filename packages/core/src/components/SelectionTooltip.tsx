import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { tooltipStore, tooltipActions } from '../store/tooltip';
import { useEnabledActions } from '@/hooks/useEnabledActions';
import { createActionContext } from '@/lib/createActionContext';
import { SettingsIcon } from 'lucide-react';
import { getActionId } from '@/store/plugin/utils';
import { settingsActions } from '@/store/settings';

export const SelectionTooltip = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { visible, position, message } = useSnapshot(tooltipStore);
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
      {message && <div className="ec-text-sm ec-text-gray-600">{message}</div>}
      <div className="ec-flex ec-gap-2">
        {actions.map(action => {
          // 根据 action 自己的 shouldShow 函数判断是否显示
          const currentUrl = window.location.href;
          const shouldShowFlag = action.shouldShow?.(message || '', currentUrl) ?? true;
          if (!shouldShowFlag) {
            return null;
          }
          return (
            <button
              key={getActionId(action)}
              onClick={
                (ev) => {
                  action.execute(
                    createActionContext(ev, {
                      text: message || '',
                      position: position,
                    }, action._plugin!)
                  );
                }
              }
              className="ec-px-3 ec-py-1 ec-bg-primary ec-text-primary-foreground ec-rounded ec-hover:ec-bg-primary/80"
              style={{
                ...(action.primaryColor ? { backgroundColor: action.primaryColor } : {}),
                ...(action.secondaryColor ? { color: action.secondaryColor } : {}),
              }}
            >
              {action.icon}
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
};