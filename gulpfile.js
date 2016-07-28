const gulp = require('gulp');
const lambda = require('gulp-awslambda');
const zip = require('gulp-zip');

gulp.task('default', () =>
  gulp.src('build/bundle.js')
    .pipe(zip('build/build.zip'))
    .pipe(lambda('log-entry'))
    .pipe(gulp.dest('.')));
