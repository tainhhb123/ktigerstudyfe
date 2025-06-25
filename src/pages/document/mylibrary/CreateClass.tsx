// src/pages/CreateClass.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import { authService } from "../../../services/authService";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CreateClass() {
    const navigate = useNavigate();
    const userId = authService.getUserId();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [className, setClassName] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!className.trim()) {
            alert("Vui lòng nhập tên lớp học.");
            return;
        }
        if (!password.trim()) {
            alert("Vui lòng nhập mật khẩu lớp.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                className,
                description: description || null,
                password,
                userId,
            };
            const res = await fetch(`${API_URL}/classes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Lỗi ${res.status}`);
            await res.json();
            navigate("/documents/Library/lop-hoc");
        } catch (e: any) {
            console.error(e);
            alert("Không thể tạo lớp: " + e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            <PageMeta title="Tạo lớp học mới" description="Điền thông tin lớp học" />

            <h2 className="text-2xl font-semibold text-gray-800">Tạo lớp học mới</h2>

            <div className="space-y-4">
                {/* Tên lớp học */}
                <div>
                    <label className="block text-gray-700 mb-1">
                        Tên lớp học<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        placeholder="Ví dụ: Toán 10A1"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        disabled={saving}
                    />
                </div>

                {/* Mô tả lớp học */}
                <div>
                    <label className="block text-gray-700 mb-1">Mô tả lớp học</label>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        rows={3}
                        placeholder="Mô tả ngắn gọn về lớp..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={saving}
                    />
                </div>

                {/* Mật khẩu tham gia */}
                <div>
                    <label className="block text-gray-700 mb-1">
                        Mật khẩu tham gia<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="flex-1 border-none outline-none"
                            placeholder="Nhập mật khẩu để học viên tham gia"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={saving}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {saving ? "Đang tạo…" : "Tạo lớp học"}
                </button>
            </div>
        </motion.div>
    );
}
