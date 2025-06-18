import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../ui/button/Button';

interface AddVocabularyModalProps {
  lessonId: number; // Change from string to number
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export default function AddVocabularyModal({ 
  lessonId, 
  isOpen, 
  onClose,
  onSuccess 
}: AddVocabularyModalProps) {
  const [vocabulary, setVocabulary] = useState({ 
    word: '', 
    meaning: '',
    example: '' // Add example field
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVocabulary(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/vocabulary-theories', {
        word: vocabulary.word,
        meaning: vocabulary.meaning,
        example: vocabulary.example || null,
        lessonId: lessonId
      });

      console.log('Vocabulary created:', response.data);
      onSuccess();
      setVocabulary({ word: '', meaning: '', example: '' });
      onClose();
    } catch (error: unknown) {
      console.error('Error creating vocabulary:', error);
      // Cast error to our custom ApiError type
      const err = error as ApiError;
      alert(err.response?.data?.message || err.message || 'Failed to create vocabulary');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mx-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thêm từ vựng mới
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Từ vựng *
              </label>
              <input
                type="text"
                name="word"
                value={vocabulary.word}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nghĩa *
              </label>
              <input
                type="text"
                name="meaning"
                value={vocabulary.meaning}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ví dụ
              </label>
              <textarea
                name="example"
                value={vocabulary.example}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white resize-none"
                placeholder="Nhập ví dụ sử dụng từ vựng (không bắt buộc)"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo mới'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}