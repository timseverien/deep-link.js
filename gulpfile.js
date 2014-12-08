var gulp = require('gulp'),
	bump = require('gulp-bump'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

gulp.task('bump', function() {
	gulp.src(['./bower.json', './package.json'])
	.pipe(bump())
	.pipe(gulp.dest('./'));
});

gulp.task('build', function() {
	gulp.src('deep-link.js')
	.pipe(uglify())
	.pipe(rename('deep-link.min.js'))
	.pipe(gulp.dest('./'));
});