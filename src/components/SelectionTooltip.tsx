import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { tooltipStore, tooltipActions } from '../store/tooltip';
import { useEnabledActions } from '@/hooks/useEnabledActions';
import { createActionContext } from '@/lib/createActionContext';
import { SettingsIcon } from 'lucide-react';
import { getActionId } from '@/store/plugin/utils';

export const SelectionTooltip = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { visible, position, message } = useSnapshot(tooltipStore);
  const actions = useEnabledActions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        tooltipActions.close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!visible || !position) return null;

  return (
    <div
      ref={tooltipRef}
      className="selection-tooltip fixed z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2 flex-col"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {message && <div className="text-sm text-gray-600">{message}</div>}
      <div className="flex gap-2">
        {actions.map(action => {
          // 根据 action 自己的 shouldShow 函数判断是否显示
          const shouldShowFlag = action.shouldShow?.(message || '') ?? true;
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
                    })
                  );
                }
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {action.icon}
            </button>
          )
        })}

        {/* 设置 */}
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};