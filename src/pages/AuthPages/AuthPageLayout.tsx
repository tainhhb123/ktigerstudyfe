// src/components/layouts/AuthLayout.tsx
import React from "react";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

// src/components/layouts/AuthLayout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-6 sm:p-12">
        {children}
      </div>

      {/* Right panel */}
      <div
        className="
          hidden lg:block
          w-1/2 h-full
          bg-[url('/images/bgauth_basicf.png')]
          bg-cover bg-center
          relative
        "
      >
        {/* Nếu cần overlay mờ */}
        {/* <div className="absolute inset-0 bg-black/40"></div> */}

        {/* Nếu bạn vẫn muốn logo/text ở giữa */}
        
      </div>

      {/* Theme toggler */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}

