# vibepolyfill

| [zh-Hans](./README.md)
| en-US

[![npm version](https://img.shields.io/npm/v/vibepolyfill)](https://www.npmjs.com/package/vibepolyfill)
[![npm downloads](https://img.shields.io/npm/dm/vibepolyfill)](https://www.npmjs.com/package/vibepolyfill)
![Node support](https://img.shields.io/badge/node-%3E%3D18-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-compatible-F69220?logo=pnpm&logoColor=white)

A small tool to "lay out" rule files for multiple AI IDEs/assistants: keep your rule list in `.vp/` and generate (or route to) platform-specific rule file locations with a single command.

- Supported languages: `en-US`, `zh-Hans`
- Supported types (and aliases): see "Types & aliases" below
- Default initialization: automatically creates `.vp/`, `config.json`, and `.vp/rules/README.md`

## Installation

You can run it directly via `npx` or install it into your project.

```bash
# Run once with npx (recommended for one-off runs)
npx vibepolyfill -t github -l zh-Hans
# Or use the short alias
npx vp -t github -l zh-Hans

# Install locally (as devDependency)
npm i -g -D vibepolyfill
# then run
npx vp -t github -l zh-Hans
```

> Runtime suggestion: Node.js 18+ is recommended. In this repository's development mode, `esbuild-register` is used to execute TypeScript sources; release builds use `dist/index.js`.

## Quick start

1) Run in your project root:

```bash
npx vp -t github -l zh-Hans
```

2) On first run the tool will automatically create:
- `.vp/` directory
- `.vp/config.json` (contains a default rule pointing to `.vp/rules/README.md`)
- `.vp/rules/README.md` (default content generated per language)

3) When using `-t github`, the tool will generate/overwrite `.github/copilot-instructions.md` with a consolidated summary built from your `.vp/config.json` rules.

## Command line usage

```bash
vp [options]

Options:
	-l, --language <language>   Specify language (en-US or zh-Hans)
	-t, --types <types>         Target types, comma-separated. Use `all` for every supported type
```

Examples:

```bash
# Generate rules for GitHub Copilot (Chinese output)
vp -t github -l zh-Hans

# Generate for both GitHub Copilot and Claude
vp -t github,claude

# Run for all supported types
vp -t all
```

> Tip: For target files that already exist, some adapters will ask for confirmation before overwriting (interactive yes/no).

## Configuration

The tool creates `.vp/config.json` in your project root; maintain your rule list there.

Two supported rule formats:
- String: a path relative to the project root
- Object: `{ path, description?, pattern? }`

Example:

```json
{
	"rules": [
		".vp/rules/README.md",
		{ "path": "docs/prompt/coding.md", "description": "Coding guidelines" },
		{ "path": "docs/prompt/review.md", "pattern": "**/*.{ts,tsx}", "description": "Code review notes" }
	]
}
```

Adapters (e.g. `github`, `junie`, `trae`, `claude`) will produce a consolidated "routing" Markdown from the list. That document includes:
- Field explanations (meaning of `path`, `description`, `pattern`)
- The JSON list of rules so an AI/assistant can read it programmatically if needed

> Note: `path` entries will be resolved to absolute paths. `description` and `pattern` are for human/readability or matching logic and do not change file locations.

## Types & aliases

Built-in types:
- aiassistant, amazonq, cline, continue, cursor, gemini, github, junie, kiro, trae, windsurf, claude

Available aliases:
- aiassistant: idea, jetbrains, jb
- amazonq: amazon, amaz
- github: copilot
- claude: claudeCode, claudecode, claude-code

You may pass multiple types separated by commas, or use `all` to target every type at once.

## Generation behavior

Behaviour varies by type and falls into two categories:

1) Generate a consolidated routing Markdown (with overwrite confirmation):
	 - github → `.github/copilot-instructions.md`
	 - junie  → `.junie/guidelines.md`
	 - trae   → `.trae/project_rules.md`
	 - claude → `CLAUDE.md` in the repository root

2) Directory + rule links (other types):
	 - If a type has no specialized adapter, the tool creates the corresponding directory (see mapping below) and links your rule files into that directory so the IDE/assistant can discover them.

Directory mapping (excerpt):
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
- claude     → (empty string — repository root)

> Warning: On some systems (e.g. Windows) creating symbolic links may require administrative or developer-mode privileges.

## Development & build

```bash
# Install dependencies
pnpm i

# Local development (uses the repo's .dev-tag and runs TS source)
pnpm dev   # equivalent to: npx vp

# Build for publish
pnpm build # outputs dist/index.js
```

- Executable entry: `vibepolyfill.js` (development mode uses `esbuild-register` to load `src/index.ts`, otherwise `dist/index.js`)
- Bundler: `esbuild` (see the `build` script in `package.json`)

## FAQ

- Asked to overwrite an existing file?
	- The tool asks interactively before overwriting; if you choose "no", it will exit without overwriting.
- Can't find the expected files?
	- Ensure you passed the correct `-t` type. Aliases will be auto-mapped to their canonical type.
	- Check that the paths listed under `rules` in `.vp/config.json` actually exist.
- Multilingual content is empty?
	- `en-US` and `zh-Hans` default contents may not be fully synced; use `-l zh-Hans` if you want the more complete Chinese annotations.
- Symbolic link creation failed?
	- Some platforms require admin privileges or developer mode to create symlinks.

## Tags

`vibepolyfill`, `AI assistant`, `IDE`, `rules`, `prompt`, `GitHub Copilot`, `Claude`, `Cursor`, `Windsurf`, `Continue`, `Amazon Q`, `Cline`, `Junie`, `Trae`, `Gemini`, `routing`, `symlink`, `CLI`, `Node.js`, `pnpm`

## License

No license specified.
