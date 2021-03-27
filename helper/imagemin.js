const commander = require('commander')
const imagemin = require('imagemin-keep-folder')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const { extendDefaultPlugins } = require('svgo')

const src = [
  `${commander.parse(process.argv).args[0]}/**/*.{jpg,jpeg,gif,png,svg}`,
]

imagemin(src, {
  use: [
    imageminGifsicle(),
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [0.65, 0.8] }),
    imageminSvgo({
      plugins: extendDefaultPlugins([{ name: 'cleanupIDs', active: false }]),
    }),
  ],
}).then(() => {
  console.log('image optimized')
})
