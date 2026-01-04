# 🚨 SỬA NHANH LỖI 403 FORBIDDEN

## 🔴 **CÁC LỖI ĐANG GẶP:**

### **Lỗi 1:** `GET /api/lessons/progress?levelId=2&userId=3` → 403 Forbidden
### **Lỗi 2:** `GET /api/user-progress/user/3` → 403 Forbidden

---

## ✅ **NGUYÊN NHÂN:**

Frontend đã gửi token đúng (✅ Token attached to request), nhưng **backend thiếu @PreAuthorize annotations** trên các endpoints này.

---

## 🔧 **GIẢI PHÁP:**

### **Bước 1: Sửa LessonController trong backend project**

Tìm file: `src/main/java/org/example/ktigerstudybe/controller/LessonController.java`

**Thêm annotation cho endpoint `/progress`:**

```java
// Thêm import nếu chưa có
import org.springframework.security.access.prepost.PreAuthorize;

// Tìm method này:
@GetMapping("/progress")
public List<LessonWithProgressResponse> getLessonsWithProgress(
        @RequestParam Long levelId,
        @RequestParam Long userId
) {
    return lessonService.getLessonsWithProgress(levelId, userId);
}

// ✅ SỬA THÀNH:
@GetMapping("/progress")
@PreAuthorize("isAuthenticated()") // ← THÊM DÒNG NÀY
public List<LessonWithProgressResponse> getLessonsWithProgress(
        @RequestParam Long levelId,
        @RequestParam Long userId
) {
    return lessonService.getLessonsWithProgress(levelId, userId);
}
```

---

### **Bước 2: Sửa UserProgressController trong backend project**

Tìm file: `src/main/java/org/example/ktigerstudybe/controller/UserProgressController.java`

**Thêm annotation cho endpoint `/user/{userId}`:**

```java
// Thêm import nếu chưa có
import org.springframework.security.access.prepost.PreAuthorize;

// Tìm method này:
@GetMapping("/user/{userId}")
public ResponseEntity<List<UserProgressDTO>> getUserProgress(@PathVariable Long userId) {
    try {
        List<UserProgress> progressList = userProgressService.findByUserId(userId);
        // ... rest of code
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

// ✅ SỬA THÀNH:
@GetMapping("/user/{userId}")
@PreAuthorize("isAuthenticated()") // ← THÊM DÒNG NÀY
public ResponseEntity<List<UserProgressDTO>> getUserProgress(@PathVariable Long userId) {
    try {
        List<UserProgress> progressList = userProgressService.findByUserId(userId);
        // ... rest of code
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}
```

---

### **Bước 3: Restart backend server**

```bash
# Stop backend (Ctrl+C)
# Restart
mvn spring-boot:run

# Hoặc trong IntelliJ: Click nút Restart
```

---

## 🧪 **KIỂM TRA SAU KHI SỬA:**

### **Test 1: Lessons API**
Reload trang `/learn/level`, xem Console:
```
✅ Token attached to request: /api/lessons/progress
✅ 200 OK - Lessons loaded successfully
```

### **Test 2: User Progress API**
Reload trang `/profile`, xem Console:
```
✅ Token attached to request: /api/user-progress/user/3
✅ 200 OK - Progress loaded successfully
```

---

## 📋 **HOẶC COPY TOÀN BỘ CONTROLLERS (NHANH HƠN):**

### **Option 1: Copy từ file -Protected.java**

**LessonController:**
```bash
# Copy toàn bộ file này:
backend-code/LessonController-Protected.java

# Dán thay thế:
src/main/java/org/example/ktigerstudybe/controller/LessonController.java
```

**UserProgressController:**
```bash
# Copy toàn bộ file này:
backend-code/UserProgressController-Protected.java

# Dán thay thế:
src/main/java/org/example/ktigerstudybe/controller/UserProgressController.java
```

---

## 🎯 **TÓM TẮT:**

**Vấn đề:** Backend endpoint thiếu `@PreAuthorize("isAuthenticated()")` 

**Giải pháp:** Thêm annotation vào 2 endpoints:
1. `GET /api/lessons/progress` → `@PreAuthorize("isAuthenticated()")`
2. `GET /api/user-progress/user/{userId}` → `@PreAuthorize("isAuthenticated()")`

**Sau khi sửa:**
- ✅ Frontend gửi token
- ✅ Backend accept token
- ✅ Return 200 OK thay vì 403 Forbidden

---

## ⚠️ **LƯU Ý VỀ OWNERSHIP CHECK:**

Sau khi sửa xong, cần **implement ownership check trong Service layer**:

### **LessonService.getLessonsWithProgress():**
```java
@Override
public List<LessonWithProgressResponse> getLessonsWithProgress(Long levelId, Long userId) {
    // 1. Lấy current user từ SecurityContext
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal());
    
    // 2. Kiểm tra role
    boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    
    // 3. Ownership check: USER chỉ xem userId=mình, ADMIN xem tất cả
    if (!isAdmin && !userId.equals(currentUserId)) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, 
            "Bạn chỉ có thể xem tiến độ của chính mình"
        );
    }
    
    // 4. Tiếp tục logic
    // ... existing code
}
```

### **UserProgressService.findByUserId():**
```java
@Override
public List<UserProgress> findByUserId(Long userId) {
    // 1. Lấy current user từ SecurityContext
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal());
    
    // 2. Kiểm tra role
    boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    
    // 3. Ownership check
    if (!isAdmin && !userId.equals(currentUserId)) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, 
            "Bạn chỉ có thể xem tiến độ của chính mình"
        );
    }
    
    // 4. Tiếp tục logic
    return userProgressRepository.findByUser_UserId(userId);
}
```

---

**SỬA XONG 2 CONTROLLER, RESTART BACKEND, VÀ TEST LẠI! 🎉**
