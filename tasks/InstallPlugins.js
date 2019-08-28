const fs = require('fs')
const path = require('path')
const jsyaml = require('js-yaml')
const del = require('del')
const download = require('download')
const decompress = require('decompress')

const plugins = jsyaml.safeLoad(fs.readFileSync('./plugins.yml', 'utf8'))

const temp = './temp/plugins'
const pluginSrc = './plugins'
const pluginDist = './dev/wp-content/plugins'

const InstallPlugins = () => {
  return new Promise(resolve => {
    if (fs.existsSync(pluginDist) && fs.statSync(pluginDist).isDirectory()) {
      del(pluginDist)
    }
    plugins.forEach(elm => {
      const url = elm.url
        ? elm.url
        : elm.version
        ? `https://downloads.wordpress.org/plugin/${elm.slug}.${elm.version}.zip`
        : `https://downloads.wordpress.org/plugin/${elm.slug}.zip`

      download(url, temp).then(
        data => {
          console.log(`${elm.name || elm.slug} downloaded`)
          decompress(data, `${pluginDist}/${elm.slug}`, { strip: 1 }).then(() =>
            console.log(`${elm.name || elm.slug} decompressed`)
          )
        },
        () => {
          console.log(`${elm.name || elm.slug} download failed`)
        }
      )
    })
    fs.readdir(pluginSrc, { withFileTypes: true }, (err, dirents) => {
      if (err) {
        console.error(err)
        return
      }
      dirents.forEach(dirent => {
        const fp = path.join(pluginSrc, dirent.name)
        if (!dirent.isDirectory() && /.*\.zip$/.test(fp)) {
          decompress(fp, pluginDist).then(() =>
            console.log(`${dirent.name} decompressed`)
          )
        }
      })
    })
    resolve()
  })
}

module.exports = InstallPlugins
