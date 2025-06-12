// src/components/ui/button/Button.tsx
import React, { ReactNode, ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;                 // Nội dung button
  size?: "sm" | "md";                  // Kích thước
  variant?: "primary" | "outline";     // Kiểu button
  startIcon?: ReactNode;               // Icon trước text
  endIcon?: ReactNode;                 // Icon sau text
  className?: string;                  // Class mở rộng
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  className = "",
  ...rest // bao gồm type, disabled, onClick, v.v.
}) => {
  // Classes theo size
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Classes theo variant
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg transition",
        sizeClasses[size],
        variantClasses[variant],
        className,
        rest.disabled ? "cursor-not-allowed opacity-50" : ""
      ].join(" ")}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
