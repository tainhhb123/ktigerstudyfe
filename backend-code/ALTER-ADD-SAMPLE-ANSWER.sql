-- =====================================================
-- THÊM COLUMN sample_answer VÀO TABLE question
-- Để lưu BÀI MẪU cho câu ESSAY/SHORT
-- =====================================================

ALTER TABLE question 
ADD COLUMN sample_answer TEXT DEFAULT NULL COMMENT 'Bài mẫu tham khảo cho ESSAY hoặc đáp án mẫu cho SHORT';

-- =====================================================
-- CẬP NHẬT DỮ LIỆU: Di chuyển bài mẫu ESSAY 
-- từ correct_answer (bị giới hạn 10 ký tự) 
-- sang sample_answer (kiểu TEXT, không giới hạn)
-- =====================================================

-- Câu 51 (ㄱ) - SHORT
UPDATE question 
SET sample_answer = '변경하고 싶습니다|바꾸고 싶습니다|바꿔 주시겠어요|바꿔 주세요',
    correct_answer = '변경하고 싶습니다' -- Đáp án chính ngắn gọn
WHERE question_id = 23;

-- Câu 51 (ㄴ) - SHORT  
UPDATE question
SET sample_answer = '불가능하면|어려우면|안 되면|잘 안 되면',
    correct_answer = '불가능하면' -- Đáp án chính ngắn gọn
WHERE question_id = 24;

-- Câu 52 (ㄱ) - SHORT
UPDATE question
SET sample_answer = '중독된다고 한다|중독된다고 합니다|중독이 된다고 한다',
    correct_answer = '중독된다고 한다' -- Đáp án chính ngắn gọn
WHERE question_id = 25;

-- Câu 52 (ㄴ) - SHORT
UPDATE question
SET sample_answer = '먹지 않도록|사용하지 않도록|쓰지 않도록',
    correct_answer = '먹지 않도록' -- Đáp án chính ngắn gọn
WHERE question_id = 26;

-- =====================================================
-- KIỂM TRA KẾT QUẢ
-- =====================================================

SELECT 
    question_id,
    question_number,
    question_type,
    SUBSTRING(correct_answer, 1, 30) as correct_answer,
    SUBSTRING(sample_answer, 1, 100) as sample_answer_preview
FROM question
WHERE section_id = 2
ORDER BY question_number;
