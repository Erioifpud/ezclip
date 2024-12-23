import { proxy } from 'valtio';

export type SettingsTab = 'remote' | 'local' | 'sources' | 'settings' | 'about';

interface SettingsStore {
  open: boolean;
  activeTab: SettingsTab;
}

export const settingsStore = proxy<SettingsStore>({
  open: false,
  activeTab: 'settings'
});

export const settingsActions = {
  openSettings(tab?: SettingsTab) {
    settingsStore.open = true;
    if (tab) {
      settingsStore.activeTab = tab;
    }
  },
  closeSettings() {
    settingsStore.open = false;
  },
  setActiveTab(tab: SettingsTab) {
    settingsStore.activeTab = tab;
  },
  toggleSettings() {
    settingsStore.open = !settingsStore.open;
  }
};
