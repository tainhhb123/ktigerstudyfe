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
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const userId = Number(localStorage.getItem("userId"));
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
        const storedUserName = localStorage.getItem("fullName");
        setCurrentUserName(storedUserName);
        setTimeout(() => setAnimateItems(true), 500);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "👑";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "🏅";
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600";
      case 1:
        return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500";
      case 2:
        return "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600";
      default:
        return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
    }
  };

  const getXPBarWidth = (xp: number) => {
    const maxXP = Math.max(...leaderboard.map((u) => u.totalXP));
    return Math.max((xp / maxXP) * 100, 10);
  };

  /**
   * Sắp xếp để top 1,2,3 lần lượt là [1,0,2]
   * (Top 2 hiển thị giữa, top 1 hiển thị bên trái, top 3 hiển thị bên phải)
   */
  const getTopThreeArranged = (): LeaderboardItemWithIndex[] => {
    const withIndex = leaderboard.map((item, i) => ({ ...item, originalIndex: i }));
    if (withIndex.length < 3) return withIndex;
    return [
      { ...withIndex[1], originalIndex: 1 },
      { ...withIndex[0], originalIndex: 0 },
      { ...withIndex[2], originalIndex: 2 },
      ...withIndex.slice(3),
    ];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/default-badge.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-yellow-400 rounded-full animate-spin border-t-transparent mb-6"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🏆 Đang tải bảng xếp hạng</h2>
          <p className="text-xl text-gray-600">Chuẩn bị những chiến binh học tập...</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Chưa có dữ liệu</h2>
          <p className="text-xl text-gray-600">Hãy bắt đầu học để trở thành người đầu tiên!</p>
        </div>
      </div>
    );
  }

  // Sắp xếp danh sách
  const arrangedList = getTopThreeArranged();
  
  // Lấy top 3
  const top3 = arrangedList.slice(0, 3);
  
  // Lấy 4,5
  const top4And5 = arrangedList.slice(3, 5);
  
  // Tìm vị trí user
  const currentUserIndex = currentUserName 
    ? arrangedList.findIndex(item => item.fullName === currentUserName) 
    : -1;
  const currentUser = currentUserIndex !== -1 ? arrangedList[currentUserIndex] : null;
  
  // Kiểm tra xem user có nằm trong top 5 không
  const isUserInTop5 = currentUserIndex >= 0 && currentUserIndex < 5;
  
  // Chỉ hiển thị user riêng nếu họ không nằm trong top 5
  const showCurrentUserSeparately = currentUser && !isUserInTop5;

  return (
    <>
      <style>
        {`
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Tiêu đề */}
            <div className="text-center mb-16">
              <div className="inline-block mb-14">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">🏆</span>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl font-black mb-4">
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                  BẢNG XẾP HẠNG
                </span>
              </h1>
              <p className="text-2xl text-gray-700 mb-8">🌟 Những Chiến Binh Học Tập Xuất Sắc 🌟</p>
              <div className="flex justify-center space-x-8 text-lg text-gray-600">
                <span>🔥 {leaderboard.length} Học viên</span>
                <span>💎 {leaderboard[0]?.totalXP?.toLocaleString() || 0} XP cao nhất</span>
                <span>🚀 Cạnh tranh khốc liệt</span>
              </div>
            </div>

            {/* Top 3 Card */}
            {top3.length === 3 && (
              <div className="flex justify-center items-end mb-16 space-x-8">
                {top3.map((user, displayIndex) => {
                  const rank = user.originalIndex;
                  const delays = [0, 200, 400];
                  const isCurrentUser = user.fullName === currentUserName;
                  
                  return (
                    <div
                      key={rank}
                      className={`${
                        animateItems ? "animate-slide-up" : "opacity-0 translate-y-20"
                      } flex-1 max-w-sm`}
                      style={{ animationDelay: `${delays[displayIndex]}ms` }}
                    >
                      <div
                        className={`
                          ${getRankBg(rank)} 
                          rounded-3xl p-6 text-white shadow-2xl transform 
                          transition-all duration-500 relative overflow-hidden group
                          ${isCurrentUser ? "ring-4 ring-yellow-300 ring-offset-4 ring-offset-white" : ""}
                        `}
                      >
                        {isCurrentUser && (
                          <div className="absolute top-2 right-2 bg-yellow-300 text-black font-bold rounded-full px-3 py-1 text-xs">
                            Bạn
                          </div>
                        )}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-3xl">{getRankIcon(rank)}</span>
                          </div>
                        </div>
                        <div className="text-center mt-8 mb-4 mt-16">
                          <div className="text-4xl font-black opacity-90">#{rank + 1}</div>
                        </div>

                        <div className="flex justify-center mb-3">
                          <img
                            src={user.currentBadge}
                            alt="badge"
                            className="w-16 h-16 rounded-full border-4 border-white shadow-2xl"
                            onError={handleImageError}
                          />
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold px-4 break-words">{user.fullName}</h3>
                          <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 mx-auto max-w-xs break-words text-xs font-semibold">
                            {user.currentTitle}
                          </div>
                        </div>

                        {/* Hiển thị XP cho top 1, 2, 3 */}
                        <div className="mt-5 bg-white bg-opacity-20 rounded-xl p-3 text-center">
                          <div className="text-3xl font-extrabold text-yellow-300">
                            {user.totalXP.toLocaleString()} XP
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2 mt-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                              style={{ width: `${getXPBarWidth(user.totalXP)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Danh sách chi tiết - Chỉ hiển thị hạng 4 & 5 */}
            {top4And5.length > 0 && (
              <div className="bg-gray-100 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden mb-1">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                  <h3 className="text-3xl font-bold text-white flex items-center">
                    <span className="mr-4">📊</span>
                    Danh sách chi tiết
                  </h3>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {top4And5.map((user, index) => {
                      const isCurrentUser = user.fullName === currentUserName;
                      return (
                        <div
                          key={user.originalIndex}
                          className={`
                            ${animateItems ? "animate-slide-up" : "opacity-0 translate-y-20"}
                            bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 
                            hover:bg-opacity-30 transition-all duration-300
                            ${isCurrentUser ? "ring-2 ring-yellow-400 shadow-lg transform scale-105 z-10" : ""}
                          `}
                          style={{ animationDelay: `${(index + 3) * 150}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <div className="flex-shrink-0">
                                <div
                                  className={`
                                    w-14 h-14 
                                    ${isCurrentUser
                                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                                    } 
                                    rounded-full flex items-center justify-center text-white font-bold text-xl
                                    shadow-lg
                                  `}
                                >
                                  #{user.originalIndex + 1}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <img
                                  src={user.currentBadge}
                                  alt="badge"
                                  className={`
                                    w-16 h-16 rounded-full border-4 
                                    ${isCurrentUser ? "border-yellow-300" : "border-white"}
                                    shadow-lg
                                  `}
                                  onError={handleImageError}
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-xl font-bold text-gray-900 mb-1 break-words">
                                  {user.fullName}
                                  {isCurrentUser && (
                                    <span className="ml-2 bg-yellow-300 text-black font-bold rounded-full px-3 py-1 text-xs">
                                      Bạn
                                    </span>
                                  )}
                                </h4>
                                <div className="inline-block bg-purple-500 bg-opacity-80 rounded-full px-3 py-1 text-sm font-semibold text-white max-w-xs break-words">
                                  {user.currentTitle}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-black text-yellow-400 mb-1">
                                {user.totalXP.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">XP</div>
                              <div className="w-32 bg-gray-300 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`
                                    h-full bg-gradient-to-r
                                    ${isCurrentUser ? "from-yellow-400 to-yellow-600" : "from-blue-400 to-purple-500"}
                                  `}
                                  style={{ width: `${getXPBarWidth(user.totalXP)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Vị trí của user hiện tại (ngoài top 5) */}
            {showCurrentUserSeparately && (
              <div className="bg-gray-100 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden mb-16">
                <div className="p-8">
                  <div
                    className={`
                      ${animateItems ? "animate-slide-up" : "opacity-0 translate-y-20"}
                      bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl 
                      p-6 hover:bg-opacity-30 transition-all duration-300 
                      ring-2 ring-yellow-400
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            #{currentUser.originalIndex + 1}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <img
                            src={currentUser.currentBadge}
                            alt="badge"
                            className="w-16 h-16 rounded-full border-4 border-yellow-300 shadow-lg"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xl font-bold text-gray-900 mb-1 break-words">
                            {currentUser.fullName}
                            <span className="ml-2 bg-yellow-300 text-black font-bold rounded-full px-3 py-1 text-xs">
                              Bạn
                            </span>
                          </h4>
                          <div className="inline-block bg-purple-500 bg-opacity-80 rounded-full px-3 py-1 text-sm font-semibold text-white max-w-xs break-words">
                            {currentUser.currentTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-yellow-400 mb-1">
                          {currentUser.totalXP.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">XP</div>
                        <div className="w-32 bg-gray-300 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                            style={{ width: `${getXPBarWidth(currentUser.totalXP)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debug info - có thể xóa sau khi giải quyết vấn đề */}
            {userId && !currentUserName && (
              <div className="text-center mb-8 p-4 border border-red-400 rounded">
                <p>Đã tìm thấy userId={userId} trong localStorage, nhưng không có fullName để tìm trong bảng xếp hạng.</p>
                <p>Vui lòng đảm bảo lưu fullName vào localStorage khi đăng nhập.</p>
              </div>
            )}

            {/* Lời chúc mừng cuối cùng */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 inline-block shadow-2xl">
                <h3 className="text-2xl font-bold text-white">🎉 Chúc mừng tất cả các chiến binh! 🎉</h3>
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