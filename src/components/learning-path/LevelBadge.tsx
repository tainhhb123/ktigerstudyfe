//src/components/learning-path/LevelBadge.tsx
import { useEffect, useRef, useState } from "react";


export default function LevelBadge({ level }: { level: number }) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (!badgeRef.current) return;
      const rect = badgeRef.current.getBoundingClientRect();
      // Nếu badge vào view thì active
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={badgeRef}
      className={`transition-colors duration-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg
      ${active ? "bg-blue-500" : "bg-gray-300"}
      `}
      style={{
        // Có thể thêm animation khác ở đây nếu muốn
      }}
    >
      {level}
    </div>
  );
}
