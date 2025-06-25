//src/pages/Learn/Vocabulary.tsx
import Flashcard from "../../components/learning-path/Flashcard";

interface Props {
  lessonId: string;
}

export default function Vocabulary({ lessonId }: Props) {
  return <Flashcard lessonId={lessonId} />;
}
