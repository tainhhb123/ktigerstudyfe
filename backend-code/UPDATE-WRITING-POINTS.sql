-- ============================================
-- KIỂM TRA ĐIỂM WRITING SECTION THEO TOPIK II
-- ============================================

-- Kiểm tra điểm hiện tại của câu Writing
SELECT question_number, question_type, points, section_id
FROM question 
WHERE section_id IN (SELECT section_id FROM section WHERE section_type = 'WRITING')
ORDER BY question_number;

-- ============================================
-- CẤU TRÚC ĐIỂM TOPIK II WRITING (Tổng: 100 điểm):
-- 
-- Câu 51: 10 điểm = 2 chỗ trống × 5 điểm
--   - 51 (ㄱ): 5 điểm
--   - 51 (ㄴ): 5 điểm
--
-- Câu 52: 10 điểm = 2 chỗ trống × 5 điểm  
--   - 52 (ㄱ): 5 điểm
--   - 52 (ㄴ): 5 điểm
--
-- Câu 53: 30 điểm (ESSAY 200-300 ký tự)
-- Câu 54: 50 điểm (ESSAY 600-700 ký tự)
--
-- Tổng: 5+5+5+5+30+50 = 100 điểm
-- ============================================

-- CHỈ CẦN UPDATE NẾU điểm CHƯA ĐÚNG
-- Mỗi chỗ trống SHORT = 5 điểm (KHÔNG update thành 10!)
-- UPDATE question SET points = 5.00 WHERE question_number = 51 AND question_type = 'SHORT';
-- UPDATE question SET points = 5.00 WHERE question_number = 52 AND question_type = 'SHORT';

-- Update câu 53: 30 điểm (nếu cần)
UPDATE question 
SET points = 30.00 
WHERE question_number = 53 
  AND section_id IN (SELECT section_id FROM section WHERE section_type = 'WRITING');

-- Update câu 54: 50 điểm (nếu cần)
UPDATE question 
SET points = 50.00 
WHERE question_number = 54 
  AND section_id IN (SELECT section_id FROM section WHERE section_type = 'WRITING');

-- ============================================
-- KIỂM TRA SAU KHI UPDATE
-- ============================================
SELECT question_number, question_type, points, 
       CASE 
         WHEN question_number IN (51, 52) AND question_type = 'SHORT' THEN '5 điểm/chỗ trống (2 chỗ = 10 điểm)'
         WHEN question_number = 53 THEN '30 điểm (ESSAY)'
         WHEN question_number = 54 THEN '50 điểm (ESSAY)'
       END as expected_points
FROM question 
WHERE section_id IN (SELECT section_id FROM section WHERE section_type = 'WRITING')
ORDER BY question_number;

-- ============================================
-- TỔNG ĐIỂM TOÀN BỘ ĐỀ THI (phải = 300)
-- ============================================
SELECT 
    s.section_type,
    COUNT(q.question_id) as total_questions,
    SUM(q.points) as total_points
FROM question q
JOIN section s ON q.section_id = s.section_id
GROUP BY s.section_type
ORDER BY s.section_type;

-- Tổng điểm đề thi
SELECT SUM(points) as exam_total_points FROM question;
-- Kết quả mong đợi: 300 (Listening 100 + Reading 100 + Writing 100)
