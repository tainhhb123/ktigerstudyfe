//src/components/learning-path/Flashcard.tsx
import React, { useState, useEffect } from "react";
import FlashcardPlayer from "../../components/flashcard/FlashcardPlayer";
import VocabularyList from "../../components/flashcard/VocabularyList";
import AuthorCard from "../../components/flashcard/AuthorCard";
import FunctionBar from "../../components/flashcard/FunctionBar";
import { getVocabularyByLessonId } from "../../services/VocabularyApi";

interface Vocabulary {
  vocabId: number;
  word: string;
  meaning: string;
  example?: string;
  image?: string;
}

interface AuthorInfo {
  avatar: string;
  name: string;
  role: string;
  createdAt: string;
}
interface Flashcard {
  id: number;
  term: string;
  meaning: string;
  example?: string; 
  image?: string;
}
interface Props {
  lessonId: string;
}

export default function FlashCard({ lessonId }: Props) {
  const [vocabularies, setVocabularies] = useState<Flashcard[]>([]);
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

    useEffect(() => {
    console.log("lessonId:", lessonId);
    getVocabularyByLessonId(lessonId)
        .then((data) => {
        const mapped = data.map((vocab: Vocabulary) => ({
            id: vocab.vocabId,
            term: vocab.word,
            meaning: vocab.meaning,
            example: vocab.example,
            image: vocab.image
        }));
        setVocabularies(mapped); 
        })
        .catch((error) => console.error("Error fetching vocabularies:", error));
    }, [lessonId]);


  const author: AuthorInfo = {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Maiminh2010",
    role: "선생님",
    createdAt: "11달 전 생성함",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-4">


  

      <div className="w-full max-w-3xl mt-6">
        {vocabularies.length > 0 ? (
          <FlashcardPlayer
            flashcard={currentFlashcard}
            onNext={goToNextCard}
            onPrevious={goToPreviousCard}
            currentIndex={currentCardIndex}
            totalCards={vocabularies.length}
          />
        ) : (
          <p className="text-gray-700 text-center text-lg">Đang tải từ vựng...</p>
        )}
      </div>

   

      <div className="w-full max-w-3xl mt-8">
        <VocabularyList vocabularies={vocabularies} />
      </div>
    </div>
  );
}