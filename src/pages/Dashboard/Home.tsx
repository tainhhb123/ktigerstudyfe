import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  TrendingUp,
  UserCheck,
  Clock,
  Award
} from "lucide-react";
import axiosInstance from "../../services/axiosConfig";
import { examApi } from "../../services/ExamApi";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  frozenUsers: number;
  totalExams: number;
  activeExams: number;
  totalLessons: number;
  totalDocuments: number;
  totalAttempts: number;
}

interface RecentUser {
  userId: number;
  fullName: string;
  email: string;
  joinDate: string;
  userStatus: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    frozenUsers: 0,
    totalExams: 0,
    activeExams: 0,
    totalLessons: 0,
    totalDocuments: 0,
    totalAttempts: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get admin name from localStorage
  const getAdminName = () => {
    const fullName = localStorage.getItem("fullName");
    const userProfile = localStorage.getItem("userProfile");
    
    if (fullName) return fullName;
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        return profile.fullName || "Admin";
      } catch {
        return "Admin";
      }
    }
    return "Admin";
  };
  
  const adminName = getAdminName();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users stats
      const usersRes = await axiosInstance.get("/api/users/learners?page=0&size=100");
      const allUsers = usersRes.data.content || [];
      const activeUsers = allUsers.filter((u: any) => u.userStatus === 1).length;
      const frozenUsers = allUsers.filter((u: any) => u.userStatus === 0).length;
      
      // Get recent users (last 5)
      const recent = allUsers.slice(0, 5);
      setRecentUsers(recent);

      // Fetch exams
      const examsRes = await examApi.getAllExams();
      const activeExams = examsRes.filter((e: any) => e.isActive).length;

      // Fetch lessons (assume API exists)
      let totalLessons = 0;
      try {
        const lessonsRes = await axiosInstance.get("/api/lessons");
        totalLessons = lessonsRes.data.length || 0;
      } catch {
        totalLessons = 0;
      }

      // Fetch documents
      let totalDocuments = 0;
      try {
        const docsRes = await axiosInstance.get("/api/document-lists");
        totalDocuments = docsRes.data.length || 0;
      } catch {
        totalDocuments = 0;
      }

      setStats({
        totalUsers: allUsers.length,
        activeUsers,
        frozenUsers,
        totalExams: examsRes.length,
        activeExams,
        totalLessons,
        totalDocuments,
        totalAttempts: 0 // Can add exam attempt stats later
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Metric Card Component
  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle,
    trend
  }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: string;
  }) => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-400">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Welcome Card Component
  const WelcomeCard = () => (
    <div className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Xin chào, {adminName}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Chào mừng bạn đến với KTiger Study Admin Dashboard
          </p>
          <p className="text-blue-200 text-sm mt-2">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  // Recent Users Card
  const RecentUsersCard = () => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Học viên mới nhất
        </h3>
        <UserCheck className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500">Đang tải...</p>
        ) : recentUsers.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có học viên nào</p>
        ) : (
          recentUsers.map((user) => (
            <div key={user.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.userStatus === 1 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {user.userStatus === 1 ? 'Active' : 'Frozen'}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Quick Actions Card
  const QuickActionsCard = () => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Thao tác nhanh
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => window.location.href = '/admin/thongtinhocvien'}
          className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors text-left"
        >
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Quản lý học viên</p>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/exams'}
          className="p-4 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors text-left"
        >
          <FileText className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Quản lý bài thi</p>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/danhsachbaihoc'}
          className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 transition-colors text-left"
        >
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Quản lý bài học</p>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/tailieuhocvien'}
          className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 transition-colors text-left"
        >
          <Award className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Quản lý tài liệu</p>
        </button>
      </div>
    </div>
  );

  // System Status Card
  const SystemStatusCard = () => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Trạng thái hệ thống
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">API Server</span>
          </div>
          <span className="text-sm font-medium text-green-600">Online</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
          </div>
          <span className="text-sm font-medium text-green-600">Connected</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">99.9%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Excellent</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageMeta
        title="KTiger Study Admin Dashboard"
        description="Trang quản trị hệ thống học tập tiếng Hàn"
      />
      
      <div className="space-y-6">
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Tổng học viên"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle={`${stats.activeUsers} đang hoạt động`}
            trend={stats.activeUsers > 0 ? `${((stats.activeUsers/stats.totalUsers)*100).toFixed(0)}% active` : undefined}
          />
          <MetricCard
            title="Bài thi"
            value={stats.totalExams}
            icon={FileText}
            color="bg-gradient-to-br from-green-500 to-green-600"
            subtitle={`${stats.activeExams} đang mở`}
          />
          <MetricCard
            title="Bài học"
            value={stats.totalLessons}
            icon={BookOpen}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            subtitle="Tổng bài học"
          />
          <MetricCard
            title="Tài liệu"
            value={stats.totalDocuments}
            icon={Award}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            subtitle="Đã chia sẻ"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentUsersCard />
          </div>
          <div className="space-y-6">
            <SystemStatusCard />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsCard />
      </div>
    </>
  );
}
