package org.example.ktigerstudybe.service.auth;

import org.example.ktigerstudybe.model.PasswordResetToken;
import org.example.ktigerstudybe.repository.PasswordResetTokenRepository;
import org.example.ktigerstudybe.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.SignInRequest;
import org.example.ktigerstudybe.dto.req.SignUpRequest;
import org.example.ktigerstudybe.dto.resp.AuthResponse;
import org.example.ktigerstudybe.model.User;
import org.example.ktigerstudybe.repository.UserRepository;
import org.example.ktigerstudybe.service.auth.AuthService;
import org.example.ktigerstudybe.service.userxp.UserXPService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.example.ktigerstudybe.dto.resp.GoogleSignInResponse;
import org.example.ktigerstudybe.dto.req.GoogleSignInRequest;
import org.example.ktigerstudybe.security.JwtTokenProvider; // ← THÊM IMPORT

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserXPService userXPService;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    
    // ✅ THÊM: Inject JwtTokenProvider
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setUserStatus(1);
        user.setJoinDate(LocalDate.now());

        userRepository.save(user);

        try {
            userXPService.createInitialUserXP(user.getUserId());
            System.out.println("UserXP created for signup user: " + user.getUserId());
        } catch (Exception xpError) {
            System.err.println("Failed to create UserXP for signup user: " + xpError.getMessage());
        }

        // ✅ SỬA: Generate REAL JWT token
        String token = jwtTokenProvider.generateToken(
            user.getUserId(), 
            user.getEmail(), 
            user.getRole()
        );

        AuthResponse resp = new AuthResponse();
        resp.setUserId(user.getUserId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setToken(token); // ← Real JWT token
        resp.setRole(user.getRole());

        return resp;
    }

    @Override
    public AuthResponse signIn(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu.");
        }

        if (user.getUserStatus() == 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Tài khoản của bạn đã bị đóng băng. Vui lòng liên hệ admin để được hỗ trợ.");
        }

        System.out.println("User " + user.getEmail() + " logged in successfully");

        // ✅ SỬA: Generate REAL JWT token
        String token = jwtTokenProvider.generateToken(
            user.getUserId(), 
            user.getEmail(), 
            user.getRole()
        );

        AuthResponse resp = new AuthResponse();
        resp.setUserId(user.getUserId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setToken(token); // ← Real JWT token
        resp.setRole(user.getRole());

        return resp;
    }

    // ✅ GHI CHÚ: Google SignIn cũng có thể generate JWT token nếu cần
    // Hiện tại code bạn không return token cho Google SignIn
    // Nếu muốn, thêm field "token" vào GoogleSignInResponse và generate ở đây

    // ... (các method khác giữ nguyên)

    @Override
    public void forgotPassword(String email, String platform) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy email này!"));

        if (user.getUserStatus() == 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Tài khoản của bạn đã bị đóng băng. Vui lòng liên hệ admin để được hỗ trợ.");
        }

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(token);
        prt.setUser(user);
        prt.setExpiryDate(expiry);
        tokenRepository.save(prt);

        String resetLink;
        if ("mobile".equalsIgnoreCase(platform)) {
            resetLink = "tigerkorean://reset-password?token=" + token;
        } else {
            resetLink = "http://localhost:5173/reset-password?token=" + token;
        }

        // ✅ IN RA CONSOLE - DÙNG LINK NÀY ĐỂ TEST
        System.out.println("\n========== 📧 RESET PASSWORD LINK ==========");
        System.out.println("📧 Email: " + email);
        System.out.println("🔑 Token: " + token);
        System.out.println("🔗 Link: " + resetLink);
        System.out.println("⏰ Expiry: " + expiry + " (15 phút)");
        System.out.println("⚠️  COPY LINK TRÊN VÀ PASTE VÀO BROWSER ĐỂ RESET PASSWORD");
        System.out.println("============================================\n");
        
        // ❌ TẮT EMAIL VÌ JAVA KHÔNG RESOLVE ĐƯỢC smtp.gmail.com
        // TODO: Fix Java DNS resolution issue
        // String content = "Click vào link này để đặt lại mật khẩu (có hiệu lực 15 phút): " + resetLink;
        // emailService.sendSimpleEmail(email, "Yêu cầu đặt lại mật khẩu", content);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ!"));

        if (prt.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token đã hết hạn!");
        }

        User user = prt.getUser();

        if (user.getUserStatus() == 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Tài khoản của bạn đã bị đóng băng. Không thể đặt lại mật khẩu.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(prt);
    }

    @Override
    public GoogleSignInResponse googleSignIn(GoogleSignInRequest request) {
        try {
            System.out.println("=== Processing Google Sign In ===");

            Map<String, String> googleUser = decodeGoogleToken(request.getGoogleToken());

            String email = googleUser.get("email");
            String fullName = googleUser.get("name");
            String picture = googleUser.get("picture");

            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email not found in Google token");
            }

            System.out.println("Google user - Email: " + email + ", Name: " + fullName);

            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            boolean isNewUser;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                isNewUser = false;

                if (user.getUserStatus() == 0) {
                    throw new RuntimeException("Tài khoản của bạn đã bị đóng băng. Vui lòng liên hệ admin để được hỗ trợ.");
                }

                System.out.println("Existing user found: " + user.getUserId());

            } else {
                System.out.println("Creating new user from Google account");

                user = new User();
                user.setFullName(fullName != null ? fullName : "Google User");
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                user.setRole("USER");
                user.setUserStatus(1);
                user.setJoinDate(LocalDate.now());
                user.setAvatarImage(picture != null ? picture : "");

                user = userRepository.save(user);
                isNewUser = true;

                System.out.println("New user created with ID: " + user.getUserId());

                try {
                    userXPService.createInitialUserXP(user.getUserId());
                    System.out.println("UserXP created for Google user");
                } catch (Exception xpError) {
                    System.err.println("Failed to create UserXP for Google user: " + xpError.getMessage());
                }
            }

            GoogleSignInResponse response = new GoogleSignInResponse(
                    user.getUserId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().toUpperCase(),
                    isNewUser,
                    isNewUser ? "Tài khoản mới được tạo thành công" : "Đăng nhập thành công"
            );

            System.out.println("Google signin successful: " + response);
            return response;

        } catch (Exception e) {
            System.err.println("Google sign in error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Google sign in failed: " + e.getMessage());
        }
    }

    private Map<String, String> decodeGoogleToken(String googleToken) throws Exception {
        try {
            System.out.println("Decoding Google token...");

            String[] chunks = googleToken.split("\\.");
            if (chunks.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format");
            }

            String payload = new String(java.util.Base64.getUrlDecoder().decode(chunks[1]));

            Map<String, String> result = new HashMap<>();
            result.put("email", extractJsonValue(payload, "email"));
            result.put("name", extractJsonValue(payload, "name"));
            result.put("picture", extractJsonValue(payload, "picture"));

            if (result.get("name") == null || result.get("name").isEmpty()) {
                String givenName = extractJsonValue(payload, "given_name");
                if (givenName != null && !givenName.isEmpty()) {
                    result.put("name", givenName);
                }
            }

            if (result.get("name") == null || result.get("name").isEmpty()) {
                String familyName = extractJsonValue(payload, "family_name");
                if (familyName != null && !familyName.isEmpty()) {
                    result.put("name", familyName);
                }
            }

            if (result.get("name") == null || result.get("name").isEmpty()) {
                String email = result.get("email");
                if (email != null && email.contains("@")) {
                    result.put("name", email.substring(0, email.indexOf("@")));
                }
            }

            if (result.get("email") == null || result.get("email").isEmpty()) {
                throw new Exception("Email not found in token");
            }

            return result;

        } catch (Exception e) {
            throw new Exception("Failed to decode Google token: " + e.getMessage());
        }
    }

    private String extractJsonValue(String json, String key) {
        try {
            String searchKey = "\"" + key + "\":\"";
            int startIndex = json.indexOf(searchKey);
            if (startIndex == -1) return null;

            startIndex += searchKey.length();
            int endIndex = json.indexOf("\"", startIndex);
            if (endIndex == -1) return null;

            String value = json.substring(startIndex, endIndex);
            return (value != null && !value.trim().isEmpty()) ? value : null;

        } catch (Exception e) {
            return null;
        }
    }
}
