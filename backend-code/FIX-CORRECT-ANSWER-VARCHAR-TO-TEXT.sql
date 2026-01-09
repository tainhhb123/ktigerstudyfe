-- =====================================================
-- FIX: Column correct_answer quá ngắn (VARCHAR(10))
-- Cần đổi thành TEXT để chứa đáp án dài
-- =====================================================

-- KIỂM TRA COLUMN HIỆN TẠI
DESCRIBE question;

-- ALTER COLUMN từ VARCHAR(10) → TEXT
ALTER TABLE question 
MODIFY COLUMN correct_answer TEXT DEFAULT NULL;

-- KIỂM TRA LẠI SAU KHI SỬA
DESCRIBE question;

-- =====================================================
-- LƯU Ý:
-- - VARCHAR(10) chỉ chứa tối đa 10 ký tự
-- - TEXT có thể chứa tối đa 65,535 ký tự
-- - Sau khi chạy lệnh này, backend Entity cũng cần cập nhật:
--   @Column(name = "correct_answer", columnDefinition = "TEXT")
-- =====================================================
