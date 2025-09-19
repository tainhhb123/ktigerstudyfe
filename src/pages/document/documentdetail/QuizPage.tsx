// src/pages/QuizPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DocumentItemResponse {
    wordId: number;
    listId: number;
    word: string;
    meaning: string;
    example?: string;
    vocabImage?: string;
}

interface MCQuestion {
    wordId: number;
    word: string;
    options: string[];
    correctAnswer: string;
}

export default function QuizPage() {
    const { listId = '' } = useParams<{ listId: string }>();
    const listIdNum = Number(listId);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [questions, setQuestions] = useState<MCQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongQuestions, setWrongQuestions] = useState<MCQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadItems() {
            try {
                const res = await fetch(`${API_URL}/document-items/list/${listIdNum}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const items: DocumentItemResponse[] = await res.json();

                // build list of all meanings
                const allMeanings = items.map(i => i.meaning).filter(Boolean);
                const pickRandom = (arr: string[], n: number) => {
                    const copy = [...arr], picks: string[] = [];
                    while (picks.length < n) {
                        if (copy.length === 0) break;
                        const idx = Math.floor(Math.random() * copy.length);
                        picks.push(copy.splice(idx, 1)[0]);
                    }
                    return picks;
                };

                // construct questions
                const qs: MCQuestion[] = items.map(i => {
                    const others = allMeanings.filter(m => m !== i.meaning);
                    const wrongs = pickRandom(others, 3);
                    while (wrongs.length < 3) wrongs.push('—');
                    const opts = [i.meaning, ...wrongs].sort(() => Math.random() - 0.5);
                    return {
                        wordId: i.wordId,
                        word: i.word,
                        options: opts,
                        correctAnswer: i.meaning,
                    };
                });

                setQuestions(qs);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        }

        if (!isNaN(listIdNum)) {
            loadItems();
        } else {
            setError('List ID không hợp lệ');
            setLoading(false);
        }
    }, [API_URL, listIdNum]);

    const handleSelect = (opt: string) => {
        if (showFeedback) return;
        setSelected(opt);
        setShowFeedback(true);
        if (opt === questions[currentIdx].correctAnswer) {
            setScore(s => s + 1);
        } else {
            setWrongQuestions(ws => [...ws, questions[currentIdx]]);
        }
    };

    const handleSkip = () => {
        handleSelect(questions[currentIdx].correctAnswer);
    };

    const next = () => {
        setShowFeedback(false);
        setSelected(null);
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
        } else {
            setCurrentIdx(questions.length);
        }
    };

    if (loading) {
        return <p className="p-8 text-center text-gray-500">Đang tải Quiz…</p>;
    }
    if (error) {
        return <p className="p-8 text-center text-red-600">Lỗi: {error}</p>;
    }

    // finished
    if (currentIdx >= questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white max-w-3xl w-full rounded-3xl shadow-xl p-12 space-y-8 text-center">
                    {/* 🎉 Header */}
                    <h2 className="text-4xl font-bold flex items-center justify-center space-x-3">
                        <span>🎉</span>
                        <span>Hoàn thành Quiz!</span>
                    </h2>

                    {/* Score with bounce animation */}
                    <motion.p
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        Bạn trả lời đúng{' '}
                        <motion.span
                            className="text-green-600 font-bold"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {score}
                        </motion.span>{' '}
                        / {questions.length}
                    </motion.p>

                    {/* List of wrong answers, if any */}
                    {wrongQuestions.length > 0 && (
                        <div className="text-left space-y-6">
                            <h3 className="text-xl font-semibold">Những câu sai:</h3>
                            <div className="space-y-4">
                                {wrongQuestions.map((q, i) => (
                                    <motion.div
                                        key={i}
                                        className="p-6 bg-gray-50 rounded-2xl shadow"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <p className="text-lg font-medium">{q.word}</p>
                                        <p className="mt-2 text-base">
                                            Đáp án đúng:{' '}
                                            <strong className="text-green-600">{q.correctAnswer}</strong>
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const q = questions[currentIdx];

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 pt-14">
            <motion.div
                className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-8 space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
                {/* header */}
                <div className="flex justify-between">
                    <span className="text-gray-500 uppercase text-sm">Định nghĩa</span>
                    <span className="text-gray-500 text-sm">
                        {currentIdx + 1}/{questions.length}
                    </span>
                </div>

                {/* question */}
                <h2 className="text-4xl font-bold text-gray-800">{q.word}</h2>
                <p className="text-base text-gray-600">Chọn thuật ngữ đúng</p>

                {/* options */}
                <div className="grid grid-cols-2 gap-6">
                    {q.options.map(opt => {
                        const isCorr = opt === q.correctAnswer;
                        const isSel = opt === selected;
                        let base =
                            'border-2 border-gray-200 rounded-2xl p-5 text-left text-base font-medium transition';
                        if (showFeedback) {
                            if (isCorr) base += ' bg-green-50 border-green-300';
                            else if (isSel) base += ' bg-red-50 border-red-300';
                        } else {
                            base += ' hover:bg-gray-50';
                        }
                        return (
                            <motion.button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                disabled={showFeedback}
                                className={base}
                                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>

                {/* skip */}
                {!showFeedback && (
                    <button
                        onClick={handleSkip}
                        className="mt-4 text-blue-600 text-base hover:underline"
                    >
                        Bạn không biết?
                    </button>
                )}

                {/* feedback */}
                {showFeedback && (
                    <motion.div
                        className="mt-8 text-center space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {selected === q.correctAnswer ? (
                            <p className="text-2xl text-green-600 font-bold">✔ Chính xác!</p>
                        ) : (
                            <p className="text-2xl text-red-600 font-bold">
                                ✖ Sai, đáp án đúng là: <strong>{q.correctAnswer}</strong>
                            </p>
                        )}
                        <button
                            onClick={next}
                            className="mt-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-700 transition"
                        >
                            {currentIdx < questions.length - 1 ? 'Tiếp tục' : 'Xem kết quả'}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
