import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/button/Button";

interface AddVocabularyModalProps {
  lessonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
    example: ''
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
    setVocabulary(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/vocabulary-theories', {
        ...vocabulary,
        lessonId
      });

      onSuccess();
      setVocabulary({ word: '', meaning: '', example: '' });
      onClose();
    } catch (error) {
      console.error('Error creating vocabulary:', error);
      alert('Failed to create vocabulary');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl mx-auto my-6 p-4">
          <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thêm từ vựng mới
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="px-6 py-4">
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nghĩa *
                    </label>
                    <textarea
                      name="meaning"
                      value={vocabulary.meaning}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
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
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-zinc-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang tạo...' : 'Tạo mới'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}