var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var gulp = require('gulp');

gulp.task('browserify', function() {
	var bundleStream = browserify('./bo.js').bundle();
	return bundleStream
		.pipe(source('bo.js'))
		.pipe(streamify(uglify()))
		.pipe(rename('bergenopen.js'))
		.pipe(gulp.dest('./'));
});
gulp.task('less', function() {
	return gulp.src('bergenopen.less')
		.pipe(less())
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('bo.js', ['browserify']);
	gulp.watch('bergenopen.less', ['less']);
});