'use strict';

var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    sourcemap    = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    server       = require('browser-sync').create(),
    del          = require('del'),
    sass         = require('gulp-sass'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csso         = require('gulp-csso');

gulp.task('css', function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', gulp.series('css'));
  gulp.watch('source/js/*.js', gulp.series('copy', 'refresh'));
  gulp.watch('source/*.html', gulp.series('copy', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('copy', function () {
  return gulp.src([
    'source/js/**',
    'source/*.html',
    'source/img/**',
    'source/css/**',
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'copy', 'css'));
gulp.task('start', gulp.series('build', 'server'));
