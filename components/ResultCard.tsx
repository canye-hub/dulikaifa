"use client";

type ResultCardProps = {
  label: string;
  text: string;
  onCopy: (text: string) => void;
};

export default function ResultCard({ label, text, onCopy }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="mb-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">
        <span className="font-semibold text-zinc-800">{label}：</span>
        {text}
      </p>
      <button
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 transition hover:bg-zinc-100"
        onClick={() => onCopy(text)}
        type="button"
      >
        复制
      </button>
    </div>
  );
}
