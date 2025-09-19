import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Doc = {
  listId: number;
  title: string;
  description: string;
  type: string;
  fullName: string;
  avatarImage?: string;
};

export default function EcommerceMetrics({ type }: { type: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/document-lists/type/${encodeURIComponent(
        type
      )}?isPublic=0`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: Doc[]) => setDocs(data))
      .catch((err) =>
        console.error("Error fetching documents by type:", err)
      );
  }, [type]);

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {docs.map((doc) => (
        <Link
          key={doc.listId}
          to={`/documents/view/${doc.listId}`}
        >
          <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {doc.title}
            </h3>
            <div className="mt-2">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                {/* Giả sử bạn có itemsCount */}
                {/* {doc.itemsCount} thuật ngữ */}
                {/* Nếu không có count, xoá phần này hoặc thay bằng description */}
                {doc.description.slice(0, 20)}…
              </span>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <img
                src={
                  doc.avatarImage ||
                  "https://via.placeholder.com/24?text=?"
                }
                alt="Avatar"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-800 dark:text-white">
                {doc.fullName}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
