package org.example.ktigerstudybe.service.user;

import org.example.ktigerstudybe.dto.req.ChangePasswordRequest;
import org.example.ktigerstudybe.dto.req.UserRequest;
import org.example.ktigerstudybe.dto.resp.UserResponse;
import org.example.ktigerstudybe.model.User;
import org.example.ktigerstudybe.repository.PasswordResetTokenRepository;
import org.example.ktigerstudybe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.NoSuchElementException;

@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserRepository userRepository;
  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private PasswordResetTokenRepository passwordResetTokenRepository;

  // Convert entity -> response DTO
  private UserResponse toResponse(User user) {
    UserResponse resp = new UserResponse();
    resp.setUserId(user.getUserId());
    resp.setFullName(user.getFullName());
    resp.setEmail(user.getEmail());
    resp.setGender(user.getGender());
    resp.setDateOfBirth(user.getDateOfBirth());
    resp.setAvatarImage(user.getAvatarImage());
    resp.setJoinDate(user.getJoinDate());
    resp.setRole(user.getRole());
    resp.setUserStatus(user.getUserStatus());
    resp.setUserName(user.getUserName());
    return resp;
  }

  // Convert request DTO -> entity (cho create)
  private User toEntity(UserRequest req) {
    User user = new User();
    user.setFullName(req.getFullName());
    user.setEmail(req.getEmail());
    user.setPassword(req.getPassword());
    user.setRole(req.getRole());
    user.setUserStatus(req.getUserStatus());
    user.setUserName(req.getUserName());

    user.setGender(req.getGender());
    user.setDateOfBirth(req.getDateOfBirth());
    user.setAvatarImage(req.getAvatarImage());
    user.setJoinDate(req.getJoinDate());
    return user;
  }

  @Override
  public UserResponse getUserById(Long id) {
    // ✅ THÊM OWNERSHIP CHECK
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal());

    boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin && !id.equals(currentUserId)) {
      throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "Bạn chỉ có thể xem thông tin của chính mình"
      );
    }

    User user = userRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
    return toResponse(user);
  }

  @Override
  public UserResponse createUser(UserRequest request) {
    User user = toEntity(request);
    user = userRepository.save(user);
    return toResponse(user);
  }

  @Override
  public UserResponse updateUser(Long id, UserRequest request) {
    // ✅ 1. OWNERSHIP CHECK
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal());

    boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    // USER chỉ update mình, ADMIN update tất cả
    if (!isAdmin && !id.equals(currentUserId)) {
      throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "Bạn chỉ có thể cập nhật thông tin của chính mình"
      );
    }

    // ✅ 2. Tìm user cần update
    User user = userRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));

    // ✅ 3. Cập nhật CHỈ các field an toàn (USER có thể update)
    if (request.getFullName() != null) {
      user.setFullName(request.getFullName());
    }
    if (request.getGender() != null) {
      user.setGender(request.getGender());
    }
    if (request.getDateOfBirth() != null) {
      user.setDateOfBirth(request.getDateOfBirth());
    }
    if (request.getAvatarImage() != null) {
      user.setAvatarImage(request.getAvatarImage());
    }

    // ✅ 4. CHỈ ADMIN mới được đổi role, status, email
    if (isAdmin) {
      if (request.getRole() != null) {
        user.setRole(request.getRole());
      }
      // ✅ FIXED: Không check null cho primitive type (int)
      user.setUserStatus(request.getUserStatus());
      
      if (request.getEmail() != null) {
        user.setEmail(request.getEmail());
      }
      if (request.getUserName() != null) {
        user.setUserName(request.getUserName());
      }
      if (request.getJoinDate() != null) {
        user.setJoinDate(request.getJoinDate());
      }
    }

    // ✅ 5. Lưu và trả về
    user = userRepository.save(user);
    return toResponse(user);
  }

  @Override
  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  // ✅ FIXED: Đóng băng user - Correct logic
  @Override
  public UserResponse freezeUser(Long id) {
    System.out.println("=== FREEZE USER SERVICE START ===");
    System.out.println("Freezing user ID: " + id);

    User user = userRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));

    System.out.println("User before freeze: " + user.getFullName() + ", current status: " + user.getUserStatus());

    // ✅ FIXED: 0 = frozen/inactive
    user.setUserStatus(0);

    user = userRepository.save(user);

    System.out.println("User after freeze: " + user.getFullName() + ", new status: " + user.getUserStatus());
    System.out.println("✅ User frozen successfully");

    return toResponse(user);
  }

  // ✅ FIXED: Mở băng user - Correct logic
  @Override
  public UserResponse unfreezeUser(Long id) {
    System.out.println("=== UNFREEZE USER SERVICE START ===");
    System.out.println("Unfreezing user ID: " + id);

    User user = userRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));

    System.out.println("User before unfreeze: " + user.getFullName() + ", current status: " + user.getUserStatus());

    // ✅ FIXED: 1 = active/unfrozen
    user.setUserStatus(1);

    user = userRepository.save(user);

    System.out.println("User after unfreeze: " + user.getFullName() + ", new status: " + user.getUserStatus());
    System.out.println("✅ User unfrozen successfully");

    return toResponse(user);
  }

  @Override
  public Page<UserResponse> getAllLearners(Pageable pageable) {
    Page<User> users = userRepository.findByRole("user", pageable);
    return users.map(this::toResponse);
  }

  @Override
  public Page<UserResponse> searchLearners(String keyword, Pageable pageable) {
    Page<User> users = userRepository.findByRoleAndFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            "user", keyword, keyword, pageable);
    return users.map(this::toResponse);
  }

  @Override
  public UserResponse getUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new NoSuchElementException("Không tìm thấy user với email: " + email)
            );
    return toResponse(user);
  }

  @Override
  public void changePassword(ChangePasswordRequest request) {
    // ✅ THÊM OWNERSHIP CHECK
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = Long.parseLong((String) auth.getPrincipal());

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

    // Kiểm tra: chỉ được đổi password của mình
    if (!user.getUserId().equals(currentUserId)) {
      throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "Bạn chỉ có thể đổi mật khẩu của chính mình"
      );
    }

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      throw new RuntimeException("Mật khẩu hiện tại không đúng");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }
}
