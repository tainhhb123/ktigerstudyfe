-- =====================================================
-- TOPIK 91 - WRITING SECTION (쓰기)
-- Section ID: 2 (WRITING section)
-- Exam ID: 3 (TOPIK II)
-- =====================================================

-- Xóa dữ liệu cũ của phần Writing (nếu muốn update)
-- DELETE FROM question WHERE section_id = 2;

-- =====================================================
-- CÂU 51 (10 điểm = 2 chỗ trống × 5 điểm)
-- Loại: SHORT - Điền từ vào chỗ trống
-- =====================================================

-- Câu 51 (ㄱ) - 5 điểm
-- Đáp án mẫu: ① 변경하고 싶습니다 / 바꾸고 싶습니다
UPDATE question SET 
    passage_text = '안녕하세요. 제가 13일에 일이 생겨서 병원에 못 가게 되었습니다. 그래서 예약을 14일 오전 10시로 ( ㄱ ). 만약에 이날 예약이 ( ㄴ ) 저는 15일 오전도 괜찮습니다.',
    correct_answer = '변경하고 싶습니다|바꾸고 싶습니다|바꿔 주시겠어요|바꿔 주세요',
    question_text = '(ㄱ)',
    points = 5.00,
    question_type = 'SHORT',
    group_id = 51
WHERE question_id = 23;

-- Câu 51 (ㄴ) - 5 điểm
-- Đáp án mẫu: ② 불가능하면 / 어려우면
UPDATE question SET 
    passage_text = '안녕하세요. 제가 13일에 일이 생겨서 병원에 못 가게 되었습니다. 그래서 예약을 14일 오전 10시로 ( ㄱ ). 만약에 이날 예약이 ( ㄴ ) 저는 15일 오전도 괜찮습니다.',
    correct_answer = '불가능하면|어려우면|안 되면|잘 안 되면',
    question_text = '(ㄴ)',
    points = 5.00,
    question_type = 'SHORT',
    group_id = 51
WHERE question_id = 24;

-- =====================================================
-- CÂU 52 (10 điểm = 2 chỗ trống × 5 điểm)
-- Loại: SHORT - Điền từ vào chỗ trống
-- =====================================================

-- Câu 52 (ㄱ) - 5 điểm
-- Đáp án mẫu: ① 중독된다고 한다
UPDATE question SET 
    passage_text = '전문가에 따르면 스마트폰을 과도하게 사용하면 ( ㄱ ). 실제로 스마트폰 없이는 불안해하는 사람들이 늘고 있다. 이런 현상을 막으려면 ( ㄴ ).',
    correct_answer = '중독된다고 한다|중독된다고 합니다|중독이 된다고 한다',
    question_text = '(ㄱ)',
    points = 5.00,
    question_type = 'SHORT',
    group_id = 52
WHERE question_id = 25;

-- Câu 52 (ㄴ) - 5 điểm  
-- Đáp án mẫu: ② 먹지 않도록
UPDATE question SET 
    passage_text = '전문가에 따르면 스마트폰을 과도하게 사용하면 ( ㄱ ). 실제로 스마트폰 없이는 불안해하는 사람들이 늘고 있다. 이런 현상을 막으려면 ( ㄴ ).',
    correct_answer = '먹지 않도록|사용하지 않도록|쓰지 않도록',
    question_text = '(ㄴ)',
    points = 5.00,
    question_type = 'SHORT',
    group_id = 52
WHERE question_id = 26;

-- =====================================================
-- CÂU 53 (30 điểm)
-- Loại: ESSAY - Viết đoạn văn mô tả biểu đồ (200-300 ký tự)
-- =====================================================

-- Kiểm tra nếu đã tồn tại question_id = 27 cho câu 53
-- Nếu chưa có thì INSERT, nếu có rồi thì UPDATE

-- INSERT câu 53 mới (nếu cần)
INSERT INTO question (question_id, audio_url, correct_answer, group_id, image_url, passage_text, points, question_number, question_text, question_type, section_id)
VALUES (
    53,  -- question_id mới
    NULL,
    -- correct_answer = BÀI MẪU THAM KHẢO (288 ký tự)
    '산업경제연구소의 조사에 따르면 대형 마트의 매출액은 2015년에 24조 2천억 원이었던 것이 2022년에 24조 3천억 원으로 큰 변화가 없었다. 그에 비해 편의점 매출액은 2015년에 17조 2천억 원이었던 것이 2022년에 22조 3천억 원으로 크게 증가한 것을 알 수 있었다. 이렇게 편의점 매출액이 크게 증가한 원인은 첫째, 편의점 수가 증가하여 고객 접근성이 향상되고, 둘째, 소포장 상품의 수요가 증가했기 때문이다. 이런 추세로 볼 때 2023년에는 편의점의 매출액이 대형 마트를 넘어설 것으로 전망된다.',
    NULL,
    -- image_url = Biểu đồ (nếu có)
    'https://res.cloudinary.com/di6d1g736/image/upload/v1765900000/topik91_q53_chart.png',
    -- passage_text = ĐỀ BÀI
    '다음을 참고하여 ''대형 마트와 편의점 매출액 변화''에 대한 글을 200~300자로 쓰시오. (단, 글의 제목을 쓰지 마시오.)\n\n[조사 기관: 산업경제연구소]\n\n<대형 마트 매출액>\n- 2015년: 24조 2천억 원\n- 2022년: 24조 3천억 원\n\n<편의점 매출액>\n- 2015년: 17조 2천억 원\n- 2022년: 22조 3천억 원\n\n<편의점 매출액 증가 원인>\n- 편의점 수 증가 → 고객 접근성 향상\n- 소포장 상품 수요 증가',
    30.00,
    53,
    NULL,
    'ESSAY',
    2
)
ON DUPLICATE KEY UPDATE
    passage_text = VALUES(passage_text),
    correct_answer = VALUES(correct_answer),
    points = VALUES(points),
    question_type = VALUES(question_type);

-- =====================================================
-- CÂU 54 (50 điểm)
-- Loại: ESSAY - Viết bài luận (600-700 ký tự)
-- Chủ đề: 가짜 뉴스의 문제점과 해결 방안
-- =====================================================

INSERT INTO question (question_id, audio_url, correct_answer, group_id, image_url, passage_text, points, question_number, question_text, question_type, section_id)
VALUES (
    54,  -- question_id mới
    NULL,
    -- correct_answer = BÀI MẪU THAM KHẢO (699 ký tự)
    '정보 통신 기술의 발달과 소셜 미디어의 대중화로 인해 이 시대에는 누구나 쉽게 정보를 생산하고 불특정 다수와 공유할 수 있게 되었다. 이는 정보를 생산하고 유통하는 데 매체가 신문이나 방송과 같은 전통적 미디어에서 디지털 미디어 플랫폼으로 확장되면서 가능해진 것이다. 나아가 그 과정에서 경제적 가치를 창출하는 것 역시 가능해지면서 다양한 문제가 양산되고 있다. 사람들의 이목을 끌기 위한 가짜 뉴스의 등장도 그 문제 중 하나이다.\n\n가짜 뉴스는 정보 수용자로 하여금 잘못된 지식과 신념, 편향한 사고를 형성하게 한다. 가짜 뉴스의 소재가 되는 개인이나 기업, 단체의 경우 이미지 타격과 경제적 피해는 물론이고 사회적으로 재기가 어려울 정도로 명예가 훼손되기도 한다. 또한 가짜 뉴스는 혐오를 확산하고 사회적 불안을 야기하며 사회 구성원들의 통합을 방해한다. 나아가 가짜 뉴스 정치 및 외교적 문제를 심화될 기능성도 있기 때문에 심각한 사회 문제라 할 수 있다.\n\n가짜 뉴스를 근절하기 위해서는 우선 제도적으로 가짜 뉴스의 생산과 유통이 불법적 행위임을 규정하고, 가짜 뉴스 단속을 위한 기구를 만들어 가짜 뉴스가 확산되지 않도록 규제를 강화해야 한다. 또한 각종 캠페인이나 교육을 통해 가짜 뉴스의 위험성과 위험성을 알리는 것 역시 필요하다. 나아가 정보의 진위를 판단하는 기술을 개발해 가짜 뉴스가 정보 수용자에게 전달되는 것을 방지하는 것도 좋은 방법일 것이다.',
    NULL,
    NULL,
    -- passage_text = ĐỀ BÀI
    '다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)\n\n주제: 가짜 뉴스의 문제점과 해결 방안\n\n• 가짜 뉴스의 문제점은 무엇인가?\n• 가짜 뉴스를 근절하기 위한 방안은 무엇인가?',
    50.00,
    54,
    NULL,
    'ESSAY',
    2
)
ON DUPLICATE KEY UPDATE
    passage_text = VALUES(passage_text),
    correct_answer = VALUES(correct_answer),
    points = VALUES(points),
    question_type = VALUES(question_type);

-- =====================================================
-- KIỂM TRA KẾT QUẢ
-- =====================================================

SELECT 
    question_id,
    question_number,
    question_text,
    question_type,
    points,
    SUBSTRING(correct_answer, 1, 50) as correct_answer_preview,
    SUBSTRING(passage_text, 1, 80) as passage_text_preview
FROM question 
WHERE section_id = 2
ORDER BY question_number, question_text;

-- =====================================================
-- TỔNG KẾT WRITING SECTION (100 điểm)
-- =====================================================
-- Câu 51: 10 điểm (2 chỗ trống × 5đ) - SHORT
--   - (ㄱ): 변경하고 싶습니다 / 바꾸고 싶습니다
--   - (ㄴ): 불가능하면 / 어려우면
-- Câu 52: 10 điểm (2 chỗ trống × 5đ) - SHORT
--   - (ㄱ): 중독된다고 한다
--   - (ㄴ): 먹지 않도록
-- Câu 53: 30 điểm - ESSAY (200-300 ký tự)
-- Câu 54: 50 điểm - ESSAY (600-700 ký tự)
-- =====================================================
