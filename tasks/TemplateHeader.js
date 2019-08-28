const gulp = require('gulp')
const header = require('gulp-header')

const BANNER = `/*
  Theme Name: <%= pkg.name %>
  Theme URI: <%= pkg.homepage %>
  Author: <%= pkg.author %>
  Author URI: <%= pkg.homepage %>
  Description: <%= pkg.description %>
  Version: <%= pkg.version %>
*/`

const TemplateHeader = (data, src, dist) => {
  return gulp
    .src(src)
    .pipe(header(BANNER, data))
    .pipe(gulp.dest(dist))
}

module.exports = TemplateHeader
