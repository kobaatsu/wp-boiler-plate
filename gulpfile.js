const gulp = require('gulp')

const tasks = require('./tasks')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const eslint = require('gulp-eslint')
const eslintIfFixed = require('gulp-eslint-if-fixed')

const wpConfig = require('./webpack.config')

const SRC_ROOT = 'src'
const DIST = 'theme'

const SRC = {
  sass: [
    `${SRC_ROOT}/**/*.{sass,scss}`,
    `!${SRC_ROOT}/**/_*.{sass,scss}`,
    `!${SRC_ROOT}/**/_**/**/*.{sass,scss}`
  ],
  js: [
    `${SRC_ROOT}/**/*.js`,
    `!${SRC_ROOT}/**/_*.js`,
    `!${SRC_ROOT}/**/_**/**/*.js`
  ],
  image: [
    `${SRC_ROOT}/**/*.{gif,jpg,jpeg,png,svg}`,
    `!${SRC_ROOT}/**/_*.{gif,jpg,jpeg,png,svg}`,
    `!${SRC_ROOT}/**/_**/**/*.{gif,jpg,jpeg,png,svg}`
  ]
}

const WATCH = {
  sass: [`${SRC_ROOT}/**/*.scss`],
  js: [`${SRC_ROOT}/**/*.js`],
  image: [`${SRC_ROOT}/**/*.{gif,jpg,jpeg,png,svg}`]
}

const PORT = '8080'

const PKG = require('./package.json')
const PACKAGE_DATA = { pkg: PKG }

const BROWSERS = [
  `http://localhost:${PORT}`,
  `http://localhost:${PORT}/wp-admin/`
]

const LIB = []

const installPlugins = () => tasks.InstallPlugins()
exports.installPlugins = installPlugins

const open = () => tasks.Open(BROWSERS)
exports.open = open

const init = cb => {
  LIB.forEach(elm => tasks.Copy(elm.src, `${DIST}/${elm.dist}`))
  cb()
}
exports.init = init

const templateStyle = () =>
  tasks.TemplateHeader(PACKAGE_DATA, `${DIST}/style.css`, DIST)
exports.templateStyle = templateStyle

const css = () => tasks.CompileSass(SRC.sass, DIST)
exports.css = css

const wpStyle = gulp.series(css, templateStyle)
exports.wpStyle = wpStyle

const js = cb => {
  wpConfig.mode = 'development'
  wpConfig.devtool = 'inline-source-map'
  tasks.Webpack(SRC.js, `${DIST}/asset/js`, wpConfig)
  cb()
}
exports.js = js

const jsDist = cb => {
  wpConfig.mode = 'production'
  wpConfig.devtool = 'eval'
  tasks.Webpack(SRC.js, `${DIST}/asset/js`, wpConfig)
  cb()
}
exports.jsDist = jsDist

const jsLint = () => {
  return gulp
    .src(SRC.js)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'JS LINT',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(
      eslint({
        useEslintrc: true,
        fix: true
      })
    )
    .pipe(eslint.format())
    .pipe(eslintIfFixed(SRC.js))
    .pipe(eslint.failAfterError())
}
exports.jsLint = jsLint

const minifyImage = cb => {
  tasks.MinifyImage(SRC.image, DIST)
  cb()
}
exports.minifyImage = minifyImage

const dist = gulp.series(init, gulp.parallel(css, js, minifyImage))
exports.dist = dist

const watch = cb => {
  gulp.watch(WATCH.sass, css)
  gulp.watch(WATCH.image, minifyImage)
  cb()
}
exports.watch = watch

const defaultTask = gulp.series(dist, watch, open)
exports.default = defaultTask
