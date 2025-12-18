import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, ChevronUp, ChevronDown, List, Volume2, BookOpen, PenTool, X, Save, Upload } from 'lucide-react';
import { ExamResponse, ExamSectionResponse, SectionType, ExamType } from '../../../types/exam';
import { examApi, examSectionApi } from '../../../services/ExamApi';

interface SectionFormData {
  sectionType: SectionType;
  examType: ExamType;
  sectionOrder: number;
  totalQuestions: number;
  durationMinutes: number;
  audioUrl: string;
}

const SectionManager = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();

  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [sections, setSections] = useState<ExamSectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<ExamSectionResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<SectionFormData>({
    sectionType: 'LISTENING',
    examType: 'TOPIK_II',
    sectionOrder: 1,
    totalQuestions: 50,
    durationMinutes: 60,
    audioUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examData, sectionsData] = await Promise.all([
        examApi.getExamById(Number(examId)),
        examSectionApi.getSectionsByExam(Number(examId))
      ]);
      setExam(examData);
      setSections(sectionsData.sort((a, b) => a.sectionOrder - b.sectionOrder));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải thông tin bài thi');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sectionOrder)) + 1 : 1;
    setFormData({
      sectionType: 'LISTENING',
      examType: exam?.examType || 'TOPIK_II',
      sectionOrder: nextOrder,
      totalQuestions: 50,
      durationMinutes: 60,
      audioUrl: ''
    });
    setEditingSection(null);
    setShowModal(true);
  };

  const openEditModal = (section: ExamSectionResponse) => {
    setFormData({
      sectionType: section.sectionType,
      examType: section.examType,
      sectionOrder: section.sectionOrder,
      totalQuestions: section.totalQuestions,
      durationMinutes: section.durationMinutes,
      audioUrl: section.audioUrl || ''
    });
    setEditingSection(section);
    setShowModal(true);
  };

  const handleSaveSection = async () => {
    try {
      const payload = {
        ...formData,
        examId: Number(examId),
        audioUrl: formData.audioUrl || null
      };

      if (editingSection) {
        await examSectionApi.updateSection(editingSection.sectionId, payload);
        alert('Cập nhật section thành công!');
      } else {
        await examSectionApi.createSection(payload);
        alert('Tạo section thành công!');
      }

      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Không thể lưu section');
    }
  };

  const handleDeleteSection = async (sectionId: number, sectionType: string) => {
    if (!confirm(`Bạn có chắc muốn xóa section ${sectionType}?\n\nThao tác này sẽ xóa tất cả câu hỏi trong section!`)) {
      return;
    }

    try {
      setDeletingId(sectionId);
      await examSectionApi.deleteSection(sectionId);
      setSections(sections.filter(s => s.sectionId !== sectionId));
      alert('Xóa section thành công!');
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Không thể xóa section');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (sectionId: number, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.sectionId === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    // Swap orders
    const newSections = [...sections];
    const temp = newSections[currentIndex].sectionOrder;
    newSections[currentIndex].sectionOrder = newSections[newIndex].sectionOrder;
    newSections[newIndex].sectionOrder = temp;

    try {
      // Update both sections
      await Promise.all([
        examSectionApi.updateSection(newSections[currentIndex].sectionId, {
          sectionOrder: newSections[currentIndex].sectionOrder
        }),
        examSectionApi.updateSection(newSections[newIndex].sectionId, {
          sectionOrder: newSections[newIndex].sectionOrder
        })
      ]);

      await fetchData();
    } catch (error) {
      console.error('Error reordering sections:', error);
      alert('Không thể sắp xếp lại sections');
    }
  };

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'LISTENING': return <Volume2 className="w-6 h-6" />;
      case 'READING': return <BookOpen className="w-6 h-6" />;
      case 'WRITING': return <PenTool className="w-6 h-6" />;
    }
  };

  const getSectionColor = (type: SectionType) => {
    switch (type) {
      case 'LISTENING': return { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' };
      case 'READING': return { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' };
      case 'WRITING': return { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' };
    }
  };

  const applySectionPreset = (type: SectionType) => {
    let preset = { totalQuestions: 50, durationMinutes: 60 };
    
    if (type === 'LISTENING') {
      preset = { totalQuestions: 50, durationMinutes: 60 };
    } else if (type === 'WRITING') {
      preset = { totalQuestions: 4, durationMinutes: 50 };
    } else if (type === 'READING') {
      preset = { totalQuestions: 50, durationMinutes: 70 };
    }

    setFormData(prev => ({ ...prev, sectionType: type, ...preset }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#666666' }}>Đang tải sections...</p>
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
          Quay lại danh sách bài thi
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>
              📚 Quản lý Sections
            </h1>
            <p className="text-lg" style={{ color: '#666666' }}>
              {exam?.title} • <span className="font-semibold">{sections.length}</span> sections
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#FF6B35' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E55A2B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
          >
            <Plus className="w-5 h-5" />
            Thêm Section
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-lg border-l-4" style={{ backgroundColor: '#E3F2FD', borderColor: '#1976D2' }}>
        <h4 className="font-semibold mb-2" style={{ color: '#1565C0' }}>
          💡 Hướng dẫn quản lý Sections
        </h4>
        <ul className="text-sm space-y-1" style={{ color: '#333333' }}>
          <li>• Mỗi bài thi TOPIK II thường có 3 sections: Listening → Writing → Reading</li>
          <li>• Bài thi TOPIK I chỉ có 2 sections: Listening → Reading</li>
          <li>• Click vào section để quản lý câu hỏi chi tiết</li>
          <li>• Dùng nút ⬆️⬇️ để sắp xếp thứ tự hiển thị</li>
        </ul>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDBDBD' }}>
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>
            Chưa có section nào
          </h3>
          <p className="mb-4" style={{ color: '#666666' }}>
            Hãy tạo section đầu tiên (Listening, Writing, hoặc Reading)
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 text-white font-semibold rounded-lg transition-all"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Tạo Section đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => {
            const colors = getSectionColor(section.sectionType);
            return (
              <div
                key={section.sectionId}
                className="p-6 rounded-xl border-2 transition-all hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', borderColor: colors.border }}
              >
                <div className="flex items-center gap-4">
                  {/* Order Badge */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {section.sectionOrder}
                  </div>

                  {/* Section Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{ color: colors.text }}>
                        {getSectionIcon(section.sectionType)}
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#333333' }}>
                        {section.sectionType}
                      </h3>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {section.examType}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm" style={{ color: '#666666' }}>
                      <span>📝 {section.totalQuestions} câu hỏi</span>
                      <span>⏱️ {section.durationMinutes} phút</span>
                      {section.audioUrl && (
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          Có audio
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* View Questions */}
                    <button
                      onClick={() => navigate(`/admin/sections/${section.sectionId}/questions`)}
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                      title="Quản lý câu hỏi"
                    >
                      <List className="w-5 h-5" />
                    </button>

                    {/* Move Up */}
                    <button
                      onClick={() => handleReorder(section.sectionId, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                      title="Di chuyển lên"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleReorder(section.sectionId, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#FFE8DC', color: '#FF6B35' }}
                      title="Di chuyển xuống"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(section)}
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSection(section.sectionId, section.sectionType)}
                      disabled={deletingId === section.sectionId}
                      className="p-2 rounded-lg transition-all disabled:opacity-50"
                      style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                      title="Xóa"
                    >
                      {deletingId === section.sectionId ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit Section */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full rounded-xl p-8" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#333333' }}>
                {editingSection ? '✏️ Chỉnh sửa Section' : '➕ Thêm Section mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg transition-all"
                style={{ color: '#666666' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Section Type - Preset Buttons */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                  Loại Section
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['LISTENING', 'WRITING', 'READING'] as SectionType[]).map(type => {
                    const colors = getSectionColor(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => applySectionPreset(type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.sectionType === type ? 'shadow-md' : ''
                        }`}
                        style={{
                          borderColor: formData.sectionType === type ? colors.text : '#BDBDBD',
                          backgroundColor: formData.sectionType === type ? colors.bg : '#FFFFFF'
                        }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div style={{ color: colors.text }}>
                            {getSectionIcon(type)}
                          </div>
                          <span className="font-semibold text-sm" style={{ color: '#333333' }}>
                            {type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Questions */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                  Số câu hỏi
                </label>
                <input
                  type="number"
                  value={formData.totalQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border-2"
                  style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border-2"
                  style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                />
              </div>

              {/* Audio URL - Only for LISTENING */}
              {formData.sectionType === 'LISTENING' && (
                <div>
                  <label className="block font-semibold mb-2" style={{ color: '#333333' }}>
                    Audio URL (Cloudinary/CDN)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, audioUrl: e.target.value }))}
                      placeholder="https://res.cloudinary.com/..."
                      className="flex-1 px-4 py-3 rounded-lg border-2"
                      style={{ borderColor: '#BDBDBD', backgroundColor: '#FFF8F0' }}
                    />
                    <button
                      type="button"
                      className="px-4 py-3 rounded-lg font-semibold"
                      style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                      title="Upload audio"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: '#999999' }}>
                    Upload file audio lên Cloudinary và paste URL vào đây
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: '#F5F5F5', color: '#666666' }}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSection}
                className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all"
                style={{ backgroundColor: '#FF6B35' }}
              >
                <Save className="w-5 h-5" />
                {editingSection ? 'Cập nhật' : 'Tạo Section'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager;
