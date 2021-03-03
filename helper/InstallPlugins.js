const { readFile, readdir, stat } = require('fs/promises')
const decompress = require('decompress')
const del = require('del')
const download = require('download')
const fs = require('fs')
const jsyaml = require('js-yaml')
const path = require('path')

;(async () => {
  const temp = path.join(__dirname, '../temp/plugins')
  const pluginSrc = path.join(__dirname, '../plugins')
  const pluginDist = path.join(__dirname, '../www/wp-content/plugins')
  const pluginList = await readFile(
    path.join(__dirname, '../plugins.yml'),
    'utf8'
  )
  const plugins = await jsyaml.load(pluginList)
  if (fs.existsSync(pluginDist)) {
    const st = await stat(pluginDist)
    // 存在している場合削除する
    if (st && st.isDirectory()) {
      del(pluginDist)
    }
  }

  // リスト内のファイルのダウンロード処理
  for (const item of plugins) {
    const url = item.url
      ? item.url
      : item.version
      ? `https://downloads.wordpress.org/plugin/${item.slug}.${item.version}.zip`
      : `https://downloads.wordpress.org/plugin/${item.slug}.zip`
    const buffer = await download(url, temp).catch((err) => {
      console.error(`${item.name || item.slug} download failed : ${err}`)
    })
    console.log(`${item.name || item.slug} downloaded`)
    await decompress(buffer, `${pluginDist}/${item.slug}`, { strip: 1 })
    console.log(`${item.name || item.slug} decompressed`)
  }

  // pluginフォルダにあらかじめzipファイルが置いてあった場合
  readdir(pluginSrc, { withFileTypes: true }, async (err, dirents) => {
    if (err) {
      console.error(err)
      return
    }
    for (const dirent of dirents) {
      const fp = path.join(pluginSrc, dirent.name)
      if (!dirent.isDirectory() && /.*\.zip$/.test(fp)) {
        await decompress(fp, pluginDist)
        console.log(`${dirent.name} decompressed`)
      }
    }
  })
})()
