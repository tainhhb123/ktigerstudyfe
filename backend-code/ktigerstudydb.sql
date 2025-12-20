-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2025 at 02:36 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ktigerstudydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer_choice`
--

CREATE TABLE `answer_choice` (
  `choice_id` bigint(20) NOT NULL,
  `choice_label` varchar(10) NOT NULL,
  `choice_text` text NOT NULL,
  `is_correct` bit(1) DEFAULT NULL,
  `question_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `answer_choice`
--

INSERT INTO `answer_choice` (`choice_id`, `choice_label`, `choice_text`, `is_correct`, `question_id`) VALUES
(1, 'A', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854034/1_1_cmslxw.png', b'1', 1),
(2, 'B', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/1_2_ffa555.png', b'0', 1),
(3, 'C', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/1_3_eci6x9.png', b'0', 1),
(4, 'D', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/1_4_xyqq5r.png', b'0', 1),
(5, 'A', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/2_1_vx7f9q.png', b'0', 2),
(6, 'B', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/2_2_qriocz.png', b'1', 2),
(7, 'C', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/2_3_rs6a30.png', b'0', 2),
(8, 'D', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854033/2_4_etikel.png', b'0', 2),
(9, 'A', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854034/3_1_t8mvwx.png', b'0', 3),
(10, 'B', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854034/3_2_po34ez.png', b'0', 3),
(11, 'C', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854034/3_3_ptqmfn.png', b'1', 3),
(12, 'D', 'https://res.cloudinary.com/di6d1g736/image/upload/v1765854034/3_4_adrvay.png', b'0', 3),
(2101, 'A', '회의 내용을 빠짐없이 기록해야 한다.', b'0', 21),
(2102, 'B', '회의 때 낭비되는 종이를 줄이는 것이 좋다.', b'1', 21),
(2103, 'C', '회의실을 지금보다 더 큰 장소로 바꿔야 한다.', b'0', 21),
(2104, 'D', '발표 자료는 알아보기 쉽게 만드는 것이 좋다.', b'0', 21),
(2201, 'A', '이번 회의는 발표 자료 없이 진행된다.', b'0', 22),
(2202, 'B', '여자는 회의에서 쓸 자료를 복사할 예정이다.', b'0', 22),
(2203, 'C', '남자는 회의 때 대형 화면을 사용한 적이 있다.', b'0', 22),
(2204, 'D', '여자는 참석자들에게 참고할 자료를 이미 이메일로 보내 놓았다.', b'1', 22),
(2205, 'A', '동하고 싶다', b'0', 27),
(2206, 'B', '동하게도 된다', b'0', 27),
(2207, 'C', '동한 것 같다', b'0', 27),
(2208, 'D', '동한 적이 있다', b'1', 27),
(2209, 'A', '이사한 지', b'0', 28),
(2210, 'B', '이사하거든', b'0', 28),
(2211, 'C', '이사하려면', b'0', 28),
(2212, 'D', '이사하고 나서', b'1', 28),
(2213, 'A', '돕기 위해서', b'1', 29),
(2214, 'B', '돕는 대에에', b'0', 29),
(2215, 'C', '돕기 무섭게', b'0', 29),
(2216, 'D', '돕는 바람에', b'0', 29),
(2217, 'A', '볼 척하다', b'0', 30),
(2218, 'B', '보기 나쁘다', b'0', 30),
(2219, 'C', '볼 수밖에', b'0', 30),
(2220, 'D', '볼 가지 마자이다', b'1', 30),
(2221, 'A', '전통 시장은 대형 마트보다 가격이 저렴하다', b'0', 31),
(2222, 'B', '전통 시장이 변화를 통해 경쟁력을 높이고 있다', b'1', 31),
(2223, 'C', '젊은 세대는 전통 시장을 선호하지 않는다', b'0', 31),
(2224, 'D', '문화 행사는 전통 시장에 도움이 되지 않는다', b'0', 31),
(2225, 'A', '대형 마트가 전통 시장을 지원하고 있다', b'0', 32),
(2226, 'B', '전통 시장은 환경 개선에 관심이 없다', b'0', 32),
(2227, 'C', '전통 시장이 다양한 프로그램을 운영하고 있다', b'1', 32),
(2228, 'D', '젊은 세대는 전통 시장을 방문하지 않는다', b'0', 32),
(2229, 'A', '첫 번째 선택지', b'0', 33),
(2230, 'B', '두 번째 선택지', b'0', 33),
(2231, 'C', '세 번째 선택지', b'1', 33),
(2232, 'D', '네 번째 선택지', b'0', 33),
(2233, 'A', '첫 번째 선택지', b'0', 34),
(2234, 'B', '두 번째 선택지', b'1', 34),
(2235, 'C', '세 번째 선택지', b'0', 34),
(2236, 'D', '네 번째 선택지', b'0', 34),
(2237, 'A', '첫 번째 선택지', b'0', 35),
(2238, 'B', '두 번째 선택지', b'0', 35),
(2239, 'C', '세 번째 선택지', b'0', 35),
(2240, 'D', '네 번째 선택지', b'1', 35),
(2241, 'A', '첫 번째 선택지', b'1', 36),
(2242, 'B', '두 번째 선택지', b'0', 36),
(2243, 'C', '세 번째 선택지', b'0', 36),
(2244, 'D', '네 번째 선택지', b'0', 36),
(2245, 'A', '혹시', b'0', 37),
(2246, 'B', '또는', b'0', 37),
(2247, 'C', '비록', b'0', 37),
(2248, 'D', '만약', b'1', 37),
(2249, 'A', '황제팽귄은 서로 도와면서 추위에 맞서 생존한 했다.', b'1', 38),
(2250, 'B', '황제팽귄은 동료끼리 돌면서 날씨에 대한 정보를 알린다.', b'0', 38),
(2251, 'C', '황제팽귄은 추위에서 살아남기 위해 움직임이 느려졌다.', b'0', 38),
(2252, 'D', '황제팽귄은 무리 생활을 통해 경쟁에서 이기는 법을 배운다.', b'0', 38);

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `conversation_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `difficulty` varchar(255) NOT NULL,
  `scenario` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`conversation_id`, `created_at`, `difficulty`, `scenario`, `title`, `user_id`) VALUES
(1, '2025-07-04 03:20:58', 'intermediate', 'restaurant', '식당에서 주문하기 (중급)', 1),
(2, '2025-07-04 03:46:12', 'beginner', 'restaurant', '식당에서 주문하기 (초급)', 1),
(3, '2025-07-04 03:47:04', 'beginner', 'restaurant', '식당에서 주문하기 (초급)', 1),
(4, '2025-07-04 04:11:55', 'beginner', 'shopping', '쇼핑하기 (초급)', 1),
(5, '2025-07-04 04:12:13', 'beginner', 'shopping', '쇼핑하기 (초급)', 1),
(6, '2025-07-04 04:12:47', 'beginner', 'restaurant', '식당에서 주문하기 (초급)', 1),
(7, '2025-07-16 06:36:02', 'intermediate', 'restaurant', '식당에서 주문하기 (중급)', 1),
(8, '2025-07-16 07:32:34', 'intermediate', 'restaurant', '식당에서 주문하기 (중급)', 1),
(9, '2025-08-27 14:43:31', 'intermediate', 'daily', '일상 대화 (중급)', 1),
(10, '2025-09-19 14:21:01', 'beginner', 'restaurant', '식당에서 주문하기 (초급)', 1),
(11, '2025-09-19 16:44:38', 'beginner', 'restaurant', '식당에서 주문하기 (초급)', 1),
(12, '2025-09-20 03:03:54', 'beginner', 'shopping', '쇼핑하기 (초급)', 1),
(13, '2025-09-20 03:28:23', 'intermediate', 'shopping', '쇼핑하기 (중급)', 1),
(14, '2025-11-21 11:03:40', 'intermediate', 'shopping', '쇼핑하기 (중급)', 1),
(15, '2025-11-21 11:20:35', 'intermediate', 'shopping', '쇼핑하기 (중급)', 1),
(16, '2025-12-17 14:59:34', 'intermediate', 'restaurant', '식당에서 주문하기 (중급)', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `message_type` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `conversation_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `content`, `message_type`, `timestamp`, `conversation_id`) VALUES
(1, '메뉴 추천해 주세요', 'user', '2025-07-04 03:21:05', 1),
(2, '제육볶음 어떠세요? 달콤매콤하고 고기가 부드러워요. 밥이랑 같이 드시면 정말 맛있어요! 🥩', 'ai', '2025-07-04 03:21:07', 1),
(3, '메뉴 추천해 주세요', 'user', '2025-07-04 03:46:13', 2),
(4, '안녕하세요! 😊  오늘 점심 특별 메뉴로 불고기 어떠세요?  고기가 부드럽고 양념이 달콤해서 인기 많아요!  매운 맛, 담백한 맛, 달콤한 맛 중 어떤 걸 좋아하세요? 🤔', 'ai', '2025-07-04 03:46:23', 2),
(5, '안녕하세요.', 'user', '2025-07-04 03:47:19', 3),
(6, '안녕하세요! 😄  오늘 날씨가 정말 좋네요.  점심 식사는 어떤 걸로 드릴까요?  매운 맛 좋아하세요? 아니면 담백한 맛이 더 좋으세요? 🤔', 'ai', '2025-07-04 03:47:22', 3),
(7, 'tôi có đẹp trai không', 'user', '2025-07-04 03:47:51', 3),
(8, '어머, 죄송해요!  저는 음식 전문가라서… 😅  메뉴는 어떠세요?  오늘 삼겹살이 특히 부드러워요.  아니면 매운 맛 좋아하세요?  🤔', 'ai', '2025-07-04 03:47:52', 3),
(9, '안녕하세요!', 'user', '2025-07-04 04:12:15', 5),
(10, '안녕하세요! 😄 오늘 뭐 맘에 드는 옷 찾으러 오셨어요?  어떤 스타일 좋아하세요?  혹시 어떤 자리에 입으실 건지 말씀해주시면 더 잘 추천해 드릴 수 있을 것 같아요! 😊', 'ai', '2025-07-04 04:12:17', 5),
(11, 'tôi muốn gọi món canh', 'user', '2025-07-04 04:13:00', 6),
(12, '아, 국물이 드시고 싶으시군요! 👍  김치찌개랑 순두부찌개가 인기 메뉴에요. 김치찌개는 김치가 아주 잘 익어서 시원하고 얼큰해요.  순두부찌개는 좀 더 부드럽고 담백한 맛이에요.  어떤 종류의 국물을 좋아하세요? 매운 맛?  아니면 담백한 맛? 🤔', 'ai', '2025-07-04 04:13:03', 6),
(13, '비빔밥.', 'user', '2025-07-16 06:36:52', 7),
(14, '아, 비빔밥이요! 👍  정말 좋은 선택이세요!  고추장 양념이 얼마나 매콤한지, 취향에 따라 조절도 가능하답니다.  매운 맛 좋아하세요?  아니면 좀 더 담백한 맛을 원하시나요?  😄', 'ai', '2025-07-16 06:36:57', 7),
(15, '메뉴 추천해 주세요', 'user', '2025-07-16 07:32:38', 8),
(16, '안녕하세요! 😊  점심시간이라 손님들이 많으시네요!  메뉴 추천이요?  오늘 특히 김치찌개랑 제육볶음이 인기 최고예요!  김치찌개는 깊은 맛이 일품이고, 제육볶음은 매콤달콤해서 밥이랑 딱이거든요!  매운 걸 좋아하세요, 아니면 담백한 걸 좋아하세요? 🤔', 'ai', '2025-07-16 07:32:43', 8),
(17, '오늘은 날씨가 좋아요.', 'user', '2025-07-16 07:33:41', 8),
(18, '날씨 좋으시네요! 😄  오늘 점심 드시러 오셨어요?  저희 집 불고기가 인기 메뉴인데,  달콤한 맛을 좋아하시면 강력 추천드려요!  혹시 매운 걸 좋아하시는지, 아니면 담백한 걸 좋아하시는지 말씀해주시면 더 맛있는 메뉴 추천해드릴게요! 👍', 'ai', '2025-07-16 07:33:44', 8),
(19, '오늘 어때?', 'user', '2025-08-27 14:43:33', 9),
(20, '야! 오늘 어땠어? 나는 하루 종일 과제하느라 죽는 줄 알았다 😵 너는 어땠어?', 'ai', '2025-08-27 14:43:35', 9),
(21, '메뉴 추천해 주세요', 'user', '2025-09-19 14:21:57', 10),
(22, '안녕하세요! 😊  오늘 점심 드시러 오셨네요!  메뉴 추천이요?  불고기 어떠세요?  고기가 부드럽고 양념이 달콤해서 인기 많아요!  혹시 매운 맛 좋아하세요?  아니면 담백한 맛을 원하시나요? 🤔', 'ai', '2025-09-19 14:22:00', 10),
(23, '이것은 얼마예요?', 'user', '2025-09-19 16:44:41', 11),
(24, '아, 이거요?  이건 삼겹살이에요! 12,000원이에요.  맛있게 구워드릴게요! 😊  고추장 양념 좋아하세요?  아니면 소금구이로 드실래요? 🤔', 'ai', '2025-09-19 16:44:43', 11),
(25, 'hôm nay trời thế nào', 'user', '2025-09-19 16:44:52', 11),
(26, '오늘 날씨가 좀 쌀쌀하네요!  따뜻한 국물이 생각나시죠? 😊  김치찌개나 순두부찌개 어떠세요?  매운 맛 좋아하세요?  아니면 담백한 맛을 원하세요? 🤔', 'ai', '2025-09-19 16:44:54', 11),
(27, 'tôi muốn ăn cơm', 'user', '2025-09-20 03:04:00', 12),
(28, '저기요, 죄송한데 무슨 말씀이신지 잘 모르겠어요 😅  밥 드시고 싶으시다고요?  옷 보러 오셨는데…  혹시 옷 구경은 안 하시겠어요?  오늘 신상 많이 들어왔거든요! 😊', 'ai', '2025-09-20 03:04:03', 12),
(29, '카드로 결제할게요', 'user', '2025-09-20 03:28:24', 13),
(30, '네, 카드 결제 가능하세요! 😊  총 금액이 7만 8천원입니다.  영수증 필요하시죠?  혹시 다음에 필요하신 스타일이나 옷 종류 있으시면 언제든지 편하게 문의주세요! 👍', 'ai', '2025-09-20 03:28:26', 13),
(31, '안녕하세요!', 'user', '2025-11-21 11:03:44', 14),
(32, '어서오세요! 오늘 새로 들어온 옷들 구경해 보세요. 정말 예쁜 거 많아요! ✨', 'ai', '2025-11-21 11:03:47', 14),
(33, '안녕하세요!', 'user', '2025-11-21 11:20:37', 15),
(34, '어서오세요! 오늘 새로 들어온 옷들 구경해 보세요. 정말 예쁜 거 많아요! ✨', 'ai', '2025-11-21 11:20:39', 15);

-- --------------------------------------------------------

--
-- Table structure for table `document_item`
--

CREATE TABLE `document_item` (
  `word_id` bigint(20) NOT NULL,
  `example` text DEFAULT NULL,
  `meaning` varchar(255) NOT NULL,
  `vocab_image` varchar(255) DEFAULT NULL,
  `word` varchar(255) NOT NULL,
  `list_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `document_list`
--

CREATE TABLE `document_list` (
  `list_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_public` bit(1) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` bigint(20) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `exam_type` varchar(255) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `total_question` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`exam_id`, `duration_minutes`, `exam_type`, `is_active`, `title`, `total_question`) VALUES
(1, 180, 'TOPIK_II', b'1', 'TOPIK II 86회 기출', 104),
(2, 180, 'TOPIK_II', b'1', 'TOPIK II 87회 기출', 104),
(3, 180, 'TOPIK_II', b'1', 'TOPIK II 91회 기출', 104),
(4, 180, 'TOPIK_II', b'1', 'TOPIK II 89회 기출', 104),
(5, 180, 'TOPIK_II', b'1', 'TOPIK II 90회 기출', 104),
(6, 100, 'TOPIK_I', b'1', 'TOPIK I 86회 기출', 70),
(7, 100, 'TOPIK_I', b'1', 'TOPIK I 87회 기출', 70),
(8, 100, 'TOPIK_I', b'1', 'TOPIK I 88회 기출', 70),
(9, 110, 'TOPIK_II', b'1', 'TOPIK II Mock Test 1', 50),
(10, 110, 'TOPIK_II', b'1', 'TOPIK II Mock Test 2', 50),
(11, 60, 'TOPIK_II', b'1', 'TOPIK II Reading Only', 25),
(12, 50, 'TOPIK_II', b'1', 'TOPIK II Listening Practice', 25),
(13, 110, 'TOPIK_II', b'0', 'TOPIK II 85회 기출', 50);

-- --------------------------------------------------------

--
-- Table structure for table `exam_attempt`
--

CREATE TABLE `exam_attempt` (
  `attempt_id` bigint(20) NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `listening_score` decimal(6,2) DEFAULT NULL,
  `reading_score` decimal(6,2) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_score` decimal(6,2) DEFAULT NULL,
  `writing_score` decimal(6,2) DEFAULT NULL,
  `exam_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_attempt`
--

INSERT INTO `exam_attempt` (`attempt_id`, `end_time`, `listening_score`, `reading_score`, `start_time`, `status`, `total_score`, `writing_score`, `exam_id`, `user_id`) VALUES
(11, NULL, NULL, NULL, '2025-12-16 03:05:19', 'IN_PROGRESS', NULL, NULL, 3, 3),
(12, NULL, NULL, NULL, '2025-12-16 03:27:29', 'IN_PROGRESS', NULL, NULL, 3, 3),
(13, NULL, NULL, NULL, '2025-12-16 04:28:24', 'IN_PROGRESS', NULL, NULL, 3, 3),
(14, NULL, NULL, NULL, '2025-12-16 04:41:08', 'IN_PROGRESS', NULL, NULL, 3, 3),
(15, NULL, NULL, NULL, '2025-12-16 04:47:38', 'IN_PROGRESS', NULL, NULL, 3, 3),
(16, NULL, NULL, NULL, '2025-12-16 08:49:40', 'IN_PROGRESS', NULL, NULL, 3, 3),
(17, '2025-12-16 09:30:13', NULL, NULL, '2025-12-16 09:02:03', 'COMPLETED', NULL, NULL, 3, 3),
(18, NULL, NULL, NULL, '2025-12-16 09:30:24', 'IN_PROGRESS', NULL, NULL, 3, 3),
(19, '2025-12-16 09:46:58', '0.00', '0.00', '2025-12-16 09:46:46', 'COMPLETED', '0.00', '0.00', 3, 3),
(20, '2025-12-16 09:48:15', '0.00', '6.00', '2025-12-16 09:47:29', 'COMPLETED', '6.00', '0.00', 3, 3),
(21, '2025-12-16 09:55:44', '0.00', '4.00', '2025-12-16 09:55:10', 'COMPLETED', '4.00', '0.00', 3, 3),
(22, '2025-12-16 10:51:45', '2.00', '0.00', '2025-12-16 10:51:24', 'COMPLETED', '2.00', '0.00', 3, 3),
(23, '2025-12-16 11:48:14', '2.00', '0.00', '2025-12-16 11:47:49', 'COMPLETED', '2.00', '0.00', 3, 3),
(24, '2025-12-16 11:51:39', '4.00', '0.00', '2025-12-16 11:51:26', 'COMPLETED', '4.00', '0.00', 3, 3),
(25, '2025-12-16 14:35:19', '0.00', '0.00', '2025-12-16 14:34:05', 'COMPLETED', '0.00', '0.00', 3, 12),
(26, NULL, NULL, NULL, '2025-12-16 14:35:48', 'IN_PROGRESS', NULL, NULL, 3, 12),
(27, NULL, NULL, NULL, '2025-12-16 14:37:30', 'IN_PROGRESS', NULL, NULL, 3, 12),
(28, NULL, NULL, NULL, '2025-12-17 14:48:16', 'IN_PROGRESS', NULL, NULL, 3, 12),
(29, NULL, NULL, NULL, '2025-12-17 15:10:30', 'IN_PROGRESS', NULL, NULL, 3, 12),
(30, NULL, NULL, NULL, '2025-12-17 15:16:16', 'IN_PROGRESS', NULL, NULL, 3, 12),
(31, NULL, NULL, NULL, '2025-12-18 13:07:13', 'IN_PROGRESS', NULL, NULL, 3, 12),
(32, NULL, NULL, NULL, '2025-12-18 13:12:03', 'IN_PROGRESS', NULL, NULL, 3, 12),
(33, NULL, NULL, NULL, '2025-12-18 13:23:14', 'IN_PROGRESS', NULL, NULL, 3, 12);

-- --------------------------------------------------------

--
-- Table structure for table `exam_section`
--

CREATE TABLE `exam_section` (
  `section_id` bigint(20) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `exam_type` varchar(255) NOT NULL,
  `section_order` int(11) NOT NULL,
  `section_type` varchar(255) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `exam_id` bigint(20) NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_section`
--

INSERT INTO `exam_section` (`section_id`, `duration_minutes`, `exam_type`, `section_order`, `section_type`, `total_questions`, `exam_id`, `audio_url`) VALUES
(1, 60, 'TOPIK_II', 1, 'LISTENING', 50, 3, 'https://res.cloudinary.com/di6d1g736/video/upload/v1765850327/mix_57m44s_audio-joiner.com_dy1wbg.mp3'),
(2, 50, 'TOPIK_II', 2, 'WRITING', 4, 3, NULL),
(3, 70, 'TOPIK_II', 3, 'READING', 50, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exercise`
--

CREATE TABLE `exercise` (
  `exerciseid` bigint(20) NOT NULL,
  `exercise_description` varchar(255) DEFAULT NULL,
  `exercise_title` varchar(255) DEFAULT NULL,
  `exercise_type` varchar(255) DEFAULT NULL,
  `lessonid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exercise`
--

INSERT INTO `exercise` (`exerciseid`, `exercise_description`, `exercise_title`, `exercise_type`, `lessonid`) VALUES
(3, NULL, 'Bài 8', NULL, 8),
(4, NULL, 'bài 4', NULL, 9),
(5, 'Bài tập mặc định cho bài học 25', NULL, 'MIXED', 25);

-- --------------------------------------------------------

--
-- Table structure for table `grammartheory`
--

CREATE TABLE `grammartheory` (
  `grammarid` bigint(20) NOT NULL,
  `grammar_content` varchar(255) DEFAULT NULL,
  `grammar_example` varchar(255) DEFAULT NULL,
  `grammar_title` varchar(255) DEFAULT NULL,
  `lessonid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grammartheory`
--

INSERT INTO `grammartheory` (`grammarid`, `grammar_content`, `grammar_example`, `grammar_title`, `lessonid`) VALUES
(4, '– Trợ từ chủ ngữ đứng sau danh từ, biến danh từ thành chủ ngữ trong câu\r\n– Danh từ có phụ âm cuối + 은, danh từ không có phụ âm cuối + 는\r\n– Nhấn mạnh vào phần vị ngữ. 은/는 còn được dùng khi mang nghĩa so sánh, liệt kê', '+ 저는 학생입니다 > Tôi là học sinh\r\n+ 밥은 맛있어요 > Cơm thì ngon', 'N + 은/는 -> S', 8),
(12, '+ 제가 학생입니다 > Tôi là học sinh\r\n+ 이 집이 크네요 > Căn nhà này to quá', '– Tiểu chủ ngữ đứng sau danh từ, biến danh từ thành chủ ngữ trong câu, tương tự 은/는\r\n– Danh từ có phụ âm cuối + 이, danh từ không có phụ âm cuối + 가\r\n– Nhấn mạnh vào phần chủ ngữ', 'N + 이/가 -> S : Tiểu từ chủ ngữ', 8),
(13, '+ 저는 밥을 먹어요 > Tôi ăn cơm\r\n+ 엄마가 김치를 사요 > Mẹ tôi mua Kimch', '– Đứng sau danh từ đóng vai trò tân ngữ trong câu, là đối tượng (người, vật, con vật…) bị chủ ngữ tác động lên\r\n– Danh từ có phụ âm cuối + 을, danh từ không có phụ âm cuối + 를', 'N + 을/를 -> O : Tân ngữ', 8),
(14, '+ 저는 학생입니다 -> Tôi là học sinh\r\n+ 제 형은 선생님입니다 > Anh tôi là giáo viên', '– Đứng sau danh từ, mang nghĩa “là N”\r\n– Là đuôi câu thể kính ngữ trong tiếng Hàn', 'N + 입니다 : Là', 8),
(15, '– Đuôi câu nghi vấn của 입니다\r\n– Đuôi câu này có nghĩa là “Có phải là N”\r\n– Là đuôi câu thể kính ngữ trong tiếng Hàn', '+ 당신은 학생입니까? -> Bạn có phải là học sinh không?\r\n+ 민수 씨는 한국 사람입니까? > Bạn Minsu có phải là người Hàn Quốc không?', 'N + 입니까? : Có phải là ….? ', 9),
(16, '– Đứng sau danh từ, mang nghĩa “là N”\r\n– Danh từ có phụ âm cuối + 이에요, danh từ không có phụ âm cuối + 예요\r\n– Là đuôi câu thể lịch sự, mức độ kính ngữ thấp hơn 입니다', '+ 저는 학생이에요-> Tôi là học sinh\r\n+ 저는 요리사예요-> Tôi là đầu bếp', 'N + 예요/이에요: Là ', 9),
(17, '– Đuôi câu phủ định của của 입니다, đứng sau danh từ nhằm phủ định chủ ngữ\r\n– Danh từ có phụ âm cuối + 이 아닙니다, danh từ không có phụ âm cuối + 가 아닙니다\r\n– Đuôi câu này có nghĩa là “Không phải là N”\r\n– Là đuôi câu kính ngữ trong tiếng Hàn', '+ 저는 베트남 사람이 아닙니다 > Tôi không phải là người Việt Nam\r\n+ 이 시람은 제 친구가 아닙니다 > Người này không phải là bạn của tôi', 'N + 이/가 아닙니다: Không phải là', 9),
(18, '– Đuôi câu phủ định của 예요/이에요, đứng sau danh từ nhằm phủ định chủ ngữ\r\n– Danh từ có phụ âm cuối + 이 아니에요, danh từ không có phụ âm cuối + 가 아니에요\r\n– Đuôi câu này có nghĩa là “Không phải là N”\r\n– Là đuôi câu thể lịch sự trong tiếng Hàn', '+ 이것은 책이 아니에요 > Cái này không phải quyển sách\r\n+ 우리 어머니는 의사가 아니에요  > Mẹ tôi không phải là bác sĩ', 'N + 이/가 아니에요 : Không phải là', 9),
(19, '– Liên từ nối giữa 2 danh từ, để thể hiện sự bổ sung, liệt kê. Mang nghĩa tiếng Việt là “và”\r\n– 하고: có thể kết hợp với danh từ có phụ âm cuối hoặc không có phụ âm cuối\r\n– 와/과: Danh từ có phụ âm cuối dùng 과 , danh từ không có phụ âm cuối dùng 와\r\n– Còn có n', '+ 밥하고 고기를 먹어요-> Tôi ăn cơm và thịt\r\n+ 저는 친구하고 같이 학교에 가요 -> Tôi đi học với bạn tôi', 'N + 하고/와/과+ N : Và, với', 10),
(20, '– Chia đuôi câu thể kính ngữ trong tiếng Hàn\r\n– Động/tính từ có phụ âm cuối + 습니다\r\n– Động/tính từ không có phụ âm cuối + ㅂ니다', '+ 저는 밥을 먹습니다 > Tôi ăn cơm\r\n+ 지금 잡니다 > Bây giờ tôi ngủ\r\n+ 날씨가 덥습니다 > Thời tiết nóng\r\n+ 이거는 너무 비쌉니다 > Cái này mắc quá', 'V/A + ㅂ니다/습니다', 10),
(21, '– Chia đuôi câu thể lịch sự trong tiếng Hàn\r\n– Mức độ kính ngữ thấp hơn 습니다/ㅂ니다\r\n– Đuôi câu này chia làm 3 trường hợp\r\n\r\nTrường hợp 1: V/A + 아요\r\n– Động tính từ chứa nguyên âm 아 hoặc 오 thì chia đuôi 아요\r\n+ 받다 + 아요 > 받아요\r\n+ 앉다 + 아요 > 앉아요\r\n+ 좋다 + 아요 > 좋아요\r\n\r\n', '', 'V/A + 아/어/여요', 10);

-- --------------------------------------------------------

--
-- Table structure for table `lesson`
--

CREATE TABLE `lesson` (
  `lessonid` bigint(20) NOT NULL,
  `lesson_description` varchar(255) DEFAULT NULL,
  `lesson_name` varchar(255) DEFAULT NULL,
  `levelid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lesson`
--

INSERT INTO `lesson` (`lessonid`, `lesson_description`, `lesson_name`, `levelid`) VALUES
(8, NULL, 'Giới thiệu bản thân', 1),
(9, NULL, 'Quốc tịch, nghề nghiệp', 1),
(10, NULL, 'Gia đình', 1),
(11, NULL, 'Thời gian (giờ, ngày)\r\n\r\n', 1),
(12, NULL, 'Cuộc sống hàng ngày', 1),
(13, NULL, 'Mua sắm', 1),
(14, NULL, 'Thức ăn & đồ uống', 1),
(15, NULL, 'Sở thích', 1),
(16, NULL, 'Ngày nghỉ & cuối tuần', 1),
(17, NULL, 'Địa điểm & phương hướng', 1),
(18, NULL, 'Giao thông', 1),
(19, NULL, 'Thời tiết', 1),
(20, NULL, 'Sinh nhật', 1),
(21, NULL, 'Trang phục', 1),
(22, NULL, 'Nhà cửa', 1),
(23, NULL, 'Điện thoại & liên lạc', 1),
(24, NULL, 'Thư từ & bưu điện', 1),
(25, 'Bài học về bệnh viện \n', 'Bệnh & bệnh viện', 1),
(26, NULL, 'Sự kiện & kế hoạch', 1),
(27, NULL, 'Cuộc sống sinh hoạt', 2),
(28, NULL, 'Trường học', 2),
(29, NULL, 'Bạn bè & giao tiếp', 2),
(30, NULL, 'Du lịch', 2),
(31, NULL, 'Món ăn Hàn Quốc', 2),
(32, NULL, 'Hẹn hò', 2),
(33, NULL, 'Văn hóa & lễ hội', 2),
(34, NULL, 'Phương tiện truyền thông', 2),
(35, NULL, 'Công việc', 2),
(36, NULL, 'Môi trường sống', 2),
(37, NULL, 'Giao tiếp nơi công sở', 2),
(38, NULL, 'Mua sắm trực tuyến', 2),
(39, NULL, 'Cảm xúc & tâm trạng', 2),
(40, NULL, 'Sự thay đổi', 2),
(41, NULL, 'Internet & công nghệ', 2),
(42, NULL, 'Giấc mơ & mục tiêu', 2),
(43, NULL, 'Lịch sử & truyền thống', 2),
(44, NULL, 'Cuộc sống ở Hàn Quốc', 2),
(45, NULL, 'Khác biệt văn hóa', 2),
(46, NULL, 'Mối quan hệ xã hội', 3),
(47, NULL, 'Sự kiện hàng ngày', 3),
(48, NULL, 'Phỏng vấn & xin việc', 3),
(49, NULL, 'Môi trường & sinh thái', 3),
(50, NULL, 'Giáo dục & học tập', 3),
(51, NULL, 'Y tế & sức khỏe', 3),
(52, NULL, 'Kinh tế & tiền tệ', 3),
(53, NULL, 'Tin tức & báo chí', 3),
(54, NULL, 'Giao tiếp trong công việc', 3),
(55, NULL, 'Văn hoá Hàn – Việt', 3),
(56, NULL, 'Cuộc sống hiện đại', 3),
(57, NULL, 'Gia đình & xã hội', 3),
(58, NULL, 'Thể thao & giải trí', 3),
(59, NULL, 'Đời sống học đường', 3),
(60, NULL, 'Truyền thống & lễ nghi', 3),
(61, NULL, 'Ngôn ngữ & giao tiếp', 3),
(62, NULL, 'Quảng cáo & tiêu dùng', 3),
(63, NULL, 'Công nghệ & đổi mới', 3),
(64, NULL, 'Thái độ sống tích cực', 3),
(65, NULL, 'Tin tức & truyền thông', 4),
(66, NULL, 'Sự phát triển xã hội', 4),
(67, NULL, 'Chính trị & xã hội', 4),
(68, NULL, 'Sự nghiệp & thành công', 4),
(69, NULL, 'Tình nguyện & chia sẻ', 4),
(70, NULL, 'Sức khỏe tinh thần', 4),
(71, NULL, 'Vai trò giới tính\r\n\r\n', 4),
(72, NULL, 'Du học & học bổng', 4),
(73, NULL, 'Thị trường việc làm', 4),
(74, NULL, 'Cuộc sống đô thị', 4),
(75, NULL, 'Khủng hoảng khí hậu', 4),
(76, NULL, 'Mạng xã hội\r\n\r\n', 4),
(77, NULL, 'Nguồn lực & năng lượng', 4),
(78, NULL, 'Văn học & nghệ thuật', 4),
(79, NULL, 'Kỷ nguyên số', 4),
(80, NULL, 'Khởi nghiệp', 4),
(81, NULL, 'Sự bất bình đẳng', 4),
(82, NULL, 'Giá trị sống', 4),
(83, NULL, 'Giao tiếp quốc tế', 4),
(84, NULL, 'Tư duy phản biện', 5),
(85, NULL, 'Phân tích hiện tượng xã hội', 5),
(86, NULL, 'Văn hóa toàn cầu', 5),
(87, NULL, 'Xung đột & giải quyết', 5),
(88, NULL, 'Đạo đức & luật pháp', 5),
(89, NULL, 'Vai trò truyền thông', 5),
(90, NULL, 'Quan hệ quốc tế', 5),
(91, NULL, 'Giáo dục sáng tạo', 5),
(92, NULL, 'Tự do cá nhân & trách nhiệm', 5),
(93, NULL, 'Nghệ thuật & xã hội', 5),
(94, NULL, 'Kinh doanh & đầu tư', 5),
(95, NULL, 'Hợp tác quốc tế', 5),
(96, NULL, 'Hệ giá trị truyền thống', 5),
(97, NULL, 'Phát triển bền vững', 5),
(98, NULL, 'Cách mạng công nghệ 4.0', 5),
(99, NULL, 'Bất ổn xã hội\r\n\r\n', 5),
(100, NULL, 'Nhân quyền', 5),
(101, NULL, 'Quản lý cảm xúc\r\n\r\n', 5),
(102, NULL, 'Tư duy toàn cầu', 5),
(103, NULL, 'Bài nghị luận tổng hợp', 6),
(104, NULL, 'Diễn thuyết & trình bày', 6),
(105, NULL, 'Viết báo cáo học thuật', 6),
(106, NULL, 'Phân tích văn học', 6),
(107, NULL, 'So sánh văn hóa đa quốc gia', 6),
(108, NULL, 'Hệ tư tưởng & triết học\r\n\r\n', 6),
(109, NULL, 'Phê bình xã hội', 6),
(110, NULL, 'Luật pháp quốc tế', 6),
(111, NULL, 'Quản trị tổ chức', 6),
(112, NULL, 'Đàm phán & thương lượng', 6),
(113, NULL, 'Tâm lý học xã hội', 6),
(114, NULL, 'Khoa học dữ liệu', 6),
(115, NULL, 'Chính sách quốc gia\r\n\r\n', 6),
(116, NULL, 'Dân chủ & pháp quyền', 6),
(117, NULL, 'Kỹ năng nghiên cứu', 6),
(118, NULL, 'Thuyết phục & lập luận', 6),
(119, NULL, 'Ngôn ngữ chuyên ngành', 6),
(120, NULL, 'Bài tập mô phỏng', 6),
(121, NULL, 'Phân tích ', 6);

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `levelid` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `level_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `level`
--

INSERT INTO `level` (`levelid`, `description`, `level_name`) VALUES
(1, '	Bắt đầu làm quen', 'TOPIK 1'),
(2, 'Nền tảng vững chắc', 'TOPIK 2'),
(3, 'Giao tiếp tự nhiên', 'TOPIK 3'),
(4, '	Hiểu sâu văn bản', 'TOPIK 4'),
(5, 'Thành thạo tiếng Hàn', 'TOPIK 5'),
(6, '	Chuyên sâu học thuật', 'TOPIK 6');

-- --------------------------------------------------------

--
-- Table structure for table `levelxp`
--

CREATE TABLE `levelxp` (
  `level_number` int(11) NOT NULL,
  `badge_image` varchar(255) DEFAULT NULL,
  `requiredxp` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `levelxp`
--

INSERT INTO `levelxp` (`level_number`, `badge_image`, `requiredxp`, `title`) VALUES
(1, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_31_3_thg_7_2025_tbrynt.png', 0, 'Tân thủ Hangeu'),
(2, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_35_3_thg_7_2025_xq2f1z.png', 50, 'Nhà thám hiểm Hangeul'),
(3, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_36_3_thg_7_2025_l7qt7b.png', 100, 'Bậc thầy ngữ pháp'),
(4, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_38_3_thg_7_2025_ee23aw.png', 200, 'Người thách thức hội thoại'),
(5, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_39_3_thg_7_2025_i26jj3.png', 300, 'Thạc sĩ Hàn ngữ'),
(6, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513629/ChatGPT_Image_10_24_40_3_thg_7_2025_bt8tro.png', 400, 'Thiên thần chăm học');

-- --------------------------------------------------------

--
-- Table structure for table `multiplechoicequestion`
--

CREATE TABLE `multiplechoicequestion` (
  `questionid` bigint(20) NOT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `link_media` varchar(255) DEFAULT NULL,
  `optiona` varchar(255) DEFAULT NULL,
  `optionb` varchar(255) DEFAULT NULL,
  `optionc` varchar(255) DEFAULT NULL,
  `optiond` varchar(255) DEFAULT NULL,
  `question_text` varchar(255) DEFAULT NULL,
  `exerciseid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `multiplechoicequestion`
--

INSERT INTO `multiplechoicequestion` (`questionid`, `correct_answer`, `link_media`, `optiona`, `optionb`, `optionc`, `optiond`, `question_text`, `exerciseid`) VALUES
(5, 'B', 'https://res.cloudinary.com/di6d1g736/video/upload/v1751509343/6766355811749_iifbxe.mp4', '회사원', '선생님', '성별', '나이', 'Giáo Viên', 4),
(6, 'C', NULL, '성별', '가족', '이름', '취미', 'Tên', 4),
(7, 'A', NULL, '성별', '나이', '직업', '회사원', 'Giới tính', 4),
(8, 'B', NULL, '나이', '생년월일', '가족', '한국 사람', 'Ngày sinh', 4),
(9, 'C', NULL, '회사원', '학생', '직업', '취미', 'Nghề nghiệp', 4),
(10, 'B', NULL, '가족', '학생', '성별', '이름', 'Học sinh', 4),
(11, 'A', NULL, '선생님', '회사원', '나이', '국적', 'Giáo viên', 4),
(12, 'D', NULL, '직업', '가족', '나이', '회사원', 'Nhân viên công ty', 4),
(13, 'C', NULL, '이름', '나이', '엔지니어', '학생', 'Kỹ sư', 4),
(14, 'B', NULL, '이름', '자기소개', '학생', '베트남 사람', 'Tự giới thiệu', 4),
(15, 'A', NULL, '반갑습니다', '가족', '한국 사람', '성별', 'Rất vui được gặp bạn', 4),
(16, 'D', NULL, '이름', '학생', '성별', '처음 뵙겠습니다', 'Hân hạnh được gặp lần đầu', 4),
(17, 'C', NULL, '가족', '성별', '어디에서 왔어요?', '직업', 'Bạn đến từ đâu?', 4),
(18, 'A', NULL, '한국 사람', '취미', '가족', '이름', 'Người Hàn Quốc', 3),
(19, 'B', NULL, '성별', '베트남 사람', '취미', '회사원', 'Người Việt Nam', 4),
(20, 'C', NULL, '성별', '가족', '취미', '국적', 'Sở thích', 4),
(21, 'A', 'https://res.cloudinary.com/di6d1g736/video/upload/v1751509343/6766355811749_iifbxe.mp4', '안녕하세요!', '만나서 반갑습나다', '베트남 사람이에요.', '의사예요.', 'Chọn đáp án mà bạn đã nghe được từ video', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_token`
--

CREATE TABLE `password_reset_token` (
  `id` bigint(20) NOT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `password_reset_token`
--

INSERT INTO `password_reset_token` (`id`, `expiry_date`, `token`, `user_id`) VALUES
(1, '2025-06-27 17:43:36', '2f43f88c-6012-4c03-9f46-b0912ef33d7c', 5),
(16, '2025-12-06 10:45:58', '1846a00c-1bf0-494c-ad21-df66330ccb4f', 10),
(17, '2025-12-06 11:14:33', '30464925-33f8-4d23-8aeb-80b5ad6adce7', 9);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` bigint(20) NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `correct_answer` varchar(10) DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `passage_text` text DEFAULT NULL,
  `points` decimal(5,2) DEFAULT NULL,
  `question_number` int(11) NOT NULL,
  `question_text` text DEFAULT NULL,
  `question_type` varchar(255) NOT NULL,
  `section_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `audio_url`, `correct_answer`, `group_id`, `image_url`, `passage_text`, `points`, `question_number`, `question_text`, `question_type`, `section_id`) VALUES
(1, NULL, 'A', NULL, NULL, NULL, '2.00', 1, '다음을 듣고 알맞은 그림을 고르십시오. (Nghe và chọn hình phù hợp)', 'MCQ', 1),
(2, NULL, 'B', NULL, NULL, NULL, '2.00', 2, '다음을 듣고 알맞은 그림을 고르십시오. (Nghe và chọn hình phù hợp)', 'MCQ', 1),
(3, NULL, 'C', NULL, NULL, NULL, '2.00', 3, '다음을 듣고 알맞은 그림을 고르십시오. (Nghe và chọn hình phù hợp)', 'MCQ', 1),
(21, NULL, 'B', 21, NULL, '[21~22] 다음을 듣고 물음에 답하십시오.', '2.00', 21, '남자의 중심 생각으로 가장 알맞은 것을 고르십시오.', 'MCQ', 1),
(22, NULL, 'D', 21, NULL, '22. ', '2.00', 22, '들은 내용과 같은 것을 고르십시오.', 'MCQ', 1),
(23, NULL, '바꿔 주시겠어요', 51, NULL, '안녕하세요. 제가 13일에 일이 생겨서 병원에 못 가게 되었습니다. 그래서 예약을 14일 오전 10시로 ( ㄱ ). 만약에 이날 예약이 ( ㄴ ) 저는 15일 오전도 괜찮습니다.', '5.00', 51, '(ㄱ)', 'SHORT', 2),
(24, NULL, '잘 안 되면', 51, NULL, '안녕하세요. 제가 13일에 일이 생겨서 병원에 못 가게 되었습니다. 그래서 예약을 14일 오전 10시로 ( ㄱ ). 만약에 이날 예약이 ( ㄴ ) 저는 15일 오전도 괜찮습니다.', '5.00', 51, '(ㄴ)', 'SHORT', 2),
(25, NULL, 'Đáp án câu', 52, NULL, 'Đoạn văn câu 52 ở đây với ( ㄱ ) và ( ㄴ )...', '5.00', 52, '(ㄱ)', 'SHORT', 2),
(26, NULL, 'Đáp án câu', 52, NULL, 'Đoạn văn câu 52 ở đây với ( ㄱ ) và ( ㄴ )...', '5.00', 52, '(ㄴ)', 'SHORT', 2),
(27, NULL, 'D', 1, NULL, NULL, '2.00', 1, '나는 오래전에 썼잡을 (    ).', 'MCQ', 3),
(28, NULL, 'D', 1, NULL, NULL, '2.00', 2, '제친으로 (    ) 가구를 새로 샀다.', 'MCQ', 3),
(29, NULL, 'A', 3, NULL, NULL, '2.00', 3, '어제은 이웃을 돕고자 매년 봉사 활동에 참여하고 있다.', 'MCQ', 3),
(30, NULL, 'B', 3, NULL, NULL, '2.00', 4, '지난 3년 동안 영화를 한 편 봤으니 거의 안 본 셈이다.', 'MCQ', 3),
(31, NULL, 'B', 21, NULL, '최근 한국에서는 전통 시장이 다시 주목받고 있다. 대형 마트와의 경쟁에서 살아남기 위해 전통 시장들이 다양한 변화를 시도하고 있기 때문이다. 깨끗한 환경 조성은 물론, 문화 행사와 체험 프로그램을 마련하여 쇼핑 이상의 가치를 제공하고 있다. 이러한 노력 덕분에 젊은 세대도 전통 시장을 찾기 시작했다.', '2.00', 21, '이 글의 중심 내용으로 알맞은 것을 고르십시오.', 'MCQ', 3),
(32, NULL, 'C', 21, NULL, '최근 한국에서는 전통 시장이 다시 주목받고 있다. 대형 마트와의 경쟁에서 살아남기 위해 전통 시장들이 다양한 변화를 시도하고 있기 때문이다. 깨끗한 환경 조성은 물론, 문화 행사와 체험 프로그램을 마련하여 쇼핑 이상의 가치를 제공하고 있다. 이러한 노력 덕분에 젊은 세대도 전통 시장을 찾기 시작했다.', '2.00', 22, '읽은 내용과 같은 것을 고르십시오.', 'MCQ', 3),
(33, NULL, NULL, NULL, 'https://res.cloudinary.com/di6d1g736/image/upload/v1765876455/Screenshot_2025-12-16_161144_hd1h6u.png', NULL, '2.00', 5, '(   )에 들어갈 말로 가장 알맞은 것을 고르십시오.', 'MCQ', 3),
(34, NULL, NULL, NULL, 'https://res.cloudinary.com/di6d1g736/image/upload/v1765876456/Screenshot_2025-12-16_161149_svfcpa.png', NULL, '2.00', 6, '(   )에 들어갈 말로 가장 알맞은 것을 고르십시오.', 'MCQ', 3),
(35, NULL, NULL, NULL, 'https://res.cloudinary.com/di6d1g736/image/upload/v1765876456/Screenshot_2025-12-16_161153_auhrlm.png', NULL, '2.00', 7, '(   )에 들어갈 말로 가장 알맞은 것을 고르십시오.', 'MCQ', 3),
(36, NULL, NULL, NULL, 'https://res.cloudinary.com/di6d1g736/image/upload/v1765876456/Screenshot_2025-12-16_161157_rurzkb.png', NULL, '2.00', 8, '(   )에 들어갈 말로 가장 알맞은 것을 고르십시오.', 'MCQ', 3),
(37, NULL, NULL, 19, NULL, '매서운 남극의 겨울, 황제팽귄은 절경이 불어 서로의 체온으로 추위를 견딘다. 무리 전체가 돌면서 바깥쪽과 안쪽에 있는 팽귄들이 계속 서로의 위치를 바꾼다. 안에서 몸을 대로 팽귄은 밖으로 나가고 밖에서 추위에 떨던 팽귄은 안으로 들어오는 것이다. (        ) 그 움직임은 아주 느리지만 서서 얼고 이루어져 한 마리의 팽귄이 줄을 찬바람을 맞고 서 있는 일이 없다. 그렇게 쉬 없이 돌면서 돌면서 팽귄들은 더 함께 살아남는다.', '2.00', 19, '(        )에 들어갈 말로 가장 알맞은 것을 고르십시오.', 'MCQ', 3),
(38, NULL, NULL, 19, NULL, '', '2.00', 20, '맞는 뜻의 주제로 가장 알맞은 것을 고르십시오.', 'MCQ', 3);

-- --------------------------------------------------------

--
-- Table structure for table `sentencerewritingquestion`
--

CREATE TABLE `sentencerewritingquestion` (
  `questionid` bigint(20) NOT NULL,
  `link_media` varchar(255) DEFAULT NULL,
  `original_sentence` varchar(255) DEFAULT NULL,
  `rewritten_sentence` varchar(255) DEFAULT NULL,
  `exerciseid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sentencerewritingquestion`
--

INSERT INTO `sentencerewritingquestion` (`questionid`, `link_media`, `original_sentence`, `rewritten_sentence`, `exerciseid`) VALUES
(3, NULL, 'Tên tôi là Min-su', '민수입니다', 3),
(4, 'https://res.cloudinary.com/di6d1g736/video/upload/v1751510273/009_mp3cut.net_nytnm7.mp3', '\n화 씨는 ______입니까? ', '회사원', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userid` bigint(20) NOT NULL,
  `avatar_image` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userid`, `avatar_image`, `date_of_birth`, `email`, `fullname`, `gender`, `join_date`, `password`, `role`, `user_name`, `user_status`) VALUES
(1, NULL, NULL, 'tintc@vku.udn.vn', 'ádf', 'Nam', '0000-00-00', '123', NULL, NULL, 1),
(2, '123', '2025-06-10', 'tr@gmail.com', '12', 'Nam', '2025-06-22', '123', 'user', 'adf', 1),
(3, 'https://res.cloudinary.com/do0k0jkej/image/upload/v1751600736/hwfl4kruonhxhazfkzpr.png', '2025-12-04', 't2@gmail.com', 'TTai', 'Chưa cập nhật', '2025-07-01', '$2a$10$mYiznje3kOgqoIAceAkGyuOeckbNWsqXtWibCkzg/KhmfpYVQ91/u', 'user', NULL, 1),
(4, NULL, NULL, 't3@gmail.com', 'Bsd', NULL, NULL, '$2a$10$HegPNa2cKqWO8seGoRHaM.AmZEHayzr/SMWvDeGIy6Dexr4iKjkWm', 'USER', NULL, 0),
(5, NULL, '2004-03-23', 't4@gmail.com', 'sdfsdf', 'Nam', '2025-06-11', '123', NULL, NULL, 0),
(6, 'https://res.cloudinary.com/di6d1g736/image/upload/v1750769856/Screenshot_2025-06-24_195720_sglcnm.png', NULL, 't5@gmail.com', 'sdf', NULL, NULL, '$2a$10$XlEgM.G.BcwUl.1ZWqMzs.iNhzHJFfl/XLpw3LLdAoYhfzAyPbW/S', 'USER', NULL, 1),
(7, NULL, NULL, 't6@gmail.com', 'sgsss', NULL, NULL, '$2a$10$EiRuOMHhlzJegBiz7H0E2ezToie8SBBk8dKdd.lN6zUNF4cmDQYK2', 'USER', NULL, 0),
(8, NULL, NULL, 't7@gmail.com', 't7ssd', NULL, NULL, '$2a$10$Al/JHg2..KM1kwBvCsrAV.VftKosnXEaT4XqBA.TGzLjVw5v8TpEa', 'USER', NULL, 0),
(9, NULL, NULL, 'taitt.21it@vku.udn.vn', 'taiiiiss', NULL, NULL, '$2a$10$42OgJ6rF8yypyOgU5hh36.qYy21zi2tefxXAxtItVTF4MsRxXmrfO', 'ADMIN', NULL, 1),
(10, 'https://lh3.googleusercontent.com/a/ACg8ocKXEIsb-7m8ZScKf4ePKcqBP0h3n1ZTYEAim0ru4SeT8XcmP4tq=s96-c', NULL, 'trantantai310803@gmail.com', 'Tài TKQN', NULL, '2025-07-16', '$2a$10$dYr3qEvtrZWh15xxCFsLX.GFOioI2dscBLfwYsLAFOm513uM4DXSe', 'USER', NULL, 1),
(11, NULL, NULL, 't8@gmail.com', 'ttttt', NULL, '2025-12-06', '$2a$10$t8IycpAIHy226GtKrCf6ZONulRerxSIg.37UfGfWDwsHRFbHxnx1q', 'USER', NULL, 1),
(12, 'https://lh3.googleusercontent.com/a/ACg8ocI11AW7ELzL3TFxXwCcFW6YFH9-mv3_ZJmVlEybR6lsGj_hW_ZJ=s96-c', NULL, 'tintc.21it@vku.udn.vn', 'TRẦN CHÁNH TÍN', NULL, '2025-12-16', '$2a$10$NOrmEw4KpN/hoa3Drf6me.SHg0BkWkPv4rUFPbvL0fetV2z5pGwK.', 'USER', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `userexerciseresult`
--

CREATE TABLE `userexerciseresult` (
  `resultid` bigint(20) NOT NULL,
  `date_complete` datetime DEFAULT NULL,
  `score` double DEFAULT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `exerciseid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userexerciseresult`
--

INSERT INTO `userexerciseresult` (`resultid`, `date_complete`, `score`, `userid`, `exerciseid`) VALUES
(53, '2025-07-02 19:21:15', 88, 3, 3),
(66, '2025-11-21 04:19:35', 100, 3, 4),
(67, '2025-12-01 08:16:02', 88, 3, 3),
(68, '2025-12-01 08:19:32', 50, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `userxp`
--

CREATE TABLE `userxp` (
  `userxpid` bigint(20) NOT NULL,
  `current_badge` varchar(255) DEFAULT NULL,
  `current_title` varchar(255) DEFAULT NULL,
  `level_number` int(11) DEFAULT NULL,
  `totalxp` int(11) DEFAULT NULL,
  `userid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userxp`
--

INSERT INTO `userxp` (`userxpid`, `current_badge`, `current_title`, `level_number`, `totalxp`, `userid`) VALUES
(1, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513629/ChatGPT_Image_10_24_40_3_thg_7_2025_bt8tro.png', 'Thiên thần chăm học', 6, 921, 3),
(2, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_39_3_thg_7_2025_i26jj3.png', 'Thạc sĩ Hàn ngữ', 5, 351, 1),
(3, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_38_3_thg_7_2025_ee23aw.png', 'Người thách thức hội thoại', 4, 250, 4),
(4, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_38_3_thg_7_2025_ee23aw.png', 'Người thách thức hội thoại', 4, 260, 5),
(5, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_36_3_thg_7_2025_l7qt7b.png', 'Bậc thầy ngữ pháp', 3, 150, 6),
(6, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_36_3_thg_7_2025_l7qt7b.png', 'Bậc thầy ngữ pháp', 3, 160, 7),
(7, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513623/ChatGPT_Image_10_24_35_3_thg_7_2025_xq2f1z.png', 'Nhà thám hiểm Hangeul', 2, 60, 8),
(8, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_31_3_thg_7_2025_tbrynt.png', 'Tân thủ Hangeu', 1, 0, 9),
(9, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_31_3_thg_7_2025_tbrynt.png', 'Tân thủ Hangeu', 1, 0, 10),
(10, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_31_3_thg_7_2025_tbrynt.png', 'Tân thủ Hangeu', 1, 0, 11),
(11, 'https://res.cloudinary.com/di6d1g736/image/upload/v1751513624/ChatGPT_Image_10_24_31_3_thg_7_2025_tbrynt.png', 'Tân thủ Hangeu', 1, 0, 12);

-- --------------------------------------------------------

--
-- Table structure for table `user_answer`
--

CREATE TABLE `user_answer` (
  `user_answer_id` bigint(20) NOT NULL,
  `answer_text` text DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `attempt_id` bigint(20) NOT NULL,
  `choice_id` bigint(20) DEFAULT NULL,
  `question_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_answer`
--

INSERT INTO `user_answer` (`user_answer_id`, `answer_text`, `score`, `attempt_id`, `choice_id`, `question_id`) VALUES
(8, NULL, '2.00', 13, 1, 1),
(9, NULL, '0.00', 13, 5, 2),
(10, NULL, '0.00', 13, 2101, 21),
(11, NULL, '0.00', 13, 2202, 22),
(12, 'adf', '0.00', 15, NULL, 23),
(13, 'adfdf', '0.00', 15, NULL, 24),
(14, NULL, '0.00', 16, 2101, 21),
(15, NULL, '0.00', 16, 2202, 22),
(16, 'dfsdfsdf', '0.00', 16, NULL, 25),
(17, 'sdfsdf', '0.00', 16, NULL, 26),
(18, NULL, '0.00', 17, 12, 3),
(19, NULL, '2.00', 17, 2208, 27),
(20, NULL, '0.00', 17, 2210, 28),
(21, NULL, '2.00', 17, 2234, 34),
(22, NULL, '2.00', 17, 2231, 33),
(23, NULL, '0.00', 19, 2226, 32),
(24, NULL, '0.00', 20, 4, 1),
(25, NULL, '0.00', 20, 8, 2),
(26, NULL, '0.00', 20, 12, 3),
(27, NULL, '0.00', 20, 2202, 22),
(28, NULL, '0.00', 20, 2103, 21),
(29, 'xc', '0.00', 20, NULL, 23),
(30, 'cx', '0.00', 20, NULL, 24),
(31, NULL, '0.00', 20, 2210, 28),
(32, NULL, '2.00', 20, 2208, 27),
(33, NULL, '0.00', 20, 2216, 29),
(34, NULL, '0.00', 20, 2217, 30),
(35, NULL, '0.00', 20, 2230, 33),
(36, NULL, '2.00', 20, 2234, 34),
(37, NULL, '0.00', 20, 2238, 35),
(38, NULL, '0.00', 20, 2242, 36),
(39, NULL, '0.00', 20, 2250, 38),
(40, NULL, '0.00', 20, 2246, 37),
(41, NULL, '0.00', 20, 2223, 31),
(42, NULL, '2.00', 20, 2227, 32),
(43, NULL, '0.00', 21, 2, 1),
(44, NULL, '0.00', 21, 8, 2),
(45, NULL, '0.00', 21, 12, 3),
(46, NULL, '0.00', 21, 2203, 22),
(47, NULL, '0.00', 21, 2104, 21),
(48, 'sdf', '0.00', 21, NULL, 23),
(49, 'sdf', '0.00', 21, NULL, 24),
(50, NULL, '0.00', 21, 2209, 28),
(51, NULL, '2.00', 21, 2208, 27),
(52, NULL, '0.00', 21, 2216, 29),
(53, NULL, '0.00', 21, 2217, 30),
(54, NULL, '0.00', 21, 2229, 33),
(55, NULL, '0.00', 21, 2235, 34),
(56, NULL, '0.00', 21, 2239, 35),
(57, NULL, '0.00', 21, 2243, 36),
(58, NULL, '0.00', 21, 2251, 38),
(59, NULL, '2.00', 21, 2227, 32),
(60, NULL, '0.00', 21, 2223, 31),
(61, NULL, '2.00', 22, 1, 1),
(62, NULL, '0.00', 22, 5, 2),
(63, NULL, '0.00', 22, 9, 3),
(64, NULL, '0.00', 22, 2101, 21),
(65, NULL, '0.00', 22, 2201, 22),
(66, NULL, '2.00', 23, 1, 1),
(67, NULL, '0.00', 23, 5, 2),
(68, NULL, '0.00', 23, 9, 3),
(69, NULL, '0.00', 23, 2101, 21),
(70, NULL, '0.00', 23, 2202, 22),
(71, NULL, '2.00', 24, 1, 1),
(72, NULL, '2.00', 24, 6, 2),
(73, NULL, '0.00', 24, 10, 3),
(74, NULL, '0.00', 24, 2101, 21),
(75, NULL, '0.00', 24, 2201, 22),
(76, NULL, '0.00', 26, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `progress_id` bigint(20) NOT NULL,
  `last_accessed` date DEFAULT NULL,
  `lessonid` bigint(20) DEFAULT NULL,
  `userid` bigint(20) DEFAULT NULL,
  `is_lesson_completed` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_progress`
--

INSERT INTO `user_progress` (`progress_id`, `last_accessed`, `lessonid`, `userid`, `is_lesson_completed`) VALUES
(45, '2025-12-01', 8, 3, b'1'),
(48, '2025-11-21', 9, 3, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `vocabularytheory`
--

CREATE TABLE `vocabularytheory` (
  `vocabid` bigint(20) NOT NULL,
  `example` varchar(255) DEFAULT NULL,
  `meaning` varchar(255) DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  `lessonid` bigint(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vocabularytheory`
--

INSERT INTO `vocabularytheory` (`vocabid`, `example`, `meaning`, `word`, `lessonid`, `image`) VALUES
(7, '제 이름은 민수입니다.\nTên tôi là Min-su. dd', 'Tên', '이름', 8, 'https://res.cloudinary.com/do0k0jkej/image/upload/v1751600701/kykpxar3buavllqhlqan.png'),
(8, '	성별을 적어 주세요.\r\n	Hãy ghi giới tính của bạn.', 'Giới tính', '성별', 8, NULL),
(10, '나이가 어떻게 되세요?\r\n	Bạn bao nhiêu tuổi?', 'Tuổi', '나이', 8, NULL),
(11, '생년월일이 어떻게 되세요?\r\nNgày sinh của bạn là khi nào?', 'Ngày sinh', '생년월일', 8, NULL),
(12, '제 국적은 베트남입니다.\r\nQuốc tịch của tôi là Việt Nam.', 'Quốc tịch', '국적', 8, NULL),
(13, '직업이 뭐예요?\r\nNghề của bạn là gì?', 'Nghề nghiệp', '직업', 8, NULL),
(14, '저는 학생이에요.\r\nTôi là học sinh.', 'Học sinh', '학생', 8, NULL),
(15, '저 분은 한국어 선생님이에요.\r\nNgười kia là giáo viên tiếng Hàn.', 'Giáo viên', '선생님', 8, NULL),
(16, '그는 삼성 회사원이에요.\r\nAnh ấy là nhân viên công ty Samsung.', 'Nhân viên công ty', '회사원', 8, NULL),
(17, '저는 엔지니어로 일하고 있어요.\r\nTôi đang làm việc với tư cách là kỹ sư.', 'Kỹ sư', '엔지니어', 8, NULL),
(18, '자기소개를 해 보세요.\r\nHãy thử tự giới thiệu bản thân.', 'Tự giới thiệu', '자기소개', 8, NULL),
(19, '만나서 반갑습니다.\r\nRất vui được gặp bạn.', 'Rất vui được gặp bạn', '반갑습니다', 8, NULL),
(20, '처음 뵙겠습니다.\r\nHân hạnh được gặp lần đầu.', 'Hân hạnh lần đầu gặp', '처음 뵙겠습니다', 8, NULL),
(21, '당신은 어디에서 왔어요?\r\nBạn đến từ đâu vậy?', 'Bạn đến từ đâu?', '어디에서 왔어요?', 8, NULL),
(22, '그는 한국 사람이에요.\r\nAnh ấy là người Hàn Quốc.', 'Người Hàn Quốc', '한국 사람', 8, NULL),
(23, '저는 베트남 사람이에요.\r\nTôi là người Việt Nam.', 'Người Việt Nam', '베트남 사람', 8, NULL),
(24, '가족이 몇 명이에요?\r\nGia đình bạn có mấy người?', 'Gia đình', '가족', 8, NULL),
(25, '취미가 뭐예요?\r\nSở thích của bạn là gì?', 'Sở thích', '취미', 8, NULL),
(26, '저는 베트남 사람이에요.\r\nTôi là người Việt Nam.', 'Người Việt Nam', '베트남 사람', 9, NULL),
(27, '그는 한국 사람이에요.\r\nAnh ấy là người Hàn Quốc.', 'Người Hàn Quốc', '한국 사람', 9, NULL),
(28, '미국 사람이에요.\r\nLà người Mỹ.', 'Người Mỹ', '미국 사람', 9, NULL),
(29, '일본 사람이에요.\r\nLà người Nhật.', 'Người Nhật', '일본 사람', 9, NULL),
(30, '중국 사람이에요.\r\nLà người Trung Quốc.', 'Người Trung Quốc', '중국 사람', 9, NULL),
(31, '의사예요.\r\nLà bác sĩ.', 'Bác sĩ', '의사', 9, NULL),
(32, '간호사예요.\r\nLà y tá.', 'Y tá', '간호사', 9, NULL),
(33, '요리사예요.\r\nLà đầu bếp.', 'Đầu bếp', '요리사', 9, NULL),
(34, '사업가예요.\r\nLà doanh nhân.', 'Doanh nhân', '사업가', 9, NULL),
(35, '프로그래머예요.\r\nLà lập trình viên.', 'Lập trình viên', '프로그래머', 9, NULL),
(36, '가족이 몇 명이에요?\r\nGia đình bạn có mấy người?', 'Gia đình', '가족', 10, NULL),
(37, '아버지는 회사원이에요.\r\nBố tôi là nhân viên công ty.', 'Bố', '아버지', 10, NULL),
(38, '어머니는 주부예요.\r\nMẹ tôi là nội trợ.', 'Mẹ', '어머니', 10, NULL),
(39, '형이 있어요.\r\nTôi có anh trai.', 'Anh trai', '형', 10, NULL),
(40, '누나가 있어요.\r\nTôi có chị gái.', 'Chị gái', '누나', 10, NULL),
(41, '동생이 있어요.\r\nTôi có em.', 'Em', '동생', 10, NULL),
(42, '할아버지가 계세요.\r\nCó ông nội.', 'Ông nội/ngoại', '할아버지', 10, NULL),
(43, '할머니가 계세요.\r\nCó bà nội.', 'Bà nội/ngoại', '할머니', 10, NULL),
(44, '부모님이 계세요.\r\nCó bố mẹ.', 'Bố mẹ', '부모님', 10, NULL),
(45, '아이가 있어요.\r\nCó con.', 'Con', '아이', 10, NULL),
(46, '지금 몇 시예요?\r\nBây giờ là mấy giờ?', 'Mấy giờ', '몇 시', 11, NULL),
(47, '오늘은 월요일이에요.\r\nHôm nay là thứ hai.', 'Hôm nay', '오늘', 11, NULL),
(48, '내일은 화요일이에요.\r\nNgày mai là thứ ba.', 'Ngày mai', '내일', 11, NULL),
(49, '어제는 일요일이었어요.\r\nHôm qua là chủ nhật.', 'Hôm qua', '어제', 11, NULL),
(50, '시간이 있어요?\r\nCó thời gian không?', 'Thời gian', '시간', 11, NULL),
(51, '아침에 일어나요.\r\nDậy vào buổi sáng.', 'Buổi sáng', '아침', 11, NULL),
(52, '점심을 먹어요.\r\nĂn trưa.', 'Buổi trưa', '점심', 11, NULL),
(53, '저녁에 집에 가요.\r\nTối về nhà.', 'Buổi tối', '저녁', 11, NULL),
(54, '밤에 잠을 자요.\r\nNgủ vào ban đêm.', 'Ban đêm', '밤', 11, NULL),
(55, '한 시간 기다려요.\r\nChờ một tiếng.', 'Một giờ', '한 시간', 11, NULL),
(56, '매일 운동해요.\r\nTập thể dục hàng ngày.', 'Hàng ngày', '매일', 12, NULL),
(57, '아침에 일어나요.\r\nDậy vào buổi sáng.', 'Dậy', '일어나다', 12, NULL),
(58, '세수를 해요.\r\nRửa mặt.', 'Rửa mặt', '세수', 12, NULL),
(59, '양치질을 해요.\r\nĐánh răng.', 'Đánh răng', '양치질', 12, NULL),
(60, '샤워를 해요.\r\nTắm.', 'Tắm', '샤워', 12, NULL),
(61, '아침을 먹어요.\r\nĂn sáng.', 'Ăn sáng', '아침식사', 12, NULL),
(62, '회사에 가요.\r\nĐi làm.', 'Công ty', '회사', 12, NULL),
(63, '일을 해요.\r\nLàm việc.', 'Làm việc', '일하다', 12, NULL),
(64, '퇴근해요.\r\nTan làm.', 'Tan làm', '퇴근', 12, NULL),
(65, '잠을 자요.\r\nNgủ.', 'Ngủ', '자다', 12, NULL),
(66, '쇼핑을 해요.\r\nMua sắm.', 'Mua sắm', '쇼핑', 13, NULL),
(67, '시장에 가요.\r\nĐi chợ.', 'Chợ', '시장', 13, NULL),
(68, '가게에 가요.\r\nĐi cửa hàng.', 'Cửa hàng', '가게', 13, NULL),
(69, '돈이 있어요.\r\nCó tiền.', 'Tiền', '돈', 13, NULL),
(70, '얼마예요?\r\nBao nhiêu tiền?', 'Bao nhiêu', '얼마', 13, NULL),
(71, '비싸요.\r\nĐắt.', 'Đắt', '비싸다', 13, NULL),
(72, '싸요.\r\nRẻ.', 'Rẻ', '싸다', 13, NULL),
(73, '카드로 계산해요.\r\nThanh toán bằng thẻ.', 'Thẻ', '카드', 13, NULL),
(74, '현금으로 내요.\r\nTrả bằng tiền mặt.', 'Tiền mặt', '현금', 13, NULL),
(75, '영수증을 주세요.\r\nCho tôi hóa đơn.', 'Hóa đơn', '영수증', 13, NULL),
(76, '밥을 먹어요.\r\nĂn cơm.', 'Cơm', '밥', 14, NULL),
(77, '김치를 좋아해요.\r\nThích kim chi.', 'Kim chi', '김치', 14, NULL),
(78, '불고기가 맛있어요.\r\nThịt nướng ngon.', 'Thịt nướng', '불고기', 14, NULL),
(79, '라면을 먹어요.\r\nĂn mì tôm.', 'Mì tôm', '라면', 14, NULL),
(80, '물을 마셔요.\r\nUống nước.', 'Nước', '물', 14, NULL),
(81, '커피를 마셔요.\r\nUống cà phê.', 'Cà phê', '커피', 14, NULL),
(82, '차를 마셔요.\r\nUống trà.', 'Trà', '차', 14, NULL),
(83, '맥주를 마셔요.\r\nUống bia.', 'Bia', '맥주', 14, NULL),
(84, '과일을 먹어요.\r\nĂn trái cây.', 'Trái cây', '과일', 14, NULL),
(85, '빵을 먹어요.\r\nĂn bánh mì.', 'Bánh mì', '빵', 14, NULL),
(86, '영화를 봐요.\r\nXem phim.', 'Phim', '영화', 15, NULL),
(87, '음악을 들어요.\r\nNghe nhạc.', 'Nhạc', '음악', 15, NULL),
(88, '책을 읽어요.\r\nĐọc sách.', 'Sách', '책', 15, NULL),
(89, '운동을 해요.\r\nTập thể dục.', 'Thể dục', '운동', 15, NULL),
(90, '게임을 해요.\r\nChơi game.', 'Game', '게임', 15, NULL),
(91, '요리를 해요.\r\nNấu ăn.', 'Nấu ăn', '요리', 15, NULL),
(92, '춤을 춰요.\r\nNhảy múa.', 'Nhảy múa', '춤', 15, NULL),
(93, '노래를 불러요.\r\nHát.', 'Hát', '노래', 15, NULL),
(94, '그림을 그려요.\r\nVẽ tranh.', 'Vẽ', '그림', 15, NULL),
(95, '여행을 해요.\r\nDu lịch.', 'Du lịch', '여행', 15, NULL),
(96, '주말에 쉬어요.\r\nNghỉ cuối tuần.', 'Cuối tuần', '주말', 16, NULL),
(97, '휴일이에요.\r\nLà ngày lễ.', 'Ngày lễ', '휴일', 16, NULL),
(98, '공원에 가요.\r\nĐi công viên.', 'Công viên', '공원', 16, NULL),
(99, '친구를 만나요.\r\nGặp bạn.', 'Bạn', '친구', 16, NULL),
(100, '집에서 쉬어요.\r\nNghỉ ở nhà.', 'Nghỉ', '쉬다', 16, NULL),
(101, '놀러 가요.\r\nĐi chơi.', 'Chơi', '놀다', 16, NULL),
(102, '피크닉을 해요.\r\nĐi dã ngoại.', 'Dã ngoại', '피크닉', 16, NULL),
(103, '바다에 가요.\r\nĐi biển.', 'Biển', '바다', 16, NULL),
(104, '산에 올라가요.\r\nLeo núi.', 'Núi', '산', 16, NULL),
(105, '카페에 가요.\r\nĐi cafe.', 'Cafe', '카페', 16, NULL),
(106, '어디에 가요?\r\nĐi đâu?', 'Đâu', '어디', 17, NULL),
(107, '왼쪽으로 가세요.\r\nĐi bên trái.', 'Bên trái', '왼쪽', 17, NULL),
(108, '오른쪽으로 가세요.\r\nĐi bên phải.', 'Bên phải', '오른쪽', 17, NULL),
(109, '직진하세요.\r\nĐi thẳng.', 'Thẳng', '직진', 17, NULL),
(110, '뒤로 가세요.\r\nĐi lùi.', 'Lùi', '뒤', 17, NULL),
(111, '앞으로 가세요.\r\nĐi tới.', 'Tới', '앞', 17, NULL),
(112, '위에 있어요.\r\nỞ trên.', 'Trên', '위', 17, NULL),
(113, '아래에 있어요.\r\nỞ dưới.', 'Dưới', '아래', 17, NULL),
(114, '옆에 있어요.\r\nỞ bên cạnh.', 'Bên cạnh', '옆', 17, NULL),
(115, '근처에 있어요.\r\nỞ gần đó.', 'Gần', '근처', 17, NULL),
(116, '버스를 타요.\r\nĐi xe buýt.', 'Xe buýt', '버스', 18, NULL),
(117, '지하철을 타요.\r\nĐi tàu điện ngầm.', 'Tàu điện ngầm', '지하철', 18, NULL),
(118, '택시를 타요.\r\nĐi taxi.', 'Taxi', '택시', 18, NULL),
(119, '비행기를 타요.\r\nĐi máy bay.', 'Máy bay', '비행기', 18, NULL),
(120, '기차를 타요.\r\nĐi tàu hỏa.', 'Tàu hỏa', '기차', 18, NULL),
(121, '자동차를 타요.\r\nĐi ô tô.', 'Ô tô', '자동차', 18, NULL),
(122, '자전거를 타요.\r\nĐi xe đạp.', 'Xe đạp', '자전거', 18, NULL),
(123, '오토바이를 타요.\r\nĐi xe máy.', 'Xe máy', '오토바이', 18, NULL),
(124, '걸어서 가요.\r\nĐi bộ.', 'Đi bộ', '걷다', 18, NULL),
(125, '정류장에서 기다려요.\r\nChờ ở trạm.', 'Trạm', '정류장', 18, NULL),
(126, '날씨가 좋아요.\r\nThời tiết đẹp.', 'Thời tiết', '날씨', 19, NULL),
(127, '비가 와요.\r\nMưa.', 'Mưa', '비', 19, NULL),
(128, '눈이 와요.\r\nTuyết.', 'Tuyết', '눈', 19, NULL),
(129, '바람이 불어요.\r\nCó gió.', 'Gió', '바람', 19, NULL),
(130, '더워요.\r\nNóng.', 'Nóng', '덥다', 19, NULL),
(131, '추워요.\r\nLạnh.', 'Lạnh', '춥다', 19, NULL),
(132, '맑아요.\r\nTrời quang.', 'Quang', '맑다', 19, NULL),
(133, '흐려요.\r\nU ám.', 'U ám', '흐리다', 19, NULL),
(134, '습해요.\r\nẨm ướt.', 'Ẩm ướt', '습하다', 19, NULL),
(135, '건조해요.\r\nKhô ráo.', 'Khô ráo', '건조하다', 19, NULL),
(136, '생일이 언제예요?\r\nSinh nhật khi nào?', 'Sinh nhật', '생일', 20, NULL),
(137, '축하해요!\r\nChúc mừng!', 'Chúc mừng', '축하', 20, NULL),
(138, '선물을 줘요.\r\nTặng quà.', 'Quà', '선물', 20, NULL),
(139, '케이크를 먹어요.\r\nĂn bánh kem.', 'Bánh kem', '케이크', 20, NULL),
(140, '촛불을 불어요.\r\nThổi nến.', 'Nến', '촛불', 20, NULL),
(141, '파티를 해요.\r\nTổ chức tiệc.', 'Tiệc', '파티', 20, NULL),
(142, '친구들을 초대해요.\r\nMời bạn bè.', 'Mời', '초대', 20, NULL),
(143, '나이를 먹어요.\r\nTăng tuổi.', 'Tuổi', '나이', 20, NULL),
(144, '소원을 빌어요.\r\nCầu nguyện.', 'Cầu nguyện', '소원', 20, NULL),
(145, '행복해요.\r\nHạnh phúc.', 'Hạnh phúc', '행복', 20, NULL),
(146, '옷을 입어요.\r\nMặc quần áo.', 'Quần áo', '옷', 21, NULL),
(147, '셔츠를 입어요.\r\nMặc áo sơ mi.', 'Áo sơ mi', '셔츠', 21, NULL),
(148, '바지를 입어요.\r\nMặc quần.', 'Quần', '바지', 21, NULL),
(149, '치마를 입어요.\r\nMặc chân váy.', 'Chân váy', '치마', 21, NULL),
(150, '신발을 신어요.\r\nĐi giày.', 'Giày', '신발', 21, NULL),
(151, '모자를 써요.\r\nĐội mũ.', 'Mũ', '모자', 21, NULL),
(152, '안경을 써요.\r\nĐeo kính.', 'Kính', '안경', 21, NULL),
(153, '시계를 차요.\r\nĐeo đồng hồ.', 'Đồng hồ', '시계', 21, NULL),
(154, '가방을 들어요.\r\nXách túi.', 'Túi', '가방', 21, NULL),
(155, '예뻐요.\r\nĐẹp.', 'Đẹp', '예쁘다', 21, NULL),
(156, '집에 있어요.\r\nỞ nhà.', 'Nhà', '집', 22, NULL),
(157, '방이 있어요.\r\nCó phòng.', 'Phòng', '방', 22, NULL),
(158, '침실이 있어요.\r\nCó phòng ngủ.', 'Phòng ngủ', '침실', 22, NULL),
(159, '부엌이 있어요.\r\nCó bếp.', 'Bếp', '부엌', 22, NULL),
(160, '화장실이 있어요.\r\nCó nhà vệ sinh.', 'Nhà vệ sinh', '화장실', 22, NULL),
(161, '거실이 있어요.\r\nCó phòng khách.', 'Phòng khách', '거실', 22, NULL),
(162, '문을 열어요.\r\nMở cửa.', 'Cửa', '문', 22, NULL),
(163, '창문을 열어요.\r\nMở cửa sổ.', 'Cửa sổ', '창문', 22, NULL),
(164, '침대에서 자요.\r\nNgủ trên giường.', 'Giường', '침대', 22, NULL),
(165, '소파에 앉아요.\r\nNgồi ghế sofa.', 'Ghế sofa', '소파', 22, NULL),
(166, '전화를 해요.\r\nGọi điện.', 'Điện thoại', '전화', 23, NULL),
(167, '휴대폰을 써요.\r\nDùng điện thoại di động.', 'Di động', '휴대폰', 23, NULL),
(168, '문자를 보내요.\r\nGửi tin nhắn.', 'Tin nhắn', '문자', 23, NULL),
(169, '이메일을 보내요.\r\nGửi email.', 'Email', '이메일', 23, NULL),
(170, '인터넷을 써요.\r\nDùng internet.', 'Internet', '인터넷', 23, NULL),
(171, '번호가 뭐예요?\r\nSố điện thoại là gì?', 'Số', '번호', 23, NULL),
(172, '여보세요?\r\nXin chào? (điện thoại)', 'Xin chào', '여보세요', 23, NULL),
(173, '안녕히 가세요.\r\nTạm biệt.', 'Tạm biệt', '안녕히 가세요', 23, NULL),
(174, '연락해요.\r\nLiên lạc.', 'Liên lạc', '연락', 23, NULL),
(175, '카카오톡을 해요.\r\nDùng KakaoTalk.', 'KakaoTalk', '카카오톡', 23, NULL),
(176, '편지를 써요.\r\nViết thư.', 'Thư', '편지', 24, NULL),
(177, '우체국에 가요.\r\nĐi bưu điện.', 'Bưu điện', '우체국', 24, NULL),
(178, '우표를 붙여요.\r\nDán tem.', 'Tem', '우표', 24, NULL),
(179, '소포를 보내요.\r\nGửi bưu kiện.', 'Bưu kiện', '소포', 24, NULL),
(180, '주소를 써요.\r\nViết địa chỉ.', 'Địa chỉ', '주소', 24, NULL),
(181, '받는 사람이에요.\r\nNgười nhận.', 'Người nhận', '받는 사람', 24, NULL),
(182, '보내는 사람이에요.\r\nNgười gửi.', 'Người gửi', '보내는 사람', 24, NULL),
(183, '배달을 해요.\r\nGiao hàng.', 'Giao hàng', '배달', 24, NULL),
(184, '택배를 받아요.\r\nNhận hàng.', 'Nhận hàng', '택배', 24, NULL),
(185, '빨리 보내요.\r\nGửi nhanh.', 'Nhanh', '빨리', 24, NULL),
(186, '아파요.\r\nĐau/Bệnh.', 'Đau', '아프다', 25, 'https://res.cloudinary.com/do0k0jkej/video/upload/v1751600661/fgscroqcmnnmpzz1zkmt.mp4'),
(187, '병원에 가요.\r\nĐi bệnh viện.', 'Bệnh viện', '병원', 25, NULL),
(188, '의사를 만나요.\r\nGặp bác sĩ.', 'Bác sĩ', '의사', 25, NULL),
(189, '약을 먹어요.\r\nUống thuốc.', 'Thuốc', '약', 25, NULL),
(190, '머리가 아파요.\r\nĐau đầu.', 'Đầu', '머리', 25, NULL),
(191, '배가 아파요.\r\nĐau bụng.', 'Bụng', '배', 25, NULL),
(192, '감기에 걸렸어요.\r\nBị cảm.', 'Cảm', '감기', 25, NULL),
(193, '열이 나요.\r\nBị sốt.', 'Sốt', '열', 25, NULL),
(194, '기침을 해요.\r\nHo.', 'Ho', '기침', 25, NULL),
(195, '건강해요.\r\nKhỏe mạnh.', 'Khỏe mạnh', '건강', 25, NULL),
(196, '계획이 있어요.\r\nCó kế hoạch.', 'Kế hoạch', '계획', 26, NULL),
(197, '약속이 있어요.\r\nCó hẹn.', 'Hẹn', '약속', 26, NULL),
(198, '회의가 있어요.\r\nCó họp.', 'Họp', '회의', 26, NULL),
(199, '시험을 봐요.\r\nThi.', 'Thi', '시험', 26, NULL),
(200, '숙제를 해요.\r\nLàm bài tập.', 'Bài tập', '숙제', 26, NULL),
(201, '준비해요.\r\nChuẩn bị.', 'Chuẩn bị', '준비', 26, NULL),
(202, '참석해요.\r\nTham gia.', 'Tham gia', '참석', 26, NULL),
(203, '취소해요.\r\nHủy bỏ.', 'Hủy bỏ', '취소', 26, NULL),
(204, '연기해요.\r\nHoãn lại.', 'Hoãn', '연기', 26, NULL),
(205, '성공해요.\r\nThành công.', 'Thành công', '성공', 26, NULL),
(206, '생활을 해요.\r\nSống.', 'Cuộc sống', '생활', 27, NULL),
(207, '습관이 있어요.\r\nCó thói quen.', 'Thói quen', '습관', 27, NULL),
(208, '규칙적으로 해요.\r\nLàm đều đặn.', 'Đều đặn', '규칙적', 27, NULL),
(209, '건강하게 살아요.\r\nSống khỏe mạnh.', 'Khỏe mạnh', '건강하다', 27, NULL),
(210, '균형을 맞춰요.\r\nCân bằng.', 'Cân bằng', '균형', 27, NULL),
(211, '스트레스를 받아요.\r\nCăng thẳng.', 'Căng thẳng', '스트레스', 27, NULL),
(212, '휴식을 취해요.\r\nNghỉ ngơi.', 'Nghỉ ngơi', '휴식', 27, NULL),
(213, '여가 시간이 있어요.\r\nCó thời gian rảnh.', 'Thời gian rảnh', '여가', 27, NULL),
(214, '취침 시간이에요.\r\nGiờ đi ngủ.', 'Giờ đi ngủ', '취침', 27, NULL),
(215, '기상 시간이에요.\r\nGiờ thức dậy.', 'Giờ thức dậy', '기상', 27, NULL),
(216, '학교에 다녀요.\r\nĐi học.', 'Trường học', '학교', 28, NULL),
(217, '수업을 들어요.\r\nNghe bài.', 'Bài học', '수업', 28, NULL),
(218, '선생님이 가르쳐요.\r\nGiáo viên dạy.', 'Dạy', '가르치다', 28, NULL),
(219, '공부를 해요.\r\nHọc.', 'Học', '공부', 28, NULL),
(220, '교실에 있어요.\r\nỞ lớp học.', 'Lớp học', '교실', 28, NULL),
(221, '도서관에 가요.\r\nĐi thư viện.', 'Thư viện', '도서관', 28, NULL),
(222, '시험을 봐요.\r\nThi.', 'Thi cử', '시험', 28, NULL),
(223, '성적이 좋아요.\r\nĐiểm tốt.', 'Điểm số', '성적', 28, NULL),
(224, '졸업을 해요.\r\nTốt nghiệp.', 'Tốt nghiệp', '졸업', 28, NULL),
(225, '입학을 해요.\r\nNhập học.', 'Nhập học', '입학', 28, NULL),
(226, '친구를 사귀어요.\r\nKết bạn.', 'Kết bạn', '사귀다', 29, NULL),
(227, '대화를 해요.\r\nTrò chuyện.', 'Trò chuyện', '대화', 29, NULL),
(228, '소통을 해요.\r\nGiao tiếp.', 'Giao tiếp', '소통', 29, NULL),
(229, '이야기를 해요.\r\nKể chuyện.', 'Chuyện', '이야기', 29, NULL),
(230, '농담을 해요.\r\nNói đùa.', 'Đùa', '농담', 29, NULL),
(231, '비밀을 말해요.\r\nNói bí mật.', 'Bí mật', '비밀', 29, NULL),
(232, '신뢰해요.\r\nTin tưởng.', 'Tin tưởng', '신뢰', 29, NULL),
(233, '도움을 줘요.\r\nGiúp đỡ.', 'Giúp đỡ', '도움', 29, NULL),
(234, '조언을 해요.\r\nKhuyên.', 'Khuyên', '조언', 29, NULL),
(235, '우정이 있어요.\r\nCó tình bạn.', 'Tình bạn', '우정', 29, NULL),
(236, '여행을 가요.\r\nĐi du lịch.', 'Du lịch', '여행', 30, NULL),
(237, '관광을 해요.\r\nTham quan.', 'Tham quan', '관광', 30, NULL),
(238, '호텔에 머물러요.\r\nỞ khách sạn.', 'Khách sạn', '호텔', 30, NULL),
(239, '비행기를 타요.\r\nĐi máy bay.', 'Máy bay', '비행기', 30, NULL),
(240, '짐을 싸요.\r\nXếp hành lý.', 'Hành lý', '짐', 30, NULL),
(241, '사진을 찍어요.\r\nChụp ảnh.', 'Chụp ảnh', '사진', 30, NULL),
(242, '기념품을 사요.\r\nMua quà lưu niệm.', 'Quà lưu niệm', '기념품', 30, NULL),
(243, '지도를 봐요.\r\nXem bản đồ.', 'Bản đồ', '지도', 30, NULL),
(244, '길을 물어봐요.\r\nHỏi đường.', 'Hỏi đường', '길을 묻다', 30, NULL),
(245, '여행 가이드예요.\r\nHướng dẫn viên.', 'Hướng dẫn viên', '가이드', 30, NULL),
(246, '한국 음식을 먹어요.\r\nĂn đồ ăn Hàn Quốc.', 'Đồ ăn Hàn Quốc', '한국 음식', 31, NULL),
(247, '비빔밥을 먹어요.\r\nĂn cơm trộn.', 'Cơm trộn', '비빔밥', 31, NULL),
(248, '냉면을 먹어요.\r\nĂn mì lạnh.', 'Mì lạnh', '냉면', 31, NULL),
(249, '떡볶이를 먹어요.\r\nĂn bánh gạo cay.', 'Bánh gạo cay', '떡볶이', 31, NULL),
(250, '삼겹살을 구워요.\r\nNướng thịt ba chỉ.', 'Thịt ba chỉ', '삼겹살', 31, NULL),
(251, '치킨을 먹어요.\r\nĂn gà rán.', 'Gà rán', '치킨', 31, NULL),
(252, '소주를 마셔요.\r\nUống soju.', 'Soju', '소주', 31, NULL),
(253, '맵다고 해요.\r\nNói cay.', 'Cay', '맵다', 31, NULL),
(254, '달다고 해요.\r\nNói ngọt.', 'Ngọt', '달다', 31, NULL),
(255, '짜다고 해요.\r\nNói mặn.', 'Mặn', '짜다', 31, NULL),
(256, '데이트를 해요.\r\nHẹn hò.', 'Hẹn hò', '데이트', 32, NULL),
(257, '사랑해요.\r\nYêu.', 'Yêu', '사랑', 32, NULL),
(258, '좋아해요.\r\nThích.', 'Thích', '좋아하다', 32, NULL),
(259, '연인이에요.\r\nNgười yêu.', 'Người yêu', '연인', 32, NULL),
(260, '남자친구예요.\r\nBạn trai.', 'Bạn trai', '남자친구', 32, NULL),
(261, '여자친구예요.\r\nBạn gái.', 'Bạn gái', '여자친구', 32, NULL),
(262, '결혼해요.\r\nKết hôn.', 'Kết hôn', '결혼', 32, NULL),
(263, '프러포즈해요.\r\nCầu hôn.', 'Cầu hôn', '프러포즈', 32, NULL),
(264, '선물을 줘요.\r\nTặng quà.', 'Tặng quà', '선물을 주다', 32, NULL),
(265, '로맨틱해요.\r\nLãng mạn.', 'Lãng mạn', '로맨틱', 32, NULL),
(266, '한국 문화를 배워요.\r\nHọc văn hóa Hàn Quốc.', 'Văn hóa', '문화', 33, NULL),
(267, '추석을 축하해요.\r\nChúc mừng tết trung thu.', 'Tết trung thu', '추석', 33, NULL),
(268, '설날에 세배를 해요.\r\nChúc tết vào ngày tết.', 'Tết nguyên đán', '설날', 33, NULL),
(269, '전통 음식을 먹어요.\r\nĂn đồ ăn truyền thống.', 'Truyền thống', '전통', 33, NULL),
(270, '한복을 입어요.\r\nMặc hanbok.', 'Hanbok', '한복', 33, NULL),
(271, '축제에 참여해요.\r\nTham gia lễ hội.', 'Lễ hội', '축제', 33, NULL),
(272, '예절을 지켜요.\r\nGiữ phép lịch sự.', 'Phép lịch sự', '예절', 33, NULL),
(273, '조상을 기억해요.\r\nTưởng nhớ tổ tiên.', 'Tổ tiên', '조상', 33, NULL),
(274, '세배 돈을 받아요.\r\nNhận tiền lì xì.', 'Tiền lì xì', '세배 돈', 33, NULL),
(275, '민속 놀이를 해요.\r\nChơi trò chơi dân gian.', 'Trò chơi dân gian', '민속 놀이', 33, NULL),
(276, '뉴스를 봐요.\r\nXem tin tức.', 'Tin tức', '뉴스', 34, NULL),
(277, '신문을 읽어요.\r\nĐọc báo.', 'Báo', '신문', 34, NULL),
(278, '텔레비전을 켜요.\r\nBật tivi.', 'Tivi', '텔레비전', 34, NULL),
(279, '라디오를 들어요.\r\nNghe radio.', 'Radio', '라디오', 34, NULL),
(280, '인터넷을 검색해요.\r\nTìm kiếm trên internet.', 'Tìm kiếm', '검색', 34, NULL),
(281, '소셜 미디어를 써요.\r\nDùng mạng xã hội.', 'Mạng xã hội', '소셜 미디어', 34, NULL),
(282, '기자가 취재해요.\r\nPhóng viên đưa tin.', 'Phóng viên', '기자', 34, NULL),
(283, '광고를 봐요.\r\nXem quảng cáo.', 'Quảng cáo', '광고', 34, NULL),
(284, '방송국에서 일해요.\r\nLàm việc ở đài truyền hình.', 'Đài truyền hình', '방송국', 34, NULL),
(285, '정보를 얻어요.\r\nNhận thông tin.', 'Thông tin', '정보', 34, NULL),
(286, '직장에 다녀요.\r\nĐi làm.', 'Nơi làm việc', '직장', 35, NULL),
(287, '동료와 일해요.\r\nLàm việc với đồng nghiệp.', 'Đồng nghiệp', '동료', 35, NULL),
(288, '상사를 만나요.\r\nGặp sếp.', 'Sếp', '상사', 35, NULL),
(289, '부하 직원이 있어요.\r\nCó nhân viên cấp dưới.', 'Nhân viên cấp dưới', '부하 직원', 35, NULL),
(290, '급여를 받아요.\r\nNhận lương.', 'Lương', '급여', 35, NULL),
(291, '승진을 해요.\r\nThăng chức.', 'Thăng chức', '승진', 35, NULL),
(292, '회의를 해요.\r\nHọp.', 'Họp', '회의', 35, NULL),
(293, '프로젝트를 진행해요.\r\nThực hiện dự án.', 'Dự án', '프로젝트', 35, NULL),
(294, '업무를 처리해요.\r\nXử lý công việc.', 'Công việc', '업무', 35, NULL),
(295, '성과를 내요.\r\nĐạt thành quả.', 'Thành quả', '성과', 35, NULL),
(296, '환경을 보호해요.\r\nBảo vệ môi trường.', 'Môi trường', '환경', 36, NULL),
(297, '공해가 심해요.\r\nÔ nhiễm nghiêm trọng.', 'Ô nhiễm', '공해', 36, NULL),
(298, '재활용을 해요.\r\nTái chế.', 'Tái chế', '재활용', 36, NULL),
(299, '쓰레기를 버려요.\r\nVứt rác.', 'Rác', '쓰레기', 36, NULL),
(300, '분리수거를 해요.\r\nPhân loại rác.', 'Phân loại rác', '분리수거', 36, NULL),
(301, '자연을 사랑해요.\r\nYêu thiên nhiên.', 'Thiên nhiên', '자연', 36, NULL),
(302, '공기가 깨끗해요.\r\nKhông khí sạch.', 'Không khí', '공기', 36, NULL),
(303, '물을 절약해요.\r\nTiết kiệm nước.', 'Tiết kiệm', '절약', 36, NULL),
(304, '에너지를 아껴요.\r\nTiết kiệm năng lượng.', 'Năng lượng', '에너지', 36, NULL),
(305, '지구 온난화가 문제예요.\r\nSự nóng lên toàn cầu là vấn đề.', 'Sự nóng lên toàn cầu', '지구 온난화', 36, NULL),
(306, '비즈니스 미팅을 해요.\r\nCó cuộc họp kinh doanh.', 'Cuộc họp kinh doanh', '비즈니스 미팅', 37, NULL),
(307, '프레젠테이션을 해요.\r\nThuyết trình.', 'Thuyết trình', '프레젠테이션', 37, NULL),
(308, '계약을 체결해요.\r\nKý hợp đồng.', 'Hợp đồng', '계약', 37, NULL),
(309, '협상을 해요.\r\nĐàm phán.', 'Đàm phán', '협상', 37, NULL),
(310, '고객을 응대해요.\r\nPhục vụ khách hàng.', 'Khách hàng', '고객', 37, NULL),
(311, '보고서를 작성해요.\r\nViết báo cáo.', 'Báo cáo', '보고서', 37, NULL),
(312, '일정을 조율해요.\r\nĐiều phối lịch trình.', 'Lịch trình', '일정', 37, NULL),
(313, '이메일을 확인해요.\r\nKiểm tra email.', 'Kiểm tra', '확인', 37, NULL),
(314, '팀워크가 중요해요.\r\nLàm việc nhóm quan trọng.', 'Làm việc nhóm', '팀워크', 37, NULL),
(315, '마감일을 지켜요.\r\nGiữ đúng hạn chót.', 'Hạn chót', '마감일', 37, NULL),
(316, '온라인 쇼핑을 해요.\r\nMua sắm trực tuyến.', 'Trực tuyến', '온라인', 38, NULL),
(317, '인터넷으로 주문해요.\r\nĐặt hàng qua internet.', 'Đặt hàng', '주문', 38, NULL),
(318, '배송을 기다려요.\r\nChờ giao hàng.', 'Giao hàng', '배송', 38, NULL),
(319, '결제를 해요.\r\nThanh toán.', 'Thanh toán', '결제', 38, NULL),
(320, '할인을 받아요.\r\nNhận giảm giá.', 'Giảm giá', '할인', 38, NULL),
(321, '리뷰를 써요.\r\nViết đánh giá.', 'Đánh giá', '리뷰', 38, NULL),
(322, '교환을 요청해요.\r\nYêu cầu đổi hàng.', 'Đổi hàng', '교환', 38, NULL),
(323, '환불을 받아요.\r\nNhận hoàn tiền.', 'Hoàn tiền', '환불', 38, NULL),
(324, '쿠폰을 사용해요.\r\nSử dụng coupon.', 'Coupon', '쿠폰', 38, NULL),
(325, '장바구니에 담아요.\r\nThêm vào giỏ hàng.', 'Giỏ hàng', '장바구니', 38, NULL),
(326, '기쁘다고 말해요.\r\nNói vui.', 'Vui', '기쁘다', 39, NULL),
(327, '슬프다고 해요.\r\nNói buồn.', 'Buồn', '슬프다', 39, NULL),
(328, '화가 나요.\r\nTức giận.', 'Tức giận', '화나다', 39, NULL),
(329, '무서워해요.\r\nSợ.', 'Sợ', '무섭다', 39, NULL),
(330, '놀라요.\r\nNgạc nhiên.', 'Ngạc nhiên', '놀라다', 39, NULL),
(331, '걱정이 돼요.\r\nLo lắng.', 'Lo lắng', '걱정', 39, NULL),
(332, '안심이 돼요.\r\nYên tâm.', 'Yên tâm', '안심', 39, NULL),
(333, '감동받아요.\r\nCảm động.', 'Cảm động', '감동', 39, NULL),
(334, '실망해요.\r\nThất vọng.', 'Thất vọng', '실망', 39, NULL),
(335, '만족해요.\r\nHài lòng.', 'Hài lòng', '만족', 39, NULL),
(336, '변화가 있어요.\r\nCó sự thay đổi.', 'Sự thay đổi', '변화', 40, NULL),
(337, '개선이 필요해요.\r\nCần cải thiện.', 'Cải thiện', '개선', 40, NULL),
(338, '발전하고 있어요.\r\nĐang phát triển.', 'Phát triển', '발전', 40, NULL),
(339, '진보를 이뤄요.\r\nĐạt được tiến bộ.', 'Tiến bộ', '진보', 40, NULL),
(340, '혁신을 추구해요.\r\nTheo đuổi đổi mới.', 'Đổi mới', '혁신', 40, NULL),
(341, '전환점이에요.\r\nLà bước ngoặt.', 'Bước ngoặt', '전환점', 40, NULL),
(342, '적응하려고 해요.\r\nCố gắng thích nghi.', 'Thích nghi', '적응', 40, NULL),
(343, '조정이 필요해요.\r\nCần điều chỉnh.', 'Điều chỉnh', '조정', 40, NULL),
(344, '새로운 시작이에요.\r\nLà khởi đầu mới.', 'Khởi đầu', '시작', 40, NULL),
(345, '결과를 봐요.\r\nXem kết quả.', 'Kết quả', '결과', 40, NULL),
(346, '컴퓨터를 사용해요.\r\nSử dụng máy tính.', 'Máy tính', '컴퓨터', 41, NULL),
(347, '소프트웨어를 설치해요.\r\nCài đặt phần mềm.', 'Phần mềm', '소프트웨어', 41, NULL),
(348, '앱을 다운로드해요.\r\nTải ứng dụng.', 'Ứng dụng', '앱', 41, NULL),
(349, '와이파이에 연결해요.\r\nKết nối wifi.', 'Wifi', '와이파이', 41, NULL),
(350, '데이터를 백업해요.\r\nSao lưu dữ liệu.', 'Dữ liệu', '데이터', 41, NULL),
(351, '바이러스를 검사해요.\r\nQuét virus.', 'Virus', '바이러스', 41, NULL),
(352, '업데이트를 해요.\r\nCập nhật.', 'Cập nhật', '업데이트', 41, NULL),
(353, '클라우드를 이용해요.\r\nSử dụng cloud.', 'Cloud', '클라우드', 41, NULL),
(354, '해킹을 당했어요.\r\nBị hack.', 'Hack', '해킹', 41, NULL),
(355, '보안이 중요해요.\r\nBảo mật quan trọng.', 'Bảo mật', '보안', 41, NULL),
(356, '꿈을 꿔요.\r\nCó ước mơ.', 'Ước mơ', '꿈', 42, NULL),
(357, '목표를 세워요.\r\nĐặt mục tiêu.', 'Mục tiêu', '목표', 42, NULL),
(358, '계획을 실행해요.\r\nThực hiện kế hoạch.', 'Thực hiện', '실행', 42, NULL),
(359, '노력을 해요.\r\nCố gắng.', 'Cố gắng', '노력', 42, NULL),
(360, '성취감을 느껴요.\r\nCảm thấy thành tựu.', 'Thành tựu', '성취', 42, NULL),
(361, '의지력이 강해요.\r\nÝ chí mạnh mẽ.', 'Ý chí', '의지', 42, NULL),
(362, '동기부여가 필요해요.\r\nCần động lực.', 'Động lực', '동기부여', 42, NULL),
(363, '인내심을 가져요.\r\nCó kiên nhẫn.', 'Kiên nhẫn', '인내심', 42, NULL),
(364, '포기하지 않아요.\r\nKhông bỏ cuộc.', 'Bỏ cuộc', '포기', 42, NULL),
(365, '희망을 가져요.\r\nCó hy vọng.', 'Hy vọng', '희망', 42, NULL),
(366, '역사를 공부해요.\r\nHọc lịch sử.', 'Lịch sử', '역사', 43, NULL),
(367, '과거를 되돌아봐요.\r\nNhìn lại quá khứ.', 'Quá khứ', '과거', 43, NULL),
(368, '왕조가 있었어요.\r\nCó triều đại.', 'Triều đại', '왕조', 43, NULL),
(369, '유물을 발견해요.\r\nPhát hiện di vật.', 'Di vật', '유물', 43, NULL),
(370, '박물관을 방문해요.\r\nThăm bảo tàng.', 'Bảo tàng', '박물관', 43, NULL),
(371, '유적지를 둘러봐요.\r\nTham quan di tích.', 'Di tích', '유적지', 43, NULL),
(372, '조상의 지혜예요.\r\nTrí tuệ tổ tiên.', 'Trí tuệ', '지혜', 43, NULL),
(373, '문화재를 보존해요.\r\nBảo tон văn hóa.', 'Văn hóa phẩm', '문화재', 43, NULL),
(374, '기록을 남겨요.\r\nĐể lại ghi chép.', 'Ghi chép', '기록', 43, NULL),
(375, '교훈을 얻어요.\r\nRút ra bài học.', 'Bài học', '교훈', 43, NULL),
(376, '한국 생활이 어때요?\r\nCuộc sống ở Hàn Quốc thế nào?', 'Cuộc sống', '생활', 44, NULL),
(377, '한국 문화에 적응했어요.\r\nĐã thích nghi với văn hóa Hàn Quốc.', 'Thích nghi', '적응', 44, NULL),
(378, '예의가 중요해요.\r\nPhép lịch sự quan trọng.', 'Phép lịch sự', '예의', 44, NULL),
(379, '사회 생활을 해요.\r\nSống xã hội.', 'Sống xã hội', '사회 생활', 44, NULL),
(380, '인사를 꼭 해야 해요.\r\nNhất định phải chào hỏi.', 'Chào hỏi', '인사', 44, NULL),
(381, '존댓말을 써요.\r\nDùng kính ngữ.', 'Kính ngữ', '존댓말', 44, NULL),
(382, '연령대가 달라요.\r\nĐộ tuổi khác nhau.', 'Độ tuổi', '연령대', 44, NULL),
(383, '계층이 있어요.\r\nCó tầng lớp.', 'Tầng lớp', '계층', 44, NULL),
(384, '위계질서를 지켜요.\r\nGiữ trật tự thứ bậc.', 'Trật tự thứ bậc', '위계질서', 44, NULL),
(385, '집단주의 문화예요.\r\nVăn hóa tập thể.', 'Tập thể', '집단주의', 44, NULL),
(386, '문화 차이가 있어요.\r\nCó sự khác biệt văn hóa.', 'Sự khác biệt', '차이', 45, NULL),
(387, '관습이 달라요.\r\nPhong tục khác nhau.', 'Phong tục', '관습', 45, NULL),
(388, '사고방식이 다릅니다.\r\nCách suy nghĩ khác nhau.', 'Cách suy nghĩ', '사고방식', 45, NULL),
(389, '가치관을 이해해요.\r\nHiểu giá trị quan.', 'Giá trị quan', '가치관', 45, NULL),
(390, '편견을 버려요.\r\nBỏ thành kiến.', 'Thành kiến', '편견', 45, NULL),
(391, '다양성을 인정해요.\r\nThừa nhận tính đa dạng.', 'Tính đa dạng', '다양성', 45, NULL),
(392, '배경이 다릅니다.\r\nBối cảnh khác nhau.', 'Bối cảnh', '배경', 45, NULL),
(393, '오해가 생겨요.\r\nPhát sinh hiểu lầm.', 'Hiểu lầm', '오해', 45, NULL),
(394, '소통이 어려워요.\r\nGiao tiếp khó khăn.', 'Khó khăn', '어렵다', 45, NULL),
(395, '포용력이 필요해요.\r\nCần lòng bao dung.', 'Lòng bao dung', '포용력', 45, NULL),
(396, '인간관계가 복잡해요.\r\nMối quan hệ con người phức tạp.', 'Mối quan hệ con người', '인간관계', 46, NULL),
(397, '사회적 지위가 중요해요.\r\nVị thế xã hội quan trọng.', 'Vị thế xã hội', '사회적 지위', 46, NULL),
(398, '네트워킹을 해요.\r\nXây dựng mạng lưới.', 'Mạng lưới', '네트워킹', 46, NULL),
(399, '소외감을 느껴요.\r\nCảm thấy bị cô lập.', 'Sự cô lập', '소외감', 46, NULL),
(400, '소속감이 있어요.\r\nCó cảm giác thuộc về.', 'Cảm giác thuộc về', '소속감', 46, NULL),
(401, '갈등을 해결해요.\r\nGiải quyết xung đột.', 'Xung đột', '갈등', 46, NULL),
(402, '협력이 필요해요.\r\nCần hợp tác.', 'Hợp tác', '협력', 46, NULL),
(403, '사회성을 기려요.\r\nPhát triển kỹ năng xã hội.', 'Kỹ năng xã hội', '사회성', 46, NULL),
(404, '배려심을 가져요.\r\nCó tính thể hiện.', 'Sự thể hiện', '배려심', 46, NULL),
(405, '유대관계를 형성해요.\r\nHình thành mối liên kết.', 'Mối liên kết', '유대관계', 46, NULL),
(406, '일상적인 업무예요.\r\nCông việc hàng ngày.', 'Hàng ngày', '일상적', 47, NULL),
(407, '루틴을 지켜요.\r\nGiữ thói quen.', 'Thói quen', '루틴', 47, NULL),
(408, '예상치 못한 일이에요.\r\nChuyện bất ngờ.', 'Bất ngờ', '예상치 못한', 47, NULL),
(409, '긴급상황이 발생했어요.\r\nXảy ra tình huống khẩn cấp.', 'Tình huống khẩn cấp', '긴급상황', 47, NULL),
(410, '대처 방안을 세워요.\r\nLập phương án đối phó.', 'Phương án đối phó', '대처 방안', 47, NULL),
(411, '문제를 해결해요.\r\nGiải quyết vấn đề.', 'Vấn đề', '문제', 47, NULL),
(412, '효율성을 추구해요.\r\nTheo đuổi hiệu quả.', 'Hiệu quả', '효율성', 47, NULL),
(413, '시간 관리가 중요해요.\r\nQuản lý thời gian quan trọng.', 'Quản lý thời gian', '시간 관리', 47, NULL),
(414, '우선순위를 정해요.\r\nXác định ưu tiên.', 'Ưu tiên', '우선순위', 47, NULL),
(415, '균형을 잡아요.\r\nGiữ cân bằng.', 'Cân bằng', '균형', 47, NULL),
(416, '면접을 봐요.\r\nPhỏng vấn.', 'Phỏng vấn', '면접', 48, NULL),
(417, '이력서를 제출해요.\r\nNộp sơ yếu lý lịch.', 'Sơ yếu lý lịch', '이력서', 48, NULL),
(418, '자기소개서를 써요.\r\nViết thư xin việc.', 'Thư xin việc', '자기소개서', 48, NULL),
(419, '경력을 쌓아요.\r\nTích lũy kinh nghiệm.', 'Kinh nghiệm', '경력', 48, NULL),
(420, '자격증을 취득해요.\r\nLấy chứng chỉ.', 'Chứng chỉ', '자격증', 48, NULL),
(421, '포트폴리오를 준비해요.\r\nChuẩn bị portfolio.', 'Portfolio', '포트폴리오', 48, NULL),
(422, '채용 공고를 확인해요.\r\nKiểm tra thông báo tuyển dụng.', 'Thông báo tuyển dụng', '채용 공고', 48, NULL),
(423, '추천서를 받아요.\r\nNhận thư giới thiệu.', 'Thư giới thiệu', '추천서', 48, NULL),
(424, '연봉을 협상해요.\r\nThương lượng lương.', 'Thương lượng', '협상', 48, NULL),
(425, '합격 통지를 받아요.\r\nNhận thông báo đỗ.', 'Thông báo đỗ', '합격 통지', 48, NULL),
(426, '생태계를 보호해요.\r\nBảo vệ hệ sinh thái.', 'Hệ sinh thái', '생태계', 49, NULL),
(427, '생물 다양성이 중요해요.\r\nĐa dạng sinh học quan trọng.', 'Đa dạng sinh học', '생물 다양성', 49, NULL),
(428, '멸종 위기에 처했어요.\r\nĐang gặp nguy cơ tuyệt chủng.', 'Nguy cơ tuyệt chủng', '멸종 위기', 49, NULL),
(429, '지속 가능한 발전이에요.\r\nPhát triển bền vững.', 'Phát triển bền vững', '지속 가능한 발전', 49, NULL),
(430, '온실가스를 줄여요.\r\nGiảm khí nhà kính.', 'Khí nhà kính', '온실가스', 49, NULL),
(431, '신재생 에너지를 사용해요.\r\nSử dụng năng lượng tái tạo.', 'Năng lượng tái tạo', '신재생 에너지', 49, NULL),
(432, '탄소 발자국을 줄여요.\r\nGiảm dấu chân carbon.', 'Dấu chân carbon', '탄소 발자국', 49, NULL),
(433, '환경 친화적이에요.\r\nThân thiện với môi trường.', 'Thân thiện môi trường', '환경 친화적', 49, NULL),
(434, '오염 물질을 줄여요.\r\nGiảm chất ô nhiễm.', 'Chất ô nhiễm', '오염 물질', 49, NULL),
(435, '녹색 기술을 개발해요.\r\nPhát triển công nghệ xanh.', 'Công nghệ xanh', '녹색 기술', 49, NULL),
(436, '교육 제도가 중요해요.\r\nHệ thống giáo dục quan trọng.', 'Hệ thống giáo dục', '교육 제도', 50, NULL),
(437, '학습 능력을 기워요.\r\nPhát triển năng lực học tập.', 'Năng lực học tập', '학습 능력', 50, NULL),
(438, '창의성을 키워요.\r\nPhát triển sự sáng tạo.', 'Sự sáng tạo', '창의성', 50, NULL),
(439, '비판적 사고를 해요.\r\nTư duy phản biện.', 'Tư duy phản biện', '비판적 사고', 50, NULL),
(440, '협동 학습을 해요.\r\nHọc tập hợp tác.', 'Học tập hợp tác', '협동 학습', 50, NULL),
(441, '자기주도 학습이에요.\r\nHọc tập tự chủ.', 'Học tập tự chủ', '자기주도 학습', 50, NULL),
(442, '평생 교육이 필요해요.\r\nCần giáo dục suốt đời.', 'Giáo dục suốt đời', '평생 교육', 50, NULL),
(443, '전문성을 기워요.\r\nPhát triển chuyên môn.', 'Chuyên môn', '전문성', 50, NULL),
(444, '학문적 성취를 이뤄요.\r\nĐạt thành tích học thuật.', 'Thành tích học thuật', '학문적 성취', 50, NULL),
(445, '교육 격차가 문제예요.\r\nKhoảng cách giáo dục là vấn đề.', 'Khoảng cách giáo dục', '교육 격차', 50, NULL),
(446, '의료 시스템이 발달했어요.\r\nHệ thống y tế phát triển.', 'Hệ thống y tế', '의료 시스템', 51, NULL),
(447, '예방 의학이 중요해요.\r\nY học dự phòng quan trọng.', 'Y học dự phòng', '예방 의학', 51, NULL),
(448, '건강 관리를 해요.\r\nChăm sóc sức khỏe.', 'Chăm sóc sức khỏe', '건강 관리', 51, NULL),
(449, '정신 건강도 중요해요.\r\nSức khỏe tinh thần cũng quan trọng.', 'Sức khỏe tinh thần', '정신 건강', 51, NULL),
(450, '의료비가 비싸요.\r\nChi phí y tế đắt.', 'Chi phí y tế', '의료비', 51, NULL),
(451, '진단을 받아요.\r\nNhận chẩn đoán.', 'Chẩn đoán', '진단', 51, NULL),
(452, '치료를 받아요.\r\nNhận điều trị.', 'Điều trị', '치료', 51, NULL),
(453, '수술을 해야 해요.\r\nPhải phẫu thuật.', 'Phẫu thuật', '수술', 51, NULL),
(454, '재활 치료를 해요.\r\nĐiều trị phục hồi.', 'Điều trị phục hồi', '재활 치료', 51, NULL),
(455, '의료진이 친절해요.\r\nNhân viên y tế thân thiện.', 'Nhân viên y tế', '의료진', 51, NULL),
(456, '경제 상황이 어려워요.\r\nTình hình kinh tế khó khăn.', 'Tình hình kinh tế', '경제 상황', 52, NULL),
(457, '물가가 올랐어요.\r\nGiá cả tăng.', 'Giá cả', '물가', 52, NULL),
(458, '인플레이션이 심해요.\r\nLạm phát nghiêm trọng.', 'Lạm phát', '인플레이션', 52, NULL),
(459, '실업률이 높아요.\r\nTỷ lệ thất nghiệp cao.', 'Tỷ lệ thất nghiệp', '실업률', 52, NULL),
(460, '투자를 해요.\r\nĐầu tư.', 'Đầu tư', '투자', 52, NULL),
(461, '저축을 해요.\r\nTiết kiệm.', 'Tiết kiệm', '저축', 52, NULL),
(462, '주식을 사요.\r\nMua cổ phiếu.', 'Cổ phiếu', '주식', 52, NULL),
(463, '부채가 많아요.\r\nNợ nhiều.', 'Nợ', '부채', 52, NULL),
(464, '소득이 적어요.\r\nThu nhập ít.', 'Thu nhập', '소득', 52, NULL),
(465, '경제 성장이 필요해요.\r\nCần tăng trưởng kinh tế.', 'Tăng trưởng kinh tế', '경제 성장', 52, NULL),
(466, '언론의 자유가 중요해요.\r\nTự do báo chí quan trọng.', 'Tự do báo chí', '언론의 자유', 53, NULL),
(467, '객관적인 보도를 해요.\r\nĐưa tin khách quan.', 'Khách quan', '객관적', 53, NULL),
(468, '편향된 시각이에요.\r\nGóc nhìn thiên lệch.', 'Thiên lệch', '편향된', 53, NULL),
(469, '여론을 형성해요.\r\nHình thành dư luận.', 'Dư luận', '여론', 53, NULL),
(470, '가짜 뉴스를 구별해요.\r\nPhân biệt tin giả.', 'Tin giả', '가짜 뉴스', 53, NULL),
(471, '정보의 신뢰성을 확인해요.\r\nXác minh độ tin cậy thông tin.', 'Độ tin cậy', '신뢰성', 53, NULL),
(472, '미디어 리터러시가 필요해요.\r\nCần kiến thức truyền thông.', 'Kiến thức truyền thông', '미디어 리터러시', 53, NULL),
(473, '소셜 미디어의 영향력이 커요.\r\nẢnh hưởng của mạng xã hội lớn.', 'Ảnh hưởng', '영향력', 53, NULL),
(474, '정보 격차가 존재해요.\r\nTồn tại khoảng cách thông tin.', 'Khoảng cách thông tin', '정보 격차', 53, NULL),
(475, '디지털 시대예요.\r\nThời đại số.', 'Thời đại số', '디지털 시대', 53, NULL),
(476, '업무 보고를 해요.\r\nBáo cáo công việc.', 'Báo cáo công việc', '업무 보고', 54, NULL),
(477, '회의를 주재해요.\r\nChủ trì cuộc họp.', 'Chủ trì', '주재', 54, NULL),
(478, '의견을 제시해요.\r\nĐưa ra ý kiến.', 'Ý kiến', '의견', 54, NULL),
(479, '토론을 해요.\r\nThảo luận.', 'Thảo luận', '토론', 54, NULL),
(480, '결정을 내려요.\r\nĐưa ra quyết định.', 'Quyết định', '결정', 54, NULL),
(481, '업무를 분담해요.\r\nPhân chia công việc.', 'Phân chia công việc', '업무 분담', 54, NULL),
(482, '협조를 요청해요.\r\nYêu cầu hợp tác.', 'Yêu cầu hợp tác', '협조 요청', 54, NULL),
(483, '피드백을 주고받아요.\r\nCho và nhận phản hồi.', 'Phản hồi', '피드백', 54, NULL),
(484, '전문 용어를 사용해요.\r\nSử dụng thuật ngữ chuyên môn.', 'Thuật ngữ chuyên môn', '전문 용어', 54, NULL),
(485, '비즈니스 매너가 중요해요.\r\nPhép lịch sự kinh doanh quan trọng.', 'Phép lịch sự kinh doanh', '비즈니스 매너', 54, NULL),
(486, '한국과 베트남의 문화가 달라요.\r\nVăn hóa Hàn Quốc và Việt Nam khác nhau.', 'Văn hóa', '문화', 55, NULL),
(487, '전통을 소중히 여겨요.\r\nCoi trọng truyền thống.', 'Truyền thống', '전통', 55, NULL),
(488, '풍습이 비슷해요.\r\nPhong tục tương tự.', 'Phong tục', '풍습', 55, NULL),
(489, '역사적 배경이 중요해요.\r\nBối cảnh lịch sử quan trọng.', 'Bối cảnh lịch sử', '역사적 배경', 55, NULL),
(490, '문화 교류를 해요.\r\nTrao đổi văn hóa.', 'Trao đổi văn hóa', '문화 교류', 55, NULL),
(491, '언어의 특징이 있어요.\r\nCó đặc điểm ngôn ngữ.', 'Đặc điểm', '특징', 55, NULL),
(492, '생활 방식이 다름니다.\r\nLối sống khác nhau.', 'Lối sống', '생활 방식', 55, NULL),
(493, '상호 이해가 필요해요.\r\nCần hiểu biết lẫn nhau.', 'Hiểu biết lẫn nhau', '상호 이해', 55, NULL),
(494, '문화적 다양성을 인정해요.\r\nThừa nhận đa dạng văn hóa.', 'Đa dạng văn hóa', '문화적 다양성', 55, NULL),
(495, '국제적 관점이 중요해요.\r\nQuan điểm quốc tế quan trọng.', 'Quan điểm quốc tế', '국제적 관점', 55, NULL),
(496, '현대 사회는 복잡해요.\r\nXã hội hiện đại phức tạp.', 'Hiện đại', '현대', 56, NULL),
(497, '도시화가 진행돼요.\r\nĐô thị hóa diễn ra.', 'Đô thị hóa', '도시화', 56, NULL),
(498, '기술 발전이 빨라요.\r\nCông nghệ phát triển nhanh.', 'Phát triển', '발전', 56, NULL),
(499, '라이프스타일이 변해요.\r\nLối sống thay đổi.', 'Lối sống', '라이프스타일', 56, NULL),
(500, '업무와 여가의 균형이 중요해요.\r\nCân bằng công việc và giải trí quan trọng.', 'Cân bằng', '균형', 56, NULL),
(501, '스마트폰을 많이 써요.\r\nDùng smartphone nhiều.', 'Smartphone', '스마트폰', 56, NULL),
(502, '온라인 생활이 늘어나요.\r\nCuộc sống trực tuyến tăng.', 'Trực tuyến', '온라인', 56, NULL),
(503, '편의성을 추구해요.\r\nTheo đuổi sự tiện lợi.', 'Sự tiện lợi', '편의성', 56, NULL),
(504, '빠른 변화에 적응해야 해요.\r\nPhải thích nghi với thay đổi nhanh.', 'Thay đổi nhanh', '빠른 변화', 56, NULL),
(505, '디지털 격차가 문제예요.\r\nKhoảng cách số là vấn đề.', 'Khoảng cách số', '디지털 격차', 56, NULL),
(506, '가족 구조가 변화하고 있어요.\r\nCấu trúc gia đình đang thay đổi.', 'Cấu trúc gia đình', '가족 구조', 57, NULL),
(507, '핵가족이 증가해요.\r\nGia đình hạt nhân tăng.', 'Gia đình hạt nhân', '핵가족', 57, NULL),
(508, '세대 갈등이 있어요.\r\nCó xung đột thế hệ.', 'Xung đột thế hệ', '세대 갈등', 57, NULL),
(509, '부모와 자녀 관계가 중요해요.\r\nMối quan hệ cha mẹ con cái quan trọng.', 'Mối quan hệ cha mẹ con cái', '부모와 자녀 관계', 57, NULL),
(510, '사회적 책임을 져야 해요.\r\nPhải chịu trách nhiệm xã hội.', 'Trách nhiệm xã hội', '사회적 책임', 57, NULL),
(511, '공동체 의식이 필요해요.\r\nCần ý thức cộng đồng.', 'Ý thức cộng đồng', '공동체 의식', 57, NULL),
(512, '결혼과 출산률이 낮아져요.\r\nTỷ lệ kết hôn và sinh con giảm.', 'Tỷ lệ sinh con', '출산률', 57, NULL),
(513, '고령화 사회가 돼요.\r\nTrở thành xã hội già hóa.', 'Già hóa', '고령화', 57, NULL),
(514, '여성의 사회 진출이 늘어요.\r\nPhụ nữ tham gia xã hội tăng.', 'Tham gia xã hội', '사회 진출', 57, NULL),
(515, '양성평등이 중요해요.\r\nBình đẳng giới quan trọng.', 'Bình đẳng giới', '양성평등', 57, NULL),
(516, '스포츠를 즐겨요.\r\nThích thể thao.', 'Thể thao', '스포츠', 58, NULL),
(517, '운동으로 건강을 지켜요.\r\nGiữ sức khỏe bằng vận động.', 'Vận động', '운동', 58, NULL),
(518, '축구가 인기 있어요.\r\nBóng đá phổ biến.', 'Bóng đá', '축구', 58, NULL),
(519, '야구를 좋아해요.\r\nThích bóng chày.', 'Bóng chày', '야구', 58, NULL),
(520, '올림픽에 참가해요.\r\nTham gia Olympics.', 'Olympics', '올림픽', 58, NULL),
(521, '경기를 관람해요.\r\nXem thi đấu.', 'Thi đấu', '경기', 58, NULL),
(522, '팬클럽에 가입해요.\r\nTham gia fan club.', 'Fan club', '팬클럽', 58, NULL),
(523, '연예인을 좋아해요.\r\nThích nghệ sĩ.', 'Nghệ sĩ', '연예인', 58, NULL),
(524, '콘서트에 가요.\r\nĐi concert.', 'Concert', '콘서트', 58, NULL),
(525, '여가 활동을 해요.\r\nHoạt động giải trí.', 'Hoạt động giải trí', '여가 활동', 58, NULL),
(526, '학교 생활이 즐거워요.\r\nĐời sống học đường vui vẻ.', 'Đời sống học đường', '학교 생활', 59, NULL),
(527, '동아리 활동을 해요.\r\nHoạt động câu lạc bộ.', 'Hoạt động câu lạc bộ', '동아리 활동', 59, NULL),
(528, '선후배 관계가 있어요.\r\nCó mối quan hệ tiền bối hậu bối.', 'Mối quan hệ tiền bối hậu bối', '선후배 관계', 59, NULL),
(529, '체육대회를 열어요.\r\nTổ chức hội thao.', 'Hội thao', '체육대회', 59, NULL),
(530, '축제를 준비해요.\r\nChuẩn bị lễ hội.', 'Lễ hội', '축제', 59, NULL),
(531, '동급생과 친해져요.\r\nThân thiết với bạn cùng lớp.', 'Bạn cùng lớp', '동급생', 59, NULL),
(532, '진로를 결정해요.\r\nQuyết định hướng nghiệp.', 'Hướng nghiệp', '진로', 59, NULL),
(533, '진학을 준비해요.\r\nChuẩn bị học lên.', 'Học lên', '진학', 59, NULL),
(534, '취업을 고민해요.\r\nGo min việc làm.', 'Việc làm', '취업', 59, NULL),
(535, '꿈을 키워가요.\r\nNuôi dưỡng ước mơ.', 'Ước mơ', '꿈', 59, NULL),
(536, '전통 문화를 보존해요.\r\nBảo tồn văn hóa truyền thống.', 'Bảo tồn', '보존', 60, NULL),
(537, '의례를 지켜요.\r\nGiữ nghi lễ.', 'Nghi lễ', '의례', 60, NULL),
(538, '예의범절을 배워요.\r\nHọc phép tắc.', 'Phép tắc', '예의범절', 60, NULL),
(539, '조상을 숭배해요.\r\nThờ phụng tổ tiên.', 'Thờ phụng', '숭배', 60, NULL),
(540, '제사를 지내요.\r\nCúng tế.', 'Cúng tế', '제사', 60, NULL),
(541, '명절을 쇠요.\r\nĂn tết.', 'Ăn tết', '명절을 쇠다', 60, NULL),
(542, '세시풍속이 있어요.\r\nCó phong tục theo mùa.', 'Phong tục theo mùa', '세시풍속', 60, NULL),
(543, '민속 놀이를 해요.\r\nChơi trò chơi dân gian.', 'Trò chơi dân gian', '민속 놀이', 60, NULL),
(544, '한옥에서 살아요.\r\nSống trong nhà truyền thống.', 'Nhà truyền thống', '한옥', 60, NULL),
(545, '궁궐을 견학해요.\r\nTham quan cung điện.', 'Cung điện', '궁궐', 60, NULL),
(546, '의사소통이 중요해요.\r\nGiao tiếp quan trọng.', 'Giao tiếp', '의사소통', 61, NULL),
(547, '언어 능력을 기워요.\r\nPhát triển năng lực ngôn ngữ.', 'Năng lực ngôn ngữ', '언어 능력', 61, NULL),
(548, '발음을 연습해요.\r\nLuyện phát âm.', 'Phát âm', '발음', 61, NULL),
(549, '어휘를 늘려요.\r\nTăng từ vựng.', 'Từ vựng', '어휘', 61, NULL),
(550, '문법을 공부해요.\r\nHọc ngữ pháp.', 'Ngữ pháp', '문법', 61, NULL),
(551, '회화를 연습해요.\r\nLuyện hội thoại.', 'Hội thoại', '회화', 61, NULL),
(552, '번역을 해요.\r\nDịch thuật.', 'Dịch thuật', '번역', 61, NULL),
(553, '통역을 해요.\r\nPhiên dịch.', 'Phiên dịch', '통역', 61, NULL),
(554, '언어 교환을 해요.\r\nTrao đổi ngôn ngữ.', 'Trao đổi ngôn ngữ', '언어 교환', 61, NULL),
(555, '다국어를 구사해요.\r\nNói được nhiều ngôn ngữ.', 'Nhiều ngôn ngữ', '다국어', 61, NULL),
(556, '광고를 많이 봐요.\r\nXem quảng cáo nhiều.', 'Quảng cáo', '광고', 62, NULL),
(557, '소비자 권리가 있어요.\r\nCó quyền người tiêu dùng.', 'Quyền người tiêu dùng', '소비자 권리', 62, NULL),
(558, '브랜드를 선택해요.\r\nChọn thương hiệu.', 'Thương hiệu', '브랜드', 62, NULL),
(559, '마케팅이 중요해요.\r\nMarketing quan trọng.', 'Marketing', '마케팅', 62, NULL),
(560, '소비 패턴이 변해요.\r\nThói quen tiêu dùng thay đổi.', 'Thói quen tiêu dùng', '소비 패턴', 62, NULL),
(561, '할인 행사를 해요.\r\nCó chương trình giảm giá.', 'Chương trình giảm giá', '할인 행사', 62, NULL),
(562, '충동구매를 해요.\r\nMua hàng bốc đồng.', 'Mua hàng bốc đồng', '충동구매', 62, NULL),
(563, '가성비를 고려해요.\r\nXem xét tỷ lệ giá/chất lượng.', 'Tỷ lệ giá/chất lượng', '가성비', 62, NULL),
(564, '유행을 따라가요.\r\nTheo xu hướng.', 'Xu hướng', '유행', 62, NULL),
(565, '소비 문화가 발달해요.\r\nVăn hóa tiêu dùng phát triển.', 'Văn hóa tiêu dùng', '소비 문화', 62, NULL),
(566, '기술 혁신이 빨라요.\r\nĐổi mới công nghệ nhanh.', 'Đổi mới công nghệ', '기술 혁신', 63, NULL),
(567, '인공지능이 발달해요.\r\nTrí tuệ nhân tạo phát triển.', 'Trí tuệ nhân tạo', '인공지능', 63, NULL),
(568, '로봇이 일을 대신해요.\r\nRobot thay thế công việc.', 'Robot', '로봇', 63, NULL),
(569, '자동화가 진행돼요.\r\nTự động hóa tiến hành.', 'Tự động hóa', '자동화', 63, NULL),
(570, '빅데이터를 분석해요.\r\nPhân tích big data.', 'Big data', '빅데이터', 63, NULL),
(571, '사물인터넷을 사용해요.\r\nSử dụng IoT.', 'IoT', '사물인터넷', 63, NULL),
(572, '가상현실을 체험해요.\r\nTrải nghiệm thực tế ảo.', 'Thực tế ảo', '가상현실', 63, NULL),
(573, '드론을 조종해요.\r\nĐiều khiển drone.', 'Drone', '드론', 63, NULL),
(574, '3D 프린터로 제작해요.\r\nSản xuất bằng máy in 3D.', 'Máy in 3D', '3D 프린터', 63, NULL),
(575, '블록체인 기술이 중요해요.\r\nCông nghệ blockchain quan trọng.', 'Blockchain', '블록체인', 63, NULL),
(576, '긍정적으로 생각해요.\r\nSuy nghĩ tích cực.', 'Tích cực', '긍정적', 64, NULL),
(577, '낙관주의를 가져요.\r\nCó chủ nghĩa lạc quan.', 'Chủ nghĩa lạc quan', '낙관주의', 64, NULL),
(578, '자신감을 가져요.\r\nCó tự tin.', 'Tự tin', '자신감', 64, NULL),
(579, '도전 정신이 있어요.\r\nCó tinh thần thách thức.', 'Tinh thần thách thức', '도전 정신', 64, NULL),
(580, '포기하지 않아요.\r\nKhông bỏ cuộc.', 'Bỏ cuộc', '포기', 64, NULL),
(581, '감사하는 마음을 가져요.\r\nCó lòng biết ơn.', 'Lòng biết ơn', '감사하는 마음', 64, NULL),
(582, '목표를 세우고 노력해요.\r\nĐặt mục tiêu và cố gắng.', 'Mục tiêu', '목표', 64, NULL),
(583, '실패를 두려워하지 않아요.\r\nKhông sợ thất bại.', 'Thất bại', '실패', 64, NULL),
(584, '성장 마인드를 가져요.\r\nCó tư duy phát triển.', 'Tư duy phát triển', '성장 마인드', 64, NULL),
(585, '행복을 추구해요.\r\nTheo đuổi hạnh phúc.', 'Hạnh phúc', '행복', 64, NULL),
(586, '언론의 자유가 중요해요.\r\nTự do báo chí quan trọng.', 'Tự do báo chí', '언론의 자유', 65, NULL),
(587, '객관적인 보도를 해요.\r\nĐưa tin khách quan.', 'Khách quan', '객관적', 65, NULL),
(588, '편향된 시각이에요.\r\nGóc nhìn thiên lệch.', 'Thiên lệch', '편향된', 65, NULL),
(589, '여론을 형성해요.\r\nHình thành dư luận.', 'Dư luận', '여론', 65, NULL),
(590, '가짜 뉴스를 구별해요.\r\nPhân biệt tin giả.', 'Tin giả', '가짜 뉴스', 65, NULL),
(591, '정보의 신뢰성을 확인해요.\r\nXác minh độ tin cậy thông tin.', 'Độ tin cậy', '신뢰성', 65, NULL),
(592, '미디어 리터러시가 필요해요.\r\nCần kiến thức truyền thông.', 'Kiến thức truyền thông', '미디어 리터러시', 65, NULL),
(593, '소셜 미디어의 영향력이 커요.\r\nẢnh hưởng của mạng xã hội lớn.', 'Ảnh hưởng', '영향력', 65, NULL),
(594, '정보 격차가 존재해요.\r\nTồn tại khoảng cách thông tin.', 'Khoảng cách thông tin', '정보 격차', 65, NULL),
(595, '디지털 시대예요.\r\nThời đại số.', 'Thời đại số', '디지털 시대', 65, NULL),
(596, '사회 발전이 빨라요.\r\nPhát triển xã hội nhanh.', 'Phát triển xã hội', '사회 발전', 66, NULL),
(597, '산업화가 진행돼요.\r\nCông nghiệp hóa tiến hành.', 'Công nghiệp hóa', '산업화', 66, NULL),
(598, '근대화를 추진해요.\r\nThúc đẩy hiện đại hóa.', 'Hiện đại hóa', '근대화', 66, NULL),
(599, '문명이 발달해요.\r\nVăn minh phát triển.', 'Văn minh', '문명', 66, NULL),
(600, '사회 제도가 변해요.\r\nChế độ xã hội thay đổi.', 'Chế độ xã hội', '사회 제도', 66, NULL),
(601, '복지 국가를 만들어요.\r\nXây dựng nhà nước phúc lợi.', 'Nhà nước phúc lợi', '복지 국가', 66, NULL),
(602, '사회 보장이 중요해요.\r\nBảo hiểm xã hội quan trọng.', 'Bảo hiểm xã hội', '사회 보장', 66, NULL),
(603, '계층 이동이 있어요.\r\nCó di chuyển tầng lớp.', 'Di chuyển tầng lớp', '계층 이동', 66, NULL),
(604, '사회 통합을 추구해요.\r\nTheo đuổi hội nhập xã hội.', 'Hội nhập xã hội', '사회 통합', 66, NULL),
(605, '진보적 사회예요.\r\nXã hội tiến bộ.', 'Tiến bộ', '진보적', 66, NULL),
(606, '민주주의가 중요해요.\r\nDân chủ quan trọng.', 'Dân chủ', '민주주의', 67, NULL),
(607, '선거에 참여해요.\r\nTham gia bầu cử.', 'Bầu cử', '선거', 67, NULL),
(608, '정당을 지지해요.\r\nỦng hộ chính đảng.', 'Chính đảng', '정당', 67, NULL),
(609, '정책을 시행해요.\r\nThực hiện chính sách.', 'Chính sách', '정책', 67, NULL),
(610, '시민권을 행사해요.\r\nThực hiện quyền công dân.', 'Quyền công dân', '시민권', 67, NULL),
(611, '법안을 통과시켜요.\r\nThông qua dự luật.', 'Dự luật', '법안', 67, NULL),
(612, '국정을 운영해요.\r\nĐiều hành quốc chính.', 'Quốc chính', '국정', 67, NULL),
(613, '정치 개혁이 필요해요.\r\nCần cải cách chính trị.', 'Cải cách chính trị', '정치 개혁', 67, NULL),
(614, '공정성을 추구해요.\r\nTheo đuổi công bằng.', 'Công bằng', '공정성', 67, NULL),
(615, '투명성이 중요해요.\r\nTính minh bạch quan trọng.', 'Tính minh bạch', '투명성', 67, NULL),
(616, '성공을 위해 노력해요.\r\nCố gắng để thành công.', 'Thành công', '성공', 68, NULL),
(617, '커리어를 쌓아요.\r\nXây dựng sự nghiệp.', 'Sự nghiệp', '커리어', 68, NULL),
(618, '전문성을 개발해요.\r\nPhát triển chuyên môn.', 'Chuyên môn', '전문성', 68, NULL),
(619, '리더십을 발휘해요.\r\nPhát huy năng lực lãnh đạo.', 'Năng lực lãnh đạo', '리더십', 68, NULL),
(620, '경쟁력을 갖춰요.\r\nCó năng lực cạnh tranh.', 'Năng lực cạnh tranh', '경쟁력', 68, NULL),
(621, '성과를 달성해요.\r\nĐạt được thành quả.', 'Thành quả', '성과', 68, NULL),
(622, '목표를 설정해요.\r\nThiết lập mục tiêu.', 'Thiết lập', '설정', 68, NULL),
(623, '능력을 인정받아요.\r\nNăng lực được công nhận.', 'Năng lực', '능력', 68, NULL),
(624, '도전 정신이 있어요.\r\nCó tinh thần thách thức.', 'Tinh thần thách thức', '도전 정신', 68, NULL),
(625, '혁신적 사고를 해요.\r\nTư duy đổi mới.', 'Tư duy đổi mới', '혁신적 사고', 68, NULL),
(626, '봉사활동을 해요.\r\nHoạt động tình nguyện.', 'Hoạt động tình nguyện', '봉사활동', 69, NULL),
(627, '자원봉사자가 돼요.\r\nTrở thành tình nguyện viên.', 'Tình nguyện viên', '자원봉사자', 69, NULL),
(628, '기부를 해요.\r\nQuyên góp.', 'Quyên góp', '기부', 69, NULL),
(629, '나눔을 실천해요.\r\nThực hành chia sẻ.', 'Chia sẻ', '나눔', 69, NULL),
(630, '사회에 기여해요.\r\nĐóng góp cho xã hội.', 'Đóng góp', '기여', 69, NULL),
(631, '도움이 필요한 사람을 도와요.\r\nGiúp những người cần hỗ trợ.', 'Hỗ trợ', '도움', 69, NULL),
(632, '사랑을 나눠요.\r\nChia sẻ tình yêu.', 'Tình yêu', '사랑', 69, NULL),
(633, '희망을 전해요.\r\nTruyền tải hy vọng.', 'Hy vọng', '희망', 69, NULL),
(634, '공동체를 위해 일해요.\r\nLàm việc vì cộng đồng.', 'Cộng đồng', '공동체', 69, NULL),
(635, '헌신적인 마음을 가져요.\r\nCó lòng cống hiến.', 'Cống hiến', '헌신', 69, NULL),
(636, '정신 건강이 중요해요.\r\nSức khỏe tinh thần quan trọng.', 'Sức khỏe tinh thần', '정신 건강', 70, NULL),
(637, '스트레스를 관리해요.\r\nQuản lý căng thẳng.', 'Căng thẳng', '스트레스', 70, NULL),
(638, '우울증을 극복해요.\r\nVượt qua trầm cảm.', 'Trầm cảm', '우울증', 70, NULL),
(639, '불안감을 줄여요.\r\nGiảm lo lắng.', 'Lo lắng', '불안감', 70, NULL),
(640, '심리 상담을 받아요.\r\nNhận tư vấn tâm lý.', 'Tư vấn tâm lý', '심리 상담', 70, NULL),
(641, '명상을 해요.\r\nTham thiền.', 'Tham thiền', '명상', 70, NULL),
(642, '자존감을 높여요.\r\nNâng cao lòng tự trọng.', 'Lòng tự trọng', '자존감', 70, NULL),
(643, '마음의 평화를 찾아요.\r\nTìm sự bình an trong lòng.', 'Sự bình an', '마음의 평화', 70, NULL),
(644, '긍정적 사고를 해요.\r\nTư duy tích cực.', 'Tư duy tích cực', '긍정적 사고', 70, NULL),
(645, '감정을 조절해요.\r\nĐiều chỉnh cảm xúc.', 'Điều chỉnh cảm xúc', '감정 조절', 70, NULL),
(646, '성 평등이 중요해요.\r\nBình đẳng giới quan trọng.', 'Bình đẳng giới', '성 평등', 71, NULL),
(647, '성별 고정관념을 버려요.\r\nBỏ định kiến giới tính.', 'Định kiến giới tính', '성별 고정관념', 71, NULL),
(648, '여성의 권리를 보장해요.\r\nBảo đảm quyền phụ nữ.', 'Quyền phụ nữ', '여성의 권리', 71, NULL),
(649, '성차별을 없애요.\r\nXóa bỏ phân biệt giới tính.', 'Phân biệt giới tính', '성차별', 71, NULL),
(650, '일과 가정의 균형을 잡아요.\r\nCân bằng công việc và gia đình.', 'Cân bằng công việc gia đình', '일과 가정의 균형', 71, NULL),
(651, '육아 휴직을 써요.\r\nSử dụng nghỉ thai sản.', 'Nghỉ thai sản', '육아 휴직', 71, NULL),
(652, '유리천장을 깨요.\r\nPhá vỡ trần kính.', 'Trần kính', '유리천장', 71, NULL),
(653, '동등한 기회를 줘요.\r\nCho cơ hội bình đẳng.', 'Cơ hội bình đẳng', '동등한 기회', 71, NULL),
(654, '성별 다양성을 인정해요.\r\nThừa nhận đa dạng giới.', 'Đa dạng giới', '성별 다양성', 71, NULL),
(655, '상호 존중이 필요해요.\r\nCần tôn trọng lẫn nhau.', 'Tôn trọng lẫn nhau', '상호 존중', 71, NULL),
(656, '유학을 준비해요.\r\nChuẩn bị du học.', 'Du học', '유학', 72, NULL),
(657, '장학금을 신청해요.\r\nĐăng ký học bổng.', 'Học bổng', '장학금', 72, NULL),
(658, '어학연수를 가요.\r\nĐi tu nghiệp ngôn ngữ.', 'Tu nghiệp ngôn ngữ', '어학연수', 72, NULL),
(659, '교환학생이 돼요.\r\nTrở thành sinh viên trao đổi.', 'Sinh viên trao đổi', '교환학생', 72, NULL),
(660, '국제적 경험을 쌓아요.\r\nTích lũy kinh nghiệm quốc tế.', 'Kinh nghiệm quốc tế', '국제적 경험', 72, NULL),
(661, '문화 적응을 해요.\r\nThích nghi văn hóa.', 'Thích nghi văn hóa', '문화 적응', 72, NULL),
(662, '학위를 취득해요.\r\nLấy bằng cấp.', 'Bằng cấp', '학위', 72, NULL),
(663, '연구 활동을 해요.\r\nHoạt động nghiên cứu.', 'Hoạt động nghiên cứu', '연구 활동', 72, NULL),
(664, '글로벌 인재가 돼요.\r\nTrở thành nhân tài toàn cầu.', 'Nhân tài toàn cầu', '글로벌 인재', 72, NULL),
(665, '네트워킹을 확장해요.\r\nMở rộng mạng lưới.', 'Mở rộng mạng lưới', '네트워킹 확장', 72, NULL),
(666, '취업 시장이 어려워요.\r\nThị trường việc làm khó khăn.', 'Thị trường việc làm', '취업 시장', 73, NULL),
(667, '고용 불안정이 심해요.\r\nBất ổn định việc làm nghiêm trọng.', 'Bất ổn định việc làm', '고용 불안정', 73, NULL),
(668, '비정규직이 많아요.\r\nLao động không chính thức nhiều.', 'Lao động không chính thức', '비정규직', 73, NULL),
(669, '청년 실업률이 높아요.\r\nTỷ lệ thất nghiệp thanh niên cao.', 'Tỷ lệ thất nghiệp thanh niên', '청년 실업률', 73, NULL),
(670, '직업 교육이 필요해요.\r\nCần giáo dục nghề nghiệp.', 'Giáo dục nghề nghiệp', '직업 교육', 73, NULL),
(671, '재취업을 준비해요.\r\nChuẩn bị tái việc làm.', 'Tái việc làm', '재취업', 73, NULL),
(672, '창업을 고려해요.\r\nCân nhắc khởi nghiệp.', 'Khởi nghiệp', '창업', 73, NULL),
(673, '프리랜서로 일해요.\r\nLàm việc tự do.', 'Làm việc tự do', '프리랜서', 73, NULL),
(674, '원격 근무를 해요.\r\nLàm việc từ xa.', 'Làm việc từ xa', '원격 근무', 73, NULL),
(675, '일자리 창출이 중요해요.\r\nTạo việc làm quan trọng.', 'Tạo việc làm', '일자리 창출', 73, NULL),
(676, '도시 생활이 복잡해요.\r\nCuộc sống đô thị phức tạp.', 'Cuộc sống đô thị', '도시 생활', 74, NULL),
(677, '인구 밀도가 높아요.\r\nMật độ dân số cao.', 'Mật độ dân số', '인구 밀도', 74, NULL),
(678, '교통 체증이 심해요.\r\nTắc nghẽn giao thông nghiêm trọng.', 'Tắc nghẽn giao thông', '교통 체증', 74, NULL),
(679, '주거비가 비싸요.\r\nChi phí nhà ở đắt.', 'Chi phí nhà ở', '주거비', 74, NULL),
(680, '생활비가 많이 들어요.\r\nChi phí sinh hoạt cao.', 'Chi phí sinh hoạt', '생활비', 74, NULL),
(681, '도시 재생을 해요.\r\nTái sinh đô thị.', 'Tái sinh đô thị', '도시 재생', 74, NULL),
(682, '스마트 시티를 만들어요.\r\nXây dựng thành phố thông minh.', 'Thành phố thông minh', '스마트 시티', 74, NULL),
(683, '녹지 공간이 부족해요.\r\nThiếu không gian xanh.', 'Không gian xanh', '녹지 공간', 74, NULL),
(684, '소음 공해가 문제예요.\r\nÔ nhiễm tiếng ồn là vấn đề.', 'Ô nhiễm tiếng ồn', '소음 공해', 74, NULL),
(685, '도시 계획이 중요해요.\r\nQuy hoạch đô thị quan trọng.', 'Quy hoạch đô thị', '도시 계획', 74, NULL),
(686, '기후 변화가 심각해요.\r\nBiến đổi khí hậu nghiêm trọng.', 'Biến đổi khí hậu', '기후 변화', 75, NULL),
(687, '지구 온난화가 가속화돼요.\r\nSự nóng lên toàn cầu gia tăng.', 'Sự nóng lên toàn cầu', '지구 온난화', 75, NULL),
(688, '극한 날씨가 잦아요.\r\nThời tiết cực đoan thường xuyên.', 'Thời tiết cực đoan', '극한 날씨', 75, NULL),
(689, '해수면이 상승해요.\r\nMực nước biển tăng.', 'Mực nước biển tăng', '해수면 상승', 75, NULL),
(690, '빙하가 녹아요.\r\nBăng hà tan chảy.', 'Băng hà tan chảy', '빙하 융해', 75, NULL),
(691, '사막화가 진행돼요.\r\nSa mạc hóa tiến hành.', 'Sa mạc hóa', '사막화', 75, NULL),
(692, '생태계가 파괴돼요.\r\nHệ sinh thái bị phá hủy.', 'Phá hủy hệ sinh thái', '생태계 파괴', 75, NULL),
(693, '재생에너지를 사용해요.\r\nSử dụng năng lượng tái tạo.', 'Năng lượng tái tạo', '재생에너지', 75, NULL),
(694, '탄소 중립을 목표로 해요.\r\nMục tiêu trung hòa carbon.', 'Trung hòa carbon', '탄소 중립', 75, NULL),
(695, '환경 보호 정책이 필요해요.\r\nCần chính sách bảo vệ môi trường.', 'Chính sách bảo vệ môi trường', '환경 보호 정책', 75, NULL),
(696, '소셜 미디어를 사용해요.\r\nSử dụng mạng xã hội.', 'Mạng xã hội', '소셜 미디어', 76, NULL),
(697, '인스타그램에 사진을 올려요.\r\nĐăng ảnh lên Instagram.', 'Đăng ảnh', '사진을 올리다', 76, NULL),
(698, '온라인에서 소통해요.\r\nGiao tiếp trực tuyến.', 'Giao tiếp trực tuyến', '온라인 소통', 76, NULL),
(699, '팔로워가 많아요.\r\nCó nhiều người theo dõi.', 'Người theo dõi', '팔로워', 76, NULL),
(700, '댓글을 달아요.\r\nĐể lại bình luận.', 'Bình luận', '댓글', 76, NULL),
(701, '좋아요를 눌러요.\r\nBấm like.', 'Like', '좋아요', 76, NULL),
(702, '바이럴이 됐어요.\r\nTrở thành viral.', 'Viral', '바이럴', 76, NULL),
(703, '개인정보가 유출됐어요.\r\nThông tin cá nhân bị rò rỉ.', 'Rò rỉ thông tin cá nhân', '개인정보 유출', 76, NULL),
(704, '가짜 뉴스가 퍼져요.\r\nTin giả lan truyền.', 'Tin giả', '가짜 뉴스', 76, NULL),
(705, '디지털 중독이 문제예요.\r\nNghiện số là vấn đề.', 'Nghiện số', '디지털 중독', 76, NULL),
(706, '자원을 절약해요.\r\nTiết kiệm tài nguyên.', 'Tài nguyên', '자원', 77, NULL),
(707, '석유가 부족해요.\r\nThiếu dầu mỏ.', 'Dầu mỏ', '석유', 77, NULL),
(708, '천연가스를 사용해요.\r\nSử dụng khí tự nhiên.', 'Khí tự nhiên', '천연가스', 77, NULL),
(709, '석탄 발전소를 폐쇄해요.\r\nĐóng cửa nhà máy điện than.', 'Nhà máy điện than', '석탄 발전소', 77, NULL),
(710, '원자력 발전이 논란이에요.\r\nĐiện hạt nhân gây tranh cãi.', 'Điện hạt nhân', '원자력 발전', 77, NULL),
(711, '태양광 에너지를 개발해요.\r\nPhát triển năng lượng mặt trời.', 'Năng lượng mặt trời', '태양광 에너지', 77, NULL),
(712, '풍력 발전이 늘어나요.\r\nĐiện gió tăng.', 'Điện gió', '풍력 발전', 77, NULL),
(713, '에너지 효율성을 높여요.\r\nNâng cao hiệu quả năng lượng.', 'Hiệu quả năng lượng', '에너지 효율성', 77, NULL),
(714, '대체 에너지를 찾아요.\r\nTìm năng lượng thay thế.', 'Năng lượng thay thế', '대체 에너지', 77, NULL);
INSERT INTO `vocabularytheory` (`vocabid`, `example`, `meaning`, `word`, `lessonid`, `image`) VALUES
(715, '에너지 전환이 필요해요.\r\nCần chuyển đổi năng lượng.', 'Chuyển đổi năng lượng', '에너지 전환', 77, NULL),
(716, '문학 작품을 읽어요.\r\nĐọc tác phẩm văn học.', 'Tác phẩm văn học', '문학 작품', 78, NULL),
(717, '소설을 쓰고 있어요.\r\nĐang viết tiểu thuyết.', 'Tiểu thuyết', '소설', 78, NULL),
(718, '시를 감상해요.\r\nThưởng thức thơ.', 'Thơ', '시', 78, NULL),
(719, '화가가 그림을 그려요.\r\nHọa sĩ vẽ tranh.', 'Họa sĩ', '화가', 78, NULL),
(720, '조각상을 만들어요.\r\nTạo tượng điêu khắc.', 'Tượng điêu khắc', '조각상', 78, NULL),
(721, '음악가가 연주해요.\r\nNhạc sĩ biểu diễn.', 'Nhạc sĩ', '음악가', 78, NULL),
(722, '무대에서 연기해요.\r\nDiễn xuất trên sân khấu.', 'Diễn xuất', '연기', 78, NULL),
(723, '전시회를 열어요.\r\nTổ chức triển lãm.', 'Triển lãm', '전시회', 78, NULL),
(724, '예술적 감각이 있어요.\r\nCó cảm giác nghệ thuật.', 'Cảm giác nghệ thuật', '예술적 감각', 78, NULL),
(725, '창작 활동을 해요.\r\nHoạt động sáng tác.', 'Hoạt động sáng tác', '창작 활동', 78, NULL),
(726, '디지털 혁명이 일어나요.\r\nCách mạng số diễn ra.', 'Cách mạng số', '디지털 혁명', 79, NULL),
(727, '인공지능이 발달해요.\r\nTrí tuệ nhân tạo phát triển.', 'Trí tuệ nhân tạo', '인공지능', 79, NULL),
(728, '빅데이터를 분석해요.\r\nPhân tích big data.', 'Big data', '빅데이터', 79, NULL),
(729, '클라우드 컴퓨팅을 사용해요.\r\nSử dụng điện toán đám mây.', 'Điện toán đám mây', '클라우드 컴퓨팅', 79, NULL),
(730, '사물인터넷이 확산돼요.\r\nInternet vạn vật lan rộng.', 'Internet vạn vật', '사물인터넷', 79, NULL),
(731, '가상현실을 체험해요.\r\nTrải nghiệm thực tế ảo.', 'Thực tế ảo', '가상현실', 79, NULL),
(732, '증강현실 기술이에요.\r\nCông nghệ thực tế tăng cường.', 'Thực tế tăng cường', '증강현실', 79, NULL),
(733, '블록체인이 혁신적이에요.\r\nBlockchain mang tính cách mạng.', 'Blockchain', '블록체인', 79, NULL),
(734, '암호화폐가 인기예요.\r\nTiền mã hóa phổ biến.', 'Tiền mã hóa', '암호화폐', 79, NULL),
(735, '디지털 전환을 해요.\r\nChuyển đổi số.', 'Chuyển đổi số', '디지털 전환', 79, NULL),
(736, '창업을 준비해요.\r\nChuẩn bị khởi nghiệp.', 'Khởi nghiệp', '창업', 80, NULL),
(737, '스타트업을 만들어요.\r\nTạo ra startup.', 'Startup', '스타트업', 80, NULL),
(738, '사업 계획서를 써요.\r\nViết kế hoạch kinh doanh.', 'Kế hoạch kinh doanh', '사업 계획서', 80, NULL),
(739, '투자를 유치해요.\r\nThu hút đầu tư.', 'Thu hút đầu tư', '투자 유치', 80, NULL),
(740, '벤처캐피털을 만나요.\r\nGặp quỹ đầu tư mạo hiểm.', 'Quỹ đầu tư mạo hiểm', '벤처캐피털', 80, NULL),
(741, '혁신적인 아이디어가 있어요.\r\nCó ý tưởng sáng tạo.', 'Ý tưởng sáng tạo', '혁신적인 아이디어', 80, NULL),
(742, '시장을 분석해요.\r\nPhân tích thị trường.', 'Phân tích thị trường', '시장 분석', 80, NULL),
(743, '경쟁사를 연구해요.\r\nNghiên cứu đối thủ cạnh tranh.', 'Đối thủ cạnh tranh', '경쟁사', 80, NULL),
(744, '수익 모델을 만들어요.\r\nTạo mô hình lợi nhuận.', 'Mô hình lợi nhuận', '수익 모델', 80, NULL),
(745, '비즈니스를 확장해요.\r\nMở rộng kinh doanh.', 'Mở rộng kinh doanh', '비즈니스 확장', 80, NULL),
(746, '불평등이 심화돼요.\r\nBất bình đẳng trầm trọng hơn.', 'Bất bình đẳng', '불평등', 81, NULL),
(747, '소득 격차가 커져요.\r\nKhoảng cách thu nhập lớn hơn.', 'Khoảng cách thu nhập', '소득 격차', 81, NULL),
(748, '부의 집중 현상이에요.\r\nHiện tượng tập trung của cải.', 'Tập trung của cải', '부의 집중', 81, NULL),
(749, '사회적 이동성이 낮아요.\r\nTính di động xã hội thấp.', 'Tính di động xã hội', '사회적 이동성', 81, NULL),
(750, '교육 기회가 불균등해요.\r\nCơ hội giáo dục không đều.', 'Cơ hội giáo dục', '교육 기회', 81, NULL),
(751, '차별을 당해요.\r\nBị phân biệt đối xử.', 'Phân biệt đối xử', '차별', 81, NULL),
(752, '사회 보장이 부족해요.\r\nBảo hiểm xã hội thiếu.', 'Bảo hiểm xã hội', '사회 보장', 81, NULL),
(753, '빈곤층이 늘어나요.\r\nTầng lớp nghèo tăng.', 'Tầng lớp nghèo', '빈곤층', 81, NULL),
(754, '기회의 평등이 필요해요.\r\nCần bình đẳng cơ hội.', 'Bình đẳng cơ hội', '기회의 평등', 81, NULL),
(755, '복지 정책을 확대해요.\r\nMở rộng chính sách phúc lợi.', 'Chính sách phúc lợi', '복지 정책', 81, NULL),
(756, '삶의 가치를 생각해요.\r\nSuy nghĩ về giá trị cuộc sống.', 'Giá trị cuộc sống', '삶의 가치', 82, NULL),
(757, '의미 있는 삶을 살아요.\r\nSống một cuộc đời có ý nghĩa.', 'Cuộc đời có ý nghĩa', '의미 있는 삶', 82, NULL),
(758, '행복을 추구해요.\r\nTheo đuổi hạnh phúc.', 'Hạnh phúc', '행복', 82, NULL),
(759, '만족감을 느껴요.\r\nCảm thấy hài lòng.', 'Hài lòng', '만족감', 82, NULL),
(760, '성취감을 얻어요.\r\nĐạt được cảm giác thành tựu.', 'Cảm giác thành tựu', '성취감', 82, NULL),
(761, '자아실현을 해요.\r\nThực hiện bản thân.', 'Thực hiện bản thân', '자아실현', 82, NULL),
(762, '인생의 목표가 있어요.\r\nCó mục tiêu cuộc đời.', 'Mục tiêu cuộc đời', '인생의 목표', 82, NULL),
(763, '가족이 소중해요.\r\nGia đình quý giá.', 'Quý giá', '소중하다', 82, NULL),
(764, '우정을 소중히 여겨요.\r\nCoi trọng tình bạn.', 'Tình bạn', '우정', 82, NULL),
(765, '건강이 최고예요.\r\nSức khỏe là tốt nhất.', 'Tốt nhất', '최고', 82, NULL),
(766, '국제 교류를 해요.\r\nTrao đổi quốc tế.', 'Trao đổi quốc tế', '국제 교류', 83, NULL),
(767, '다문화 사회예요.\r\nXã hội đa văn hóa.', 'Xã hội đa văn hóa', '다문화 사회', 83, NULL),
(768, '외교 관계를 맺어요.\r\nThiết lập quan hệ ngoại giao.', 'Quan hệ ngoại giao', '외교 관계', 83, NULL),
(769, '국제 협력이 중요해요.\r\nHợp tác quốc tế quan trọng.', 'Hợp tác quốc tế', '국제 협력', 83, NULL),
(770, '글로벌 이슈를 다뤄요.\r\nXử lý vấn đề toàn cầu.', 'Vấn đề toàn cầu', '글로벌 이슈', 83, NULL),
(771, '국경을 넘나들어요.\r\nBăng qua biên giới.', 'Biên giới', '국경', 83, NULL),
(772, '언어 장벽이 있어요.\r\nCó rào cản ngôn ngữ.', 'Rào cản ngôn ngữ', '언어 장벽', 83, NULL),
(773, '통역사가 필요해요.\r\nCần thông dịch viên.', 'Thông dịch viên', '통역사', 83, NULL),
(774, '문화적 차이를 이해해요.\r\nHiểu sự khác biệt văn hóa.', 'Sự khác biệt văn hóa', '문화적 차이', 83, NULL),
(775, '세계 평화를 추구해요.\r\nTheo đuổi hòa bình thế giới.', 'Hòa bình thế giới', '세계 평화', 83, NULL),
(776, '비판적 사고가 필요해요.\r\nCần tư duy phản biện.', 'Tư duy phản biện', '비판적 사고', 84, NULL),
(777, '논리적 추론을 해요.\r\nSuy luận logic.', 'Suy luận logic', '논리적 추론', 84, NULL),
(778, '근거를 제시해요.\r\nĐưa ra căn cứ.', 'Căn cứ', '근거', 84, NULL),
(779, '편견을 극복해요.\r\nVượt qua thành kiến.', 'Thành kiến', '편견', 84, NULL),
(780, '다각도로 분석해요.\r\nPhân tích đa chiều.', 'Đa chiều', '다각도', 84, NULL),
(781, '가설을 검증해요.\r\nKiểm chứng giả thuyết.', 'Giả thuyết', '가설', 84, NULL),
(782, '반박 논리를 제시해요.\r\nĐưa ra logic phản bác.', 'Phản bác', '반박', 84, NULL),
(783, '객관성을 유지해요.\r\nDuy trì tính khách quan.', 'Tính khách quan', '객관성', 84, NULL),
(784, '창의적 해결책을 찾아요.\r\nTìm giải pháp sáng tạo.', 'Giải pháp sáng tạo', '창의적 해결책', 84, NULL),
(785, '메타인지를 활용해요.\r\nSử dụng siêu nhận thức.', 'Siêu nhận thức', '메타인지', 84, NULL),
(786, '사회 현상을 분석해요.\r\nPhân tích hiện tượng xã hội.', 'Hiện tượng xã hội', '사회 현상', 85, NULL),
(787, '사회학적 관점에서 봐요.\r\nNhìn từ góc độ xã hội học.', 'Góc độ xã hội học', '사회학적 관점', 85, NULL),
(788, '통계 자료를 활용해요.\r\nSử dụng dữ liệu thống kê.', 'Dữ liệu thống kê', '통계 자료', 85, NULL),
(789, '설문조사를 실시해요.\r\nThực hiện khảo sát.', 'Khảo sát', '설문조사', 85, NULL),
(790, '표본을 추출해요.\r\nLấy mẫu.', 'Lấy mẫu', '표본 추출', 85, NULL),
(791, '상관관계를 찾아요.\r\nTìm mối tương quan.', 'Mối tương quan', '상관관계', 85, NULL),
(792, '인과관계를 규명해요.\r\nLàm rõ mối quan hệ nhân quả.', 'Mối quan hệ nhân quả', '인과관계', 85, NULL),
(793, '사회적 요인을 고려해요.\r\nXem xét yếu tố xã hội.', 'Yếu tố xã hội', '사회적 요인', 85, NULL),
(794, '연구 방법론을 적용해요.\r\nÁp dụng phương pháp nghiên cứu.', 'Phương pháp nghiên cứu', '연구 방법론', 85, NULL),
(795, '결론을 도출해요.\r\nRút ra kết luận.', 'Rút ra kết luận', '결론 도출', 85, NULL),
(796, '글로벌 문화가 확산돼요.\r\nVăn hóa toàn cầu lan rộng.', 'Văn hóa toàn cầu', '글로벌 문화', 86, NULL),
(797, '문화적 동질화가 일어나요.\r\nĐồng nhất hóa văn hóa xảy ra.', 'Đồng nhất hóa văn hóa', '문화적 동질화', 86, NULL),
(798, '지역 문화가 사라져요.\r\nVăn hóa địa phương biến mất.', 'Văn hóa địa phương', '지역 문화', 86, NULL),
(799, '문화 제국주의를 경계해요.\r\nCảnh giác với chủ nghĩa đế quốc văn hóa.', 'Chủ nghĩa đế quốc văn hóa', '문화 제국주의', 86, NULL),
(800, '다문화주의를 추구해요.\r\nTheo đuổi chủ nghĩa đa văn hóa.', 'Chủ nghĩa đa văn hóa', '다문화주의', 86, NULL),
(801, '문화적 정체성을 유지해요.\r\nDuy trì bản sắc văn hóa.', 'Bản sắc văn hóa', '문화적 정체성', 86, NULL),
(802, '문화 교류가 활발해요.\r\nTrao đổi văn hóa sôi động.', 'Trao đổi văn hóa', '문화 교류', 86, NULL),
(803, '세계화 현상이에요.\r\nHiện tượng toàn cầu hóa.', 'Toàn cầu hóa', '세계화', 86, NULL),
(804, '문화적 충돌이 있어요.\r\nCó xung đột văn hóa.', 'Xung đột văn hóa', '문화적 충돌', 86, NULL),
(805, '문화적 융합을 추구해요.\r\nTheo đuổi hội nhập văn hóa.', 'Hội nhập văn hóa', '문화적 융합', 86, NULL),
(806, '갈등을 해결해야 해요.\r\nPhải giải quyết xung đột.', 'Xung đột', '갈등', 87, NULL),
(807, '중재가 필요해요.\r\nCần trung gian hòa giải.', 'Trung gian hòa giải', '중재', 87, NULL),
(808, '조정을 통해 해결해요.\r\nGiải quyết thông qua điều giải.', 'Điều giải', '조정', 87, NULL),
(809, '협상을 진행해요.\r\nTiến hành đàm phán.', 'Đàm phán', '협상', 87, NULL),
(810, '타협점을 찾아요.\r\nTìm điểm thỏa hiệp.', 'Điểm thỏa hiệp', '타협점', 87, NULL),
(811, '양보가 필요해요.\r\nCần nhượng bộ.', 'Nhượng bộ', '양보', 87, NULL),
(812, '대화로 풀어요.\r\nGiải quyết bằng đối thoại.', 'Đối thoại', '대화', 87, NULL),
(813, '평화적 해결을 추구해요.\r\nTheo đuổi giải pháp hòa bình.', 'Giải pháp hòa bình', '평화적 해결', 87, NULL),
(814, '분쟁을 조정해요.\r\nĐiều giải tranh chấp.', 'Tranh chấp', '분쟁', 87, NULL),
(815, '화해를 도모해요.\r\nThúc đẩy hòa giải.', 'Hòa giải', '화해', 87, NULL),
(816, '도덕적 기준이 중요해요.\r\nTiêu chuẩn đạo đức quan trọng.', 'Tiêu chuẩn đạo đức', '도덕적 기준', 88, NULL),
(817, '윤리 의식을 가져야 해요.\r\nPhải có ý thức đạo đức.', 'Ý thức đạo đức', '윤리 의식', 88, NULL),
(818, '법적 책임을 져요.\r\nChịu trách nhiệm pháp lý.', 'Trách nhiệm pháp lý', '법적 책임', 88, NULL),
(819, '정의를 추구해요.\r\nTheo đuổi công lý.', 'Công lý', '정의', 88, NULL),
(820, '공정성을 유지해요.\r\nDuy trì công bằng.', 'Công bằng', '공정성', 88, NULL),
(821, '양심에 따라 행동해요.\r\nHành động theo lương tâm.', 'Lương tâm', '양심', 88, NULL),
(822, '도덕적 딜레마에 빠져요.\r\nRơi vào tiến thoái lưỡng nan đạo đức.', 'Tiến thoái lưỡng nan đạo đức', '도덕적 딜레마', 88, NULL),
(823, '법치주의를 따라요.\r\nTheao chủ nghĩa pháp quyền.', 'Chủ nghĩa pháp quyền', '법치주의', 88, NULL),
(824, '사회적 규범을 지켜요.\r\nGiữ quy chuẩn xã hội.', 'Quy chuẩn xã hội', '사회적 규범', 88, NULL),
(825, '인간의 존엄성을 존중해요.\r\nTôn trọng phẩm giá con người.', 'Phẩm giá con người', '인간의 존엄성', 88, NULL),
(826, '언론의 역할이 중요해요.\r\nVai trò báo chí quan trọng.', 'Vai trò báo chí', '언론의 역할', 89, NULL),
(827, '여론을 형성해요.\r\nHình thành dư luận.', 'Dư luận', '여론', 89, NULL),
(828, '공론장을 제공해요.\r\nCung cấp diễn đàn công luận.', 'Diễn đàn công luận', '공론장', 89, NULL),
(829, '정보를 전달해요.\r\nTruyền tải thông tin.', 'Truyền tải thông tin', '정보 전달', 89, NULL),
(830, '사회적 감시 기능을 해요.\r\nThực hiện chức năng giám sát xã hội.', 'Chức năng giám sát xã hội', '사회적 감시 기능', 89, NULL),
(831, '의제를 설정해요.\r\nThiết lập chương trình nghị sự.', 'Thiết lập chương trình nghị sự', '의제 설정', 89, NULL),
(832, '비판적 보도를 해요.\r\nĐưa tin phê phán.', 'Đưa tin phê phán', '비판적 보도', 89, NULL),
(833, '미디어 리터러시를 교육해요.\r\nGiáo dục kiến thức truyền thông.', 'Giáo dục kiến thức truyền thông', '미디어 리터러시 교육', 89, NULL),
(834, '편향 보도를 피해요.\r\nTránh đưa tin thiên lệch.', 'Đưa tin thiên lệch', '편향 보도', 89, NULL),
(835, '언론 윤리를 지켜요.\r\nGiữ đạo đức báo chí.', 'Đạo đức báo chí', '언론 윤리', 89, NULL),
(836, '외교 정책을 수립해요.\r\nThiết lập chính sách ngoại giao.', 'Chính sách ngoại giao', '외교 정책', 90, NULL),
(837, '국제 관계를 개선해요.\r\nCải thiện quan hệ quốc tế.', 'Quan hệ quốc tế', '국제 관계', 90, NULL),
(838, '다자주의를 추구해요.\r\nTheo đuổi chủ nghĩa đa phương.', 'Chủ nghĩa đa phương', '다자주의', 90, NULL),
(839, '국제법을 준수해요.\r\nTuân thủ luật pháp quốc tế.', 'Luật pháp quốc tế', '국제법', 90, NULL),
(840, '주권을 존중해요.\r\nTôn trọng chủ quyền.', 'Chủ quyền', '주권', 90, NULL),
(841, '평화 유지 활동을 해요.\r\nHoạt động gìn giữ hòa bình.', 'Hoạt động gìn giữ hòa bình', '평화 유지 활동', 90, NULL),
(842, '국제 기구에 참여해요.\r\nTham gia tổ chức quốc tế.', 'Tổ chức quốc tế', '국제 기구', 90, NULL),
(843, '외교적 해결책을 찾아요.\r\nTìm giải pháp ngoại giao.', 'Giải pháp ngoại giao', '외교적 해결책', 90, NULL),
(844, '국익을 추구해요.\r\nTheo đuổi lợi ích quốc gia.', 'Lợi ích quốc gia', '국익', 90, NULL),
(845, '글로벌 거버넌스를 강화해요.\r\nTăng cường quản trị toàn cầu.', 'Quản trị toàn cầu', '글로벌 거버넌스', 90, NULL),
(846, '창의적 교육이 필요해요.\r\nCần giáo dục sáng tạo.', 'Giáo dục sáng tạo', '창의적 교육', 91, NULL),
(847, '혁신적 사고를 기워요.\r\nPhát triển tư duy đổi mới.', 'Tư duy đổi mới', '혁신적 사고', 91, NULL),
(848, '문제 해결 능력을 개발해요.\r\nPhát triển năng lực giải quyết vấn đề.', 'Năng lực giải quyết vấn đề', '문제 해결 능력', 91, NULL),
(849, '융합적 사고를 해요.\r\nTư duy tích hợp.', 'Tư duy tích hợp', '융합적 사고', 91, NULL),
(850, '개별화 교육을 실시해요.\r\nThực hiện giáo dục cá thể hóa.', 'Giáo dục cá thể hóa', '개별화 교육', 91, NULL),
(851, '협력 학습을 강화해요.\r\nTăng cường học tập hợp tác.', 'Học tập hợp tác', '협력 학습', 91, NULL),
(852, '체험 중심 교육을 해요.\r\nGiáo dục lấy trải nghiệm làm trung tâm.', 'Giáo dục lấy trải nghiệm làm trung tâm', '체험 중심 교육', 91, NULL),
(853, '학습자 중심 교육이에요.\r\nGiáo dục lấy người học làm trung tâm.', 'Giáo dục lấy người học làm trung tâm', '학습자 중심 교육', 91, NULL),
(854, '미래 역량을 기워요.\r\nPhát triển năng lực tương lai.', 'Năng lực tương lai', '미래 역량', 91, NULL),
(855, '교육 혁신을 추진해요.\r\nThúc đẩy đổi mới giáo dục.', 'Đổi mới giáo dục', '교육 혁신', 91, NULL),
(856, '개인의 자유가 중요해요.\r\nTự do cá nhân quan trọng.', 'Tự do cá nhân', '개인의 자유', 92, NULL),
(857, '자율성을 존중해요.\r\nTôn trọng tự chủ.', 'Tự chủ', '자율성', 92, NULL),
(858, '책임감을 가져야 해요.\r\nPhải có tinh thần trách nhiệm.', 'Tinh thần trách nhiệm', '책임감', 92, NULL),
(859, '자기 결정권이 있어요.\r\nCó quyền tự quyết.', 'Quyền tự quyết', '자기 결정권', 92, NULL),
(860, '사회적 책무를 다해요.\r\nThực hiện trách nhiệm xã hội.', 'Trách nhiệm xã hội', '사회적 책무', 92, NULL),
(861, '권리와 의무가 균형을 이뤄요.\r\nQuyền và nghĩa vụ cân bằng.', 'Quyền và nghĩa vụ', '권리와 의무', 92, NULL),
(862, '윤리적 자각이 필요해요.\r\nCần tự giác đạo đức.', 'Tự giác đạo đức', '윤리적 자각', 92, NULL),
(863, '타인을 배려해요.\r\nQuan tâm đến người khác.', 'Quan tâm', '배려', 92, NULL),
(864, '공동체 의식을 가져요.\r\nCó ý thức cộng đồng.', 'Ý thức cộng đồng', '공동체 의식', 92, NULL),
(865, '도덕적 주체성을 확립해요.\r\nXác lập chủ thể đạo đức.', 'Chủ thể đạo đức', '도덕적 주체성', 92, NULL),
(866, '예술의 사회적 기능이 있어요.\r\nCó chức năng xã hội của nghệ thuật.', 'Chức năng xã hội của nghệ thuật', '예술의 사회적 기능', 93, NULL),
(867, '문화 예술 교육을 실시해요.\r\nThực hiện giáo dục văn hóa nghệ thuật.', 'Giáo dục văn hóa nghệ thuật', '문화 예술 교육', 93, NULL),
(868, '예술적 감수성을 기워요.\r\nPhát triển tính nhạy cảm nghệ thuật.', 'Tính nhạy cảm nghệ thuật', '예술적 감수성', 93, NULL),
(869, '미적 체험을 해요.\r\nTrải nghiệm thẩm mỹ.', 'Trải nghiệm thẩm mỹ', '미적 체험', 93, NULL),
(870, '문화 다양성을 증진해요.\r\nThúc đẩy đa dạng văn hóa.', 'Thúc đẩy đa dạng văn hóa', '문화 다양성 증진', 93, NULL),
(871, '예술적 표현의 자유가 있어요.\r\nCó tự do biểu đạt nghệ thuật.', 'Tự do biểu đạt nghệ thuật', '예술적 표현의 자유', 93, NULL),
(872, '사회 참여적 예술을 해요.\r\nLàm nghệ thuật tham gia xã hội.', 'Nghệ thuật tham gia xã hội', '사회 참여적 예술', 93, NULL),
(873, '문화적 소통을 도모해요.\r\nThúc đẩy giao tiếp văn hóa.', 'Giao tiếp văn hóa', '문화적 소통', 93, NULL),
(874, '예술의 치유 효과가 있어요.\r\nCó hiệu quả chữa lành của nghệ thuật.', 'Hiệu quả chữa lành của nghệ thuật', '예술의 치유 효과', 93, NULL),
(875, '창작 활동을 지원해요.\r\nHỗ trợ hoạt động sáng tác.', 'Hoạt động sáng tác', '창작 활동', 93, NULL),
(876, '기업가 정신이 중요해요.\r\nTinh thần doanh nhân quan trọng.', 'Tinh thần doanh nhân', '기업가 정신', 94, NULL),
(877, '투자 전략을 세워요.\r\nThiết lập chiến lược đầu tư.', 'Chiến lược đầu tư', '투자 전략', 94, NULL),
(878, '위험 관리를 해요.\r\nQuản lý rủi ro.', 'Quản lý rủi ro', '위험 관리', 94, NULL),
(879, '수익성을 분석해요.\r\nPhân tích khả năng sinh lời.', 'Khả năng sinh lời', '수익성', 94, NULL),
(880, '시장 조사를 실시해요.\r\nThực hiện nghiên cứu thị trường.', 'Nghiên cứu thị trường', '시장 조사', 94, NULL),
(881, '경영 전략을 수립해요.\r\nThiết lập chiến lược kinh doanh.', 'Chiến lược kinh doanh', '경영 전략', 94, NULL),
(882, '경쟁 우위를 확보해요.\r\nBảo đảm lợi thế cạnh tranh.', 'Lợi thế cạnh tranh', '경쟁 우위', 94, NULL),
(883, '기업의 사회적 책임을 다해요.\r\nThực hiện trách nhiệm xã hội của doanh nghiệp.', 'Trách nhiệm xã hội của doanh nghiệp', '기업의 사회적 책임', 94, NULL),
(884, '지속 가능한 경영을 해요.\r\nKinh doanh bền vững.', 'Kinh doanh bền vững', '지속 가능한 경영', 94, NULL),
(885, '혁신을 통해 성장해요.\r\nPhát triển thông qua đổi mới.', 'Phát triển thông qua đổi mới', '혁신을 통한 성장', 94, NULL),
(886, '국제 협력이 필수예요.\r\nHợp tác quốc tế là cần thiết.', 'Hợp tác quốc tế', '국제 협력', 95, NULL),
(887, '다국간 협정을 체결해요.\r\nKý kết hiệp định đa phương.', 'Hiệp định đa phương', '다국간 협정', 95, NULL),
(888, '개발 원조를 제공해요.\r\nCung cấp viện trợ phát triển.', 'Viện trợ phát triển', '개발 원조', 95, NULL),
(889, '기술 이전을 진행해요.\r\nTiến hành chuyển giao công nghệ.', 'Chuyển giao công nghệ', '기술 이전', 95, NULL),
(890, '국제 기구에서 활동해요.\r\nHoạt động trong tổ chức quốc tế.', 'Hoạt động trong tổ chức quốc tế', '국제 기구 활동', 95, NULL),
(891, '상호 이익을 추구해요.\r\nTheo đuổi lợi ích chung.', 'Lợi ích chung', '상호 이익', 95, NULL),
(892, '문화 교류를 증진해요.\r\nThúc đẩy trao đổi văn hóa.', 'Thúc đẩy trao đổi văn hóa', '문화 교류 증진', 95, NULL),
(893, '인도적 지원을 해요.\r\nHỗ trợ nhân đạo.', 'Hỗ trợ nhân đạo', '인도적 지원', 95, NULL),
(894, '지구촌 문제를 해결해요.\r\nGiải quyết vấn đề toàn cầu.', 'Vấn đề toàn cầu', '지구촌 문제', 95, NULL),
(895, '연대 의식을 가져요.\r\nCó ý thức đoàn kết.', 'Ý thức đoàn kết', '연대 의식', 95, NULL),
(896, '전통적 가치관을 지켜요.\r\nGiữ hệ giá trị truyền thống.', 'Hệ giá trị truyền thống', '전통적 가치관', 96, NULL),
(897, '효도를 실천해요.\r\nThực hành hiếu đạo.', 'Hiếu đạo', '효도', 96, NULL),
(898, '조상을 공경해요.\r\nKính trọng tổ tiên.', 'Kính trọng', '공경', 96, NULL),
(899, '예의범절을 중시해요.\r\nCoi trọng phép tắc.', 'Coi trọng', '중시', 96, NULL),
(900, '전통 문화를 계승해요.\r\nKế thừa văn hóa truyền thống.', 'Kế thừa', '계승', 96, NULL),
(901, '집단의식을 가져요.\r\nCó ý thức tập thể.', 'Ý thức tập thể', '집단의식', 96, NULL),
(902, '인륜 도덕을 지켜요.\r\nGiữ đạo đức nhân luân.', 'Đạo đức nhân luân', '인륜 도덕', 96, NULL),
(903, '정신적 유산을 보존해요.\r\nBảo tồn di sản tinh thần.', 'Di sản tinh thần', '정신적 유산', 96, NULL),
(904, '문화적 정체성을 확립해요.\r\nXác lập bản sắc văn hóa.', 'Bản sắc văn hóa', '문화적 정체성', 96, NULL),
(905, '세대 간 전승을 해요.\r\nTruyền thừa giữa các thế hệ.', 'Truyền thừa', '전승', 96, NULL),
(906, '지속 가능한 발전을 추구해요.\r\nTheo đuổi phát triển bền vững.', 'Phát triển bền vững', '지속 가능한 발전', 97, NULL),
(907, '환경 보전이 우선이에요.\r\nBảo tồn môi trường là ưu tiên.', 'Bảo tồn môi trường', '환경 보전', 97, NULL),
(908, '자원의 효율적 이용이 필요해요.\r\nCần sử dụng tài nguyên hiệu quả.', 'Sử dụng hiệu quả', '효율적 이용', 97, NULL),
(909, '미래 세대를 고려해요.\r\nXem xét thế hệ tương lai.', 'Thế hệ tương lai', '미래 세대', 97, NULL),
(910, '친환경 기술을 개발해요.\r\nPhát triển công nghệ thân thiện môi trường.', 'Công nghệ thân thiện môi trường', '친환경 기술', 97, NULL),
(911, '순환경제를 구축해요.\r\nXây dựng kinh tế tuần hoàn.', 'Kinh tế tuần hoàn', '순환경제', 97, NULL),
(912, '생태계 복원을 해요.\r\nPhục hồi hệ sinh thái.', 'Phục hồi hệ sinh thái', '생태계 복원', 97, NULL),
(913, '녹색 성장을 지향해요.\r\nHướng tới tăng trưởng xanh.', 'Tăng trưởng xanh', '녹색 성장', 97, NULL),
(914, '환경 영향 평가를 실시해요.\r\nThực hiện đánh giá tác động môi trường.', 'Đánh giá tác động môi trường', '환경 영향 평가', 97, NULL),
(915, '지구적 사고를 해야 해요.\r\nPhải có tư duy toàn cầu.', 'Tư duy toàn cầu', '지구적 사고', 97, NULL),
(916, '제4차 산업혁명이 진행돼요.\r\nCách mạng công nghiệp 4.0 đang diễn ra.', 'Cách mạng công nghiệp 4.0', '제4차 산업혁명', 98, NULL),
(917, '인공지능이 일자리를 대체해요.\r\nTrí tuệ nhân tạo thay thế việc làm.', 'Thay thế việc làm', '일자리 대체', 98, NULL),
(918, '디지털 전환이 가속화돼요.\r\nChuyển đổi số gia tốc.', 'Chuyển đổi số', '디지털 전환', 98, NULL),
(919, '스마트 팩토리를 운영해요.\r\nVận hành nhà máy thông minh.', 'Nhà máy thông minh', '스마트 팩토리', 98, NULL),
(920, '플랫폼 경제가 확산돼요.\r\nKinh tế nền tảng lan rộng.', 'Kinh tế nền tảng', '플랫폼 경제', 98, NULL),
(921, '데이터가 새로운 자원이에요.\r\nDữ liệu là tài nguyên mới.', 'Tài nguyên mới', '새로운 자원', 98, NULL),
(922, '초연결 사회가 돼요.\r\nTrở thành xã hội siêu kết nối.', 'Xã hội siêu kết nối', '초연결 사회', 98, NULL),
(923, '기술적 특이점이 다가와요.\r\nĐiểm kỳ dị công nghệ đang đến gần.', 'Điểm kỳ dị công nghệ', '기술적 특이점', 98, NULL),
(924, '디지털 격차를 해소해야 해요.\r\nPhải giải quyết khoảng cách số.', 'Khoảng cách số', '디지털 격차', 98, NULL),
(925, '인간과 기계의 협업이 중요해요.\r\nHợp tác giữa con người và máy móc quan trọng.', 'Hợp tác giữa con người và máy móc', '인간과 기계의 협업', 98, NULL),
(926, '사회적 불안이 증가해요.\r\nBất ổn xã hội tăng.', 'Bất ổn xã hội', '사회적 불안', 99, NULL),
(927, '계층 갈등이 심화돼요.\r\nXung đột tầng lớp trầm trọng hóa.', 'Xung đột tầng lớp', '계층 갈등', 99, NULL),
(928, '극화 현상이 나타나요.\r\nHiện tượng phân cực xuất hiện.', 'Hiện tượng phân cực', '극화 현상', 99, NULL),
(929, '신뢰 위기에 빠져요.\r\nRơi vào khủng hoảng lòng tin.', 'Khủng hoảng lòng tin', '신뢰 위기', 99, NULL),
(930, '포퓰리즘이 대두돼요.\r\nChủ nghĩa dân túy nổi lên.', 'Chủ nghĩa dân túy', '포퓰리즘', 99, NULL),
(931, '사회 통합이 어려워요.\r\nHội nhập xã hội khó khăn.', 'Hội nhập xã hội', '사회 통합', 99, NULL),
(932, '불확실성이 커져요.\r\nSự bất định tăng lên.', 'Sự bất định', '불확실성', 99, NULL),
(933, '사회적 연대가 약화돼요.\r\nĐoàn kết xã hội suy yếu.', 'Đoàn kết xã hội', '사회적 연대', 99, NULL),
(934, '제도적 개혁이 필요해요.\r\nCần cải cách thể chế.', 'Cải cách thể chế', '제도적 개혁', 99, NULL),
(935, '사회적 합의를 도출해야 해요.\r\nPhải đạt được đồng thuận xã hội.', 'Đồng thuận xã hội', '사회적 합의', 99, NULL),
(936, '인권이 보장돼야 해요.\r\nNhân quyền phải được bảo đảm.', 'Nhân quyền', '인권', 100, NULL),
(937, '인간의 존엄성을 존중해요.\r\nTôn trọng phẩm giá con người.', 'Phẩm giá con người', '인간의 존엄성', 100, NULL),
(938, '평등권을 실현해요.\r\nThực hiện quyền bình đẳng.', 'Quyền bình đẳng', '평등권', 100, NULL),
(939, '자유권을 행사해요.\r\nThực hiện quyền tự do.', 'Quyền tự do', '자유권', 100, NULL),
(940, '사회권이 중요해요.\r\nQuyền xã hội quan trọng.', 'Quyền xã hội', '사회권', 100, NULL),
(941, '차별을 금지해요.\r\nCấm phân biệt đối xử.', 'Cấm phân biệt đối xử', '차별 금지', 100, NULL),
(942, '국제 인권법을 준수해요.\r\nTuân thủ luật nhân quyền quốc tế.', 'Luật nhân quyền quốc tế', '국제 인권법', 100, NULL),
(943, '소수자 권리를 보호해요.\r\nBảo vệ quyền của thiểu số.', 'Quyền của thiểu số', '소수자 권리', 100, NULL),
(944, '인도주의적 가치를 추구해요.\r\nTheo đuổi giá trị nhân đạo.', 'Giá trị nhân đạo', '인도주의적 가치', 100, NULL),
(945, '보편적 인권을 인정해요.\r\nThừa nhận nhân quyền phổ quát.', 'Nhân quyền phổ quát', '보편적 인권', 100, NULL),
(946, '감정을 조절하는 능력이 중요해요.\r\nKhả năng điều chỉnh cảm xúc quan trọng.', 'Khả năng điều chỉnh cảm xúc', '감정 조절 능력', 101, NULL),
(947, '자기 인식을 높여요.\r\nNâng cao nhận thức bản thân.', 'Nhận thức bản thân', '자기 인식', 101, NULL),
(948, '공감 능력을 기워요.\r\nPhát triển khả năng đồng cảm.', 'Khả năng đồng cảm', '공감 능력', 101, NULL),
(949, '스트레스를 관리해요.\r\nQuản lý căng thẳng.', 'Quản lý căng thẳng', '스트레스 관리', 101, NULL),
(950, '감정 지능을 향상시켜요.\r\nCải thiện trí tuệ cảm xúc.', 'Trí tuệ cảm xúc', '감정 지능', 101, NULL),
(951, '심리적 안녕감을 추구해요.\r\nTheo đuổi sự an lành tâm lý.', 'Sự an lành tâm lý', '심리적 안녕감', 101, NULL),
(952, '마음챙김을 실천해요.\r\nThực hành chánh niệm.', 'Chánh niệm', '마음챙김', 101, NULL),
(953, '정서적 성숙을 이뤄요.\r\nĐạt được sự trưởng thành về mặt cảm xúc.', 'Trưởng thành về mặt cảm xúc', '정서적 성숙', 101, NULL),
(954, '내적 평화를 찾아요.\r\nTìm sự bình an nội tâm.', 'Sự bình an nội tâm', '내적 평화', 101, NULL),
(955, '감정의 균형을 유지해요.\r\nDuy trì cân bằng cảm xúc.', 'Cân bằng cảm xúc', '감정의 균형', 101, NULL),
(956, '글로벌 마인드셋을 가져요.\r\nCó tư duy toàn cầu.', 'Tư duy toàn cầu', '글로벌 마인드셋', 102, NULL),
(957, '세계 시민의식을 가져요.\r\nCó ý thức công dân thế giới.', 'Ý thức công dân thế giới', '세계 시민의식', 102, NULL),
(958, '문화 간 소통을 해요.\r\nGiao tiếp liên văn hóa.', 'Giao tiếp liên văn hóa', '문화 간 소통', 102, NULL),
(959, '지구촌적 관점을 가져요.\r\nCó quan điểm làng địa cầu.', 'Quan điểm làng địa cầu', '지구촌적 관점', 102, NULL),
(960, '국경 없는 사고를 해요.\r\nTư duy không biên giới.', 'Tư duy không biên giới', '국경 없는 사고', 102, NULL),
(961, '다양성을 포용해요.\r\nBao dung sự đa dạng.', 'Bao dung sự đa dạng', '다양성 포용', 102, NULL),
(962, '세계 공통 과제에 관심을 가져요.\r\nQuan tâm đến các vấn đề chung của thế giới.', 'Vấn đề chung của thế giới', '세계 공통 과제', 102, NULL),
(963, '지속 가능한 미래를 생각해요.\r\nSuy nghĩ về tương lai bền vững.', 'Tương lai bền vững', '지속 가능한 미래', 102, NULL),
(964, '인류 공동체 의식을 가져요.\r\nCó ý thức cộng đồng nhân loại.', 'Ý thức cộng đồng nhân loại', '인류 공동체 의식', 102, NULL),
(965, '범지구적 연대감을 느껴요.\r\nCảm nhận tinh thần đoàn kết toàn cầu.', 'Tinh thần đoàn kết toàn cầu', '범지구적 연대감', 102, NULL),
(966, '논증 구조를 체계화해요.\r\nHệ thống hóa cấu trúc luận chứng.', 'Cấu trúc luận chứng', '논증 구조', 103, NULL),
(967, '다각적 분석을 실시해요.\r\nThực hiện phân tích đa chiều.', 'Phân tích đa chiều', '다각적 분석', 103, NULL),
(968, '종합적 결론을 도출해요.\r\nRút ra kết luận tổng hợp.', 'Kết luận tổng hợp', '종합적 결론', 103, NULL),
(969, '논리적 일관성을 유지해요.\r\nDuy trì tính nhất quán logic.', 'Tính nhất quán logic', '논리적 일관성', 103, NULL),
(970, '비판적 사고를 적용해요.\r\nÁp dụng tư duy phê phán.', 'Tư duy phê phán', '비판적 사고', 103, NULL),
(971, '객관적 근거를 제시해요.\r\nĐưa ra căn cứ khách quan.', 'Căn cứ khách quan', '객관적 근거', 103, NULL),
(972, '반박과 재반박을 해요.\r\nPhản bác và phản bác lại.', 'Phản bác và phản bác lại', '반박과 재반박', 103, NULL),
(973, '창의적 대안을 제시해요.\r\nĐề xuất phương án sáng tạo.', 'Phương án sáng tạo', '창의적 대안', 103, NULL),
(974, '학술적 글쓰기를 해요.\r\nViết học thuật.', 'Viết học thuật', '학술적 글쓰기', 103, NULL),
(975, '메타 인지적 성찰을 해요.\r\nSuy ngẫm siêu nhận thức.', 'Suy ngẫm siêu nhận thức', '메타 인지적 성찰', 103, NULL),
(976, '청중을 분석해요.\r\nPhân tích khán giả.', 'Phân tích khán giả', '청중 분석', 104, NULL),
(977, '설득력 있는 스피치를 해요.\r\nDiễn thuyết có sức thuyết phục.', 'Diễn thuyết có sức thuyết phục', '설득력 있는 스피치', 104, NULL),
(978, '비언어적 소통을 활용해요.\r\nSử dụng giao tiếp phi ngôn ngữ.', 'Giao tiếp phi ngôn ngữ', '비언어적 소통', 104, NULL),
(979, '시각적 자료를 효과적으로 써요.\r\nSử dụng tài liệu trực quan hiệu quả.', 'Tài liệu trực quan', '시각적 자료', 104, NULL),
(980, '무대 공포를 극복해요.\r\nVượt qua nỗi sợ sân khấu.', 'Nỗi sợ sân khấu', '무대 공포', 104, NULL),
(981, '상호작용적 발표를 해요.\r\nThuyết trình tương tác.', 'Thuyết trình tương tác', '상호작용적 발표', 104, NULL),
(982, '전문적 프레젠테이션을 해요.\r\nThuyết trình chuyên nghiệp.', 'Thuyết trình chuyên nghiệp', '전문적 프레젠테이션', 104, NULL),
(983, '수사학적 기법을 사용해요.\r\nSử dụng kỹ thuật tu từ học.', 'Kỹ thuật tu từ học', '수사학적 기법', 104, NULL),
(984, '즉흥 연설을 해요.\r\nDiễn thuyết ngẫu hứng.', 'Diễn thuyết ngẫu hứng', '즉흥 연설', 104, NULL),
(985, '공식적 발표를 해요.\r\nThuyết trình chính thức.', 'Thuyết trình chính thức', '공식적 발표', 104, NULL),
(986, '학술 논문을 작성해요.\r\nViết luận văn học thuật.', 'Luận văn học thuật', '학술 논문', 105, NULL),
(987, '연구 방법론을 적용해요.\r\nÁp dụng phương pháp nghiên cứu.', 'Phương pháp nghiên cứu', '연구 방법론', 105, NULL),
(988, '문헌 검토를 실시해요.\r\nThực hiện xem xét tài liệu.', 'Xem xét tài liệu', '문헌 검토', 105, NULL),
(989, '가설을 설정하고 검증해요.\r\nThiết lập và kiểm chứng giả thuyết.', 'Thiết lập và kiểm chứng giả thuyết', '가설 설정과 검증', 105, NULL),
(990, '데이터를 수집하고 분석해요.\r\nThu thập và phân tích dữ liệu.', 'Thu thập và phân tích dữ liệu', '데이터 수집과 분석', 105, NULL),
(991, '인용과 참고문헌을 정리해요.\r\nSắp xếp trích dẫn và tài liệu tham khảo.', 'Trích dẫn và tài liệu tham khảo', '인용과 참고문헌', 105, NULL),
(992, '학술적 글쓰기 양식을 따라요.\r\nTuân theo định dạng viết học thuật.', 'Định dạng viết học thuật', '학술적 글쓰기 양식', 105, NULL),
(993, '피어 리뷰를 받아요.\r\nNhận đánh giá từ đồng nghiệp.', 'Đánh giá từ đồng nghiệp', '피어 리뷰', 105, NULL),
(994, '학술지에 투고해요.\r\nGửi bài đến tạp chí học thuật.', 'Gửi bài đến tạp chí học thuật', '학술지 투고', 105, NULL),
(995, '지적 재산권을 존중해요.\r\nTôn trọng quyền sở hữu trí tuệ.', 'Quyền sở hữu trí tuệ', '지적 재산권', 105, NULL),
(996, '문학 작품을 분석해요.\r\nPhân tích tác phẩm văn học.', 'Phân tích tác phẩm văn học', '문학 작품 분석', 106, NULL),
(997, '서사 구조를 파악해요.\r\nNắm bắt cấu trúc tường thuật.', 'Cấu trúc tường thuật', '서사 구조', 106, NULL),
(998, '문학적 기법을 연구해요.\r\nNghiên cứu kỹ thuật văn học.', 'Kỹ thuật văn học', '문학적 기법', 106, NULL),
(999, '은유와 상징을 해석해요.\r\nGiải thích ẩn dụ và biểu tượng.', 'Ẩn dụ và biểu tượng', '은유와 상징', 106, NULL),
(1000, '문체적 특징을 분석해요.\r\nPhân tích đặc điểm văn thể.', 'Đặc điểm văn thể', '문체적 특징', 106, NULL),
(1001, '주제 의식을 탐구해요.\r\nKhám phá ý thức chủ đề.', 'Ý thức chủ đề', '주제 의식', 106, NULL),
(1002, '화자의 관점을 연구해요.\r\nNghiên cứu quan điểm người kể.', 'Quan điểm người kể', '화자의 관점', 106, NULL),
(1003, '문학사적 의미를 고찰해요.\r\nXem xét ý nghĩa văn học sử.', 'Ý nghĩa văn học sử', '문학사적 의미', 106, NULL),
(1004, '갈래별 특성을 이해해요.\r\nHiểu đặc tính theo thể loại.', 'Đặc tính theo thể loại', '갈래별 특성', 106, NULL),
(1005, '문학적 감수성을 기워요.\r\nPhát triển cảm thụ văn học.', 'Cảm thụ văn học', '문학적 감수성', 106, NULL),
(1006, '다문화 비교 연구를 해요.\r\nNghiên cứu so sánh đa văn hóa.', 'Nghiên cứu so sánh đa văn hóa', '다문화 비교 연구', 107, NULL),
(1007, '문화적 보편성을 찾아요.\r\nTìm tính phổ biến văn hóa.', 'Tính phổ biến văn hóa', '문화적 보편성', 107, NULL),
(1008, '문화 상대주의를 적용해요.\r\nÁp dụng chủ nghĩa tương đối văn hóa.', 'Chủ nghĩa tương đối văn hóa', '문화 상대주의', 107, NULL),
(1009, '문명 간 대화를 추구해요.\r\nTheo đuổi đối thoại giữa các nền văn minh.', 'Đối thoại giữa các nền văn minh', '문명 간 대화', 107, NULL),
(1010, '이문화 이해를 증진해요.\r\nThúc đẩy hiểu biết liên văn hóa.', 'Hiểu biết liên văn hóa', '이문화 이해', 107, NULL),
(1011, '문화 충돌과 융합을 분석해요.\r\nPhân tích xung đột và hội nhập văn hóa.', 'Xung đột và hội nhập văn hóa', '문화 충돌과 융합', 107, NULL),
(1012, '지역별 문화 특성을 연구해요.\r\nNghiên cứu đặc tính văn hóa theo khu vực.', 'Đặc tính văn hóa theo khu vực', '지역별 문화 특성', 107, NULL),
(1013, '문화 전파 과정을 추적해요.\r\nTheo dõi quá trình truyền bá văn hóa.', 'Quá trình truyền bá văn hóa', '문화 전파 과정', 107, NULL),
(1014, '문화 정체성을 비교해요.\r\nSo sánh bản sắc văn hóa.', 'So sánh bản sắc văn hóa', '문화 정체성 비교', 107, NULL),
(1015, '초국가적 현상을 관찰해요.\r\nQuan sát hiện tượng siêu quốc gia.', 'Hiện tượng siêu quốc gia', '초국가적 현상', 107, NULL),
(1016, '철학적 사고를 전개해요.\r\nPhát triển tư duy triết học.', 'Tư duy triết học', '철학적 사고', 108, NULL),
(1017, '존재론적 문제를 탐구해요.\r\nKhám phá vấn đề bản thể luận.', 'Vấn đề bản thể luận', '존재론적 문제', 108, NULL),
(1018, '인식론을 연구해요.\r\nNghiên cứu nhận thức luận.', 'Nhận thức luận', '인식론', 108, NULL),
(1019, '윤리학적 딜레마를 고민해요.\r\nSuy ngẫm tình huống tiến thoái lưỡng nan đạo đức học.', 'Tình huống tiến thoái lưỡng nan đạo đức học', '윤리학적 딜레마', 108, NULL),
(1020, '형이상학적 개념을 다뤄요.\r\nXử lý khái niệm siêu hình học.', 'Khái niệm siêu hình học', '형이상학적 개념', 108, NULL),
(1021, '변증법적 논리를 적용해요.\r\nÁp dụng logic biện chứng pháp.', 'Logic biện chứng pháp', '변증법적 논리', 108, NULL),
(1022, '이데올로기를 비판해요.\r\nPhê phán ý thức hệ.', 'Ý thức hệ', '이데올로기', 108, NULL),
(1023, '패러다임의 전환을 이해해요.\r\nHiểu sự chuyển đổi mô hình.', 'Sự chuyển đổi mô hình', '패러다임 전환', 108, NULL),
(1024, '실존주의적 관점을 취해요.\r\nChọn quan điểm hiện sinh luận.', 'Quan điểm hiện sinh luận', '실존주의적 관점', 108, NULL),
(1025, '철학사적 맥락을 고려해요.\r\nXem xét bối cảnh triết học sử.', 'Bối cảnh triết học sử', '철학사적 맥락', 108, NULL),
(1026, '사회 현실을 비판해요.\r\nPhê phán thực tế xã hội.', 'Phê phán thực tế xã hội', '사회 현실 비판', 109, NULL),
(1027, '권력 구조를 분석해요.\r\nPhân tích cấu trúc quyền lực.', 'Cấu trúc quyền lực', '권력 구조', 109, NULL),
(1028, '사회적 모순을 지적해요.\r\nChỉ ra mâu thuẫn xã hội.', 'Mâu thuẫn xã hội', '사회적 모순', 109, NULL),
(1029, '지배 이데올로기를 해체해요.\r\nPhân tích ý thức hệ thống trị.', 'Ý thức hệ thống trị', '지배 이데올로기', 109, NULL),
(1030, '사회 변혁을 추구해요.\r\nTheo đuổi biến cách xã hội.', 'Biến cách xã hội', '사회 변혁', 109, NULL),
(1031, '비판적 담론을 형성해요.\r\nHình thành diễn ngôn phê phán.', 'Diễn ngôn phê phán', '비판적 담론', 109, NULL),
(1032, '대안적 사회를 모색해요.\r\nTìm kiếm xã hội thay thế.', 'Xã hội thay thế', '대안적 사회', 109, NULL),
(1033, '사회적 각성을 촉구해요.\r\nThúc giục tỉnh thức xã hội.', 'Tỉnh thức xã hội', '사회적 각성', 109, NULL),
(1034, '저항 문화를 연구해요.\r\nNghiên cứu văn hóa kháng cự.', 'Văn hóa kháng cự', '저항 문화', 109, NULL),
(1035, '비판 이론을 적용해요.\r\nÁp dụng lý thuyết phê phán.', 'Lý thuyết phê phán', '비판 이론', 109, NULL),
(1036, '국제법 체계를 연구해요.\r\nNghiên cứu hệ thống luật pháp quốc tế.', 'Hệ thống luật pháp quốc tế', '국제법 체계', 110, NULL),
(1037, '조약의 효력을 인정해요.\r\nThừa nhận hiệu lực của hiệp ước.', 'Hiệu lực của hiệp ước', '조약의 효력', 110, NULL),
(1038, '국제 분쟁을 해결해요.\r\nGiải quyết tranh chấp quốc tế.', 'Tranh chấp quốc tế', '국제 분쟁', 110, NULL),
(1039, '국제 사법 재판소에 제소해요.\r\nKiện lên Tòa án Công lý Quốc tế.', 'Tòa án Công lý Quốc tế', '국제 사법 재판소', 110, NULL),
(1040, '외교적 면책권을 보장해요.\r\nBảo đảm quyền miễn trừ ngoại giao.', 'Quyền miễn trừ ngoại giao', '외교적 면책권', 110, NULL),
(1041, '국제 제재를 가해요.\r\nÁp đặt trừng phạt quốc tế.', 'Trừng phạt quốc tế', '국제 제재', 110, NULL),
(1042, '평화 유지군을 파견해요.\r\nPhái quân gìn giữ hòa bình.', 'Quân gìn giữ hòa bình', '평화 유지군', 110, NULL),
(1043, '국제 관습법을 준수해요.\r\nTuân thủ luật tập quán quốc tế.', 'Luật tập quán quốc tế', '국제 관습법', 110, NULL),
(1044, '영토 주권을 인정해요.\r\nThừa nhận chủ quyền lãnh thổ.', 'Chủ quyền lãnh thổ', '영토 주권', 110, NULL),
(1045, '국제 협력 체제를 구축해요.\r\nXây dựng thể chế hợp tác quốc tế.', 'Thể chế hợp tác quốc tế', '국제 협력 체제', 110, NULL),
(1046, '조직 관리 이론을 적용해요.\r\nÁp dụng lý thuyết quản lý tổ chức.', 'Lý thuyết quản lý tổ chức', '조직 관리 이론', 111, NULL),
(1047, '리더십 역량을 개발해요.\r\nPhát triển năng lực lãnh đạo.', 'Năng lực lãnh đạo', '리더십 역량', 111, NULL),
(1048, '조직 문화를 혁신해요.\r\nĐổi mới văn hóa tổ chức.', 'Văn hóa tổ chức', '조직 문화', 111, NULL),
(1049, '인적 자원을 관리해요.\r\nQuản lý nguồn nhân lực.', 'Nguồn nhân lực', '인적 자원', 111, NULL),
(1050, '성과 평가 시스템을 운영해요.\r\nVận hành hệ thống đánh giá hiệu suất.', 'Hệ thống đánh giá hiệu suất', '성과 평가 시스템', 111, NULL),
(1051, '의사결정 과정을 개선해요.\r\nCải thiện quy trình ra quyết định.', 'Quy trình ra quyết định', '의사결정 과정', 111, NULL),
(1052, '조직 구조를 재편해요.\r\nTái cấu trúc tổ chức.', 'Tái cấu trúc', '재편', 111, NULL),
(1053, '변화 관리를 실시해요.\r\nThực hiện quản lý thay đổi.', 'Quản lý thay đổi', '변화 관리', 111, NULL),
(1054, '팀워크를 강화해요.\r\nTăng cường tinh thần đội nhóm.', 'Tinh thần đội nhóm', '팀워크', 111, NULL),
(1055, '전략적 계획을 수립해요.\r\nThiết lập kế hoạch chiến lược.', 'Kế hoạch chiến lược', '전략적 계획', 111, NULL),
(1056, '협상 전략을 수립해요.\r\nThiết lập chiến lược đàm phán.', 'Chiến lược đàm phán', '협상 전략', 112, NULL),
(1057, '상호 이익을 추구해요.\r\nTheo đuổi lợi ích qua lại.', 'Lợi ích qua lại', '상호 이익', 112, NULL),
(1058, '양보점을 설정해요.\r\nThiết lập điểm nhượng bộ.', 'Điểm nhượng bộ', '양보점', 112, NULL),
(1059, '협상력을 기워요.\r\nPhát triển sức mạnh đàm phán.', 'Sức mạnh đàm phán', '협상력', 112, NULL),
(1060, '대안을 준비해요.\r\nChuẩn bị phương án thay thế.', 'Phương án thay thế', '대안', 112, NULL),
(1061, '설득 기법을 사용해요.\r\nSử dụng kỹ thuật thuyết phục.', 'Kỹ thuật thuyết phục', '설득 기법', 112, NULL),
(1062, '갈등을 조정해요.\r\nĐiều chỉnh xung đột.', 'Điều chỉnh xung đột', '갈등 조정', 112, NULL),
(1063, '합의점을 찾아요.\r\nTìm điểm đồng thuận.', 'Điểm đồng thuận', '합의점', 112, NULL),
(1064, '계약 조건을 협의해요.\r\nThỏa thuận điều kiện hợp đồng.', 'Điều kiện hợp đồng', '계약 조건', 112, NULL),
(1065, '협상 결과를 평가해요.\r\nĐánh giá kết quả đàm phán.', 'Kết quả đàm phán', '협상 결과', 112, NULL),
(1066, '사회 심리 현상을 연구해요.\r\nNghiên cứu hiện tượng tâm lý xã hội.', 'Hiện tượng tâm lý xã hội', '사회 심리 현상', 113, NULL),
(1067, '집단 역학을 분석해요.\r\nPhân tích động lực nhóm.', 'Động lực nhóm', '집단 역학', 113, NULL),
(1068, '사회적 인지를 탐구해요.\r\nKhám phá nhận thức xã hội.', 'Nhận thức xã hội', '사회적 인지', 113, NULL),
(1069, '편견과 고정관념을 연구해요.\r\nNghiên cứu thành kiến và định kiến.', 'Thành kiến và định kiến', '편견과 고정관념', 113, NULL),
(1070, '사회적 영향력을 측정해요.\r\nĐo lường ảnh hưởng xã hội.', 'Ảnh hưởng xã hội', '사회적 영향력', 113, NULL),
(1071, '집단 압력을 분석해요.\r\nPhân tích áp lực nhóm.', 'Áp lực nhóm', '집단 압력', 113, NULL),
(1072, '사회적 역할을 수행해요.\r\nThực hiện vai trò xã hội.', 'Vai trò xã hội', '사회적 역할', 113, NULL),
(1073, '대인 관계를 개선해요.\r\nCải thiện mối quan hệ cá nhân.', 'Mối quan hệ cá nhân', '대인 관계', 113, NULL),
(1074, '집단 갈등을 해결해요.\r\nGiải quyết xung đột nhóm.', 'Xung đột nhóm', '집단 갈등', 113, NULL),
(1075, '사회적 정체성을 형성해요.\r\nHình thành bản sắc xã hội.', 'Bản sắc xã hội', '사회적 정체성', 113, NULL),
(1076, '데이터 사이언스를 연구해요.\r\nNghiên cứu khoa học dữ liệu.', 'Khoa học dữ liệu', '데이터 사이언스', 114, NULL),
(1077, '빅데이터를 처리해요.\r\nXử lý dữ liệu lớn.', 'Dữ liệu lớn', '빅데이터', 114, NULL),
(1078, '머신러닝을 적용해요.\r\nÁp dụng học máy.', 'Học máy', '머신러닝', 114, NULL),
(1079, '알고리즘을 개발해요.\r\nPhát triển thuật toán.', 'Thuật toán', '알고리즘', 114, NULL),
(1080, '데이터 마이닝을 실시해요.\r\nThực hiện khai thác dữ liệu.', 'Khai thác dữ liệu', '데이터 마이닝', 114, NULL),
(1081, '통계 모델을 구축해요.\r\nXây dựng mô hình thống kê.', 'Mô hình thống kê', '통계 모델', 114, NULL),
(1082, '데이터 시각화를 해요.\r\nTrực quan hóa dữ liệu.', 'Trực quan hóa dữ liệu', '데이터 시각화', 114, NULL),
(1083, '예측 분석을 수행해요.\r\nThực hiện phân tích dự đoán.', 'Phân tích dự đoán', '예측 분석', 114, NULL),
(1084, '패턴을 인식해요.\r\nNhận dạng mẫu.', 'Nhận dạng mẫu', '패턴 인식', 114, NULL),
(1085, '인공지능을 활용해요.\r\nSử dụng trí tuệ nhân tạo.', 'Sử dụng trí tuệ nhân tạo', '인공지능 활용', 114, NULL),
(1086, '국가 정책을 수립해요.\r\nThiết lập chính sách quốc gia.', 'Chính sách quốc gia', '국가 정책', 115, NULL),
(1087, '정책 대안을 검토해요.\r\nXem xét phương án chính sách.', 'Phương án chính sách', '정책 대안', 115, NULL),
(1088, '이해관계자를 조정해요.\r\nĐiều phối các bên liên quan.', 'Các bên liên quan', '이해관계자', 115, NULL),
(1089, '정책 효과를 평가해요.\r\nĐánh giá hiệu quả chính sách.', 'Hiệu quả chính sách', '정책 효과', 115, NULL),
(1090, '공공 정책을 시행해요.\r\nThực thi chính sách công.', 'Chính sách công', '공공 정책', 115, NULL),
(1091, '정책 목표를 설정해요.\r\nThiết lập mục tiêu chính sách.', 'Mục tiêu chính sách', '정책 목표', 115, NULL),
(1092, '사회적 합의를 도출해요.\r\nĐạt được đồng thuận xã hội.', 'Đồng thuận xã hội', '사회적 합의', 115, NULL),
(1093, '정책 비용을 산정해요.\r\nTính toán chi phí chính sách.', 'Chi phí chính sách', '정책 비용', 115, NULL),
(1094, '정책 환경을 분석해요.\r\nPhân tích môi trường chính sách.', 'Môi trường chính sách', '정책 환경', 115, NULL),
(1095, '정책 도구를 선택해요.\r\nChọn công cụ chính sách.', 'Công cụ chính sách', '정책 도구', 115, NULL),
(1096, '민주주의 원리를 실현해요.\r\nThực hiện nguyên lý dân chủ.', 'Nguyên lý dân chủ', '민주주의 원리', 116, NULL),
(1097, '법치주의를 확립해요.\r\nXác lập chủ nghĩa pháp quyền.', 'Chủ nghĩa pháp quyền', '법치주의', 116, NULL),
(1098, '권력 분립을 보장해요.\r\nBảo đảm phân quyền.', 'Phân quyền', '권력 분립', 116, NULL),
(1099, '사법부 독립을 유지해요.\r\nDuy trì độc lập tư pháp.', 'Độc lập tư pháp', '사법부 독립', 116, NULL),
(1100, '헌법을 수호해요.\r\nBảo vệ hiến pháp.', 'Bảo vệ hiến pháp', '헌법 수호', 116, NULL),
(1101, '시민 참여를 확대해요.\r\nMở rộng tham gia của công dân.', 'Tham gia của công dân', '시민 참여', 116, NULL),
(1102, '투명성을 제고해요.\r\nNâng cao tính minh bạch.', 'Tính minh bạch', '투명성', 116, NULL),
(1103, '책임정치를 실현해요.\r\nThực hiện chính trị có trách nhiệm.', 'Chính trị có trách nhiệm', '책임정치', 116, NULL),
(1104, '인권을 보장해요.\r\nBảo đảm nhân quyền.', 'Bảo đảm nhân quyền', '인권 보장', 116, NULL),
(1105, '다원주의를 인정해요.\r\nThừa nhận chủ nghĩa đa nguyên.', 'Chủ nghĩa đa nguyên', '다원주의', 116, NULL),
(1106, '연구 방법론을 설계해요.\r\nThiết kế phương pháp nghiên cứu.', 'Phương pháp nghiên cứu', '연구 방법론', 117, NULL),
(1107, '문헌 조사를 실시해요.\r\nThực hiện điều tra tài liệu.', 'Điều tra tài liệu', '문헌 조사', 117, NULL),
(1108, '자료를 수집하고 분석해요.\r\nThu thập và phân tích tài liệu.', 'Thu thập và phân tích tài liệu', '자료 수집과 분석', 117, NULL),
(1109, '가설을 검증해요.\r\nKiểm chứng giả thuyết.', 'Kiểm chứng giả thuyết', '가설 검증', 117, NULL),
(1110, '변수를 통제해요.\r\nKiểm soát biến số.', 'Kiểm soát biến số', '변수 통제', 117, NULL),
(1111, '실험을 설계해요.\r\nThiết kế thí nghiệm.', 'Thiết kế thí nghiệm', '실험 설계', 117, NULL),
(1112, '표본을 추출해요.\r\nLấy mẫu.', 'Lấy mẫu', '표본 추출', 117, NULL),
(1113, '결과를 해석해요.\r\nGiải thích kết quả.', 'Giải thích kết quả', '결과 해석', 117, NULL),
(1114, '신뢰도를 검증해요.\r\nKiểm chứng độ tin cậy.', 'Độ tin cậy', '신뢰도', 117, NULL),
(1115, '타당도를 확보해요.\r\nBảo đảm tính hợp lệ.', 'Tính hợp lệ', '타당도', 117, NULL),
(1116, '논증 체계를 구성해요.\r\nCấu thành hệ thống luận chứng.', 'Hệ thống luận chứng', '논증 체계', 118, NULL),
(1117, '설득력 있는 논리를 전개해요.\r\nPhát triển logic thuyết phục.', 'Logic thuyết phục', '설득력 있는 논리', 118, NULL),
(1118, '반박 논리를 구사해요.\r\nSử dụng logic phản bác.', 'Logic phản bác', '반박 논리', 118, NULL),
(1119, '근거를 체계화해요.\r\nHệ thống hóa căn cứ.', 'Hệ thống hóa căn cứ', '근거 체계화', 118, NULL),
(1120, '수사학적 기법을 활용해요.\r\nSử dụng kỹ thuật tu từ học.', 'Kỹ thuật tu từ học', '수사학적 기법', 118, NULL),
(1121, '청중을 설득해요.\r\nThuyết phục khán giả.', 'Thuyết phục khán giả', '청중 설득', 118, NULL),
(1122, '논리적 오류를 지적해요.\r\nChỉ ra lỗi logic.', 'Lỗi logic', '논리적 오류', 118, NULL),
(1123, '합리적 사고를 추구해요.\r\nTheo đuổi tư duy hợp lý.', 'Tư duy hợp lý', '합리적 사고', 118, NULL),
(1124, '대화를 통해 합의해요.\r\nĐạt đồng thuận qua đối thoại.', 'Đạt đồng thuận qua đối thoại', '대화를 통한 합의', 118, NULL),
(1125, '비판적 분석을 수행해요.\r\nThực hiện phân tích phê phán.', 'Phân tích phê phán', '비판적 분석', 118, NULL),
(1126, '전문 용어를 익혀요.\r\nHọc thuật ngữ chuyên môn.', 'Thuật ngữ chuyên môn', '전문 용어', 119, NULL),
(1127, '학술적 글쓰기를 해요.\r\nViết học thuật.', 'Viết học thuật', '학술적 글쓰기', 119, NULL),
(1128, '논문 양식을 따라요.\r\nTuân theo định dạng luận văn.', 'Định dạng luận văn', '논문 양식', 119, NULL),
(1129, '인용법을 준수해요.\r\nTuân thủ cách trích dẫn.', 'Cách trích dẫn', '인용법', 119, NULL),
(1130, '정확한 표현을 사용해요.\r\nSử dụng cách diễn đạt chính xác.', 'Cách diễn đạt chính xác', '정확한 표현', 119, NULL),
(1131, '객관적 어조를 유지해요.\r\nDuy trì giọng điệu khách quan.', 'Giọng điệu khách quan', '객관적 어조', 119, NULL),
(1132, '논리적 연결을 명확히 해요.\r\nLàm rõ mối liên kết logic.', 'Mối liên kết logic', '논리적 연결', 119, NULL),
(1133, '개념을 정의해요.\r\nĐịnh nghĩa khái niệm.', 'Định nghĩa khái niệm', '개념 정의', 119, NULL),
(1134, '추상적 사고를 표현해요.\r\nBiểu đạt tư duy trừu tượng.', 'Tư duy trừu tượng', '추상적 사고', 119, NULL),
(1135, '학문적 소통을 해요.\r\nGiao tiếp học thuật.', 'Giao tiếp học thuật', '학문적 소통', 119, NULL),
(1136, '시뮬레이션을 수행해요.\r\nThực hiện mô phỏng.', 'Mô phỏng', '시뮬레이션', 120, NULL),
(1137, '가상 상황을 연출해요.\r\nDàn dựng tình huống ảo.', 'Tình huống ảo', '가상 상황', 120, NULL),
(1138, '역할 연기를 해요.\r\nDiễn vai.', 'Diễn vai', '역할 연기', 120, NULL),
(1139, '케이스 스터디를 분석해요.\r\nPhân tích nghiên cứu tình huống.', 'Nghiên cứu tình huống', '케이스 스터디', 120, NULL),
(1140, '문제 해결 과정을 실습해요.\r\nThực hành quy trình giải quyết vấn đề.', 'Quy trình giải quyết vấn đề', '문제 해결 과정', 120, NULL),
(1141, '의사결정을 연습해요.\r\nLuyện tập ra quyết định.', 'Ra quyết định', '의사결정', 120, NULL),
(1142, '실무 경험을 쌓아요.\r\nTích lũy kinh nghiệm thực tế.', 'Kinh nghiệm thực tế', '실무 경험', 120, NULL),
(1143, '전략적 사고를 기워요.\r\nPhát triển tư duy chiến lược.', 'Tư duy chiến lược', '전략적 사고', 120, NULL),
(1144, '창의적 해결책을 모색해요.\r\nTìm kiếm giải pháp sáng tạo.', 'Giải pháp sáng tạo', '창의적 해결책', 120, NULL),
(1145, '협업 능력을 기워요.\r\nPhát triển khả năng hợp tác.', 'Khả năng hợp tác', '협업 능력', 120, NULL),
(1146, '종합적 분석을 실시해요.\r\nThực hiện phân tích tổng hợp.', 'Phân tích tổng hợp', '종합적 분석', 121, NULL),
(1147, '다차원적 접근을 해요.\r\nTiếp cận đa chiều.', 'Tiếp cận đa chiều', '다차원적 접근', 121, NULL),
(1148, '심층적 이해를 추구해요.\r\nTheo đuổi hiểu biết sâu sắc.', 'Hiểu biết sâu sắc', '심층적 이해', 121, NULL),
(1149, '통찰력을 발휘해요.\r\nPhát huy sự thấu hiểu.', 'Sự thấu hiểu', '통찰력', 121, NULL),
(1150, '시사점을 도출해요.\r\nRút ra ý nghĩa thời sự.', 'Ý nghĩa thời sự', '시사점', 121, NULL),
(1151, '미래를 전망해요.\r\nTiền đoán tương lai.', 'Tiền đoán tương lai', '미래 전망', 121, NULL),
(1152, '학문적 성취를 이뤄요.\r\nĐạt thành tựu học thuật.', 'Thành tựu học thuật', '학문적 성취', 121, NULL),
(1153, '지식을 종합해요.\r\nTổng hợp kiến thức.', 'Tổng hợp kiến thức', '지식 종합', 121, NULL),
(1154, '전문가적 시각을 가져요.\r\nCó cái nhìn chuyên gia.', 'Cái nhìn chuyên gia', '전문가적 시각', 121, NULL),
(1155, '한국어 숙달을 완성해요.\r\nHoàn thành sự thành thạo tiếng Hàn.', 'Sự thành thạo tiếng Hàn', '한국어 숙달', 121, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer_choice`
--
ALTER TABLE `answer_choice`
  ADD PRIMARY KEY (`choice_id`),
  ADD KEY `FK52f8t17a6qit17433maoaw4ol` (`question_id`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`conversation_id`),
  ADD KEY `FKr0g61dr5clacujhjpauv3ouea` (`user_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `FKqgkanrr90j46564w4ww63jcna` (`conversation_id`);

--
-- Indexes for table `document_item`
--
ALTER TABLE `document_item`
  ADD PRIMARY KEY (`word_id`),
  ADD KEY `FK98826lx14gd10hvrbe3sjdcl3` (`list_id`);

--
-- Indexes for table `document_list`
--
ALTER TABLE `document_list`
  ADD PRIMARY KEY (`list_id`),
  ADD KEY `FKey7yc0ijhb3ifn0m4d77pmorl` (`user_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`);

--
-- Indexes for table `exam_attempt`
--
ALTER TABLE `exam_attempt`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `FKn1sj3wwcaqpmn5t43fukvnpwv` (`exam_id`),
  ADD KEY `FKso40ml39gub4jmj6r68osab4y` (`user_id`);

--
-- Indexes for table `exam_section`
--
ALTER TABLE `exam_section`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `FKrfqtgea5pdpgixy7m99tirtyg` (`exam_id`);

--
-- Indexes for table `exercise`
--
ALTER TABLE `exercise`
  ADD PRIMARY KEY (`exerciseid`),
  ADD KEY `FKjgvs6qq6doe10q3dh6p4j9lkn` (`lessonid`);

--
-- Indexes for table `grammartheory`
--
ALTER TABLE `grammartheory`
  ADD PRIMARY KEY (`grammarid`),
  ADD KEY `FKdet1depb7iv81rtu76hvlaif2` (`lessonid`);

--
-- Indexes for table `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`lessonid`),
  ADD KEY `FKj82mby3xn1ki1dub18eppbask` (`levelid`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`levelid`);

--
-- Indexes for table `levelxp`
--
ALTER TABLE `levelxp`
  ADD PRIMARY KEY (`level_number`);

--
-- Indexes for table `multiplechoicequestion`
--
ALTER TABLE `multiplechoicequestion`
  ADD PRIMARY KEY (`questionid`),
  ADD KEY `FKt4er9neq541iob9iptaknpb71` (`exerciseid`);

--
-- Indexes for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_g0guo4k8krgpwuagos61oc06j` (`token`),
  ADD KEY `FK5lwtbncug84d4ero33v3cfxvl` (`user_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `FKfp56tp4dbxikbk4wm0ficnfli` (`section_id`);

--
-- Indexes for table `sentencerewritingquestion`
--
ALTER TABLE `sentencerewritingquestion`
  ADD PRIMARY KEY (`questionid`),
  ADD KEY `FK96w6otsscefjv8kg6fsc241l0` (`exerciseid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `userexerciseresult`
--
ALTER TABLE `userexerciseresult`
  ADD PRIMARY KEY (`resultid`),
  ADD KEY `FKpgyxssss23dkht1kac1gbnej2` (`exerciseid`),
  ADD KEY `FKc4wqwyy63ofrr01auyi4qdh9p` (`userid`);

--
-- Indexes for table `userxp`
--
ALTER TABLE `userxp`
  ADD PRIMARY KEY (`userxpid`),
  ADD KEY `FKf441068pndormntgvsu2c9cgn` (`userid`);

--
-- Indexes for table `user_answer`
--
ALTER TABLE `user_answer`
  ADD PRIMARY KEY (`user_answer_id`),
  ADD KEY `FKs3pi8x1n2hukou4181t9qi2x1` (`attempt_id`),
  ADD KEY `FKtep61qpu1yvjg0kn7mjmk9frh` (`choice_id`),
  ADD KEY `FKpsk90eok3ounaet92hku3gny1` (`question_id`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `FKjksjqfbc2ujtq8al1onq6cfg7` (`lessonid`),
  ADD KEY `FKegc76uwcakdiv2vf6jituvlnv` (`userid`);

--
-- Indexes for table `vocabularytheory`
--
ALTER TABLE `vocabularytheory`
  ADD PRIMARY KEY (`vocabid`),
  ADD KEY `FK9fpm9u5pl4d3hoov7cbltkwrx` (`lessonid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer_choice`
--
ALTER TABLE `answer_choice`
  MODIFY `choice_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2253;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `conversation_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `document_item`
--
ALTER TABLE `document_item`
  MODIFY `word_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_list`
--
ALTER TABLE `document_list`
  MODIFY `list_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `exam_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `exam_attempt`
--
ALTER TABLE `exam_attempt`
  MODIFY `attempt_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `exam_section`
--
ALTER TABLE `exam_section`
  MODIFY `section_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exercise`
--
ALTER TABLE `exercise`
  MODIFY `exerciseid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `grammartheory`
--
ALTER TABLE `grammartheory`
  MODIFY `grammarid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `lesson`
--
ALTER TABLE `lesson`
  MODIFY `lessonid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `levelid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `multiplechoicequestion`
--
ALTER TABLE `multiplechoicequestion`
  MODIFY `questionid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `sentencerewritingquestion`
--
ALTER TABLE `sentencerewritingquestion`
  MODIFY `questionid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `userexerciseresult`
--
ALTER TABLE `userexerciseresult`
  MODIFY `resultid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `userxp`
--
ALTER TABLE `userxp`
  MODIFY `userxpid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_answer`
--
ALTER TABLE `user_answer`
  MODIFY `user_answer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `progress_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `vocabularytheory`
--
ALTER TABLE `vocabularytheory`
  MODIFY `vocabid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1156;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer_choice`
--
ALTER TABLE `answer_choice`
  ADD CONSTRAINT `FK52f8t17a6qit17433maoaw4ol` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`);

--
-- Constraints for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD CONSTRAINT `FKr0g61dr5clacujhjpauv3ouea` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`);

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `FKqgkanrr90j46564w4ww63jcna` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`conversation_id`);

--
-- Constraints for table `document_item`
--
ALTER TABLE `document_item`
  ADD CONSTRAINT `FK98826lx14gd10hvrbe3sjdcl3` FOREIGN KEY (`list_id`) REFERENCES `document_list` (`list_id`);

--
-- Constraints for table `document_list`
--
ALTER TABLE `document_list`
  ADD CONSTRAINT `FKey7yc0ijhb3ifn0m4d77pmorl` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`);

--
-- Constraints for table `exam_attempt`
--
ALTER TABLE `exam_attempt`
  ADD CONSTRAINT `FKn1sj3wwcaqpmn5t43fukvnpwv` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `FKso40ml39gub4jmj6r68osab4y` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`);

--
-- Constraints for table `exam_section`
--
ALTER TABLE `exam_section`
  ADD CONSTRAINT `FKrfqtgea5pdpgixy7m99tirtyg` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `exercise`
--
ALTER TABLE `exercise`
  ADD CONSTRAINT `FKjgvs6qq6doe10q3dh6p4j9lkn` FOREIGN KEY (`lessonid`) REFERENCES `lesson` (`lessonid`);

--
-- Constraints for table `grammartheory`
--
ALTER TABLE `grammartheory`
  ADD CONSTRAINT `FKdet1depb7iv81rtu76hvlaif2` FOREIGN KEY (`lessonid`) REFERENCES `lesson` (`lessonid`);

--
-- Constraints for table `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `FKj82mby3xn1ki1dub18eppbask` FOREIGN KEY (`levelid`) REFERENCES `level` (`levelid`);

--
-- Constraints for table `multiplechoicequestion`
--
ALTER TABLE `multiplechoicequestion`
  ADD CONSTRAINT `FKt4er9neq541iob9iptaknpb71` FOREIGN KEY (`exerciseid`) REFERENCES `exercise` (`exerciseid`);

--
-- Constraints for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD CONSTRAINT `FK5lwtbncug84d4ero33v3cfxvl` FOREIGN KEY (`user_id`) REFERENCES `user` (`userid`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `FKfp56tp4dbxikbk4wm0ficnfli` FOREIGN KEY (`section_id`) REFERENCES `exam_section` (`section_id`);

--
-- Constraints for table `sentencerewritingquestion`
--
ALTER TABLE `sentencerewritingquestion`
  ADD CONSTRAINT `FK96w6otsscefjv8kg6fsc241l0` FOREIGN KEY (`exerciseid`) REFERENCES `exercise` (`exerciseid`);

--
-- Constraints for table `userexerciseresult`
--
ALTER TABLE `userexerciseresult`
  ADD CONSTRAINT `FKc4wqwyy63ofrr01auyi4qdh9p` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  ADD CONSTRAINT `FKpgyxssss23dkht1kac1gbnej2` FOREIGN KEY (`exerciseid`) REFERENCES `exercise` (`exerciseid`);

--
-- Constraints for table `userxp`
--
ALTER TABLE `userxp`
  ADD CONSTRAINT `FKf441068pndormntgvsu2c9cgn` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`);

--
-- Constraints for table `user_answer`
--
ALTER TABLE `user_answer`
  ADD CONSTRAINT `FKpsk90eok3ounaet92hku3gny1` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  ADD CONSTRAINT `FKs3pi8x1n2hukou4181t9qi2x1` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempt` (`attempt_id`),
  ADD CONSTRAINT `FKtep61qpu1yvjg0kn7mjmk9frh` FOREIGN KEY (`choice_id`) REFERENCES `answer_choice` (`choice_id`);

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `FKegc76uwcakdiv2vf6jituvlnv` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  ADD CONSTRAINT `FKjksjqfbc2ujtq8al1onq6cfg7` FOREIGN KEY (`lessonid`) REFERENCES `lesson` (`lessonid`);

--
-- Constraints for table `vocabularytheory`
--
ALTER TABLE `vocabularytheory`
  ADD CONSTRAINT `FK9fpm9u5pl4d3hoov7cbltkwrx` FOREIGN KEY (`lessonid`) REFERENCES `lesson` (`lessonid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
