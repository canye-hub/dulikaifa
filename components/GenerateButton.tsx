"use client";

type GenerateButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export default function GenerateButton({ loading, onClick }: GenerateButtonProps) {
  return (
    <button
      className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      onClick={onClick}
      disabled={loading}
      type="button"
    >
      {loading ? "生成中..." : "生成表达"}
    </button>
  );
}
