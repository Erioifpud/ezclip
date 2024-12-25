import { proxy } from 'valtio';

export type SettingsTab = 'center' | 'manage' | 'basic' | 'about' | 'debug';

interface SettingsStore {
  open: boolean;
  activeTab: SettingsTab;
}

export const settingsStore = proxy<SettingsStore>({
  open: false,
  activeTab: 'basic'
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
