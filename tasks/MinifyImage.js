const gulp = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')

const MinifyImage = (src, dist) => {
  return gulp
    .src(src)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'MINIFY IMAGE Error: Line <%= error.line %>',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(changed(dist))
    .pipe(
      imagemin([
        pngquant({
          quality: [0.65, 0.8],
          speed: 1
        }),
        mozjpeg({
          quality: 85,
          progressive: true
        }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle()
      ])
    )
    .pipe(gulp.dest(dist))
}

module.exports = MinifyImage
