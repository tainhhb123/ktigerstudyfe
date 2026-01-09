# 🧪 HƯỚNG DẪN TEST SPRING SECURITY + JWT BẰNG POSTMAN

## 📋 MỤC LỤC
1. [Test PUBLIC Endpoints (không cần JWT)](#1-test-public-endpoints)
2. [Test PROTECTED Endpoints (cần JWT)](#2-test-protected-endpoints)
3. [Test JWT Invalid/Expired](#3-test-jwt-invalidexpired)
4. [Giải thích Response Codes](#4-giải-thích-response-codes)
5. [Thay đổi Database](#5-thay-đổi-database)

---

## 1. TEST PUBLIC ENDPOINTS (không cần JWT) ✅

### 🔓 Các endpoint KHÔNG cần JWT trong project này:
```java
/api/auth/signup
/api/auth/signin
/api/auth/google-signin
/api/auth/forgot-password
/api/auth/reset-password
/api/public/**
```

### ✅ TEST 1.1: Đăng ký (Sign Up)
**Request:**
```http
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser123@gmail.com",
  "password": "Test@123456",
  "fullName": "Test User"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 15,
  "username": "testuser123",
  "email": "testuser123@gmail.com",
  "role": "USER"
}
```

**✅ Thay đổi DB:**
- ✅ **CÓ** - Thêm 1 record vào table `user`
- ✅ `password` được hash (BCrypt)
- ✅ `role` = "USER"
- ✅ `created_at` = thời gian hiện tại

---

### ✅ TEST 1.2: Đăng nhập (Sign In)
**Request:**
```http
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "usernameOrEmail": "testuser123",
  "password": "Test@123456"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNSIsImlhdCI6MTY...",
  "userId": 15,
  "username": "testuser123",
  "email": "testuser123@gmail.com",
  "role": "USER"
}
```

**✅ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Chỉ đọc dữ liệu từ DB để verify
- Không thêm/sửa/xóa gì

**💡 LƯU Ý:**
- ✅ Copy `token` từ response → dùng cho các API cần JWT
- ✅ Token hợp lệ trong 24 giờ (86400000ms)

---

### ✅ TEST 1.3: Quên mật khẩu (Forgot Password)
**Request:**
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "testuser123@gmail.com",
  "platform": "web"
}
```

**Expected Response (200 OK):**
```json
"Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư."
```

**✅ Thay đổi DB:**
- ✅ **CÓ** - Thêm 1 record vào table `password_reset_token`
- ✅ `token` = UUID random (e.g., "e947102d-1579-4310-9421-e3b11909f36d")
- ✅ `user_id` = 15
- ✅ `expiry_date` = hiện tại + 15 phút

**Backend Console:**
```
========== 📧 RESET PASSWORD LINK ==========
📧 Email: testuser123@gmail.com
🔑 Token: e947102d-1579-4310-9421-e3b11909f36d
🔗 Link: http://localhost:5173/reset-password?token=e947102d-1579-4310-9421-e3b11909f36d
⏰ Expiry: 2026-01-08T15:45:30.123 (15 phút)
============================================
```

---

### ✅ TEST 1.4: Đặt lại mật khẩu (Reset Password)
**Request:**
```http
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
  "token": "e947102d-1579-4310-9421-e3b11909f36d",
  "newPassword": "NewPassword@123"
}
```

**Expected Response (200 OK):**
```json
"Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại."
```

**✅ Thay đổi DB:**
- ✅ **CÓ** - Update table `user`:
  - `password` = hash mới của "NewPassword@123"
  - `updated_at` = thời gian hiện tại
- ✅ **CÓ** - Delete token từ `password_reset_token` (đã sử dụng)

---



---

### ✅ TEST 2.1: Lấy thông tin user (CÓ JWT hợp lệ)
**Request:**
```http
GET http://localhost:8080/api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNSIsImlhdCI6MTY...
```

**Cách thêm JWT trong Postman:**
1. Click tab **Authorization**
2. Type: chọn **Bearer Token**
3. Token: paste JWT từ response signin/signup
4. Send request

**Expected Response (200 OK):**
```json
{
  "userId": 15,
  "username": "testuser123",
  "email": "testuser123@gmail.com",
  "fullName": "Test User",
  "role": "USER",
  "avatarUrl": null,
  "createdAt": "2026-01-08T10:30:00"
}
```

**✅ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Chỉ đọc dữ liệu

---

### ✅ TEST 2.2: Update progress (CÓ JWT hợp lệ)
**Request:**
```http
POST http://localhost:8080/api/user/progress
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNSIsImlhdCI6MTY...
Content-Type: application/json

{
  "lessonId": 5,
  "completed": true,
  "score": 95
}
```

**Expected Response (200 OK):**
```json
{
  "progressId": 42,
  "userId": 15,
  "lessonId": 5,
  "completed": true,
  "score": 95,
  "completedAt": "2026-01-08T14:30:00"
}
```

**✅ Thay đổi DB:**
- ✅ **CÓ** - Thêm/Update record trong table `user_progress`
- ✅ `user_id` = 15 (từ JWT)
- ✅ `lesson_id` = 5
- ✅ `completed` = true
- ✅ `score` = 95

---

## 3. TEST JWT INVALID/EXPIRED ❌

### ❌ TEST 3.1: KHÔNG GỬI JWT (Missing Token)
**Request:**
```http
GET http://localhost:8080/api/user/profile
(Không có header Authorization)
```

**Expected Response (403 Forbidden):**
```json
{
  "timestamp": "2026-01-08T14:35:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/user/profile"
}
```

**❌ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Request bị chặn bởi JWT Filter
- ❌ Controller method KHÔNG được gọi
- ❌ Service/Repository KHÔNG được gọi

**🔍 Backend Log:**
```
🛡️  JWT Filter: No JWT token found in request header
❌ Access denied for: /api/user/profile
```

---

### ❌ TEST 3.2: JWT SAI FORMAT (Malformed Token)
**Request:**
```http
GET http://localhost:8080/api/user/profile
Authorization: Bearer abc123invalid_token
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2026-01-08T14:36:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is invalid",
  "path": "/api/user/profile"
}
```

**❌ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Request bị từ chối tại JWT Filter
- ❌ Không có thay đổi gì trong DB

**🔍 Backend Log:**
```
⚠️  JWT validation failed: io.jsonwebtoken.MalformedJwtException: Invalid JWT token
❌ Rejecting request due to invalid token
```

---

### ❌ TEST 3.3: JWT HẾT HẠN (Expired Token)
**Request:**
```http
GET http://localhost:8080/api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...[token cũ đã quá 24h]
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2026-01-08T14:37:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token has expired",
  "path": "/api/user/profile"
}
```

**❌ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Token hết hạn → không thể xác thực
- ❌ User phải đăng nhập lại để lấy token mới

**🔍 Backend Log:**
```
⚠️  JWT validation failed: io.jsonwebtoken.ExpiredJwtException
⏰ Token expired at: 2026-01-07T14:30:00 (24h ago)
❌ User must sign in again to get new token
```

---

### ❌ TEST 3.4: JWT CỦA USER KHÁC (Unauthorized Access)
**Request:**
```http
GET http://localhost:8080/api/user/15/progress
Authorization: Bearer [JWT của user_id = 20]
```

**Expected Response (403 Forbidden):**
```json
{
  "timestamp": "2026-01-08T14:38:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "path": "/api/user/15/progress"
}
```

**❌ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Ownership check failed
- ❌ User 20 không thể xem progress của User 15
- ❌ Service layer throw UnauthorizedException

**🔍 Backend Log:**
```
⚠️  Ownership check failed: User 20 tried to access User 15's data
❌ Forbidden: Unauthorized access attempt
```

---

### ❌ TEST 3.5: USER role truy cập ADMIN endpoint
**Request:**
```http
GET http://localhost:8080/api/admin/users
Authorization: Bearer [JWT của USER (không phải ADMIN)]
```

**Expected Response (403 Forbidden):**
```json
{
  "timestamp": "2026-01-08T14:39:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access is denied. Required role: ADMIN",
  "path": "/api/admin/users"
}
```

**❌ Thay đổi DB:**
- ❌ **KHÔNG CÓ** - Role check failed at Security Config level
- ❌ `.requestMatchers("/api/admin/**").hasRole("ADMIN")` chặn request

**🔍 Backend Log:**
```
⚠️  Role check failed: User has role USER but endpoint requires ADMIN
❌ Access denied by Spring Security
```

---

## 4. GIẢI THÍCH RESPONSE CODES 📊

| Status Code | Ý Nghĩa | Khi Nào Xảy Ra | DB Changes? |
|-------------|---------|----------------|-------------|
| **200 OK** | ✅ Thành công | Request hợp lệ, có JWT (nếu cần) | ✅ CÓ (nếu là POST/PUT/DELETE) |
| **201 Created** | ✅ Tạo thành công | POST tạo resource mới | ✅ CÓ (INSERT vào DB) |
| **400 Bad Request** | ❌ Dữ liệu sai | Validation fail (email sai format, password yếu) | ❌ KHÔNG |
| **401 Unauthorized** | ❌ Chưa xác thực | JWT sai/hết hạn/missing | ❌ KHÔNG |
| **403 Forbidden** | ❌ Không có quyền | JWT đúng nhưng role không đủ | ❌ KHÔNG |
| **404 Not Found** | ❌ Không tìm thấy | Resource không tồn tại (user_id = 999) | ❌ KHÔNG |
| **500 Internal Error** | ❌ Lỗi server | Exception trong code (NullPointer, DB down) | ❓ TÙY (có thể rollback transaction) |

---

## 5. THAY ĐỔI DATABASE 💾

### ✅ ENDPOINT CÓ THAY ĐỔI DB:

| Endpoint | Method | JWT? | DB Changes | Tables Affected |
|----------|--------|------|------------|-----------------|
| `/api/auth/signup` | POST | ❌ No | ✅ INSERT user | `user` |
| `/api/auth/signin` | POST | ❌ No | ❌ NONE (only SELECT) | - |
| `/api/auth/forgot-password` | POST | ❌ No | ✅ INSERT token | `password_reset_token` |
| `/api/auth/reset-password` | POST | ❌ No | ✅ UPDATE password + DELETE token | `user`, `password_reset_token` |
| `/api/user/profile` | GET | ✅ Yes | ❌ NONE (only SELECT) | - |
| `/api/user/profile` | PUT | ✅ Yes | ✅ UPDATE user info | `user` |
| `/api/user/progress` | POST | ✅ Yes | ✅ INSERT/UPDATE progress | `user_progress` |
| `/api/lessons/{id}/complete` | POST | ✅ Yes | ✅ UPDATE completed = true | `user_progress` |
| `/api/exams/submit` | POST | ✅ Yes | ✅ INSERT attempt + answers | `exam_attempt`, `exam_answer` |
| `/api/admin/users/{id}` | DELETE | ✅ Yes (ADMIN) | ✅ DELETE user | `user` (cascade) |

---

### ❌ KHI KHÔNG CÓ JWT (hoặc JWT sai):

**Flow xử lý:**
```
Client → [Spring Security Filter] → ❌ JWT INVALID
                                    ↓
                          Return 401/403
                          (KHÔNG gọi Controller)
                                    ↓
                          ❌ Service KHÔNG chạy
                          ❌ Repository KHÔNG query
                          ❌ Database KHÔNG thay đổi
```

**Example:**
```java
// Client gửi request KHÔNG có JWT
GET /api/user/15/progress

// Spring Security Filter:
if (jwt == null || !jwtUtils.validate(jwt)) {
    return 401 Unauthorized; // ← DỪNG Ở ĐÂY
}

// ❌ Các method sau KHÔNG BAO GIỜ được gọi:
// UserProgressController.getProgress() - KHÔNG chạy
// UserProgressService.findByUserId() - KHÔNG chạy  
// userProgressRepository.findByUserId() - KHÔNG chạy
// Database - KHÔNG có query nào
```

---

### ✅ KHI CÓ JWT HỢP LỆ:

**Flow xử lý:**
```
Client → [Spring Security Filter] → ✅ JWT VALID
                                    ↓
                          Extract user_id từ JWT
                                    ↓
                          SecurityContextHolder.setAuthentication()
                                    ↓
                          ✅ Forward to Controller
                                    ↓
                          Controller method chạy
                                    ↓
                          Service method chạy
                                    ↓
                          Repository query DB
                                    ↓
                          ✅ DB changes (nếu POST/PUT/DELETE)
                                    ↓
                          Return response to client
```

---

## 6. TEST SCENARIOS THỰC TẾ 🎯

### Scenario 1: User đăng ký + đăng nhập + cập nhật progress

```http
### Step 1: Đăng ký
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Secure@123",
  "fullName": "John Doe"
}

### Response: Copy token
### "token": "eyJhbGc..."

---

### Step 2: Lấy thông tin profile (dùng token từ Step 1)
GET http://localhost:8080/api/user/profile
Authorization: Bearer eyJhbGc...

---

### Step 3: Cập nhật lesson progress
POST http://localhost:8080/api/user/progress
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "lessonId": 3,
  "completed": true,
  "score": 88
}
```

**✅ DB Changes:**
1. Step 1: INSERT vào `user` table
2. Step 2: Không có (chỉ SELECT)
3. Step 3: INSERT/UPDATE vào `user_progress`

---

### Scenario 2: User quên mật khẩu + reset

```http
### Step 1: Quên mật khẩu
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com",
  "platform": "web"
}

### Backend console sẽ show:
### Token: abc-123-def-456

---

### Step 2: Reset password (dùng token từ console)
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
  "token": "abc-123-def-456",
  "newPassword": "NewSecure@123"
}

---

### Step 3: Đăng nhập với password mới
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "usernameOrEmail": "john@example.com",
  "password": "NewSecure@123"
}
```

**✅ DB Changes:**
1. Step 1: INSERT vào `password_reset_token`
2. Step 2: UPDATE `user.password` + DELETE token
3. Step 3: Không có (chỉ verify password)

---

### Scenario 3: Test KHÔNG có JWT (403/401)

```http
### Attempt 1: Không gửi token
GET http://localhost:8080/api/user/profile
### Expected: 403 Forbidden
### DB Changes: ❌ NONE

---

### Attempt 2: Token sai format
GET http://localhost:8080/api/user/profile
Authorization: Bearer invalid_token_abc123
### Expected: 401 Unauthorized
### DB Changes: ❌ NONE

---

### Attempt 3: Token hết hạn (25 giờ sau khi signin)
GET http://localhost:8080/api/user/profile
Authorization: Bearer [old_expired_token]
### Expected: 401 Unauthorized
### DB Changes: ❌ NONE
```

---

## 7. POSTMAN COLLECTION 📦

### Import vào Postman:

```json
{
  "info": {
    "name": "KTigerStudy API - JWT Testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. PUBLIC Endpoints",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test@123\",\n  \"fullName\": \"Test User\"\n}"
            },
            "url": "http://localhost:8080/api/auth/signup"
          }
        },
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"usernameOrEmail\": \"testuser\",\n  \"password\": \"Test@123\"\n}"
            },
            "url": "http://localhost:8080/api/auth/signin"
          }
        }
      ]
    },
    {
      "name": "2. PROTECTED Endpoints",
      "item": [
        {
          "name": "Get Profile (Need JWT)",
          "request": {
            "method": "GET",
            "header": [
              {"key": "Authorization", "value": "Bearer {{jwt_token}}"}
            ],
            "url": "http://localhost:8080/api/user/profile"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "jwt_token",
      "value": "",
      "type": "string"
    }
  ]
}
```

---

## 8. TÓM TẮT QUAN TRỌNG 🎓

### ✅ KHI CÓ JWT HỢP LỆ:
- ✅ Request đến Controller
- ✅ Service/Repository chạy bình thường
- ✅ Database CÓ THỂ thay đổi (nếu POST/PUT/DELETE)
- ✅ Response 200/201/204

### ❌ KHI KHÔNG CÓ JWT (hoặc JWT sai):
- ❌ Request bị chặn tại Security Filter
- ❌ Controller KHÔNG BAO GIỜ được gọi
- ❌ Service/Repository KHÔNG BAO GIỜ chạy
- ❌ Database KHÔNG BAO GIỜ thay đổi
- ❌ Response 401/403

### 🔑 JWT Structure:
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNSIsImlhdCI6...

Payload decoded:
{
  "sub": "15",           ← user_id
  "iat": 1704715200,     ← issued at
  "exp": 1704801600      ← expires at (24h)
}
```

### 🛡️ Security Flow:
```
Request → JWT Filter → Valid? → Yes → Controller → Service → DB
                              ↓
                              No → Return 401/403 (STOP HERE)
```

---

## 9. DEBUG TIPS 🔧

### Backend Logs:
```java
// Thêm vào JwtAuthenticationFilter
System.out.println("🔍 JWT Filter - Path: " + request.getRequestURI());
System.out.println("🔍 JWT Token: " + (jwt != null ? "Found" : "Missing"));
System.out.println("🔍 User ID: " + (userId != null ? userId : "N/A"));
```

### Check JWT expiry trong Postman:
1. Copy token từ response
2. Vào https://jwt.io
3. Paste token vào "Encoded" box
4. Check field `exp` trong Payload → timestamp

### Common Issues:
| Issue | Cause | Solution |
|-------|-------|----------|
| 403 trên PUBLIC endpoint | Security config sai | Check `.requestMatchers("/api/auth/**").permitAll()` |
| 401 với token hợp lệ | Secret key sai | Check `jwt.secret` trong application.properties |
| Token expired ngay | Clock skew | Sync system time hoặc tăng expiration |
| Cannot parse token | Thiếu "Bearer " prefix | Phải là `Bearer eyJhbGc...` (có space) |

