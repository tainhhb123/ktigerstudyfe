// src/pages/Profile.tsx
import { useEffect, useState, useRef } from "react";
import { Tab } from "@headlessui/react";
import { Pencil, Check, X, Camera, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/cloudinaryService";
import axiosInstance from "../services/axiosConfig";

// Mở rộng kiểu dữ liệu người dùng
interface UserProfile {
  userId?: string;
  fullName: string;
  email: string;
  role?: string;
  userName?: string;
  avatarImage?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  joinDate?: string;
  gender?: string;
  learningStats?: {
    completedLessons: number;
    totalPoints: number;
    streak: number;
    level: number;
    progressPercent: number;
  };
}

interface UserXP {
  userXPId: number;
  user: any;
  totalXP: number;
  levelNumber: number;
  currentTitle: string;
  currentBadge: string;
}

interface UserProgress {
  progressId: number;
  user: any;
  lesson: any;
  lastAccessed: string;
  isLessonCompleted: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const localUser = JSON.parse(userStr);
    const userId = localUser.userId;

    if (!userId) return;

    try {
      // Fetch thông tin người dùng cơ bản
      const userResponse = await axiosInstance.get(`/api/users/${userId}`);
      const userData: UserProfile = userResponse.data;

      // Fetch dữ liệu XP (totalxp, level_number)
      let userXP: UserXP | null = null;
      try {
        const xpResponse = await axiosInstance.get(`/api/user-xp/${userId}`);
        console.log("XP Response status:", xpResponse.status);
        userXP = xpResponse.data;
        console.log("User XP data:", userXP);
      } catch (error) {
        console.error("Lỗi khi fetch XP:", error);
      }

      // Fetch user progress (completed lessons)
      let completedLessons = 0;
      let streak = 0;
      
      try {
        const progressResponse = await axiosInstance.get(`/api/user-progress/user/${userId}`);
        console.log("========== USER PROGRESS DEBUG ==========");
        console.log("Progress API URL:", `/api/user-progress/user/${userId}`);
        console.log("Progress Response status:", progressResponse.status);
        
        const progressData: UserProgress[] = progressResponse.data;
        console.log("✅ User Progress data RAW:", JSON.stringify(progressData, null, 2));
        console.log("📊 Total records:", progressData.length);
        
        // Log từng record
        progressData.forEach((p, index) => {
          console.log(`Record ${index}:`, {
            isLessonCompleted: p.isLessonCompleted,
            type: typeof p.isLessonCompleted,
            lastAccessed: p.lastAccessed
          });
        });
        
        // Đếm số bài học đã hoàn thành
        completedLessons = progressData.filter(p => p.isLessonCompleted === true).length;
        console.log("✅ Completed lessons:", completedLessons);
        
        // Tính streak (số ngày học liên tiếp)
        streak = calculateStreak(progressData);
        console.log("✅ Streak:", streak);
      } catch (error) {
        console.error("❌ Lỗi khi fetch Progress:", error);
      }

      // Tính progress percent dựa trên level
      const progressPercent = userXP ? Math.min((userXP.totalXP % 200) / 200 * 100, 100) : 0;

      // Cập nhật dữ liệu người dùng với thông tin thực tế
      const updatedData = {
        ...userData,
        dateOfBirth: userData.dateOfBirth || "Chưa cập nhật",
        gender: userData.gender || "Chưa cập nhật",
        learningStats: {
          completedLessons: completedLessons,
          totalPoints: userXP?.totalXP || 0,
          streak: streak,
          level: userXP?.levelNumber || 1,
          progressPercent: Math.round(progressPercent),
        },
      };
      
      console.log("Final user data:", updatedData);
      setUser(updatedData);
    } catch (err) {
      console.error("Lỗi khi fetch user:", err);
      showFeedback("Lỗi khi tải thông tin người dùng", "error");
    }
  };

  // Hàm tính số ngày học liên tiếp
  const calculateStreak = (progressData: UserProgress[]): number => {
    if (progressData.length === 0) return 0;

    // Sắp xếp theo ngày giảm dần
    const sortedProgress = progressData
      .filter(p => p.lastAccessed)
      .map(p => new Date(p.lastAccessed))
      .sort((a, b) => b.getTime() - a.getTime());

    // Lấy các ngày duy nhất
    const uniqueDates = Array.from(new Set(
      sortedProgress.map(date => date.toDateString())
    )).map(dateStr => new Date(dateStr));

    if (uniqueDates.length === 0) return 0;

    // Kiểm tra xem ngày gần nhất có phải hôm nay hoặc hôm qua không
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = new Date(uniqueDates[0]);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Nếu ngày cuối cùng không phải hôm nay hoặc hôm qua, streak = 0
    if (daysDiff > 1) return 0;

    // Đếm số ngày liên tiếp
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i - 1]);
      const prevDate = new Date(uniqueDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Hàm hiển thị thông báo
  const showFeedback = (message: string, type: string) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  // Hàm gọi API cập nhật thông tin người dùng
  const updateUserInDatabase = async (updatedData: Partial<UserProfile>) => {
    if (!user?.userId) return;
    
    try {
      // Loại bỏ learningStats (không có trong DB)
      const { learningStats, avatarImage, ...userDataWithoutStats } = user;
      const mergedData = { ...userDataWithoutStats, ...updatedData };
      
      // ✅ Backend expect camelCase (Java convention)
      const backendData: any = {
        userId: mergedData.userId,
        fullName: mergedData.fullName,
        email: mergedData.email,
        role: mergedData.role,
        phoneNumber: mergedData.phoneNumber,
        address: mergedData.address,
        joinDate: mergedData.joinDate,
        userStatus: 1, // Default active
        userName: mergedData.userName || null,
        password: null, // Don't update password here
      };
      
      // Thêm avatarImage nếu có (từ updatedData có thể có avatarImage)
      if (updatedData.avatarImage) {
        backendData.avatarImage = updatedData.avatarImage;
      } else if (avatarImage && avatarImage !== "/src/assets/avtmacdinh.jpg") {
        backendData.avatarImage = avatarImage;
      }
      
      // Thêm dateOfBirth nếu có
      if (mergedData.dateOfBirth && mergedData.dateOfBirth !== "Chưa cập nhật") {
        backendData.dateOfBirth = mergedData.dateOfBirth;
      }
      
      // Thêm gender nếu có
      if (mergedData.gender && mergedData.gender !== "Chưa cập nhật") {
        backendData.gender = mergedData.gender;
      }
      
      console.log('🔍 Data gửi lên backend (camelCase - Java convention):', JSON.stringify(backendData, null, 2));
      
      const response = await axiosInstance.put(`/api/users/${user.userId}`, backendData);
      
      console.log('📡 Response status:', response.status);
      console.log('✅ Cập nhật thành công:', response.data);
      
      const data = response.data;
      showFeedback("Cập nhật thông tin thành công", "success");
      return data;
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      showFeedback("Lỗi khi cập nhật thông tin", "error");
      throw error;
    }
  };

  const handleEdit = () => {
    setEditForm(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (editForm) {
      try {
        setLoading(true);
        // Gọi API để cập nhật trong database
        const updatedUser = await updateUserInDatabase(editForm);
        
        // Cập nhật state và localStorage
        setUser(updatedUser || editForm);
        
        // Cập nhật localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const localUser = JSON.parse(userStr);
          localStorage.setItem("user", JSON.stringify({
            ...localUser,
            ...editForm,
          }));
        }
        
        setIsEditing(false);
      } catch (error) {
        console.error("Lỗi khi lưu thông tin:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [e.target.name]: e.target.value
      });
    }
  };

  // Thêm hàm xử lý edit từng trường
  const handleEditField = (field: string) => {
    setEditingField(field);
    setFieldValues({
      ...fieldValues,
      [field]: user?.[field as keyof UserProfile] as string || ""
    });
  };

  const handleCancelField = () => {
    setEditingField(null);
  };

  const handleSaveField = async (field: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Lấy giá trị mới
      const value = fieldValues[field];
      
      // Tạo dữ liệu người dùng hoàn chỉnh với trường đã cập nhật
      const updatedUser = { 
        ...user,
        [field]: value || "Chưa cập nhật" 
      };
      
      // Gọi API cập nhật
      await updateUserInDatabase({ [field]: value || "Chưa cập nhật" });
      
      // Cập nhật state
      setUser(updatedUser);
      
      // Cập nhật localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const localUser = JSON.parse(userStr);
        localStorage.setItem("user", JSON.stringify({
          ...localUser,
          [field]: value || "Chưa cập nhật"
        }));
      }
      
    } catch (error) {
      console.error(`Lỗi khi cập nhật trường ${field}:`, error);
    } finally {
      setLoading(false);
      setEditingField(null);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFieldValues({
      ...fieldValues,
      [name]: value
    });
  };

  // Xử lý click nút camera để chọn ảnh
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý upload avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      showFeedback("Đang tải ảnh lên...", "info");

      // Upload lên Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file);
      console.log("Avatar uploaded to Cloudinary:", cloudinaryUrl);

      // Cập nhật vào database - Dùng camelCase như trong Java
      await updateUserInDatabase({ avatarImage: cloudinaryUrl });

      // Cập nhật state và localStorage với camelCase
      const updatedUser = { ...user!, avatarImage: cloudinaryUrl };
      setUser(updatedUser);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const localUser = JSON.parse(userStr);
        localStorage.setItem("user", JSON.stringify({
          ...localUser,
          avatarImage: cloudinaryUrl
        }));
      }

      showFeedback("Cập nhật ảnh đại diện thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error);
      showFeedback(
        error instanceof Error ? error.message : "Lỗi khi tải ảnh lên",
        "error"
      );
    } finally {
      setUploadingAvatar(false);
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Hàm hiển thị giá trị trường với nút edit
  const renderFieldWithEdit = (label: string, field: keyof UserProfile, type: string = 'text') => {
    const value = user?.[field] as string || "Chưa cập nhật";
    const isEditing = editingField === field;

    return (
      <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-600">
        <dt className="text-gray-600 dark:text-gray-400">{label}:</dt>
        {isEditing ? (
          <div className="col-span-2 flex items-center gap-2">
            {type === 'select' && field === 'gender' ? (
              <select
                name={field}
                value={fieldValues[field] || ""}
                onChange={handleFieldChange}
                className="flex-1 px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                disabled={loading}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : type === 'date' ? (
              <input
                type="date"
                name={field}
                value={fieldValues[field] === "Chưa cập nhật" ? "" : fieldValues[field] || ""}
                onChange={handleFieldChange}
                className="flex-1 px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                disabled={loading}
              />
            ) : (
              <input
                type={type}
                name={field}
                value={fieldValues[field] === "Chưa cập nhật" ? "" : fieldValues[field] || ""}
                onChange={handleFieldChange}
                className="flex-1 px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                placeholder={`Nhập ${label.toLowerCase()}`}
                disabled={loading}
              />
            )}
            <button
              onClick={() => handleSaveField(field)}
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              title="Lưu"
              disabled={loading}
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancelField}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              title="Hủy"
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="col-span-2 flex items-center justify-between">
            <dd className={value === "Chưa cập nhật" ? "text-gray-400 italic" : "font-medium"}>
              {value}
            </dd>
            <button
              onClick={() => handleEditField(field)}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded dark:hover:bg-gray-600"
              title="Chỉnh sửa"
              disabled={loading}
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Trạng thái đang tải
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <p className="text-center">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      {/* Thông báo feedback */}
      {feedback.message && (
        <div className={`mb-4 p-3 rounded-md ${
          feedback.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
            : feedback.type === 'info'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
          {feedback.message}
        </div>
      )}
      
      {/* Header với avatar và thông tin cơ bản */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        <div className="relative mb-4 sm:mb-0 sm:mr-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
            {uploadingAvatar ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <img 
                src={user.avatarImage || "/src/assets/avtmacdinh.jpg"} 
                alt={user.fullName} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>  
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button 
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            title="Thay đổi ảnh đại diện"
          >
            <Camera size={16} />
          </button>
        </div>
        
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user.role === "ADMIN" ? "Quản trị viên" : "Học viên"} • Tham gia từ {user.joinDate}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {!isEditing && (
              <>
                <button 
                  onClick={handleEdit}
                  className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Chỉnh sửa tất cả
                </button>
                <button 
                  onClick={() => navigate('/profile/change-password')}
                  className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Lock size={16} /> Thay đổi mật khẩu
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-50 dark:bg-gray-700 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'
              )
            }
          >
            Thông tin cá nhân
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'
              )
            }
          >
            Thống kê học tập
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Panel thông tin cá nhân */}
          <Tab.Panel>
            {isEditing ? (
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={editForm?.fullName || ''} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={editForm?.email || ''} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày sinh</label>
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      value={editForm?.dateOfBirth === "Chưa cập nhật" ? "" : editForm?.dateOfBirth || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giới tính</label>
                    <select 
                      name="gender"
                      value={editForm?.gender === "Chưa cập nhật" ? "" : editForm?.gender || ""} 
                      onChange={handleSelectChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      disabled={loading}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-4">
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
                <dl className="space-y-1">
                  {renderFieldWithEdit("Họ và tên", "fullName")}
                  {renderFieldWithEdit("Email", "email", "email")}
                  {renderFieldWithEdit("Ngày sinh", "dateOfBirth", "date")}
                  {renderFieldWithEdit("Giới tính", "gender", "select")}
                </dl>
              </div>
            )}
          </Tab.Panel>

          {/* Panel thống kê học tập */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <h3 className="text-xl font-semibold mb-4">Tiến độ học tập</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-gray-600 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Bài học đã hoàn thành</div>
                  <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{user.learningStats?.completedLessons || 0}</div>
                </div>
                
                <div className="bg-green-50 dark:bg-gray-600 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Điểm tích lũy</div>
                  <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{user.learningStats?.totalPoints || 0}</div>
                </div>
                
                <div className="bg-orange-50 dark:bg-gray-600 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Số ngày học liên tiếp</div>
                  <div className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">{user.learningStats?.streak || 0}</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-gray-600 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Cấp độ hiện tại</div>
                  <div className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{user.learningStats?.level || 1}</div>
                </div>
              </div>

            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Profile;