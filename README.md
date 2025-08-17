# vibepolyfill

| zh-Hans
| [en-US](./README.en.md)

[![npm version](https://img.shields.io/npm/v/vibepolyfill)](https://www.npmjs.com/package/vibepolyfill)
[![npm downloads](https://img.shields.io/npm/dm/vibepolyfill)](https://www.npmjs.com/package/vibepolyfill)
![Node support](https://img.shields.io/badge/node-%3E%3D18-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-compatible-F69220?logo=pnpm&logoColor=white)

一个用于为多种 AI IDE/助手“铺设规则文件”的小工具：统一在 `.vp` 中维护你的规则清单，然后一键为不同平台生成（或路由到）对应的规则文件位置。

- 支持的语言：`en-US`、`zh-Hans`
- 支持的类型（含别名）：见下文“类型与别名”
- 默认初始化：自动创建 `.vp/`、`config.json` 与 `.vp/rules/README.md`

## 安装

可直接通过 npx 运行，或安装到项目中。

```bash
# 使用 npx（推荐用于一次性运行）
npx vibepolyfill -t github -l zh-Hans
# 或使用短命令别名
npx vp -t github -l zh-Hans

# 安装到本地（devDependencies）
npm i -g -D vibepolyfill
# 之后
npx vp -t github -l zh-Hans
```

> 运行要求：建议 Node.js 18+。本仓库开发模式下会使用 `esbuild-register` 执行 TypeScript 源码；发布模式使用 `dist/index.js`。

## 快速开始

1) 在你的项目根目录执行：

```bash
npx vp -t github -l zh-Hans
```

2) 首次运行会自动创建：
- `.vp/` 目录
- `.vp/config.json`（默认包含一条规则：`.vp/rules/README.md`）
- `.vp/rules/README.md`（会按语言生成默认内容）

3) 指定 `-t github` 时，会在 `.github/` 下生成/覆盖 `copilot-instructions.md`，其内容会根据你的 `.vp/config.json` 里的规则自动汇总。

## 命令行用法

```bash
vp [options]

选项：
  -l, --language <language>  指定语言（en-US 或 zh-Hans）
  -t, --types <types>        目标类型，多个用逗号分隔；或使用 all 代表全部类型
```

示例：

```bash
# 为 GitHub Copilot 生成规则文件（中文）
vp -t github -l zh-Hans

# 同时为 GitHub Copilot 与 Claude 生成
vp -t github,claude

# 为全部支持类型执行
vp -t all
```

> 提示：若目标文件已存在，部分类型会进行覆盖前确认（交互式 yes/no）。

## 配置

工具会在项目根目录创建 `.vp/config.json`，你可以在其中维护“规则清单”。

支持两种规则写法：
- 字符串：表示相对项目根目录的文件路径
- 对象：形如 `{ path, description?, pattern? }`

示例：

```json
{
  "rules": [
    ".vp/rules/README.md",
    { "path": "docs/prompt/coding.md", "description": "编码规范" },
    { "path": "docs/prompt/review.md", "pattern": "**/*.{ts,tsx}", "description": "代码评审要点" }
  ]
}
```

生成类适配器（如 `github`、`junie`、`trae`、`claude`）会根据以上清单产出一个“汇总路由”Markdown，其内容包含：
- 字段说明（path、description、pattern 的含义）
- 以及清单的 JSON 列表，便于 AI/助手按需读取

> 规则中的 `path` 会被解析为绝对路径；`description` 和 `pattern` 仅用于辅助阅读或匹配策略，不会改变文件路径。

## 类型与别名

内建类型：
- aiassistant, amazonq, cline, continue, cursor, gemini, github, junie, kiro, trae, windsurf, claude

可用别名：
- aiassistant: idea, jetbrains, jb
- amazonq: amazon, amzn
- github: copilot
- claude: claudeCode, claudecode, claude-code

你可以用逗号连接多个类型，或使用 `all` 一次性针对全部类型执行。

## 生成行为说明

不同类型的行为分两类：

1) 生成“汇总路由”Markdown（带覆盖确认）：
   - github → `.github/copilot-instructions.md`
   - junie  → `.junie/guidelines.md`
   - trae   → `.trae/project_rules.md`
   - claude → 在仓库根目录生成 `CLAUDE.md`

2) 目录 + 规则链接（其它类型）：
   - 若该类型没有专用适配器，会创建对应目录（见下方映射），并将你的规则文件链接到该目录下，便于在对应 IDE/助手中发现这些规则。

目录映射（节选）：
- aiassistant → `.aiassistant/rules`
- amazonq    → `.amazonq/rules`
- cline      → `.clinerules`
- continue   → `.continue/rules`
- cursor     → `.cursor/rules`
- gemini     → `.gemini`
- github     → `.github`
- junie      → `.junie`
- kiro       → `.kiro/steering`
- trae       → `.trae/rules`
- windsurf   → `.windsurf/rules`
- claude     → （空字符串，代表仓库根目录）

> 注意：在某些系统（如 Windows）下创建符号链接可能需要管理员/开发者模式权限。

## 开发与构建

```bash
# 安装依赖
pnpm i

# 本地开发（使用仓库内的 .dev-tag，运行 TS 源码）
pnpm dev   # 等同于：npx vp

# 构建产物（用于发布）
pnpm build # 产出 dist/index.js
```

- 可执行入口：`vibepolyfill.js`（在开发模式使用 `esbuild-register` 直接加载 `src/index.ts`，否则使用 `dist/index.js`）
- 打包：`esbuild`（见 `package.json` 的 `build` 脚本）

## 常见问题

- 提示覆盖已存在文件？
  - 交互式确认后再覆盖；若选择否，程序会退出。
- 没有看到期望的文件？
  - 请确认传入了正确的 `-t` 类型；若使用别名，工具会自动映射到主类型。
  - 检查 `.vp/config.json` 中的 `rules` 路径是否存在。
- 多语言内容为空？
  - 目前 `en-US` 与 `zh-Hans` 的默认内容不同步程度不同；可使用 `-l zh-Hans` 以获得中文注释更完整的汇总说明。
- 符号链接失败？
  - 在某些平台上需要管理员权限，或开启开发者模式。

## 标签

`vibepolyfill`, `AI 助手`, `IDE`, `规则文件`, `Prompt`, `GitHub Copilot`, `Claude`, `Cursor`, `Windsurf`, `Continue`, `Amazon Q`, `Cline`, `Junie`, `Trae`, `Gemini`, `路由`, `符号链接`, `CLI`, `Node.js`, `pnpm`

## 许可

暂未指定许可协议。
