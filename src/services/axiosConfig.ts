import axios from 'axios';

// Tạo axios instance với base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Backend URL
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR - Tự động thêm JWT token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (thử nhiều key để tương thích)
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    
    if (token) {
      // Thêm Authorization header với Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached to request:', config.url);
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Xử lý lỗi 401/403
axiosInstance.interceptors.response.use(
  (response) => {
    // Response thành công, trả về data
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Token không hợp lệ hoặc hết hạn
        console.error('❌ 401 Unauthorized - Token invalid or expired');
        
        // Xóa token cũ (xóa cả 2 key để đảm bảo)
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
        
        // Redirect về trang login
        window.location.href = '/auth/signin';
      } else if (status === 403) {
        // Không có quyền truy cập
        console.error('❌ 403 Forbidden - Access denied');
        console.error('URL:', error.config?.url);
        console.error('Backend chưa có @PreAuthorize annotation hoặc ownership check failed');
        // Không hiện alert vì gây phiền nhiễu, chỉ log lỗi
      }
    } else {
      console.error('❌ Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
