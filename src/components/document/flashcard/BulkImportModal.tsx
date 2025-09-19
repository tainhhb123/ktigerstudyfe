// src/components/BulkImportModal.tsx
import React, { useState } from "react";

export type RawItem = { term: string; meaning: string; example?: string };

export default function BulkImportModal({
    visible,
    onClose,
    onImport,
}: {
    visible: boolean;
    onClose: () => void;
    onImport: (items: RawItem[]) => void;
}) {
    const [text, setText] = useState("");
    const [sep, setSep] = useState<"comma" | "tab">("comma");
    const [preview, setPreview] = useState<RawItem[]>([]);

    const parse = () => {
        const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l);
        const out: RawItem[] = lines.map((l) => {
            const parts = sep === "tab" ? l.split("\t") : l.split(",");
            return {
                term: (parts[0] || "").trim(),
                meaning: (parts[1] || "").trim(),
                example: (parts[2] || "").trim() || undefined,
            };
        });
        setPreview(out);
    };

    const handleImport = () => {
        onImport(preview);
        onClose();
        setText("");
        setPreview([]);
    };

    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">Nhập dữ liệu</h2>
                <textarea
                    className="w-full h-36 border rounded p-2"
                    placeholder="thuật ngữ,định nghĩa,ví dụ(cách nhau bằng dấu phải hoặc tab)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={sep === "comma"}
                            onChange={() => setSep("comma")}
                        />
                        <span className="ml-1">Phẩy</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={sep === "tab"}
                            onChange={() => setSep("tab")}
                        />
                        <span className="ml-1">Tab</span>
                    </label>
                    <button
                        onClick={parse}
                        className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Xem trước
                    </button>
                </div>

                {preview.length > 0 && (
                    <div className="max-h-32 overflow-auto border rounded p-2">
                        {preview.map((it, i) => (
                            <div key={i} className="flex space-x-4 text-sm">
                                <div className="flex-1 font-medium">{it.term}</div>
                                <div className="flex-1">{it.meaning}</div>
                                <div className="flex-1 text-gray-500">{it.example}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-1 rounded border">
                        Hủy
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={preview.length === 0}
                        className="px-4 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                    >
                        Nhập
                    </button>
                </div>
            </div>
        </div>
    );
}
