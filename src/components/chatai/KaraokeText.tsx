import React from 'react';

interface KaraokeTextProps {
  text: string;
  words: string[];
  currentWordIndex: number;
  isSpeaking: boolean;
  className?: string;
}

export const KaraokeText: React.FC<KaraokeTextProps> = ({
  text,
  words,
  currentWordIndex,
  isSpeaking,
  className = ''
}) => {
  // Nếu không đang nói hoặc không có từ => hiển thị text đã lọc icon
  if (!isSpeaking || words.length === 0) {
    const cleanText = text.replace(/\p{Extended_Pictographic}/gu, '');
    return <span className={className}>{cleanText}</span>;
  }

  // Đang nói => highlight theo currentWordIndex từ hook TTS
  return (
    <span className={className}>
      {words.map((word, index) => {
        // Loại bỏ icon/emoji
        const cleanedWord = word.replace(/\p{Extended_Pictographic}/gu, '');

        // Đã đọc => xanh nhạt, đang đọc => xanh đậm, chưa đọc => bình thường
        let colorClass = '';
        if (index < currentWordIndex) {
          colorClass = 'text-green-400'; // đã đọc
        } else if (index === currentWordIndex) {
          colorClass = 'text-green-700 font-bold'; // đang đọc
        }

        return (
          <React.Fragment key={index}>
            <span className={colorClass}>{cleanedWord}</span>
            {index < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </span>
  );
};
