import { LogoIcon } from "../icons/LogoIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { SidebarItem } from "./SidebarItem";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  currentFilter: string;
  setFilter: (filter: string) => void;
}

export function Sidebar({ currentFilter, setFilter }: SidebarProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  return (
    <aside className="h-screen bg-white border-r border-gray-200 w-64 fixed left-0 top-0 flex flex-col justify-between p-4 z-20">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => setFilter("all")}
          className="flex items-center gap-3 px-2 py-4 cursor-pointer"
        >
          <LogoIcon />
          <span className="text-xl font-bold tracking-tight text-gray-900">Brainly</span>
        </div>

        {/* Filter Navigation Items */}
        <div className="flex flex-col gap-1 mt-4">
          <SidebarItem
            text="All Notes"
            icon={<DocumentIcon />}
            selected={currentFilter === "all"}
            onClick={() => setFilter("all")}
          />
          <SidebarItem
            text="Tweets"
            icon={<TwitterIcon />}
            selected={currentFilter === "twitter"}
            onClick={() => setFilter("twitter")}
          />
          <SidebarItem
            text="Videos"
            icon={<YoutubeIcon />}
            selected={currentFilter === "youtube"}
            onClick={() => setFilter("youtube")}
          />
          <SidebarItem
            text="Documents"
            icon={<DocumentIcon />}
            selected={currentFilter === "document"}
            onClick={() => setFilter("document")}
          />
          <SidebarItem
            text="Links"
            icon={<LinkIcon />}
            selected={currentFilter === "link"}
            onClick={() => setFilter("link")}
          />
        </div>
      </div>

      {/* User Info & Logout footer */}
      <div className="border-t border-gray-200 pt-4 px-2">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Account</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{username || "User"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 hover:text-red-700 font-medium py-1 px-2 hover:bg-red-50 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
