import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../services/LeadBoardApi";

interface LeaderboardItem {
  fullName: string;
  currentTitle: string;
  currentBadge: string;
  totalXP: number;
}

type LeaderboardItemWithIndex = LeaderboardItem & { originalIndex: number };

function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateItems, setAnimateItems] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard();
        console.log("📊 Leaderboard:", data);
        setLeaderboard(data);
        setTimeout(() => setAnimateItems(true), 500);
        setTimeout(() => setShowConfetti(true), 1000);
        setTimeout(() => setShowConfetti(false), 3000);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "👑";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600";
      case 1: return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500";
      case 2: return "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600";
      default: return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
    }
  };

  // Bỏ chiều cao cố định
  const getHeightClass = () => "";

  const getXPBarWidth = (xp: number) => {
    const maxXP = Math.max(...leaderboard.map(u => u.totalXP));
    return Math.max((xp / maxXP) * 100, 10);
  };

  const getTopThreeArranged = (): LeaderboardItemWithIndex[] => {
    const withIndex = leaderboard.map((item, i) => ({ ...item, originalIndex: i }));
    if (withIndex.length < 3) return withIndex;
    return [
      { ...withIndex[1], originalIndex: 1 },
      { ...withIndex[0], originalIndex: 0 },
      { ...withIndex[2], originalIndex: 2 },
      ...withIndex.slice(3)
    ];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/default-badge.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-yellow-400 rounded-full animate-spin border-t-transparent mb-6"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-pink-400 rounded-full animate-ping border-t-transparent"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">🏆 Đang tải bảng xếp hạng</h2>
          <p className="text-xl text-gray-300">Chuẩn bị những chiến binh học tập...</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-4">Chưa có dữ liệu</h2>
          <p className="text-xl text-gray-300">Hãy bắt đầu học để trở thành người đầu tiên!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes confetti {
            0% { transform: translateY(-100vh) rotate(0); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
            50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.8); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-confetti { animation: confetti 3s linear infinite; width: 10px; height: 10px; }
          .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
          .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; }
          .animate-glow { animation: glow 2s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .hover\\:scale-102:hover { transform: scale(1.02); }
          .group:hover .group-hover\\:animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .group:hover .group-hover\\:opacity-20 { opacity: 0.2; }
          .group:hover .group-hover\\:translate-x-full { transform: translateX(100%); }
          .hover\\:rotate-12:hover { transform: rotate(12deg); }
          .hover\\:rotate-1:hover { transform: rotate(1deg); }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              {['⭐', '🌟', '✨', '💎', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-2xl">👑</span>
                  </div>
                </div>
              </div>
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4 animate-glow">
                BẢNG XẾP HẠNG
              </h1>
              <p className="text-2xl text-gray-300 mb-8">🌟 Những Chiến Binh Học Tập Xuất Sắc 🌟</p>
              <div className="flex justify-center space-x-8 text-lg text-gray-400">
                <span>🔥 {leaderboard.length} Học viên</span>
                <span>💎 {leaderboard[0]?.totalXP?.toLocaleString() || 0} XP cao nhất</span>
                <span>🚀 Cạnh tranh khốc liệt</span>
              </div>
            </div>

            {leaderboard.length >= 3 && (
              <div className="flex justify-center items-end mb-16 space-x-8">
                {getTopThreeArranged().slice(0,3).map((user, displayIndex) => {
                  const actualRank = user.originalIndex; 
                  const delays = [600, 200, 800];
                  return (
                    <div
                      key={actualRank}
                      className={`${animateItems ? 'animate-slide-up' : 'opacity-0 translate-y-20'} flex-1 max-w-sm`}
                      style={{ animationDelay: `${delays[displayIndex]}ms` }}
                    >
                      <div
                        className={` ${getRankBg(actualRank)} ${getHeightClass()} rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 relative overflow-hidden group`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-3xl">{getRankIcon(actualRank)}</span>
                          </div>
                        </div>

                        <div className="text-center mt-8 mb-4">
                          <div className="text-4xl font-black opacity-90">#{actualRank + 1}</div>
                        </div>

                        <div className="flex justify-center mb-3">
                          <div className="relative group-hover:animate-spin-slow">
                            <img
                              src={user.currentBadge}
                              alt="badge"
                              className="w-16 h-16 rounded-full border-4 border-white shadow-2xl"
                              onError={handleImageError}
                            />
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold px-4 break-words">
                            {user.fullName}
                          </h3>
                          <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 mx-auto max-w-xs break-words text-xs font-semibold">
                            {user.currentTitle}
                          </div>
                          {/* <div className="bg-white bg-opacity-20 rounded-2xl p-3 backdrop-blur-sm mt-1">
                            <div className="text-xl font-black mb-1">{user.totalXP.toLocaleString()}</div>
                            <div className="text-xs opacity-90 mb-2">Experience Points</div>
                            <div className="bg-black bg-opacity-30 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse"
                                style={{ width: `${getXPBarWidth(user.totalXP)}%` }}
                              />
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {leaderboard.length < 3 && leaderboard.length > 0 && (
              <div className="flex justify-center mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {leaderboard.map((user, index) => (
                    <div
                      key={index}
                      className={`${animateItems ? 'animate-slide-up' : 'opacity-0 translate-y-20'} max-w-sm`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className={`${getRankBg(index)} ${getHeightClass()} rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group`}>
                        <div className="absolute -top-30 left-1/2 transform -translate-x-1/2">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-3xl">{getRankIcon(index)}</span>
                          </div>
                        </div>

                        <div className="text-center mt-8">
                          <div className="text-3xl font-black mb-4">#{index + 1}</div>
                          <img
                            src={user.currentBadge}
                            alt="badge"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-2xl mx-auto mb-4"
                            onError={handleImageError}
                          />
                          <h3 className="text-xl font-bold mb-2 break-words">{user.fullName}</h3>
                          <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 text-sm font-semibold mb-4 max-w-xs mx-auto break-words">
                            {user.currentTitle}
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-xl p-3">
                            <div className="text-2xl font-black">{user.totalXP.toLocaleString()}</div>
                            <div className="text-xs opacity-90">XP</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leaderboard.length > 3 && (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                  <h3 className="text-3xl font-bold text-white flex items-center">
                    <span className="mr-4">📊</span>
                    Bảng Xếp Hạng Chi Tiết
                  </h3>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {getTopThreeArranged().slice(3).map((user, index) => (
                      <div
                        key={user.originalIndex}
                        className={`${animateItems ? 'animate-slide-in-right' : 'opacity-0 translate-x-20'} bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-30 transition-all duration-300 transform hover:scale-102 hover:shadow-xl`}
                        style={{ animationDelay: `${(index + 3) * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                #{user.originalIndex + 1}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <img
                                src={user.currentBadge}
                                alt="badge"
                                className="w-16 h-16 rounded-full border-4 border-white shadow-lg hover:rotate-12 transition-transform duration-300"
                                onError={handleImageError}
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-xl font-bold text-white mb-1 break-words">{user.fullName}</h4>
                              <div className="inline-block bg-purple-500 bg-opacity-80 rounded-full px-3 py-1 text-sm font-semibold text-white max-w-xs break-words">
                                {user.currentTitle}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-yellow-400 mb-1">
                              {user.totalXP.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-300 mb-2">XP</div>
                            <div className="w-32 bg-gray-700 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"
                                style={{ width: `${getXPBarWidth(user.totalXP)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 inline-block shadow-2xl animate-pulse">
                <h3 className="text-2xl font-bold text-white">
                  🎉 Chúc mừng tất cả các chiến binh! 🎉
                </h3>
                <p className="text-lg text-white mt-2">
                  Mỗi người đều là một nhà vô địch trong hành trình học tập của riêng mình.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaderBoard;