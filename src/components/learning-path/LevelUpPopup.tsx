import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LevelUpPopupProps {
  levelNumber: number;
  currentTitle: string;
  currentBadge: string;
  onClose: () => void;
}

// Màu sắc pháo hoa đa dạng và rực rỡ hơn
const COLORS = [
  "#ff1744", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3", 
  "#9c27b0", "#e91e63", "#00bcd4", "#ff5722", "#795548",
  "#ffc107", "#8bc34a", "#3f51b5", "#f44336", "#009688"
];

// Hiệu ứng pháo hoa với nhiều lớp và particle phức tạp
function EnhancedFirework({ x, y, color, id, delay = 0 }: any) {
  const particleCount = 25; // Tăng số lượng hạt
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 2 * Math.PI;
    const velocity = Math.random() * 150 + 50;
    const size = Math.random() * 6 + 2;
    
    return {
      id: i,
      angle,
      velocity,
      size,
      initialX: x,
      initialY: y,
      color: Math.random() > 0.3 ? color : COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  });

  return (
    <div className="absolute pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={`${id}-${particle.id}`}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: particle.initialX,
            top: particle.initialY,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ 
            scale: 0,
            opacity: 1,
            x: 0,
            y: 0
          }}
          animate={{
            scale: [0, 1, 0.8, 0],
            opacity: [1, 1, 0.7, 0],
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity + 50, // Thêm trọng lực
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
      
      {/* Tia sáng trung tâm */}
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: 20,
          height: 20,
          left: x - 10,
          top: y - 10,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ 
          scale: [0, 3, 0],
          opacity: [1, 0.8, 0]
        }}
        transition={{ 
          duration: 1.5,
          delay: delay,
          ease: "easeOut"
        }}
      />
    </div>
  );
}

// Confetti cải tiến với nhiều hình dạng
function EnhancedConfetti({ x, y, color, shape }: { 
  x: number; 
  y: number; 
  color: string; 
  shape: 'circle' | 'square' | 'triangle' | 'star';
}) {
  const getShapeStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      position: 'absolute' as const,
    };

    switch (shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%', width: 8, height: 8 };
      case 'square':
        return { ...baseStyle, width: 8, height: 8 };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: `8px solid ${color}`,
          position: 'absolute' as const,
        };
      case 'star':
        return { 
          ...baseStyle, 
          width: 10, 
          height: 10,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <motion.div
      style={{
        ...getShapeStyle(),
        left: x,
        top: y,
      }}
      initial={{ 
        y: -20, 
        opacity: 1, 
        rotate: 0,
        scale: 0
      }}
      animate={{ 
        y: window.innerHeight + 100,
        opacity: [1, 1, 0],
        rotate: 360 * 3,
        scale: [0, 1, 1, 0.5],
        x: x + (Math.random() - 0.5) * 200
      }}
      transition={{ 
        duration: 3 + Math.random() * 2,
        ease: "easeIn",
        delay: Math.random() * 2
      }}
    />
  );
}

// Hiệu ứng sao băng
function ShootingStar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-yellow-300 rounded-full"
      style={{
        boxShadow: '0 0 10px #ffeb3b, 0 0 20px #ffeb3b, 0 0 30px #ffeb3b',
      }}
      initial={{ 
        x: -50, 
        y: Math.random() * 200 + 50,
        opacity: 0
      }}
      animate={{ 
        x: window.innerWidth + 50,
        y: Math.random() * 400 + 100,
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 1.5,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
}

export default function LevelUpPopupRealFireworks({
  levelNumber,
  currentTitle,
  currentBadge,
  onClose,
}: LevelUpPopupProps) {
  const [fireworks, setFireworks] = useState<any[]>([]);
  const [confetti, setConfetti] = useState<any[]>([]);
  const [shootingStars, setShootingStars] = useState<any[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Hiệu ứng pháo hoa nhiều đợt
    const createFireworks = () => {
      const newFireworks = [];
      for (let i = 0; i < 15; i++) { // Tăng số lượng pháo hoa
        newFireworks.push({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight * 0.6) + 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: i * 0.2
        });
      }
      setFireworks(newFireworks);
    };

    // Tạo confetti
    const createConfetti = () => {
      const newConfetti = [];
      const shapes: ('circle' | 'square' | 'triangle' | 'star')[] = ['circle', 'square', 'triangle', 'star'];
      
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * -200,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }
      setConfetti(newConfetti);
    };

    // Tạo sao băng
    const createShootingStars = () => {
      const newStars = [];
      for (let i = 0; i < 5; i++) {
        newStars.push({
          id: Date.now() + i,
          delay: i * 0.5
        });
      }
      setShootingStars(newStars);
    };

    createFireworks();
    createConfetti();
    createShootingStars();

    // Hiển thị nội dung sau hiệu ứng
    setTimeout(() => setShowContent(true), 1000);

    // Tạo thêm pháo hoa sau 3 giây
    setTimeout(() => {
      createFireworks();
    }, 3000);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center" 
      style={{
        background: 'linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e)',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hiệu ứng pháo hoa */}
      {fireworks.map((fw) => (
        <EnhancedFirework
          key={fw.id}
          x={fw.x}
          y={fw.y}
          color={fw.color}
          id={fw.id}
          delay={fw.delay}
        />
      ))}

      {/* Confetti */}
      {confetti.map((conf) => (
        <EnhancedConfetti
          key={conf.id}
          x={conf.x}
          y={conf.y}
          color={conf.color}
          shape={conf.shape}
        />
      ))}

      {/* Sao băng */}
      {shootingStars.map((star) => (
        <ShootingStar key={star.id} delay={star.delay} />
      ))}

      {/* Nội dung popup */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-3xl p-12 text-center max-w-md mx-4 border border-purple-500/30"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(168, 85, 247, 0.4)',
              pointerEvents: 'auto', // Đảm bảo có thể click
              position: 'relative',
              zIndex: 10000
            }}
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -180 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {/* Hiệu ứng ánh sáng quanh popup */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
                pointerEvents: 'none', // Thêm dòng này để không chặn click
                zIndex: -1, 
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ 
                position: 'relative', 
                zIndex: 1 
              }}
            >
              <motion.h1 
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(255, 255, 0, 0.8)',
                    '0 0 30px rgba(255, 192, 203, 0.8)',
                    '0 0 20px rgba(255, 255, 0, 0.8)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                LEVEL UP!
              </motion.h1>
              
              <motion.div
                className="mb-6 flex justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src={currentBadge} 
                  alt="Badge"
                  className="w-24 h-24 object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                  }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-semibold text-white mb-2"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Level {levelNumber}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-purple-200 mb-8"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {currentTitle}
              </motion.p>
              
              <motion.button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl border border-purple-400/50"
                style={{
                  position: 'relative',
                  zIndex: 10, // Tăng z-index cho nút
                  pointerEvents: 'auto' // Đảm bảo nút có thể click
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Tiếp tục học tập! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}