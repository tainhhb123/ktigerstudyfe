// src/components/document/flashcard/VocabularyList.tsx
import React from "react";

export interface Vocabulary {
  id: number;
  term: string;
  meaning: string;
}

interface VocabularyListProps {
  vocabularies: Vocabulary[];
}

export default function VocabularyList({ vocabularies }: VocabularyListProps) {
  return (
    <div>
      <h2 className="text-gray-800 text-lg font-semibold mb-3">
        학습하지 않음 ({vocabularies.length})
      </h2>
      <div className="space-y-4">
        {vocabularies.map((v) => (
          <div
            key={v.id}
            className="flex items-center bg-white p-4 rounded-xl shadow-md border border-gray-200"
          >
            <div className="w-1/3 text-gray-900 text-lg font-semibold pr-4 border-r border-gray-200">
              {v.term}
            </div>
            <div className="w-2/3 text-gray-700 text-base pl-4 flex-grow">
              {v.meaning}
            </div>
            <div className="flex-shrink-0 ml-4 flex items-center">
              <button
                className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 transition-colors duration-200"
                aria-label="Mark as favorite"
              >
                <span role="img" aria-label="star">
                  ★
                </span>
              </button>
              <button
                className="ml-3 p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors duration-200"
                aria-label="Play sound"
              >
                <span role="img" aria-label="sound">
                  🔊
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
