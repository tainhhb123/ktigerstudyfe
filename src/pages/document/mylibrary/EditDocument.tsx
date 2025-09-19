// src/pages/EditDocument.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import { authService } from "../../../services/authService";

interface DocumentListResponse {
    listId: number;
    userId: number;
    fullName: string;
    avatarImage?: string;
    title: string;
    description: string;
    type: string;
    createdAt: string;
    isPublic: number;
}
interface DocumentItemResponse {
    wordId: number | null; // null = new
    listId: number;
    word: string;
    meaning: string;
    example?: string;
    vocabImage?: string;
}

export default function EditDocument() {
    const { listId } = useParams<{ listId: string }>();
    const listIdNum = Number(listId);
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const [listData, setListData] = useState<DocumentListResponse | null>(
        null
    );
    const [items, setItems] = useState<DocumentItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // load list + items
    useEffect(() => {
        if (isNaN(listIdNum)) {
            setError("List ID không hợp lệ");
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const [lRes, iRes] = await Promise.all([
                    fetch(`${API_URL}/document-lists/${listIdNum}`),
                    fetch(`${API_URL}/document-items/list/${listIdNum}`),
                ]);
                if (!lRes.ok)
                    throw new Error(`Lấy danh sách thất bại: ${lRes.status}`);
                if (!iRes.ok)
                    throw new Error(`Lấy mục thất bại: ${iRes.status}`);
                const lData: DocumentListResponse = await lRes.json();
                const iData: DocumentItemResponse[] = await iRes.json();
                setListData(lData);
                setItems(
                    iData.map((i) => ({
                        ...i,
                        wordId: i.wordId ?? null,
                    }))
                );
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [API_URL, listIdNum]);

    // list handlers
    const updateListField = (
        key: keyof DocumentListResponse,
        value: any
    ) => {
        if (!listData) return;
        setListData({ ...listData, [key]: value });
    };
    const saveList = async () => {
        if (!listData) return;
        try {
            const payload = {
                userId: listData.userId,
                title: listData.title,
                description: listData.description,
                type: listData.type,
                isPublic: listData.isPublic,
                createdAt: listData.createdAt,
                items: [] as any[],
            };
            const res = await fetch(
                `${API_URL}/document-lists/${listIdNum}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!res.ok) throw new Error(`Lưu thất bại: ${res.status}`);
            // redirect back
            navigate("/documents/Library/tai-lieu");
        } catch (e) {
            console.error(e);
            alert("Cập nhật danh sách thất bại");
        }
    };

    // item handlers
    const updateItemField = (
        idx: number,
        key: keyof DocumentItemResponse,
        value: any
    ) => {
        setItems((list) =>
            list.map((it, i) => (i === idx ? { ...it, [key]: value } : it))
        );
    };

    const uploadImage = async (file: File, idx: number) => {
        const form = new FormData();
        form.append("file", file);
        form.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        try {
            const resp = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: form,
                }
            );
            const data = await resp.json();
            if (data.secure_url) {
                updateItemField(idx, "vocabImage", data.secure_url);
            }
        } catch (e) {
            console.error("Upload thất bại:", e);
        }
    };

    const saveItem = async (idx: number) => {
        const it = items[idx];
        const payload = {
            listId: listIdNum,
            word: it.word,
            meaning: it.meaning,
            example: it.example ?? null,
            vocabImage: it.vocabImage ?? null,
        };
        try {
            const isUpdate = it.wordId && it.wordId > 0;
            const url = isUpdate
                ? `${API_URL}/document-items/${it.wordId}`
                : `${API_URL}/document-items`;
            const res = await fetch(url, {
                method: isUpdate ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            // remove that item from UI on success
            setItems((list) => list.filter((_, i) => i !== idx));
        } catch (e) {
            console.error(e);
            alert("Lưu mục thất bại");
        }
    };

    const deleteItem = async (idx: number) => {
        const it = items[idx];
        if (
            it.wordId &&
            it.wordId > 0 &&
            window.confirm(`Xoá mục "${it.word}"?`)
        ) {
            try {
                const res = await fetch(
                    `${API_URL}/document-items/${it.wordId}`,
                    { method: "DELETE" }
                );
                if (!res.ok) throw new Error(`Status ${res.status}`);
            } catch (e) {
                console.error(e);
                alert("Xoá thất bại");
                return;
            }
        }
        setItems((list) => list.filter((_, i) => i !== idx));
    };

    const addItem = () =>
        setItems((list) => [
            ...list,
            {
                wordId: null,
                listId: listIdNum,
                word: "",
                meaning: "",
                example: "",
                vocabImage: "",
            },
        ]);

    if (loading)
        return <p className="p-4 text-center">Đang tải…</p>;
    if (error)
        return (
            <p className="p-4 text-center text-red-600">
                Lỗi: {error}
            </p>
        );
    if (!listData) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <PageMeta
                title="Chỉnh sửa danh sách"
                description={listData.title}
            />

            {/* metadata */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                <h2 className="text-2xl font-semibold">
                    Thông tin danh sách
                </h2>
                <input
                    className="w-full p-3 border rounded"
                    value={listData.title}
                    onChange={(e) =>
                        updateListField("title", e.target.value)
                    }
                    placeholder="Tiêu đề"
                />
                <textarea
                    rows={2}
                    className="w-full p-3 border rounded"
                    value={listData.description}
                    onChange={(e) =>
                        updateListField("description", e.target.value)
                    }
                    placeholder="Mô tả"
                />
                <select
                    className="w-full p-3 border rounded"
                    value={listData.type}
                    onChange={(e) =>
                        updateListField("type", e.target.value)
                    }
                >
                    <option value="" disabled>
                        Chọn loại
                    </option>
                    <option value="tu-vung">Từ vựng</option>
                    <option value="ngu-phap">Ngữ pháp</option>
                    <option value="dich-cau">Dịch câu</option>
                    <option value="quan-dung-ngu">
                        Quán dụng ngữ
                    </option>
                    <option value="khac">Khác</option>
                </select>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={listData.isPublic === 0}
                        onChange={(e) =>
                            updateListField(
                                "isPublic",
                                e.target.checked ? 0 : 1
                            )
                        }
                    />
                    <span>Công khai</span>
                </label>
                <button
                    onClick={saveList}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Lưu danh sách
                </button>
            </div>

            {/* items */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        Các mục từ vựng
                    </h2>
                    <button
                        onClick={addItem}
                        className="bg-green-100 text-green-700 px-4 py-1 rounded"
                    >
                        + Thêm mục
                    </button>
                </div>

                {items.map((it, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-4 rounded-2xl shadow space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">
                                Mục #{idx + 1}
                            </span>
                            <button
                                onClick={() => deleteItem(idx)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Xóa
                            </button>
                        </div>

                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Thuật ngữ"
                            value={it.word}
                            onChange={(e) =>
                                updateItemField(idx, "word", e.target.value)
                            }
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Định nghĩa"
                            value={it.meaning}
                            onChange={(e) =>
                                updateItemField(
                                    idx,
                                    "meaning",
                                    e.target.value
                                )
                            }
                        />
                        <textarea
                            rows={2}
                            className="w-full p-2 border rounded"
                            placeholder="Ví dụ"
                            value={it.example || ""}
                            onChange={(e) =>
                                updateItemField(
                                    idx,
                                    "example",
                                    e.target.value
                                )
                            }
                        />

                        <div className="flex items-center gap-4">
                            {it.vocabImage && (
                                <img
                                    src={it.vocabImage}
                                    alt="Preview"
                                    className="w-20 h-20 rounded object-cover"
                                />
                            )}
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id={`upload-${idx}`}
                                    className="hidden"
                                    onChange={(e) => {
                                        const f =
                                            e.target.files?.[0];
                                        if (f) uploadImage(f, idx);
                                    }}
                                />
                                <label
                                    htmlFor={`upload-${idx}`}
                                    className="cursor-pointer text-blue-600 hover:underline"
                                >
                                    {it.vocabImage
                                        ? "Thay hình"
                                        : "Tải lên hình"}
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={() => saveItem(idx)}
                            className="self-end bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                        >
                            Lưu mục
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
