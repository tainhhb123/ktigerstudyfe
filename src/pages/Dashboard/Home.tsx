// import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
// import { FaUsers, FaBook, FaComments, FaGraduationCap, FaChartLine, FaMicrophone } from "react-icons/fa";

export default function Home() {
  // const [stats] = useState({
  //   totalStudents: 1248,
  //   totalDocuments: 356,
  //   totalConversations: 5847,
  //   todayActiveUsers: 89,
  //   completedLessons: 2134,
  //   avgStudyTime: 45
  // });

  // Metric Card Component
  // const MetricCard = ({ title, value, icon: Icon, color, subtitle, change }: {
  //   title: string;
  //   value: number | string;
  //   icon: React.ComponentType<{ className?: string }>;
  //   color: string;
  //   subtitle?: string;
  //   change?: number;
  // }) => (
  //   <div className="rounded-lg bg-white p-6 shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  //     <div className="flex items-center justify-between">
  //       <div className="flex-1">
  //         <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
  //           {title}
  //         </p>
  //         <p className="text-2xl font-bold text-gray-900 dark:text-white">
  //           {typeof value === 'number' ? value.toLocaleString() : value}
  //         </p>
  //         {subtitle && (
  //           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
  //         )}
  //         {change && (
  //           <div className="flex items-center mt-2">
  //             <span className={`text-xs px-2 py-1 rounded-full ${
  //               change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  //             }`}>
  //               {change > 0 ? '+' : ''}{change}%
  //             </span>
  //             <span className="text-xs text-gray-500 ml-2">vs tháng trước</span>
  //           </div>
  //         )}
  //       </div>
  //       <div className={`p-3 rounded-full ${color}`}>
  //         <Icon className="h-6 w-6 text-white" />
  //       </div>
  //     </div>
  //   </div>
  // );

  // Welcome Card Component
  const WelcomeCard = () => (
    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Korean Study Admin Dashboard
        </h1>
        <p className="text-blue-100">
          Chào mừng bạn đến với hệ thống quản lý học tập tiếng Hàn
        </p>
      </div>
    </div>
  );

  // Quick Stats Card
  // const QuickStatsCard = () => (
  //   <div className="rounded-lg bg-white p-6 shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  //     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
  //       Thống kê hôm nay
  //     </h3>
  //     <div className="space-y-3">
  //       <div className="flex items-center justify-between">
  //         <span className="text-sm text-gray-600 dark:text-gray-400">
  //           Người dùng hoạt động
  //         </span>
  //         <span className="text-lg font-bold text-green-600">
  //           {stats.todayActiveUsers}
  //         </span>
  //       </div>
  //       <div className="flex items-center justify-between">
  //         <span className="text-sm text-gray-600 dark:text-gray-400">
  //           Bài học hoàn thành
  //         </span>
  //         <span className="text-lg font-bold text-blue-600">
  //           {stats.completedLessons}
  //         </span>
  //       </div>
  //       <div className="flex items-center justify-between">
  //         <span className="text-sm text-gray-600 dark:text-gray-400">
  //           Hội thoại mới
  //         </span>
  //         <span className="text-lg font-bold text-purple-600">
  //           156
  //         </span>
  //       </div>
  //       <div className="flex items-center justify-between">
  //         <span className="text-sm text-gray-600 dark:text-gray-400">
  //           Tài liệu chia sẻ
  //         </span>
  //         <span className="text-lg font-bold text-orange-600">
  //           23
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );

  // Recent Activities Card
  // const RecentActivitiesCard = () => (
  //   <div className="rounded-lg bg-white p-6 shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  //     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
  //       Hoạt động gần đây
  //     </h3>
  //     <div className="space-y-3">
  //       <div className="flex items-start space-x-3">
  //         <span className="text-xl">🎓</span>
  //         <div>
  //           <p className="text-sm text-gray-900 dark:text-white">
  //             <span className="font-medium">Nguyễn Văn A</span> hoàn thành bài học
  //           </p>
  //           <p className="text-xs text-gray-500">5 phút trước</p>
  //         </div>
  //       </div>
  //       <div className="flex items-start space-x-3">
  //         <span className="text-xl">💬</span>
  //         <div>
  //           <p className="text-sm text-gray-900 dark:text-white">
  //             <span className="font-medium">Trần Thị B</span> thực hành hội thoại
  //           </p>
  //           <p className="text-xs text-gray-500">12 phút trước</p>
  //         </div>
  //       </div>
  //       <div className="flex items-start space-x-3">
  //         <span className="text-xl">📚</span>
  //         <div>
  //           <p className="text-sm text-gray-900 dark:text-white">
  //             <span className="font-medium">Lê Văn C</span> chia sẻ tài liệu
  //           </p>
  //           <p className="text-xs text-gray-500">30 phút trước</p>
  //         </div>
  //       </div>
  //       <div className="flex items-start space-x-3">
  //         <span className="text-xl">🏆</span>
  //         <div>
  //           <p className="text-sm text-gray-900 dark:text-white">
  //             <span className="font-medium">Phạm Thị D</span> đạt cấp độ mới
  //           </p>
  //           <p className="text-xs text-gray-500">1 giờ trước</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <PageMeta
        title="Korean Study Admin Dashboard"
        description="Trang quản trị hệ thống học tập tiếng Hàn"
      />
      
      <div className="space-y-6">
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Metrics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Tổng học viên"
            value={stats.totalStudents}
            icon={FaUsers}
            color="bg-blue-500"
            subtitle="Đang hoạt động"
            change={12}
          />
          <MetricCard
            title="Tài liệu"
            value={stats.totalDocuments}
            icon={FaBook}
            color="bg-green-500"
            subtitle="Đã chia sẻ"
            change={8}
          />
          <MetricCard
            title="Hội thoại AI"
            value={stats.totalConversations}
            icon={FaComments}
            color="bg-purple-500"
            subtitle="Đã thực hiện"
            change={24}
          />
          <MetricCard
            title="Bài học"
            value={stats.completedLessons}
            icon={FaGraduationCap}
            color="bg-orange-500"
            subtitle="Đã hoàn thành"
            change={15}
          />
          {/* <MetricCard
            title="Thời gian học"
            value={`${stats.avgStudyTime} phút`}
            icon={FaChartLine}
            color="bg-red-500"
            subtitle="Trung bình/ngày"
            change={5}
          />
          <MetricCard
            title="Phiên TTS"
            value={892}
            icon={FaMicrophone}
            color="bg-indigo-500"
            subtitle="Hôm nay"
            change={18}
          /> 
        </div> */}

        {/* Bottom Cards */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickStatsCard />
          <RecentActivitiesCard />
        </div> */}
      </div>
    </>
  );
}
