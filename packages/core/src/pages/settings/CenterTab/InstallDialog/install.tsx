import { memo } from "react";
import { Plugin } from "@/store/plugin";
import { Button } from "@/components/ui/button";
interface Props {
  newPlugin: Plugin | null
  onSubmit: () => void
}
// 用于显示插件的安装信息
export const InstallPlugin = memo((props: Props) => {
  const { newPlugin, onSubmit } = props
  return (
    <div className="ec-flex ec-flex-col ec-gap-2">
      <div className="ec-flex ec-flex-col ec-gap-2 ec-text-sm ec-text-gray-500">
        {/* 名称 */}
        <div title={newPlugin?.namespace}>名称：{newPlugin?.name}</div>
        {/* 描述 */}
        <div>描述：{newPlugin?.description}</div>
        {/* tags */}
        {newPlugin?.tags?.length ? (
          <div className="ec-flex">
            <span>标签：</span>
            <div className="ec-flex ec-flex-wrap ec-gap-2">
              {newPlugin?.tags?.map(tag => (
                <div
                  className="ec-text-xs ec-bg-primary ec-text-primary-foreground ec-px-2 ec-py-1 ec-rounded-md"
                  key={tag}
                >{tag}</div>
              ))}
            </div>
          </div>
        ) : null}
        {/* 版本 */}
        <div>版本：{newPlugin?.version.plugin}</div>
        {/* 作者结合 homepage 显示 */}
        <div>
          <span>作者：</span>
          {newPlugin?.homepage ? (
            <a href={newPlugin?.homepage} target="_blank" rel="noopener noreferrer" className="ec-text-blue-500 ec-underline ec-cursor-pointer">
              {newPlugin?.author || '未知'}
            </a>
          ) : (
            <span className="ec-italic">{newPlugin?.author || '未知'}</span>
          )}
        </div>
        {/* 权限 */}
        {newPlugin?.permissions.length ? (
          <div>
            <div className="">权限：</div>
            <ul className="ec-flex ec-flex-col ec-gap-1 ec-pl-4">
              {newPlugin?.permissions.map(permission => (
                <li
                  className="ec-text-sm ec-text-gray-500 ec-italic"
                  key={permission}
                >{permission}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {/* actions */}
        <div>
          <div className="">动作：</div>
          <ul className="ec-flex ec-flex-col ec-gap-1 ec-pl-4">
            {newPlugin?.actions.map(action => (
              <li
                className="ec-text-sm ec-text-gray-500 ec-italic"
                key={action.id}
              >
                <span title={action.id}>{action.name}</span>
                {action.description ? (
                  <>
                    <span className="ec-text-xs ec-text-gray-500"> - </span>
                    <span className="ec-text-xs ec-text-gray-500">{action.description}</span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        {/* 配置 */}
        <div>配置：{newPlugin?.configForm.length ? '有' : '无'}</div>
      </div>
      {/* 安装按钮 */}
      <div className="ec-border-t ec-border-gray-200 ec-pt-4 ec-flex ec-justify-end">
        <Button size="sm" onClick={onSubmit}>安装</Button>
      </div>
    </div>
  )
})
