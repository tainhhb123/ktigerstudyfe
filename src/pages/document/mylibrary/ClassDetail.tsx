// src/pages/ClassDetail.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";
import DocumentCard, { Doc } from "../../../components/document/homedocument/DocumentCard";
import { authService } from "../../../services/authService";

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
    email: string;
    avatarImage?: string;
    joinedAt: string;
}

interface ClassDocumentListResponse {
    classDocumentListId: number;
    classId: number;
    listId: number;
    listTitle: string;
    fullName: string;
    avatarImage?: string;
    description: string;
    type: string;

}

interface DocListSearchResult {
    listId: number;
    title: string;
    description: string;
    type: string;
    fullName: string;
    avatarImage?: string;
}

interface UserSearchResult {
    userId: number;
    fullName: string;
    email: string;
}

export default function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const classId = Number(id);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;
    const me = authService.getUserId();

    // --- Class Info ---
    const [cls, setCls] = useState<ClassResponse | null>(null);
    const [infoLoading, setInfoLoading] = useState(true);
    const [savingInfo, setSavingInfo] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // --- Members ---
    const [members, setMembers] = useState<ClassUserResponse[]>([]);
    const [memberLoading, setMemberLoading] = useState(true);
    const [searchUserQ, setSearchUserQ] = useState("");
    const [searchUsers, setSearchUsers] = useState<UserSearchResult[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // --- Documents in class ---
    const [docs, setDocs] = useState<ClassDocumentListResponse[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);

    // --- Search your own lists to add ---
    const [listSearchQ, setListSearchQ] = useState("");
    const [listResults, setListResults] = useState<DocListSearchResult[]>([]);
    const [searchingLists, setSearchingLists] = useState(false);

    // --- Load on mount ---
    useEffect(() => {
        if (isNaN(classId)) return navigate(-1);

        // class info
        fetch(`${API}/classes/${classId}`)
            .then(r => r.json())
            .then((data: ClassResponse) => setCls(data))
            .finally(() => setInfoLoading(false));

        // members
        fetch(`${API}/class-users/class/${classId}`)
            .then(r => r.json())
            .then((d: ClassUserResponse[]) => setMembers(d))
            .finally(() => setMemberLoading(false));

        // docs
        fetch(`${API}/class-document-lists/class/${classId}`)
            .then(r => r.json())
            .then((d: ClassDocumentListResponse[]) => setDocs(d))
            .finally(() => setDocsLoading(false));
    }, [API, classId, navigate]);

    // --- Handlers: update & save class info ---
    const updateField = (k: keyof ClassResponse, v: string) => {
        if (!cls) return;
        setCls({ ...cls, [k]: v });
    };
    const handleSaveInfo = async () => {
        if (!cls) return;
        setSavingInfo(true);
        try {
            await fetch(`${API}/classes/${classId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    className: cls.className,
                    description: cls.description,
                    password: cls.password,
                    userId: me,
                }),
            });
            alert("Lưu thông tin thành công!");
        } catch {
            alert("Có lỗi khi lưu.");
        } finally {
            setSavingInfo(false);
        }
    };

    // --- Search users (debounced) ---
    const doSearchUsers = debounce((q: string) => {
        if (!q.trim()) return setSearchUsers([]);
        setSearchingUsers(true);
        fetch(`${API}/users/search?keyword=${encodeURIComponent(q)}&page=0&size=5`)
            .then(r => r.json())
            .then((page: any) => setSearchUsers(page.content))
            .finally(() => setSearchingUsers(false));
    }, 300);
    useEffect(() => { doSearchUsers(searchUserQ); }, [searchUserQ]);

    const handleAddMember = async (u: UserSearchResult) => {
        try {
            const res = await fetch(`${API}/class-users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, userId: u.userId }),
            });
            const added = (await res.json()) as ClassUserResponse;
            setMembers(m => [...m, added]);
            setSearchUserQ("");
            setSearchUsers([]);
        } catch {
            alert("Thêm thành viên thất bại");
        }
    };
    const handleRemoveMember = async (uid: number) => {
        if (!window.confirm("Xóa thành viên?")) return;
        const cu = members.find(m => m.userId === uid);
        if (!cu) return;
        await fetch(`${API}/class-users/${cu.classUserId}`, { method: "DELETE" });
        setMembers(m => m.filter(x => x.userId !== uid));
    };

    // --- Search your own document-lists (debounced) ---
    const doSearchLists = debounce((q: string) => {
        if (!q.trim()) return setListResults([]);
        setSearchingLists(true);
        fetch(`${API}/document-lists/user/${me}/unassigned`)
            .then(r => r.json())
            .then((all: DocListSearchResult[]) => {
                setListResults(
                    all
                        .filter(d => d.title.toLowerCase().includes(q.toLowerCase()))
                        .slice(0, 6)
                );
            })
            .finally(() => setSearchingLists(false));
    }, 300);
    useEffect(() => { doSearchLists(listSearchQ); }, [listSearchQ]);

    const handleAddDoc = async (dl: DocListSearchResult) => {
        try {
            const res = await fetch(`${API}/class-document-lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId, listId: dl.listId }),
            });
            const added = (await res.json()) as ClassDocumentListResponse;
            setDocs(d => [...d, added]);
            setListSearchQ("");
            setListResults([]);
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

            <div className="max-w-7xl mx-auto lg:flex lg:space-x-8 mt-3">
                {/* Left: class documents */}
                <div className="w-full lg:w-7/12 space-y-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tài liệu của bạn…"
                        className="w-full max-w-3xl mx-auto p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        value={listSearchQ}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setListSearchQ(e.target.value)
                        }
                    />

                    <h2 className="text-2xl font-semibold">Tài liệu trong lớp</h2>
                    {searchingLists && <p className="text-sm text-gray-500">Đang tìm…</p>}
                    {listResults.length > 0 && (
                        <ul className="bg-white border rounded-lg p-4 grid gap-3">
                            {listResults.map(d => (
                                <li key={d.listId} className="flex justify-between">
                                    <span className="truncate">{d.title}</span>
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
                        <p>Đang tải tài liệu…</p>
                    ) : docs.length === 0 ? (
                        <p className="text-gray-500">Chưa có tài liệu nào trong lớp.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {docs.map(cdl => (
                                <div key={cdl.classDocumentListId} className="relative">
                                    <DocumentCard
                                        doc={{
                                            listId: cdl.listId,
                                            title: cdl.listTitle,
                                            description: cdl.description,
                                            type: cdl.type,
                                            fullName: cdl.fullName,
                                            avatarImage: cdl.avatarImage,
                                        }}
                                    />
                                    <button
                                        onClick={() => handleRemoveDoc(cdl.classDocumentListId)}
                                        className="absolute top-7 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right sidebar */}
                <div className="w-full lg:w-5/12 mt-12 lg:mt-0 space-y-8">
                    {/* Class Info (collapsible) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Thông tin lớp học</h3>
                            <button
                                onClick={() => setShowInfo(v => !v)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                                aria-label={showInfo ? "Thu gọn" : "Chỉnh sửa"}
                            >
                                {showInfo ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                        </div>

                        <AnimatePresence initial={false}>
                            {showInfo && !infoLoading && cls && (
                                <motion.div
                                    key="info-form"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <label className="block">
                                        <span className="text-gray-700">Tên lớp</span>
                                        <input
                                            value={cls.className}
                                            onChange={e => updateField("className", e.target.value)}
                                            disabled={savingInfo}
                                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700">Mô tả</span>
                                        <textarea
                                            value={cls.description || ""}
                                            onChange={e => updateField("description", e.target.value)}
                                            disabled={savingInfo}
                                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700">Mật khẩu tham gia</span>
                                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="flex-1 border-none outline-none"
                                                value={cls.password}
                                                onChange={e => updateField("password", e.target.value)}
                                                disabled={savingInfo}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                className="text-gray-500 hover:text-gray-700 p-1"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </label>

                                    <button
                                        onClick={handleSaveInfo}
                                        disabled={savingInfo}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {savingInfo ? "Đang lưu…" : "Lưu thông tin"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Members */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow p-6 space-y-4"
                    >
                        <h3 className="text-xl font-semibold">Thành viên ({members.length})</h3>
                        <input
                            placeholder="Tìm kiếm người dùng…"
                            value={searchUserQ}
                            onChange={e => setSearchUserQ(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                        {searchingUsers && <p>Đang tìm…</p>}
                        {searchUsers.length > 0 && (
                            <ul className="bg-gray-50 border rounded-lg max-h-40 overflow-auto p-2 space-y-1">
                                {searchUsers.map(u => (
                                    <li key={u.userId} className="flex justify-between">
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

                        {memberLoading ? (
                            <p>Đang tải…</p>
                        ) : (
                            <ul className="space-y-2">
                                {members.map(m => (
                                    <li
                                        key={m.classUserId}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={m.avatarImage ?? "https://via.placeholder.com/32"}
                                                alt={m.userFullName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{m.userFullName}</span>
                                                <span className="text-sm text-gray-500">{m.email}</span>
                                            </div>
                                        </div>
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
                </div>
            </div>
        </>
    );
}
