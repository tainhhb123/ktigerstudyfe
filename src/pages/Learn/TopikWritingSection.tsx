import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Save, Send } from 'lucide-react';
import TopikWritingGrid from '../../components/exam/TopikWritingGrid';

// Mock data for TOPIK II Writing questions
const writingQuestions = [
  {
    questionNumber: 53,
    minCharacters: 200,
    maxCharacters: 300,
    prompt: `다음을 읽고 ㉠과 ㉡에 들어갈 말을 각각 한 문장으로 쓰십시오.

요즘 사람들은 건강을 위해 운동을 많이 합니다. 운동은 몸에 좋을 뿐만 아니라 ㉠ _________________. 그러나 너무 무리하게 운동을 하면 ㉡ _________________. 그래서 자신의 체력에 맞게 적당히 운동하는 것이 중요합니다.`,
    koreanTitle: '짧은 글 쓰기',
    vietnameseTitle: 'Viết đoạn văn ngắn',
    description: 'Đọc đoạn văn và viết câu phù hợp để điền vào chỗ trống ㉠ và ㉡'
  },
  {
    questionNumber: 54,
    minCharacters: 600,
    maxCharacters: 700,
    prompt: `다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.

현대 사회에서 SNS(소셜 네트워크 서비스)의 사용이 크게 증가하고 있습니다. SNS는 사람들의 생활에 많은 영향을 미치고 있는데, 긍정적인 면과 부정적인 면이 모두 있습니다.

'SNS가 현대인의 생활에 미치는 영향'에 대해 아래의 내용을 중심으로 자신의 생각을 쓰십시오.

• SNS 사용의 긍정적인 영향은 무엇입니까?
• SNS 사용의 부정적인 영향은 무엇입니까?  
• SNS를 올바르게 사용하려면 어떻게 해야 합니까?`,
    koreanTitle: '긴 글 쓰기',
    vietnameseTitle: 'Viết bài luận',
    description: 'Viết bài luận 600-700 chữ về chủ đề cho sẵn'
  }
];

export default function TopikWritingSection() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    53: '',
    54: ''
  });
  const [timeRemaining, setTimeRemaining] = useState(50 * 60); // 50 phút cho phần viết
  const [isSaving, setIsSaving] = useState(false);

  const question = writingQuestions[currentQuestion];

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Đã lưu bài viết!');
  };

  const handleSubmit = async () => {
    const confirm = window.confirm('Bạn có chắc muốn nộp bài? Không thể sửa đổi sau khi nộp.');
    if (confirm) {
      // TODO: Implement submit to backend
      alert('Đã nộp bài thành công!');
      navigate('/learn/topik');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const getProgress = (qNum: number) => {
    const answer = answers[qNum] || '';
    const q = writingQuestions.find(w => w.questionNumber === qNum)!;
    const percentage = Math.min((answer.length / q.minCharacters) * 100, 100);
    return percentage;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #BDBDBD' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg transition-all"
                style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#333333' }}>
                  TOPIK II - 쓰기 (Viết)
                </h1>
                <p className="text-sm" style={{ color: '#666666' }}>
                  Câu 53-54 • Phần thi viết
                </p>
              </div>
            </div>

            {/* Center - Timer */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: timeRemaining < 300 ? '#FFEBEE' : '#E8F5E9' }}
            >
              <Clock className="w-4 h-4" style={{ color: timeRemaining < 300 ? '#FF5252' : '#4CAF50' }} />
              <span 
                className="font-mono font-bold"
                style={{ color: timeRemaining < 300 ? '#FF5252' : '#4CAF50' }}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#E0E0E0', color: '#333333' }}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{ backgroundColor: '#FF6B35' }}
              >
                <Send className="w-4 h-4" />
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <div 
              className="sticky top-24 rounded-2xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}
            >
              <h3 className="font-bold mb-4" style={{ color: '#333333' }}>
                📝 Danh sách câu hỏi
              </h3>
              
              <div className="space-y-3">
                {writingQuestions.map((q, index) => (
                  <button
                    key={q.questionNumber}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      currentQuestion === index ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: currentQuestion === index ? '#FFE8DC' : '#FAFAFA',
                      borderColor: currentQuestion === index ? '#FF6B35' : '#E0E0E0',
                      border: '1px solid'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold" style={{ color: '#333333' }}>
                        Câu {q.questionNumber}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: getProgress(q.questionNumber) >= 100 ? '#E8F5E9' : '#FFF8F0',
                          color: getProgress(q.questionNumber) >= 100 ? '#4CAF50' : '#FF6B35'
                        }}
                      >
                        {q.maxCharacters}자
                      </span>
                    </div>
                    <div className="text-xs mb-2" style={{ color: '#666666' }}>
                      {q.vietnameseTitle}
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${getProgress(q.questionNumber)}%`,
                          backgroundColor: getProgress(q.questionNumber) >= 100 ? '#4CAF50' : '#FF6B35'
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-right" style={{ color: '#999999' }}>
                      {(answers[q.questionNumber] || '').length}/{q.minCharacters}자
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div 
                className="mt-4 p-3 rounded-xl"
                style={{ backgroundColor: '#FFF8F0', border: '1px solid #FFE8DC' }}
              >
                <div className="text-sm" style={{ color: '#666666' }}>
                  <div className="flex justify-between mb-1">
                    <span>Tổng điểm:</span>
                    <span className="font-bold" style={{ color: '#FF6B35' }}>80 điểm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Câu 53:</span>
                    <span>30 điểm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Câu 54:</span>
                    <span>50 điểm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Writing Area */}
          <div className="lg:col-span-3">
            <TopikWritingGrid
              questionNumber={question.questionNumber}
              maxCharacters={question.maxCharacters}
              minCharacters={question.minCharacters}
              prompt={question.prompt}
              value={answers[question.questionNumber] || ''}
              onChange={(value) => handleAnswerChange(question.questionNumber, value)}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: '#E0E0E0', color: '#333333' }}
              >
                ← Câu trước
              </button>
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(writingQuestions.length - 1, prev + 1))}
                disabled={currentQuestion === writingQuestions.length - 1}
                className="px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Câu tiếp →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
