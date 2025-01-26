import { memo } from "react";
import { Plugin } from "@/store/plugin";
import { Button } from "@/components/ui/button";

interface Props {
  existedPlugin: Plugin | null
  newPlugin: Plugin | null
  onSubmit: () => void
}

export const UpdatePlugin = memo((props: Props) => {
  const { existedPlugin, newPlugin, onSubmit } = props
  console.log(existedPlugin, newPlugin)

  // 这个组件里面需要对比两个插件的差异，然后展示出来
  // 和 install 不一样，这里只展示差异，不展示具体的信息
  // 总体来说是基于旧的信息，然后展示新版本的变化
  return (
    <div className="ec-flex ec-flex-col ec-gap-2">
      <div className="ec-flex ec-flex-col ec-gap-2 ec-text-sm ec-text-gray-500">
        {/* 名称 */}
        {existedPlugin?.name !== newPlugin?.name && (
          <div>
            名称：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.name}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.name}</span>
          </div>
        )}
        {/* 描述 */}
        {existedPlugin?.description !== newPlugin?.description && (
          <div>
            描述：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.description}</span>
          </div>
        )}
        {/* 版本 */}
        {existedPlugin?.version.plugin !== newPlugin?.version.plugin && (
          <div>
            版本：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.version.plugin}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.version.plugin}</span>
          </div>
        )}
        {/* 作者 */}
        {existedPlugin?.author !== newPlugin?.author && (
          <div>
            作者：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.author}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.author}</span>
          </div>
        )}
        {/* 权限数量 */}
        {existedPlugin?.permissions.length !== newPlugin?.permissions.length && (
          <div>
            权限变化：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.permissions.length}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.permissions.length}</span>
          </div>
        )}
        {/* 权限 */}
        {newPlugin?.permissions.length ? (
          <div>
            <div className="">所有权限：</div>
            <ul className="ec-flex ec-flex-col ec-gap-1 ec-pl-4">
              {newPlugin?.permissions.map(permission => (
                <li
                  className="ec-w-fit ec-text-sm ec-text-gray-500 ec-italic ec-bg-green-100 ec-px-1 ec-rounded-md"
                  key={permission}
                >{permission}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {/* actions 数量 */}
        {existedPlugin?.actions.length !== newPlugin?.actions.length && (
          <div>
            动作变化：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.actions.length}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.actions.length}</span>
          </div>
        )}
        {/* actions */}
        <div>
          <div className="">所有动作：</div>
          <ul className="ec-flex ec-flex-col ec-gap-1 ec-pl-4">
            {newPlugin?.actions.map(action => (
              <li
                className="ec-text-sm ec-text-gray-500 ec-italic ec-px-1 ec-py-0.5 ec-rounded-md ec-bg-green-100 ec-max-w-fit"
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
        {existedPlugin?.configForm.length !== newPlugin?.configForm.length && (
          <div>
            配置变化：
            <span className="ec-inline-block ec-text-gray-500 ec-bg-red-100 ec-px-1 ec-rounded-md">{existedPlugin?.configForm.length}</span>
            <span className="ec-inline-block ec-text-gray-500"> -&gt; </span>
            <span className="ec-inline-block ec-text-gray-500 ec-bg-green-100 ec-px-1 ec-rounded-md">{newPlugin?.configForm.length}</span>
          </div>
        )}
      </div>
      {/* 安装按钮 */}
      <div className="ec-border-t ec-border-gray-200 ec-pt-4 ec-flex ec-justify-end">
        <Button size="sm" onClick={onSubmit}>更新</Button>
      </div>
    </div>
  )
})