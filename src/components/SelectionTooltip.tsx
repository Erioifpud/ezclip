import { useEffect, useRef } from 'react';

interface TooltipProps {
  text: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const SelectionTooltip = ({ text, position, onClose }: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onClose();
  };

  return (
    <div
      ref={tooltipRef}
      className="selection-tooltip fixed z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <button
        onClick={handleSearch}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        搜索
      </button>
      <button
        onClick={handleCopy}
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        复制
      </button>
    </div>
  );
}; 