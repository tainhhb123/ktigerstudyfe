import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const token = authService.getToken();
  const userRole = authService.getRole()?.toUpperCase();

  // Kiểm tra đã đăng nhập chưa
  if (!token) {
    console.warn('🚫 No token found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  // Kiểm tra role nếu yêu cầu
  if (requiredRole && userRole !== requiredRole) {
    console.warn(`🚫 Access denied. Required: ${requiredRole}, Current: ${userRole}`);
    
    // Nếu là ADMIN cố vào trang USER, redirect về admin dashboard
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    
    // Nếu là USER cố vào trang ADMIN, redirect về learn
    if (userRole === 'USER') {
      return <Navigate to="/learn" replace />;
    }
    
    // Fallback: về signin
    return <Navigate to="/signin" replace />;
  }

  // Cho phép truy cập
  return <>{children}</>;
};

export default ProtectedRoute;
