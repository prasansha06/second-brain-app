import { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-purple-200 text-purple-600 hover:bg-indigo-100"
};

const sizeStyles = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-sm font-medium",
  lg: "py-3 px-6 text-base font-semibold"
};

const defaultStyles = "rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

export function Button({ variant, text, startIcon, endIcon, onClick, fullWidth, loading, size = "md" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${defaultStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {startIcon ? <div className="text-current">{startIcon}</div> : null}
      <span>{loading ? "Loading..." : text}</span>
      {endIcon ? <div className="text-current">{endIcon}</div> : null}
    </button>
  );
}
