import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { ShareIcon } from "../icons/ShareIcon";

export interface CardProps {
  id?: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "document" | "link" | string;
  tags?: string[];
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function Card({ id, title, link, type, tags = [], onDelete, readOnly = false }: CardProps) {
  // Helper to get YouTube Embed URL
  const getYoutubeEmbed = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "youtube":
        return <YoutubeIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "document":
        return <DocumentIcon />;
      default:
        return <LinkIcon />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col justify-between max-w-sm w-full min-h-[280px]">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 text-gray-700 font-semibold text-sm truncate pr-2">
            <span className="text-gray-500">{renderIcon()}</span>
            <span className="truncate">{title}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open source link"
              className="hover:text-purple-600 transition-colors p-1"
            >
              <ShareIcon />
            </a>
            {!readOnly && onDelete && id && (
              <button
                onClick={() => onDelete(id)}
                title="Delete content"
                className="hover:text-red-600 transition-colors p-1 cursor-pointer"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        {/* Card Body / Embedded Content */}
        <div className="py-2">
          {type === "youtube" && (
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbed(link)}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {type === "twitter" && (
            <div className="w-full max-h-72 overflow-y-auto rounded-lg bg-gray-50 p-2">
              <blockquote className="twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}

          {(type === "document" || type === "link") && (
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg flex flex-col gap-2">
              <p className="text-xs text-gray-500 line-clamp-3">
                {link}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
              >
                Visit link &rarr;
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / Tags */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
        {tags && tags.length > 0 ? (
          tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md"
            >
              #{tag.trim()}
            </span>
          ))
        ) : (
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md capitalize">
            {type}
          </span>
        )}
      </div>
    </div>
  );
}
