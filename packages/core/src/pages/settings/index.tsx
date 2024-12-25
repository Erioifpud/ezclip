import { useSnapshot } from 'valtio';
import { settingsStore, SettingsTab as SettingsTabType } from '@/store/settings';
import { useMemo } from 'react';
import { VTab } from './components/VTab';
import { SettingsTab } from './BasicTab';
import { CenterTab } from './CenterTab';
import { AboutTab } from './AboutTab';
import { PluginTab } from './PluginTab';
import { DebugTab } from './DebugTab';

export const TAB_COMPONENT: Record<SettingsTabType, React.ComponentType<any> | null> = {
  manage: PluginTab,
  center: CenterTab,
  basic: SettingsTab,
  about: AboutTab,
  debug: DebugTab
} as const;

export const Settings = () => {
  const { open, activeTab } = useSnapshot(settingsStore);

  const ActiveTabComponent = useMemo(() => {
    if (!activeTab) {
      return null;
    }
    if (!Object.keys(TAB_COMPONENT).includes(activeTab)) {
      return null;
    }
    return TAB_COMPONENT[activeTab];
  }, [activeTab]);

  if (!open) return null;

  return (
    <div className="ec-fixed ec-inset-0 ec-z-50 ec-w-[800px] ec-h-[500px] ec-bg-white ec-backdrop-blur -ec-translate-x-1/2 -ec-translate-y-1/2 ec-top-1/2 ec-left-1/2 ec-rounded-lg ec-shadow-lg ec-overflow-hidden ec-border ec-border-gray-200">
      <div className="ec-container ec-mx-auto ec-p-2 ec-h-full">
        <div className="ec-flex ec-gap-2 ec-h-full">
          {/* 左侧 Tab 列表 */}
          <div className="ec-w-36">
            {/* Tab 按钮 */}
            <VTab />
          </div>
          {/* 右侧内容区 */}
          <div className="ec-flex-1">
            {ActiveTabComponent ? <ActiveTabComponent /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};