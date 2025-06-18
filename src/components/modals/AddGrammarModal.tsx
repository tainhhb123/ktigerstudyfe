import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../ui/button/Button";

interface AddGrammarModalProps {
  lessonId: number;
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

export default function AddGrammarModal({ 
  lessonId, 
  isOpen, 
  onClose,
  onSuccess 
}: AddGrammarModalProps) {
  const [grammar, setGrammar] = useState({ 
    grammarTitle: '', 
    grammarContent: '',
    grammarExample: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setGrammar({ grammarTitle: '', grammarContent: '', grammarExample: '' });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGrammar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/grammar-theories', {
        ...grammar,
        lessonId
      });

      onSuccess();
      setGrammar({ grammarTitle: '', grammarContent: '', grammarExample: '' });
      onClose();
    } catch (error) {
      const err = error as ApiError;
      console.error('Error creating grammar:', err);
      alert(err.response?.data?.message || 'Failed to create grammar');
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Thêm ngữ pháp mới
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiêu đề *
              </label>
              <input
                type="text"
                name="grammarTitle"
                value={grammar.grammarTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nội dung *
              </label>
              <textarea
                name="grammarContent"
                value={grammar.grammarContent}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ví dụ
              </label>
              <textarea
                name="grammarExample"
                value={grammar.grammarExample}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
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