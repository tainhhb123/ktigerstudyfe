import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hoHanImage from "../../assets/hoHan.png";
// Mock data cho placement test
const placementQuestions = [
    {
        id: 1,
        type: "multiple_choice",
        question: "나는 주말에는 보통 영화를 (...) 운동을 한다.",
        options: ["A. 보지만   ", "B. 보거나   ", "C. 보려고   ", "D. 보더니"],
        correct: 2,
        level: 1,
        instruction: "( )에 들어갈 가장 알맞은 것을 고르십시오."
    },
    {
        id: 2,
        type: "multiple_choice",
        question: "똑똑하게 모으자!<br />매일매일 쌓여 가는 행복한 미래",
        options: [
            "A. 병원 ",  
            "B. 은행 ",
            "C. 여행사 ",
            "D. 체육관",
        ],
        correct: 1,
        level: 1,
        instruction: "다음은 무엇에 대한 글인지 고르십시오."
    },
        {
        id: 3,
        type: "multiple_choice",
        question: "지난 13일 인주경찰서에 편지 한 통이 배달되었다.편지를 보낸 사람은 지난달 인주시를 방문했다가 지갑을 잃어버린 외국인 관광객 장 모 씨였다. 장 씨는 말이 통하지 않아 지갑을 찾는 데 어려움을 겪었다.그때 한 경찰이 사전과 몸짓을 이용해 장 씨와 이야기하며 잃어버린 지갑을 찾는 데 도움을 주었다.이에 장 씨가 고마움을 담은 감사 편지를 보낸 것이다.",
        options: [
            "A. 병원 ",  
            "B. 은행 ",
            "C. 여행사 ",
            "D. 체육관",
        ],
        correct: 1,
        level: 1,
        instruction: "다음 글 또는 그래프의 내용과 같은 것을 고르십시오."
    },
    {
        id: 4,
        type: "multiple_choice",
        question: "(가)개와 고양이는 사이가 나쁜 것으로 유명하다. <br/> (나)개가 앞발을 드는 행동은 함께 놀고 싶다는 의미이다. <br/> (다)그런데 고양이는 이런 행동을 공격하는 것으로 오해하는 것이다. <br/> (라)둘 사이가 안 좋은 이유는 표현을 서로 다르게 받아들이기 때문이다.",
        options: [
            "A. (가)-(라)-(나)-(다)",  
            "B. (가)-(나)-(라)-(다)  ",
            "C. (나)-(다)-(가)-(라)",
            "D. (나)-(가)-(다)-(라)",
        ],
        correct: 1,
        level: 1,
        instruction: "다음을 순서대로 맞게 배열한 것을 고르십시오."
    },


    {
        id: 5,
        type: "multiple_choice",
        question: "(가)시대가 변하면서 회식 문화가 바뀌고 있는 것이다. <br/> (나)직장에서는 좋은 업무 분위기를 위해서 회식을 한다. <br/> (다)예전에는 직장에서 회식을 할 때 주로 술을 많이 마셨다. <br/> (라)그러나 요즘에는 회식 대신에 공연을 관람하거나 맛집을 탐방하는 경우가 늘고 있다.",
        options: [
            "A. (나)-(다)-(가)-(라)",  
            "B. (나)-(다)-(라)-(가) ",
            "C. (다)-(가)-(나)-(라)",
            "D. (다)-(나)-(라)-(가)",
        ],
        correct: 1,
        level: 1,
        instruction: "다음을 순서대로 맞게 배열한 것을 고르십시오."
    },
        {
        id: 6,
        type: "multiple_choice",
        question: "소비 심리 ‘봄바람’,백화점 매출 기지개",
        options: [
            "A. 소비자들의 구매 욕구가 살아나 백화점 매출이 늘어나고 있다. ", 
            "B. 날씨의 영향으로 백화점에서 물건을 구입하는 사람들이 많아졌다 ",
            "C. 백화점에서 매출을 늘리기 위해 행사를 하자 사람들이 모여들었다.",
            "D. 소비자들의 심리를 반영한 백화점의 매출 전략이 호응을 얻고 있다.",
        ],
        correct: 1,
        level: 1,
        instruction: "다음 신문 기사의 제목을 가장 잘 설명한 것을 고르십시오."
    },
        {
        id: 7,
        type: "multiple_choice",
        question: "한 연구에 따르면 과거에 비해 요즘 사람들의 손톱이 더 빨리 자란다고 한다.80년 전 사람들은 손톱이 한 달에 3mm 정도 자랐지만 최근에는 그보다 길게 3.5mm 정도 자란다는 것이다.손톱 주변을 ( ) 세포 활동이 활발해져 손톱이 더 빨리 자란다.연구팀은 최근 컴퓨터나 휴대전화의 자판을 누르는 등 손가락 끝을 사용하는 일이 많아지면서 손톱이 자라는 것에 영향을 준 것으로 보았다.",
        options: [
            "A. 깨끗하게 관리하면",  
            "B. 감싸서 보호해 주면  ",
            "C. 자극하는 활동을 하면",
            "D. 건조하지 않게 해 주면",
        ],
        correct: 1,
        level: 1,
        instruction: "다음을 읽고 (... )에 들어갈 내용으로 가장 알맞은 것을 고르십시오.(각 2점)"
    },
        {
        id: 8,
        type: "multiple_choice",
        question: "물감은 섞거나 덧칠할수록 색이 탁해진다.그래서 19세기 화가들은 점을 찍어색을 표현하는 점묘법을 생각해 냈다.이 기법은 예를 들어 빨간색과 파란 색의 작은 점을 촘촘히 찍어서,조금 떨어진 곳에서 볼 때 점들이 섞여 보라색 으로 보이도록 한 것이다.이렇게 표현한 색은 물감을 섞어서 만든 색보다 훨씬 더 맑고 부드러운 느낌을 준다.이 때문에 점묘법은 회화의 대표적인 표현 기법으로 자리 잡게 되었고 현대 화가들도 즐겨 사용하고 있다.",
        options: [
            "A. 이 기법으로 그림을 그리면 그림이 부드럽게 느껴진다.",  
            "B. 이 기법은 19세기 이후에는 화가들의 외면을 받게 되었다. ",
            "C. 이 기법은 가까운 곳에서 봐야 색이 섞여 보이는 효과가 있다.",
            "D. 이 기법으로 그림을 그릴 때는 넓은 간격으로 점을 찍어야 한다.",
        ],
        correct: 1,
        level: 1,
        instruction: "다음을 읽고 내용이 같은 것을 고르십시오."
    },
//listreningnv
    {
        id: 9,
        type: "listening",
        question: "Nghe và chọn từ đúng:",
        audioUrl: "https://res.cloudinary.com/di6d1g736/video/upload/v1751510273/009_mp3cut.net_nytnm7.mp3",
        options: [
            "A. 화 씨는 회사원입니까?",
            "B. 화 씨는 회사원입니다",
            "C. 화 씨는 교사입니까?",
            "D. 화 씨는 교사입니다",
        ],
        correct: 1,
        level: 3,
        instruction: "다음 음성을 듣고 맞는 단어를 고르십시오. / Nghe âm thanh và chọn từ đúng."
    },
    
];

const levelRecommendations = [
    {
        level: 1,
        title: "Cấp độ 1 - Sơ cấp",
        description: "Học bảng chữ cái Hangeul, từ vựng cơ bản, câu chào hỏi",
        color: "bg-green-500",
        icon: "🌱",
    },
    {
        level: 2,
        title: "Cấp độ 2 - Sơ cấp nâng cao",
        description: "Ngữ pháp cơ bản, số đếm, thời gian, gia đình",
        color: "bg-blue-500",
        icon: "📚",
    },
    {
        level: 3,
        title: "Cấp độ 3 - Trung cấp",
        description: "Hoạt động hằng ngày, mua sắm, giao tiếp cơ bản",
        color: "bg-yellow-500",
        icon: "🗣️",
    },
    {
        level: 4,
        title: "Cấp độ 4 - Trung cấp nâng cao",
        description: "Diễn tả cảm xúc, ý kiến, kể chuyện quá khứ",
        color: "bg-purple-500",
        icon: "💭",
    },
    {
        level: 5,
        title: "Cấp độ 5 - Trung cao cấp",
        description: "Thảo luận chủ đề phức tạp, đọc hiểu văn bản",
        color: "bg-red-500",
        icon: "🎯",
    },
    {
        level: 6,
        title: "Cấp độ 6 - Cao cấp",
        description: "Ngữ pháp nâng cao, viết luận, giao tiếp thành thạo",
        color: "bg-indigo-500",
        icon: "🏆",
    },
];

export default function LearnHome() {
    const [currentStep, setCurrentStep] = useState<
        "intro" | "test" | "result"
    >("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [testResult, setTestResult] = useState<
        {
            score: number;
            recommendedLevel: number;
            correctAnswers: number;
        } | null
    >(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();

    const userId = Number(localStorage.getItem("userId"));

    // ✅ Tính toán kết quả test - TẤT CẢ CÂU ĐỀU 10 ĐIỂM
    const calculateResult = () => {
        let correctAnswers = 0;

        // Đếm số câu đúng
        answers.forEach((answer, index) => {
            if (answer === placementQuestions[index].correct) {
                correctAnswers++;
            }
        });

        // Tính điểm: mỗi câu đúng = 10 điểm
        const score = correctAnswers * 10;

      
        let recommendedLevel = 1;
        if (correctAnswers >= 9) recommendedLevel = 6;     
        else if (correctAnswers >= 8) recommendedLevel = 5; 
        else if (correctAnswers >= 7) recommendedLevel = 4; 
        else if (correctAnswers >= 6) recommendedLevel = 3; 
        else if (correctAnswers >= 4) recommendedLevel = 2; 
        else recommendedLevel = 1;     

        return { score, recommendedLevel, correctAnswers };
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);

        if (currentQuestion < placementQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Hoàn thành test
            const result = calculateResult();
            setTestResult(result);
            setCurrentStep("result");
        }
    };

    const playAudio = async (audioUrl: string) => {
        try {
            setIsPlaying(true);
            const audio = new Audio(audioUrl);
            audio.play();
            audio.onended = () => setIsPlaying(false);
        } catch (error) {
            console.log("Audio not available in demo");
            setIsPlaying(false);
        }
    };

    const startLearning = (level: number) => {
        // Chuyển đến trang học theo cấp độ
        navigate(`/learn/lesson?levelId=${level}`);
    };

    const retakeTest = () => {
        setCurrentStep("test");
        setCurrentQuestion(0);
        setAnswers([]);
        setTestResult(null);
    };

    // Intro Screen
    if (currentStep === "intro") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
                >
                    <div className="mb-6">
                        <div className="mb-4">
                            <img 
                            src={hoHanImage}
                            className="w-28 h-28 mx-auto object-contain rounded-full shadow-lg"
                            />

                           
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Chào mừng đến với KTiger Study
                        </h1>
                        <p className="text-lg text-gray-600">
                            Hành trình học tiếng Hàn của bạn bắt đầu từ đây!
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                        <h2 className="text-2xl font-bold mb-3">🎯 Kiểm tra trình độ</h2>
                        <p className="text-blue-100 mb-4">
                            Làm 9 câu hỏi nhanh để chúng tôi đánh giá trình độ và gợi ý cấp độ
                            học phù hợp nhất cho bạn
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <span>⏱️ Thời gian: ~3 phút</span>
                            <span>•</span>
                            <span>📝 9 câu hỏi</span>
                   
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setCurrentStep("test")}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            🚀 Bắt đầu kiểm tra
                        </button>
                    
                    </div>
                </motion.div>
            </div>
        );
    }

    // Test Screen
    if (currentStep === "test") {
        const question = placementQuestions[currentQuestion];

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8"
                >
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                Câu {currentQuestion + 1} / {placementQuestions.length}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                                Cấp độ {question.level}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        ((currentQuestion + 1) / placementQuestions.length) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* ✅ Instruction Box - Giống như TOPIK */}
                  {/* ✅ Instruction - Text bình thường */}
                <div className="mb-6">
                    <p className="text-gray-700 text-xl font-bold  leading-relaxed">
                        {question.instruction}
                    </p>
                </div>

                    {/* Question */}
                    <div className="mb-8">
                        {/* <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {currentQuestion + 1}
                            </div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div> */}
                        
                        <h2 
                            className="text-lg text-gray-800 mb-4"
                            dangerouslySetInnerHTML={{ __html: question.question }}
                        />

                        {/* Audio Player for listening questions */}
                        {question.type === "listening" && (
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                                        🎧
                                    </div>
                                    <span className="font-medium text-yellow-800">Phần nghe</span>
                                </div>
                                
                                {/* Audio player giống MultipleChoiceQuestion */}
                                <audio
                                    controls
                                    className="w-full rounded-md"
                                    style={{ display: "block", width: "100%" }}
                                >
                                    <source src={question.audioUrl} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ audio.
                                </audio>
                                
                                <p className="text-sm text-gray-600 mt-2">
                                    💡 Bạn có thể nghe lại nhiều lần bằng cách sử dụng thanh điều khiển
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group flex items-center gap-3"
                            >
                                <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold group-hover:border-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="font-medium text-gray-800 group-hover:text-blue-600">
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tips */}
                    {/* <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 text-center">
                            💡 <strong>Mẹo:</strong> Đọc kỹ hướng dẫn trước khi chọn đáp án
                        </p>
                    </div> */}
                </motion.div>
            </div>
        );
    }

    // Result Screen
    if (currentStep === "result" && testResult) {
        const recommendation = levelRecommendations[testResult.recommendedLevel - 1];

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8"
                >
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Kết quả kiểm tra trình độ
                        </h1>
                        <p className="text-lg text-gray-600">
                            Bạn đã hoàn thành bài kiểm tra! Đây là kết quả và đề xuất của chúng tôi
                        </p>
                    </div>

                    {/* Score Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-3xl font-bold">{testResult.score}</div>
                                <div className="text-blue-100">Điểm số</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">
                                    {testResult.correctAnswers}/{placementQuestions.length}
                                </div>
                                <div className="text-blue-100">Câu đúng</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">
                                    {Math.round(
                                        (testResult.correctAnswers / placementQuestions.length) *
                                            100
                                    )}
                                    %
                                </div>
                                <div className="text-blue-100">Tỷ lệ đúng</div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Level */}
                    <div
                        className={`${recommendation.color} text-white p-6 rounded-2xl mb-6`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-4xl">{recommendation.icon}</div>
                            <div>
                                <h2 className="text-2xl font-bold">{recommendation.title}</h2>
                                <p className="text-white/90">
                                    {recommendation.description}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl">
                            <p className="text-white/90 text-sm">
                                💡 <strong>Gợi ý:</strong> Bạn nên bắt đầu học từ cấp độ này để có
                                nền tảng vững chắc và tiến bộ một cách hiệu quả nhất.
                            </p>
                        </div>
                    </div>

                    {/* All Levels Overview */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            🗺️ Tổng quan tất cả cấp độ
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {levelRecommendations.map((level, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        level.level === testResult.recommendedLevel
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => startLearning(level.level)}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{level.icon}</span>
                                        <span className="font-semibold text-gray-800">
                                            Cấp {level.level}
                                        </span>
                                        {level.level === testResult.recommendedLevel && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                Đề xuất
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {level.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => startLearning(testResult.recommendedLevel)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            🚀 Bắt đầu học cấp {testResult.recommendedLevel}
                        </button>
                        <button
                            onClick={retakeTest}
                            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
                        >
                            🔄 Làm lại test
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}