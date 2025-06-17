// src/pages/document/documentdetail/FlashCardsFull.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface DocumentItemResponse {
    wordId: number;
    listId: number;
    word: string;
    meaning: string;
}

export default function FlashCardsFull() {
    const { listId = "" } = useParams<{ listId: string }>();
    const API = import.meta.env.VITE_API_BASE_URL;

    const [cards, setCards] = useState<DocumentItemResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [swipeX, setSwipeX] = useState(0);

    // Fetch items once on mount
    useEffect(() => {
        async function loadItems() {
            try {
                const res = await fetch(`${API}/document-items/list/${listId}`);
                if (!res.ok) throw new Error("Failed to load items");
                setCards(await res.json());
            } catch (err) {
                console.error(err);
            }
        }
        loadItems();
    }, [API, listId]);

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setSwipeX(-100);
            setTimeout(() => {
                setCurrentIndex((i) => i + 1);
                setSwipeX(0);
                setFlipped(false);
            }, 200);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setSwipeX(100);
            setTimeout(() => {
                setCurrentIndex((i) => i - 1);
                setSwipeX(0);
                setFlipped(false);
            }, 200);
        }
    };

    const handleShuffle = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setFlipped(false);
    };

    // current card
    const current = cards[currentIndex] ?? { wordId: 0, word: "", meaning: "" };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-12">
            {/* Flashcard */}
            <div
                className="relative w-full max-w-2xl h-[400px] mb-6 cursor-pointer overflow-hidden"
                style={{ perspective: "1300px" }}
                onClick={() => setFlipped((f) => !f)}
            >
                <div
                    className="w-full h-full relative transition-transform duration-300"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `
              translateX(${swipeX}%)
              ${flipped ? "rotateY(180deg)" : "rotateY(0deg)"}
            `,
                    }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center text-5xl font-semibold p-6"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                        }}
                    >
                        {current.word}
                    </div>
                    {/* Back */}
                    <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center text-4xl font-bold p-6"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        {current.meaning}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-8 mb-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
                >
                    ←
                </button>
                <span className="text-gray-700 text-lg font-semibold">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
                >
                    →
                </button>
            </div>

            {/* Shuffle & Favorite */}
            <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
                <button
                    onClick={handleShuffle}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200"
                >
                    🔀 Đảo ngẫu nhiên
                </button>
                <button className="p-2 rounded hover:bg-gray-200 text-red-500">
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
}
