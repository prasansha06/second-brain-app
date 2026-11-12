import { ChangeEvent } from "react";

interface InputProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ placeholder, type = "text", value, onChange }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 w-full text-sm text-gray-800 placeholder-gray-400 transition"
    />
  );
}
