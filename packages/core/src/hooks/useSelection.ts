import { useState, useEffect, useRef } from 'react';

interface SelectionPosition {
  x: number;
  y: number;
}

interface SelectionInfo {
  text: string;
  position: SelectionPosition;
}

interface PartialSelection {
  anchorNode: Node | null;
  anchorOffset: number;
  focusNode: Node | null;
  focusOffset: number;
  direction: string;
}

const isSameSelection = (selection1: PartialSelection | null, selection2: PartialSelection | null) => {
  if (!selection1 || !selection2) {
    return false
  }
  return (
    selection1.anchorNode === selection2.anchorNode
    && selection1.anchorOffset === selection2.anchorOffset
    && selection1.focusNode === selection2.focusNode
    && selection1.focusOffset === selection2.focusOffset
    && selection1.direction === selection2.direction
  )
}

export const useSelection = () => {
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo | null>(null);
  const lastSelectionInfo = useRef<PartialSelection | null>(null);

  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      const container = document.getElementById('$$ezclip-core-container$$');

      // 生产环境的 Shadow DOM 模式
      if (container) {
        const shadowRoot = container?.shadowRoot;
        const root = shadowRoot?.getElementById('$$ezclip-core-root$$');
        const tooltip = root?.querySelector('.selection-tooltip');

        if (e.composedPath().includes(tooltip as Node)) {
          return;
        }
      } else {
        // 开发环境直接将元素注入到主文档
        // 如果点击的是 tooltip，则不处理，避免点击按钮时重新显示 tooltip
        const target = e.target as HTMLElement;
        if (target.closest('.selection-tooltip')) {
          return;
        }
      }

      // 延迟处理，避免点到外部选区消失，但弹窗未消失的情况
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setSelectionInfo(null);
          lastSelectionInfo.current = null;
          return;
        }

        const text = selection.toString().trim();
        if (!text) {
          setSelectionInfo(null);
          lastSelectionInfo.current = null;
          return;
        }

        // 和上一次的选区进行比对，避免“不影响选区的点击（比如点击文档流外的元素）”更新弹窗位置
        if (!isSameSelection(lastSelectionInfo.current, selection)) {
          setSelectionInfo({
            text,
            position: {
              x: e.clientX,
              y: e.clientY
            }
          });
          // window.getSelection 似乎会复用同一个对象
          lastSelectionInfo.current = {
            anchorNode: selection.anchorNode,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode,
            focusOffset: selection.focusOffset,
            direction: selection.direction,
          }
        }
      }, 0);
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    }
  }, []);

  // 发生滚动时隐藏工具栏
  useEffect(() => {
    const handleScroll = () => {
      if (!selectionInfo) {
        return
      }
      setSelectionInfo(null)
      lastSelectionInfo.current = null
    }

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    }
  }, [selectionInfo])

  return selectionInfo;
};