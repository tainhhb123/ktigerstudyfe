//src/pages/Learn/Vocabulary.tsx
import FlashcardViewer from "../../components/learning-path/Flashcard";

interface Props {
  lessonId: string;
}

export default function Vocabulary({ lessonId }: Props) {
  return <FlashcardViewer lessonId={lessonId} />;
}
