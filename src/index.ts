import * as fs from 'node:fs'
import * as process from 'node:process'
import { resolve, dirname } from 'node:path'

import { program } from 'commander'

import {
  ALL_TYPES,
  DEFAULT_RULE_MD,
  DEFAULT_VP_CONFIG,
  DIRECTORY_MAP,
  ResolvedRule, ROUTE_RULE_MD,
  TYPE_ALIAS,
  VPConfig
} from './constants'
import { setLanguage } from './utils'
import * as readline from 'node:readline'

const cwd = process.cwd()

function makeSureVPDirectoryIsExists() {
  const vpPath = resolve(cwd, '.vp')

  const vpIsExists = fs.existsSync(vpPath)

  if (!vpIsExists) {
    fs.mkdirSync(vpPath)
    fs.mkdirSync(resolve(vpPath, 'rules'))
    fs.writeFileSync(
      resolve(vpPath, 'config.json'), JSON.stringify(DEFAULT_VP_CONFIG, null, 2)
    )
    fs.writeFileSync(
      resolve(vpPath, 'rules/README.md'), DEFAULT_RULE_MD()
    )
  }

  return vpPath
}

interface Adapt {
  (directory: string, options: {
    resolvedRules: ResolvedRule[]
  }): Promise<void>
}

const createRouteMDAdapt = (filename: string): Adapt => async (dir, { resolvedRules }) => {
  const rulePath = resolve(dir, filename)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (fs.existsSync(rulePath)) {
    // 提示文件要被覆盖了，进行确认，如果用户确认，则覆盖
    console.warn(`File ${rulePath} already exists, it will be overwritten.`)
    // 等待用户输入
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    const answer = await new Promise<string>(re => {
      rl.question('Do you want to overwrite it? (yes/no): ', re)
    })
    rl.close()
    if (!['y', 'yes'].includes(answer.toLowerCase())) {
      process.exit(1)
    }
  }
  fs.writeFileSync(rulePath, ROUTE_RULE_MD(resolvedRules))
}

const adapters: Record<string, Adapt> = {
  github: createRouteMDAdapt('copilot-instructions.md'),
  junie: createRouteMDAdapt('guidelines.md'),
  trae: createRouteMDAdapt('project_rules.md'),
  claude: createRouteMDAdapt('CLAUDE.md')
}

program
  .option(
    '-l, --language <language>',
    'Specify the language for the polyfill.\n' +
    'Supported languages are: [list of supported languages].'
  )
  .option(
    '-t, --types <types>',
    `Polyfill target type ide,\n` +
    `Supported types are: : ${ALL_TYPES.join(', ')}.\n` +
    'You can join its by `,`.\n' +
    'And you can use `all` to enable all ide polyfill.'
  )
  .action(({
    types: inputTypes,
    language
  }: {
    types: string
    language?: string
  }) => {
    language !== undefined && setLanguage(language)

    const TYPE_ALIAS_ENTRIES = Object.entries(TYPE_ALIAS)
    const types = inputTypes === 'all'
      ? ALL_TYPES
      : inputTypes
        ?.split(',')
        ?.filter(t => ALL_TYPES.includes(t))
        ?.map(t => {
          return TYPE_ALIAS_ENTRIES.find(([, aliases]) => aliases.includes(t))?.[0] ?? t
        })
        ?? []

    const vpPath = makeSureVPDirectoryIsExists()
    const config: VPConfig = JSON.parse(
      fs.readFileSync(resolve(vpPath, './config.json'), 'utf-8').toString()
    )
    const { rules = [] } = config
    const resolvedRules = rules.map(
      rule =>
        typeof rule === 'string' ? {
          path: resolve(cwd, rule)
        } : {
          ...rule,
          path: resolve(cwd, rule.path)
        }
    )

    types.forEach(type => {
      const d = resolve(cwd, DIRECTORY_MAP[type])
      const adapt = adapters[type]
      if (!adapt) {
        if (!fs.existsSync(d)) {
          fs.mkdirSync(d, { recursive: true })
        }
        resolvedRules.forEach(({ path }) => {
          fs.symlinkSync(path, resolve(d, dirname(path)))
        })
        return
      }
      adapt(d, {
        resolvedRules
      })
    })
  })

program.parse(process.argv)
