import { useSelection } from './hooks/useSelection';
import { SelectionTooltip } from './components/SelectionTooltip';
import { useEffect, useMemo } from 'react';
import { tooltipStore } from './store/tooltip';
import { appStore } from './store/app';
import { baseColors } from './style/registry-base-colors';

function App() {
  const selection = useSelection();

  useEffect(() => {
    if (selection) {
      tooltipStore.visible = true;
      tooltipStore.position = selection.position;
    }
  }, [selection]);

  // 设置主题颜色
  const baseColor = useMemo(() => {
    const colorSetIndex = baseColors.findIndex((color) => color.name === appStore.color);
    if (colorSetIndex === -1) return {};
    const colorSet = baseColors[colorSetIndex];
    // TODO: 暂时只支持 light 主题
    const cssVars = colorSet.cssVars.light;
    // add -- prefix
    return Object.fromEntries(Object.entries(cssVars).map(([key, value]) => [`--${key}`, value]));
  }, [appStore.color]);

  return (
    <div
      className="ec-fixed ec-w-0 ec-h-0 ec-top-0 ec-left-0 ec-overflow-visible"
      style={{
        ...baseColor,
      }}
    >
      <SelectionTooltip />
    </div>
  );
}

export default App;