package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.ChangePasswordRequest;
import org.example.ktigerstudybe.dto.req.ForgotPasswordRequest;
import org.example.ktigerstudybe.dto.req.UserRequest;
import org.example.ktigerstudybe.dto.resp.UserResponse;
import org.example.ktigerstudybe.model.User;
import org.example.ktigerstudybe.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

  @Autowired
  private UserService userService;

  /**
   * Lấy tất cả learners (role = USER) với phân trang
   * ⚠️ ADMIN ONLY - Trang quản lý learners
   */
  @GetMapping("/learners")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public Page<UserResponse> getAllLearners(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size) {
    return userService.getAllLearners(PageRequest.of(page, size));
  }

  /**
   * Tìm kiếm learners
   * ⚠️ ADMIN ONLY - Trang quản lý learners
   */
  @GetMapping("/learners/search")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public Page<UserResponse> searchLearners(
          @RequestParam String keyword,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size) {
    return userService.searchLearners(keyword, PageRequest.of(page, size));
  }

  /**
   * Lấy user theo id
   * ✅ AUTHENTICATED - User xem profile mình, Admin xem tất cả
   * 
   * ⚠️ LƯU Ý: Kiểm tra trong Service:
   * - USER chỉ xem user với id = mình
   * - ADMIN xem được tất cả userId
   */
  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
  public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
    try {
      UserResponse resp = userService.getUserById(id);
      return ResponseEntity.ok(resp);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Tạo mới user
   * ⚠️ ADMIN ONLY - Chỉ admin tạo user mới
   */
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public UserResponse createUser(@RequestBody UserRequest request) {
    return userService.createUser(request);
  }

  /**
   * Cập nhật user
   * ✅ AUTHENTICATED - User update profile mình, Admin update tất cả
   * 
   * ⚠️ LƯU Ý: Kiểm tra trong Service:
   * - USER chỉ update user với id = mình
   * - ADMIN update được tất cả userId
   */
  @PutMapping("/{id}")
  @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
  public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
    try {
      UserResponse updated = userService.updateUser(id, request);
      return ResponseEntity.ok(updated);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Xóa user
   * ⚠️ ADMIN ONLY - Chỉ admin xóa user
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Đóng băng user
   * ⚠️ ADMIN ONLY - Chỉ admin đóng băng tài khoản
   */
  @PostMapping("/{id}/freeze")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Map<String, Object>> freezeUser(@PathVariable Long id) {
    try {
      UserResponse resp = userService.freezeUser(id);

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Tài khoản đã được đóng băng thành công");
      response.put("userId", id);
      response.put("userStatus", 0);
      response.put("userData", resp);

      System.out.println("User " + id + " has been frozen successfully");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Không thể đóng băng tài khoản: " + e.getMessage());
      error.put("userId", id);

      System.err.println("Failed to freeze user " + id + ": " + e.getMessage());

      return ResponseEntity.badRequest().body(error);
    }
  }

  /**
   * Mở băng user
   * ⚠️ ADMIN ONLY - Chỉ admin mở băng tài khoản
   */
  @PostMapping("/{id}/unfreeze")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Map<String, Object>> unfreezeUser(@PathVariable Long id) {
    try {
      UserResponse resp = userService.unfreezeUser(id);

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Tài khoản đã được kích hoạt thành công");
      response.put("userId", id);
      response.put("userStatus", 1);
      response.put("userData", resp);

      System.out.println("User " + id + " has been unfrozen successfully");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Không thể kích hoạt tài khoản: " + e.getMessage());
      error.put("userId", id);

      System.err.println("Failed to unfreeze user " + id + ": " + e.getMessage());

      return ResponseEntity.badRequest().body(error);
    }
  }

  /**
   * Get user status
   * ⚠️ ADMIN ONLY - Admin kiểm tra status user
   */
  @GetMapping("/{id}/status")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Map<String, Object>> getUserStatus(@PathVariable Long id) {
    try {
      UserResponse user = userService.getUserById(id);

      Map<String, Object> response = new HashMap<>();
      response.put("userId", id);
      response.put("userStatus", user.getUserStatus());
      response.put("statusText", user.getUserStatus() == 1 ? "Hoạt động" : "Đóng băng");
      response.put("email", user.getEmail());
      response.put("fullName", user.getFullName());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("message", "Không tìm thấy user: " + e.getMessage());
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Bulk freeze users
   * ⚠️ ADMIN ONLY - Admin đóng băng hàng loạt
   */
  @PostMapping("/bulk-freeze")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Map<String, Object>> bulkFreezeUsers(@RequestBody Map<String, Object> request) {
    try {
      @SuppressWarnings("unchecked")
      java.util.List<Long> userIds = (java.util.List<Long>) request.get("userIds");

      int successCount = 0;
      int failCount = 0;

      for (Long userId : userIds) {
        try {
          userService.freezeUser(userId);
          successCount++;
        } catch (Exception e) {
          failCount++;
          System.err.println("Failed to freeze user " + userId + ": " + e.getMessage());
        }
      }

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Đóng băng hàng loạt hoàn tất");
      response.put("successCount", successCount);
      response.put("failCount", failCount);
      response.put("totalProcessed", userIds.size());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Lỗi đóng băng hàng loạt: " + e.getMessage());
      return ResponseEntity.badRequest().body(error);
    }
  }

  /**
   * Get user by email
   * ✅ AUTHENTICATED - User có thể search by email
   */
  @GetMapping("/email/{email}")
  @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
  public ResponseEntity<UserResponse> getByEmail(@PathVariable String email) {
    try {
      UserResponse resp = userService.getUserByEmail(email);
      return ResponseEntity.ok(resp);
    } catch (NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Change password
   * ✅ AUTHENTICATED - User đổi password của mình
   * 
   * ⚠️ LƯU Ý: Kiểm tra trong Service:
   * - User chỉ đổi password của email = mình
   */
  @PostMapping("/change-password")
  @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
  public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    try {
      userService.changePassword(request);
      return ResponseEntity.ok("Đổi mật khẩu thành công");
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  /**
   * Test admin endpoint
   * ⚠️ ADMIN ONLY - Test endpoint cho admin
   */
  @GetMapping("/admin/test")
  @PreAuthorize("hasRole('ADMIN')") // ← CHỈ ADMIN
  public ResponseEntity<Map<String, Object>> testAdminEndpoint() {
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Admin user management endpoints are working");
    response.put("timestamp", System.currentTimeMillis());
    response.put("availableEndpoints", java.util.Arrays.asList(
            "POST /{id}/freeze - Đóng băng user",
            "POST /{id}/unfreeze - Mở băng user",
            "GET /{id}/status - Lấy trạng thái user",
            "POST /bulk-freeze - Đóng băng hàng loạt"
    ));

    return ResponseEntity.ok(response);
  }
}
