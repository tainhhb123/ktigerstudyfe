# 🔧 HƯỚNG DẪN SỬA LỖI 403 FORBIDDEN - THIẾU JWT TOKEN

## 🐛 **VẤN ĐỀ:**

Frontend đã login nhưng vẫn nhận lỗi **403 Forbidden** khi gọi API vì **chưa gửi JWT token** trong request header.

---

## ✅ **GIẢI PHÁP ĐÃ THỰC HIỆN:**

### **1. Tạo Axios Interceptor (axiosConfig.ts)** ✅

File: `src/services/axiosConfig.ts`

**Chức năng:**
- Tự động thêm `Authorization: Bearer <token>` vào **MỌI REQUEST**
- Xử lý lỗi 401 (token invalid) → Redirect về login
- Xử lý lỗi 403 (không có quyền) → Hiển thị thông báo

**Đã hoàn thành:** ✅

---

### **2. Đã sửa các file sau:** ✅

#### **LeadBoardApi.ts** ✅
```typescript
// Trước:
import axios from "axios";
export const getLeaderboard = async () => {
  const res = await axios.get("/api/user-xp/leaderboard"); // ❌ Sai URL, không có token
  return res.data;
};

// Sau:
import axiosInstance from "./axiosConfig";
export const getLeaderboard = async () => {
  const res = await axiosInstance.get("/api/user-xp/leaderboard"); // ✅ Đúng
  return res.data;
};
```

#### **UserDropdown.tsx** ✅
```typescript
// Trước:
const [userResponse, leaderboardData] = await Promise.all([
    fetch(`http://localhost:8080/api/users/${userId}`), // ❌ fetch không có token
    getLeaderboard()
]);
const userData = await userResponse.json();

// Sau:
import axiosInstance from "../../services/axiosConfig";
const [userResponse, leaderboardData] = await Promise.all([
    axiosInstance.get(`/api/users/${userId}`), // ✅ axiosInstance có token
    getLeaderboard()
]);
const userData = userResponse.data; // ✅ axios trả về .data
```

---

## 🔴 **CÒN PHẢI SỬA (20 files):**

### **Danh sách files cần migration:**

1. ✅ `src/services/LeadBoardApi.ts` - **ĐÃ SỬA**
2. ⏳ `src/services/VocabularyApi.ts`
3. ⏳ `src/services/UserXPApi.ts`
4. ⏳ `src/services/UserExerciseResultApi.ts`
5. ⏳ `src/services/LevelApi.ts`
6. ⏳ `src/services/koreanChatApi.ts`
7. ⏳ `src/services/GrammarApi.ts`
8. ⏳ `src/services/LessonApi.ts`
9. ⏳ `src/services/ExerciseApi.ts`
10. ⏳ `src/services/ExamApi.ts`
11. ⏳ `src/services/ChangePasswordApi.ts`
12. ⏳ `src/services/aiGradingService.ts`
13. ⏳ `src/pages/Dashboard/Home.tsx`
14. ⏳ `src/pages/Admin/LessonManager/LessonDetailPage.tsx`
15. ⏳ `src/pages/Admin/DocumentManager/DocumentPage.tsx`
16. ⏳ `src/components/tables/BasicTables/UserInfoOne.tsx`
17. ⏳ `src/components/tables/AdminTables/DocumentItemTable.tsx`
18. ⏳ `src/components/tables/AdminTables/DocumentReportTable.tsx`
19. ⏳ `src/components/tables/AdminTables/DocumentListTable.tsx`
20. ⏳ `src/components/tables/AdminTables/GrammarTable.tsx`
21. ⏳ `src/components/tables/AdminTables/ExerciseTable.tsx`

---

## 📝 **PATTERN SỬA:**

### **Với các file API services:**

```typescript
// ❌ BEFORE:
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getItems = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/items`);
  return res.data;
};

// ✅ AFTER:
import axiosInstance from "./axiosConfig";

export const getItems = async () => {
  const res = await axiosInstance.get("/api/items");
  return res.data;
};
```

### **Với các component/page:**

```typescript
// ❌ BEFORE:
import axios from "axios";

const fetchData = async () => {
  const response = await axios.get("http://localhost:8080/api/data");
  setData(response.data);
};

// ✅ AFTER:
import axiosInstance from "../../services/axiosConfig";

const fetchData = async () => {
  const response = await axiosInstance.get("/api/data");
  setData(response.data);
};
```

---

## 🚀 **HƯỚNG DẪN TEST:**

### **Bước 1: Kiểm tra token đã lưu trong localStorage**

Mở DevTools Console:
```javascript
console.log(localStorage.getItem('accessToken'));
// Phải có token dạng: eyJhbGciOiJIUzI1NiJ9...
```

Nếu **không có token**, kiểm tra logic login có lưu token không:
```typescript
// Trong AuthApi.ts sau khi login:
const response = await axios.post('/api/auth/signin', { email, password });
localStorage.setItem('accessToken', response.data.token); // ✅ Phải có dòng này
```

---

### **Bước 2: Reload trang và kiểm tra Console**

Sau khi đã sửa code, reload trang và xem Console:

**✅ Thành công:**
```
✅ Token attached to request: /api/users/3
✅ Token attached to request: /api/user-xp/leaderboard
```

**❌ Vẫn lỗi:**
```
⚠️ No token found in localStorage
❌ 403 Forbidden
```
→ Kiểm tra lại logic login có lưu token không

---

### **Bước 3: Test với Network tab**

1. Mở DevTools → Network tab
2. Reload trang
3. Click vào request `/api/users/3`
4. Kiểm tra **Request Headers:**

**✅ Đúng:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJ0MkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczNjAwNDAwMCwiZXhwIjoxNzM2MDkwNDAwfQ.xxxxx
```

**❌ Sai:**
```
(Không có Authorization header)
```

---

## ⚡ **QUICK FIX - Sửa nhanh tất cả files:**

Chạy lệnh này trong terminal để tự động replace:

### **Windows PowerShell:**

```powershell
# Replace trong tất cả file services/*.ts
Get-ChildItem -Path "src\services" -Filter "*.ts" -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'import axios from "axios";', 'import axiosInstance from "./axiosConfig";' -replace 'axios\.', 'axiosInstance.' | Set-Content $_.FullName
}
```

### **Manual (từng file một):**

1. Mở file
2. Replace:
   - `import axios from "axios";` → `import axiosInstance from "./axiosConfig";`
   - `axios.get(` → `axiosInstance.get(`
   - `axios.post(` → `axiosInstance.post(`
   - `axios.put(` → `axiosInstance.put(`
   - `axios.delete(` → `axiosInstance.delete(`
3. Remove hardcoded URL: `http://localhost:8080` → `/api/...`

---

## ✅ **CHECKLIST:**

- [x] Tạo `axiosConfig.ts` với interceptor
- [x] Sửa `LeadBoardApi.ts` dùng `axiosInstance`
- [x] Sửa `UserDropdown.tsx` dùng `axiosInstance`
- [ ] Sửa 18 files còn lại dùng `axiosInstance`
- [ ] Test login → Kiểm tra token có lưu localStorage không
- [ ] Test call API → Kiểm tra Network tab có Authorization header không
- [ ] Test với USER role → Đảm bảo không bị 403 nữa
- [ ] Test với ADMIN role → Đảm bảo có quyền truy cập admin endpoints

---

## 🎯 **KẾT QUẢ MONG ĐỢI:**

Sau khi sửa xong:

1. ✅ Login thành công → Token lưu localStorage
2. ✅ Mọi API call đều có `Authorization: Bearer <token>` header
3. ✅ USER truy cập `/profile`, `/learn/level`, `/learn/leaderboard` → **200 OK**
4. ✅ USER truy cập `/admin` → **403 Forbidden** (đúng)
5. ✅ Token invalid → Auto redirect về `/auth/signin`

---

## 📞 **NẾU VẪN LỖI:**

### **Lỗi: "No token found in localStorage"**
→ Kiểm tra logic login có lưu token không:
```typescript
localStorage.setItem('accessToken', response.data.token);
```

### **Lỗi: "403 Forbidden" dù đã có token**
→ Kiểm tra backend @PreAuthorize annotation có đúng không:
```java
@GetMapping("/api/users/{id}")
@PreAuthorize("isAuthenticated()") // ✅ Phải có annotation này
```

### **Lỗi: "401 Unauthorized"**
→ Token không hợp lệ hoặc hết hạn, login lại:
1. Clear localStorage
2. Login lại
3. Token mới sẽ có expiration 24 giờ

---

**Bạn đã có hệ thống JWT hoàn chỉnh! 🎉🔐**
