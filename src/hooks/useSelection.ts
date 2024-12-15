import { useState, useEffect } from 'react';

interface SelectionPosition {
  x: number;
  y: number;
}

interface SelectionInfo {
  text: string;
  position: SelectionPosition;
}

export const useSelection = () => {
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo | null>(null);

  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      // 如果点击的是 tooltip，则不处理，避免点击按钮时重新显示 tooltip
      const target = e.target as HTMLElement;
      if (target.closest('.selection-tooltip')) {
        return;
      }

      // 延迟处理，避免在选区还没消失时松开鼠标再次触发
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setSelectionInfo(null);
          return;
        }

        const text = selection.toString().trim();
        if (!text) {
          setSelectionInfo(null);
          return;
        }

        setSelectionInfo({
          text,
          position: {
            x: e.pageX,
            y: e.pageY
          }
        });
      }, 0);
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return selectionInfo;
}; 