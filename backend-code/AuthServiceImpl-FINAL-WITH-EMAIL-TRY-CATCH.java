// Copy TOÀN BỘ method này vào AuthServiceImpl.java của bạn
// Thay thế method forgotPassword() cũ

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

    // ✅ LUÔN IN RA CONSOLE (backup nếu email fail)
    System.out.println("\n========== 📧 RESET PASSWORD LINK ==========");
    System.out.println("📧 Email: " + email);
    System.out.println("🔑 Token: " + token);
    System.out.println("🔗 Link: " + resetLink);
    System.out.println("⏰ Expiry: " + expiry + " (15 phút)");
    System.out.println("============================================\n");
    
    // ✅ THỬ GỬI EMAIL - KHÔNG CRASH NẾU THẤT BẠI
    try {
        String content = "Xin chào,\n\n" +
                       "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản KTigerStudy.\n\n" +
                       "Click vào link sau để đặt lại mật khẩu (có hiệu lực 15 phút):\n" +
                       resetLink + "\n\n" +
                       "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                       "Trân trọng,\n" +
                       "KTigerStudy Team";
        
        emailService.sendSimpleEmail(email, "Yêu cầu đặt lại mật khẩu - KTigerStudy", content);
        System.out.println("✅ Email sent successfully to: " + email);
        
    } catch (Exception emailError) {
        // ⚠️ EMAIL THẤT BẠI - LOG WARNING NHƯNG KHÔNG CRASH APP
        System.err.println("⚠️  WARNING: Failed to send email to " + email);
        System.err.println("⚠️  Error: " + emailError.getMessage());
        System.err.println("⚠️  User can still use the link above from console/logs");
        // KHÔNG throw exception - app vẫn chạy bình thường
    }
}
