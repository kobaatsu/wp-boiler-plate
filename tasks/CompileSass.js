const gulp = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')

const CompileSass = (src, dist) => {
  return gulp
    .src(src)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'STYLUS Error: Line <%= error.line %>',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(
      sass({
        indentType: 'space',
        indentWidth: 2,
        outputStyle: 'expanded'
      })
    )
    .pipe(postcss([autoprefixer(), mqpacker({ sort: true })]))
    .pipe(gulp.dest(dist))
}

module.exports = CompileSass
