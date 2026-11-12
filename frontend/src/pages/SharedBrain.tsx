import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LogoIcon } from "../icons/LogoIcon";
import { Card, CardProps } from "../components/Card";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function SharedBrain() {
  const { shareLink } = useParams();
  const [username, setUsername] = useState<string>("");
  const [contents, setContents] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
        setUsername(response.data.username || "Anonymous");
        const items = response.data.content || [];
        setContents(
          items.map((item: any) => ({
            id: item._id,
            title: item.title,
            link: item.link,
            type: item.type,
            tags: item.tags || []
          }))
        );
      } catch (err: any) {
        setError(err?.response?.data?.message || "Shared brain not found or link has expired.");
      } finally {
        setLoading(false);
      }
    };

    if (shareLink) {
      fetchSharedContent();
    }
  }, [shareLink]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Brainly</h1>
            {username && (
              <p className="text-xs text-gray-500">
                Viewing public brain shared by <span className="font-semibold text-purple-600">@{username}</span>
              </p>
            )}
          </div>
        </div>

        <Link
          to="/signup"
          className="text-xs font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Create Your Brainly
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading shared knowledge...</div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto">
            <p className="text-red-600 font-semibold mb-2">Link Expired or Not Found</p>
            <p className="text-xs text-gray-500 mb-6">{error}</p>
            <Link
              to="/signup"
              className="text-xs font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Brainly Home
            </Link>
          </div>
        ) : contents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contents.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                link={card.link}
                type={card.type}
                tags={card.tags}
                readOnly={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            This shared brain does not contain any public notes yet.
          </div>
        )}
      </main>
    </div>
  );
}
