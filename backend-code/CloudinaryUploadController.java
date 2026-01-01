package com.ktiger.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class CloudinaryUploadController {

    // Cấu hình Cloudinary - THAY ĐỔI theo thông tin của bạn
    private final Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
        "cloud_name", "di6dtjg736",
        "api_key", "417542494234786",        // API Key từ Dashboard (dùng key đầu tiên hoặc thứ 2 đều được)
        "api_secret", "YOUR_API_SECRET"      // ⚠️ PASTE API SECRET VÀO ĐÂY (click icon mắt để xem)
    ));

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Kiểm tra loại file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Kiểm tra kích thước (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size must not exceed 5MB");
            }

            // Upload lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap(
                    "folder", "avatars",           // Folder lưu ảnh
                    "resource_type", "image",
                    "overwrite", true,             // Cho phép ghi đè
                    "unique_filename", true        // Tạo tên file unique
                )
            );

            // Lấy secure URL
            String imageUrl = (String) uploadResult.get("secure_url");

            // Trả về URL
            return ResponseEntity.ok(Map.of(
                "success", true,
                "url", imageUrl,
                "publicId", uploadResult.get("public_id")
            ));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", "Upload failed: " + e.getMessage()));
        }
    }
}
