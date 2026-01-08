import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { QuestionType, QuestionResponse } from '../../../types/exam';
import { questionApi, answerChoiceApi } from '../../../services/ExamApi';

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = "cloudtinsama";
const CLOUDINARY_CLOUD_NAME = "do0k0jkej";

interface AnswerChoiceForm {
  choiceId?: number;
  choiceLabel: string;
  choiceText: string;
  isCorrect: boolean;
}

const QuestionForm = () => {
  const navigate = useNavigate();
  const { sectionId, questionId } = useParams<{ sectionId: string; questionId?: string }>();
  
  const isEditMode = !!questionId;

  // Form state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    questionNumber: 1,
    questionType: 'MCQ' as QuestionType,
    questionText: '',
    passageText: '',
    audioUrl: '',
    imageUrl: '',
    correctAnswer: '',
    points: 1,
    groupId: null as number | null,
  });

  const [answerChoices, setAnswerChoices] = useState<AnswerChoiceForm[]>([
    { choiceLabel: '①', choiceText: '', isCorrect: false },
    { choiceLabel: '②', choiceText: '', isCorrect: false },
    { choiceLabel: '③', choiceText: '', isCorrect: false },
    { choiceLabel: '④', choiceText: '', isCorrect: false },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing question data
  useEffect(() => {
    if (isEditMode) {
      fetchQuestionData();
    }
  }, [questionId]);

  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      const questionData = await questionApi.getQuestionById(Number(questionId));
      
      setFormData({
        questionNumber: questionData.questionNumber,
        questionType: questionData.questionType,
        questionText: questionData.questionText || '',
        passageText: questionData.passageText || '',
        audioUrl: questionData.audioUrl || '',
        imageUrl: questionData.imageUrl || '',
        correctAnswer: questionData.correctAnswer || '',
        points: questionData.points,
        groupId: questionData.groupId ?? null,
      });

      // Load answer choices if MCQ
      if (questionData.questionType === 'MCQ') {
        const choices = await answerChoiceApi.getChoicesByQuestion(Number(questionId));
        if (choices.length > 0) {
          setAnswerChoices(choices.map(c => ({
            choiceId: c.choiceId,
            choiceLabel: c.choiceLabel,
            choiceText: c.choiceText,
            isCorrect: c.isCorrect,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('Không thể tải dữ liệu câu hỏi');
      navigate(`/admin/sections/${sectionId}/questions`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    setFormData(prev => ({ ...prev, questionType: newType }));
    
    // Reset type-specific fields
    if (newType === 'MCQ') {
      setAnswerChoices([
        { choiceLabel: '①', choiceText: '', isCorrect: false },
        { choiceLabel: '②', choiceText: '', isCorrect: false },
        { choiceLabel: '③', choiceText: '', isCorrect: false },
        { choiceLabel: '④', choiceText: '', isCorrect: false },
      ]);
      setFormData(prev => ({ ...prev, correctAnswer: '' }));
    } else {
      setFormData(prev => ({ ...prev, correctAnswer: '' }));
    }
  };

  const handleChoiceChange = (index: number, field: keyof AnswerChoiceForm, value: any) => {
    const newChoices = [...answerChoices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    
    // If marking as correct, unmark others
    if (field === 'isCorrect' && value === true) {
      newChoices.forEach((choice, i) => {
        if (i !== index) choice.isCorrect = false;
      });
    }
    
    setAnswerChoices(newChoices);
  };

  const addAnswerChoice = () => {
    const labels = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
    const nextLabel = labels[answerChoices.length] || `⑨`;
    setAnswerChoices([...answerChoices, { choiceLabel: nextLabel, choiceText: '', isCorrect: false }]);
  };

  const removeAnswerChoice = (index: number) => {
    if (answerChoices.length <= 2) {
      alert('Phải có ít nhất 2 đáp án');
      return;
    }
    setAnswerChoices(answerChoices.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error: ${response.status}`);
      }

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Upload thất bại - không có URL trả về');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File quá lớn! Tối đa 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      alert('Tải ảnh lên thành công!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionNumber || formData.questionNumber < 1) {
      newErrors.questionNumber = 'Số câu hỏi không hợp lệ';
    }

    if (!formData.questionText.trim() && !formData.passageText.trim()) {
      newErrors.questionText = 'Phải có ít nhất nội dung câu hỏi hoặc đoạn văn';
    }

    if (formData.points < 0.5 || formData.points > 10) {
      newErrors.points = 'Điểm phải từ 0.5 đến 10';
    }

    // MCQ specific validation
    if (formData.questionType === 'MCQ') {
      const hasCorrect = answerChoices.some(c => c.isCorrect);
      if (!hasCorrect) {
        newErrors.answerChoices = 'Phải đánh dấu đáp án đúng';
      }
      
      const hasEmptyChoice = answerChoices.some(c => !c.choiceText.trim());
      if (hasEmptyChoice) {
        newErrors.answerChoices = 'Tất cả đáp án phải có nội dung';
      }

      if (answerChoices.length < 2) {
        newErrors.answerChoices = 'Phải có ít nhất 2 đáp án';
      }
    }

    // SHORT specific validation
    if (formData.questionType === 'SHORT' && !formData.correctAnswer.trim()) {
      newErrors.correctAnswer = 'Phải nhập đáp án mẫu cho câu SHORT';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setSaving(true);

      const questionPayload = {
        ...formData,
        sectionId: Number(sectionId),
        questionText: formData.questionText || null,
        passageText: formData.passageText || null,
        audioUrl: formData.audioUrl || null,
        imageUrl: formData.imageUrl || null,
        correctAnswer: formData.questionType === 'SHORT' ? formData.correctAnswer : null,
      };

      let savedQuestion: QuestionResponse;

      if (isEditMode) {
        savedQuestion = await questionApi.updateQuestion(Number(questionId), questionPayload);
      } else {
        savedQuestion = await questionApi.createQuestion(questionPayload);
      }

      // Save answer choices if MCQ
      if (formData.questionType === 'MCQ') {
        // Delete old choices if editing
        if (isEditMode) {
          const existingChoices = await answerChoiceApi.getChoicesByQuestion(savedQuestion.questionId);
          await Promise.all(existingChoices.map(c => answerChoiceApi.deleteChoice(c.choiceId)));
        }

        // Create new choices
        await Promise.all(
          answerChoices.map(choice =>
            answerChoiceApi.createChoice({
              questionId: savedQuestion.questionId,
              choiceLabel: choice.choiceLabel,
              choiceText: choice.choiceText,
              isCorrect: choice.isCorrect,
            })
          )
        );
      }

      alert(isEditMode ? 'Cập nhật câu hỏi thành công!' : 'Tạo câu hỏi thành công!');
      navigate(`/admin/sections/${sectionId}/questions`);
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Không thể lưu câu hỏi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/sections/${sectionId}/questions`)}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all"
          style={{ color: '#666666', backgroundColor: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
            {isEditMode ? '✏️ Chỉnh sửa câu hỏi' : '➕ Tạo câu hỏi mới'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: showPreview ? '#E3F2FD' : '#FFFFFF', color: '#1976D2' }}
            >
              <Eye className="w-5 h-5" />
              {showPreview ? 'Đóng Preview' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#FF6B35' }}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Cập nhật' : 'Tạo câu hỏi'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>📋 Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Question Number */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Số câu hỏi <span style={{ color: '#FF5252' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.questionNumber}
                  onChange={(e) => handleInputChange('questionNumber', Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: errors.questionNumber ? '#FF5252' : '#BDBDBD', backgroundColor: '#FFF8F0' }}
                  min="1"
                />
                {errors.questionNumber && (
                  <p className="text-sm mt-1" style={{ color: '#FF5252' }}>{errors.questionNumber}</p>
                )}
              </div>

              {/* Question Type */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Loại câu hỏi <span style={{ color: '#FF5252' }}>*</span>
                </label>
                <select
                  value={formData.questionType}
                  onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                  className="w-full px-4 py-2 rounded-lg border-2 font-medium"
                  style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="SHORT">Short Answer</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Points */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Điểm số <span style={{ color: '#FF5252' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: errors.points ? '#FF5252' : '#BDBDBD', backgroundColor: '#FFF8F0' }}
                  step="0.5"
                  min="0.5"
                  max="10"
                />
                {errors.points && (
                  <p className="text-sm mt-1" style={{ color: '#FF5252' }}>{errors.points}</p>
                )}
              </div>

              {/* Group ID */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Group ID (tùy chọn)
                </label>
                <input
                  type="number"
                  value={formData.groupId || ''}
                  onChange={(e) => handleInputChange('groupId', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                  placeholder="Để trống nếu không nhóm"
                />
                <p className="text-xs mt-1" style={{ color: '#999999' }}>
                  Các câu cùng group dùng chung passage
                </p>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>📝 Nội dung câu hỏi</h2>
            
            {/* Passage Text */}
            <div className="mb-4">
              <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                Đoạn văn / Passage (tùy chọn)
              </label>
              <textarea
                value={formData.passageText}
                onChange={(e) => handleInputChange('passageText', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 font-mono"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                rows={6}
                placeholder="Nhập đoạn văn nếu có..."
              />
              <p className="text-xs mt-1" style={{ color: '#999999' }}>
                Đoạn văn sẽ hiển thị trước câu hỏi
              </p>
            </div>

            {/* Question Text */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                Câu hỏi <span style={{ color: '#FF5252' }}>*</span>
              </label>
              <textarea
                value={formData.questionText}
                onChange={(e) => handleInputChange('questionText', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ borderColor: errors.questionText ? '#FF5252' : '#BDBDBD', backgroundColor: '#FFF8F0' }}
                rows={4}
                placeholder="Nhập nội dung câu hỏi..."
              />
              {errors.questionText && (
                <p className="text-sm mt-1" style={{ color: '#FF5252' }}>{errors.questionText}</p>
              )}
            </div>
          </div>

          {/* Media URLs */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>🎧 Media & Tài liệu</h2>
            
            <div className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Image URL
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                    placeholder="https://example.com/image.jpg hoặc tải lên file"
                  />
                  
                  {/* Upload button */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer"
                           style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên Cloudinary'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    
                    {uploadingImage && (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin" 
                           style={{ borderColor: '#1976D2', borderTopColor: 'transparent' }}></div>
                    )}
                  </div>
                </div>

                {formData.imageUrl && (
                  <div className="mt-3 relative">
                    <div className="relative inline-block">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="max-h-40 rounded-lg border-2" 
                        style={{ borderColor: '#BDBDBD' }} 
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 rounded-full text-white transition-all"
                        style={{ backgroundColor: '#FF5252' }}
                        title="Xóa ảnh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Audio URL */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#666666' }}>
                  Audio URL
                </label>
                <input
                  type="text"
                  value={formData.audioUrl}
                  onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                  placeholder="https://example.com/audio.mp3"
                />
                {formData.audioUrl && (
                  <div className="mt-2">
                    <audio controls className="w-full">
                      <source src={formData.audioUrl} />
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MCQ Answer Choices */}
          {formData.questionType === 'MCQ' && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#333333' }}>
                  ✅ Đáp án (MCQ)
                </h2>
                <button
                  onClick={addAnswerChoice}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                >
                  <Plus className="w-4 h-4" />
                  Thêm đáp án
                </button>
              </div>

              {errors.answerChoices && (
                <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}>
                  <AlertCircle className="w-5 h-5" />
                  {errors.answerChoices}
                </div>
              )}

              <div className="space-y-3">
                {answerChoices.map((choice, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-lg border-2"
                    style={{ 
                      borderColor: choice.isCorrect ? '#4CAF50' : '#BDBDBD',
                      backgroundColor: choice.isCorrect ? '#E8F5E9' : '#FFF8F0'
                    }}
                  >
                    {/* Correct checkbox */}
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                      className="w-5 h-5"
                      title="Đánh dấu đáp án đúng"
                    />

                    {/* Label */}
                    <input
                      type="text"
                      value={choice.choiceLabel}
                      onChange={(e) => handleChoiceChange(index, 'choiceLabel', e.target.value)}
                      className="w-16 px-2 py-2 rounded border text-center font-bold"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                    />

                    {/* Choice text */}
                    <input
                      type="text"
                      value={choice.choiceText}
                      onChange={(e) => handleChoiceChange(index, 'choiceText', e.target.value)}
                      className="flex-1 px-3 py-2 rounded border"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                      placeholder="Nhập nội dung đáp án..."
                    />

                    {/* Delete button */}
                    {answerChoices.length > 2 && (
                      <button
                        onClick={() => removeAnswerChoice(index)}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                        title="Xóa đáp án"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Correct indicator */}
                    {choice.isCorrect && (
                      <CheckCircle className="w-5 h-5" style={{ color: '#4CAF50' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHORT Answer */}
          {formData.questionType === 'SHORT' && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#333333' }}>
                ✍️ Đáp án mẫu (SHORT)
              </h2>
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 font-medium"
                style={{ borderColor: errors.correctAnswer ? '#FF5252' : '#BDBDBD', backgroundColor: '#FFF8F0' }}
                placeholder="Nhập đáp án mẫu..."
              />
              {errors.correctAnswer && (
                <p className="text-sm mt-1" style={{ color: '#FF5252' }}>{errors.correctAnswer}</p>
              )}
              <p className="text-xs mt-2" style={{ color: '#999999' }}>
                Đáp án này sẽ dùng để so sánh với câu trả lời của học viên
              </p>
            </div>
          )}

          {/* ESSAY Note */}
          {formData.questionType === 'ESSAY' && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E8F5E9', border: '1px solid #4CAF50' }}>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#2E7D32' }}>
                📖 Câu ESSAY
              </h2>
              <p style={{ color: '#2E7D32' }}>
                Câu ESSAY không cần đáp án mẫu. Học viên sẽ nhập văn bản tự do và giáo viên chấm điểm thủ công.
              </p>
              {formData.questionNumber === 53 || formData.questionNumber === 54 ? (
                <p className="mt-2 font-semibold" style={{ color: '#1976D2' }}>
                  💡 Câu {formData.questionNumber} sẽ tự động dùng TopikWritingGrid (200-300 hoặc 600-700 ký tự)
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Sidebar - Tips & Preview */}
        <div className="space-y-6">
          {/* Type Info */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            <h3 className="font-bold mb-3" style={{ color: '#333333' }}>💡 Hướng dẫn</h3>
            
            {formData.questionType === 'MCQ' && (
              <div style={{ color: '#666666' }}>
                <p className="mb-2"><strong>Multiple Choice:</strong></p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Tối thiểu 2 đáp án</li>
                  <li>Đánh dấu 1 đáp án đúng</li>
                  <li>Dùng ① ② ③ ④ cho label</li>
                </ul>
              </div>
            )}

            {formData.questionType === 'SHORT' && (
              <div style={{ color: '#666666' }}>
                <p className="mb-2"><strong>Short Answer:</strong></p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Nhập đáp án mẫu</li>
                  <li>Học viên nhập văn bản ngắn</li>
                  <li>Hệ thống so sánh tự động</li>
                </ul>
              </div>
            )}

            {formData.questionType === 'ESSAY' && (
              <div style={{ color: '#666666' }}>
                <p className="mb-2"><strong>Essay:</strong></p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Không cần đáp án</li>
                  <li>Học viên viết tự do</li>
                  <li>Giáo viên chấm thủ công</li>
                  <li>Câu 53-54: dùng grid tự động</li>
                </ul>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFE8DC', border: '1px solid #FF6B35' }}>
            <h3 className="font-bold mb-3" style={{ color: '#FF6B35' }}>📊 Thống kê</h3>
            <div className="space-y-2 text-sm" style={{ color: '#666666' }}>
              <div className="flex justify-between">
                <span>Loại:</span>
                <span className="font-bold">{formData.questionType}</span>
              </div>
              <div className="flex justify-between">
                <span>Số câu:</span>
                <span className="font-bold">{formData.questionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Điểm:</span>
                <span className="font-bold">{formData.points}</span>
              </div>
              {formData.questionType === 'MCQ' && (
                <div className="flex justify-between">
                  <span>Số đáp án:</span>
                  <span className="font-bold">{answerChoices.length}</span>
                </div>
              )}
              {formData.groupId && (
                <div className="flex justify-between">
                  <span>Nhóm:</span>
                  <span className="font-bold">Group {formData.groupId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview Note */}
          {showPreview && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#E3F2FD', border: '1px solid #1976D2' }}>
              <h3 className="font-bold mb-2" style={{ color: '#1976D2' }}>👁️ Preview Mode</h3>
              <p className="text-sm" style={{ color: '#1565C0' }}>
                Xem trước giao diện hiển thị cho học viên khi thi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #1976D2' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1976D2' }}>👁️ Preview - Giao diện học viên</h2>
          
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFF8F0', border: '1px solid #BDBDBD' }}>
            {/* Question Number */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-4 py-2 rounded-lg font-bold text-lg" style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}>
                Câu {formData.questionNumber}
              </span>
              <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                {formData.points} điểm
              </span>
            </div>

            {/* Passage */}
            {formData.passageText && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
                <p className="whitespace-pre-wrap" style={{ color: '#333333' }}>{formData.passageText}</p>
              </div>
            )}

            {/* Media */}
            {formData.imageUrl && (
              <div className="mb-4">
                <img src={formData.imageUrl} alt="Question" className="max-h-60 rounded-lg border-2" style={{ borderColor: '#BDBDBD' }} />
              </div>
            )}

            {formData.audioUrl && (
              <div className="mb-4">
                <audio controls className="w-full">
                  <source src={formData.audioUrl} />
                </audio>
              </div>
            )}

            {/* Question Text */}
            <div className="mb-4">
              <p className="text-lg font-medium" style={{ color: '#333333' }}>{formData.questionText || '(Chưa có nội dung)'}</p>
            </div>

            {/* Answer Area */}
            {formData.questionType === 'MCQ' && (
              <div className="space-y-2">
                {answerChoices.map((choice, index) => (
                  <label 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all"
                    style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                  >
                    <input type="radio" name="preview-answer" className="w-5 h-5" />
                    <span className="font-bold" style={{ color: '#FF6B35' }}>{choice.choiceLabel}</span>
                    <span style={{ color: '#333333' }}>{choice.choiceText || '(Chưa có nội dung)'}</span>
                  </label>
                ))}
              </div>
            )}

            {formData.questionType === 'SHORT' && (
              <input
                type="text"
                placeholder="Nhập câu trả lời ngắn..."
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                disabled
              />
            )}

            {formData.questionType === 'ESSAY' && (
              <textarea
                placeholder="Nhập bài viết của bạn..."
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{ borderColor: '#BDBDBD', backgroundColor: '#FFFFFF' }}
                rows={8}
                disabled
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
