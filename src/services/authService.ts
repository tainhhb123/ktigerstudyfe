// src/services/authService.ts

const AUTH_TOKEN_KEY = 'authToken';
const USER_ROLE_KEY = 'userRole';
const USER_ID_KEY = 'userId';

interface AuthService {
    setToken(token: string, remember?: boolean): void;
    getToken(): string | null;
    setRole(role: string, remember?: boolean): void;
    getRole(): string | null;
    setUserId(id: number, remember?: boolean): void;
    getUserId(): number | null;
    logout(): void;
}

export const authService: AuthService = {
    /**
     * Lưu token vào localStorage hoặc sessionStorage tuỳ chọn
     * @param token  Chuỗi token nhận được
     * @param remember  Nếu true lưu vào localStorage, false lưu vào sessionStorage
     */
    setToken(token, remember = false) {
        if (remember) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        }
    },

    /**
     * Lấy token (ưu tiên localStorage trước, sau đó đến sessionStorage)
     */
    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Lưu role người dùng
     * @param role  Chuỗi role (ví dụ: 'ADMIN', 'USER', v.v.)
     * @param remember  Nếu true lưu vào localStorage, false lưu vào sessionStorage
     */
    setRole(role, remember = false) {
        if (remember) {
            localStorage.setItem(USER_ROLE_KEY, role);
        } else {
            sessionStorage.setItem(USER_ROLE_KEY, role);
        }
    },

    /**
     * Lấy role người dùng
     */
    getRole() {
        return localStorage.getItem(USER_ROLE_KEY) || sessionStorage.getItem(USER_ROLE_KEY);
    },

    /**
     * Lưu userId
     * @param id  ID người dùng dưới dạng số
     * @param remember  Nếu true lưu vào localStorage, false lưu vào sessionStorage
     */
    setUserId(id, remember = false) {
        const str = id.toString();
        if (remember) {
            localStorage.setItem(USER_ID_KEY, str);
        } else {
            sessionStorage.setItem(USER_ID_KEY, str);
        }
    },

    /**
     * Lấy userId (ưu tiên localStorage trước, sau đó đến sessionStorage)
     */
    getUserId() {
        const stored = localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);
        return stored ? parseInt(stored, 10) : null;
    },

    /**
     * Đăng xuất: xoá tất cả thông tin auth (token, role, userId)
     */
    logout() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);

        localStorage.removeItem(USER_ROLE_KEY);
        sessionStorage.removeItem(USER_ROLE_KEY);

        localStorage.removeItem(USER_ID_KEY);
        sessionStorage.removeItem(USER_ID_KEY);
    },
};
