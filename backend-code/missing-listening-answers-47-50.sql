-- ============================================
-- MISSING ANSWER CHOICES & QUESTIONS 47-50
-- ============================================

-- Answer choices for Question 147 (câu 47)
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4701, 147, 'A', '건설비와 임대료는 고정 비용에 포함되지 않는다.', b'0'),
(4702, 147, 'B', '소상공인의 경영난은 인플레이션과 관련이 있다.', b'1'),
(4703, 147, 'C', '매출 의존도가 낮은 경우 재무를 조정할 수 있다.', b'0'),
(4704, 147, 'D', '임대 비용 때문에 빚을 지는 소상공인이 많아지고 있다.', b'0');

-- Answer choices for Question 148 (câu 48)
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4801, 148, 'A', '소상공인의 부담을 덜어 주어야 한다고 생각하고 있다.', b'1'),
(4802, 148, 'B', '정책 시행에 따른 부작용을 우려하고 있다.', b'0'),
(4803, 148, 'C', '소상공인에 대한 지원이 시급하다고 판단하고 있다.', b'0'),
(4804, 148, 'D', '소상공인의 현실성과 가치를 경제적 효과로 설명하고 있다.', b'0');

-- [49-50] Group 49: 도덕성과 철학
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(149, 1, 49, 49, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'B', 2.00),
(150, 1, 49, 50, 'MCQ', '남자의 태도로 알맞은 것을 고르십시오.', 'C', 2.00);

-- Answer choices for Question 149 (câu 49)
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4901, 149, 'A', '철학자는 도덕성에 대해 일관적인 견해를 따르고 있다.', b'0'),
(4902, 149, 'B', '이 철학자는 도덕성을 평가하는 기준에서 관점을 바꿨다.', b'1'),
(4903, 149, 'C', '철학자는 따로 생각할 시간을 가지는 것이 도덕적 의무가 아니다.', b'0'),
(4904, 149, 'D', '이 철학자에 따르면 어떤 상황에서도 다른 사람을 돕는 것이 최우선이다.', b'0');

-- Answer choices for Question 150 (câu 50)
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(5001, 150, 'A', '도덕적 행위의 동기성을 강조하고 있다.', b'0'),
(5002, 150, 'B', '도덕적 행위의 가치를 과대평가하고 있다.', b'0'),
(5003, 150, 'C', '도덕성에 대한 철학적 관점을 제시하고 있다.', b'1'),
(5004, 150, 'D', '도덕성에 대한 연구의 필요성을 제기하고 있다.', b'0');

COMMIT;
