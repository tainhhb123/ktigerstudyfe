-- SQL Data mẫu cho WRITING Section (Câu 53 và 54)
-- Lưu ý: Thay đổi section_id theo section WRITING thực tế trong database của bạn

-- ============================================
-- TRƯỚC TIÊN: Kiểm tra section_id của WRITING section
-- ============================================
-- SELECT section_id, section_type, exam_type 
-- FROM exam_sections 
-- WHERE section_type = 'WRITING';

-- Giả sử section_id của WRITING là 3 (THAY ĐỔI NẾU KHÁC)
SET @writing_section_id = 3;

-- ============================================
-- CÂU 53: Đoạn văn ngắn (200-300 ký tự)
-- ============================================
INSERT INTO questions (
    section_id, 
    group_id, 
    question_number, 
    question_type, 
    question_text, 
    passage_text, 
    audio_url, 
    image_url, 
    correct_answer,
    points
) VALUES (
    @writing_section_id,  -- section_id cho WRITING
    NULL,                 -- không thuộc nhóm câu hỏi
    53,                   -- question_number
    'ESSAY',              -- question_type
    '다음을 주제로 하여 자신의 생각을 200~300자로 글을 쓰십시오.',  -- question_text
    '【주제】 요즘 사람들은 건강을 위해 어떤 노력을 하고 있습니까? 그 노력이 건강에 어떤 도움이 된다고 생각합니까? 아래의 내용을 중심으로 자신의 생각을 쓰십시오.

• 사람들이 건강을 위해 하는 노력은 무엇인가?
• 그 노력이 건강에 어떤 도움이 되는가?',  -- passage_text (đề bài chi tiết)
    NULL,                 -- audio_url (không có audio)
    NULL,                 -- image_url (không có hình)
    NULL,                 -- correct_answer (tự luận không có đáp án cố định)
    30.00                 -- points (30 điểm)
);

-- ============================================
-- CÂU 54: Bài luận dài (600-700 ký tự)
-- ============================================
INSERT INTO questions (
    section_id, 
    group_id, 
    question_number, 
    question_type, 
    question_text, 
    passage_text, 
    audio_url, 
    image_url, 
    correct_answer,
    points
) VALUES (
    @writing_section_id,  -- section_id cho WRITING
    NULL,                 -- không thuộc nhóm câu hỏi
    54,                   -- question_number
    'ESSAY',              -- question_type
    '다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오.',  -- question_text
    '【주제】 현대 사회에서 기술 발전이 우리의 삶에 미치는 영향에 대해 논하시오.

기술의 발전은 우리 생활을 편리하게 만들었지만, 동시에 여러 문제점도 가져왔습니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.

• 기술 발전이 우리 생활에 가져온 긍정적인 변화는 무엇인가?
• 기술 발전으로 인한 부정적인 영향은 무엇인가?
• 이러한 문제를 해결하기 위해 어떤 노력이 필요한가?

* 서론, 본론, 결론의 형식으로 작성하십시오.',  -- passage_text (đề bài chi tiết)
    NULL,                 -- audio_url (không có audio)
    NULL,                 -- image_url (không có hình)
    NULL,                 -- correct_answer (tự luận không có đáp án cố định)
    50.00                 -- points (50 điểm)
);

-- ============================================
-- KIỂM TRA DỮ LIỆU VỪA INSERT
-- ============================================
SELECT 
    question_id,
    question_number,
    question_type,
    LEFT(question_text, 50) as question_preview,
    points
FROM questions 
WHERE section_id = @writing_section_id 
  AND question_number IN (53, 54)
ORDER BY question_number;

-- ============================================
-- NẾU CẦN XÓA VÀ INSERT LẠI
-- ============================================
-- DELETE FROM questions 
-- WHERE section_id = @writing_section_id 
--   AND question_number IN (53, 54);


-- ============================================
-- DATA MẪU THAY THẾ (CÁC CHỦ ĐỀ KHÁC)
-- ============================================

-- Câu 53 - Chủ đề thay thế 1: Về giao thông công cộng
/*
INSERT INTO questions (section_id, group_id, question_number, question_type, question_text, passage_text, audio_url, image_url, correct_answer, points)
VALUES (
    @writing_section_id, NULL, 53, 'ESSAY',
    '다음을 주제로 하여 자신의 생각을 200~300자로 글을 쓰십시오.',
    '【주제】 대중교통을 이용하면 좋은 점은 무엇입니까? 

• 대중교통의 장점은 무엇인가?
• 대중교통을 더 많이 이용하려면 어떻게 해야 하는가?',
    NULL, NULL, NULL, 30.00
);
*/

-- Câu 53 - Chủ đề thay thế 2: Về đọc sách
/*
INSERT INTO questions (section_id, group_id, question_number, question_type, question_text, passage_text, audio_url, image_url, correct_answer, points)
VALUES (
    @writing_section_id, NULL, 53, 'ESSAY',
    '다음을 주제로 하여 자신의 생각을 200~300자로 글을 쓰십시오.',
    '【주제】 독서가 사람에게 미치는 영향은 무엇입니까?

• 독서를 하면 어떤 점이 좋은가?
• 독서 습관을 기르기 위해 무엇을 해야 하는가?',
    NULL, NULL, NULL, 30.00
);
*/

-- Câu 54 - Chủ đề thay thế 1: Về môi trường
/*
INSERT INTO questions (section_id, group_id, question_number, question_type, question_text, passage_text, audio_url, image_url, correct_answer, points)
VALUES (
    @writing_section_id, NULL, 54, 'ESSAY',
    '다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오.',
    '【주제】 환경 보호를 위해 개인과 사회가 해야 할 일

환경 오염이 심각한 문제가 되고 있습니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.

• 현재 환경 문제의 심각성은 어느 정도인가?
• 환경 보호를 위해 개인이 할 수 있는 일은 무엇인가?
• 정부와 기업은 어떤 노력을 해야 하는가?

* 서론, 본론, 결론의 형식으로 작성하십시오.',
    NULL, NULL, NULL, 50.00
);
*/

-- Câu 54 - Chủ đề thay thế 2: Về giáo dục
/*
INSERT INTO questions (section_id, group_id, question_number, question_type, question_text, passage_text, audio_url, image_url, correct_answer, points)
VALUES (
    @writing_section_id, NULL, 54, 'ESSAY',
    '다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오.',
    '【주제】 바람직한 교육의 방향에 대하여

교육은 개인의 성장과 사회 발전에 중요한 역할을 합니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.

• 현대 교육이 가지고 있는 문제점은 무엇인가?
• 좋은 교육을 위해 필요한 것은 무엇인가?
• 미래의 교육은 어떤 방향으로 나아가야 하는가?

* 서론, 본론, 결론의 형식으로 작성하십시오.',
    NULL, NULL, NULL, 50.00
);
*/
