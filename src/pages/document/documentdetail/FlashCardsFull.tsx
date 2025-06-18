import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../../../services/authService";

// Hàm nhận diện tiếng Hàn
function isKorean(text: string) {
    return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(text);
}

interface DocumentItemResponse {
    wordId: number;
    listId: number;
    word: string;
    meaning: string;
}

export default function FlashCardsFull() {
    const { listId = "" } = useParams<{ listId: string }>();
    const listIdNum = Number(listId);
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const userId = authService.getUserId();

    const [cards, setCards] = useState<DocumentItemResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [swipeX, setSwipeX] = useState(0);

    // Favorite state
    const [favId, setFavId] = useState<number | null>(null);
    const [loadingFav, setLoadingFav] = useState(false);

    // Load cards
    useEffect(() => {
        async function loadItems() {
            if (isNaN(listIdNum)) return;
            try {
                const res = await fetch(`${API_URL}/document-items/list/${listIdNum}`);
                if (!res.ok) throw new Error("Failed to load items");
                setCards(await res.json());
            } catch (err) {
                console.error(err);
            }
        }
        loadItems();
    }, [API_URL, listIdNum]);

    // Check favorite on mount
    useEffect(() => {
        if (!userId || isNaN(listIdNum)) return;
        fetch(`${API_URL}/favorite-lists/user/${userId}/list/${listIdNum}`)
            .then(res => {
                if (!res.ok) throw new Error("Not favorited");
                return res.json() as Promise<{ favoriteId: number }>;
            })
            .then(data => setFavId(data.favoriteId))
            .catch(() => setFavId(null));
    }, [API_URL, userId, listIdNum]);

    const toggleFavorite = async () => {
        if (!userId || isNaN(listIdNum)) {
            alert("Bạn cần đăng nhập và chọn danh sách hợp lệ.");
            return;
        }
        setLoadingFav(true);
        try {
            if (favId) {
                const res = await fetch(`${API_URL}/favorite-lists/${favId}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Delete failed");
                setFavId(null);
            } else {
                const res = await fetch(`${API_URL}/favorite-lists`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, listId: listIdNum }),
                });
                if (!res.ok) throw new Error("Create failed");
                const data: { favoriteId: number } = await res.json();
                setFavId(data.favoriteId);
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi cập nhật yêu thích.");
        } finally {
            setLoadingFav(false);
        }
    };

    // Hàm phát âm word (tự nhận diện tiếng Hàn/Việt)
    const speak = (text: string) => {
        if (!("speechSynthesis" in window)) {
            alert("Trình duyệt không hỗ trợ đọc tự động.");
            return;
        }
        const synth = window.speechSynthesis;
        const isKo = isKorean(text);
        const lang = isKo ? "ko-KR" : "vi-VN";

        const doSpeak = () => {
            const voices = synth.getVoices();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
            if (voice) utterance.voice = voice;
            synth.cancel();
            synth.speak(utterance);
        };
        if (synth.getVoices().length > 0) doSpeak();
        else {
            const handler = () => { doSpeak(); synth.removeEventListener("voiceschanged", handler); };
            synth.addEventListener("voiceschanged", handler);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setSwipeX(-100);
            setTimeout(() => {
                setCurrentIndex(i => i + 1);
                setSwipeX(0);
                setFlipped(false);
            }, 200);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setSwipeX(100);
            setTimeout(() => {
                setCurrentIndex(i => i - 1);
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

    const current = cards[currentIndex] ?? { wordId: 0, listId: listIdNum, word: "", meaning: "" };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-12">
            {/* Flashcard */}
            <div
                className="relative w-full max-w-2xl h-[400px] mb-6 cursor-pointer overflow-hidden"
                style={{ perspective: "1300px" }}
                onClick={() => setFlipped(f => !f)}
            >
                <div
                    className="w-full h-full relative transition-transform duration-300"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `translateX(${swipeX}%) ${flipped ? "rotateY(180deg)" : "rotateY(0deg)"}`,
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
                            position: "absolute",
                        }}
                    >
                        <span className="block w-full text-center">{current.word}</span>
                        {/* Nút loa ở góc phải trên */}
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={e => { e.stopPropagation(); speak(current.word); }}
                            className="absolute top-3 right-4 p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors"
                            aria-label={`Phát âm: ${current.word}`}
                        >
                            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
                            </svg>
                        </button>
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
                <button onClick={handlePrevious} disabled={currentIndex === 0} className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50">←</button>
                <span className="text-gray-700 text-lg font-semibold">{currentIndex + 1} / {cards.length}</span>
                <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="bg-gray-200 text-gray-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50">→</button>
            </div>

            {/* Shuffle & Favorite */}
            <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
                <button onClick={handleShuffle} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200">
                    🔀 Đảo ngẫu nhiên
                </button>
                <button onClick={toggleFavorite} disabled={loadingFav} className={`p-2 rounded hover:bg-gray-200 transition ${favId ? 'text-red-500' : 'text-gray-500'}`}>
                    {favId ? (
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
