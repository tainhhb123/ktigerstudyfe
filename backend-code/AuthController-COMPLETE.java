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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(authService.signIn(request));
    }

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

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail(), request.getPlatform());
        return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    }

    // ✅ THÊM METHOD NÀY - RESET PASSWORD
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.");
    }

    @GetMapping("/test-google")
    public ResponseEntity<Map<String, Object>> testGoogle() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Google OAuth endpoint is ready");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
