import { callDeepSeek } from "@/lib/deepseek";
import type { Scene } from "@/components/SceneSelect";

const MAX_LENGTH = 200;
const VALID_SCENES: Scene[] = ["职场", "恋爱", "通用"];
const SCENE_MAPPING: Record<Scene, string> = {
  职场: "职场沟通",
  恋爱: "亲密关系",
  通用: "日常沟通",
};

export async function POST(req: Request) {
  try {
    const { text, scene } = (await req.json()) as { text?: unknown; scene?: unknown };
    const normalizedText = typeof text === "string" ? text.trim() : "";
    const normalizedScene = typeof scene === "string" ? scene : "";

    if (!normalizedText) {
      return Response.json({ error: "请输入内容" }, { status: 400 });
    }

    if (normalizedText.length > MAX_LENGTH) {
      return Response.json({ error: "超出字数限制" }, { status: 400 });
    }

    if (!VALID_SCENES.includes(normalizedScene as Scene)) {
      return Response.json({ error: "场景参数不合法" }, { status: 400 });
    }

    const results = await callDeepSeek(
      normalizedText,
      SCENE_MAPPING[normalizedScene as Scene],
    );

    return Response.json({ results });
  } catch {
    return Response.json({ error: "生成失败，请重试" }, { status: 500 });
  }
}
