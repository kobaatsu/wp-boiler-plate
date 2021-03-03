const commander = require('commander')
const { existsSync } = require('fs')
const { mkdir, writeFile } = require('fs/promises')
const path = require('path')
const pug = require('pug')
const readdirRecursively = require('./readdirRecursively')

;(async () => {
  const srcDir = commander.parse(process.argv).args[0]
  const distDir = commander.parse(process.argv).args[1]
  if (!srcDir || !distDir) return
  if (!existsSync(distDir)) {
    await mkdir(distDir)
  }
  let src = await readdirRecursively(srcDir)
  src = src.filter((elm) => /\.pug$/.test(elm))
  for (const item of src) {
    const name = path.basename(item, 'pug')
    const ext = 'php'
    const dir = path.dirname(item).replace(srcDir, distDir)
    if (!existsSync(dir)) {
      await mkdir(dir)
    }
    const html = await pug.renderFile(item, {
      filters: {
        php: (text) => {
          text = '<?php ' + text + ' ?>'
          return text
        },
      },
    })
    writeFile(path.format({ dir, name, ext }), html)
  }
})()
