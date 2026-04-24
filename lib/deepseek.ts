const FALLBACK_TEXT = "生成失败，请重试";

export function parseResults(text: string): string[] {
  const stripLeadingLabel = (line: string): string =>
    line.replace(
      /^(更委婉的表达|委婉表达|更直接的表达|直接表达|高情商表达|高情商的表达)\s*[:：]\s*/i,
      "",
    );

  const parsed = text
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[\.\、]\s*/, "").trim())
    .map((line) => stripLeadingLabel(line).trim())
    .filter(Boolean)
    .slice(0, 3);

  while (parsed.length < 3) {
    parsed.push(FALLBACK_TEXT);
  }

  return parsed;
}

export async function callDeepSeek(text: string, scene: string): Promise<string[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY");
  }

  const prompt = `你是一个沟通优化专家。

请根据用户输入，在指定场景下，将其改写为3种表达方式：

场景：${scene}

用户原话：
${text}

请输出：
1. 更委婉的表达
2. 更直接的表达
3. 高情商表达

要求：
- 保留原意
- 表达自然
- 每条一句话
- 不要解释
- 用中文输出`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices.length) {
    throw new Error("DeepSeek response missing choices");
  }

  const content = data.choices[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("DeepSeek response content is empty");
  }

  return parseResults(content);
}
