//src/components/learning-path/RoadmapHeader.tsx
export default function RoadmapHeader({ section, title, onGuide }: {
  section: string, title: string, onGuide?: () => void
}) {
  return (
    <div className="w-full max-w-xl flex items-center justify-between bg-blue-400 rounded-xl px-6 py-4 mb-8 shadow">
      <div>
        <span className="text-xs text-white font-bold">{section}</span>
        <div className="text-lg text-white font-semibold">{title}</div>
      </div>
      <button
        onClick={onGuide}
        className="bg-white text-blue-500 px-4 py-2 rounded-lg font-bold shadow"
      >
        Hướng dẫn
      </button>
    </div>
  );
}
