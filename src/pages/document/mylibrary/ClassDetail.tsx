// src/pages/ClassDetail.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import { motion } from "framer-motion";
import { authService } from "../../../services/authService";
import debounce from "lodash.debounce";

interface ClassResponse {
    classId: number;
    className: string;
    description?: string;
    userId: number;
    userFullName: string;
    createdAt: string;
    password: string;
}

interface ClassUserResponse {
    classUserId: number;
    classId: number;
    userId: number;
    userFullName: string;
    joinedAt: string;
}

interface ClassDocumentListResponse {
    classDocumentListId: number;
    classId: number;
    listId: number;
    listTitle: string;
    assignedAt: string;
}

interface UserSearchResult {
    userId: number;
    fullName: string;
    email: string;
}

interface DocListSearchResult {
    listId: number;
    title: string;
}

export default function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;
    const me = authService.getUserId();

    // 1. Class info
    const [cls, setCls] = useState<ClassResponse | null>(null);
    const [infoLoading, setInfoLoading] = useState(true);
    const [savingInfo, setSavingInfo] = useState(false);

    // 2. Members
    const [members, setMembers] = useState<ClassUserResponse[]>([]);
    const [memberLoading, setMemberLoading] = useState(true);
    const [searchUserQ, setSearchUserQ] = useState("");
    const [searchUsers, setSearchUsers] = useState<UserSearchResult[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // 3. Docs
    const [docs, setDocs] = useState<ClassDocumentListResponse[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);
    const [searchDocQ, setSearchDocQ] = useState("");
    const [searchDocs, setSearchDocs] = useState<DocListSearchResult[]>([]);
    const [searchingDocs, setSearchingDocs] = useState(false);

    useEffect(() => {
        if (isNaN(Number(id))) return navigate(-1);
        // load class info
        fetch(`${API}/classes/${id}`)
            .then(r => r.json())
            .then((data: ClassResponse) => setCls(data))
            .finally(() => setInfoLoading(false));
        // load members
        fetch(`${API}/class-users/class/${id}`)
            .then(r => r.json())
            .then((d: ClassUserResponse[]) => setMembers(d))
            .finally(() => setMemberLoading(false));
        // load docs
        fetch(`${API}/class-document-lists/class/${id}`)
            .then(r => r.json())
            .then((d: ClassDocumentListResponse[]) => setDocs(d))
            .finally(() => setDocsLoading(false));
    }, [API, id, navigate]);

    // ---- handlers class info ----
    const updateField = (k: keyof ClassResponse, v: string) => {
        if (!cls) return;
        setCls({ ...cls, [k]: v });
    };
    const handleSaveInfo = async () => {
        if (!cls) return;
        setSavingInfo(true);
        try {
            const { className, description, password } = cls;
            await fetch(`${API}/classes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ className, description, password, userId: me }),
            });
            alert("Cập nhật thông tin lớp thành công");
        } catch {
            alert("Lỗi khi lưu thông tin lớp");
        } finally {
            setSavingInfo(false);
        }
    };

    // ---- search & add member ----
    const doSearchUsers = debounce((q: string) => {
        if (!q.trim()) return setSearchUsers([]);
        setSearchingUsers(true);
        fetch(`${API}/users/search?keyword=${encodeURIComponent(q)}&page=0&size=5`)
            .then(r => r.json())
            .then((page: any) => setSearchUsers(page.content))
            .finally(() => setSearchingUsers(false));
    }, 300);

    useEffect(() => {
        doSearchUsers(searchUserQ);
    }, [searchUserQ]);

    const handleAddMember = async (u: UserSearchResult) => {
        try {
            const res = await fetch(`${API}/class-users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId: id, userId: u.userId }),
            });
            const added: ClassUserResponse = await res.json();
            setMembers(m => [...m, added]);
            setSearchUserQ("");
            setSearchUsers([]);
        } catch {
            alert("Thêm thành viên thất bại");
        }
    };
    const handleRemoveMember = async (uid: number) => {
        if (!window.confirm("Xóa thành viên này?")) return;
        const cu = members.find(m => m.userId === uid);
        if (!cu) return;
        await fetch(`${API}/class-users/${cu.classUserId}`, { method: "DELETE" });
        setMembers(m => m.filter(x => x.userId !== uid));
    };

    // ---- search & add docs ----
    const doSearchDocs = debounce((q: string) => {
        if (!q.trim()) return setSearchDocs([]);
        setSearchingDocs(true);
        fetch(`${API}/document-lists/user/${me}`) // load all user's lists
            .then(r => r.json())
            .then((all: DocListSearchResult[]) => {
                const filt = all.filter(d =>
                    d.title.toLowerCase().includes(q.toLowerCase())
                ).slice(0, 5);
                setSearchDocs(filt);
            })
            .finally(() => setSearchingDocs(false));
    }, 300);

    useEffect(() => {
        doSearchDocs(searchDocQ);
    }, [searchDocQ]);

    const handleAddDoc = async (dl: DocListSearchResult) => {
        try {
            const res = await fetch(`${API}/class-document-lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId: id, listId: dl.listId }),
            });
            const added: ClassDocumentListResponse = await res.json();
            setDocs(d => [...d, added]);
            setSearchDocQ("");
            setSearchDocs([]);
        } catch {
            alert("Thêm tài liệu thất bại");
        }
    };
    const handleRemoveDoc = async (cdlId: number) => {
        if (!window.confirm("Xóa tài liệu khỏi lớp?")) return;
        await fetch(`${API}/class-document-lists/${cdlId}`, { method: "DELETE" });
        setDocs(d => d.filter(x => x.classDocumentListId !== cdlId));
    };

    return (
        <>
            <PageMeta
                title={cls ? `Lớp: ${cls.className}` : "Chi tiết lớp học"}
                description=""
            />

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* 1. Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow p-6 space-y-4"
                >
                    <h2 className="text-2xl font-semibold">Thông tin lớp học</h2>
                    {infoLoading || !cls ? (
                        <p>Đang tải…</p>
                    ) : (
                        <>
                            <label className="block">
                                <span className="text-gray-700">Tên lớp</span>
                                <input
                                    value={cls.className}
                                    onChange={(e) => updateField("className", e.target.value)}
                                    disabled={savingInfo}
                                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Mô tả</span>
                                <textarea
                                    value={cls.description || ""}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    disabled={savingInfo}
                                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Mật khẩu</span>
                                <input
                                    type="password"
                                    value={cls.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    disabled={savingInfo}
                                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </label>
                            <button
                                onClick={handleSaveInfo}
                                disabled={savingInfo}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                {savingInfo ? "Đang lưu…" : "Lưu thông tin"}
                            </button>
                        </>
                    )}
                </motion.div>

                {/* 2. Members */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow p-6 space-y-4"
                >
                    <h2 className="text-2xl font-semibold">Thành viên ({members.length})</h2>

                    {/* search */}
                    <div className="flex gap-2">
                        <input
                            placeholder="Tìm kiếm người dùng..."
                            value={searchUserQ}
                            onChange={(e) => setSearchUserQ(e.target.value)}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                        {searchingUsers && <span>…</span>}
                    </div>
                    {/* kết quả search */}
                    {searchUsers.length > 0 && (
                        <ul className="border rounded bg-gray-50 p-2 space-y-1 max-h-40 overflow-auto">
                            {searchUsers.map(u => (
                                <li key={u.userId} className="flex justify-between px-2">
                                    <span>{u.fullName} ({u.email})</span>
                                    <button
                                        onClick={() => handleAddMember(u)}
                                        className="text-green-600 hover:underline"
                                    >
                                        Thêm
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* danh sách thành viên */}
                    {memberLoading ? (
                        <p>Đang tải…</p>
                    ) : (
                        <ul className="space-y-2">
                            {members.map(m => (
                                <li key={m.classUserId} className="flex justify-between items-center">
                                    <span>{m.userFullName}</span>
                                    <button
                                        onClick={() => handleRemoveMember(m.userId)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>

                {/* 3. Documents */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow p-6 space-y-4"
                >
                    <h2 className="text-2xl font-semibold">Tài liệu</h2>

                    {/* search */}
                    <div className="flex gap-2">
                        <input
                            placeholder="Tìm tài liệu của bạn..."
                            value={searchDocQ}
                            onChange={(e) => setSearchDocQ(e.target.value)}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                        {searchingDocs && <span>…</span>}
                    </div>
                    {searchDocs.length > 0 && (
                        <ul className="border rounded bg-gray-50 p-2 space-y-1 max-h-40 overflow-auto">
                            {searchDocs.map(d => (
                                <li key={d.listId} className="flex justify-between px-2">
                                    <span>{d.title}</span>
                                    <button
                                        onClick={() => handleAddDoc(d)}
                                        className="text-green-600 hover:underline"
                                    >
                                        Thêm
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {docsLoading ? (
                        <p>Đang tải…</p>
                    ) : (
                        <ul className="space-y-2">
                            {docs.map(d => (
                                <li key={d.classDocumentListId} className="flex justify-between items-center">
                                    <span>{d.listTitle}</span>
                                    <button
                                        onClick={() => handleRemoveDoc(d.classDocumentListId)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </>
    );
}