# 🧪 HƯỚNG DẪN TEST JWT SECURITY CHO USER CONTROLLER

## 📋 **Danh sách endpoints trong UserController**

### **🔴 ADMIN ONLY endpoints:**
- `GET /api/users/learners` - Xem danh sách learners (phân trang)
- `GET /api/users/learners/search` - Tìm kiếm learners
- `POST /api/users` - Tạo user mới
- `PUT /api/users/{id}` - Cập nhật user
- `DELETE /api/users/{id}` - Xóa user
- `POST /api/users/{id}/freeze` - Đóng băng tài khoản
- `POST /api/users/{id}/unfreeze` - Mở băng tài khoản
- `GET /api/users/{id}/status` - Xem trạng thái user
- `POST /api/users/bulk-freeze` - Đóng băng hàng loạt
- `GET /api/users/admin/test` - Test endpoint

### **🟢 AUTHENTICATED endpoints (cần ownership check):**
- `GET /api/users/{id}` - Xem profile (USER xem mình, ADMIN xem tất cả)
- `GET /api/users/email/{email}` - Tìm user theo email (cần ownership check)
- `POST /api/users/change-password` - Đổi mật khẩu (chỉ đổi của mình)

---

## 🔐 **BƯỚC 1: Login và lấy JWT Token**

### **Login với USER account:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trantantai310803@gmail.com",
    "password": "123456"
  }'
```

**Response:**
```json
{
  "userId": 10,
  "email": "trantantai310803@gmail.com",
  "fullName": "Tài TKQN",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImVtYWlsIjoidHJhbnRhbnRhaTMxMDgwM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczNjAwNDAwMCwiZXhwIjoxNzM2MDkwNDAwfQ.xxxxx"
}
```

**💾 Lưu token này vào biến:**
```bash
USER_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImVtYWlsIjoidHJhbnRhbnRhaTMxMDgwM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczNjAwNDAwMCwiZXhwIjoxNzM2MDkwNDAwfQ.xxxxx"
```

### **Login với ADMIN account:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ktiger.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "userId": 1,
  "email": "admin@ktiger.com",
  "fullName": "Admin User",
  "role": "ADMIN",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBrdGlnZXIuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzM2MDA0MDAwLCJleHAiOjE3MzYwOTA0MDB9.yyyyy"
}
```

**💾 Lưu token này vào biến:**
```bash
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBrdGlnZXIuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzM2MDA0MDAwLCJleHAiOjE3MzYwOTA0MDB9.yyyyy"
```

---

## ✅ **BƯỚC 2: Test ADMIN Endpoints**

### **Test 2.1: ADMIN xem danh sách learners**
```bash
curl -X GET "http://localhost:8080/api/users/learners?page=0&size=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - Trả về danh sách learners với phân trang

**Response:**
```json
{
  "content": [
    {
      "userId": 10,
      "email": "trantantai310803@gmail.com",
      "fullName": "Tài TKQN",
      "role": "USER",
      "userStatus": 1
    },
    ...
  ],
  "totalElements": 50,
  "totalPages": 10,
  "size": 5,
  "number": 0
}
```

---

### **Test 2.2: USER cố truy cập endpoint ADMIN**
```bash
curl -X GET "http://localhost:8080/api/users/learners?page=0&size=5" \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Kết quả mong đợi:** ❌ **403 Forbidden** - USER không có quyền

**Response:**
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/users/learners"
}
```

---

### **Test 2.3: ADMIN đóng băng user**
```bash
curl -X POST http://localhost:8080/api/users/15/freeze \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - User 15 bị đóng băng

**Response:**
```json
{
  "success": true,
  "message": "Tài khoản đã được đóng băng thành công",
  "userId": 15,
  "userStatus": 0,
  "userData": {
    "userId": 15,
    "email": "user15@example.com",
    "fullName": "User 15",
    "userStatus": 0
  }
}
```

---

### **Test 2.4: ADMIN mở băng user**
```bash
curl -X POST http://localhost:8080/api/users/15/unfreeze \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - User 15 được kích hoạt lại

**Response:**
```json
{
  "success": true,
  "message": "Tài khoản đã được kích hoạt thành công",
  "userId": 15,
  "userStatus": 1,
  "userData": {
    "userId": 15,
    "email": "user15@example.com",
    "fullName": "User 15",
    "userStatus": 1
  }
}
```

---

### **Test 2.5: ADMIN xem trạng thái user**
```bash
curl -X GET http://localhost:8080/api/users/10/status \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - Trả về trạng thái user

**Response:**
```json
{
  "userId": 10,
  "userStatus": 1,
  "statusText": "Hoạt động",
  "email": "trantantai310803@gmail.com",
  "fullName": "Tài TKQN"
}
```

---

### **Test 2.6: ADMIN đóng băng hàng loạt**
```bash
curl -X POST http://localhost:8080/api/users/bulk-freeze \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": [15, 16, 17]
  }'
```

**Kết quả mong đợi:** ✅ **200 OK** - Đóng băng 3 users

**Response:**
```json
{
  "success": true,
  "message": "Đóng băng hàng loạt hoàn tất",
  "successCount": 3,
  "failCount": 0,
  "totalProcessed": 3
}
```

---

## 🟢 **BƯỚC 3: Test AUTHENTICATED Endpoints (Ownership Check)**

### **Test 3.1: USER xem profile của chính mình**
```bash
# USER với userId = 10 xem profile của mình
curl -X GET http://localhost:8080/api/users/10 \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - USER được xem profile của mình

**Response:**
```json
{
  "userId": 10,
  "email": "trantantai310803@gmail.com",
  "fullName": "Tài TKQN",
  "role": "USER",
  "userStatus": 1
}
```

---

### **Test 3.2: USER cố xem profile của người khác**
```bash
# USER với userId = 10 cố xem profile của userId = 15
curl -X GET http://localhost:8080/api/users/15 \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Kết quả mong đợi:** ❌ **403 Forbidden** - USER không được xem profile người khác

**⚠️ CHÚ Ý:** Phải implement ownership check trong **UserService.getUserById()**

**Response (nếu đã implement ownership check):**
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Bạn chỉ có thể xem thông tin của chính mình"
}
```

---

### **Test 3.3: ADMIN xem profile của bất kỳ ai**
```bash
# ADMIN xem profile của userId = 15
curl -X GET http://localhost:8080/api/users/15 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Kết quả mong đợi:** ✅ **200 OK** - ADMIN được xem tất cả profiles

**Response:**
```json
{
  "userId": 15,
  "email": "user15@example.com",
  "fullName": "User 15",
  "role": "USER",
  "userStatus": 1
}
```

---

### **Test 3.4: USER đổi password của chính mình**
```bash
curl -X POST http://localhost:8080/api/users/change-password \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 10,
    "oldPassword": "123456",
    "newPassword": "newpass123"
  }'
```

**Kết quả mong đợi:** ✅ **200 OK** - Đổi password thành công

**⚠️ CHÚ Ý:** Phải implement ownership check trong **UserService.changePassword()** - USER chỉ đổi password của mình

**Response:**
```json
"Đổi mật khẩu thành công"
```

---

### **Test 3.5: USER cố đổi password của người khác**
```bash
curl -X POST http://localhost:8080/api/users/change-password \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 15,
    "oldPassword": "oldpass",
    "newPassword": "newpass"
  }'
```

**Kết quả mong đợi:** ❌ **403 Forbidden** - USER không được đổi password người khác

**⚠️ CHÚ Ý:** Service phải kiểm tra: `userId trong request == userId từ JWT token`

**Response (nếu đã implement ownership check):**
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Bạn chỉ có thể đổi mật khẩu của chính mình"
}
```

---

## ❌ **BƯỚC 4: Test Security Cases**

### **Test 4.1: Gửi fake token**
```bash
curl -X GET http://localhost:8080/api/users/learners \
  -H "Authorization: Bearer fake-token-12345"
```

**Kết quả mong đợi:** ❌ **401 Unauthorized** - Token không hợp lệ

**Response:**
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

---

### **Test 4.2: Không gửi token**
```bash
curl -X GET http://localhost:8080/api/users/learners
```

**Kết quả mong đợi:** ❌ **401 Unauthorized** - Thiếu token

**Response:**
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing authorization token"
}
```

---

### **Test 4.3: Fake localStorage trên frontend**

**Bước 1:** Mở DevTools Console trên trình duyệt
```javascript
// User fake role ADMIN trong localStorage
localStorage.setItem('userRole', 'ADMIN');
localStorage.setItem('userId', '999');
```

**Bước 2:** Truy cập trang Admin Dashboard trên frontend
- Frontend ProtectedRoute sẽ cho phép vào (vì chỉ check localStorage)

**Bước 3:** Frontend gọi API với token thật (của USER role)
```javascript
fetch('http://localhost:8080/api/users/learners', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
```

**Kết quả mong đợi:** ❌ **403 Forbidden** - Backend từ chối vì token có role = USER

**✅ Đây là lý do tại sao JWT security ở backend là BẮT BUỘC!**

---

### **Test 4.4: Token hết hạn**
```bash
# Đợi 24 giờ (hoặc thay đổi jwt.expiration thành 60000ms = 1 phút để test)
curl -X GET http://localhost:8080/api/users/learners \
  -H "Authorization: Bearer $EXPIRED_TOKEN"
```

**Kết quả mong đợi:** ❌ **401 Unauthorized** - Token expired

**Response:**
```json
{
  "timestamp": "2026-01-05T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token has expired"
}
```

---

## 🛠️ **BƯỚC 5: Implement Ownership Check trong UserService**

**⚠️ QUAN TRỌNG:** Các test ownership check chỉ hoạt động nếu bạn đã implement logic kiểm tra trong Service layer.

### **Cách implement trong UserService.getUserById():**

```java
@Override
public UserResponse getUserById(Long id) {
    // 1️⃣ Lấy thông tin user hiện tại từ SecurityContext
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal()); // userId từ JWT
    
    // 2️⃣ Kiểm tra role của user hiện tại
    boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    
    // 3️⃣ Kiểm tra ownership: USER chỉ xem mình, ADMIN xem tất cả
    if (!isAdmin && !id.equals(currentUserId)) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, 
            "Bạn chỉ có thể xem thông tin của chính mình"
        );
    }
    
    // 4️⃣ Nếu pass ownership check, tiếp tục xử lý
    User user = userRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("User not found"));
    
    return UserMapper.toResponse(user);
}
```

### **Áp dụng pattern tương tự cho:**
- `getUserByEmail()` - Kiểm tra email == email của user đang login
- `changePassword()` - Kiểm tra userId trong request == userId từ token

---

## 📊 **Bảng tổng hợp Test Cases**

| Test Case | Endpoint | Token | Expected Result |
|-----------|----------|-------|-----------------|
| Login USER | POST /api/auth/signin | None | ✅ 200 OK + JWT token |
| Login ADMIN | POST /api/auth/signin | None | ✅ 200 OK + JWT token |
| ADMIN xem learners | GET /api/users/learners | ADMIN | ✅ 200 OK |
| USER xem learners | GET /api/users/learners | USER | ❌ 403 Forbidden |
| ADMIN đóng băng user | POST /api/users/{id}/freeze | ADMIN | ✅ 200 OK |
| USER đóng băng user | POST /api/users/{id}/freeze | USER | ❌ 403 Forbidden |
| USER xem profile mình | GET /api/users/{id} | USER (id=mình) | ✅ 200 OK |
| USER xem profile khác | GET /api/users/{id} | USER (id≠mình) | ❌ 403 Forbidden (nếu có ownership check) |
| ADMIN xem profile bất kỳ | GET /api/users/{id} | ADMIN | ✅ 200 OK |
| USER đổi pass mình | POST /api/users/change-password | USER (userId=mình) | ✅ 200 OK |
| USER đổi pass người khác | POST /api/users/change-password | USER (userId≠mình) | ❌ 403 Forbidden (nếu có ownership check) |
| Fake token | Any protected endpoint | fake-token | ❌ 401 Unauthorized |
| No token | Any protected endpoint | None | ❌ 401 Unauthorized |
| Expired token | Any protected endpoint | expired-token | ❌ 401 Unauthorized |
| Fake localStorage | Frontend Admin page → API call | USER token | ❌ 403 Forbidden |

---

## ✅ **Checklist hoàn thành**

- [ ] Đã test login với USER và ADMIN account
- [ ] Đã test ADMIN endpoints với ADMIN token → ✅ 200 OK
- [ ] Đã test ADMIN endpoints với USER token → ❌ 403 Forbidden
- [ ] Đã test USER xem profile của mình → ✅ 200 OK
- [ ] Đã test USER xem profile người khác → ❌ 403 Forbidden
- [ ] Đã test ADMIN xem profile bất kỳ → ✅ 200 OK
- [ ] Đã test fake token → ❌ 401 Unauthorized
- [ ] Đã test không gửi token → ❌ 401 Unauthorized
- [ ] Đã test fake localStorage → Backend vẫn từ chối ✅
- [ ] Đã implement ownership check trong UserService
- [ ] Đã test với token hết hạn → ❌ 401 Unauthorized

---

## 🎯 **Kết luận**

**JWT Security đã hoạt động nếu:**
1. ✅ USER không thể truy cập ADMIN endpoints (403 Forbidden)
2. ✅ Fake token bị từ chối (401 Unauthorized)
3. ✅ Fake localStorage trên frontend vẫn bị backend chặn (403 Forbidden)
4. ✅ Ownership check hoạt động (USER chỉ xem/sửa data của mình)
5. ✅ Token hết hạn bị từ chối (401 Unauthorized)

**Bạn đã bảo vệ thành công backend API với JWT! 🎉🔐**
