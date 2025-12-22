-- ============================================
-- SQL QUERIES để kiểm tra và setup AI Grading
-- ============================================

-- ============================================
-- 1. CHECK: Xem tất cả sections của exam
-- ============================================
SELECT 
    es.section_id,
    es.section_type,
    es.section_order,
    es.total_questions,
    es.duration_minutes,
    e.title as exam_title
FROM exam_section es
JOIN exam e ON es.exam_id = e.exam_id
WHERE e.exam_id = 3  -- TOPIK II 91회
ORDER BY es.section_order;

-- Expected:
-- section_id | section_type | section_order | total_questions
-- 1          | LISTENING    | 1             | 50
-- 2          | WRITING      | 2             | 4
-- 3          | READING      | 3             | 50

-- ============================================
-- 2. CHECK: Xem tất cả questions trong WRITING section
-- ============================================
SELECT 
    q.question_id,
    q.question_number,
    q.question_type,
    LEFT(q.question_text, 50) as question_preview,
    q.points,
    q.image_url,
    CASE 
        WHEN q.correct_answer IS NOT NULL THEN '✅ Có reference'
        ELSE '❌ Không có reference'
    END as has_reference
FROM question q
WHERE q.section_id = 2  -- WRITING section
ORDER BY q.question_number;

-- Expected:
-- Q51-52: SHORT type (điền từ)
-- Q53-54: ESSAY type (bài viết)

-- ============================================
-- 3. INSERT: Thêm Q53 nếu chưa có
-- ============================================
INSERT INTO `question` (
    `question_id`, 
    `question_number`, 
    `question_type`, 
    `question_text`, 
    `passage_text`, 
    `points`, 
    `section_id`,
    `image_url`
) VALUES (
    53,
    53,
    'ESSAY',
    '다음을 보고 200~300자로 글을 쓰십시오.',
    '【주제】 아래 그래프는 한국 사람들의 건강 관리 실태를 나타낸 것입니다. 그래프가 설명하는 내용을 간략하게 쓰고, 이에 대한 자신의 생각을 쓰십시오.

※ 200~300자로 쓰십시오. (문장 부호는 글자 수에 포함)',
    30.00,
    2,
    'https://res.cloudinary.com/dfeefsbap/image/upload/v1734527000/topik-q53-health-chart.png'
)
ON DUPLICATE KEY UPDATE
    question_text = VALUES(question_text),
    passage_text = VALUES(passage_text),
    points = VALUES(points),
    image_url = VALUES(image_url);

-- ============================================
-- 4. INSERT: Thêm Q54 nếu chưa có
-- ============================================
INSERT INTO `question` (
    `question_id`, 
    `question_number`, 
    `question_type`, 
    `question_text`, 
    `passage_text`, 
    `points`, 
    `section_id`
) VALUES (
    54,
    54,
    'ESSAY',
    '다음을 읽고 600~700자로 글을 쓰십시오.',
    '【주제】 현대 사회에서 기술 발전이 우리의 삶에 미치는 영향에 대해 논하시오.

기술의 발전은 우리 생활을 편리하게 만들었지만, 동시에 여러 문제점도 가져왔습니다. 다음 내용을 중심으로 자신의 생각을 쓰십시오.

• 기술 발전이 우리 생활에 가져온 긍정적인 변화는 무엇인가?
• 기술 발전으로 인한 부정적인 영향은 무엇인가?
• 이러한 문제를 해결하기 위해 어떤 노력이 필요한가?

※ 600~700자로 쓰십시오. (문장 부호는 글자 수에 포함)
※ 서론, 본론, 결론의 형식으로 작성하십시오.',
    50.00,
    2
)
ON DUPLICATE KEY UPDATE
    question_text = VALUES(question_text),
    passage_text = VALUES(passage_text),
    points = VALUES(points);

-- ============================================
-- 5. CHECK: Verify Q53 & Q54 đã có
-- ============================================
SELECT 
    q.question_id,
    q.question_number,
    q.question_type,
    q.points,
    CHAR_LENGTH(q.passage_text) as passage_length,
    CASE 
        WHEN q.image_url IS NOT NULL THEN '✅ Có hình'
        ELSE '❌ Không có hình'
    END as has_image
FROM question q
WHERE q.section_id = 2 
  AND q.question_type = 'ESSAY'
ORDER BY q.question_number;

-- Expected:
-- question_number | question_type | points | has_image
-- 53              | ESSAY         | 30.00  | ✅
-- 54              | ESSAY         | 50.00  | ❌

-- ============================================
-- 6. TEST: Xem user_answer cho một attempt
-- ============================================
SELECT 
    ua.user_answer_id,
    q.question_number,
    q.question_type,
    CASE 
        WHEN ua.answer_text IS NOT NULL THEN CONCAT(LEFT(ua.answer_text, 30), '...')
        WHEN ua.choice_id IS NOT NULL THEN CONCAT('Choice ID: ', ua.choice_id)
        ELSE '(Chưa trả lời)'
    END as user_answer,
    ua.score,
    q.points as max_points
FROM user_answer ua
JOIN question q ON ua.question_id = q.question_id
WHERE ua.attempt_id = 33  -- ← THAY ĐỔI attempt_id
  AND q.section_id = 2    -- WRITING section
ORDER BY q.question_number;

-- ============================================
-- 7. TEST: Xem điểm tổng của attempt
-- ============================================
SELECT 
    ea.attempt_id,
    ea.status,
    u.user_name,
    e.title as exam_title,
    ea.listening_score,
    ea.reading_score,
    ea.writing_score,
    ea.total_score,
    ea.start_time,
    ea.end_time
FROM exam_attempt ea
JOIN user u ON ea.user_id = u.user_id
JOIN exam e ON ea.exam_id = e.exam_id
WHERE ea.attempt_id = 33  -- ← THAY ĐỔI attempt_id
ORDER BY ea.start_time DESC;

-- ============================================
-- 8. ANALYZE: Xem tất cả attempts đã COMPLETED
-- ============================================
SELECT 
    ea.attempt_id,
    u.user_name,
    ea.status,
    ea.writing_score,
    ea.total_score,
    DATE_FORMAT(ea.end_time, '%Y-%m-%d %H:%i') as completed_at
FROM exam_attempt ea
JOIN user u ON ea.user_id = u.user_id
WHERE ea.exam_id = 3
  AND ea.status = 'COMPLETED'
ORDER BY ea.end_time DESC
LIMIT 10;

-- ============================================
-- 9. DEBUG: Xem ESSAY answers chưa được chấm (score = 0 hoặc NULL)
-- ============================================
SELECT 
    ua.user_answer_id,
    ea.attempt_id,
    u.user_name,
    q.question_number,
    CHAR_LENGTH(ua.answer_text) as char_count,
    ua.score,
    q.points,
    CASE 
        WHEN ua.answer_text IS NULL THEN '❌ Chưa làm'
        WHEN ua.score IS NULL OR ua.score = 0 THEN '⚠️  Chưa chấm'
        ELSE '✅ Đã chấm'
    END as status
FROM user_answer ua
JOIN question q ON ua.question_id = q.question_id
JOIN exam_attempt ea ON ua.attempt_id = ea.attempt_id
JOIN user u ON ea.user_id = u.user_id
WHERE q.question_type = 'ESSAY'
  AND q.section_id = 2
ORDER BY ea.attempt_id DESC, q.question_number
LIMIT 20;

-- ============================================
-- 10. CLEANUP: Xóa test attempts (OPTIONAL)
-- ============================================
-- ⚠️  CẢNH BÁO: Chỉ chạy khi cần xóa data test
-- DELETE FROM user_answer WHERE attempt_id IN (31, 32, 33);
-- DELETE FROM exam_attempt WHERE attempt_id IN (31, 32, 33);

-- ============================================
-- 11. STATISTICS: Thống kê điểm Writing
-- ============================================
SELECT 
    COUNT(DISTINCT ea.attempt_id) as total_attempts,
    COUNT(DISTINCT CASE WHEN ea.status = 'COMPLETED' THEN ea.attempt_id END) as completed_attempts,
    ROUND(AVG(ea.writing_score), 2) as avg_writing_score,
    MIN(ea.writing_score) as min_writing_score,
    MAX(ea.writing_score) as max_writing_score
FROM exam_attempt ea
WHERE ea.exam_id = 3
  AND ea.writing_score IS NOT NULL;

-- ============================================
-- 12. CREATE TABLE: Lưu AI feedback (OPTIONAL)
-- ============================================
CREATE TABLE IF NOT EXISTS `ai_grading_result` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_answer_id` BIGINT NOT NULL,
    `ai_score` INT NOT NULL COMMENT 'Điểm AI (0-100)',
    `content_score` INT COMMENT 'Nội dung (0-40)',
    `grammar_score` INT COMMENT 'Ngữ pháp (0-30)',
    `vocabulary_score` INT COMMENT 'Từ vựng (0-20)',
    `organization_score` INT COMMENT 'Tổ chức (0-10)',
    `feedback` TEXT COMMENT 'Nhận xét tổng quan',
    `suggestions` JSON COMMENT 'Gợi ý cải thiện',
    `model_used` VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_answer_id`) REFERENCES `user_answer`(`user_answer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu kết quả chấm AI cho teacher review';

-- ============================================
-- 13. CHECK: Xem AI grading results (nếu đã có table)
-- ============================================
-- SELECT 
--     agr.id,
--     ea.attempt_id,
--     u.user_name,
--     q.question_number,
--     agr.ai_score,
--     CONCAT(agr.content_score, '+', agr.grammar_score, '+', 
--            agr.vocabulary_score, '+', agr.organization_score, 
--            '=', agr.ai_score) as breakdown,
--     LEFT(agr.feedback, 100) as feedback_preview,
--     agr.created_at
-- FROM ai_grading_result agr
-- JOIN user_answer ua ON agr.user_answer_id = ua.user_answer_id
-- JOIN question q ON ua.question_id = q.question_id
-- JOIN exam_attempt ea ON ua.attempt_id = ea.attempt_id
-- JOIN user u ON ea.user_id = u.user_id
-- ORDER BY agr.created_at DESC
-- LIMIT 10;

-- ============================================
-- END OF SQL QUERIES
-- ============================================
