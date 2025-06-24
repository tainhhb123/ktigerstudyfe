// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

// Mở rộng kiểu dữ liệu người dùng
interface UserProfile {
  userId?: string;
  fullName: string;
  email: string;
  role?: string;
  avatar?: string;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Thêm dữ liệu mẫu cho demo
        setUser({
          ...userData,
          avatar: userData.avatar || "/images/user/owner.jpg",
          phoneNumber: userData.phoneNumber || "Chưa cập nhật",
          dateOfBirth: userData.dateOfBirth || "Chưa cập nhật",
          address: userData.address || "Chưa cập nhật",
          joinDate: userData.joinDate || "15/06/2023",
          gender: userData.gender || "Chưa cập nhật",
          learningStats: {
            completedLessons: 15,
            totalPoints: 2540,
            streak: 7,
            level: 3,
            progressPercent: 45
          }
        });
      } catch (err) {
        console.error("Lỗi đọc user từ localStorage:", err);
      }
    }
  }, []);

  const handleEdit = () => {
    setEditForm(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editForm) {
      setUser(editForm);
      localStorage.setItem("user", JSON.stringify(editForm));
      setIsEditing(false);
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

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <p>Không có thông tin người dùng. Vui lòng đăng nhập.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      {/* Header với avatar và thông tin cơ bản */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        <div className="relative mb-4 sm:mb-0 sm:mr-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
          </div>
          <button 
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            onClick={() => alert('Chức năng đang phát triển')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
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
              <button 
                onClick={handleEdit}
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa hồ sơ
              </button>
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                    <input 
                      type="text" 
                      name="phoneNumber" 
                      value={editForm?.phoneNumber === "Chưa cập nhật" ? "" : editForm?.phoneNumber || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Nhập số điện thoại"
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giới tính</label>
                    <select 
                      name="gender"
                      value={editForm?.gender === "Chưa cập nhật" ? "" : editForm?.gender || ""} 
                      onChange={(e) => setEditForm(prev => prev ? {...prev, gender: e.target.value} : null)}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={editForm?.address === "Chưa cập nhật" ? "" : editForm?.address || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-4">
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
                  <dl className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Họ và tên:</dt>
                      <dd className="col-span-2 font-medium">{user.fullName}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Email:</dt>
                      <dd className="col-span-2">{user.email}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Ngày sinh:</dt>
                      <dd className="col-span-2">{user.dateOfBirth}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Giới tính:</dt>
                      <dd className="col-span-2">{user.gender}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
                  <dl className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Điện thoại:</dt>
                      <dd className="col-span-2">{user.phoneNumber}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-600 dark:text-gray-400">Địa chỉ:</dt>
                      <dd className="col-span-2">{user.address}</dd>
                    </div>
                  </dl>
                </div>
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
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${user.learningStats?.progressPercent || 0}%` }}
                ></div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h4 className="font-semibold">Học liên tục 7 ngày</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Đạt được 25/06/2023</p>
                </div>
                
                {/* Danh hiệu 2 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg text-center">
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