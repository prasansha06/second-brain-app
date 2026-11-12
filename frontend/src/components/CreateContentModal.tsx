import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateContentModal({ open, onClose, onSuccess }: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<"youtube" | "twitter" | "document" | "link">("youtube");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleAddContent = async () => {
    setError(null);
    if (!title.trim() || !link.trim()) {
      setError("Title and link are required.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          title,
          link,
          type,
          tags
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setLink("");
      setTagsInput("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save content. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Add New Content</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="space-y-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <Input
              placeholder="e.g. System Design Interview Primer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Content Link / URL
            </label>
            <Input
              placeholder="https://youtube.com/watch?v=... or https://x.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["youtube", "twitter", "document", "link"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize border transition ${
                    type === t
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <Input
              placeholder="engineering, architecture, react"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" text="Cancel" onClick={onClose} />
          <Button
            variant="primary"
            text="Save to Brain"
            loading={loading}
            onClick={handleAddContent}
          />
        </div>
      </div>
    </div>
  );
}
