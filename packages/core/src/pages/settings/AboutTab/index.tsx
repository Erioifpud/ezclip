import { InfoIcon } from "lucide-react"
import { memo } from "react"
import { TitleBar } from "../components/TitleBar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// LLM 根据 README.md 生成的，有需要再调整吧
export const AboutTab = memo(() => {
  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full ec-text-secondary-foreground">
      {/* 标题栏 */}
      <TitleBar title="关于" icon={<InfoIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <div data-ec-scrollbar className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2">
        {/* 介绍 */}
        <Card>
          <CardHeader>
            <CardTitle>EzClip</CardTitle>
            <CardDescription>
              <div className="ec-text-sm ec-mb-2">一个用于快速处理选中文本的 UserScript 脚本，需要配合 Tampermonkey 或者 Violentmonkey 使用。</div>
              <div className="ec-text-sm">仓库地址：
                <a className="ec-text-primary ec-cursor-pointer ec-underline" href="https://github.com/Erioifpud/ezclip" target="_blank" rel="noopener noreferrer">https://github.com/EzClip/EzClip</a>
              </div>
              <div className="ec-text-sm">
                欢迎提交 Issue 或 Pull Request，喜欢的话给个&nbsp;
                <span className="ec-text-yellow-500">Star</span>
                &nbsp;吧！
              </div>
            </CardDescription>
          </CardHeader>

        </Card>

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="ec-text-sm">安装完成后，在任意网页中选中文字，就会弹出 EzClip 的迷你菜单，你可以选择其中的功能来处理选中的文本。</p>
          </CardContent>
        </Card>


        {/* 功能列表 */}
        <Card>
          <CardHeader>
            <CardTitle>功能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ec-list-disc ec-pl-4 ec-space-y-2 ec-text-sm">
              <li>文本复制（内置插件，可以选择禁用）</li>
              <li>快捷搜索（远程插件）</li>
              <li>更多功能可以通过应用中心安装...</li>
            </ul>
          </CardContent>
        </Card>

        {/* 许可证 */}
        <Card>
          <CardHeader>
            <CardTitle>许可证</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="ec-text-sm">本项目基于 MIT 许可证发布。</p>
          </CardContent>
        </Card>


        {/* 参考项目 */}
        <Card>
          <CardHeader>
            <CardTitle>参考</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ec-space-y-2 ec-text-sm">
              <li>
                <a
                  href="https://www.popclip.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ec-text-primary hover:ec-underline"
                >
                  PopClip
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/the1812/Bilibili-Evolved"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ec-text-primary hover:ec-underline"
                >
                  Bilibili-Evolved
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
