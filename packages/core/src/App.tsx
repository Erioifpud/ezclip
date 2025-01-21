import { useSelection } from './hooks/useSelection';
import { SelectionTooltip } from './components/SelectionTooltip';
import { useEffect, useMemo } from 'react';
import { tooltipStore } from './store/tooltip';
import { baseColors } from './style/registry-base-colors';
import { Settings } from './pages/settings';
import { SettingsIcon } from 'lucide-react';
import { settingsActions } from './store/settings';
import { useSnapshot } from 'valtio/react';
import { appStore } from './store/app';
import { Toaster } from './components/ui/sonner';
import { Confirm } from './components/Confirm';
import { isValidSettingPage } from './lib/utils';

function App() {
  const selection = useSelection();
  const appState = useSnapshot(appStore);

  useEffect(() => {
    if (selection) {
      tooltipStore.visible = true;
      tooltipStore.position = selection.position;
    } else {
      tooltipStore.visible = false;
      tooltipStore.position = null;
    }
  }, [selection]);

  // 设置主题颜色
  const baseColor = useMemo(() => {
    const colorSetIndex = baseColors.findIndex((color) => color.name === appState.color);
    if (colorSetIndex === -1) return {};
    const colorSet = baseColors[colorSetIndex];
    // TODO: 暂时只支持 light 主题
    const cssVars = colorSet.cssVars.light;
    // add -- prefix
    return Object.fromEntries(Object.entries(cssVars).map(([key, value]) => [`--${key}`, value]));
  }, [appState.color]);

  return (
    <div
      className="ec-fixed ec-w-0 ec-h-0 ec-top-0 ec-left-0 ec-overflow-visible"
      style={{
        ...baseColor,
      }}
    >
      <SelectionTooltip />
      {/* 设置触发按钮 */}
      {isValidSettingPage() && (
        <div
          onClick={() => {
            settingsActions.toggleSettings();
          }}
          className="ec-fixed ec-bottom-4 ec-left-4 ec-z-50 ec-p-4 ec-rounded-full ec-bg-white ec-border ec-border-gray-200 ec-shadow-lg ec-cursor-pointer"
        >
          <SettingsIcon className="ec-w-4 ec-h-4" />
        </div>
      )}
      {/* 设置弹窗 */}
      <Settings />
      {/* 全局 toast */}
      <Toaster />
      {/* 确认弹窗 */}
      <Confirm />
    </div>
  );
}

export default App;