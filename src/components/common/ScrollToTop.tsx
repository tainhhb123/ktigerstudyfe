// src/components/common/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";  // Sửa import từ react-router-dom

/**
 * Component tự động cuộn lên đầu trang khi route thay đổi.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
