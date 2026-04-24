"use client";

type InputBoxProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  disabled?: boolean;
};

export default function InputBox({
  value,
  onChange,
  maxLength,
  disabled = false,
}: InputBoxProps) {
  return (
    <textarea
      className="h-30 w-full resize-none rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
      placeholder="请输入你想表达的话..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
}
