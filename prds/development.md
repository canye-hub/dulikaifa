# Emotion Translator - Development Guide

## 1. 项目概述

本项目是一个极简 Web 应用：

👉 将用户输入的一句话，转换为 3 种不同沟通表达（委婉 / 直接 / 高情商）

特点：
- 单页面应用
- 无登录系统
- 无持久化存储
- 调用 DeepSeek API 实现核心能力

---

## 2. 技术选型（必须遵守）

### 前端
- React（推荐 Next.js App Router）

### 后端
- Next.js API Routes（内置即可）

### 样式
- 简单 CSS / Tailwind（推荐 Tailwind）

### API
- DeepSeek API（deepseek-chat）

---

## 3. 项目结构

建议结构：


/app
/page.tsx // 主页面
/api
/generate
route.ts // API接口

/components
InputBox.tsx
SceneSelect.tsx
GenerateButton.tsx
ResultCard.tsx

/lib
deepseek.ts // 封装API调用


---

## 4. 核心功能实现

## 4.1 页面逻辑（page.tsx）

需要实现：

### 状态管理

```ts
const [text, setText] = useState("")
const [scene, setScene] = useState("通用")
const [results, setResults] = useState<string[]>([])
const [loading, setLoading] = useState(false)
提交逻辑
const handleGenerate = async () => {
  if (!text.trim()) {
    alert("请输入内容")
    return
  }

  if (text.length > 200) {
    alert("超出字数限制")
    return
  }

  setLoading(true)

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ text, scene })
    })

    const data = await res.json()
    setResults(data.results)
  } catch (err) {
    alert("生成失败，请重试")
  } finally {
    setLoading(false)
  }
}
4.2 API实现（/api/generate/route.ts）
请求处理
export async function POST(req: Request) {
  const { text, scene } = await req.json()

  if (!text) {
    return Response.json({ error: "empty text" }, { status: 400 })
  }

  const result = await callDeepSeek(text, scene)

  return Response.json({ results: result })
}
4.3 DeepSeek封装（/lib/deepseek.ts）
环境变量
DEEPSEEK_API_KEY=your_api_key
调用实现
export async function callDeepSeek(text: string, scene: string) {
  const prompt = `
你是一个沟通优化专家。

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
- 用中文输出
`

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  })

  const data = await res.json()

  const content = data.choices[0].message.content

  return parseResults(content)
}
4.4 结果解析（重点）
function parseResults(text: string): string[] {
  return text
    .split("\n")
    .map(t => t.replace(/^\d+[\.\、]/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
}
5. UI实现规范
5.1 页面布局

居中布局

最大宽度：700px

5.2 输入框

textarea

高度：120px

placeholder: "请输入你想表达的话..."

5.3 场景选择

select：

职场

恋爱

通用

5.4 按钮

状态：

状态	文案
默认	生成表达
loading	生成中...
5.5 结果卡片

每条结果：

卡片容器

文本内容

复制按钮

6. 复制功能
navigator.clipboard.writeText(text)

提示：

alert("已复制")
7. 错误处理

必须处理：

空输入

超长输入

API失败

8. 非目标（禁止实现）

❌ 登录系统
❌ 数据库存储
❌ 历史记录
❌ 多页面路由
❌ 复杂状态管理

9. 开发优先级

页面UI搭建

API接口打通

DeepSeek调用

结果解析

状态优化（loading）

10. 完成标准（Definition of Done）

满足以下条件即完成：

能输入一句话

能选择场景

点击后能返回3条结果

UI正常展示

无报错

可复制结果

11. 可选优化（非必须）

toast提示替代 alert

loading spinner

输入字数提示

12. 注意事项（重要）

DeepSeek返回可能包含编号（1. 2. 3.）

必须做清洗

必须保证返回3条

13. 本项目核心原则

👉 简单 > 完美
👉 可运行 > 架构复杂
👉 快速验证 > 过度设计