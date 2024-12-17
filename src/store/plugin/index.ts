import { proxy } from "valtio";
import { PluginContext } from "@/lib/createPluginContext";
import { PluginFormField } from "./config";

export interface Action {
  id: string;          // 动作唯一标识，如 'base64.encode'
  name: string;        // 动作名称，如 '编码'
  icon: string;        // 动作图标
  description?: string;// 动作描述
  action: (context: PluginContext) => void | Promise<void>;
  // 动作所属的插件，自动注入
  _plugin?: Plugin;
}

export interface Plugin {
  namespace: string;   // 如 'com.example.base64'
  name: string;        // 插件名称，如 'Base64 工具'
  version: {
    // 插件的版本，语义化
    plugin: string;
    // 数据的版本，用于数据迁移
    data: number;
  };
  author: string;
  description: string;
  permissions: string[];
  configForm: PluginFormField[];     // 插件级别的配置
  actions: Action[];   // 插件提供的所有动作
  migrates: Record<number, (oldConfig: any) => any>;
  supportedPlatforms?: string[];
  tags?: string[];
  homepage?: string;
  // 插件来源（注册时不需要提供，加载插件时自动注入来源）
  _source?: string;
}

export interface PluginStore {
  remotePlugins: Plugin[];
  localPlugins: Plugin[];
  // 启用插件的 id
  enabledPlugins: string[];
  // 插件的配置
  pluginSettings: Record<string, Record<string, any>>;
}

export const pluginStore = proxy<PluginStore>({
  remotePlugins: [],
  localPlugins: [],
  // 启用插件的 id
  enabledPlugins: [],
  pluginSettings: {},
});