import { memo } from "react";

interface TitleBarProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export const TitleBar = memo(({ title, icon, children }: TitleBarProps) => {
  return (
    <div className="ec-flex ec-items-center ec-w-full ec-h-10 ec-gap-2 ec-border-b ec-border-gray-200 ec-shrink-0">
      <div className="ec-flex ec-items-center ec-gap-2 ec-shrink-0">
        {icon}
        <span>{title}</span>
      </div>
      <div className="ec-flex-1 ec-flex-grow w-full">
        {children}
      </div>
    </div>
  )
})