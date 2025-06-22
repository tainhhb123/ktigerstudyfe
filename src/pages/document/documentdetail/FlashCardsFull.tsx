import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../../../services/authService";

// Kiểm tra ký tự tiếng Hàn
function isKorean(text: string) {
    return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);
}

export interface DocumentItemResponse {
    wordId: number;
    listId: number;
    word: string;
    meaning: string;
    example?: string;
    vocabImage?: string;
}

export default function FlashCardsFull() {
    const { listId = "" } = useParams<{ listId: string }>();
    const listIdNum = Number(listId);
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const API_URL = base.endsWith("/api") ? base : `${base}/api`;
    const userId = authService.getUserId();

    const [cards, setCards] = useState<DocumentItemResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [swipeX, setSwipeX] = useState(0);
    const [favId, setFavId] = useState<number | null>(null);
    const [loadingFav, setLoadingFav] = useState(false);

    // Load items
    useEffect(() => {
        async function loadItems() {
            if (isNaN(listIdNum)) return;
            try {
                const res = await fetch(`${API_URL}/document-items/list/${listIdNum}`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                setCards(await res.json());
            } catch (err) {
                console.error(err);
            }
        }
        loadItems();
    }, [API_URL, listIdNum]);

    // Load favorite state
    useEffect(() => {
        if (!userId || isNaN(listIdNum)) return;
        fetch(`${API_URL}/favorite-lists/user/${userId}/list/${listIdNum}`)
            .then(res => {
                if (res.status === 404) { setFavId(null); return null; }
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((data: { favoriteId: number } | null) => { if (data) setFavId(data.favoriteId); })
            .catch(() => setFavId(null));
    }, [API_URL, userId, listIdNum]);

    // Toggle favorite
    const toggleFavorite = async () => {
        if (!userId || isNaN(listIdNum)) { alert("Vui lòng đăng nhập và chọn danh sách."); return; }
        setLoadingFav(true);
        try {
            if (favId) {
                const res = await fetch(`${API_URL}/favorite-lists/${favId}`, { method: "DELETE" });
                if (!res.ok) throw new Error();
                setFavId(null);
            } else {
                const res = await fetch(`${API_URL}/favorite-lists`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, listId: listIdNum }),
                });
                if (!res.ok) throw new Error();
                const { favoriteId } = await res.json();
                setFavId(favoriteId);
            }
        } catch {
            alert("Cập nhật yêu thích thất bại.");
        } finally {
            setLoadingFav(false);
        }
    };

    // Speech
    const speak = (text: string) => {
        if (!window.speechSynthesis) { alert("Trình duyệt không hỗ trợ phát âm."); return; }
        const synth = window.speechSynthesis;
        const lang = isKorean(text) ? "ko-KR" : "vi-VN";
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;
        const voice = synth.getVoices().find(v => v.lang.startsWith(lang));
        if (voice) utt.voice = voice;
        synth.cancel();
        synth.speak(utt);
    };

    // Navigation
    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setSwipeX(-100);
            setTimeout(() => { setCurrentIndex(i => i + 1); setSwipeX(0); setFlipped(false); }, 200);
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setSwipeX(100);
            setTimeout(() => { setCurrentIndex(i => i - 1); setSwipeX(0); setFlipped(false); }, 200);
        }
    };

    // Shuffle
    const handleShuffle = () => {
        setCards(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setFlipped(false);
    };

    const current = cards[currentIndex] || { wordId: 0, listId: listIdNum, word: "", meaning: "" };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-12">
            {/* Flashcard */}
            <div
                className="relative w-full max-w-2xl h-96 mb-6 cursor-pointer overflow-hidden"
                style={{ perspective: "1300px" }}
                onClick={() => setFlipped(f => !f)}
            >
                <div
                    className="w-full h-full transition-transform duration-500"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 bg-white shadow-lg rounded-2xl flex flex-col items-center justify-center p-8"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <span className="text-5xl font-semibold text-gray-800 text-center">
                            {current.word}
                        </span>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                speak(current.word);
                            }}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-blue-100 text-blue-500"
                            aria-label={`Phát âm ${current.word}`}
                            style={{ fontSize: "0.875rem" }}
                        >
                            🔊
                        </button>
                    </div>
                    {/* Back */}
                    <div
                        className={`absolute inset-0 bg-white shadow-lg rounded-2xl p-8 flex gap-6 ${current.vocabImage
                            ? "flex-row items-start"
                            : "flex-col items-center justify-center"
                            }`}
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        {/* Text side */}
                        <div className={`flex-1 flex flex-col justify-center`}>
                            <p className="mb-4 text-3xl font-bold text-gray-800">
                                {current.meaning}
                            </p>
                            {current.example && (
                                <p className="italic text-lg text-gray-600">
                                    “{current.example}”
                                </p>
                            )}
                        </div>
                        {/* Image side */}
                        {current.vocabImage && (
                            <div className="flex-1 flex items-center justify-center">
                                <img
                                    src={current.vocabImage}
                                    alt={current.word}
                                    className="max-w-[250px] max-h-[300px] object-contain rounded-xl"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-8 mb-4">
                <button onClick={handlePrevious} disabled={currentIndex === 0} className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50">←</button>
                <span className="text-gray-700 text-lg font-semibold">{currentIndex + 1} / {cards.length}</span>
                <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50">→</button>
            </div>

            {/* Shuffle & Favorite */}
            <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
                <button onClick={handleShuffle} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200 transition">🔀 Đảo ngẫu nhiên</button>
                <button onClick={toggleFavorite} disabled={loadingFav} className="p-2 rounded hover:bg-gray-200 transition text-gray-500 hover:text-red-500">{favId ? '❤️' : '🤍'}</button>
            </div>
        </div>
    );
}
