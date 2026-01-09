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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

  // ═══════════════════════════════════════════════════════════════
  // 👥 ADMIN ENDPOINTS - Quản lý users
  // ═══════════════════════════════════════════════════════════════

  @GetMapping("/learners")
  @PreAuthorize("hasRole('ADMIN')")
  public Page<UserResponse> getAllLearners(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size) {
    return userService.getAllLearners(PageRequest.of(page, size));
  }

  @GetMapping("/learners/search")
  @PreAuthorize("hasRole('ADMIN')")
  public Page<UserResponse> searchLearners(
          @RequestParam String keyword,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size) {
    return userService.searchLearners(keyword, PageRequest.of(page, size));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse createUser(@RequestBody UserRequest request) {
    return userService.createUser(request);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/freeze")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> freezeUser(@PathVariable Long id) {
    try {
      UserResponse resp = userService.freezeUser(id);

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Tài khoản đã được đóng băng thành công");
      response.put("userId", id);
      response.put("userStatus", 0);
      response.put("userData", resp);

      System.out.println("✅ User " + id + " has been frozen successfully");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Không thể đóng băng tài khoản: " + e.getMessage());
      error.put("userId", id);

      System.err.println("❌ Failed to freeze user " + id + ": " + e.getMessage());

      return ResponseEntity.badRequest().body(error);
    }
  }

  @PostMapping("/{id}/unfreeze")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> unfreezeUser(@PathVariable Long id) {
    try {
      UserResponse resp = userService.unfreezeUser(id);

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Tài khoản đã được kích hoạt thành công");
      response.put("userId", id);
      response.put("userStatus", 1);
      response.put("userData", resp);

      System.out.println("✅ User " + id + " has been unfrozen successfully");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Không thể kích hoạt tài khoản: " + e.getMessage());
      error.put("userId", id);

      System.err.println("❌ Failed to unfreeze user " + id + ": " + e.getMessage());

      return ResponseEntity.badRequest().body(error);
    }
  }

  @GetMapping("/{id}/status")
  @PreAuthorize("hasRole('ADMIN')")
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

  @PostMapping("/bulk-freeze")
  @PreAuthorize("hasRole('ADMIN')")
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
          System.err.println("❌ Failed to freeze user " + userId + ": " + e.getMessage());
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

  @GetMapping("/email/{email}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> getByEmail(@PathVariable String email) {
    try {
      UserResponse resp = userService.getUserByEmail(email);
      return ResponseEntity.ok(resp);
    } catch (NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/admin/test")
  @PreAuthorize("hasRole('ADMIN')")
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

  // ═══════════════════════════════════════════════════════════════
  // 👤 USER ENDPOINTS - Có kiểm tra quyền sở hữu
  // ═══════════════════════════════════════════════════════════════

  /**
   * ✅ FIXED: Lấy user theo id
   * RULE: User chỉ xem được chính họ, ADMIN xem được tất cả
   */
  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> getUserById(@PathVariable Long id) {
    try {
      // 🔐 KIỂM TRA QUYỀN
      if (!isOwnerOrAdmin(id)) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "❌ Bạn không có quyền xem thông tin user này");
        error.put("requestedUserId", id);
        
        System.err.println("⚠️  Unauthorized access attempt: User " + getCurrentUserId() + " tried to access User " + id);
        
        return ResponseEntity.status(403).body(error);
      }
      
      UserResponse resp = userService.getUserById(id);
      return ResponseEntity.ok(resp);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * ✅ FIXED: Cập nhật user
   * RULE: User chỉ sửa được chính họ, ADMIN sửa được tất cả
   */
  @PutMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
    try {
      // 🔐 KIỂM TRA QUYỀN
      if (!isOwnerOrAdmin(id)) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "❌ Bạn không có quyền sửa thông tin user này");
        error.put("requestedUserId", id);
        
        System.err.println("⚠️  Unauthorized update attempt: User " + getCurrentUserId() + " tried to update User " + id);
        
        return ResponseEntity.status(403).body(error);
      }
      
      UserResponse updated = userService.updateUser(id, request);
      return ResponseEntity.ok(updated);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * ✅ FIXED: Đổi mật khẩu
   * RULE: User chỉ đổi được password của chính họ, ADMIN đổi được tất cả
   */
  @PostMapping("/change-password")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    try {
      Long targetUserId = request.getUserId();
      
      // 🔐 KIỂM TRA QUYỀN
      if (!isOwnerOrAdmin(targetUserId)) {
        System.err.println("⚠️  Unauthorized password change attempt: User " + getCurrentUserId() + " tried to change password of User " + targetUserId);
        return ResponseEntity.status(403).body("❌ Bạn không có quyền đổi mật khẩu user này");
      }
      
      userService.changePassword(request);
      return ResponseEntity.ok("✅ Đổi mật khẩu thành công");
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔐 HELPER METHODS - Ownership & Role Check
  // ═══════════════════════════════════════════════════════════════

  /**
   * Kiểm tra user hiện tại có phải chủ sở hữu HOẶC admin không
   * @param targetUserId ID của user đang bị truy cập
   * @return true nếu là owner hoặc admin, false nếu không
   */
  private boolean isOwnerOrAdmin(Long targetUserId) {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      
      if (auth == null || !auth.isAuthenticated()) {
        return false;
      }
      
      // Check nếu là ADMIN
      if (hasRole("ADMIN")) {
        System.out.println("✅ ADMIN access granted");
        return true;
      }
      
      // Check nếu là owner (user_id khớp)
      Long currentUserId = Long.parseLong(auth.getName());
      boolean isOwner = currentUserId.equals(targetUserId);
      
      if (isOwner) {
        System.out.println("✅ Owner access granted: User " + currentUserId);
      }
      
      return isOwner;
      
    } catch (Exception e) {
      System.err.println("❌ Error in isOwnerOrAdmin: " + e.getMessage());
      return false;
    }
  }

  /**
   * Kiểm tra user hiện tại có role cụ thể không
   * @param roleName Tên role (VD: "ADMIN", "USER")
   * @return true nếu có role, false nếu không
   */
  private boolean hasRole(String roleName) {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      
      if (auth == null) {
        return false;
      }
      
      return auth.getAuthorities().stream()
              .anyMatch(grantedAuthority -> 
                  grantedAuthority.getAuthority().equals("ROLE_" + roleName));
              
    } catch (Exception e) {
      System.err.println("❌ Error in hasRole: " + e.getMessage());
      return false;
    }
  }

  /**
   * Lấy user_id hiện tại từ JWT token
   * @return user_id hoặc null nếu không xác thực được
   */
  private Long getCurrentUserId() {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      
      if (auth == null || !auth.isAuthenticated()) {
        return null;
      }
      
      return Long.parseLong(auth.getName());
      
    } catch (Exception e) {
      System.err.println("❌ Error in getCurrentUserId: " + e.getMessage());
      return null;
    }
  }
}
