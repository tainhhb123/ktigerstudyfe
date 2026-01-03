-- =====================================================
-- ADD AI GRADING COLUMNS TO user_answer TABLE
-- =====================================================
-- Chạy script này trong MySQL/phpMyAdmin để thêm các cột AI grading

-- Kiểm tra xem cột đã tồn tại chưa trước khi thêm
-- Nếu đã có thì bỏ qua

-- Thêm cột ai_score
ALTER TABLE user_answer 
ADD COLUMN IF NOT EXISTS ai_score INT DEFAULT NULL;

-- Thêm cột ai_feedback  
ALTER TABLE user_answer 
ADD COLUMN IF NOT EXISTS ai_feedback TEXT DEFAULT NULL;

-- Thêm cột ai_breakdown (JSON cho ESSAY)
ALTER TABLE user_answer 
ADD COLUMN IF NOT EXISTS ai_breakdown JSON DEFAULT NULL;

-- Thêm cột ai_suggestions (JSON array)
ALTER TABLE user_answer 
ADD COLUMN IF NOT EXISTS ai_suggestions JSON DEFAULT NULL;

-- =====================================================
-- Nếu MySQL không hỗ trợ IF NOT EXISTS, dùng cách này:
-- =====================================================

-- ALTER TABLE user_answer 
-- ADD COLUMN ai_score INT DEFAULT NULL,
-- ADD COLUMN ai_feedback TEXT DEFAULT NULL,
-- ADD COLUMN ai_breakdown JSON DEFAULT NULL,
-- ADD COLUMN ai_suggestions JSON DEFAULT NULL;

-- =====================================================
-- Kiểm tra kết quả:
-- =====================================================
-- DESCRIBE user_answer;
-- 
-- Kết quả mong đợi sẽ có các cột:
-- ai_score        | int          | YES  | NULL
-- ai_feedback     | text         | YES  | NULL  
-- ai_breakdown    | json         | YES  | NULL
-- ai_suggestions  | json         | YES  | NULL
