const commander = require('commander')
const imagemin = require('imagemin')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const { extendDefaultPlugins } = require('svgo')
const path = require('path')

const src = [
  `${commander.parse(process.argv).args[0]}/**/*.{jpg,jpeg,gif,png,svg}`,
]
const destination = path.join(
  __dirname,
  `../${commander.parse(process.argv).args[1]}`
)

imagemin(src, {
  destination,
  plugins: [
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
