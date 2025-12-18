import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ExamResponse, ExamType } from '../../../types/exam';
import { examApi } from '../../../services/ExamApi';

const ExamForm = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const isEditMode = !!examId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    examType: 'TOPIK_II' as ExamType,
    totalQuestion: 104,
    durationMinutes: 180,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      fetchExamData();
    }
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const data = await examApi.getExamById(Number(examId));
      setFormData({
        title: data.title,
        examType: data.examType,
        totalQuestion: data.totalQuestion,
        durationMinutes: data.durationMinutes,
        isActive: data.isActive
      });
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Không thể tải thông tin bài thi');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề bài thi';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    }

    if (formData.totalQuestion < 1) {
      newErrors.totalQuestion = 'Số câu hỏi phải lớn hơn 0';
    } else if (formData.totalQuestion > 200) {
      newErrors.totalQuestion = 'Số câu hỏi không được vượt quá 200';
    }

    if (formData.durationMinutes < 10) {
      newErrors.durationMinutes = 'Thời gian phải ít nhất 10 phút';
    } else if (formData.durationMinutes > 500) {
      newErrors.durationMinutes = 'Thời gian không được vượt quá 500 phút';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      if (isEditMode) {
        await examApi.updateExam(Number(examId), formData);
        alert('Cập nhật bài thi thành công!');
      } else {
        const created = await examApi.createExam(formData);
        alert('Tạo bài thi thành công!');
        navigate(`/admin/exams/${created.examId}/sections`);
        return;
      }
      
      navigate('/admin/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert(isEditMode ? 'Không thể cập nhật bài thi' : 'Không thể tạo bài thi');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Quick presets for common exam types
  const applyPreset = (type: 'TOPIK_I' | 'TOPIK_II') => {
    if (type === 'TOPIK_I') {
      setFormData(prev => ({
        ...prev,
        examType: 'TOPIK_I',
        totalQuestion: 70,
        durationMinutes: 100
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        examType: 'TOPIK_II',
        totalQuestion: 104,
        durationMinutes: 180
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải thông tin bài thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/exams')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all"
          style={{ color: '#666666', backgroundColor: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE8DC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>

        <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
          {isEditMode ? '✏️ Chỉnh sửa Bài thi' : '➕ Tạo Bài thi mới'}
        </h1>
        <p style={{ color: '#666666' }}>
          {isEditMode 
            ? 'Cập nhật thông tin bài thi. Lưu ý: Thay đổi số câu hỏi sẽ không tự động thêm/xóa câu hỏi.'
            : 'Điền thông tin cơ bản. Sau khi tạo, bạn có thể thêm sections và câu hỏi.'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="p-8 rounded-xl space-y-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
            
            {/* Title */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                Tiêu đề bài thi <span style={{ color: '#FF5252' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="VD: TOPIK II 91회 기출"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: errors.title ? '#FF5252' : '#BDBDBD',
                  backgroundColor: '#FFF8F0',
                  color: '#333333'
                }}
                onFocus={(e) => !errors.title && (e.target.style.borderColor = '#FF6B35')}
                onBlur={(e) => !errors.title && (e.target.style.borderColor = '#BDBDBD')}
              />
              {errors.title && (
                <p className="mt-1 text-sm" style={{ color: '#FF5252' }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Exam Type with Presets */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                Loại bài thi <span style={{ color: '#FF5252' }}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => applyPreset('TOPIK_I')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.examType === 'TOPIK_I' ? 'shadow-md' : ''
                  }`}
                  style={{
                    borderColor: formData.examType === 'TOPIK_I' ? '#FF6B35' : '#BDBDBD',
                    backgroundColor: formData.examType === 'TOPIK_I' ? '#FFE8DC' : '#FFFFFF'
                  }}
                >
                  <div className="font-bold text-lg mb-1" style={{ color: '#333333' }}>
                    TOPIK I
                  </div>
                  <div className="text-sm" style={{ color: '#666666' }}>
                    70 câu • 100 phút
                  </div>
                  <div className="text-xs mt-2" style={{ color: '#999999' }}>
                    Listening + Reading
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('TOPIK_II')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.examType === 'TOPIK_II' ? 'shadow-md' : ''
                  }`}
                  style={{
                    borderColor: formData.examType === 'TOPIK_II' ? '#FF6B35' : '#BDBDBD',
                    backgroundColor: formData.examType === 'TOPIK_II' ? '#FFE8DC' : '#FFFFFF'
                  }}
                >
                  <div className="font-bold text-lg mb-1" style={{ color: '#333333' }}>
                    TOPIK II
                  </div>
                  <div className="text-sm" style={{ color: '#666666' }}>
                    104 câu • 180 phút
                  </div>
                  <div className="text-xs mt-2" style={{ color: '#999999' }}>
                    Listening + Writing + Reading
                  </div>
                </button>
              </div>
              <p className="mt-2 text-sm" style={{ color: '#999999' }}>
                💡 Click để áp dụng cấu hình mặc định. Bạn có thể chỉnh sửa sau.
              </p>
            </div>

            {/* Total Questions */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                Tổng số câu hỏi <span style={{ color: '#FF5252' }}>*</span>
              </label>
              <input
                type="number"
                value={formData.totalQuestion}
                onChange={(e) => handleInputChange('totalQuestion', parseInt(e.target.value) || 0)}
                min="1"
                max="200"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: errors.totalQuestion ? '#FF5252' : '#BDBDBD',
                  backgroundColor: '#FFF8F0',
                  color: '#333333'
                }}
                onFocus={(e) => !errors.totalQuestion && (e.target.style.borderColor = '#FF6B35')}
                onBlur={(e) => !errors.totalQuestion && (e.target.style.borderColor = '#BDBDBD')}
              />
              {errors.totalQuestion && (
                <p className="mt-1 text-sm" style={{ color: '#FF5252' }}>
                  {errors.totalQuestion}
                </p>
              )}
              <p className="mt-1 text-sm" style={{ color: '#999999' }}>
                Lưu ý: Con số này chỉ để thống kê. Số câu hỏi thực tế phụ thuộc vào sections.
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                Thời gian (phút) <span style={{ color: '#FF5252' }}>*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value) || 0)}
                  min="10"
                  max="500"
                  className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ 
                    borderColor: errors.durationMinutes ? '#FF5252' : '#BDBDBD',
                    backgroundColor: '#FFF8F0',
                    color: '#333333'
                  }}
                  onFocus={(e) => !errors.durationMinutes && (e.target.style.borderColor = '#FF6B35')}
                  onBlur={(e) => !errors.durationMinutes && (e.target.style.borderColor = '#BDBDBD')}
                />
                <div className="text-center px-4 py-3 rounded-lg font-semibold" style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}>
                  {Math.floor(formData.durationMinutes / 60)}h {formData.durationMinutes % 60}m
                </div>
              </div>
              {errors.durationMinutes && (
                <p className="mt-1 text-sm" style={{ color: '#FF5252' }}>
                  {errors.durationMinutes}
                </p>
              )}
            </div>

            {/* Is Active */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#FF6B35' }}
                />
                <div>
                  <span className="font-semibold" style={{ color: '#333333' }}>
                    Kích hoạt bài thi
                  </span>
                  <p className="text-sm" style={{ color: '#666666' }}>
                    Bài thi sẽ hiển thị cho học viên nếu được kích hoạt
                  </p>
                </div>
              </label>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }}>
              <h4 className="font-semibold mb-2" style={{ color: '#2E7D32' }}>
                💡 Lưu ý khi tạo bài thi
              </h4>
              <ul className="text-sm space-y-1" style={{ color: '#333333' }}>
                <li>• Sau khi tạo, bạn sẽ được chuyển đến trang quản lý Sections</li>
                <li>• Mỗi bài thi cần ít nhất 1 Section (Listening/Writing/Reading)</li>
                <li>• Bạn có thể thêm câu hỏi sau khi tạo sections</li>
                <li>• Bài thi chỉ hiển thị cho học viên khi isActive = true</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/exams')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: '#FFFFFF', color: '#666666', border: '1px solid #BDBDBD' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FF6B35' }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#E55A2B')}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#FF6B35')}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Cập nhật' : 'Tạo bài thi'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
