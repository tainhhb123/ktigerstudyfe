import React, { useState } from 'react';
import { authService } from '../../services/authService';

// Kiểu dữ liệu cho mỗi flashcard
type FlashCardType = {
  term: string;
  def: string;
  example?: string;
  img?: string | null; // lưu URL ảnh từ Cloudinary
};

const FlashCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('');
  const [cards, setCards] = useState<FlashCardType[]>([
    { term: '', def: '', example: '', img: null },
  ]);
  const [isPublic, setIsPublic] = useState(false);

  const userId = authService.getUserId();

  // Upload hình ảnh lên Cloudinary
  const uploadImage = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        updateCard(index, 'img', data.secure_url);
      } else {
        console.error('Upload thất bại:', data);
      }
    } catch (error) {
      console.error('Lỗi khi upload hình:', error);
    }
  };

  // Thêm flashcard mới
  const addCard = () => {
    setCards(prev => [...prev, { term: '', def: '', example: '', img: null }]);
  };

  // Cập nhật trường của flashcard
  const updateCard = (
    index: number,
    key: keyof FlashCardType,
    value: string | null
  ) => {
    setCards(prev =>
      prev.map((card, i) => (i === index ? { ...card, [key]: value } : card))
    );
  };

  // Xóa flashcard
  const deleteCard = (index: number) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  // Gửi dữ liệu lên backend và reset form khi thành công
  const handleCreate = async () => {
    const payload = {
      userId,
      title,
      description: desc,
      type,
      isPublic: isPublic ? 1 : 0,
      items: cards.map(c => ({
        word: c.term,
        meaning: c.def,
        example: c.example || null,
        vocabImage: c.img || null,
      })),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/document-lists`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(await res.text());

      await res.json();
      // Hiển thị hộp thoại có nút OK và Hủy
      const confirmReset = window.confirm('Lưu thành công! Bạn có muốn xóa dữ liệu và tiếp tục không?');
      if (!confirmReset) return;

      // Reset form
      setTitle('');
      setDesc('');
      setType('');
      setIsPublic(false);
      setCards([{ term: '', def: '', example: '', img: null }]);
    } catch (err) {
      console.error('Lỗi khi tạo bộ flashcard:', err);
      alert('Có lỗi khi tạo bộ flashcard');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-4 text-xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder='Nhập tiêu đề, ví dụ "Sinh học - Chương 22: Tiến hóa"'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Loại tài liệu */}
        <div className="relative mt-4">
          <select
            className="w-full p-3 pr-10 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="" disabled>-- Chọn loại tài liệu --</option>
            <option value="tu-vung">Từ vựng</option>
            <option value="ngu-phap">Ngữ pháp</option>
            <option value="dich-cau">Dịch câu</option>
            <option value="quan-dung-ngu">Quán dụng ngữ</option>
            <option value="khac">Khác</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            ▼
          </div>
        </div>

        {/* Mô tả */}
        <textarea
          className="w-full mt-4 p-4 text-base border border-gray-300 rounded-lg shadow-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Thêm mô tả..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition shadow-sm">
            + Nhập
          </button>
          <button className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed">
            + Thêm sơ đồ
          </button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200 transition shadow-sm">
            ✨ Tạo từ ghi chú
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-500"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
          chỉ mình tôi
        </label>
      </div>

      {/* Danh sách flashcards */}
      <div className="space-y-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transform hover:scale-[1.01] transition duration-300 space-y-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 font-semibold">{i + 1}</span>
              <span className="text-gray-600">Thẻ ghi nhớ</span>
            </div>

            <div className="flex gap-4 items-start">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Thuật ngữ"
                value={card.term}
                onChange={e => updateCard(i, 'term', e.target.value)}
              />
              <input
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Định nghĩa"
                value={card.def}
                onChange={e => updateCard(i, 'def', e.target.value)}
              />

              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`upload-${i}`}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, i);
                  }}
                />
                <label
                  htmlFor={`upload-${i}`}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  🖼️ Hình ảnh
                </label>
                {card.img && (
                  <img
                    src={card.img}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-md mt-2"
                  />
                )}
                <button
                  type="button"
                  className="text-red-500 hover:underline hover:text-red-700 transition"
                  onClick={() => deleteCard(i)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>

            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Ví dụ"
              value={card.example || ''}
              onChange={e => updateCard(i, 'example', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition shadow-sm"
          onClick={addCard}
        >
          + Thêm thẻ
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition shadow-lg"
          onClick={handleCreate}
        >
          Tạo và ôn luyện
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
