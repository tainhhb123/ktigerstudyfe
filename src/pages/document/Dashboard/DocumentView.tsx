import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import FlashcardPlayer from '../../../components/document/flashcard/FlashcardPlayer';
import VocabularyList from '../../../components/document/flashcard/VocabularyList';
import AuthorCard from '../../../components/document/flashcard/AuthorCard';
import FunctionBar from '../../../components/document/flashcard/FunctionBar';

interface DocumentListResponse {
    listId: number;
    title: string;
    description: string;
    type: string;
    fullName: string;
    avatarImage?: string;
    createdAt: string;
}

interface DocumentItemResponse {
    wordId: number;
    listId: number;
    word: string;
    meaning: string;
    example?: string;
    vocabImage?: string;
}

interface FlashCardType {
    id: number;
    term: string;
    meaning: string;
}

export default function DocumentView() {
    const { listId } = useParams<{ listId: string }>();
    const listIdNum = Number(listId);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [meta, setMeta] = useState<DocumentListResponse | null>(null);
    const [items, setItems] = useState<DocumentItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function load() {
            if (isNaN(listIdNum)) {
                console.error('Invalid listId:', listId);
                setLoading(false);
                return;
            }
            try {
                const mRes = await fetch(`${API_URL}/document-lists/${listIdNum}`);
                if (!mRes.ok) throw new Error('Không lấy được metadata');
                setMeta(await mRes.json());

                const iRes = await fetch(`${API_URL}/document-items/list/${listIdNum}`);
                if (!iRes.ok) throw new Error('Không lấy được từ vựng');
                setItems(await iRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [API_URL, listIdNum]);

    const goNext = () =>
        setCurrentIndex(i => (items.length ? (i + 1) % items.length : 0));
    const goPrev = () =>
        setCurrentIndex(i => (items.length ? (i === 0 ? items.length - 1 : i - 1) : 0));
    const shuffle = () => {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
        setCurrentIndex(0);
    };

    if (loading) return <p className="p-4 text-center">Đang tải dữ liệu…</p>;
    if (!meta) return <p className="p-4 text-center text-red-500">Không tìm thấy bộ ghi nhớ.</p>;

    const flashcards: FlashCardType[] = items.map(it => ({
        id: it.wordId,
        term: it.word,
        meaning: it.meaning,
    }));
    const currentFlashcard = flashcards[currentIndex] || { id: 0, term: '', meaning: '' };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                {meta.title}
            </h1>

            {/* FunctionBar now receives numeric listId */}
            <FunctionBar listId={listIdNum.toString()} />

            <div className="w-full max-w-3xl mt-6">
                {flashcards.length > 0 ? (
                    <FlashcardPlayer
                        listId={listIdNum}
                        flashcard={currentFlashcard}
                        onNext={goNext}
                        onPrevious={goPrev}
                        currentIndex={currentIndex}
                        totalCards={flashcards.length}
                        onShuffle={shuffle}
                    />
                ) : (
                    <p className="text-gray-700 text-center text-lg">Chưa có từ vựng nào.</p>
                )}
            </div>

            <div className="w-full max-w-3xl mt-4">
                <AuthorCard
                    avatar={meta.avatarImage || ''}
                    name={meta.fullName}
                    role={meta.type}
                    createdAt={meta.createdAt}
                />
            </div>

            <div className="w-full max-w-3xl mt-8">
                <VocabularyList vocabularies={flashcards} />
            </div>
        </div>
    );
}
