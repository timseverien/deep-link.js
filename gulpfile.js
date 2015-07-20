var gulp = require('gulp'),
	bump = require('gulp-bump'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify');

gulp.task('bump', function() {
	return gulp.src(['./bower.json', './package.json'])
	.pipe(bump())
	.pipe(gulp.dest('.'));
});

gulp.task('build', function() {
	return gulp.src([
		'bower_components/visibly.js/visibly.js',
		'src/**/*.js'
	])

	// Build
	.pipe(concat('deep-link.js'))
	.pipe(gulp.dest('build'))

	// Minify
	.pipe(uglify({ preserveComments: 'some' }))
	.pipe(rename('deep-link.min.js'))
	.pipe(gulp.dest('build'));
});
