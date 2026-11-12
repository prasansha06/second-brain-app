import { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  selected?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ text, icon, selected, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 py-3 px-4 rounded-xl cursor-pointer transition-colors duration-150 ${
        selected
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100 font-medium"
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
