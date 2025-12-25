import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, TrendingUp, X } from "lucide-react";

interface SimpleRewardPopupProps {
  xpGained: number;
  isLevelUp?: boolean;
  levelNumber?: number;
  levelTitle?: string;
  levelBadge?: string;
  onClose: () => void;
}

export default function SimpleRewardPopup({
  xpGained,
  isLevelUp = false,
  levelNumber,
  levelTitle,
  levelBadge,
  onClose
}: SimpleRewardPopupProps) {
  // Auto close sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Overlay tối nhẹ */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Popup nhỏ gọn */}
        <motion.div
          className="relative rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-4"
          style={{ backgroundColor: '#FFFFFF' }}
          initial={{ scale: 0.8, y: -50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -50, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition z-10"
            style={{ color: '#666666' }}
          >
            <X className="w-5 h-5" />
          </button>

          {isLevelUp ? (
            // LEVEL UP POPUP
            <div className="p-6">
              {/* Icon và tiêu đề */}
              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#FFE8DC',
                    border: '3px solid #FF6B35'
                  }}
                >
                  <Award className="w-10 h-10" style={{ color: '#FF6B35' }} />
                </div>
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-center mb-2"
                style={{ color: '#FF6B35' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🎉 Chúc mừng!
              </motion.h2>

              <motion.p
                className="text-center mb-4"
                style={{ color: '#666666' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Bạn đã lên cấp
              </motion.p>

              {/* Level Badge */}
              {levelBadge && (
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <img 
                    src={levelBadge} 
                    alt={`Level ${levelNumber}`}
                    className="w-24 h-24 object-contain"
                  />
                </motion.div>
              )}

              {/* Level Info */}
              <motion.div
                className="text-center p-4 rounded-xl mb-4"
                style={{ backgroundColor: '#FFF8F0' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-4xl font-bold mb-1" style={{ color: '#FF6B35' }}>
                  Level {levelNumber}
                </div>
                <div className="text-sm font-medium" style={{ color: '#666666' }}>
                  {levelTitle}
                </div>
              </motion.div>

              {/* XP Gained */}
              <motion.div
                className="flex items-center justify-center gap-2 p-3 rounded-lg"
                style={{ backgroundColor: '#E8F5E9' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Star className="w-5 h-5" style={{ color: '#4CAF50' }} />
                <span className="font-bold" style={{ color: '#4CAF50' }}>
                  +{xpGained} XP
                </span>
              </motion.div>
            </div>
          ) : (
            // XP GAINED POPUP
            <div className="p-6">
              {/* Icon */}
              <motion.div
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: xpGained > 0 ? '#E8F5E9' : '#FFF3E0',
                    border: `2px solid ${xpGained > 0 ? '#4CAF50' : '#FF9800'}`
                  }}
                >
                  {xpGained > 0 ? (
                    <TrendingUp className="w-8 h-8" style={{ color: '#4CAF50' }} />
                  ) : (
                    <Award className="w-8 h-8" style={{ color: '#FF9800' }} />
                  )}
                </div>
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-center mb-2"
                style={{ color: '#333333' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {xpGained > 0 ? 'Bài tập hoàn thành! ✅' : 'Hoàn thành ôn tập! 📚'}
              </motion.h3>

              {/* XP Display */}
              <motion.div
                className="text-center p-4 rounded-xl"
                style={{ 
                  backgroundColor: xpGained > 0 ? '#FFF8F0' : '#FFFBF0', 
                  border: `2px solid ${xpGained > 0 ? '#FF6B35' : '#FF9800'}` 
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {xpGained > 0 ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="w-6 h-6" style={{ color: '#FF6B35' }} />
                      <span className="text-3xl font-bold" style={{ color: '#FF6B35' }}>
                        +{xpGained}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: '#666666' }}>
                      Điểm kinh nghiệm
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-2xl">✨</span>
                      <span className="text-xl font-bold" style={{ color: '#FF9800' }}>
                        Đã hoàn thành trước đó
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: '#666666' }}>
                      Bạn đã nhận XP cho bài này rồi
                    </div>
                  </>
                )}
              </motion.div>

              <motion.p
                className="text-center text-sm mt-3"
                style={{ color: '#999999' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {xpGained > 0 ? 'Tiếp tục phát huy! 💪' : 'Tiếp tục ôn luyện! 📖'}
              </motion.p>
            </div>
          )}

          {/* Progress bar tự đóng */}
          <motion.div
            className="h-1"
            style={{ backgroundColor: '#E0E0E0' }}
            initial={{ width: '100%' }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: isLevelUp ? '#FF6B35' : '#4CAF50' }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
