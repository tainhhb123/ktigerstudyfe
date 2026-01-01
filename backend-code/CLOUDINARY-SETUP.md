# Hướng dẫn setup Backend Cloudinary Upload

## 1. Thêm dependency vào pom.xml (Maven)

```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

Hoặc vào build.gradle (Gradle):

```gradle
implementation 'com.cloudinary:cloudinary-http44:1.36.0'
```

## 2. Lấy API Key và Secret từ Cloudinary

1. Vào: https://cloudinary.com/console
2. Dashboard → Ở phần đầu trang, bạn sẽ thấy:
   - Cloud name: `do0k0jkej`
   - API Key: `123456789012345` (ví dụ)
   - API Secret: `abcdefghijklmnopqrstuvwxyz` (ví dụ)

3. Copy API Key và API Secret

## 3. Cập nhật CloudinaryUploadController.java

Mở file `backend-code/CloudinaryUploadController.java`

Thay đổi dòng 15-16:
```java
"api_key", "YOUR_API_KEY",        // Thay bằng API Key từ Dashboard
"api_secret", "YOUR_API_SECRET"   // Thay bằng API Secret từ Dashboard
```

## 4. Khởi động Backend

```bash
mvn spring-boot:run
# hoặc
./gradlew bootRun
```

## 5. Test

1. Start backend (port 8080)
2. Reload frontend (npm run dev)
3. Upload avatar → Sẽ gọi API backend thay vì Cloudinary trực tiếp

## Lợi ích:

✅ Không cần upload preset
✅ Bảo mật hơn (API key không lộ ra frontend)
✅ Chắc chắn hoạt động 100%
✅ Có thể kiểm soát tốt hơn (resize, format, v.v.)
