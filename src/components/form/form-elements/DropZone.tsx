import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

// Sử dụng preset UNSIGNED đã có sẵn
const CLOUDINARY_UPLOAD_PRESET = "cloudtinsama"; // Preset Unsigned của bạn
const CLOUDINARY_CLOUD_NAME = "do0k0jkej"; // Cloud name từ dashboard

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  console.log("Uploading to cloud:", CLOUDINARY_CLOUD_NAME);
  console.log("Using preset:", CLOUDINARY_UPLOAD_PRESET);
  console.log("File size:", file.size);
  console.log("File type:", file.type);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    const data = await response.json();
    console.log("Cloudinary response:", data);
    
    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      throw new Error(data.error?.message || `HTTP Error: ${response.status}`);
    }
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Cloudinary error response:", data);
      throw new Error(data.error?.message || "Upload thất bại - không có URL trả về");
    }
  } catch (error) {
    console.error("Upload error details:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error hoặc lỗi không xác định");
  }
}

interface DropzoneComponentProps {
  onUploaded: (url: string) => void;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      console.log("File to upload:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      setUploading(true);
      setError(null);
      
      try {
        const url = await uploadToCloudinary(file);
        console.log("Upload successful:", url);
        onUploaded(url);
        alert("Tải lên thành công!");
      } catch (error) {
        console.error("Upload failed:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        alert(`Tải lên thất bại: ${errorMessage}`);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "audio/*": [".mp3", ".wav", ".ogg"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (rejectedFiles) => {
      console.log("Rejected files:", rejectedFiles);
      alert("Tệp không hợp lệ hoặc quá lớn (tối đa 10MB)");
    },
  });

  return (
    <ComponentCard title="Tải lên Media">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            <strong>Lỗi tải lên:</strong> {error}
          </p>
        </div>
      )}
      
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
            ${isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
            ${uploading ? "opacity-50 pointer-events-none" : ""}
          `}
          id="demo-upload"
        >
          <input {...getInputProps()} disabled={uploading} />
          <div className="dz-message flex flex-col items-center m-0!">
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                ) : (
                  <svg
                    className="fill-current"
                    width="29"
                    height="28"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                )}
              </div>
            </div>
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {uploading
                ? "Đang tải lên..."
                : isDragActive
                ? "Thả tệp vào đây"
                : "Kéo & Thả tệp vào đây"}
            </h4>
            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              {uploading 
                ? "Vui lòng đợi..."
                : "Kéo và thả tệp PNG, JPG, WebP, âm thanh, video vào đây hoặc duyệt"
              }
            </span>
            {!uploading && (
              <span className="font-medium underline text-theme-sm text-brand-500">
                Duyệt tệp
              </span>
            )}
          </div>
        </form>
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
