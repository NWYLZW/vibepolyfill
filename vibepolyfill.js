#!/usr/bin/env node
const fs = require('node:fs')
const path = require("node:path");

if (fs.existsSync(path.resolve(__dirname, '.dev-tag'))) {
  require('esbuild-register')
  require('./src/index.ts')
} else {
  require('./dist/index.js')
}
