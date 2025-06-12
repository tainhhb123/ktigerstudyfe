import React from "react";
import { Star, Save, Share2, MoreHorizontal } from "lucide-react";

import Button from "../ui/button/Button";


export default function FlashcardHeader() {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">từ vựng tiếng anh</h1>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-red-500">12 đang học</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            3.9 (14 đánh giá)
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-sm">
                        Lưu
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mode Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                <Button className="bg-indigo-100 text-indigo-700 font-medium">Thẻ ghi nhớ</Button>
                <Button variant="outline">Học</Button>
                <Button variant="outline">Kiểm tra</Button>
                <Button variant="outline">Khối hộp</Button>
                <Button variant="outline">Blast</Button>
                <Button variant="outline">Ghép thẻ</Button>
            </div>

            {/* Flashcard Box */}
            <div className="rounded-2xl border border-gray-300 p-6 text-center shadow-sm">
                <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">💡 Hiển thị gợi ý</span>
                    <Star className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-medium text-gray-800 py-12">Toaster</div>

                {/* Navigation Controls */}
                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="text-blue-600">Theo dõi tiến độ</span>
                        <input type="checkbox" className="toggle toggle-sm" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="border border-gray-300 rounded-full">
                            ←
                        </Button>
                        <span className="text-sm text-gray-600">1 / 147</span>
                        <Button variant="ghost" size="icon" className="border border-gray-300 rounded-full">
                            →
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                        <Button variant="ghost" size="icon">▶️</Button>
                        <Button variant="ghost" size="icon">⤢</Button>
                        <Button variant="ghost" size="icon">⚙️</Button>
                        <Button variant="ghost" size="icon">⛶</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
