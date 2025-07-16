// src/components/learning-path/LevelSelect.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLevels } from "../../services/LevelApi"; 
import { Book, Star, Trophy, Target, Rocket, Crown, GraduationCap, Medal } from "phosphor-react";

type Level = { 
  levelId: number;
  levelName: string;
  description: string;
};

// Tạo mảng cấu hình cho nhiều cấp độ có thể có
const levelConfigOptions = [
  { 
    color: "from-green-400 to-green-600", 
    icon: <Book size={32} weight="fill" className="text-white" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    color: "from-blue-400 to-blue-600", 
    icon: <Target size={32} weight="fill" className="text-white" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    color: "from-purple-400 to-purple-600", 
    icon: <Star size={32} weight="fill" className="text-white" />,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    color: "from-orange-400 to-orange-600", 
    icon: <Trophy size={32} weight="fill" className="text-white" />,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    color: "from-red-400 to-red-600", 
    icon: <Rocket size={32} weight="fill" className="text-white" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    color: "from-indigo-400 to-indigo-600", 
    icon: <Crown size={32} weight="fill" className="text-white" />,
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  { 
    color: "from-pink-400 to-pink-600", 
    icon: <GraduationCap size={32} weight="fill" className="text-white" />,
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  { 
    color: "from-yellow-400 to-yellow-600", 
    icon: <Medal size={32} weight="fill" className="text-white" />,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  }
];

export default function LevelSelect() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Hàm lấy cấu hình cho từng level dựa trên index
  const getLevelConfig = (index: number) => {
    return levelConfigOptions[index % levelConfigOptions.length];
  };

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
    navigate(`/learn/lesson?levelId=${levelId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <div className="animate-ping absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
        </div>
        <p className="mt-6 text-gray-600 text-lg animate-pulse">Đang tải dữ liệu cấp độ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <div className="text-red-500 text-xl font-semibold">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Nếu không có dữ liệu
  if (levels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-gray-600 text-xl font-semibold text-center">
            Chưa có cấp độ nào được thiết lập
          </div>
          <p className="text-gray-500 text-center mt-2">Vui lòng liên hệ quản trị viên</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Chọn Cấp Độ 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {" "}TOPIK
          </span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Bắt đầu hành trình học tiếng Hàn của bạn. Chọn cấp độ phù hợp để có trải nghiệm học tập tốt nhất.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Có {levels.length} cấp độ để bạn lựa chọn
        </div>
      </div>

      {/* Levels Grid */}
      <div className="max-w-6xl mx-auto">
        <div className={`grid gap-6 ${
          levels.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          levels.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          levels.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
          levels.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {levels.map((level, index) => {
            const config = getLevelConfig(index);
            
            return (
              <div
                key={level.levelId}
                className={`group relative overflow-hidden rounded-3xl shadow-lg border-2 ${config.borderColor} ${config.bgColor} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <button
                  onClick={() => handleClick(level.levelId, level.levelName)}
                  className="relative w-full p-8 text-left focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-yellow-400 group-hover:to-yellow-200 mb-6 transition-all duration-300">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {config.icon}
                    </div>
                  </div>
                  
                  {/* Level Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-2 transition-colors duration-300">
                      {level.levelName}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300 mb-4">
                      {level.description || `Học tiếng Hàn cấp độ ${level.levelId}`}
                    </p>
                    
                    {/* Progress indicator (có thể được thay thế bằng dữ liệu thực)
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 group-hover:bg-white/20 transition-colors duration-300">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-200 transition-colors duration-300">
                        {Math.floor(Math.random() * 80) + 10}%
                      </span>
                    </div> */}
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
     {/* Stats Section - Cập nhật động
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Thống Kê Học Tập</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Book size={24} weight="fill" className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {levels.length} Cấp Độ
              </h3>
              <p className="text-gray-600">Từ cơ bản đến nâng cao</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={24} weight="fill" className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Bài Học Đa Dạng</h3>
              <p className="text-gray-600">Nội dung phong phú</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} weight="fill" className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chứng Chỉ</h3>
              <p className="text-gray-600">Được công nhận quốc tế</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
