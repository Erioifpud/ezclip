import { PluginMeta } from "@/lib/loadPlugin";

export interface PluginMetaWithInstalled extends PluginMeta {
  installed: boolean;
  // 新插件比当前插件版本高
  diffVersion: boolean;
  remoteVersion: string;
  localVersion: string;
}