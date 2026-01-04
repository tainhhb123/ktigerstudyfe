# 🔐 @PreAuthorize ANNOTATION GUIDE

## 📌 CÁC LOẠI PHÂN QUYỀN

### **1. ADMIN ONLY** - Chỉ admin

```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createExam() { ... }
```

**Áp dụng cho:**
- Tạo, sửa, xóa dữ liệu (CREATE, UPDATE, DELETE)
- Xem tất cả user, statistics
- Quản lý hệ thống

**Ví dụ:**
- `POST /api/exams` - Tạo exam
- `PUT /api/exams/{id}` - Sửa exam
- `DELETE /api/exams/{id}` - Xóa exam
- `GET /api/admin/users` - Xem tất cả users

---

### **2. USER + ADMIN** - Cả USER và ADMIN

```java
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public ResponseEntity<?> startExam() { ... }
```

**Áp dụng cho:**
- Chức năng user sử dụng hàng ngày
- Admin cũng cần test/sử dụng

**Ví dụ:**
- `POST /api/exam-attempts/start` - Làm bài thi
- `GET /api/exams/active` - Xem đề thi available
- `POST /api/exam-attempts/{id}/submit` - Nộp bài

---

### **3. AUTHENTICATED** - Phải đăng nhập (bất kỳ ai)

```java
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> getProfile() { ... }
```

**Áp dụng cho:**
- Xem thông tin cá nhân
- Xem lịch sử của mình
- GET endpoints cần đăng nhập

**Ví dụ:**
- `GET /api/users/{id}` - Xem profile
- `GET /api/exam-attempts/user/{userId}` - Xem lịch sử thi

---

### **4. PUBLIC** - Không cần đăng nhập

```java
// KHÔNG CÓ @PreAuthorize
@GetMapping("/active-exams")
public List<ExamResponse> getActiveExams() { ... }
```

**Áp dụng cho:**
- Landing page data
- Demo content
- Public APIs

**⚠️ CHÚ Ý:** Các endpoint PUBLIC phải được config trong `SecurityConfig.java`:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/public/**").permitAll()
    // ...
)
```

---

## 📋 BẢNG THAM KHẢO NHANH

| Endpoint | Method | Phân quyền | Lý do |
|----------|--------|-----------|-------|
| `/api/exams` | GET | `@PreAuthorize("hasRole('ADMIN')")` | Admin xem tất cả exam |
| `/api/exams/active` | GET | `@PreAuthorize("hasAnyRole('USER','ADMIN')")` | User xem exam để làm |
| `/api/exams` | POST | `@PreAuthorize("hasRole('ADMIN')")` | Chỉ admin tạo exam |
| `/api/exams/{id}` | PUT | `@PreAuthorize("hasRole('ADMIN')")` | Chỉ admin sửa exam |
| `/api/exams/{id}` | DELETE | `@PreAuthorize("hasRole('ADMIN')")` | Chỉ admin xóa exam |
| `/api/exam-attempts/start` | POST | `@PreAuthorize("hasAnyRole('USER','ADMIN')")` | User làm bài |
| `/api/exam-attempts/{id}/submit` | POST | `@PreAuthorize("hasAnyRole('USER','ADMIN')")` | User nộp bài |
| `/api/exam-attempts/{id}/result` | GET | `@PreAuthorize("isAuthenticated()")` | Xem kết quả của mình |
| `/api/answer-choices` | POST | `@PreAuthorize("hasRole('ADMIN')")` | Admin tạo đáp án |
| `/api/answer-choices/{id}` | PUT | `@PreAuthorize("hasRole('ADMIN')")` | Admin sửa đáp án |
| `/api/answer-choices/{id}` | DELETE | `@PreAuthorize("hasRole('ADMIN')")` | Admin xóa đáp án |

---

## 🔍 KIỂM TRA TRONG SERVICE LAYER

⚠️ **QUAN TRỌNG:** `@PreAuthorize` chỉ kiểm tra ROLE, KHÔNG KIỂM TRA OWNERSHIP.

**Ví dụ vấn đề:**
```java
// Controller
@GetMapping("/exam-attempts/{id}")
@PreAuthorize("isAuthenticated()") // ← USER A và USER B đều vào được
public ResponseEntity<ExamAttemptResponse> getAttemptById(@PathVariable Long id) {
    return examAttemptService.getAttemptById(id);
}
```

**Kịch bản:**
- USER A tạo attempt ID = 10
- USER B gọi `GET /exam-attempts/10` → ✅ Vào được (vì authenticated)
- **NHƯNG USER B KHÔNG NÊN XEM ATTEMPT CỦA USER A**

**Giải pháp:** Kiểm tra trong Service

```java
// ExamAttemptServiceImpl.java
@Override
public ExamAttemptResponse getAttemptById(Long attemptId) {
    ExamAttempt attempt = examAttemptRepository.findById(attemptId)
        .orElseThrow(() -> new RuntimeException("Attempt not found"));
    
    // ✅ Lấy userId từ SecurityContext (từ JWT token)
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = (Long) auth.getPrincipal();
    
    // ✅ Lấy role từ SecurityContext
    boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    
    // ✅ Kiểm tra ownership
    if (!isAdmin && !attempt.getUserId().equals(currentUserId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
            "Bạn không có quyền xem attempt này");
    }
    
    return mapToResponse(attempt);
}
```

---

## 🎯 QUY TẮC CHUNG

### **ADMIN Endpoints:**
- Tất cả CREATE, UPDATE, DELETE
- Xem tất cả data (không filter theo user)
- Quản lý hệ thống

**→ Dùng:** `@PreAuthorize("hasRole('ADMIN')")`

### **USER Endpoints:**
- Làm bài thi, xem kết quả của mình
- Xem danh sách public content

**→ Dùng:** `@PreAuthorize("hasAnyRole('USER', 'ADMIN')")`

### **Mixed Endpoints:**
- GET endpoints có data riêng tư
- Cần kiểm tra ownership trong Service

**→ Dùng:** `@PreAuthorize("isAuthenticated()")` + Service check

---

## ✅ CHECKLIST

Với mỗi controller method, hỏi:

1. **Ai được phép gọi endpoint này?**
   - Chỉ ADMIN? → `hasRole('ADMIN')`
   - USER + ADMIN? → `hasAnyRole('USER', 'ADMIN')`
   - Ai đã login? → `isAuthenticated()`
   - Công khai? → Không có annotation

2. **Có cần kiểm tra ownership không?**
   - User chỉ xem data của mình? → Check trong Service
   - Admin xem tất cả? → Không cần check thêm

3. **Method là gì?**
   - POST/PUT/DELETE → Thường là ADMIN
   - GET → Tuỳ data (public, user-specific, admin-only)

---

## 🚀 ÁP DỤNG CHO PROJECT CỦA BẠN

### **Controllers cần update:**

1. ✅ **AnswerChoiceController** - Done (file mẫu đã tạo)
2. ✅ **ExamController** - Done (file mẫu đã tạo)
3. ✅ **ExamAttemptController** - Done (file mẫu đã tạo)
4. ⏳ **UserController** - Thêm `@PreAuthorize` cho admin endpoints
5. ⏳ **LessonController** - Admin CRUD, User view
6. ⏳ **DocumentController** - Admin CRUD, User view

**Copy code từ các file mẫu và thay vào controllers của bạn!**

---

## 📌 LƯU Ý CUỐI

1. **PHẢI ENABLE** `@EnableMethodSecurity(prePostEnabled = true)` trong `SecurityConfig.java`

2. **Import đúng:**
   ```java
   import org.springframework.security.access.prepost.PreAuthorize;
   ```

3. **Test kỹ:**
   - Login với USER → Gọi ADMIN API → Phải 403
   - Login với ADMIN → Gọi USER API → Phải OK
   - Không login → Gọi protected API → Phải 401

4. **Frontend cần handle 403:**
   ```typescript
   api.interceptors.response.use(
     response => response,
     error => {
       if (error.response?.status === 403) {
         alert('Bạn không có quyền!');
       }
       return Promise.reject(error);
     }
   );
   ```
