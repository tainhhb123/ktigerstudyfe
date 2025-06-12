import React, { useState, useEffect } from "react";

const initialVocabularies = [
    { id: 1, term: "대인 관계", meaning: "quan hệ đối nhân xử thế (ĐỐI NHÂN QUAN HỆ)" },
    { id: 2, term: "마음이 넓다", meaning: "Tấm lòng rộng lượng" },
    { id: 3, term: "친절하다", meaning: "thân thiện, tử tế (Thân Thiết)" },
    { id: 4, term: "성격이 좋다", meaning: "tính cách tốt" },
    { id: 5, term: "화가 나다", meaning: "tức giận" },
];

const FlashCardsFull: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const handleNext = () => {
        if (currentIndex < initialVocabularies.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Reset mặt trước khi chuyển flashcard
    useEffect(() => {
        setFlipped(false);
    }, [currentIndex]);

    const currentCard = initialVocabularies[currentIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-12">
            {/* Flashcard */}
            <div
                className="relative w-full max-w-2xl h-[400px] mb-6 cursor-pointer"
                style={{ perspective: "1300px" }}
                onClick={() => setFlipped((f) => !f)}
            >
                <div
                    className="w-full h-full transition-transform duration-500 relative"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* Mặt trước */}
                    <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-5xl font-semibold p-6"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                        }}
                    >
                        <div className="px-4 text-center">{currentCard.term}</div>
                    </div>
                    {/* Mặt sau */}
                    <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center text-gray-800 text-4xl font-bold p-6"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <span className="px-4 text-center">{currentCard.meaning}</span>
                    </div>
                </div>
            </div>


            {/* Điều khiển chuyển thẻ */}
            <div className="flex items-center justify-center space-x-8 mb-2">
                <button
                    className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    &#8592;
                </button>
                <span className="text-gray-700 text-lg font-semibold select-none">
                    {currentIndex + 1} / {initialVocabularies.length}
                </span>
                <button
                    className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 transition disabled:opacity-50"
                    onClick={handleNext}
                    disabled={currentIndex === initialVocabularies.length - 1}
                >
                    &#8594;
                </button>
            </div>

            {/* Nút yêu thích */}
            <div className="flex justify-end w-full max-w-2xl mt-2 px-4">
                <button className="p-2 rounded hover:bg-gray-200 text-red-500 transition">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
               2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
               C13.09 3.81 14.76 3 16.5 3 
               19.58 3 22 5.42 22 8.5 
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FlashCardsFull;
