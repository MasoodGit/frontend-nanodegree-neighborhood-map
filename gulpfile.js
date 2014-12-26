var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');

/**
 * Gulp main task to build the production version of the app.
 */
gulp.task('build', ['html', 'css', 'js', 'img']);

/**
 * Minify HTML files.
 */
gulp.task('html', function () {
	gulp.src(['./**/*.html', '!node_modules/**/*.html'])
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
			minifyJs: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest('build'));
});

