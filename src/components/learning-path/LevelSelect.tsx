// src/components/learning-path/LevelSelect.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLevels } from "../../services/LevelApi"; 

type Level = {
  levelId: number;
  levelName: string;
  description: string;
};

export default function LevelSelect() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLevels()
      .then((data) => {
        setLevels(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không lấy được dữ liệu cấp độ.");
        setLoading(false);
      });
  }, []);

  const handleClick = (levelId: number, levelName: string) => {
    navigate(`/learn/lesson?levelId=${levelId}`); // ✅ Đúng

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Chọn trình độ học</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {levels.map((level) => (
            <button
              key={level.levelId}
              onClick={() => handleClick(level.levelId, level.levelName)}
              className="w-60 h-32 text-2xl font-bold rounded-2xl shadow-lg bg-blue-500 hover:bg-blue-700 text-white transition-all duration-200 flex items-center justify-center"
            >
              {level.levelName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
