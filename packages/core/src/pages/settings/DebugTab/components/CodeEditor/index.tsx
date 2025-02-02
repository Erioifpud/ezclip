import { ClipboardEvent, KeyboardEvent, memo } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDER = `在此输入插件代码

1. 模块请使用 commonjs 导出
2. 更新时请确保新旧 namespace 一致，内部会自动覆盖旧版本，并通过 migrates 迁移数据
3. 如果真的因为数据造成报错、无法正常使用，请在 monkey 插件的设置页面删除相关数据（不是删除插件）

示例：
module.exports = {
  namespace: '插件 id',
  name: '插件名称',
  ...
}
`;

export const CodeEditor = memo<Props>(({ value, onChange }) => {
  // 处理 Tab 键
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  // 处理粘贴
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      className="ec-relative ec-w-full ec-flex-grow ec-h-full ec-border ec-overflow-y-hidden ec-font-mono"
    >
      <textarea
        className="ec-w-full ec-h-full ec-p-1 ec-outline-none ec-resize-none ec-bg-transparent ec-text-gray-700"
        spellCheck="false"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        value={value}
        placeholder={PLACEHOLDER}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
})