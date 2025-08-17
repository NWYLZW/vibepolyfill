import { i18nRender } from './utils'

export type ResolvedRule = {
  path: string
  pattern?: string
  description?: string
}

export type Rule =
  | string
  | ResolvedRule

export interface VPConfig {
  rules?: Rule[]
}

export const DEFAULT_VP_CONFIG = {
  rules: [
    '.vp/rules/README.md'
  ]
}

export const DEFAULT_RULE_MD = i18nRender({
  'zh-Hans': `
  默认规则文件
  `,
  'en-US': `
  Default rule file
  `
})

export const ROUTE_RULE_MD = (rules: ResolvedRule[]) => i18nRender({
  'zh-Hans': `
  需要严格按照如下的规则去阅读对应的文件，这里是对字段的一些解释
  - path：对应的子规则文件路径
  - description: 规则文件涉及内容的简要介绍，可以辅助判断是否进行阅读
  - pattern：文件路径匹配时阅读该子规则文件内容
  如果一个规则对象，不存在 description 和 pattern 则默认进行阅读
  \`\`\`ts
  ${JSON.stringify(rules)}
  \`\`\`
  `,
  'en-US': `
  Please read the referenced files following the rules below. Field explanations:
  - path: the filesystem path to the sub-rule file
  - description: a short summary of what the rule file contains to help decide whether to read it
  - pattern: when present, only read this sub-rule if the target file path matches the given pattern
  If a rule object has neither description nor pattern, it will be read by default.
  \`\`\`ts
  ${JSON.stringify(rules)}
  \`\`\`
  `
})()

export const TYPE_ALIAS = {
  aiassistant: [
    'idea',
    'jetbrains',
    'jb'
  ],
  amazonq: [
    'amazon',
    'amaz'
  ],
  github: [
    'copilot'
  ],
  claude: [
    'claudeCode',
    'claudecode',
    'claude-code',
  ]
}

export const DIRECTORY_MAP: Record<string, string> = {
  aiassistant: '.aiassistant/rules',
  amazonq: '.amazonq/rules',
  cline: '.clinerules',
  continue: '.continue/rules',
  cursor: '.cursor/rules',
  gemini: '.gemini',
  github: '.github',
  junie: '.junie',
  kiro: '.kiro/steering',
  trae: '.trae/rules',
  windsurf: '.windsurf/rules',
  claude: ''
}

export const ALL_TYPES = Object
  .keys(DIRECTORY_MAP)
  .concat(
    Object.values(TYPE_ALIAS).flat()
  )
