import React, { useState, useEffect } from "react";
import FlashcardPlayer from "../../../components/document/flashcard/FlashcardPlayer";
import VocabularyList from "../../../components/document/flashcard/VocabularyList";
import AuthorCard from "../../../components/document/flashcard/AuthorCard";
import FunctionBar from "../../../components/document/flashcard/FunctionBar";

// Dummy data (Trong thực tế sẽ fetch từ API)
const initialVocabularies = [
    { id: 1, term: "대인 관계", meaning: "quan hệ đối nhân xử thế(ĐỐI NHÂN QUAN HỆ)" },
    { id: 2, term: "마음이 넓다", meaning: "Tấm lòng rộng lượng" },
    { id: 3, term: "친절하다", meaning: "thân thiện, tử tế(Thân Thiết)" },
    { id: 4, term: "성격이 좋다", meaning: "tính cách tốt" },
    { id: 5, term: "화가 나다", meaning: "tức giận" },
];

const author = {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Maiminh2010",
    role: "선생님",
    createdAt: "11달 전 생성함",
};

// Hàm shuffle danh sách
const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export default function FlashCard() {
    const [vocabularies, setVocabularies] = useState(initialVocabularies);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const currentFlashcard = vocabularies[currentCardIndex];

    const goToNextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % vocabularies.length);
    };

    const goToPreviousCard = () => {
        setCurrentCardIndex((prevIndex) =>
            prevIndex === 0 ? vocabularies.length - 1 : prevIndex - 1
        );
    };

    const handleShuffle = () => {
        const shuffled = shuffleArray(vocabularies);
        setVocabularies(shuffled);
        setCurrentCardIndex(0); // reset về thẻ đầu tiên sau khi shuffle
    };

    useEffect(() => {
        // Fetch từ backend nếu cần
        // fetch('/api/vocabularies').then...
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-4">
            {/* Tiêu đề lớn */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                THTH Trung Cấp 3 Bài 2 대인 관계
            </h1>

            {/* Đánh giá */}
            <div className="mb-2">
                <span className="text-gray-600 text-sm flex items-center gap-2">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                        <span>⭐</span>
                        <span>첫 번째 평점 남기기</span>
                    </button>
                </span>
            </div>

            <FunctionBar />

            {/* Flashcard Player */}
            <div className="w-full max-w-3xl mt-6">
                {vocabularies.length > 0 ? (
                    <FlashcardPlayer
                        flashcard={currentFlashcard}
                        onNext={goToNextCard}
                        onPrevious={goToPreviousCard}
                        currentIndex={currentCardIndex}
                        totalCards={vocabularies.length}
                        onShuffle={handleShuffle} // truyền vào nút xáo trộn
                    />
                ) : (
                    <p className="text-gray-700 text-center text-lg">Đang tải từ vựng...</p>
                )}
            </div>

            {/* Thông tin người đăng */}
            <div className="w-full max-w-3xl mt-2">
                <AuthorCard {...author} />
            </div>

            {/* Danh sách từ vựng */}
            <div className="w-full max-w-3xl mt-8">
                <VocabularyList vocabularies={vocabularies} />
            </div>
        </div>
    );
}
