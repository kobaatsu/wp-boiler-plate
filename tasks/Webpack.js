const gulp = require('gulp')
const wp = require('webpack')
const wpStream = require('webpack-stream')

const webpack = (src, dist, config) => {
  return gulp
    .src(src)
    .pipe(
      wpStream(config, wp, (err, stats) => {
        if (err) {
          this.emit('end')
        }
        console.log(stats.toString({}))
      })
    )
    .pipe(gulp.dest(dist))
}
module.exports = webpack
