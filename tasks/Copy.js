const gulp = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const Copy = (src, dist) => {
  console.log(`COPY ${src} -> ${dist}`)
  return gulp
    .src(src)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'COPY Error: Line <%= error.line %>',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(gulp.dest(dist))
}

module.exports = Copy
