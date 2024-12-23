import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { appActions, appStore, Color } from "@/store/app";
import { baseColors } from "@/style/registry-base-colors";
import { Check, SettingsIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";
import { useSnapshot } from "valtio";

const COLORS: Color[] = ['zinc', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'];
const COLOR_SETS = baseColors
  .filter(item => COLORS.includes(item.name as Color))
  .map(item => {
    return {
      name: item.name,
      label: item.label,
      primaryColor: item.activeColor.light,
    }
  })

const CDN_LIST = [
  {
    name: 'jsDelivr',
    value: 'https://cdn.jsdelivr.net/npm',
  },
  {
    name: 'unpkg',
    value: 'https://unpkg.com',
  },
]

export const SettingsTab = memo(() => {
  const appState = useSnapshot(appStore);

  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <div className="ec-flex ec-items-center ec-w-full ec-h-10 ec-gap-2 ec-border-b ec-border-gray-200">
        <SettingsIcon className="ec-w-4 ec-h-4" />
        <span>设置</span>
      </div>
      {/* 内容区 */}
      <ScrollArea className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2" >
        {/* 主题色 */}
        <div className="ec-space-y-1.5">
          <Label className="ec-text-md">主题色</Label>
          <div className="ec-grid ec-grid-cols-3 ec-gap-2">
            {COLOR_SETS.map(color => {
              const isActive = appState.color === color.name;
              return (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={color.name}
                  onClick={() => {
                    appActions.setColor(color.name as Color);
                  }}
                  className="ec-justify-start ec-border-2 ec-border-input"
                  style={
                    {
                      '--theme-primary': 'hsl(var(--primary))',
                      borderColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      'ec-mr-1 ec-flex ec-h-5 ec-w-5 ec-shrink-0 ec--translate-x-1 ec-items-center ec-justify-center ec-rounded-full'
                    )}
                    style={{
                      backgroundColor: `hsl(${color.primaryColor})`
                    }}
                  >
                    {isActive && <Check className="ec-h-4 ec-w-4 ec-text-white" />}
                  </span>
                  {color.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* 应用源管理 */}
        <div className="ec-space-y-1.5 ec-mt-4">
          <Label className="ec-text-md">应用源</Label>
          <div className="ec-flex ec-flex-col ec-gap-2">
            {appState.sources.map(source => {
              return (
                <div key={source.url} className="ec-flex ec-items-center ec-justify-between ec-border ec-p-2 ec-rounded-lg">
                  <div className="ec-flex ec-flex-col">
                    <span className="ec-font-semibold ec-tracking-tight ec-text-card-foreground">{source.name}</span>
                    <span className="ec-text-muted-foreground">{source.url}</span>
                  </div>
                  <Button
                    className="ec-text-destructive ec-border ec-border-transparent hover:ec-border-destructive hover:ec-text-destructive"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      appActions.removeSource(source.url);
                    }}
                  >
                    <Trash2Icon className="ec-w-4 ec-h-4" />
                    <span className="ec-ml-1 ec-text-sm">删除</span>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* CDN 选择 */}
        <div className="ec-space-y-1.5 ec-mt-4">
          <Label className="ec-text-md">CDN 选择</Label>
          <Select
            value={appState.cdnRoot}
            onValueChange={value => {
              appActions.setCDNRoot(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择 CDN 源" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CDN_LIST.map(item => {
                  return (
                    <SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 网站黑名单 */}
        <div className="ec-space-y-1.5 ec-mt-4">
          <Label className="ec-text-md">网站黑名单</Label>
          <Textarea
            placeholder="按行分隔，支持通配符"
            value={appState.blackList.join('\n')}
            onChange={(e) => {
              appActions.setBlacklist(e.target.value.split('\n'));
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
});
