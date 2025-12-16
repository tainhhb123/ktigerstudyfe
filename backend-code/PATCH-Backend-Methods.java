// ===== PASTE VÀO BACKEND SPRING BOOT =====

// --------- Method getUserAnswerText (thay thế cũ) ---------
private String getUserAnswerText(UserAnswer answer) {
    // SHORT hoặc ESSAY
    if (answer.getAnswerText() != null && !answer.getAnswerText().isEmpty()) {
        return answer.getAnswerText();
    }

    // MCQ
    if (answer.getChoice() != null) {
        AnswerChoice choice = answer.getChoice();
        String choiceText = choice.getChoiceText();
        
        // Nếu choiceText là URL ảnh, CHỈ trả về URL (không label)
        if (choiceText != null && choiceText.trim().startsWith("http")) {
            return choiceText.trim();
        }
        
        // Text thường: trả về label + text
        return choice.getChoiceLabel() + ". " + choiceText;
    }

    return "(Không trả lời)";
}

// --------- Method getCorrectAnswerText (thay thế cũ) ---------
private String getCorrectAnswerText(Question question) {
    QuestionType type = question.getQuestionType();

    if (type == QuestionType.SHORT || type == QuestionType.ESSAY) {
        return question.getCorrectAnswer() != null ? question.getCorrectAnswer() : "(Chưa có đáp án)";
    }

    if (type == QuestionType.MCQ) {
        List<AnswerChoice> choices = answerChoiceRepository.findByQuestionId(question.getQuestionId());
        return choices.stream()
                .filter(c -> c.getIsCorrect() != null && c.getIsCorrect())
                .findFirst()
                .map(c -> {
                    String choiceText = c.getChoiceText();
                    // Nếu là URL ảnh, CHỈ trả về URL
                    if (choiceText != null && choiceText.trim().startsWith("http")) {
                        return choiceText.trim();
                    }
                    // Text thường: label + text
                    return c.getChoiceLabel() + ". " + choiceText;
                })
                .orElse("(Không có đáp án đúng)");
    }

    return "";
}
