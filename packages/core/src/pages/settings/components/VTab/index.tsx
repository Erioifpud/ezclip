import { settingsActions, settingsStore, SettingsTab } from "@/store/settings";
import { AppWindowIcon, BugIcon, InfoIcon, PlugIcon, SettingsIcon, XIcon } from "lucide-react";
import { memo } from "react";
import { useSnapshot } from "valtio/react";

const TAB_LIST: { label: string; value: SettingsTab; icon: React.ReactNode }[] = [
  {
    label: '插件中心',
    value: 'center',
    icon: <AppWindowIcon   className="ec-w-4 ec-h-4" />
  },
  {
    label: '插件管理',
    value: 'manage',
    icon: <PlugIcon className="ec-w-4 ec-h-4" />
  },
  {
    label: '设置',
    value: 'basic',
    icon: <SettingsIcon className="ec-w-4 ec-h-4" />
  },
  {
    label: '关于',
    value: 'about',
    icon: <InfoIcon className="ec-w-4 ec-h-4" />
  },
  {
    label: '调试',
    value: 'debug',
    icon: <BugIcon className="ec-w-4 ec-h-4" />
  },
]

// 竖着的 Tab 组件
export const VTab = memo(() => {
  const state = useSnapshot(settingsStore);

  return (
    <div className="ec-flex ec-flex-col ec-gap-3 ec-pr-2 ec-border-r ec-border-gray-200 ec-h-full ec-select-none">
      {TAB_LIST.map((tab) => (
        <div
          className="ec-flex ec-items-center ec-w-full ec-h-10 ec-bg-gray-100 ec-rounded-lg ec-cursor-pointer ec-hover:ec-bg-gray-200"
          key={tab.value}
          style={{
            ...(state.activeTab === tab.value ? { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } : {}),
          }}
          onClick={() => {
            settingsActions.setActiveTab(tab.value);
          }}
        >
          <div className="ec-text-sm ec-flex ec-items-center ec-gap-2 ec-px-3">
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        </div>
      ))}
      <div className="ec-flex-1"></div>
      <div
        className="ec-flex ec-items-center ec-w-fit ec-h-10 ec-bg-gray-100 ec-rounded-lg ec-cursor-pointer ec-hover:ec-bg-gray-200"
        onClick={() => {
          settingsActions.closeSettings();
        }}
      >
        <div className="ec-text-sm ec-flex ec-items-center ec-gap-2 ec-px-3">
          <XIcon className="ec-w-4 ec-h-4" />
        </div>
      </div>
    </div>
  )
});

