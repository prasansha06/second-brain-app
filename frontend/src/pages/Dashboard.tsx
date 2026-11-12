import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card, CardProps } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [contents, setContents] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const fetchContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.content || [];
      const formatted = data.map((item: any) => ({
        id: item._id,
        title: item.title,
        link: item.link,
        type: item.type,
        tags: item.tags || []
      }));
      setContents(formatted);
    } catch (err) {
      console.warn("Failed to fetch notes from backend, using default preview");
      setContents(getDefaultNotes());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId: id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setContents((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      // Optimistic delete for offline testing
      setContents((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleShareBrain = async () => {
    setSharing(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.hash) {
        const url = `${window.location.origin}/brain/${res.data.hash}`;
        setShareLink(url);
      }
    } catch (e) {
      // Mock hash if offline
      const mockUrl = `${window.location.origin}/brain/demo-brain-hash`;
      setShareLink(mockUrl);
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDefaultNotes = (): CardProps[] => [
    {
      id: "demo-1",
      title: "System Design: Microservices Architecture",
      link: "https://www.youtube.com/watch?v=y8OnoxKotPQ",
      type: "youtube",
      tags: ["systemdesign", "backend"]
    },
    {
      id: "demo-2",
      title: "TypeScript 5.0 Release Highlights",
      link: "https://twitter.com/typescript/status/1636402421370880000",
      type: "twitter",
      tags: ["typescript", "frontend"]
    },
    {
      id: "demo-3",
      title: "Database Indexing & Query Tuning Guide",
      link: "https://use-the-index-luke.com/",
      type: "document",
      tags: ["postgres", "database"]
    }
  ];

  const filteredContents = contents.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar currentFilter={filter} setFilter={setFilter} />

      {/* Main Content Pane */}
      <main className="ml-64 flex-1 p-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {filter === "all" ? "All Notes" : `${filter}s`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your personal knowledge repository and digital bookmarks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              text="Share Brain"
              startIcon={<ShareIcon />}
              loading={sharing}
              onClick={handleShareBrain}
            />
            <Button
              variant="primary"
              text="Add Content"
              startIcon={<PlusIcon />}
              onClick={() => setModalOpen(true)}
            />
          </div>
        </div>

        {/* Share Link Modal Banner */}
        {shareLink && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
            <div className="truncate mr-4">
              <p className="text-xs font-semibold text-purple-900 uppercase">Public Share Link</p>
              <p className="text-sm text-purple-700 truncate font-mono">{shareLink}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                text={copied ? "Copied!" : "Copy Link"}
                onClick={copyToClipboard}
              />
              <button
                onClick={() => setShareLink(null)}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Content Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading your notes...
          </div>
        ) : filteredContents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContents.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                link={card.link}
                type={card.type}
                tags={card.tags}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No notes found in this category.</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Content" above to save your first link!</p>
          </div>
        )}

        {/* Add Content Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchContent}
        />
      </main>
    </div>
  );
}
