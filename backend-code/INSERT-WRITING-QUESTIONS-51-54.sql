-- ============================================
-- SQL INSERT cho WRITING Section - Câu 51, 52, 53, 54
-- Exam ID: 3 (TOPIK II 91회 기출)
-- Section ID: 2 (WRITING Section)
-- ============================================

-- Lưu ý: Câu 51-52 đã có trong database (question_id 23, 24, 25, 26)
-- File này chỉ cần chạy nếu câu 53-54 chưa có hoặc muốn cập nhật

-- ============================================
-- XÓA DỮ LIỆU CŨ (nếu có) - OPTIONAL
-- ============================================
-- DELETE FROM `question` WHERE `section_id` = 2 AND `question_number` IN (53, 54);

-- ============================================
-- CÂU 53: Đoạn văn ngắn (200-300 ký tự) - ESSAY type
-- Câu 53 thường có biểu đồ/bảng số liệu để phân tích
-- ============================================
INSERT INTO `question` (
    `question_id`, 
    `audio_url`, 
    `correct_answer`, 
    `group_id`, 
    `image_url`, 
    `passage_text`, 
    `points`, 
    `question_number`, 
    `question_text`, 
    `question_type`, 
    `section_id`
) VALUES (
    53,                     -- question_id
    NULL,                   -- audio_url
    NULL,                   -- correct_answer (ESSAY không có đáp án cố định)
    NULL,                   -- group_id
    'https://res.cloudinary.com/di6d1g736/image/upload/v1734526800/topik-writing-53-health-chart.png',  -- image_url (THAY ĐỔI URL này bằng biểu đồ thực tế)
    '【주제】 아래 그래프는 한국 사람들의 건강 관리 실태를 나타낸 것입니다. 그래프가 설명하는 내용을 간략하게 쓰고, 이에 대한 자신의 생각을 쓰십시오.\n\n※ 200~300자로 쓰십시오. (문장 부호는 글자 수에 포함)',  -- passage_text
    '30.00',                -- points
    53,                     -- question_number
    '다음을 보고 200~300자로 글을 쓰십시오.',  -- question_text (보고 = nhìn vào)
    'ESSAY',                -- question_type
    2                       -- section_id (WRITING section)
);

-- ============================================
-- CÂU 54: Bài luận dài (600-700 ký tự) - ESSAY type
-- ============================================
INSERT INTO `question` (
    `question_id`, 
    `audio_url`, 
    `correct_answer`, 
    `group_id`, 
    `image_url`, 
    `passage_text`, 
    `points`, 
    `question_number`, 
    `question_text`, 
    `question_type`, 
    `section_id`
) VALUES (
    54,                     -- question_id
    NULL,                   -- audio_url
    NULL,                   -- correct_answer
    NULL,                   -- group_id
    NULL,                   -- image_url
    '【주제】 현대 사회에서 기술 발전이 우리의 삶에 미치는 영향에 대해 논하시오.\n\n기술의 발전은 우리 생활을 편리하게 만들었지만, 동시에 여러 문제점도 가져왔습니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.\n\n• 기술 발전이 우리 생활에 가져온 긍정적인 변화는 무엇인가?\n• 기술 발전으로 인한 부정적인 영향은 무엇인가?\n• 이러한 문제를 해결하기 위해 어떤 노력이 필요한가?\n\n※ 600~700자로 쓰십시오. (문장 부호는 글자 수에 포함)\n※ 서론, 본론, 결론의 형식으로 작성하십시오.',  -- passage_text
    '50.00',                -- points
    54,                     -- question_number
    '다음을 읽고 600~700자로 글을 쓰십시오.',  -- question_text
    'ESSAY',                -- question_type
    2                       -- section_id
);

-- ============================================
-- KIỂM TRA DỮ LIỆU VỪA INSERT
-- ============================================
SELECT 
    q.question_id,
    q.question_number,
    q.question_type,
    LEFT(q.question_text, 40) as question_preview,
    q.points,
    es.section_type,
    e.title as exam_title
FROM question q
JOIN exam_section es ON q.section_id = es.section_id
JOIN exam e ON es.exam_id = e.exam_id
WHERE q.section_id = 2 
  AND q.question_number IN (51, 52, 53, 54)
ORDER BY q.question_number;

-- ============================================
-- KẾT QUẢ MONG ĐỢI
-- ============================================
-- Sau khi chạy SQL này, WRITING section sẽ có 4 câu (hoặc nhiều hơn nếu có sub-questions):
-- - Câu 51: SHORT (điền từ vào chỗ trống) - đã có
-- - Câu 52: SHORT (điền từ vào chỗ trống) - đã có  
-- - Câu 53: ESSAY (đoạn văn ngắn 200-300 ký tự) - mới thêm
-- - Câu 54: ESSAY (bài luận dài 600-700 ký tự) - mới thêm


-- ============================================
-- CHỦ ĐỀ THAY THẾ (nếu muốn đổi đề bài)
-- ============================================

-- Câu 53 - Chủ đề: Giao thông công cộng
/*
UPDATE `question` 
SET 
    `passage_text` = '【주제】 대중교통을 이용하면 좋은 점은 무엇입니까?\n\n아래의 내용을 중심으로 자신의 생각을 쓰십시오.\n\n• 대중교통의 장점은 무엇인가?\n• 대중교통을 더 많이 이용하려면 어떻게 해야 하는가?\n\n※ 200~300자로 쓰십시오.'
WHERE `question_id` = 53;
*/

-- Câu 53 - Chủ đề: Đọc sách
/*
UPDATE `question` 
SET 
    `passage_text` = '【주제】 독서가 사람에게 미치는 영향은 무엇입니까?\n\n아래의 내용을 중심으로 자신의 생각을 쓰십시오.\n\n• 독서를 하면 어떤 점이 좋은가?\n• 독서 습관을 기르기 위해 무엇을 해야 하는가?\n\n※ 200~300자로 쓰십시오.'
WHERE `question_id` = 53;
*/

-- Câu 54 - Chủ đề: Môi trường
/*
UPDATE `question` 
SET 
    `passage_text` = '【주제】 환경 보호를 위해 개인과 사회가 해야 할 일\n\n환경 오염이 심각한 문제가 되고 있습니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.\n\n• 현재 환경 문제의 심각성은 어느 정도인가?\n• 환경 보호를 위해 개인이 할 수 있는 일은 무엇인가?\n• 정부와 기업은 어떤 노력을 해야 하는가?\n\n※ 600~700자로 쓰십시오.\n※ 서론, 본론, 결론의 형식으로 작성하십시오.'
WHERE `question_id` = 54;
*/

-- Câu 54 - Chủ đề: Giáo dục
/*
UPDATE `question` 
SET 
    `passage_text` = '【주제】 바람직한 교육의 방향에 대하여\n\n교육은 개인의 성장과 사회 발전에 중요한 역할을 합니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.\n\n• 현대 교육이 가지고 있는 문제점은 무엇인가?\n• 좋은 교육을 위해 필요한 것은 무엇인가?\n• 미래의 교육은 어떤 방향으로 나아가야 하는가?\n\n※ 600~700자로 쓰십시오.\n※ 서론, 본론, 결론의 형식으로 작성하십시오.'
WHERE `question_id` = 54;
*/
