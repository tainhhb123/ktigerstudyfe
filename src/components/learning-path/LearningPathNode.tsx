// src/components/learning-path/LearningPathNode.tsx
import React from "react";

export interface LearningPathNodeProps {
  icon?: React.ReactNode;
  type: string;
  onClick?: () => void; // thêm dòng này
}

export default function LearningPathNode({ icon, onClick }: LearningPathNodeProps) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg bg-white
        transition hover:scale-110 active:scale-95 focus:outline-none"
      style={{ cursor: "pointer" }}
      tabIndex={0}
    >
      {icon}
    </button>
  );
}
