// src/services/cloudinaryService.ts

/**
 * Service để upload ảnh lên Cloudinary trực tiếp từ frontend
 * Sử dụng unsigned upload preset
 */

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

// Cấu hình Cloudinary - Cloud name ĐÚNG của bạn
const CLOUDINARY_CLOUD_NAME = 'di6d1g736';  // ✅ ĐÚNG: di6d1g736 (số 1, không phải chữ t)
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';  // ✅ Preset đã xóa Asset folder
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload file ảnh lên Cloudinary trực tiếp
 * @param file File ảnh cần upload
 * @returns Promise chứa URL của ảnh đã upload
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('Không có file được chọn');
    }

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Kích thước file không được vượt quá 5MB');
    }

    console.log('📤 Uploading to Cloudinary...');
    console.log('- Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('- Upload Preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('- File name:', file.name);
    console.log('- File type:', file.type);
    console.log('- File size:', (file.size / 1024).toFixed(2), 'KB');

    // Tạo FormData để gửi lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Gửi request trực tiếp lên Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Cloudinary upload error:', errorData);
      throw new Error(errorData.error?.message || 'Upload ảnh thất bại');
    }

    const data: CloudinaryResponse = await response.json();
    
    console.log('✅ Upload thành công:', data.secure_url);
    
    // Trả về URL secure của ảnh
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Có lỗi xảy ra khi upload ảnh');
  }
};

/**
 * Xóa ảnh từ Cloudinary (optional - cần backend API hỗ trợ)
 * @param publicId Public ID của ảnh trên Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  // Lưu ý: Xóa ảnh cần API key và secret, nên thực hiện qua backend
  console.warn('Delete image should be handled by backend with proper authentication');
  // Backend API call here
};

export default {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
