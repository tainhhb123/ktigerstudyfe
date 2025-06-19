import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../ui/button/Button";

interface AddGrammarModalProps {
  lessonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

      onSuccess(); // Refresh the table
      setGrammar({ grammarTitle: '', grammarContent: '', grammarExample: '' }); // Reset form
      onClose(); // Close modal
    } catch (error) {
      console.error('Error creating grammar:', error);
      alert('Failed to create grammar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal Container - Positioned below header */}
      <div className="fixed inset-x-0 top-[64px] bottom-0 z-50 flex items-start justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl mx-auto my-6 p-4">
          <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 bg-white dark:bg-zinc-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thêm ngữ pháp mới
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

            {/* Form with Scrollable Content */}
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="px-6 py-4">
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer - Sticky */}
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