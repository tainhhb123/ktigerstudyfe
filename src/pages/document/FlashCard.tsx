// src/pages/FlashCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/authService';

import BulkImportModal, { RawItem } from '../../components/document/flashcard/BulkImportModal';

type FlashCardType = {
  term: string;
  def: string;
  example?: string;
  img?: string | null;
};

export default function FlashCard() {
  const navigate = useNavigate();
  const userId = authService.getUserId();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [typeDoc, setTypeDoc] = useState('');
  const [cards, setCards] = useState<FlashCardType[]>([
    { term: '', def: '', example: '', img: null },
  ]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const updateCard = (
    idx: number,
    key: keyof FlashCardType,
    val: string | null
  ) => {
    setCards((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: val } : c))
    );
  };
  const addEmptyCard = () =>
    setCards((prev) => [...prev, { term: '', def: '', example: '', img: null }]);
  const deleteCard = (idx: number) =>
    setCards((prev) => prev.filter((_, i) => i !== idx));

  const uploadImage = async (file: File, idx: number) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: 'POST', body: fd }
      );
      const data = await res.json();
      if (data.secure_url) updateCard(idx, 'img', data.secure_url);
    } catch (e) {
      console.error(e);
    }
  };

  // Nhận mảng RawItem từ BulkImportModal, ghép vào cards
  const handleBulkImport = (items: RawItem[]) => {
    const newCards: FlashCardType[] = items.map((it) => ({
      term: it.term,
      def: it.meaning,
      example: it.example,
      img: null,
    }));
    setCards((prev) => [...prev, ...newCards]);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề.');
      return;
    }

    // Lọc card chỉ lấy những thẻ có term + def
    const validCards = cards.filter(
      (c) => c.term.trim().length > 0 && c.def.trim().length > 0
    );
    if (validCards.length === 0) {
      alert('Phải có ít nhất một thẻ hợp lệ (có thuật ngữ và định nghĩa).');
      return;
    }

    setSaving(true);

    const payload = {
      userId,
      title,
      description: desc,
      type: typeDoc,
      isPublic: isPublic ? 1 : 0,
      items: validCards.map((c) => ({
        word: c.term,
        meaning: c.def,
        example: c.example || null,
        vocabImage: c.img || null,
      })),
    };

    try {
      const res = await fetch(`${API_URL}/document-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate('/documents/Library/tai-lieu');
    } catch (e: any) {
      console.error(e);
      alert('Lưu thất bại: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <BulkImportModal
        visible={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleBulkImport}
      />

      <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4 ">
          <input
            type="text"
            placeholder='Nhập tiêu đề, ví dụ "Sinh học - Chương 22: Tiến hóa"'
            className="bg-white w-full p-4 text-xl border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />

          <div className="relative ">
            <select
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              value={typeDoc}
              onChange={(e) => setTypeDoc(e.target.value)}
              disabled={saving}
            >
              <option value="" disabled>
                -- Chọn loại tài liệu --
              </option>
              <option value="tu-vung">Từ vựng</option>
              <option value="ngu-phap">Ngữ pháp</option>
              <option value="dich-cau">Dịch câu</option>
              <option value="quan-dung-ngu">Quán dụng ngữ</option>
              <option value="khac">Khác</option>
            </select>

          </div>

          <textarea
            placeholder="Thêm mô tả..."
            className=" bg-white w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={saving}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={saving}
              className="w-4 h-4"
            />
            Chỉ mình tôi
          </label>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 space-x-4">

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowImport(true)}
              disabled={saving}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200"
            >
              + Nhập
            </button>
            <button
              onClick={addEmptyCard}
              disabled={saving}
              className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200"
            >
              + Thêm thẻ
            </button>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Tạo và ôn luyện'}
          </button>

        </div>

        {/* Cards */}
        <div className="space-y-6">
          <AnimatePresence>
            {cards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg shadow space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Thẻ #{i + 1}</h4>
                  <button
                    onClick={() => deleteCard(i)}
                    disabled={saving}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Thuật ngữ"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400"
                    value={c.term}
                    onChange={(e) => updateCard(i, 'term', e.target.value)}
                    disabled={saving}
                  />
                  <input
                    placeholder="Định nghĩa"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400"
                    value={c.def}
                    onChange={(e) => updateCard(i, 'def', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <input
                  placeholder="Ví dụ"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                  value={c.example || ''}
                  onChange={(e) => updateCard(i, 'example', e.target.value)}
                  disabled={saving}
                />

                <div className="flex items-center gap-4">
                  {c.img && (
                    <img
                      src={c.img}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <label className="cursor-pointer text-blue-600 hover:underline">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadImage(f, i);
                      }}
                      disabled={saving}
                    />
                    🖼️ {c.img ? 'Thay hình' : 'Tải hình'}
                  </label>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between mb-6 space-x-4">
          <button
            onClick={addEmptyCard}
            disabled={saving}
            className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200"
          >
            + Thêm thẻ
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Tạo và ôn luyện'}
          </button>
        </div>
      </div>
    </>
  );
}
