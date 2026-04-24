"use client";

import { useState } from "react";
import GenerateButton from "@/components/GenerateButton";
import InputBox from "@/components/InputBox";
import ResultCard from "@/components/ResultCard";
import SceneSelect, { type Scene } from "@/components/SceneSelect";

const MAX_LENGTH = 200;
const FALLBACK_RESULTS = ["生成失败，请重试", "生成失败，请重试", "生成失败，请重试"];

export default function Home() {
  const [text, setText] = useState("");
  const [scene, setScene] = useState<Scene>("通用");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyHint, setCopyHint] = useState("");

  const handleGenerate = async () => {
    if (loading) return;

    const normalizedText = text.trim();
    if (!normalizedText) {
      setError("请输入内容");
      return;
    }

    if (normalizedText.length > MAX_LENGTH) {
      setError("超出字数限制");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: normalizedText, scene }),
      });

      const data = (await response.json()) as { error?: string; results?: string[] };

      if (!response.ok || !data.results || data.results.length < 3) {
        throw new Error(data.error ?? "生成失败，请重试");
      }

      setResults(data.results.slice(0, 3));
      setError("");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "生成失败，请重试";
      setResults(FALLBACK_RESULTS);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("已复制");
    } catch {
      setCopyHint("复制失败，请手动复制");
    }

    setTimeout(() => setCopyHint(""), 1500);
  };

  return (
    <main className="mx-auto w-full max-w-[700px] px-4 py-10">
      <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900">情绪表达翻译器</h1>

      <section className="space-y-4">
        <InputBox
          value={text}
          onChange={setText}
          maxLength={MAX_LENGTH}
          disabled={loading}
        />
        <p className="text-right text-xs text-zinc-500">{text.length}/{MAX_LENGTH}</p>

        <SceneSelect value={scene} onChange={setScene} disabled={loading} />
        <GenerateButton loading={loading} onClick={handleGenerate} />

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {copyHint && <p className="text-xs text-zinc-600">{copyHint}</p>}
      </section>

      {results.length > 0 && (
        <section className="mt-6 space-y-4">
          {results.map((result, index) => (
            <ResultCard key={`${result}-${index}`} text={result} onCopy={handleCopy} />
          ))}
        </section>
      )}
    </main>
  );
}
