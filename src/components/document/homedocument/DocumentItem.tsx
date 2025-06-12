import { Link } from "react-router-dom";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Metric Item */}
      <Link to="/documents/document-de">
        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            bài 1 sách tổng hợp (trắc nghiệm)
          </h3>

          <div className="mt-2">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
              15 thuật ngữ
            </span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <img
              src="https://i.imgur.com/UYiroysl.jpg"
              alt="Avatar"
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-800 dark:text-white">hainhul6</span>
          </div>
        </div>
      </Link>

      {/* ... thêm các item khác nếu cần ... */}
    </div>
  );
}
