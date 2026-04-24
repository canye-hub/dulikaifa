"use client";

export type Scene = "职场" | "恋爱" | "通用";

type SceneSelectProps = {
  value: Scene;
  onChange: (scene: Scene) => void;
  disabled?: boolean;
};

const SCENE_OPTIONS: Scene[] = ["职场", "恋爱", "通用"];

export default function SceneSelect({
  value,
  onChange,
  disabled = false,
}: SceneSelectProps) {
  return (
    <select
      className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
      value={value}
      onChange={(event) => onChange(event.target.value as Scene)}
      disabled={disabled}
    >
      {SCENE_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
