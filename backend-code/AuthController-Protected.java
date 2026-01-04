package org.example.ktigerstudybe.controller;

import lombok.RequiredArgsConstructor;
import org.example.ktigerstudybe.dto.req.ForgotPasswordRequest;
import org.example.ktigerstudybe.dto.req.GoogleSignInRequest;
import org.example.ktigerstudybe.dto.req.ResetPasswordRequest;
import org.example.ktigerstudybe.dto.req.SignInRequest;
import org.example.ktigerstudybe.dto.req.SignUpRequest;
import org.example.ktigerstudybe.dto.resp.AuthResponse;
import org.example.ktigerstudybe.dto.resp.GoogleSignInResponse;
import org.example.ktigerstudybe.service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AuthController - Authentication Endpoints
 * 
 * ✅ TẤT CẢ ENDPOINTS ĐỀU PUBLIC (không cần @PreAuthorize)
 * Lý do: Ai cũng cần đăng ký, đăng nhập, quên mật khẩu
 * 
 * ⚠️ ĐÃ ĐƯỢC CONFIG PUBLIC TRONG SecurityConfig.java:
 * .requestMatchers("/api/auth/**").permitAll()
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Sign Up - Đăng ký tài khoản mới
     * ✅ PUBLIC - Ai cũng có thể đăng ký
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    /**
     * Sign In - Đăng nhập
     * ✅ PUBLIC - Ai cũng có thể đăng nhập
     */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(authService.signIn(request));
    }

    /**
     * Google Sign In - Đăng nhập bằng Google
     * ✅ PUBLIC - Ai cũng có thể đăng nhập Google
     */
    @PostMapping("/google-signin")
    public ResponseEntity<GoogleSignInResponse> googleSignIn(@RequestBody GoogleSignInRequest request) {
        try {
            System.out.println("=== GOOGLE SIGN IN START ===");
            GoogleSignInResponse response = authService.googleSignIn(request);
            System.out.println("Google signin successful: " + response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Google signin error: " + e.getMessage());
            e.printStackTrace();

            GoogleSignInResponse errorResponse = new GoogleSignInResponse(
                    null, null, null, null, false,
                    "Đăng nhập Google thất bại: " + e.getMessage()
            );

            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    /**
     * Forgot Password - Quên mật khẩu
     * ✅ PUBLIC - Ai cũng có thể yêu cầu reset password
     */
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail(), request.getPlatform());
        return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    }

    /**
     * Test Google Endpoint
     * ✅ PUBLIC - Test endpoint
     */
    @GetMapping("/test-google")
    public ResponseEntity<Map<String, Object>> testGoogle() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Google OAuth endpoint is ready");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
