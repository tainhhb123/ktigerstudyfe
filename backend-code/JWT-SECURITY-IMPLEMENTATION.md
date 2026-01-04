# 🔐 JWT SECURITY IMPLEMENTATION GUIDE

## 📋 TỔNG QUAN

Dự án hiện tại:
- ✅ Spring Boot 3.0.4
- ✅ BCryptPasswordEncoder đã có
- ✅ CORS đã config
- ✅ MySQL database
- ⚠️ Token hiện tại: "dummy-token-for-now" (FAKE)

**Mục tiêu:** Thay thế dummy token bằng JWT token thật với signature validation.

---

## 🎯 CÁC BƯỚC THỰC HIỆN

### **BƯỚC 1: Thêm JWT Dependencies vào pom.xml**

Thêm vào phần `<dependencies>` (trước thẻ đóng `</dependencies>`):

```xml
<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Spring Security (for JWT filter) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**⚠️ LÚC NÀY:** Maven sẽ download dependencies. Sau đó **PHẢI RELOAD PROJECT** (Maven > Reload).

---

### **BƯỚC 2: Thêm JWT Config vào application.properties**

Thêm vào cuối file:

```properties
# JWT Configuration
jwt.secret=KTigerStudy2026SuperSecretKeyForJWTSignatureMinimum256BitsLongEnoughForHS256Algorithm
jwt.expiration=86400000
# 86400000 ms = 24 hours
# Có thể đổi thành 3600000 (1 hour) hoặc 1800000 (30 minutes)
```

**⚠️ CHÚ Ý:**
- `jwt.secret` phải dài tối thiểu 256 bits (32 characters) cho HS256
- Trong production, nên dùng environment variable: `JWT_SECRET=${JWT_SECRET:defaultValue}`

---

### **BƯỚC 3: Tạo JwtTokenProvider.java**

**Vị trí:** `src/main/java/org/example/ktigerstudybe/security/JwtTokenProvider.java`

File này xử lý:
- Generate JWT token (khi login)
- Validate JWT token (mỗi request)
- Extract thông tin từ token (userId, email, role)

**→ XEM FILE:** `JwtTokenProvider.java` (tạo riêng bên dưới)

---

### **BƯỚC 4: Tạo JwtAuthenticationFilter.java**

**Vị trí:** `src/main/java/org/example/ktigerstudybe/security/JwtAuthenticationFilter.java`

File này chặn MỌI HTTP request và:
1. Extract token từ header `Authorization: Bearer <token>`
2. Validate token
3. Lưu user info vào SecurityContext

**→ XEM FILE:** `JwtAuthenticationFilter.java` (tạo riêng bên dưới)

---

### **BƯỚC 5: Update SecurityConfig.java**

**THAY THẾ toàn bộ file** `SecurityConfig.java` bằng code mới:

**→ XEM FILE:** `SecurityConfig.java` (tạo riêng bên dưới)

---

### **BƯỚC 6: Update AuthServiceImpl.java**

**CHỈ SỬA 2 CHỖ:**

#### **6.1. Thêm @Autowired JwtTokenProvider**

```java
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserXPService userXPService;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    
    // ✅ THÊM DÒNG NÀY
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
```

#### **6.2. Thay "dummy-token" bằng real JWT token**

**TRONG METHOD `signUp()`:**

```java
// CŨ:
resp.setToken("dummy-token-for-now");

// MỚI:
String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());
resp.setToken(token);
```

**TRONG METHOD `signIn()`:**

```java
// CŨ:
resp.setToken("dummy-token-for-now");

// MỚI:
String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());
resp.setToken(token);
```

---

### **BƯỚC 7: Protect Admin Controllers**

**Ví dụ:** File `AdminController.java` hoặc `UserController.java`

Thêm annotation `@PreAuthorize` vào các method cần bảo vệ:

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')") // ← Chỉ ADMIN mới vào được
    public ResponseEntity<?> getAllUsers() {
        // ...
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // ...
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        // ...
    }
}
```

**Các role khác:**
- `@PreAuthorize("hasRole('USER')")` - Chỉ USER
- `@PreAuthorize("hasAnyRole('USER', 'ADMIN')")` - USER hoặc ADMIN đều được

---

## 🧪 TEST JWT SECURITY

### **Test 1: Login và nhận JWT token**

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
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImVtYWlsIjoidHJhbnRhbnRhaTMxMDgwM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwNDM4NDAwMCwiZXhwIjoxNzA0NDcwNDAwfQ.xxxxx"
}
```

**Copy token này để test tiếp.**

---

### **Test 2: Call API với token (USER role)**

```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.xxxxx"
```

**Kết quả:** ✅ 200 OK (nếu endpoint allow USER)

---

### **Test 3: USER cố truy cập ADMIN endpoint**

```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Kết quả:** ❌ 403 Forbidden
```json
{
  "timestamp": "2026-01-04T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

### **Test 4: Fake token**

```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer fake-token-123"
```

**Kết quả:** ❌ 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

---

### **Test 5: Không gửi token**

```bash
curl -X GET http://localhost:8080/api/admin/users
```

**Kết quả:** ❌ 401 Unauthorized
```json
{
  "message": "Missing authorization token"
}
```

---

## 🔄 LUỒNG HOẠT ĐỘNG

```
┌─────────────────────────────────────────────────────────┐
│              JWT SECURITY FLOW                          │
└─────────────────────────────────────────────────────────┘

1. USER LOGIN
   ├─ Frontend: POST /api/auth/signin { email, password }
   ├─ AuthController → AuthService.signIn()
   ├─ Validate password với BCrypt
   ├─ JwtTokenProvider.generateToken(userId, email, role)
   │   ├─ Create payload: { userId, email, role, exp }
   │   ├─ Sign with SECRET_KEY (HS256)
   │   └─ Return: "eyJhbGciOiJIUzI1NiJ9.eyJzdWI..."
   └─ Return: { userId, email, role, token }

2. FRONTEND SAVE TOKEN
   ├─ localStorage.setItem("authToken", token)
   ├─ localStorage.setItem("userRole", role)
   └─ localStorage.setItem("userId", userId)

3. USER CALL PROTECTED API
   ├─ Frontend: axios GET /api/admin/users
   │   └─ Header: Authorization: Bearer <token>
   │
   ├─ Backend: JwtAuthenticationFilter (CHẶN MỌI REQUEST)
   │   ├─ Extract token từ header
   │   ├─ JwtTokenProvider.validateToken(token)
   │   │   ├─ Check signature (SECRET_KEY)
   │   │   ├─ Check expiration
   │   │   └─ Return: true/false
   │   │
   │   ├─ Nếu VALID:
   │   │   ├─ Extract userId, role từ token
   │   │   ├─ Create Authentication object
   │   │   └─ Save to SecurityContext
   │   │
   │   └─ Nếu INVALID: Continue without auth
   │
   ├─ Controller: @PreAuthorize("hasRole('ADMIN')")
   │   ├─ Check SecurityContext → role = ADMIN?
   │   ├─ ✅ YES → Execute method
   │   └─ ❌ NO → Return 403 Forbidden
   │
   └─ Return data hoặc 403/401
```

---

## ⚠️ QUAN TRỌNG

### **1. Frontend KHÔNG CÒN TIN CẬY localStorage**

Backend KHÔNG ĐỌC `localStorage["userRole"]`.  
Backend CHỈ TIN token signature (SECRET_KEY).

**Kịch bản:**
```javascript
// User fake trong Console
localStorage.setItem("userRole", "ADMIN");
```

**Kết quả:**
- ✅ Frontend routing: Vào được /admin (UI only)
- ❌ Backend API: Trả về 403 Forbidden (token vẫn là USER)

### **2. Token Expiration**

Token hết hạn sau 24h. Frontend cần:

```typescript
// axios interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
```

### **3. Public Endpoints**

Một số endpoint KHÔNG CẦN token:
- `/api/auth/signin` ✅ Public
- `/api/auth/signup` ✅ Public
- `/api/auth/forgot-password` ✅ Public
- `/api/admin/users` ❌ Protected (ADMIN only)

---

## 📝 CHECKLIST

- [ ] Thêm JWT dependencies vào pom.xml
- [ ] Reload Maven project
- [ ] Thêm jwt.secret vào application.properties
- [ ] Tạo folder: `src/main/java/org/example/ktigerstudybe/security/`
- [ ] Tạo file: `JwtTokenProvider.java`
- [ ] Tạo file: `JwtAuthenticationFilter.java`
- [ ] Update file: `SecurityConfig.java`
- [ ] Update file: `AuthServiceImpl.java` (thêm @Autowired JwtTokenProvider)
- [ ] Update file: `AuthServiceImpl.java` (thay dummy-token)
- [ ] Thêm `@PreAuthorize` vào admin controllers
- [ ] Test login → nhận JWT token
- [ ] Test call API với token
- [ ] Test fake token → 401
- [ ] Test USER call admin API → 403

---

## 🚀 NEXT STEPS

Sau khi implement xong, bạn cần:

1. **Update Frontend Axios** - Thêm interceptor để gửi token
2. **Handle Token Expiration** - Auto logout khi token hết hạn
3. **Refresh Token** (Optional) - Implement refresh token mechanism
4. **Logout API** - Invalidate token (nếu cần blacklist)

---

**Các file code chi tiết được tạo riêng:**
- `JwtTokenProvider.java`
- `JwtAuthenticationFilter.java`
- `SecurityConfig.java` (updated)
- `AuthServiceImpl-Updated.java` (example)

