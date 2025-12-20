-- ============================================
-- LISTENING SECTION - Câu 4-16
-- ============================================

-- [4-8] Group 4: Nghe và chọn câu tiếp theo phù hợp
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(104, 1, 4, 4, 'MCQ', '다음을 듣고 이어질 수 있는 말을 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(105, 1, 4, 5, 'MCQ', '다음을 듣고 이어질 수 있는 말을 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(106, 1, 4, 6, 'MCQ', '다음을 듣고 이어질 수 있는 말을 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(107, 1, 4, 7, 'MCQ', '다음을 듣고 이어질 수 있는 말을 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(108, 1, 4, 8, 'MCQ', '다음을 듣고 이어질 수 있는 말을 가장 알맞은 것을 고르십시오.', 'C', 2.00);

-- Answer choices for Question 4
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(401, 104, 'A', '그래? 안 나와서 걱정했어.', b'1'),
(402, 104, 'B', '무슨 학원에 다니고 있어?', b'0'),
(403, 104, 'C', '그래? 할머니 댁에 언제 가?', b'0'),
(404, 104, 'D', '부모님과 함께 가기로 했거든.', b'0');

-- Answer choices for Question 5
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(501, 105, 'A', '그럼 거기로 다시 가 볼까요?', b'1'),
(502, 105, 'B', '그럼 한 군데만 와 가봤어요.', b'0'),
(503, 105, 'C', '그럼 이 소파를 사는 게 어때요?', b'0'),
(504, 105, 'D', '집 근처에 있는 소파 가게에서 샀어요.', b'0');

-- Answer choices for Question 6
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(601, 106, 'A', '면접 날짜를 다시 확인하고 알려 줘.', b'0'),
(602, 106, 'B', '준비 많이 했으니까 잘할 수 있을 거야.', b'1'),
(603, 106, 'C', '면접 보기 전이라 더 떨린다니 대단하다.', b'0'),
(604, 106, 'D', '생각하지 못한 질문을 받아서 정말 놀랐겠네.', b'0');

-- Answer choices for Question 7
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(701, 107, 'A', '맞아요. 이런 작품은 내용이 별로였어요.', b'0'),
(702, 107, 'B', '그래요? 이 드라마는 보던 다른 작품도 재미있었어요.', b'1'),
(703, 107, 'C', '맞아요. 이 드라마는 몇 번을 다시 봐도 재미있네요.', b'0'),
(704, 107, 'D', '그래요? 이 작가가 처음으로 쓴 작품이 참 별로예요.', b'0');

-- Answer choices for Question 8
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(801, 108, 'A', '빨리 다녀오는 게 좋겠네요.', b'0'),
(802, 108, 'B', '운동화를 깨끗하게 신고 오세요.', b'0'),
(803, 108, 'C', '힘 써야 할 것 같으니 최대한 많이 챙겨요.', b'1'),
(804, 108, 'D', '집에 돌아가서 다시 한번 지워 보려고요.', b'0');


-- ============================================
-- [9-12] Group 9: Nghe và chọn hành động tiếp theo
-- ============================================

INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(109, 1, 9, 9, 'MCQ', '다음을 듣고 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(110, 1, 9, 10, 'MCQ', '다음을 듣고 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(111, 1, 9, 11, 'MCQ', '다음을 듣고 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.', 'C', 2.00),
(112, 1, 9, 12, 'MCQ', '다음을 듣고 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.', 'D', 2.00);

-- Answer choices for Question 9
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(901, 109, 'A', '전화를 산다.', b'1'),
(902, 109, 'B', '기차를 탄다.', b'0'),
(903, 109, 'C', '자리에 앉는다.', b'0'),
(904, 109, 'D', '카페로 들어간다.', b'0');

-- Answer choices for Question 10
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1001, 110, 'A', '고객 대기실로 간다.', b'1'),
(1002, 110, 'B', '남자에게 열쇠를 준다.', b'0'),
(1003, 110, 'C', '차의 상태를 확인한다.', b'0'),
(1004, 110, 'D', '차를 수리점에 예약한다.', b'0');

-- Answer choices for Question 11
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1101, 111, 'A', '방문을 찾아본다.', b'0'),
(1102, 111, 'B', '직원에게 물어본다.', b'0'),
(1103, 111, 'C', '미술 작품을 고른다.', b'1'),
(1104, 111, 'D', '남자에게 제품 이름을 말한다.', b'0');

-- Answer choices for Question 12
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1201, 112, 'A', '촬영팀에게 연락한다.', b'0'),
(1202, 112, 'B', '공연 무대를 점검한다.', b'0'),
(1203, 112, 'C', '진행 순서를 설명한다.', b'0'),
(1204, 112, 'D', '공연장을 미리 간다.', b'1');


-- ============================================
-- [13-16] Group 13: Nghe và chọn nội dung đúng
-- ============================================

INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(113, 1, 13, 13, 'MCQ', '다음을 듣고 들은 내용과 같은 것을 고르십시오.', 'D', 2.00),
(114, 1, 13, 14, 'MCQ', '다음을 듣고 들은 내용과 같은 것을 고르십시오.', 'A', 2.00),
(115, 1, 13, 15, 'MCQ', '다음을 듣고 들은 내용과 같은 것을 고르십시오.', 'C', 2.00),
(116, 1, 13, 16, 'MCQ', '다음을 듣고 들은 내용과 같은 것을 고르십시오.', 'A', 2.00);

-- Answer choices for Question 13
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1301, 113, 'A', '이곳이 여자의 매출이 늘어난 곳이다.', b'0'),
(1302, 113, 'B', '여자는 이곳에 처음 와 봤다.', b'0'),
(1303, 113, 'C', '남자는 인구조사에 간 적이 없다.', b'0'),
(1304, 113, 'D', '인구조사는 지금까지 같은 자리에 있다.', b'1');

-- Answer choices for Question 14
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1401, 114, 'A', '분실물은 구두 매장에 있었다.', b'1'),
(1402, 114, 'B', '모두 안내에 직원이 설명했다.', b'0'),
(1403, 114, 'C', '고객 센터는 구두 매장 옆에 있다.', b'0'),
(1404, 114, 'D', '지갑을 잃어버린 사람은 1층으로 가면 된다.', b'0');

-- Answer choices for Question 15
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1501, 115, 'A', '이 사고는 어젯밤에 발생했다.', b'0'),
(1502, 115, 'B', '이 사고로 인해 사람들이 크게 다쳤다.', b'0'),
(1503, 115, 'C', '경찰은 사고 원인에 대해 조사하고 있다.', b'1'),
(1504, 115, 'D', '낙석과는 다른 바위가 흘러내리는 사고가 났다.', b'0');

-- Answer choices for Question 16
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1601, 116, 'A', '여자는 수술 과정에 참여한다.', b'1'),
(1602, 116, 'B', '여자는 보호자의 집에서 동물을 돌본다.', b'0'),
(1603, 116, 'C', '여자의 직업은 사람들에게 잘 알려져 있다.', b'0'),
(1604, 116, 'D', '동물의 상태를 관찰하는 일은 여자의 업무가 아니다.', b'0');


-- [17-20] Group 17: Nghe và chọn ý tưởng trung tâm của nam
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(117, 1, 17, 17, 'MCQ', '다음을 듣고 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'D', 2.00),
(118, 1, 17, 18, 'MCQ', '다음을 듣고 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(119, 1, 17, 19, 'MCQ', '다음을 듣고 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'A', 2.00),
(120, 1, 17, 20, 'MCQ', '다음을 듣고 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'B', 2.00);

-- Answer choices for Question 17
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1701, 117, 'A', '채식 식사를 미리 준비해 두는 것이 좋다.', b'0'),
(1702, 117, 'B', '음식물 알레르기가 있는지 먼저 확인해야 한다.', b'0'),
(1703, 117, 'C', '직장을 위해서 식사를 규칙적으로 해야 한다.', b'0'),
(1704, 117, 'D', '직장에서는 되도록 밖에서 사 먹는 것이 좋다.', b'1');

-- Answer choices for Question 18
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1801, 118, 'A', '친구가 힘들 때는 옆에 있어 주는 것이 중요하다.', b'1'),
(1802, 118, 'B', '사람들과 넓은 인간관계를 유지해야 한다.', b'0'),
(1803, 118, 'C', '다툰 사람과 다시 만날 때는 말을 조심해야 한다.', b'0'),
(1804, 118, 'D', '친구와 문제가 생기면 바로 해결해야 한다.', b'0');

-- Answer choices for Question 19
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(1901, 119, 'A', '여행은 여유롭게 가는 것이 좋다.', b'1'),
(1902, 119, 'B', '여행을 자주 가는 것은 좋지 않다.', b'0'),
(1903, 119, 'C', '여행에서 다양한 경험을 해 보는 것이 중요하다.', b'0'),
(1904, 119, 'D', '여행에는 미리 예산을 정해 둘 필요가 있다.', b'0');

-- Answer choices for Question 20
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2001, 120, 'A', '광고의 수를 줄이는 것이 효과적이다.', b'0'),
(2002, 120, 'B', '광고는 대중의 호기심을 자극해야 한다.', b'1'),
(2003, 120, 'C', '광고는 제품의 정보를 사실대로 전달해야 한다.', b'0'),
(2004, 120, 'D', '광고는 누구나 쉽게 이해할 수 있어야 한다.', b'0');

-- ============================================
-- [21-50] Các cặp câu hỏi (2 câu/nhóm)
-- ============================================

-- [21-22] Group 21
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(121, 1, 21, 21, 'MCQ', '남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(122, 1, 21, 22, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'C', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2101, 121, 'A', '회의 내용을 빠짐없이 기록해야 한다.', b'0'),
(2102, 121, 'B', '회의 때 낭비되는 종이를 줄이는 것이 좋다.', b'1'),
(2103, 121, 'C', '회의실을 지금보다 더 큰 곳으로 바꿔야 한다.', b'0'),
(2104, 121, 'D', '발표 자료를 알아보기 쉽게 만드는 것이 중요하다.', b'0'),
(2201, 122, 'A', '이번 회의는 발표 자료 없이 진행된다.', b'0'),
(2202, 122, 'B', '여자는 회의에서 쓸 자료를 복사할 예정이다.', b'0'),
(2203, 122, 'C', '남자는 회의 때 대형 화면을 사용한 적이 있다.', b'1'),
(2204, 122, 'D', '여자는 회의 자료를 이미 이메일로 보내 놓았다.', b'0');

-- [23-24] Group 23
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(123, 1, 23, 23, 'MCQ', '남자가 무엇을 하고 있는지 고르십시오.', 'D', 2.00),
(124, 1, 23, 24, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'C', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2301, 123, 'A', '상품의 위치를 확인하고 있다.', b'0'),
(2302, 123, 'B', '가게 운영에 대한 조언을 구하고 있다.', b'0'),
(2303, 123, 'C', '구매한 물건의 사용 방법을 묻고 있다.', b'0'),
(2304, 123, 'D', '환불 조건이 있는지 알아보고 있다.', b'1'),
(2401, 124, 'A', '여자의 가게에는 크기가 다른 냉장고가 없다.', b'0'),
(2402, 124, 'B', '남자는 가게에서 커피를 몇 잔 마셔 봤다.', b'0'),
(2403, 124, 'C', '남자의 가게에는 유리문이 달린 냉장고가 있다.', b'1'),
(2404, 124, 'D', '여자의 가게에서는 새로 나온 제품만 판매한다.', b'0');

-- [25-26] Group 25
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(125, 1, 25, 25, 'MCQ', '남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(126, 1, 25, 26, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'D', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2501, 125, 'A', '마을 축제에 대한 주민들의 관심이 필요하다.', b'0'),
(2502, 125, 'B', '대중의 반응을 고려해 축제의 성공을 판단해야 한다.', b'1'),
(2503, 125, 'C', '축제에서 판매할 기념품을 새로 제작하는 것이 좋다.', b'0'),
(2504, 125, 'D', '축제를 기획할 때 성공 사례를 충분히 검토해야 한다.', b'0'),
(2601, 126, 'A', '이 마을은 어느 시기에 가장 유명했다.', b'0'),
(2602, 126, 'B', '이 마을의 축제는 예전과 달라졌다.', b'0'),
(2603, 126, 'C', '이 마을은 방문객이 줄어들고 있다.', b'0'),
(2604, 126, 'D', '이 마을의 축제는 관광객에게 좋은 반응을 얻었다.', b'1');

-- [27-28] Group 27
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(127, 1, 27, 27, 'MCQ', '남자가 말하는 의도로 알맞은 것을 고르십시오.', 'D', 2.00),
(128, 1, 27, 28, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'A', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2701, 127, 'A', '이 과자의 맛이 달라진 것을 지적하려고', b'0'),
(2702, 127, 'B', '이 과자가 생산되게 된 이유를 알려 주려고', b'0'),
(2703, 127, 'C', '이 과자의 생산이 중단될 것이라는 소식을 전하려고', b'0'),
(2704, 127, 'D', '이 과자를 구하기 어려운 점에 대해 불평하려고', b'1'),
(2801, 128, 'A', '이 과자는 작년 시장에 출시되었다.', b'1'),
(2802, 128, 'B', '남자는 이 과자를 구입할 계획이 있다.', b'0'),
(2803, 128, 'C', '이 과자는 소비자들의 관심을 끌지 못했다.', b'0'),
(2804, 128, 'D', '여자는 남자에게 이 과자를 처음 소개했다.', b'0');

-- [29-30] Group 29
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(129, 1, 29, 29, 'MCQ', '남자가 누구인지 고르십시오.', 'D', 2.00),
(130, 1, 29, 30, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'D', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(2901, 129, 'A', '도로를 정비하는 사람', b'0'),
(2902, 129, 'B', '교통 상황을 안내하는 사람', b'0'),
(2903, 129, 'C', '도로에 CCTV를 설치하는 사람', b'0'),
(2904, 129, 'D', '방송에서 교통 상황을 알려 주는 사람', b'1'),
(3001, 130, 'A', '남자는 매일 오전에 근무를 시작한다.', b'0'),
(3002, 130, 'B', '남자는 이 일을 할 때 긴장하지 않는다.', b'0'),
(3003, 130, 'C', '남자는 CCTV를 보면서 일을 한다.', b'0'),
(3004, 130, 'D', '남자의 일에는 시민들이 보낸 문자가 도움이 된다.', b'1');

-- [31-32] Group 31
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(131, 1, 31, 31, 'MCQ', '남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'C', 2.00),
(132, 1, 31, 32, 'MCQ', '남자의 태도로 가장 알맞은 것을 고르십시오.', 'B', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(3101, 131, 'A', '시설을 단순 작업으로 옮겨서 설치해야 한다.', b'0'),
(3102, 131, 'B', '시설의 설치 효과에 대한 평가가 필요하다.', b'0'),
(3103, 131, 'C', '시설 설치에 대한 홍보를 통해 참여를 유도해야 한다.', b'1'),
(3104, 131, 'D', '시설의 설치 사실을 주민들에게 바로 알리는 것이 좋다.', b'0'),
(3201, 132, 'A', '시설의 운영 방법에 대해 걱정하고 있다.', b'0'),
(3202, 132, 'B', '시설의 안전 문제를 신중하게 생각하고 있다.', b'1'),
(3203, 132, 'C', '상대방에게 적극적인 협조를 요구하고 있다.', b'0'),
(3204, 132, 'D', '상황이 심각해진 것에 대해 책임을 느끼고 있다.', b'0');

-- [33-34] Group 33
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(133, 1, 33, 33, 'MCQ', '무엇에 대한 내용인지 알맞은 것을 고르십시오.', 'D', 2.00),
(134, 1, 33, 34, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'B', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(3301, 133, 'A', '음악을 감상하는 올바른 방법', b'0'),
(3302, 133, 'B', '음악과 재능이 발달하는 결정적 시기', b'0'),
(3303, 133, 'C', '노인을 대상으로 하는 연구에서 주의할 점', b'0'),
(3304, 133, 'D', '음악 활동이 노인의 인지 기능에 미치는 영향', b'1'),
(3401, 134, 'A', '이 연구는 약 1년 동안 진행되었다.', b'0'),
(3402, 134, 'B', '이 실험의 결과는 연구 대상에 따라 달랐다.', b'1'),
(3403, 134, 'C', '실험에서는 집단을 동일한 조건으로 나누었다.', b'0'),
(3404, 134, 'D', '이 실험은 음악을 전공한 사람들을 대상으로 했다.', b'0');

-- [35-36] Group 35
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(135, 1, 35, 35, 'MCQ', '남자가 무엇을 하고 있는지 고르십시오.', 'A', 2.00),
(136, 1, 35, 36, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'B', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(3501, 135, 'A', '이 편지가 가지는 가치와 의미를 알리고 있다.', b'1'),
(3502, 135, 'B', '편지의 보존 상태에 대해 아쉬움을 표현하고 있다.', b'0'),
(3503, 135, 'C', '편지를 발견한 장소와 발견 과정을 설명하고 있다.', b'0'),
(3504, 135, 'D', '편지를 전달하는 데 도움을 준 사람들에게 감사하고 있다.', b'0'),
(3601, 136, 'A', '이 편지는 곧 박물관에 전시될 것이다.', b'0'),
(3602, 136, 'B', '이 편지는 문인의 방식이 아닌 방법으로 쓰였다.', b'1'),
(3603, 136, 'C', '이 편지가 어느 시대의 것인지는 밝혀지지 않았다.', b'0'),
(3604, 136, 'D', '편지를 보존하기 위한 논의가 진행 중이다.', b'0');

-- [37-38] Group 37
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(137, 1, 37, 37, 'MCQ', '여자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(138, 1, 37, 38, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'C', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(3701, 137, 'A', '농작물 재배를 위한 경로를 확보해야 한다.', b'0'),
(3702, 137, 'B', '산림 훼손을 막을 수 있는 노력이 필요하다.', b'1'),
(3703, 137, 'C', '농촌 지역의 일손 부족을 해결해야 한다.', b'0'),
(3704, 137, 'D', '산림 관리 정책이 정착될 때까지 시간이 필요하다.', b'0'),
(3801, 138, 'A', '한국은 산림 수입 비율이 높은 편이다.', b'0'),
(3802, 138, 'B', '한국은 산림 관리 수준을 강화하고 있다.', b'0'),
(3803, 138, 'C', '나무가 30년 이상 되면 산림 훼손이 늘어난다.', b'1'),
(3804, 138, 'D', '한국의 산에는 심은 지 얼마 안 된 나무가 많다.', b'0');

-- [39-40] Group 39
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(139, 1, 39, 39, 'MCQ', '이 대화 전의 내용으로 가장 알맞은 것을 고르십시오.', 'B', 2.00),
(140, 1, 39, 40, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'C', 2.00);

INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(3901, 139, 'A', '인공위성을 활용하는 신기술이 개발되었다.', b'0'),
(3902, 139, 'B', '위성 관측에 대한 활용성이 확대되는 사례가 있었다.', b'1'),
(3903, 139, 'C', '우주 탐사를 위해 여러 나라가 사람을 보냈다.', b'0'),
(3904, 139, 'D', '우주 탐사를 위한 인력을 양성하는 사업이 시작되었다.', b'0'),
(4001, 140, 'A', '위성 관측의 목적이 위성 통신이다.', b'0'),
(4002, 140, 'B', '위성 활용은 구체적인 내용으로 구성되어 있다.', b'0'),
(4003, 140, 'C', '우주 활용은 경제적인 효과를 가지고 있다.', b'1'),
(4004, 140, 'D', '인공위성으로 인한 환경 문제는 일어나지 않는다.', b'0');

-- [41-42] Group 41: 제품 품질 관리
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(141, 1, 41, 41, 'MCQ', '이 작업의 중심 내용으로 가장 알맞은 것을 고르십시오.', 'C', 2.00),
(142, 1, 41, 42, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'D', 2.00);

-- Answer choices for Question 41
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4101, 141, 'A', '제품의 품질은 부품의 질에 의해 결정된다.', b'0'),
(4102, 141, 'B', '제품의 원자재 공급에 크게 의존하고 있다.', b'0'),
(4103, 141, 'C', '제품에 대한 고객의 의견을 반영하는 것이 중요하다.', b'1'),
(4104, 141, 'D', '제품은 시장 확대를 통해 발전을 도모하고 있다.', b'0');

-- Answer choices for Question 42
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4201, 142, 'A', '이 업체는 엔진 분야에 어려움을 겪고 있다.', b'0'),
(4202, 142, 'B', '생산량이 경제적인 이유로 감소하고 있다.', b'0'),
(4203, 142, 'C', '이 업체는 안정적인 수익을 얻지 못하고 있다.', b'0'),
(4204, 142, 'D', '이 업체는 혁신적인 품질 관리 시스템을 마련했다.', b'1');

-- [43-44] Group 43: 종묘 정전
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(143, 1, 43, 43, 'MCQ', '무엇에 대한 내용인지 알맞은 것을 고르십시오.', 'A', 2.00),
(144, 1, 43, 44, 'MCQ', '종묘 정전에 대한 설명으로 맞는 것을 고르십시오.', 'D', 2.00);

-- Answer choices for Question 43
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4301, 143, 'A', '종묘 경전의 건축미', b'1'),
(4302, 143, 'B', '종묘 정전의 건립 과정', b'0'),
(4303, 143, 'C', '종묘 정전의 관리 방법', b'0'),
(4304, 143, 'D', '종묘 정전의 현대적 기능', b'0');

-- Answer choices for Question 44
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4401, 144, 'A', '지붕이 곡선 형태를 띠고 있다.', b'0'),
(4402, 144, 'B', '기둥에 화려한 장식이 새겨져 있다.', b'0'),
(4403, 144, 'C', '도심에서 멀리 떨어진 곳에 있다.', b'0'),
(4404, 144, 'D', '왕과 왕비의 제사를 지내는 공간이다.', b'1');

-- [45-46] Group 45: 승수와 미생물
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(145, 1, 45, 45, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'C', 2.00),
(146, 1, 45, 46, 'MCQ', '여자가 말하는 방식으로 알맞은 것을 고르십시오.', 'D', 2.00);

-- Answer choices for Question 45
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4501, 145, 'A', '승수는 감염이 잘 생기지 않는다.', b'0'),
(4502, 145, 'B', '승수는 소독만 잘되도록 하는 것이 좋다.', b'0'),
(4503, 145, 'C', '승수에는 유익한 미생물이 서식하고 있다.', b'1'),
(4504, 145, 'D', '승수를 제거하는 수술이 최근에 가능해졌다.', b'0');

-- Answer choices for Question 46
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4601, 146, 'A', '유사한 사례들을 묶어 비교 분석하고 있다.', b'0'),
(4602, 146, 'B', '대상이 되는 문제의 주요 원인을 요약하고 있다.', b'0'),
(4603, 146, 'C', '대상의 약점을 대비한 해결책을 설명하고 있다.', b'0'),
(4604, 146, 'D', '다양한 연구를 바탕으로 자신의 주장을 제시하고 있다.', b'1');

-- [47-48] Group 47: 소상공인 경영난
INSERT INTO question (question_id, section_id, group_id, question_number, question_type, question_text, correct_answer, points)
VALUES 
(147, 1, 47, 47, 'MCQ', '들은 내용과 같은 것을 고르십시오.', 'B', 2.00),
(148, 1, 47, 48, 'MCQ', '남자의 태도로 알맞은 것을 고르십시오.', 'A', 2.00);

-- Answer choices for Question 47
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4701, 147, 'A', '건설비와 임대료는 고정 비용에 포함되지 않는다.', b'0'),
(4702, 147, 'B', '소상공인의 경영난은 인플레이션과 관련이 있다.', b'1'),
(4703, 147, 'C', '매출 의존도가 낮은 경우 재무를 조정할 수 있다.', b'0'),
(4704, 147, 'D', '임대 비용 때문에 빚을 지는 소상공인이 많아지고 있다.', b'0');

-- Answer choices for Question 48
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

-- Answer choices for Question 49
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(4901, 149, 'A', '철학자는 도덕성에 대해 일관적인 견해를 따르고 있다.', b'0'),
(4902, 149, 'B', '이 철학자는 도덕성을 평가하는 기준에서 관점을 바꿨다.', b'1'),
(4903, 149, 'C', '철학자는 따로 생각할 시간을 가지는 것이 도덕적 의무가 아니다.', b'0'),
(4904, 149, 'D', '이 철학자에 따르면 어떤 상황에서도 다른 사람을 돕는 것이 최우선이다.', b'0');

-- Answer choices for Question 50
INSERT INTO answer_choice (choice_id, question_id, choice_label, choice_text, is_correct)
VALUES 
(5001, 150, 'A', '도덕적 행위의 동기성을 강조하고 있다.', b'0'),
(5002, 150, 'B', '도덕적 행위의 가치를 과대평가하고 있다.', b'0'),
(5003, 150, 'C', '도덕성에 대한 철학적 관점을 제시하고 있다.', b'1'),
(5004, 150, 'D', '도덕성에 대한 연구의 필요성을 제기하고 있다.', b'0');


-- ============================================
-- COMMIT
-- ============================================
COMMIT;
