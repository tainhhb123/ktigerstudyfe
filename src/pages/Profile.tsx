// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Pencil, Check, X, Camera, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Thêm import này

// Mở rộng kiểu dữ liệu người dùng
interface UserProfile {
  userId?: string;
  fullName: string;
  email: string;
  role?: string;
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Profile = () => {
  const navigate = useNavigate(); // Thêm hook navigate
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const localUser = JSON.parse(userStr);
    const userId = localUser.userId;

    if (!userId) return;

    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được thông tin người dùng");
        return res.json();
      })
      .then((data: UserProfile) => {
        // Thêm giá trị mặc định "Chưa cập nhật" cho các trường trống
        const updatedData = {
          ...data,
          dateOfBirth: data.dateOfBirth || "Chưa cập nhật",
          gender: data.gender || "Chưa cập nhật",
          learningStats: data.learningStats || {
            completedLessons: 15,
            totalPoints: 2540,
            streak: 7,
            level: 3,
            progressPercent: 45,
          },
        };
        setUser(updatedData);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch user:", err);
        showFeedback("Lỗi khi tải thông tin người dùng", "error");
      });
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
      // Đảm bảo gửi toàn bộ dữ liệu người dùng
      const completeUserData = { ...user, ...updatedData };
      
      const response = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
        method: 'PUT', // hoặc 'PATCH' tùy vào API của bạn
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeUserData),
      });
      
      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }
      
      const data = await response.json();
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
        <div className={`mb-4 p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
      
      {/* Header với avatar và thông tin cơ bản */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        <div className="relative mb-4 sm:mb-0 sm:mr-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
            <img 
              src={user.avatarImage || "/src/assets/hoHan.png"} 
              alt={user.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>  
          <button 
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            onClick={() => alert('Chức năng đang phát triển')}
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
            Thành tích
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
              
              <h4 className="font-medium mb-2">Tiến độ tổng thể</h4>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6 dark:bg-gray-600">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${user.learningStats?.progressPercent || 0}%` }}
                ></div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Xem chi tiết lịch sử học tập
              </button>
            </div>
          </Tab.Panel>
          
          {/* Panel thành tích */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <h3 className="text-xl font-semibold mb-6">Thành tích đạt được</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {/* Danh hiệu 1 */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg text-center hover:shadow-md transition">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h4 className="font-semibold">Học liên tục 7 ngày</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Đạt được 25/06/2023</p>
                </div>
                
                {/* Danh hiệu 2 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg text-center hover:shadow-md transition">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold">Hoàn thành 10 bài học</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Đạt được 20/06/2023</p>
                </div>
                
                {/* Danh hiệu chưa đạt */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center opacity-50">
                  <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h4 className="font-semibold">Đạt 5000 điểm</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Còn thiếu 2460 điểm</p>
                </div>
                
                {/* Danh hiệu chưa đạt */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center opacity-50">
                  <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h4 className="font-semibold">Đạt cấp độ 5</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Hiện tại: Cấp độ 3</p>
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